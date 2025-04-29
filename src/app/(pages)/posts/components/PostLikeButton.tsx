'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';

interface PostLikeButtonProps {
  postId: string;
  initialLikesCount?: number;
}

export default function PostLikeButton({ postId }: PostLikeButtonProps) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchLikeState();
    }
  }, [user, postId]);

  const fetchLikeState = async () => {
    try {
      const { count, error: countError } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId);
  
      if (countError) throw countError;
  
      const { data: isLikedData, error: likedError } = await supabase
        .from('likes')
        .select('*')
        .eq('post_id', postId)
        .eq('user_id', user?.id)
        .maybeSingle();
  
      if (likedError) throw likedError;
  
      setLikesCount(count || 0);
      setLiked(!!isLikedData);
    } catch (error) {
      console.error('Failed to load likes:', error instanceof Error ? error.message : error);
    }
  };
  
  const toggleLike = async () => {
    if (!user) {
      toast.error('Please sign in to like posts');
      return;
    }

    setLoading(true);
    try {
      if (liked) {
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        if (error) throw error;
        setLiked(false);
        setLikesCount((prev) => Math.max(0, prev - 1));
      } else {
        const { error } = await supabase
          .from('likes')
          .insert({ post_id: postId, user_id: user.id });

        if (error) throw error;
        setLiked(true);
        setLikesCount((prev) => prev + 1);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={toggleLike}
      disabled={loading || !user}
      variant="ghost"
      size="icon"
      className="flex gap-1 items-center"
    >
      <Heart className={`h-5 w-5 ${liked ? 'text-red-500 fill-red-500' : ''}`} />
      <span className="text-sm font-medium">{likesCount}</span>
    </Button>
  );
}