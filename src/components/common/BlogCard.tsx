'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function BlogCard({
  blog,
}: {
  blog: {
    id: string;
    title: string;
    content: string;
    slug: string;
  };
}) {
  return (
    <div className="p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg max-w-xs min-w-[280px]">
      <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        {blog.content.slice(0, 20)}...
      </p>
      <Link
        href={`/blogs/${blog.slug}`}
        className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline text-sm"
      >
        Read More
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
