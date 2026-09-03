// import Link from "next/link";
// import { House, List } from "@phosphor-icons/react/dist/ssr";
// import { LogoutButton } from "./LogoutButton";

// interface AdminTopbarProps {
//   email: string;
//   onMenuClick: () => void;
// }

// export function AdminTopbar({ email, onMenuClick }: AdminTopbarProps) {
//   return (
//     <div className="flex items-center justify-between gap-x-4 bg-white border-b border-gray-100 px-4 sm:px-8 py-4">
//       <div className="flex items-center gap-x-3">
//         {/* Hamburger — mobile only, opens the sidebar drawer */}
//         <button
//           type="button"
//           onClick={onMenuClick}
//           className="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 text-slate-600 transition-colors hover:text-primary hover:border-primary"
//           aria-label="Toggle menu"
//         >
//           <List className="w-5 h-5" weight="bold" />
//         </button>

//         <Link
//           href="/"
//           title="View site"
//           aria-label="View site"
//           className="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 text-slate-600 transition-colors hover:text-primary hover:border-primary"
//         >
//           <House className="w-5 h-5" weight="bold" />
//         </Link>
//       </div>

//       <div className="flex items-center gap-x-4">
//         <p className="hidden sm:block text-sm text-slate-800/60">
//           Signed in as <span className="font-bold text-slate-800">{email}</span>
//         </p>
//         <LogoutButton />
//       </div>
//     </div>
//   );
// }



















import Link from "next/link";
import { House, List } from "@phosphor-icons/react/dist/ssr";
import { LogoutButton } from "./LogoutButton";

interface AdminTopbarProps {
  email: string;
  onMenuClick: () => void;
}

export function AdminTopbar({ email, onMenuClick }: AdminTopbarProps) {
  return (
    <div className="tw:flex tw:items-center tw:justify-between tw:gap-x-4 tw:bg-white tw:border-b tw:border-gray-100 tw:px-4 tw:sm:px-8 tw:py-4">
      <div className="tw:flex tw:items-center tw:gap-x-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="tw:flex tw:items-center tw:justify-center tw:w-10 tw:h-10 tw:rounded-xl tw:border tw:border-gray-200 tw:text-slate-600 tw:transition-colors tw:hover:text-primary tw:hover:border-primary"
          aria-label="Toggle menu"
        >
          <List className="tw:w-5 tw:h-5" weight="bold" />
        </button>

        <Link
          href="/"
          title="View site"
          aria-label="View site"
          className="tw:flex tw:items-center tw:justify-center tw:w-10 tw:h-10 tw:rounded-xl tw:border tw:border-gray-200 tw:text-slate-600 tw:transition-colors tw:hover:text-primary tw:hover:border-primary"
        >
          <House className="tw:w-5 tw:h-5" weight="bold" />
        </Link>
      </div>

      <div className="tw:flex tw:items-center tw:gap-x-4">
        <p className="tw:hidden tw:sm:block tw:text-sm tw:text-slate-800/60">
          Signed in as <span className="tw:font-bold tw:text-slate-800">{email}</span>
        </p>
        <LogoutButton />
      </div>
    </div>
  );
}