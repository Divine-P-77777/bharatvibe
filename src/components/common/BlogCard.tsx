'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAppSelector } from '@/store/hooks';

export default function BlogCard({
  blog,
}: {
  blog: {
    id: string;
    media_url?: string;
    title: string;
    content: string;
  };
}) {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const imageSrc =
    blog.media_url && blog.media_url.trim() !== ''
      ? blog.media_url.startsWith('http')
        ? blog.media_url
        : '/' + blog.media_url
      : '/fallback.jpg'; // fallback image

  return (
    <div className="p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg w-full">
      <div className="relative w-full h-40 rounded-lg overflow-hidden mb-4">
        <Image
          src={imageSrc}
          alt={blog.title}
          fill
          className="object-cover"
          priority
        />
      </div>
      <h3 className="text-lg sm:text-xl font-semibold mb-2">
        {blog.title.slice(0, 50)}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        {(blog.content || '').slice(0, 100)}...
      </p>

      <Link
        href={`/posts/${blog.id}`}
        className="inline-flex btn-grad sm:text-xl py-1 sm:py-2 text-lg items-center gap-2 text-primary"
      >
        Read More
      </Link>
    </div>
  );
}
