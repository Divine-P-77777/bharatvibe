// file: components/CommentsSection.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { toast } from '@/hooks/use-toast';
import { Trash2, CornerDownRight, X } from 'lucide-react';
import Link from 'next/link';
import { containsAbuseWords, filterAbuseWords } from '@/lib/content-filter';
import { useAppSelector } from '@/store/hooks';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';

interface CommentsSectionProps {
  postId: string;
  postOwnerId: string;
}

export default function CommentsSection({ postId, postOwnerId }: CommentsSectionProps) {
  const { user } = useAuth();
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyingToName, setReplyingToName] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchComments();
    const channel = supabase
      .channel('comments-on-post')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'comments' }, handleRealtime)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId]);

  const handleRealtime = () => fetchComments();

  const buildCommentTree = (flatComments: any[]) => {
    const commentMap = new Map();
    const roots = [];
    for (const comment of flatComments) {
      comment.replies = [];
      commentMap.set(comment.id, comment);
    }
    for (const comment of flatComments) {
      if (comment.parent_comment_id) {
        const parent = commentMap.get(comment.parent_comment_id);
        parent?.replies.unshift(comment);
      } else {
        roots.unshift(comment);
      }
    }
    return roots;
  };

  const fetchComments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('comments')
      .select('*, profiles: user_id (full_name, username, avatar_url)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (!error) {
      const nestedComments = buildCommentTree(data || []);
      setComments(nestedComments);
    }
    setLoading(false);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast({ title: 'Sign in to comment.' });
    if (!newComment.trim()) return;
    if (containsAbuseWords(newComment)) return toast({ title: 'Inappropriate language is not allowed.' });

    setPosting(true);
    const filtered = filterAbuseWords(newComment);

    const { error } = await supabase.rpc('insert_comment', {
      p_post_id: postId,
      p_user_id: user.id,
      p_content: filtered,
      p_parent_comment_id: replyingToId
    });

    if (error) toast({ title: 'Failed to post comment', description: error.message });
    else {
      setNewComment('');
      setReplyingToId(null);
      setReplyingToName(null);
    }

    setPosting(false);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 200);
  };

  const handleDelete = async (commentId: string) => {
    if (!user) return;
    await supabase.rpc('delete_comment_if_allowed', {
      p_comment_id: commentId,
      p_requestor_id: user.id,
    });
  };

  const handleReply = (commentId: string, username: string) => {
    setReplyingToId(commentId);
    setReplyingToName(username);
    inputRef.current?.focus();
  };

  const renderComment = (comment: any) => (
    <motion.div
      key={comment.id}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="ml-0 sm:ml-4 mb-3"
    >
      <div
        className={`group flex items-start gap-3 p-2 mx-4 rounded border transition ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-orange-50 border-zinc-300 text-black'
          }`}
      >
        <Link href={`/profile/${comment.profiles?.username || 'user'}`}>
          <Image
            src={comment.profiles?.avatar_url || '/placeholder.svg'}
            alt={comment.profiles?.username || 'User'}
            width={32}
            height={32}
            className="w-8 h-8 rounded-full"
          />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">{comment.profiles?.username || 'User'}</span>
            <span className="text-xs text-gray-400">{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}</span>
          </div>
          <div className="text-[15px] whitespace-pre-wrap mt-1">{comment.content}</div>

        </div>
        <div className="flex gap-2 items-center mt-1 text-xs">
          {(user?.id === comment.user_id || user?.id === postOwnerId) && (
            <button
              onClick={() => handleDelete(comment.id)}
              className="text-red-400 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() =>
              handleReply(comment.id, comment.profiles?.username || 'User')
            }
            className="text-blue-500 hover:text-blue-700"
          >
            <CornerDownRight className="w-4 h-4 inline" /> Reply
          </button>
        </div>

      </div>
      {comment.replies?.length > 0 && <div className="ml-6">{comment.replies.map(renderComment)}</div>}
    </motion.div>
  );

  return (
    <div
      className={`w-full max-w-3xl mx-auto px-2 py-4 rounded-xl shadow-sm relative ${isDarkMode ? 'bg-zinc-950 border border-zinc-800 text-white' : 'bg-white border border-zinc-200 text-black'
        }`}
    >
      <h3 className="text-lg font-semibold mb-3">Comments</h3>
      {user ? (
        <form onSubmit={handleAddComment} className="flex gap-2 mb-4 relative">
          <input
            ref={inputRef}
            className={`flex-1 border px-3 py-2 rounded focus:outline-none ${isDarkMode ? 'bg-zinc-800 text-white border-zinc-700' : 'bg-white border-zinc-300 text-black'
              }`}
            placeholder={replyingToName ? `Replying to @${replyingToName}...` : 'Write a comment...'}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            maxLength={500}
            disabled={posting}
          />
          {replyingToName && (
            <button
              type="button"
              className="absolute right-[70px] top-[6px] text-gray-400 hover:text-red-500"
              onClick={() => {
                setReplyingToId(null);
                setReplyingToName(null);
              }}
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <Button type="submit" disabled={!newComment.trim() || posting}>
            Post
          </Button>
        </form>
      ) : (
        <div className="mb-4 text-sm text-gray-500 italic flex items-center gap-2">
          <div>Login to comment.</div>
          <Link href="/auth">
            <button className="btn-grad px-5 py-2">Sign In</button>
          </Link>
        </div>
      )}

      <div className="space-y-3 max-h-64 overflow-y-auto hover:overflow-y-scroll overflow-hidden">
        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : comments.length === 0 ? (
          <div className="text-gray-400">No comments yet. Be the first to comment!</div>
        ) : (
          <AnimatePresence>{comments.map(renderComment)}</AnimatePresence>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}