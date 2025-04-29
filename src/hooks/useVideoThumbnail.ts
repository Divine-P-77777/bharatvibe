"use client"
import { useEffect, useState } from 'react';

export default function useVideoThumbnail(videoUrl: string) {
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  useEffect(() => {
    const generateThumbnail = async () => {
      const video = document.createElement('video');
      video.src = videoUrl;
      video.crossOrigin = 'anonymous';
      video.currentTime = 5;

      video.addEventListener('loadeddata', () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setThumbnail(dataUrl);
      });

      video.load();
    };

    if (videoUrl) generateThumbnail();
  }, [videoUrl]);

  return thumbnail;
}
