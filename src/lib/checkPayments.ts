import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";

export interface ParsedPayment {
  amountPaise: number;
  utr: string;
  receivedAt: Date;
  senderName?: string;
  rawSnippet?: string;
}

/**
 * Extracts amount in paise and 12-digit UTR from FamPay email text / HTML.
 */
export function parseFamPayEmail(text: string, date: Date): ParsedPayment | null {
  // Normalize whitespace and non-breaking spaces
  const cleanText = text.replace(/\u00A0/g, " ").replace(/\r\n/g, "\n");

  // Regex for extracting amount (e.g. ₹499.37, INR 499.37, Rs. 499.37, or received 499.37)
  const amountRegex = /(?:₹|INR|Rs\.?)\s*([0-9]+(?:,[0-9]{3})*(?:\.[0-9]{1,2})?)|(?:received|added)\s*(?:₹|INR|Rs\.?)?\s*([0-9]+(?:\.[0-9]{1,2})?)/i;
  const amountMatch = cleanText.match(amountRegex);

  let amountPaise = 0;
  if (amountMatch) {
    const rawVal = (amountMatch[1] || amountMatch[2] || "").replace(/,/g, "");
    const parsedFloat = parseFloat(rawVal);
    if (!isNaN(parsedFloat) && parsedFloat > 0) {
      amountPaise = Math.round(parsedFloat * 100);
    }
  }

  // Regex for 12-digit UPI reference number / UTR / RRN
  const utrRegex = /(?:UTR|UPI\s*(?:Ref|Reference|Txn|Transaction\s*(?:ID|No\.?)|Reference\s*No\.?)|RRN|Ref\s*No\.?)[\s#:.-]*([0-9]{12})\b/i;
  let utrMatch = cleanText.match(utrRegex);

  let utr = "";
  if (utrMatch && utrMatch[1]) {
    utr = utrMatch[1];
  } else {
    // Secondary fallback: find any standalone 12-digit number in the text
    const generic12DigitMatch = cleanText.match(/\b([0-9]{12})\b/);
    if (generic12DigitMatch) {
      utr = generic12DigitMatch[1];
    }
  }

  // Extract optional sender name (e.g. "from John Doe" or "received from ...")
  const senderMatch = cleanText.match(/(?:from|by)\s+([A-Za-z\s]{3,30})(?:\s+via|\s+to|\s+on|\n|\.|\!)/i);
  const senderName = senderMatch ? senderMatch[1].trim() : undefined;

  if (amountPaise > 0 && utr.length === 12) {
    return {
      amountPaise,
      utr,
      receivedAt: date,
      senderName,
      rawSnippet: cleanText.substring(0, 300),
    };
  }

  return null;
}

/**
 * Connects to Gmail via IMAP and reads recent FamPay transaction confirmation emails.
 */
export async function readFamPayEmails(lookbackMinutes = 60): Promise<ParsedPayment[]> {
  const user = process.env.GMAIL_USER?.trim();
  const pass = process.env.GMAIL_APP_PASSWORD?.trim()?.replace(/\s+/g, "");

  if (!user || !pass) {
    console.warn("[IMAP] GMAIL_USER or GMAIL_APP_PASSWORD is not set. Skipping FamPay email sync.");
    return [];
  }

  const client = new ImapFlow({
    host: "imap.gmail.com",
    port: 993,
    secure: true,
    auth: {
      user,
      pass,
    },
    logger: false,
  });

  const payments: ParsedPayment[] = [];
  const sinceDate = new Date(Date.now() - lookbackMinutes * 60 * 1000);

  try {
    await client.connect();

    // Lock mailbox to prevent race conditions during message fetch
    const lock = await client.getMailboxLock("INBOX");
    try {
      // Search for emails from FamPay
      const searchCriteria = {
        since: sinceDate,
      };

      const messages = client.fetch(searchCriteria, {
        source: true,
        envelope: true,
        internalDate: true,
      });

      for await (const message of messages) {
        try {
          const fromAddress = message.envelope?.from?.[0]?.address?.toLowerCase() || "";
          // Check if sender is FamPay or related
          const isFamPay =
            fromAddress.includes("famapp.in") ||
            fromAddress.includes("fampay.in") ||
            fromAddress.includes("fam.in");

          if (!isFamPay) {
            continue;
          }

          if (message.source) {
            const parsed = await simpleParser(message.source);
            const content = (parsed.text || "") + "\n" + (parsed.html || "");
            const emailDate = message.internalDate || message.envelope?.date || new Date();

            const payment = parseFamPayEmail(content, new Date(emailDate));
            if (payment) {
              payments.push(payment);
            }
          }
        } catch (msgErr) {
          console.error("[IMAP] Failed to parse message:", msgErr);
        }
      }
    } finally {
      lock.release();
    }

    await client.logout();
  } catch (err: unknown) {
    console.error("[IMAP] Error reading FamPay emails from Gmail:", err);
  }

  return payments;
}
