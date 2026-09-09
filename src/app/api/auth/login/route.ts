import { NextRequest, NextResponse, after } from "next/server";
import { z } from "zod";
import { sql } from "@/utils/db";
import { verifyPassword } from "@/utils/auth";
import {
  CUSTOMER_SESSION_COOKIE,
  CUSTOMER_SESSION_MAX_AGE_SECONDS,
  signCustomerSessionToken,
} from "@/utils/customer-auth";
import { sendWelcomeBackEmail } from "@/utils/email";
import type { Customer } from "@/types/customer";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please enter a valid email and password." },
      { status: 400 }
    );
  }

  const { email, password } = parsed.data;

  const rows = await sql`
    select id, email, password_hash, first_name, last_name
    from customers
    where email = ${email.toLowerCase()}
    limit 1
  `;
  const customer = rows[0] as Customer | undefined;

  // Deliberately identical error for "no such customer" and "wrong
  // password" — same reasoning as the admin login route.
  if (!customer || !(await verifyPassword(password, customer.password_hash))) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 }
    );
  }

  const token = await signCustomerSessionToken({
    sub: customer.id,
    email: customer.email,
    firstName: customer.first_name,
    lastName: customer.last_name,
  });

  const response = NextResponse.json({ success: true });
  response.cookies.set(CUSTOMER_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: CUSTOMER_SESSION_MAX_AGE_SECONDS,
  });

  // Simple welcome-back note, one per login — see utils/email.ts for why
  // this is deliberately lightweight rather than a full security alert.
  // Login happens far more often than signup/checkout, so this runs via
  // after() rather than being awaited: it doesn't add Resend's latency (or
  // retry backoff) to every sign-in, but — unlike a bare fire-and-forget —
  // Next.js keeps the function alive until it finishes, so it still
  // survives past the response instead of getting silently cut off.
  after(() =>
    sendWelcomeBackEmail({
      firstName: customer.first_name,
      email: customer.email,
    })
  );

  return response;
}