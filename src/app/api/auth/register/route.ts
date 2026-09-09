// import { NextRequest, NextResponse } from "next/server";
// import { z } from "zod";
// import { sql } from "@/utils/db";
// import { hashPassword } from "@/utils/auth";
// import {
//   CUSTOMER_SESSION_COOKIE,
//   CUSTOMER_SESSION_MAX_AGE_SECONDS,
//   signCustomerSessionToken,
// } from "@/utils/customer-auth";
// import type { Customer } from "@/types/customer";

// const registerSchema = z.object({
//   firstName: z.string().trim().min(1, "First name is required").max(100),
//   lastName: z.string().trim().min(1, "Last name is required").max(100),
//   email: z.string().trim().email("Please enter a valid email address"),
//   password: z.string().min(8, "Password must be at least 8 characters"),
// });

// export async function POST(request: NextRequest) {
//   const body = await request.json().catch(() => null);
//   const parsed = registerSchema.safeParse(body);

//   if (!parsed.success) {
//     return NextResponse.json(
//       {
//         error:
//           parsed.error.issues[0]?.message ||
//           "Please check your details and try again.",
//       },
//       { status: 400 }
//     );
//   }

//   const { firstName, lastName, email, password } = parsed.data;
//   const normalizedEmail = email.toLowerCase();

//   const existing = await sql`
//     select id from customers where email = ${normalizedEmail} limit 1
//   `;
//   if (existing.length > 0) {
//     return NextResponse.json(
//       { error: "An account with this email already exists." },
//       { status: 409 }
//     );
//   }

//   const passwordHash = await hashPassword(password);

//   const rows = await sql`
//     insert into customers (email, password_hash, first_name, last_name)
//     values (${normalizedEmail}, ${passwordHash}, ${firstName}, ${lastName})
//     returning id, email, first_name, last_name
//   `;
//   const customer = rows[0] as Pick<
//     Customer,
//     "id" | "email" | "first_name" | "last_name"
//   >;

//   const token = await signCustomerSessionToken({
//     sub: customer.id,
//     email: customer.email,
//     firstName: customer.first_name,
//     lastName: customer.last_name,
//   });

//   const response = NextResponse.json({ success: true });
//   response.cookies.set(CUSTOMER_SESSION_COOKIE, token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "lax",
//     path: "/",
//     maxAge: CUSTOMER_SESSION_MAX_AGE_SECONDS,
//   });

//   return response;
// }














import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sql } from "@/utils/db";
import { hashPassword } from "@/utils/auth";
import {
  CUSTOMER_SESSION_COOKIE,
  CUSTOMER_SESSION_MAX_AGE_SECONDS,
  signCustomerSessionToken,
} from "@/utils/customer-auth";
import type { Customer } from "@/types/customer";

const registerSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(100),
  lastName: z.string().trim().min(1, "Last name is required").max(100),
  email: z.string().trim().email("Please enter a valid email address"),
  phone: z.string().trim().min(1, "Phone number is required").max(20),
  address: z.string().trim().min(1, "Address is required").max(500),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);

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

  const { firstName, lastName, email, phone, address, password } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  const existing = await sql`
    select id from customers where email = ${normalizedEmail} limit 1
  `;
  if (existing.length > 0) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 }
    );
  }

  const passwordHash = await hashPassword(password);

  const rows = await sql`
    insert into customers (email, password_hash, first_name, last_name, phone, address)
    values (${normalizedEmail}, ${passwordHash}, ${firstName}, ${lastName}, ${phone}, ${address})
    returning id, email, first_name, last_name
  `;
  const customer = rows[0] as Pick<
    Customer,
    "id" | "email" | "first_name" | "last_name"
  >;

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

  return response;
}