'use client';

import Hls from 'hls.js';
import { useEffect, useRef } from 'react';

export function VideoPlayer({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Safari (and some browsers) support native HLS
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      return;
    }

    // Other browsers use hls.js
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      return () => hls.destroy();
    }

    // Fallback
    video.src = src;
  }, [src]);

  return (
    <video
      ref={videoRef}
      controls
      style={{ width: '100%', maxWidth: 960, borderRadius: 12, background: 'black' }}
    />
  );
}
