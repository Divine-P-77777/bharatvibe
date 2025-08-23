
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Navbar from '@/components/layout/UserNav';
import Footer from '@/components/layout/Footer';
import CommentSection from '../components/CommentsSection';
import PostLikeButton from '../components/PostLikeButton';
import Image from 'next/image';
import { useAppSelector } from '@/store/hooks';
import { cn } from "@/lib/utils"
import VideoPlayerWithThumbnail from '../components/VideoPlayerWithThumbnail';
import {  Share2} from 'lucide-react';
import Link from 'next/link';
import Lenis from "@studio-freight/lenis";
import ImageWithPreview from '@/components/ui/ImageWithPreview';


export default function ExplorePostDetail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const isDarkMode = useAppSelector(state => state.theme.isDarkMode);
  const [imgError, setImgError] = useState(false);

  // Smooth Scroll Effect
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: false,
    } as unknown as ConstructorParameters<typeof Lenis>[0]);


    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);



  const handleError = () => {
    setImgError(true);
  };

  const formatImageUrl = (url: string | undefined) => {
    if (!url) return '/not_found.gif';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (!url.startsWith('/')) return '/' + url;
    return url;
  };


  useEffect(() => {
    async function fetchPost() {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select(`
            *,
            profiles:user_id (username, avatar_url, full_name),
            likes_count: likes (count),
            comments_count: comments (count)
          `)
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        setPost(data);


        await supabase.rpc('increment_post_views', { post_id: id });

      } catch (error: any) {
        toast.error(`Error loading post: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchPost();
    }
  }, [id]);

  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Navbar />
        <div className="py-20 px-4 sm:px-6 lg:px-8">
          <Card
            className={cn(
              "max-w-4xl mx-auto border",
              isDarkMode
                ? "bg-gray-800 text-white border-gray-700"
                : "bg-white text-black border-gray-200"
            )}
          >
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <div className="space-y-6">
                <Skeleton className={`h-8 w-3/4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                <div className="flex items-center space-x-4">
                  <Skeleton className={`h-12 w-12 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                  <Skeleton className={`h-4 w-40 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                </div>
                <Skeleton className={`h-64 w-full rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                <div className="space-y-3">
                  <Skeleton className={`h-4 w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                  <Skeleton className={`h-4 w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                  <Skeleton className={`h-4 w-3/4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Navbar />
        <div className="py-20 px-4 sm:px-6 lg:px-8">
          <Card
            className={cn(
              "max-w-4xl mx-auto border",
              isDarkMode
                ? "bg-gray-800 text-white border-gray-700"
                : "bg-white text-black border-gray-200"
            )}
          >
            <CardContent className="p-6 sm:p-8 lg:p-10">
              <p className="text-center text-muted-foreground py-12 text-lg">Post not found</p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }


  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Navbar />
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <Card
          className={cn(
            "max-w-4xl mx-auto overflow-hidden text-black",
            isDarkMode
              ? "bg-gradient-to-br from-gray-800 via-black to-gray-900 text-white border border-gray-700"
              : "bg-gradient-to-br from-orange-100 via-rose-100 to-amber-100 text-black border border-gray-200"
          )}
        >
          <CardContent className="px-4 sm:px-6 lg:px-8">
            <Link href="/posts" className="self-start w-fit mt-2 px-4 py-1 btn-grad2 ">
              ← Back to Explore
            </Link>
            {post.media_url && (
              <div className="w-full flex justify-center overflow-x-auto p-4">

                <div className='flex flex-col'>

                  {post.media_url.includes("video") ? (
                    <div className="max-w-full overflow-x-auto">
                      <VideoPlayerWithThumbnail url={post.media_url} />
                    </div>
                  ) : post.media_url.endsWith(".pdf") ? (
                    <div className="flex flex-col items-center p-4 bg-black/10 dark:bg-white/10 rounded-2xl">
                      <Image
                        src={formatImageUrl(post.media_url)}
                        alt="PDF Preview"
                        width={600}
                        height={800}
                        className="rounded-2xl object-cover"
                        onError={handleError}
                      />
                      <a
                        href={post.media_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 text-sm text-bharat-orange hover:underline"
                      >
                        Open PDF in new tab
                      </a>
                    </div>
                  ) : (
                    <ImageWithPreview post={post} />
                  )}
                </div>
              </div>
            )}


            <div className={cn("p-4 sm:p-6 lg:p-8 rounded-2xl", isDarkMode ? "text-white" : "text-black")}>
              <h1 className="text-2xl sm:text-3xl font-bold mb-4">{post.title}</h1>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <div className="flex items-center gap-3">
                  <Link href={`/profile/${post.profiles.username}`} className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden hover:shadow-red-400 shadow-md cursor-pointer">
                    {post.profiles?.avatar_url ? (
                      <Image
                        src={post.profiles.avatar_url}
                        alt={post.profiles.username || 'User'}
                        width={40}
                        height={40}
                        className={` ${isDarkMode ? "border-amber-500" : "border-black"}rounded-full  border`}
                      />
                    ) : (
                      <span className="text-gray-500 text-lg">
                        {(post.profiles?.username || 'U')[0].toUpperCase()}
                      </span>
                    )}
                  </Link>
                  <div>
                    <p className="font-medium">
                      {post.profiles?.username || post.profiles?.full_name || 'Anonymous'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(post.created_at).toLocaleDateString()}
                      {post.state && ` • ${post.state}`}
                    </p>
                  </div>
                </div>
                <div className='flex justify-center items-center gap-5 '>
                  <PostLikeButton postId={post.id} initialLikesCount={post.likes_count?.count || 0} />
                  <button
                    onClick={() =>
                      navigator.share?.({
                        title: post.title,
                        url: location.origin + "/posts/" + post.id,
                      })
                    }
                    className="text-xs text-green-600 font-bold hover:underline flex items-center gap-1"
                  >
                    <Share2 className="w-4 h-4" />
                  </button></div>

              </div>

              {post.content && (
                <div className="prose max-w-none mb-6 text-base sm:text-lg">
                  {post.content.split('\n').map((line: string, i: number) => (
                    <p className="inter" key={i}>{line}</p>
                  ))}
                </div>
              )}

              {(post.latitude && post.longitude) && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h3 className="text-sm font-medium mb-2">Location</h3>

                  <a
                    href={`https://www.google.com/maps?q=${post.latitude},${post.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-bharat-orange hover:underline mt-1 inline-block"
                  >
                    View on Google Maps
                  </a>
                </div>
              )}

              {post.map_url && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Map Location</h3>
                  <a
                    href={post.map_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-bharat-orange hover:underline"
                  >
                    View location on map
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div
          className="max-h-[400px] overflow-y-auto"
          onWheel={(e) => e.stopPropagation()}
        >
          <CommentSection postId={post.id} postOwnerId={post.user_id} />
        </div>

      </div>
      <Footer />
    </div>
  );

}