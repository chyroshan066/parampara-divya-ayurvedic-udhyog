"use client";

import { CARE_ITEMS } from "@/constants";
import { useEffect, useRef } from "react";

declare global {
    interface Window {
        Swiper: any;
    }
}

// The original markup repeats the first two items at the end - Swiper's
// loop mode needs at least (slidesPerView * 2) slides to loop cleanly,
// and 8 unique items isn't quite enough at the widest breakpoint (8 per view).
const CARE_SLIDES = [...CARE_ITEMS, CARE_ITEMS[0], CARE_ITEMS[1]];

export const Care = () => {
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
                slidesPerView: 8,
                spaceBetween: 30,
                autoplay: {
                    delay: 2000,
                    disableOnInteraction: false,
                },
                navigation: {
                    nextEl: ".ayur-care-slider-sec .swiper-button-next",
                    prevEl: ".ayur-care-slider-sec .swiper-button-prev",
                },
                breakpoints: {
                    1800: {
                        slidesPerView: 8,
                        spaceBetween: 30,
                    },
                    1600: {
                        slidesPerView: 8,
                        spaceBetween: 10,
                    },
                    1199: {
                        slidesPerView: 8,
                        spaceBetween: 0,
                    },
                    1024: {
                        slidesPerView: 7,
                        spaceBetween: 0,
                    },
                    991: {
                        slidesPerView: 6,
                        spaceBetween: 0,
                    },
                    767: {
                        slidesPerView: 5,
                        spaceBetween: 0,
                    },
                    600: {
                        slidesPerView: 4,
                        spaceBetween: 0,
                    },
                    460: {
                        slidesPerView: 3,
                        spaceBetween: 0,
                    },
                    0: {
                        slidesPerView: 2,
                        spaceBetween: 0,
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
    <div className="ayur-care-slider-wrapper">
        <div className="container-fluid">
            <div className="ayur-care-slider-sec">
                <div className="swiper ayur-care-slider" ref={sliderRef}>
                    <div className="swiper-wrapper">
                        {CARE_SLIDES.map((item, index) => (
                            <div className="swiper-slide" key={index}>
                                <div className="ayur-careslide-box">
                                    <div className="ayur-careslider-img">
                                        <img src={item.image} alt="img" />
                                    </div>
                                    <h3>{item.label}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="swiper-button-prev">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M20 0C31.0284 0 40 8.97164 40 20C40 31.0284 31.0284 40 20 40C8.97164 40 0 31.0284 0 20C0 8.97164 8.97164 0 20 0ZM13.8216 21.1784L22.155 29.5116C22.3096 29.6666 22.4932 29.7896 22.6955 29.8734C22.8977 29.9572 23.1145 30.0002 23.3334 30C23.5523 30.0002 23.769 29.9572 23.9712 29.8733C24.1735 29.7895 24.3571 29.6666 24.5117 29.5116C25.1634 28.86 25.1634 27.8066 24.5117 27.155L17.3566 20L24.5116 12.845C25.1633 12.1934 25.1633 11.14 24.5116 10.4884C23.86 9.83672 22.8066 9.83672 22.155 10.4884L13.8216 18.8217C13.17 19.4734 13.17 20.5266 13.8216 21.1784Z"
                            fill="#D6CDCA" />
                    </svg>
                </div>
                <div className="swiper-button-next">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M20 0C8.97164 0 0 8.97164 0 20C0 31.0284 8.97164 40 20 40C31.0284 40 40 31.0284 40 20C40 8.97164 31.0284 0 20 0ZM26.1784 21.1784L17.845 29.5116C17.6904 29.6666 17.5068 29.7896 17.3045 29.8734C17.1023 29.9572 16.8855 30.0002 16.6666 30C16.4477 30.0002 16.231 29.9572 16.0288 29.8733C15.8265 29.7895 15.6429 29.6666 15.4883 29.5116C14.8366 28.86 14.8366 27.8066 15.4883 27.155L22.6434 20L15.4884 12.845C14.8367 12.1934 14.8367 11.14 15.4884 10.4884C16.14 9.83672 17.1934 9.83672 17.845 10.4884L26.1784 18.8217C26.83 19.4734 26.83 20.5266 26.1784 21.1784Z"
                            fill="#CD8973" />
                    </svg>
                </div>
            </div>
        </div>
    </div>
    );
};