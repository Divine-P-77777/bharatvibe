'use client';

import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';

interface PostsMapProps {
  posts: Array<{
    id: string;
    title: string;
    media_url?: string | null;
    type: string;
  }>;
  isDarkMode: boolean;
}

export default function PostsMap({ posts }: PostsMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const router = useRouter();
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([22.5937, 78.9629], 4);
    mapInstanceRef.current = map;

    const tileUrl = isDarkMode
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const attribution = isDarkMode
      ? '&copy; <a href="https://carto.com/">Carto</a>'
      : '© OpenStreetMap contributors';

    L.tileLayer(tileUrl, { attribution }).addTo(map);

    (posts.slice(0, 300) || []).forEach((post) => {
      const lat = 19 + Math.random() * 10;
      const lon = 77 + Math.random() * 10;

      const icon = L.divIcon({
        html: `<img src="${post.media_url || '/not_found.gif'}"
                    style="width:40px;height:40px;border-radius:9999px;border:2px solid white;" />`,
        className: '', 
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20],
      });

      const marker = L.marker([lat, lon], { icon }).addTo(map);
      marker.bindPopup(`<strong>${post.title}</strong>`);

      marker.on('dblclick', () => router.push(`/posts/${post.id}`));
    });
  }, [posts, isDarkMode, router]);

  return (
    <div
      ref={mapRef}
      className="w-full z-0 h-[350px] md:h-[400px] rounded-lg overflow-hidden bg-gray-200 mt-4"
    />
  );
}
