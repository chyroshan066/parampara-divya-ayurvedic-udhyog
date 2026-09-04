import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/utils/auth";
import { sql } from "@/utils/db";

export async function GET(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await sql`
    select id, first_name, last_name, email, subject, message, is_read, created_at
    from contact_messages
    order by created_at desc
  `;

  const messages = rows.map((row) => ({
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    subject: row.subject,
    message: row.message,
    isRead: row.is_read,
    createdAt: row.created_at,
  }));

  return NextResponse.json({ messages });
}