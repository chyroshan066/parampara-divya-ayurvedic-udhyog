"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { NAVLINKS } from "@/constants";
import { useToast } from "@/components/ToastProvider";

interface HeaderProps {
  isAdminLoggedIn: boolean;
  isCustomerLoggedIn: boolean;
  customerFirstName?: string | null;
  cartCount: number;
}

// Same icon used for all three account states (logged out / customer /
// admin) so the icon itself stays visually consistent with the rest of
// the theme — state is instead communicated via the small status dot
// and whether the icon opens a dropdown or links straight through.
function AccountIcon() {
  return (
    <svg
      width="15"
      height="17"
      viewBox="0 0 15 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.66405 0C10.1737 0 12.2106 2.03684 12.2106 4.54651C12.2106 7.05619 10.1737 9.09302 7.66405 9.09302C5.15438 9.09302 3.11754 7.05619 3.11754 4.54651C3.11754 2.03684 5.15438 0 7.66405 0ZM7.66405 1.18605C5.80907 1.18605 4.30359 2.69153 4.30359 4.54651C4.30359 6.40149 5.80907 7.90698 7.66405 7.90698C9.51903 7.90698 11.0245 6.40149 11.0245 4.54651C11.0245 2.69153 9.51903 1.18605 7.66405 1.18605ZM14.978 15.6163C14.978 15.9833 14.8322 16.3352 14.5727 16.5947C14.3132 16.8542 13.9613 17 13.5943 17H1.73382C1.36683 17 1.01488 16.8542 0.75538 16.5947C0.495882 16.3352 0.350098 15.9833 0.350098 15.6163C0.350098 13.9911 0.995714 12.4324 2.14492 11.2832C3.29413 10.134 4.85278 9.48837 6.478 9.48837H8.8501C10.4753 9.48837 12.034 10.134 13.1832 11.2832C14.3324 12.4324 14.978 13.9911 14.978 15.6163ZM14.4016 16.1927C14.3913 16.1967 14.385 16.2014 14.385 16.2093L14.4016 16.1927ZM1.53614 15.6163C1.53614 15.7254 1.6247 15.814 1.73382 15.814H13.5943C13.6467 15.814 13.697 15.7931 13.7341 15.7561C13.7711 15.719 13.792 15.6687 13.792 15.6163C13.792 14.3056 13.2713 13.0486 12.3445 12.1219C11.4177 11.1951 10.1608 10.6744 8.8501 10.6744H6.478C5.16734 10.6744 3.91036 11.1951 2.98358 12.1219C2.0568 13.0486 1.53614 14.3056 1.53614 15.6163Z"
        fill="#222222"
      />
    </svg>
  );
}

