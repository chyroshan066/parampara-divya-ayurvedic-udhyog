"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const MIN_DISPLAY_MS = 800; // ms — tune to taste

export const Preloader = () => {
  const pathname = usePathname();
  const isFirstRun = useRef(true);
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Re-arm the loader on every route change, not just the first mount.
    setVisible(true);
    setFading(false);

    const start = Date.now();
    const hideLoader = () => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);
      setTimeout(() => setFading(true), remaining);
    };

    // Only the very first run is a real full page load with assets
    // still in flight, so only it waits on window "load". Every
    // subsequent pathname change is a client-side navigation — there's
    // nothing new to wait on, so just show the loader briefly.
    if (isFirstRun.current) {
      isFirstRun.current = false;

      if (document.readyState !== "complete") {
        window.addEventListener("load", hideLoader);
        return () => window.removeEventListener("load", hideLoader);
      }
    }

    hideLoader();
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      className={`ayur-loader${fading ? " ayur-loader-hide" : ""}`}
      onTransitionEnd={() => fading && setVisible(false)}
    >
      <div className="ayur-spin">
        <img src="/images/loader.gif" alt="loader" />
      </div>
    </div>
  );
};