import { NextRequest, NextResponse } from "next/server";
import { ContactFormSchema } from "@/utils/schema";
import { sql } from "@/utils/db";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = ContactFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please check the form and try again.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const { firstName, lastName, email, subject, message } = parsed.data;

  try {
    await sql`
      insert into contact_messages (first_name, last_name, email, subject, message)
      values (${firstName}, ${lastName}, ${email}, ${subject || null}, ${message})
    `;
  } catch (error) {
    console.error("Failed to save contact message:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}