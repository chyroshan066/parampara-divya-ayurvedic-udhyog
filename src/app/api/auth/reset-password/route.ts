import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sql } from "@/utils/db";
import { hashPassword } from "@/utils/auth";
import { hashResetToken } from "@/utils/customer-auth";

const resetPasswordSchema = z.object({
  email: z.string().email(),
  token: z.string().min(1),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const INVALID_TOKEN_MESSAGE =
  "This reset link is invalid or has expired. Please request a new one.";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = resetPasswordSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error:
          parsed.error.issues[0]?.message ||
          "Please check your details and try again.",
      },
      { status: 400 }
    );
  }

  const { email, token, password } = parsed.data;
  const tokenHash = hashResetToken(token);

  const rows = await sql`
    select id, reset_token_hash, reset_token_expires_at
    from customers
    where email = ${email.toLowerCase()}
    limit 1
  `;
  const customer = rows[0] as
    | {
        id: string;
        reset_token_hash: string | null;
        reset_token_expires_at: string | null;
      }
    | undefined;

  const isExpired =
    !customer?.reset_token_expires_at ||
    new Date(customer.reset_token_expires_at).getTime() < Date.now();

  if (
    !customer ||
    !customer.reset_token_hash ||
    customer.reset_token_hash !== tokenHash ||
    isExpired
  ) {
    return NextResponse.json({ error: INVALID_TOKEN_MESSAGE }, { status: 400 });
  }

  const passwordHash = await hashPassword(password);

  await sql`
    update customers
    set password_hash = ${passwordHash},
        reset_token_hash = null,
        reset_token_expires_at = null
    where id = ${customer.id}
  `;

  return NextResponse.json({ success: true });
}
