// export const Preloader = () => (
//   <div className="ayur-loader">
//     <div className="ayur-spin">
//       <img src="/images/loader.gif" alt="loader" />
//     </div>
//   </div>
// );













"use client";

import { useEffect, useState } from "react";

export const Preloader = () => {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const hideLoader = () => setFading(true);

    // If all resources already finished loading before this effect runs
    // (e.g. fast connection, cached assets), fire immediately — otherwise
    // wait for the same 'load' event the original jQuery code used.
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