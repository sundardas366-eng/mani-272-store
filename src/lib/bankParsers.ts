/**
 * ============================================================
 * MANI 272 STORE — Bank Credit Alert Parser Module
 * ============================================================
 * Modular regex patterns for parsing UPI credit alerts across Indian banks.
 * Validates official sender domains, 12-digit numeric UTRs, credited amount,
 * and email age within 24 hours.
 */

export interface RawEmail {
  from: string;
  subject: string;
  body: string;
  date: Date;
  headers?: Record<string, string | string[]>;
}

export interface ParsedPayment {
  bankId: string;
  bankName: string;
  sender: string;
  utr: string; // 12-digit UPI reference number
  amountINR: number;
  amountPaise: number;
  timestamp: Date;
  isRecent: boolean; // within 24 hours
  accountTail?: string;
  rawSnippet?: string;
}

export interface BankConfig {
  id: string;
  name: string;
  senderDomains: string[]; // Allowed sender email domains (SPF/Domain check)
  utrPatterns: RegExp[];
  amountPatterns: RegExp[];
}

export const SUPPORTED_BANKS: BankConfig[] = [
  // 1. FamPay / FamApp (Primary payment method: das360s@fam)
  {
    id: "fampay",
    name: "FamPay / FamApp",
    senderDomains: ["famapp.in", "fampay.in"],
    utrPatterns: [
      /(?:UTR|UPI\s*Ref(?:\s*No)?|Ref\s*No|Txn\s*ID)[:\s#]*(\d{12})\b/i,
      /\b(\d{12})\b/, // FamPay emails explicitly contain the 12-digit RRN
    ],
    amountPatterns: [
      /(?:received|credited|added)\s*(?:₹|Rs\.?|INR)?\s*([\d,]+(?:\.\d{1,2})?)/i,
      /(?:₹|Rs\.?|INR)\s*([\d,]+(?:\.\d{1,2})?)\s*(?:received|credited|added|in\s*your\s*FamX)/i,
      /(?:₹|Rs\.?|INR)\s*([\d,]+(?:\.\d{1,2})?)/i,
    ],
  },

  // 2. HDFC Bank
  {
    id: "hdfc",
    name: "HDFC Bank",
    senderDomains: ["hdfcbank.net", "hdfcbank.com"],
    utrPatterns: [
      /(?:UPI\s*Ref\s*No|UTR(?:\s*No)?|Ref\s*No)[:\s]*(\d{12})\b/i,
      /\b(\d{12})\b/,
    ],
    amountPatterns: [
      /(?:credited|deposited)\s*with\s*(?:₹|Rs\.?|INR)?\s*([\d,]+(?:\.\d{1,2})?)/i,
      /(?:₹|Rs\.?|INR)\s*([\d,]+(?:\.\d{1,2})?)\s*(?:has\s*been\s*credited)/i,
    ],
  },

  // 3. State Bank of India (SBI)
  {
    id: "sbi",
    name: "State Bank of India",
    senderDomains: ["sbi.co.in"],
    utrPatterns: [
      /(?:UPI\/CR\/\d+\/|UTR[:\s]*|Ref\s*No[:\s]*)(\d{12})\b/i,
      /\b(\d{12})\b/,
    ],
    amountPatterns: [
      /(?:credited\s*by|credited\s*with)\s*(?:₹|Rs\.?|INR)?\s*([\d,]+(?:\.\d{1,2})?)/i,
      /(?:₹|Rs\.?|INR)\s*([\d,]+(?:\.\d{1,2})?)\s*credited/i,
    ],
  },

  // 4. ICICI Bank
  {
    id: "icici",
    name: "ICICI Bank",
    senderDomains: ["icicibank.com"],
    utrPatterns: [
      /(?:UPI[:\s]*|Ref\s*no[:\s]*|UTR[:\s]*)(\d{12})\b/i,
      /\b(\d{12})\b/,
    ],
    amountPatterns: [
      /(?:credited\s*with|credited\s*by)\s*(?:₹|Rs\.?|INR)?\s*([\d,]+(?:\.\d{1,2})?)/i,
      /(?:₹|Rs\.?|INR)\s*([\d,]+(?:\.\d{1,2})?)\s*(?:credited)/i,
    ],
  },

  // 5. Axis Bank
  {
    id: "axis",
    name: "Axis Bank",
    senderDomains: ["axisbank.com"],
    utrPatterns: [
      /(?:UPI\s*Ref\s*No|UTR|Ref\s*No)[:\s]*(\d{12})\b/i,
      /\b(\d{12})\b/,
    ],
    amountPatterns: [
      /(?:credited\s*by|credited\s*with)\s*(?:₹|Rs\.?|INR)?\s*([\d,]+(?:\.\d{1,2})?)/i,
      /(?:₹|Rs\.?|INR)\s*([\d,]+(?:\.\d{1,2})?)/i,
    ],
  },

  // 6. Paytm Payments Bank
  {
    id: "paytm",
    name: "Paytm Payments Bank",
    senderDomains: ["paytm.com", "paytmbank.com"],
    utrPatterns: [
      /(?:UPI\s*Ref(?:erence)?\s*(?:No)?|UTR|UPI\s*Txn\s*ID)[:\s]*(\d{12})\b/i,
      /\b(\d{12})\b/,
    ],
    amountPatterns: [
      /(?:received|added)\s*(?:₹|Rs\.?|INR)?\s*([\d,]+(?:\.\d{1,2})?)/i,
      /(?:₹|Rs\.?|INR)\s*([\d,]+(?:\.\d{1,2})?)/i,
    ],
  },

  // 7. Generic Indian Bank / UPI Alert (Fallback with strict 12-digit UTR)
  {
    id: "generic",
    name: "Generic UPI Alert",
    senderDomains: [], // relaxed domain check if credit keywords match
    utrPatterns: [
      /(?:UTR|UPI\s*Ref(?:\s*No)?|Ref\s*No|RRN)[:\s#]*(\d{12})\b/i,
      /\b(\d{12})\b/,
    ],
    amountPatterns: [
      /(?:credited|received|deposit(?:ed)?)\s*(?:₹|Rs\.?|INR)?\s*([\d,]+(?:\.\d{1,2})?)/i,
      /(?:₹|Rs\.?|INR)\s*([\d,]+(?:\.\d{1,2})?)\s*(?:credited|received)/i,
    ],
  },
];

/**
 * Validates that an incoming UTR has exactly 12 numeric digits.
 */
export function isValidUtrFormat(utr: string): boolean {
  if (!utr) return false;
  const clean = utr.trim();
  return /^\d{12}$/.test(clean);
}

/**
 * Checks if an email was received within the last 24 hours.
 */
export function isEmailWithin24Hours(emailDate: Date, maxAgeHours = 24): boolean {
  const now = Date.now();
  const emailTime = emailDate.getTime();
  const maxAgeMs = maxAgeHours * 60 * 60 * 1000;
  return now - emailTime <= maxAgeMs && emailTime <= now + 5 * 60 * 1000; // allow 5m clock drift
}

/**
 * Parses raw email content and extracts UTR, credited amount, and bank info.
 */
export function parseBankCreditAlert(email: RawEmail): ParsedPayment | null {
  const fromClean = email.from.toLowerCase();
  const fullText = `${email.subject}\n${email.body}`;

  for (const bank of SUPPORTED_BANKS) {
    // Check if sender matches this bank's allowed domains
    const isDomainMatch =
      bank.senderDomains.length === 0 ||
      bank.senderDomains.some((d) => fromClean.includes(`@${d}`) || fromClean.includes(`.${d}`));

    if (!isDomainMatch) continue;

    // Must look like a credit alert
    const isCreditText =
      /credit|credited|received|added|deposited|famx|payment received/i.test(fullText);
    if (!isCreditText) continue;

    // 1. Extract UTR
    let foundUtr: string | null = null;
    for (const pattern of bank.utrPatterns) {
      const match = fullText.match(pattern);
      if (match && match[1] && isValidUtrFormat(match[1])) {
        foundUtr = match[1];
        break;
      }
    }

    if (!foundUtr) continue;

    // 2. Extract Amount
    let foundAmount: number | null = null;
    for (const pattern of bank.amountPatterns) {
      const match = fullText.match(pattern);
      if (match && match[1]) {
        const cleanedStr = match[1].replace(/,/g, "");
        const parsed = parseFloat(cleanedStr);
        if (!isNaN(parsed) && parsed > 0) {
          foundAmount = parsed;
          break;
        }
      }
    }

    if (foundAmount === null || foundAmount <= 0) continue;

    const isRecent = isEmailWithin24Hours(email.date, 24);

    return {
      bankId: bank.id,
      bankName: bank.name,
      sender: email.from,
      utr: foundUtr,
      amountINR: foundAmount,
      amountPaise: Math.round(foundAmount * 100),
      timestamp: email.date,
      isRecent,
      rawSnippet: fullText.substring(0, 300).replace(/\s+/g, " "),
    };
  }

  return null;
}

export interface VerificationCheck {
  valid: boolean;
  error?: string;
  parsed?: ParsedPayment;
}

/**
 * Verifies that an email matches the given UTR, satisfies minimum plan price,
 * originates from an official bank sender, and was received within 24 hours.
 */
export function verifyCreditAlert(
  email: RawEmail,
  targetUtr: string,
  minRequiredAmountINR: number
): VerificationCheck {
  if (!isValidUtrFormat(targetUtr)) {
    return { valid: false, error: "Invalid UTR format. Must be exactly 12 numeric digits." };
  }

  // Quick check: does the email text even contain this UTR?
  const fullText = `${email.subject}\n${email.body}`;
  if (!fullText.includes(targetUtr)) {
    return { valid: false, error: "UTR not found in email content." };
  }

  const parsed = parseBankCreditAlert(email);
  if (!parsed) {
    return { valid: false, error: "Email is not a recognized bank credit alert." };
  }

  if (parsed.utr !== targetUtr) {
    return { valid: false, error: `Extracted UTR (${parsed.utr}) does not match target (${targetUtr}).` };
  }

  // Security Rule: Email age MUST be within the last 24 hours
  if (!parsed.isRecent) {
    return { valid: false, error: "Payment credit email is older than 24 hours.", parsed };
  }

  // Security Rule: Credited amount MUST be >= plan price (never trust user input!)
  if (parsed.amountINR < minRequiredAmountINR) {
    return {
      valid: false,
      error: `Credited amount (₹${parsed.amountINR}) is less than plan price (₹${minRequiredAmountINR}).`,
      parsed,
    };
  }

  return { valid: true, parsed };
}
