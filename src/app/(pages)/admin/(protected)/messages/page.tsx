import { sql } from "@/utils/db";
import { MessagesList } from "@/components/admin/MessagesList";
import type { ContactMessage } from "@/types/contact";

export default async function AdminMessagesPage() {
  const rows = await sql`
    select id, first_name, last_name, email, subject, message, is_read, created_at
    from contact_messages
    order by created_at desc
  `;

  const messages: ContactMessage[] = rows.map((row) => ({
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    subject: row.subject,
    message: row.message,
    isRead: row.is_read,
    createdAt: row.created_at,
  }));

  return (
    <div>
      <h1 className="tw:text-slate-800 tw:text-3xl tw:font-bold tw:mb-2">Messages</h1>
      <p className="tw:text-slate-800/60 tw:text-sm tw:mb-10">
        Contact form submissions from your website.
      </p>

      <MessagesList initialMessages={messages} />
    </div>
  );
}