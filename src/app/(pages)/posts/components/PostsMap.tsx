'use client';

import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';


interface PostsMapProps {
  posts: Array<{
    id: string;
    title: string;
    media_url?: string | null;
    type: string;
  }>;
}

export default function PostsMap({ posts }: PostsMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null); // to prevent reinitialization
  const leafletRef = useRef<any>(null);

  useEffect(() => {
    const initializeMap = async () => {
      const L = await import('leaflet');
      leafletRef.current = L;

      if (!mapRef.current || mapInstanceRef.current) return;

      const map = L.map(mapRef.current).setView([22.5937, 78.9629], 4);
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      posts.forEach(post => {
        const lat = 19 + Math.random() * 10;
        const lon = 77 + Math.random() * 10;

        const marker = L.marker([lat, lon]).addTo(map);
        marker.bindPopup(`<strong>${post.title}</strong>`);
      });
    };

    initializeMap();
  }, [posts]);

  return (
    <div
      ref={mapRef}
      className="w-full h-[350px] md:h-[400px] rounded-lg overflow-hidden bg-gray-200 mt-4"
    />
  );
}
