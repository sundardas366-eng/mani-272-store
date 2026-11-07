/**
 * ============================================================
 * MANI 272 STORE — Automated Payment Verification Test Suite
 * ============================================================
 * Tests:
 *   1. Valid payment verification (matches UTR, amount >= required, recent email)
 *   2. Wrong / Insufficient amount (email amount < plan price)
 *   3. Reused UTR (replay attack prevention / UNIQUE constraint)
 *   4. Old email (> 24 hours old)
 *   5. Fake / Invalid UTR format (< 12 digits or letters)
 *   6. Rate Limiter (sliding window blocks after 5 attempts per IP per hour)
 */

import {
  parseBankCreditAlert,
  verifyCreditAlert,
  isValidUtrFormat,
  RawEmail,
} from "../src/lib/bankParsers";
import { checkRateLimit, resetRateLimit } from "../src/lib/rateLimiter";
import {
  hasUtr,
  getKeyByUtr,
  recordVerifiedPayment,
} from "../src/lib/paymentStore";
import {
  calculatePlanDays,
  generateLicenseKey,
  calculateKeyExpiration,
} from "../src/lib/deliverProduct";

let passedCount = 0;
let failedCount = 0;

function assert(condition: boolean, testName: string, failureDetail?: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passedCount++;
  } else {
    console.error(`  ❌ FAIL: ${testName} - ${failureDetail || "Assertion failed"}`);
    failedCount++;
  }
}

