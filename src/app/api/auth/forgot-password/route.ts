import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sql } from "@/utils/db";
import { generateResetToken } from "@/utils/customer-auth";
import { sendPasswordResetEmail } from "@/utils/mail";

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

const GENERIC_MESSAGE =
  "If an account exists for that email, we've sent password reset instructions.";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = forgotPasswordSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const email = parsed.data.email.toLowerCase();

  const rows = await sql`
    select id from customers where email = ${email} limit 1
  `;
  const customer = rows[0] as { id: string } | undefined;

  // Always respond the same way whether or not the account exists, so
  // this endpoint can't be used to check which emails are registered —
  // the actual email (or lack of one) is the only signal that differs.
  if (customer) {
    const { rawToken, tokenHash, expiresAt } = generateResetToken();

    await sql`
      update customers
      set reset_token_hash = ${tokenHash},
          reset_token_expires_at = ${expiresAt.toISOString()}
      where id = ${customer.id}
    `;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;
    const resetUrl = `${baseUrl}/reset-password?token=${rawToken}&email=${encodeURIComponent(
      email
    )}`;

    await sendPasswordResetEmail(email, resetUrl);
  }

  return NextResponse.json({ success: true, message: GENERIC_MESSAGE });
}
