"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    Swiper: any;
  }
}

export const Banner = () => {
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let swiperInstance: any;
    let cancelled = false;
    let rafId: number;

    const initSwiper = () => {
      if (cancelled || !sliderRef.current) return;

      // swiper-bundle.min.js is loaded via next/script (afterInteractive),
      // so it may not be ready yet on first mount - poll until it is.
      if (typeof window === "undefined" || !window.Swiper) {
        rafId = requestAnimationFrame(initSwiper);
        return;
      }

      const notActiveSlideScaleValue = 0.85;
      const notActiveSlideOpacityValue = 0.5;

      swiperInstance = new window.Swiper(sliderRef.current, {
        slidesPerView: 2,
        parallax: true,
        loop: true,
        breakpoints: {
          320: {
            speed: 900,
            slidesPerView: 1,
          },
          670: {
            slidesPerView: 1,
          },
          767: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 2,
          },
        },
        keyboard: {
          enabled: true,
        },
        centeredSlides: true,
        slideToClickedSlide: true,
        spaceBetween: 0,
        grabCursor: true,
        speed: 1500,
        autoplay: {
          delay: 2000,
        },
        effect: "creative",
        creativeEffect: {
          limitProgress: 2,
          rotate: 0,
          stretch: 0,
          depth: 100,
          prev: {
            opacity: notActiveSlideOpacityValue,
            scale: notActiveSlideScaleValue,
            translate: ["-65%", 0, 0],
          },
          next: {
            opacity: notActiveSlideOpacityValue,
            scale: notActiveSlideScaleValue,
            translate: ["65%", 0, 0],
          },
        },
        navigation: {
          nextEl: sliderRef.current.querySelector(".swiper-button-next"),
          prevEl: sliderRef.current.querySelector(".swiper-button-prev"),
        },
      });
    };

    initSwiper();

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      swiperInstance?.destroy(true, true);
    };
  }, []);

  return (
    <div className="ayur-banner-section">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 col-md-12 col-sm-12">
            <div className="ayur-banner-heading">
              <h1>
                We Are Here To Give You The Best <span>Herb Products</span>{" "}
              </h1>
              <p>
                Pure, natural, and crafted with care — our herbal products bring the healing power of nature straight to your everyday wellness routine.
              </p>
              <a href="/shop" className="ayur-btn">
                Shop Now
              </a>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="ayur-banner-slider-sec">
              <div className="swiper ayur-banner-slider" ref={sliderRef}>
                <div className="swiper-wrapper">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div className="swiper-slide" key={index}>
                      <div className="ayur-ban-slide">
                        <img
                          src="/images/banner/ban-head-Image.webp"
                          alt="headerimage"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="swiper-button-prev">
                  <svg
                    width="46"
                    height="22"
                    viewBox="0 0 46 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.520424 9.74414L0.522022 9.74245L9.79254 0.51664C10.4871 -0.174498 11.6104 -0.171926 12.3017 0.522671C12.9929 1.21718 12.9903 2.34051 12.2958 3.03174L6.07152 9.22581H43.6452C44.6251 9.22581 45.4194 10.0201 45.4194 11C45.4194 11.9799 44.6251 12.7742 43.6452 12.7742H6.07161L12.2957 18.9683C12.9902 19.6595 12.9928 20.7828 12.3016 21.4773C11.6103 22.172 10.4869 22.1744 9.79245 21.4834L0.521931 12.2575L0.520336 12.2559C-0.17453 11.5623 -0.17231 10.4354 0.520424 9.74414Z"
                      fill="#F6F1ED"
                    />
                  </svg>
                </div>
                <div className="swiper-button-next">
                  <svg
                    width="46"
                    height="22"
                    viewBox="0 0 46 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M44.899 9.74414L44.8974 9.74245L35.6269 0.51664C34.9324 -0.174498 33.8091 -0.171926 33.1177 0.522671C32.4265 1.21718 32.4292 2.34051 33.1237 3.03174L39.3479 9.22581H1.77419C0.794307 9.22581 0 10.0201 0 11C0 11.9799 0.794307 12.7742 1.77419 12.7742H39.3478L33.1238 18.9683C32.4293 19.6595 32.4266 20.7828 33.1178 21.4773C33.8091 22.172 34.9326 22.1744 35.627 21.4834L44.8975 12.2575L44.8991 12.2559C45.594 11.5623 45.5917 10.4354 44.899 9.74414Z"
                      fill="white"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="ayur-ban-leaf">
        <img src="/images/banner/ban-leafleft.webp" alt="leaf-image" />
        <img src="/images/banner/ban-leafright.webp" alt="leaf-image" />
      </div>
    </div>
  );
};
