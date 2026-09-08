"use client";

interface HeroParallaxProps {
  mediaUrl: string;
  isVideo: boolean;
}

export default function HeroParallax({ mediaUrl, isVideo }: HeroParallaxProps) {
  // Убрали всё, что связано с параллаксом и скроллом.
  // Видео/картинка просто отображаются на всю высоту родителя без трансформаций.

  return (
    <div className="hero-parallax">
      {isVideo ? (
        <video
          src={mediaUrl}
          autoPlay
          muted
          loop
          playsInline
          className="hero-media"
          style={{ objectFit: "cover" }}
        />
      ) : (
        <div
          className="hero-media hero-image"
          style={{ backgroundImage: `url(${mediaUrl})` }}
        />
      )}
    </div>
  );
}
