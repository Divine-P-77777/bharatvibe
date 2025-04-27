'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAppSelector } from '@/store/hooks';

export default function BlogCard({
  blog,
}: {
  blog: {
    id: string;
    image: string;
    title: string;
    content: string;
    slug: string;
  };
}
) {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  return (
    <div className="p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg w-full">
      <div className="relative w-full h-40 rounded-lg overflow-hidden mb-4">
        <Image
          src={blog.image}
          alt={blog.title}
          fill
          className="object-cover"
          priority
        />
      </div>
      <h3 className="text-lg sm:text-xl font-semibold mb-2">{blog.title.slice(0,20)}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        {blog.content.slice(0, 30)}...
      </p>
      <Link
        href={`/blogs/${blog.slug}`}
        className={`inline-flex btn-grad sm:text-xl py-1  sm:py-2 text-lg ${isDarkMode ?"":""} items-center gap-2 text-primary `}
      >
        Read More
      </Link>
    </div>
  );
}
