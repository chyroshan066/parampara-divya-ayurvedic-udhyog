"use client";

import { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";

interface AdminShellProps {
  email: string;
  children: React.ReactNode;
}

export function AdminShell({ email, children }: AdminShellProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] =
    useState(false);

  const handleMenuClick = () => {
    setIsMobileSidebarOpen((prev) => !prev);
    setIsDesktopSidebarCollapsed((prev) => !prev);
  };

  return (
    <div className="ayur-admin-shell tw:flex tw:min-h-screen tw:bg-gray-50">
      <AdminSidebar
        isMobileOpen={isMobileSidebarOpen}
        isDesktopCollapsed={isDesktopSidebarCollapsed}
        onClose={() => setIsMobileSidebarOpen(false)}
      />
      <div className="tw:flex-1 tw:flex tw:flex-col tw:min-w-0">
        <AdminTopbar email={email} onMenuClick={handleMenuClick} />
        <main className="tw:flex-1 tw:px-4 tw:sm:px-8 tw:py-8">{children}</main>
      </div>
    </div>
  );
}