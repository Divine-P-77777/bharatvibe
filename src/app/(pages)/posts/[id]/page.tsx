
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
import dynamic from 'next/dynamic';
import { cn } from "@/lib/utils"


export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const isDarkMode = useAppSelector(state => state.theme.isDarkMode);
  
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
        
        // Increment view count
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
        <div className="bharat-container py-16">
          <Card className={isDarkMode ? 'bg-gray-800 text-white border-gray-700' : ''}>
            <CardContent className="p-6">
              <div className="space-y-6">
                <Skeleton className={`h-8 w-3/4 ${isDarkMode ? 'bg-gray-700' : ''}`} />
                <div className="flex items-center space-x-4">
                  <Skeleton className={`h-12 w-12 rounded-full ${isDarkMode ? 'bg-gray-700' : ''}`} />
                  <Skeleton className={`h-4 w-40 ${isDarkMode ? 'bg-gray-700' : ''}`} />
                </div>
                <Skeleton className={`h-64 w-full ${isDarkMode ? 'bg-gray-700' : ''}`} />
                <div className="space-y-3">
                  <Skeleton className={`h-4 w-full ${isDarkMode ? 'bg-gray-700' : ''}`} />
                  <Skeleton className={`h-4 w-full ${isDarkMode ? 'bg-gray-700' : ''}`} />
                  <Skeleton className={`h-4 w-3/4 ${isDarkMode ? 'bg-gray-700' : ''}`} />
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
        <div className="bharat-container py-16">
          <Card className={isDarkMode ? 'bg-gray-800 text-white border-gray-700' : ''}>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground py-12">Post not found</p>
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
      <div className="bharat-container py-16">
        <Card className={`overflow-hidden ${isDarkMode ? 
          'bg-gradient-to-r from-black-400 to-gray-900 shadow-orange-600 text-orange-500 border-gray-700' : 
          'bg-gradient-to-r from-amber-400 to-rose-400 shadow-gray-600 text-white'}`}>
          <CardContent className="p-0">
            {post.media_url && (
              <div className="relative h-[40vh]">
                <Image 
                  src={post.media_url}
                  alt={post.title}
                  fill
                  sizes="100vw"
                  style={{ objectFit: 'cover' }}
                  priority
                />
              </div>
            )}
            <div className="p-6 glass-effect">
              <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    {post.profiles?.avatar_url ? (
                      <Image 
                        src={post.profiles.avatar_url}
                        alt={post.profiles.username || 'User'}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    ) : (
                      <span className="text-gray-500 text-lg">{(post.profiles?.username || 'U')[0].toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{post.profiles?.full_name || post.profiles?.username || 'Anonymous'}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(post.created_at).toLocaleDateString()}
                      {post.state && ` • ${post.state}`}
                    </p>
                  </div>
                </div>
                <PostLikeButton postId={post.id} initialLikesCount={post.likes_count?.count || 0} />

              </div>
              
              {post.content && (
                <div className="prose max-w-none mb-6">
                  {post.content.split('\n').map((line: string, i: number) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              )}

              {(post.latitude && post.longitude) && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h3 className="text-sm font-medium mb-2">Location</h3>
                  <p className="text-sm">Latitude: {post.latitude}, Longitude: {post.longitude}</p>
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
        
        <div className="mt-8">
        <CommentSection postId={post.id} postOwnerId={post.user_id} />
        </div>
      </div>
      <Footer />
    </div>
  );
}