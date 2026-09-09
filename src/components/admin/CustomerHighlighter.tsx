"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const HIGHLIGHT_CLASS = "ayur-customer-highlighted";

/**
 * Next's App Router navigates via the History API rather than a real
 * page load, and browsers don't reliably re-evaluate CSS :target across
 * that kind of transition — it's built for plain <a href="#..."> jumps
 * within a single document load, so :target can work once (right after
 * a full reload) and then silently stop firing on later client-side
 * navigations to a different #customer-<id> hash.
 *
 * This sidesteps that entirely: on mount, and whenever the hash changes
 * afterwards, it scrolls the matching card into view and toggles a
 * plain class onto it directly, clearing that class off whichever card
 * had it before. No dependence on :target at all.
 */
export function CustomerHighlighter() {
  const pathname = usePathname();

  useEffect(() => {
    function applyHighlight() {
      document
        .querySelectorAll(`.${HIGHLIGHT_CLASS}`)
        .forEach((el) => el.classList.remove(HIGHLIGHT_CLASS));

      const hash = window.location.hash;
      if (!hash) return;

      let target: Element | null = null;
      try {
        target = document.querySelector(hash);
      } catch {
        // An unusual/invalid hash (shouldn't happen with our own
        // #customer-<uuid> links) — just skip highlighting.
        return;
      }
      if (!target) return;

      target.classList.add(HIGHLIGHT_CLASS);
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    applyHighlight();
    window.addEventListener("hashchange", applyHighlight);
    return () => window.removeEventListener("hashchange", applyHighlight);
  }, [pathname]);

  return null;
}