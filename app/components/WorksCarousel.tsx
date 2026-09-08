"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type Work = {
  id: number;
  src: string;
  alt: string;
};

export default function WorksCarousel({ works }: { works: Work[] }) {
  // Берём первые 4 работы (или сколько есть)
  const displayWorks = works.slice(0, 4);

  // Если работ меньше 4, показываем как есть
  const slides = displayWorks.map((work, index) => ({
    ...work,
    isLast: index === displayWorks.length - 1 && displayWorks.length === 4,
  }));

  return (
    <div className="works-carousel">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
        }}
        navigation
        pagination={{ clickable: true }}
        style={{ paddingBottom: "40px" }}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <Link href="/gallery" className="slide-link">
              <div className={`work-slide ${slide.isLast ? "last-work" : ""}`}>
                {slide.src.match(/\.(mp4|webm|mov)$/i) ? (
                  <video src={slide.src} autoPlay muted loop playsInline />
                ) : (
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    style={{ objectFit: "cover" }}
                    unoptimized
                  />
                )}
                {slide.isLast && (
                  <div className="work-overlay">
                    <span className="overlay-text">Все работы →</span>
                  </div>
                )}
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
