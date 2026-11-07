/**
 * ============================================================
 * MANI 272 STORE — IP Rate Limiter
 * ============================================================
 * Enforces rate limiting on payment verification attempts.
 * Maximum 5 attempts per IP per hour to prevent brute-force attacks.
 */

interface RateLimitRecord {
  timestamps: number[];
}

// In-memory sliding window store
const rateLimitMap = new Map<string, RateLimitRecord>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour (60 minutes)

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  totalLimit: number;
  retryAfterSeconds: number;
}

/**
 * Checks and records an attempt for the given IP address.
 */
export function checkRateLimit(ip: string): RateLimitResult {
  const cleanIp = ip ? ip.trim() : "unknown-ip";
  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  let record = rateLimitMap.get(cleanIp);
  if (!record) {
    record = { timestamps: [] };
    rateLimitMap.set(cleanIp, record);
  }

  // Filter out attempts older than 1 hour
  record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

  if (record.timestamps.length >= MAX_ATTEMPTS) {
    // Oldest attempt inside window determines when the next slot opens
    const oldest = record.timestamps[0];
    const retryAfterMs = oldest + WINDOW_MS - now;
    const retryAfterSeconds = Math.max(1, Math.ceil(retryAfterMs / 1000));

    return {
      allowed: false,
      remaining: 0,
      totalLimit: MAX_ATTEMPTS,
      retryAfterSeconds,
    };
  }

  // Record this attempt
  record.timestamps.push(now);

  const remaining = Math.max(0, MAX_ATTEMPTS - record.timestamps.length);
  return {
    allowed: true,
    remaining,
    totalLimit: MAX_ATTEMPTS,
    retryAfterSeconds: 0,
  };
}

/**
 * Resets rate limit for a specific IP (e.g. for testing or admin unlock).
 */
export function resetRateLimit(ip: string): void {
  rateLimitMap.delete(ip);
}

/**
 * Helper to extract client IP from Next.js request headers.
 */
export function getClientIp(headers: Headers): string {
  const xForwardedFor = headers.get("x-forwarded-for");
  if (xForwardedFor) {
    const first = xForwardedFor.split(",")[0].trim();
    if (first) return first;
  }

  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  const cfConnectingIp = headers.get("cf-connecting-ip");
  if (cfConnectingIp) return cfConnectingIp.trim();

  return "127.0.0.1";
}
