"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="tw:inline-flex tw:items-center tw:justify-center tw:gap-x-0 tw:h-12 tw:px-6 tw:min-w-[100px] tw:bg-primary tw:text-white tw:text-sm tw:font-bold tw:rounded-xl tw:transition-colors tw:hover:bg-primary-hover tw:disabled:opacity-60"
    >
      {isLoading ? "Signing out..." : "Logout"}
    </button>
  );
}