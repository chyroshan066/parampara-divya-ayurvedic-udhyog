import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sql } from "@/utils/db";
import {
  ADMIN_SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  signSessionToken,
  verifyPassword,
} from "@/utils/auth";
import type { Admin } from "@/types/admin";

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
    select id, email, password_hash, name
    from admins
    where email = ${email.toLowerCase()}
    limit 1
  `;
  const admin = rows[0] as Admin | undefined;

  // Deliberately identical error for "no such admin" and "wrong password"
  // so login responses don't reveal which emails exist in the system.
  if (!admin || !(await verifyPassword(password, admin.password_hash))) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 }
    );
  }

  const token = await signSessionToken({
    sub: admin.id,
    email: admin.email,
    name: admin.name,
  });

  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  return response;
}