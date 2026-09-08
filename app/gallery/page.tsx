"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

type Work = {
  id: number;
  src: string;
  fullSrc: string;
  alt: string;
};

export default function GalleryPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((data) => {
        setWorks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="gallery-loading">
        <div className="spinner"></div>
        <p>Загрузка работ...</p>
      </div>
    );
  }

  if (works.length === 0) {
    return (
      <div className="gallery-empty">
        <p>Работ пока нет</p>
      </div>
    );
  }

  const slides = works.map((work) => ({
    src: work.fullSrc,
    alt: work.alt,
  }));

  return (
    <div className="gallery-page">
      <Link href="/" className="gallery-back" aria-label="На главную">
        <span className="back-arrow">←</span>
      </Link>
      <h1 className="gallery-title">Все работы</h1>
      <div className="gallery-masonry">
        {works.map((work, index) => (
          <GalleryItem
            key={work.id}
            work={work}
            index={index}
            onClick={() => setLightboxIndex(index)}
          />
        ))}
      </div>

      <Lightbox
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        slides={slides}
        index={lightboxIndex}
        plugins={[Zoom]} // подключаем зум
        zoom={{
          maxZoomPixelRatio: 3,
          zoomInMultiplier: 1.5,
        }}
        carousel={{
          finite: false,
          preload: 2,
        }}
        on={{
          view: ({ index }) => setLightboxIndex(index),
        }}
      />
    </div>
  );
}

function GalleryItem({
  work,
  index,
  onClick,
}: {
  work: Work;
  index: number;
  onClick: () => void;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "0px 0px -100px" },
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`gallery-item ${isVisible ? "visible" : ""}`}
      style={{ transitionDelay: `${(index % 10) * 50}ms` }}
      onClick={onClick}
    >
      <div className="gallery-item-inner">
        <Image
          src={work.src}
          alt={work.alt}
          width={600}
          height={600}
          className="gallery-image"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/2wBDAQoLCw4NDhwQEBw7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k="
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>
    </div>
  );
}
