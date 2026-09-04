import { sql } from "@/utils/db";
import { Envelope, Bell } from "@phosphor-icons/react/dist/ssr";

export default async function AdminDashboardPage() {
  const [{ count: totalCount }] = await sql`
    select count(*)::int as count from contact_messages
  `;
  const [{ count: unreadCount }] = await sql`
    select count(*)::int as count from contact_messages where is_read = false
  `;

  const stats = [
    { label: "TOTAL MESSAGES", value: totalCount, icon: Envelope },
    { label: "UNREAD MESSAGES", value: unreadCount, icon: Bell },
  ];

  return (
    <div>
      <h1 className="tw:text-slate-800 tw:text-3xl tw:font-bold tw:mb-2">Dashboard</h1>
      <p className="tw:text-slate-800/60 tw:text-sm tw:mb-10">
        Welcome back — here's a quick overview of your clinic.
      </p>

      <div className="tw:grid tw:grid-cols-1 tw:sm:grid-cols-2 tw:gap-5 tw:max-w-2xl">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="tw:bg-white tw:rounded-3xl tw:p-6 tw:border tw:border-gray-100 tw:flex tw:items-center tw:gap-x-4"
          >
            <div className="tw:flex tw:items-center tw:justify-center tw:w-14 tw:h-14 tw:rounded-full tw:bg-primary/10 tw:text-primary tw:shrink-0">
              <Icon className="tw:w-6 tw:h-6" weight="bold" />
            </div>
            <div>
              <p className="tw:text-slate-800 tw:text-3xl tw:font-bold tw:leading-tight">
                {value}
              </p>
              <p className="tw:text-xs tw:font-bold tw:text-primary tw:mt-1">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}