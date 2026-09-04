"use client";

import { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SquaresFour, EnvelopeSimple, X } from "@phosphor-icons/react";
import { useClickOutside } from "@/hooks/useClickOutside";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/admin/dashboard", icon: SquaresFour },
  { name: "Messages", href: "/admin/messages", icon: EnvelopeSimple },
];

function SidebarNav({
  pathname,
  onNavigate,
  isCollapsed,
}: {
  pathname: string | null;
  onNavigate?: () => void;
  isCollapsed?: boolean;
}) {
  return (
    <nav className="tw:flex tw:flex-col tw:gap-y-1">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            title={isCollapsed ? item.name : undefined}
            className={`tw:flex tw:items-center tw:gap-x-3 tw:px-4 tw:py-3 tw:rounded-xl tw:text-sm tw:font-bold tw:transition-colors ${
              isCollapsed ? "tw:justify-center tw:px-0" : ""
            } ${
              isActive
                ? "tw:bg-primary tw:text-white"
                : "tw:text-slate-600 tw:hover:bg-primary/10 tw:hover:text-primary"
            }`}
          >
            <Icon className="tw:w-5 tw:h-5 tw:shrink-0" weight="bold" />
            {!isCollapsed && item.name}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarBrand({ isCollapsed }: { isCollapsed?: boolean }) {
  return (
    <div
      className={`tw:flex tw:items-center tw:gap-x-2 tw:px-2 ${
        isCollapsed ? "tw:justify-center tw:px-0" : ""
      }`}
    >
      <img
        style={{ height: "32px", width: "auto", objectFit: "contain" }}
        src="/images/logo.webp"
        alt="Parampara Divya Ayurvedic"
      />
      {!isCollapsed && (
        <span className="tw:text-slate-800 tw:font-bold tw:text-base">Admin</span>
      )}
    </div>
  );
}

interface AdminSidebarProps {
  isMobileOpen: boolean;
  isDesktopCollapsed?: boolean;
  onClose: () => void;
}

export function AdminSidebar({
  isMobileOpen,
  isDesktopCollapsed,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const mobileSidebarRef = useRef<HTMLElement>(null);

  useClickOutside(mobileSidebarRef, onClose, isMobileOpen);

  return (
    <>
      {/* Desktop */}
      <aside
        className={`tw:hidden tw:md:flex tw:shrink-0 tw:flex-col tw:bg-white tw:border-r tw:border-gray-100 tw:px-4 tw:py-6 tw:transition-all tw:duration-300 ${
          isDesktopCollapsed ? "tw:w-20" : "tw:w-64"
        }`}
      >
        <div className="tw:mb-8">
          <SidebarBrand isCollapsed={isDesktopCollapsed} />
        </div>
        <SidebarNav pathname={pathname} isCollapsed={isDesktopCollapsed} />
      </aside>

      {/* Mobile */}
      <div
        className={`${
          isMobileOpen ? "" : "tw:hidden"
        } tw:fixed tw:inset-0 tw:bg-black/40 tw:transition-all tw:z-40 tw:md:hidden tw:pointer-events-none`}
      />
      <aside
        ref={mobileSidebarRef}
        className={`tw:w-72 tw:bg-white tw:fixed tw:top-0 ${
          isMobileOpen ? "tw:left-0" : "tw:-left-72"
        } tw:bottom-0 tw:z-50 tw:flex tw:flex-col tw:px-4 tw:py-6 tw:border-r tw:border-gray-100 tw:transition-all tw:md:hidden`}
      >
        <div className="tw:flex tw:items-center tw:justify-between tw:mb-8">
          <SidebarBrand />
          <button
            type="button"
            onClick={onClose}
            className="tw:flex tw:items-center tw:justify-center tw:w-8 tw:h-8 tw:rounded-full tw:text-slate-400 tw:transition-colors tw:hover:bg-gray-100 tw:hover:text-slate-600"
            aria-label="Close menu"
          >
            <X className="tw:w-5 tw:h-5" weight="bold" />
          </button>
        </div>
        <SidebarNav pathname={pathname} onNavigate={onClose} />
      </aside>
    </>
  );
}