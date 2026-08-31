"use client";

import { TESTIMONIALS } from "@/constants";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    Swiper: any;
  }
}

export const Testimonial = () => {
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

      swiperInstance = new window.Swiper(sliderRef.current, {
        loop: true,
        slidesPerView: 2,
        spaceBetween: 30,
        speed: 2000,
        autoplay: {
          delay: 2000,
        },
        navigation: {
          nextEl: ".ayur-testimonial-section .swiper-button-next",
          prevEl: ".ayur-testimonial-section .swiper-button-prev",
        },
        breakpoints: {
          768: {
            slidesPerView: 2,
            spaceBetween: 30,
          },
          0: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
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
    <div className="ayur-bgcover ayur-testimonial-sec">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 col-md-12 col-sm-12">
            <div className="ayur-heading-wrap ayur-test-head">
              <h5>Our Testimonial</h5>
              <h3>What Our Client&apos;s Say</h3>
            </div>
          </div>
        </div>
        <div className="ayur-testimonial-section">
          <div className="swiper ayur-testimonial-slider" ref={sliderRef}>
            <div className="swiper-wrapper">
              {TESTIMONIALS.map((testimonial, index) => (
                <div className="swiper-slide" key={index}>
                  <div className="ayur-test-box">
                    <div className="ayur-test-text">
                      <p>{testimonial.text}</p>
                    </div>
                    <div className="ayur-test-namesec">
                      <div className="ayur-testname">
                        <img src={testimonial.image} alt="image" />
                        <h3>{testimonial.name}</h3>
                      </div>
                      <div className="ayur-testquote">
                        <svg
                          width="74"
                          height="53"
                          viewBox="0 0 74 53"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            opacity="0.1"
                            d="M13.8133 18.3798C12.1853 14.2231 9.62 10.1164 6.19133 6.16C5.106 4.90796 4.958 3.10504 5.846 1.70277C6.53667 0.600975 7.67133 0 8.90467 0C9.25 0 9.59533 0.0250397 9.94067 0.150242C17.1927 2.30374 34.1387 9.94113 34.6073 34.4309C34.78 43.8712 27.972 51.9844 19.1167 52.9109C14.208 53.4117 9.324 51.784 5.698 48.4787C3.90464 46.8276 2.47128 44.8141 1.48999 42.5673C0.508697 40.3205 0.0011672 37.8902 0 35.4325C0 27.1691 5.772 19.9324 13.8133 18.3798ZM58.4847 52.9109C53.6007 53.4117 48.7167 51.784 45.0907 48.4787C43.2972 46.8277 41.8638 44.8142 40.8824 42.5674C39.9011 40.3206 39.3937 37.8902 39.3927 35.4325C39.3927 27.1691 45.1647 19.9324 53.206 18.3798C51.578 14.2231 49.0127 10.1164 45.584 6.16C44.4987 4.90796 44.3507 3.10504 45.2387 1.70277C45.9293 0.600975 47.064 0 48.2973 0C48.6427 0 48.988 0.0250397 49.3333 0.150242C56.5853 2.30374 73.5313 9.94113 74 34.4309V34.7815C74 44.0715 67.266 51.9844 58.4847 52.9109Z"
                            fill="#CD8973"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="swiper-button-prev">
            <svg
              width="34"
              height="16"
              viewBox="0 0 34 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.765606 7.08664L0.766766 7.08542L7.50896 0.375738C8.01406 -0.126907 8.83103 -0.125037 9.33381 0.380125C9.83652 0.885222 9.83458 1.70219 9.32948 2.2049L4.80277 6.70968H32.1291C32.8418 6.70968 33.4194 7.28735 33.4194 8C33.4194 8.71265 32.8418 9.29032 32.1291 9.29032H4.80283L9.32942 13.7951C9.83451 14.2978 9.83645 15.1148 9.33374 15.6199C8.83097 16.1251 8.01393 16.1268 7.5089 15.6243L0.766701 8.91458L0.765541 8.91336C0.260185 8.40897 0.261799 7.58935 0.765606 7.08664Z"
                fill="#797979"
              />
            </svg>
          </div>
          <div className="swiper-button-next">
            <svg
              width="34"
              height="16"
              viewBox="0 0 34 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M32.6538 7.08664L32.6527 7.08542L25.9105 0.375738C25.4054 -0.126907 24.5884 -0.125037 24.0856 0.380125C23.5829 0.885222 23.5849 1.70219 24.09 2.2049L28.6167 6.70968H1.29032C0.577678 6.70968 0 7.28735 0 8C0 8.71265 0.577678 9.29032 1.29032 9.29032H28.6166L24.09 13.7951C23.5849 14.2978 23.583 15.1148 24.0857 15.6199C24.5885 16.1251 25.4055 16.1268 25.9105 15.6243L32.6527 8.91458L32.6539 8.91336C33.1592 8.40897 33.1576 7.58935 32.6538 7.08664Z"
                fill="#CD8973"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
