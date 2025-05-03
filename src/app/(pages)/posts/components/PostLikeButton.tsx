'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import Popup from '@/components/ui/Popup'; // Import your Popup component
import { useRouter } from 'next/navigation';

interface PostLikeButtonProps {
  postId: string;
  initialLikesCount?: number;
}

export default function PostLikeButton({ postId }: PostLikeButtonProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

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
      setShowPopup(true);
      toast.error("Please sign in to make your opinion count.");
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

  const handleSignIn = () => {
    router.push("/auth");
  };

  return (
    <>
      <button
        onClick={toggleLike}
        disabled={loading}
        className="flex gap-1 items-center"
      >
        <Heart className={`h-5 w-5 ${liked ? 'text-red-500 fill-red-500' : ''}`} />
        <span className="text-sm font-medium">{likesCount}</span>
      </button>

      <Popup isOpen={showPopup} onClose={() => setShowPopup(false)}>
        <h2 className="text-lg font-semibold mb-4">Sign in to make your opinion count</h2>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleSignIn}
          >
            Sign In
          </button>
          <button
            className="px-4 py-2 rounded-full bg-gray-400 text-black hover:bg-gray-500"
            onClick={() => setShowPopup(false)}
          >
            Cancel
          </button>
        </div>
      </Popup>
    </>
  );
}
