
'use client';

import { useState, useEffect } from 'react';
import { Heart, HeartOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';

interface PostLikeButtonProps {
  postId: string;
  initialLikesCount: number;
}

export default function PostLikeButton({ postId, initialLikesCount = 0 }: PostLikeButtonProps) {
  const { user } = useAuth();
  const [liked, setLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(initialLikesCount || 0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      checkIfLiked();
    }
  }, [user, postId]);

  async function checkIfLiked() {
    try {
      const { data } = await supabase
        .from('likes')
        .select('*')
        .eq('post_id', postId)
        .eq('user_id', user?.id)
        .single();
      
      setLiked(!!data);
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  }

  async function toggleLike() {
    if (!user) {
      toast.error('Please sign in to like posts');
      return;
    }

    setLoading(true);
    
    try {
      if (liked) {
        // Unlike
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        setLiked(false);
        setLikesCount(prev => Math.max(0, prev - 1));
      } else {
        // Like
        const { error } = await supabase
          .from('likes')
          .insert({ post_id: postId, user_id: user.id });
        
        if (error) throw error;
        
        setLiked(true);
        setLikesCount(prev => prev + 1);
      }
    } catch (error: any) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-1">
      <Button 
        onClick={toggleLike}
        disabled={loading || !user}
        variant="ghost"
        size="sm"
        className="p-1 h-auto"
      >
        {liked ? (
          <Heart className="h-5 w-5 text-red-500 fill-red-500" />
        ) : (
          <Heart className="h-5 w-5" />
        )}
      </Button>
      <span className="text-sm font-medium">
        {likesCount} {likesCount === 1 ? 'Like' : 'Likes'}
      </span>
    </div>
  );
}