export const Header = ({
  isAdminLoggedIn,
  isCustomerLoggedIn,
  customerFirstName,
  cartCount,
}: HeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const menuOpenRef = useRef(menuOpen);
  const pathname = usePathname();
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    menuOpenRef.current = menuOpen;
  }, [menuOpen]);

  // Header is `position: fixed`, so — unlike `sticky` — it no longer
  // pushes page content down automatically; every page has to
  // compensate for its height itself. Rather than hardcoding a guessed
  // pixel value (which drifts out of sync any time the header's real
  // height changes — different breakpoints, logo size, font loading,
  // etc.), measure it directly and expose it as a CSS variable so
  // header-overrides.css can push ALL page content down by exactly
  // this amount globally, with no per-page fix needed.
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const setHeaderHeightVar = () => {
      document.documentElement.style.setProperty(
        "--site-header-height",
        `${header.offsetHeight}px`
      );
    };

    setHeaderHeightVar();

    const resizeObserver = new ResizeObserver(setHeaderHeightVar);
    resizeObserver.observe(header);

    // This class — not the CSS variable alone — is what
    // header-overrides.css keys the body padding-top compensation off
    // of. The variable is just a number; it doesn't know whether THIS
    // page actually has the fixed header on it. The class is added
    // only while Header is genuinely mounted, and removed the instant
    // it isn't (e.g. navigating into /admin, which has its own sidebar
    // layout and never renders this component) — so pages without the
    // header can never end up compensating for one that isn't there,
    // regardless of whether they were reached via refresh or
    // client-side navigation.
    document.body.classList.add("ayur-has-fixed-header");

    return () => {
      resizeObserver.disconnect();
      document.body.classList.remove("ayur-has-fixed-header");
    };
  }, []);

  // Header is `position: fixed` (see header-overrides.css), so it's out
  // of document flow and never affects the layout below it. This just
  // toggles a class that translates it off/on screen based on scroll
  // direction: hidden while scrolling down, revealed while scrolling up
  // (and always shown near the very top of the page).
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const SHOW_NEAR_TOP_THRESHOLD = 10;

    const updateHeaderVisibility = () => {
      const currentScrollY = window.scrollY;
      const header = headerRef.current;
      ticking = false;

      if (!header) return;

      // Don't hide the header out from under an open mobile menu.
      if (menuOpenRef.current) {
        header.classList.remove("ayur-header-hidden");
        lastScrollY = currentScrollY;
        return;
      }

      if (currentScrollY <= SHOW_NEAR_TOP_THRESHOLD) {
        header.classList.remove("ayur-header-hidden");
      } else if (currentScrollY > lastScrollY) {
        // scrolling down
        header.classList.add("ayur-header-hidden");
      } else if (currentScrollY < lastScrollY) {
        // scrolling up
        header.classList.remove("ayur-header-hidden");
      }

      lastScrollY = currentScrollY;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeaderVisibility);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Equivalent of the two `$(document).on("click", ...)` handlers in
  // custom.js: close the mobile menu when clicking outside the toggle
  // button, close any open submenu when clicking outside .ayur-has-menu,
  // and (new) close the account dropdown when clicking outside it.
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;

      const toggleBtn = headerRef.current?.querySelector(".ayur-toggle-btn");
      if (toggleBtn && !toggleBtn.contains(target)) {
        setMenuOpen(false);
      }

      const hasMenu = headerRef.current?.querySelector(".ayur-has-menu");
      if (hasMenu && !hasMenu.contains(target)) {
        setOpenSubmenu(null);
      }

      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(target)
      ) {
        setAccountMenuOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  // Also close the account dropdown on route change (e.g. after
  // following "My Orders" via keyboard, or a back/forward navigation).
  useEffect(() => {
    setAccountMenuOpen(false);
  }, [pathname]);

  const toggleSubmenu = (event: React.MouseEvent, key: string) => {
    event.stopPropagation();
    setOpenSubmenu((prev) => (prev === key ? null : key));
  };

  const handleCustomerLogout = async () => {
    setAccountMenuOpen(false);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      showToast("success", "Signed out.");
    } finally {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div
      ref={headerRef}
      className={`ayur-menu-wrapper${menuOpen ? " ayur-menu-open" : ""}`}
    >
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-2 col-md-4 col-sm-5 col-6">
            <div className="ayur-menu-logo">
              <Link href="/">
                <img src="/images/logo.webp" alt="Logo" />
              </Link>
            </div>
          </div>
          <div className="col-lg-10 col-md-8 col-sm-7 col-6">
            <div className="ayur-navmenu-wrapper">
              <div className="ayur-nav-menu">
                <ul>
                  {NAVLINKS.map((link, index) => {
                    const isActive =
                      link.href === "/"
                        ? pathname === "/"
                        : pathname === link.href ||
                          pathname.startsWith(`${link.href}/`);

                    return (
                      <li key={index} className={isActive ? "active" : ""}>
                        <Link href={link.href}>{link.name}</Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="ayur-nav-icons">
                <div className="ayur-nav-product">
                  <Link href="/cart">
                    <span className="icon">
                      <svg
                        width="16"
                        height="17"
                        viewBox="0 0 16 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M3.91343 4.14634H2.81175C2.44474 4.14636 2.09137 4.28542 1.82279 4.53554C1.55421 4.78565 1.39037 5.12824 1.36426 5.49432L0.65358 15.4455C0.639403 15.6443 0.666313 15.8439 0.732633 16.0318C0.798954 16.2197 0.903263 16.3919 1.03906 16.5378C1.17486 16.6836 1.33924 16.7999 1.52195 16.8794C1.70466 16.9589 1.9018 17 2.10107 17H13.5881C13.7873 16.9999 13.9844 16.9587 14.1671 16.8792C14.3497 16.7996 14.514 16.6833 14.6498 16.5375C14.7856 16.3917 14.8899 16.2195 14.9563 16.0316C15.0226 15.8438 15.0496 15.6443 15.0356 15.4455L14.3249 5.49432C14.2988 5.12824 14.1349 4.78565 13.8664 4.53554C13.5978 4.28542 13.2444 4.14636 12.8774 4.14634H11.7836V3.93902C11.7836 2.89433 11.3686 1.89242 10.6299 1.15371C9.89118 0.415003 8.88927 0 7.84458 0C5.7486 0 3.81143 1.66932 3.90556 3.93902L3.91343 4.14634ZM11.7836 5.39024V8.5C11.7836 8.66495 11.7181 8.82315 11.6014 8.93979C11.4848 9.05642 11.3266 9.12195 11.1617 9.12195C10.9967 9.12195 10.8385 9.05642 10.7219 8.93979C10.6052 8.82315 10.5397 8.66495 10.5397 8.5V5.39024H5.14946V8.5C5.14946 8.66495 5.08393 8.82315 4.96729 8.93979C4.85065 9.05642 4.69246 9.12195 4.52751 9.12195C4.36255 9.12195 4.20436 9.05642 4.08772 8.93979C3.97108 8.82315 3.90556 8.66495 3.90556 8.5C3.90556 8.5 3.95946 7.04671 3.94163 5.39024H2.81175C2.7594 5.39032 2.70902 5.41019 2.67072 5.44588C2.63241 5.48156 2.60903 5.53042 2.60526 5.58263L1.89417 15.5339C1.89211 15.5623 1.89594 15.5908 1.90541 15.6177C1.91488 15.6446 1.92979 15.6692 1.94921 15.69C1.96862 15.7109 1.99213 15.7275 2.01825 15.7389C2.04438 15.7503 2.07257 15.7561 2.10107 15.7561H13.5881C13.6165 15.756 13.6447 15.7501 13.6708 15.7386C13.6968 15.7272 13.7203 15.7106 13.7397 15.6898C13.7591 15.669 13.774 15.6444 13.7835 15.6176C13.793 15.5907 13.7969 15.5622 13.795 15.5339L13.0839 5.58263C13.0801 5.53042 13.0567 5.48156 13.0184 5.44588C12.9801 5.41019 12.9298 5.39032 12.8774 5.39024H11.7836ZM10.5397 4.14634V3.93902C10.5397 3.22423 10.2558 2.53872 9.75032 2.03329C9.24489 1.52785 8.55937 1.2439 7.84458 1.2439C7.12979 1.2439 6.44427 1.52785 5.93884 2.03329C5.43341 2.53872 5.14946 3.22423 5.14946 3.93902V4.14634H10.5397Z"
                          fill="#222222"
                        />
                      </svg>
                    </span>
                    {cartCount > 0 && (
                      <span className="ayur-nav-provalue">
                        {cartCount > 99 ? "99+" : cartCount}
                      </span>
                    )}
                  </Link>
                </div>

                <div className="ayur-nav-user" ref={accountMenuRef}>
                  {isAdminLoggedIn ? (
                    // Admin: no dropdown — the icon is a direct shortcut
                    // straight into the dashboard, per how admins actually
                    // use it.
                    <Link
                      href="/admin/dashboard"
                      className="icon"
                      aria-label="Go to admin dashboard"
                    >
                      <AccountIcon />
                      <span className="ayur-nav-userdot" aria-hidden="true" />
                    </Link>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="icon ayur-account-trigger"
                        onClick={(event) => {
                          event.stopPropagation();
                          setAccountMenuOpen((prev) => !prev);
                        }}
                        aria-haspopup="true"
                        aria-expanded={accountMenuOpen}
                        aria-label={
                          isCustomerLoggedIn ? "Account menu" : "Login"
                        }
                      >
                        <AccountIcon />
                        {isCustomerLoggedIn && (
                          <span
                            className="ayur-nav-userdot"
                            aria-hidden="true"
                          />
                        )}
                      </button>

                      {accountMenuOpen && (
                        <div className="ayur-account-dropdown" role="menu">
                          {isCustomerLoggedIn ? (
                            <>
                              <p className="ayur-account-dropdown-greeting">
                                {customerFirstName
                                  ? `Hi, ${customerFirstName}`
                                  : "My Account"}
                              </p>
                              <Link
                                href="/orders"
                                className="ayur-account-dropdown-link"
                                role="menuitem"
                                onClick={() => setAccountMenuOpen(false)}
                              >
                                My Orders
                              </Link>
                              <button
                                type="button"
                                role="menuitem"
                                className="ayur-account-dropdown-link ayur-account-dropdown-logout"
                                onClick={handleCustomerLogout}
                              >
                                Logout
                              </button>
                            </>
                          ) : (
                            <>
                              <Link
                                href="/login"
                                className="ayur-account-dropdown-link"
                                role="menuitem"
                                onClick={() => setAccountMenuOpen(false)}
                              >
                                Customer Login
                              </Link>
                              <Link
                                href="/admin/login"
                                className="ayur-account-dropdown-link ayur-account-dropdown-admin"
                                role="menuitem"
                                onClick={() => setAccountMenuOpen(false)}
                              >
                                Admin Login
                              </Link>
                            </>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div
                className="ayur-toggle-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen((prev) => !prev);
                }}
              >
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};