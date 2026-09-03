"use client";

import { usePathname } from "next/navigation";
import { Preloader } from "@/components/Preloader";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

/**
 * Keeps a single root layout (shared fonts, metadata, analytics, scripts)
 * while still giving /admin/* its own look — the marketing Header/Footer/
 * Preloader only render for public site routes.
 *
 * This is a lighter-weight fix than a full Next.js "multiple root layouts"
 * split (separate <html>/<body> trees per top-level segment). If /admin
 * ever needs a genuinely independent shell (different fonts, no shared
 * scripts), that's the pattern to reach for instead — but for now, hiding
 * the public chrome here is enough.
 */
export function SiteChrome({
  children,
  isAdminLoggedIn,
}: {
  children: React.ReactNode;
  isAdminLoggedIn: boolean;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Preloader />
      <Header />
      {/* <Header isAdminLoggedIn={isAdminLoggedIn} /> */}
      {children}
      <Footer />
    </>
  );
}