"use client";

import { useEffect, useRef, useState } from "react";

interface HeroParallaxProps {
  mediaUrl: string;
  isVideo: boolean;
}

export default function HeroParallax({ mediaUrl, isVideo }: HeroParallaxProps) {
  const mediaRef = useRef<HTMLVideoElement | HTMLDivElement>(null);
  const [mediaAspect, setMediaAspect] = useState(0);
  const [isPortrait, setIsPortrait] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (!mediaRef.current) return;

    if (isVideo && mediaRef.current instanceof HTMLVideoElement) {
      const video = mediaRef.current;
      video.addEventListener('loadedmetadata', () => {
        const aspect = video.videoHeight / video.videoWidth;
        setMediaAspect(aspect);
        setIsPortrait(aspect > 1.2);
      });
    } else if (!isVideo && mediaRef.current instanceof HTMLDivElement) {
      const img = new Image();
      img.src = mediaUrl;
      img.onload = () => {
        const aspect = img.height / img.width;
        setMediaAspect(aspect);
        setIsPortrait(aspect > 1.2);
      };
    }
  }, [mediaUrl, isVideo]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const progress = scrollY / maxScroll;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getTransform = () => {
    if (!isPortrait) return 'translateY(0)';
    
    const maxTranslate = mediaRef.current?.clientHeight 
      ? mediaRef.current.clientHeight - window.innerHeight 
      : 0;
    
    return `translateY(-${scrollProgress * maxTranslate}px)`;
  };

  return (
    <div className="hero-parallax">
      {isVideo ? (
        <video
          ref={mediaRef as any}
          src={mediaUrl}
          autoPlay
          muted
          loop
          playsInline
          className="hero-media"
          style={{ transform: getTransform() }}
        />
      ) : (
        <div
          ref={mediaRef as any}
          className="hero-media hero-image"
          style={{ 
            backgroundImage: `url(${mediaUrl})`,
            transform: getTransform()
          }}
        />
      )}
    </div>
  );
}
