// // import { sql } from "@/utils/db";

// // export default async function AdminDashboardPage() {
// // //   const [{ count: totalCount }] = await sql`
// // //     select count(*)::int as count from appointments
// // //   `;
// // //   const [{ count: newCount }] = await sql`
// // //     select count(*)::int as count from appointments where status = 'new'
// // //   `;

// //   return (
// //     <div>
// //       <h1 className="text-slate-800 text-3xl font-bold mb-12">Dashboard</h1>

// //       <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-xl">
// //         <div className="bg-white rounded-3xl p-6 border border-gray-100">
// //           <p className="text-xs font-bold text-primary mb-2">
// //             TOTAL APPOINTMENTS
// //           </p>
// //           {/* <p className="text-slate-800 text-4xl font-bold">{totalCount}</p> */}
// //         </div>
// //         <div className="bg-white rounded-3xl p-6 border border-gray-100">
// //           <p className="text-xs font-bold text-primary mb-2">NEW REQUESTS</p>
// //           {/* <p className="text-slate-800 text-4xl font-bold">{newCount}</p> */}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }




























// import { sql } from "@/utils/db";
// import { CalendarCheck, Bell, Images } from "@phosphor-icons/react/dist/ssr";

// export default async function AdminDashboardPage() {
//   // Uncomment once your `appointments` table exists:
//   // const [{ count: totalCount }] = await sql`
//   //   select count(*)::int as count from appointments
//   // `;
//   // const [{ count: newCount }] = await sql`
//   //   select count(*)::int as count from appointments where status = 'new'
//   // `;
//   // Uncomment once your gallery table exists:
//   // const [{ count: galleryCount }] = await sql`
//   //   select count(*)::int as count from gallery
//   // `;

//   const stats = [
//     {
//       label: "TOTAL APPOINTMENTS",
//       value: null, // totalCount,
//       icon: CalendarCheck,
//     },
//     {
//       label: "NEW REQUESTS",
//       value: null, // newCount,
//       icon: Bell,
//     },
//     {
//       label: "GALLERY IMAGES",
//       value: null, // galleryCount,
//       icon: Images,
//     },
//   ];

//   return (
//     <div>
//       <h1 className="text-slate-800 text-3xl font-bold mb-2">Dashboard</h1>
//       <p className="text-slate-800/60 text-sm mb-10">
//         Welcome back — here's a quick overview of your clinic.
//       </p>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-3xl">
//         {stats.map(({ label, value, icon: Icon }) => (
//           <div
//             key={label}
//             className="bg-white rounded-3xl p-6 border border-gray-100 flex items-center gap-x-4"
//           >
//             <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary shrink-0">
//               <Icon className="w-6 h-6" weight="bold" />
//             </div>
//             <div>
//               <p className="text-slate-800 text-3xl font-bold leading-tight">
//                 {value ?? "—"}
//               </p>
//               <p className="text-xs font-bold text-primary mt-1">{label}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


























import { sql } from "@/utils/db";
import { CalendarCheck, Bell, Images } from "@phosphor-icons/react/dist/ssr";

export default async function AdminDashboardPage() {
  // Uncomment once your `appointments` table exists:
  // const [{ count: totalCount }] = await sql`
  //   select count(*)::int as count from appointments
  // `;
  // const [{ count: newCount }] = await sql`
  //   select count(*)::int as count from appointments where status = 'new'
  // `;
  // Uncomment once your gallery table exists:
  // const [{ count: galleryCount }] = await sql`
  //   select count(*)::int as count from gallery
  // `;

  const stats = [
    { label: "TOTAL APPOINTMENTS", value: null, icon: CalendarCheck },
    { label: "NEW REQUESTS", value: null, icon: Bell },
    { label: "GALLERY IMAGES", value: null, icon: Images },
  ];

  return (
    <div>
      <h1 className="tw:text-slate-800 tw:text-3xl tw:font-bold tw:mb-2">Dashboard</h1>
      <p className="tw:text-slate-800/60 tw:text-sm tw:mb-10">
        Welcome back — here's a quick overview of your clinic.
      </p>

      <div className="tw:grid tw:grid-cols-1 tw:sm:grid-cols-2 tw:lg:grid-cols-3 tw:gap-5 tw:max-w-3xl">
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
                {value ?? "—"}
              </p>
              <p className="tw:text-xs tw:font-bold tw:text-primary tw:mt-1">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}