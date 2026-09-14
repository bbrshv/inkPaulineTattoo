"use client";

import { useEffect, useRef, useState } from "react";

interface HeroParallaxProps {
  videoUrl: string;
  imageUrl: string;
  posterUrl: string;
  /** Колбэк: вызывается, когда видео готово к проигрыванию (или когда видео нет). */
  onVideoReady?: () => void;
}

export default function HeroParallax({
  videoUrl,
  imageUrl,
  posterUrl,
  onVideoReady,
}: HeroParallaxProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoReady, setVideoReady] = useState(false);

  // Если видео нет — сразу сигналим родителю, что «готово» (нечего ждать).
  // Лоза вырастет сразу, это ожидаемое поведение для fallback-картинки.
  useEffect(() => {
    if (!videoUrl) {
      onVideoReady?.();
    }
  }, [videoUrl, onVideoReady]);

  // Статичная подложка: постер, если видео есть; иначе — картинка.
  // Всегда под видео — переход не даёт «чёрной вспышки».
  const backgroundUrl = videoUrl ? posterUrl : imageUrl;

  return (
    <div className="hero-parallax">
      <div
        className="hero-media hero-image"
        style={{ backgroundImage: `url(${backgroundUrl})` }}
      />

      {videoUrl && (
        <video
          ref={videoRef}
          src={videoUrl}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={() => {
            setVideoReady(true);
            onVideoReady?.();
          }}
          className="hero-media"
          style={{
            objectFit: "cover",
            opacity: videoReady ? 1 : 0,
            transition: "opacity 0.6s ease-in",
          }}
        />
      )}
    </div>
  );
}