async function runTests() {
  console.log("\n========================================================");
  console.log("⚡ MANI 272 STORE — PAYMENT VERIFICATION SYSTEM TESTS");
  console.log("========================================================\n");

  const testUtr = "431289567123";
  const now = new Date();

  // ------------------------------------------------------------------
  // TEST 1: Valid Payment Verification
  // ------------------------------------------------------------------
  console.log("🔹 TEST 1: Valid Payment with Matching UTR & Full Amount");
  const validEmail: RawEmail = {
    from: "no-reply@famapp.in",
    subject: "Money Added in FamX Account",
    body: `You received ₹499 in your FamX account from customer. UPI Ref No: ${testUtr}. Enjoy hassle free gaming!`,
    date: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
  };

  const checkValid = verifyCreditAlert(validEmail, testUtr, 349);
  assert(checkValid.valid === true, "Valid credit alert correctly verified");
  assert(checkValid.parsed?.amountINR === 499, "Parsed exact amount ₹499 correctly");
  assert(checkValid.parsed?.utr === testUtr, "Parsed exact 12-digit UTR correctly");

  // ------------------------------------------------------------------
  // TEST 2: Wrong / Insufficient Amount
  // ------------------------------------------------------------------
  console.log("\n🔹 TEST 2: Insufficient Amount (Paid less than required plan price)");
  const lowAmountEmail: RawEmail = {
    from: "alerts@hdfcbank.net",
    subject: "Alert: UPI Transaction Inward",
    body: `Dear Customer, your A/C has been credited with INR 100.00 via UPI Ref: 998877665544.`,
    date: new Date(Date.now() - 5 * 60 * 1000),
  };

  const checkLow = verifyCreditAlert(lowAmountEmail, "998877665544", 649); // required ₹649, paid ₹100
  assert(checkLow.valid === false, "Verification rejected insufficient payment");
  assert(
    checkLow.error?.includes("less than plan price") === true,
    "Correct error message for underpayment"
  );

  // ------------------------------------------------------------------
  // TEST 3: Reused UTR (Replay Attack Prevention)
  // ------------------------------------------------------------------
  console.log("\n🔹 TEST 3: Reused UTR / Replay Attack Block");
  const uniqueUtr = `9876543210${Math.floor(10 + Math.random() * 89)}`;

  // First time recording
  await recordVerifiedPayment(
    {
      utr: uniqueUtr,
      amount: 119,
      amountPaise: 11900,
      plan_days: 1,
      status: "verified",
      customer_email: "test@mani272.com",
      created_at: new Date().toISOString(),
    },
    {
      key: generateLicenseKey(1),
      utr: uniqueUtr,
      expires_at: calculateKeyExpiration(1).toISOString(),
      plan_days: 1,
      created_at: new Date().toISOString(),
    }
  );

  assert(await hasUtr(uniqueUtr), "First payment successfully recorded with UNIQUE UTR");

  // Attempting second time with the SAME UTR must throw
  let replayBlocked = false;
  try {
    await recordVerifiedPayment(
      {
        utr: uniqueUtr,
        amount: 119,
        amountPaise: 11900,
        plan_days: 1,
        status: "verified",
        customer_email: "attacker@gmail.com",
        created_at: new Date().toISOString(),
      },
      {
        key: generateLicenseKey(1),
        utr: uniqueUtr,
        expires_at: calculateKeyExpiration(1).toISOString(),
        plan_days: 1,
        created_at: new Date().toISOString(),
      }
    );
  } catch (err: any) {
    replayBlocked = true;
  }
  assert(replayBlocked, "Second submission of same UTR strictly blocked by UNIQUE constraint");

  // ------------------------------------------------------------------
  // TEST 4: Old Email (> 24 Hours)
  // ------------------------------------------------------------------
  console.log("\n🔹 TEST 4: Old Credit Email (> 24 Hours)");
  const oldEmail: RawEmail = {
    from: "no-reply@famapp.in",
    subject: "Money Added in FamX Account",
    body: `You received ₹1599 in your FamX account. UTR: 112233445566.`,
    date: new Date(Date.now() - 26 * 60 * 60 * 1000), // 26 hours ago
  };

  const checkOld = verifyCreditAlert(oldEmail, "112233445566", 1599);
  assert(checkOld.valid === false, "Old email (> 24h) rejected");
  assert(checkOld.error?.includes("older than 24 hours") === true, "Correct 24-hour expiration error");

  // ------------------------------------------------------------------
  // TEST 5: Fake / Invalid UTR Format
  // ------------------------------------------------------------------
  console.log("\n🔹 TEST 5: Fake or Malformed UTR Format");
  assert(isValidUtrFormat("12345") === false, "5-digit string rejected");
  assert(isValidUtrFormat("1234567890123") === false, "13-digit string rejected");
  assert(isValidUtrFormat("43128912345A") === false, "Alphanumeric string rejected");
  assert(isValidUtrFormat("431289123456") === true, "Exact 12 numeric digits accepted");

  // ------------------------------------------------------------------
  // TEST 6: Rate Limiting (5 Attempts per IP per Hour)
  // ------------------------------------------------------------------
  console.log("\n🔹 TEST 6: Rate Limiting (Max 5 attempts / IP / hour)");
  const testIp = "192.168.1.100";
  resetRateLimit(testIp);

  for (let i = 1; i <= 5; i++) {
    const res = checkRateLimit(testIp);
    assert(res.allowed === true, `Attempt #${i} allowed (Remaining: ${res.remaining})`);
  }

  // 6th attempt must be blocked
  const resBlocked = checkRateLimit(testIp);
  assert(resBlocked.allowed === false, "6th attempt blocked by rate limiter");
  assert(resBlocked.retryAfterSeconds > 0, `Retry-After header calculated (${resBlocked.retryAfterSeconds}s)`);

  // ------------------------------------------------------------------
  // TEST 7: Duration & License Key Engine
  // ------------------------------------------------------------------
  console.log("\n🔹 TEST 7: Plan Days & Key Generation");
  assert(calculatePlanDays(119) === 1, "₹119 mapped to 1 day");
  assert(calculatePlanDays(349) === 3, "₹349 mapped to 3 days");
  assert(calculatePlanDays(649) === 7, "₹649 mapped to 7 days");
  assert(calculatePlanDays(1599) === 30, "₹1599 mapped to 30 days");
  assert(calculatePlanDays(3999) === 3650, "₹3999 mapped to lifetime (3650 days)");

  const key1D = generateLicenseKey(1);
  assert(key1D.startsWith("MANI-1D-"), `1-Day key prefix correct: ${key1D}`);

  const key30D = generateLicenseKey(30);
  assert(key30D.startsWith("MANI-30D-"), `30-Day key prefix correct: ${key30D}`);

  console.log("\n========================================================");
  console.log(`🎉 TEST SUMMARY: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log("========================================================\n");

  if (failedCount > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
