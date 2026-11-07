/**
 * ============================================================
 * MANI 272 STORE — Gmail Verification Engine
 * ============================================================
 * Searches and validates bank credit-alert emails for 12-digit UTRs.
 * Supports:
 *   1. Gmail IMAP (via imapflow + mailparser) using sundardas963@gmail.com
 *   2. Gmail REST API (OAuth2 with gmail.readonly scope)
 *
 * Verifies authenticity, SPF/sender domain, email age (< 24 hours),
 * and matches the credited amount against the selected plan price.
 */

import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import {
  RawEmail,
  verifyCreditAlert,
  VerificationCheck,
  isValidUtrFormat,
} from "./bankParsers";

export interface GmailVerifyOptions {
  utr: string;
  minAmountINR: number;
}

export interface GmailVerifyResult {
  verified: boolean;
  error?: string;
  amountINR?: number;
  sender?: string;
  bankName?: string;
  receivedAt?: Date;
  rawSnippet?: string;
}

/**
 * Searches Gmail via IMAP for emails containing the specified UTR.
 */
async function searchViaImap(utr: string): Promise<RawEmail[]> {
  const user =
    process.env.GMAIL_USER ||
    process.env.NEXT_PUBLIC_GMAIL_USER ||
    "sundardas963@gmail.com";
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!pass) {
    console.warn("[Gmail IMAP] GMAIL_APP_PASSWORD not configured in environment.");
    return [];
  }

  const client = new ImapFlow({
    host: "imap.gmail.com",
    port: 993,
    secure: true,
    auth: { user, pass },
    logger: false,
    emitLogs: false,
  });

  const matchingEmails: RawEmail[] = [];

  try {
    await client.connect();
    const lock = await client.getMailboxLock("INBOX");

    try {
      // Look back 24 hours
      const sinceDate = new Date(Date.now() - 24 * 60 * 60 * 1000);

      // Search for messages with the 12-digit UTR in body or subject
      const searchCriteria: any = {
        since: sinceDate,
        body: utr,
      };

      const messages = client.fetch(searchCriteria, {
        source: true,
        envelope: true,
        internalDate: true,
      });

      for await (const msg of messages) {
        if (!msg.source) continue;
        try {
          const parsed = await simpleParser(msg.source);
          matchingEmails.push({
            from: parsed.from?.text || msg.envelope?.from?.[0]?.address || "",
            subject: parsed.subject || msg.envelope?.subject || "",
            body: (parsed.text || "") + "\n" + (parsed.html || ""),
            date: parsed.date
              ? new Date(parsed.date)
              : msg.internalDate
              ? new Date(msg.internalDate)
              : new Date(),
          });
        } catch (parseErr) {
          console.warn("[Gmail IMAP] Failed to parse email message:", parseErr);
        }
      }
    } finally {
      lock.release();
    }

    await client.logout();
  } catch (err) {
    console.error("[Gmail IMAP] Connection/Search failed:", err);
  }

  return matchingEmails;
}

/**
 * Searches Gmail via REST API (OAuth2) for messages matching the UTR.
 */
async function searchViaOAuth(utr: string): Promise<RawEmail[]> {
  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    return [];
  }

  try {
    // 1. Refresh Access Token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    if (!tokenRes.ok) {
      console.warn("[Gmail OAuth] Token refresh failed:", await tokenRes.text());
      return [];
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // 2. Query messages with UTR from the last 24 hours
    // (after:YYYY/MM/DD)
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const dateQuery = `${yesterday.getFullYear()}/${yesterday.getMonth() + 1}/${yesterday.getDate()}`;
    const q = encodeURIComponent(`"${utr}" after:${dateQuery}`);

    const listRes = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${q}&maxResults=5`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!listRes.ok) {
      console.warn("[Gmail OAuth] Message list failed:", await listRes.text());
      return [];
    }

    const listData = await listRes.json();
    if (!listData.messages || listData.messages.length === 0) {
      return [];
    }

    const emails: RawEmail[] = [];

    // 3. Fetch each message payload
    for (const item of listData.messages) {
      const msgRes = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${item.id}?format=full`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (!msgRes.ok) continue;

      const msgData = await msgRes.json();
      const headers = msgData.payload?.headers || [];
      const getHeader = (name: string) =>
        headers.find((h: any) => h.name.toLowerCase() === name.toLowerCase())?.value || "";

      const from = getHeader("From");
      const subject = getHeader("Subject");
      const dateHeader = getHeader("Date");
      const date = dateHeader ? new Date(dateHeader) : new Date(parseInt(msgData.internalDate, 10));

      let body = msgData.snippet || "";
      if (msgData.payload?.body?.data) {
        body += "\n" + Buffer.from(msgData.payload.body.data, "base64").toString("utf-8");
      }

      emails.push({ from, subject, body, date });
    }

    return emails;
  } catch (err) {
    console.error("[Gmail OAuth] Search error:", err);
    return [];
  }
}

/**
 * Core Verification Function:
 * Looks up the UTR in recent Gmail emails (OAuth or IMAP) and validates
 * that it is an authentic bank credit alert with amount >= minAmountINR.
 */
export async function verifyPaymentViaGmail(
  options: GmailVerifyOptions
): Promise<GmailVerifyResult> {
  const { utr, minAmountINR } = options;

  if (!isValidUtrFormat(utr)) {
    return {
      verified: false,
      error: "Invalid UTR format. Must be exactly 12 numeric digits.",
    };
  }

  // 1. Fetch potential matching emails (OAuth first, then IMAP)
  let matchingEmails: RawEmail[] = [];

  const oauthEmails = await searchViaOAuth(utr);
  if (oauthEmails.length > 0) {
    matchingEmails = oauthEmails;
  } else {
    matchingEmails = await searchViaImap(utr);
  }

  if (matchingEmails.length === 0) {
    return {
      verified: false,
      error: "Payment not found yet, try again in a few minutes.",
    };
  }

  // 2. Run verification on matching emails
  let lastCheck: VerificationCheck = {
    valid: false,
    error: "No matching credit alert found for this UTR.",
  };

  for (const email of matchingEmails) {
    const check = verifyCreditAlert(email, utr, minAmountINR);
    if (check.valid && check.parsed) {
      return {
        verified: true,
        amountINR: check.parsed.amountINR,
        sender: check.parsed.sender,
        bankName: check.parsed.bankName,
        receivedAt: check.parsed.timestamp,
        rawSnippet: check.parsed.rawSnippet,
      };
    }
    lastCheck = check;
  }

  return {
    verified: false,
    error: lastCheck.error || "Payment verification failed. Please check UTR and amount.",
  };
}
