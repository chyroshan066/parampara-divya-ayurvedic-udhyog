import { SignJWT, jwtVerify } from "jose";
import crypto from "crypto";
import type { NextRequest } from "next/server";
import type { CustomerSessionPayload } from "@/types/customer";

const encoder = new TextEncoder();

function getSecretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      "JWT_SECRET is not set. Add a long random string to .env (see .env.example)."
    );
  }
  return encoder.encode(secret);
}

// Deliberately a different cookie name from ADMIN_SESSION_COOKIE — a
// customer and an admin can be logged in on the same browser at once
// without colliding, and each middleware only ever reads its own cookie.
export const CUSTOMER_SESSION_COOKIE = "customer_session";
export const CUSTOMER_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days
export const RESET_TOKEN_MAX_AGE_MINUTES = 60; // 1 hour

export async function signCustomerSessionToken(payload: CustomerSessionPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${CUSTOMER_SESSION_MAX_AGE_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifyCustomerSessionToken(
  token: string
): Promise<CustomerSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload as unknown as CustomerSessionPayload;
  } catch {
    return null;
  }
}

/**
 * Reads and verifies the customer session cookie directly off a
 * NextRequest — same pattern as getAdminSession in utils/auth.ts.
 * Useful both from route handlers and from layout.tsx (via the request
 * cookies) to decide what the header should show.
 */
export async function getCustomerSession(
  request: NextRequest
): Promise<CustomerSessionPayload | null> {
  const token = request.cookies.get(CUSTOMER_SESSION_COOKIE)?.value;
  return token ? verifyCustomerSessionToken(token) : null;
}

/**
 * Password reset tokens: generate a random value, send the RAW token to
 * the customer by email, and only ever store its SHA-256 hash in the
 * database. A leaked database then never exposes a usable reset link —
 * same reasoning as hashing the password itself rather than storing it
 * in plain text.
 */
export function generateResetToken() {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashResetToken(rawToken);
  const expiresAt = new Date(Date.now() + RESET_TOKEN_MAX_AGE_MINUTES * 60 * 1000);
  return { rawToken, tokenHash, expiresAt };
}

export function hashResetToken(rawToken: string) {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}
