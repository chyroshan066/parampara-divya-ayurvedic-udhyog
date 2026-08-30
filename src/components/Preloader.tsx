"use client";

import { useEffect, useState } from "react";

export const Preloader = () => {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const minDisplayTime = 800; // ms — tune to taste
    const start = Date.now();

    const hideLoader = () => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, minDisplayTime - elapsed);
      setTimeout(() => setFading(true), remaining);
    };

    if (document.readyState === "complete") {
      hideLoader();
    } else {
      window.addEventListener("load", hideLoader);
      return () => window.removeEventListener("load", hideLoader);
    }
  }, []);

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
