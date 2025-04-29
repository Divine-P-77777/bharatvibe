
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { toast } from "@/hooks/use-toast";
import { Trash2 } from 'lucide-react';
import Link from "next/link"
import { containsAbuseWords, filterAbuseWords } from "@/lib/content-filter";


interface CommentsSectionProps {
  postId: string;
  postOwnerId: string;
}


export default function CommentsSection({ postId, postOwnerId }: CommentsSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [ReplyingToId, setReplyingToId] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchComments();
    const channel = supabase
      .channel('comments-on-post')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'comments',
      }, handleRealtime)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const handleRealtime = (payload: any) => {
    if (payload.eventType === 'INSERT') {
      setComments(prev => [...prev, payload.new]);
    } else {
      fetchComments(); // fallback for updates/deletes
    }
  };

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
        parent?.replies.push(comment);
      } else {
        roots.push(comment);
      }
    }
  
    return roots;
  };
  

  const fetchComments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('comments')
      .select(`*, profiles: user_id (full_name, username, avatar_url)`)
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
    if (!user) {
      toast({ title: "Sign in to comment." });
      return;
    }
  
    if (!newComment.trim()) return;
  
    if (containsAbuseWords(newComment)) {
      toast({ title: "Inappropriate language is not allowed." });
      return;
    }
  
    setPosting(true);
  
    const filtered = filterAbuseWords(newComment); // Optional: filter or reject
  
    const { error } = await supabase.from('comments').insert({
      post_id: postId,
      user_id: user.id,
      content: filtered,
      parent_comment_id: ReplyingToId || null,
    });
  
    if (error) {
      toast({ title: "Failed to post comment", description: error.message });
    } else {
      setNewComment('');
      setReplyingToId(null);
    }
  
    setPosting(false);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 200);
  };
  

  const handleDelete = async (commentId: string) => {
    if (!user) return;
    await supabase.from('comments').delete().eq('id', commentId);
    // fetchComments();
  };

  const renderComment = (comment: any) => (
    <div key={comment.id} className="ml-0 sm:ml-4 mb-2">
      <div className="flex items-start gap-3 bg-orange-50 rounded p-2">
        <img src={comment.profiles?.avatar_url || '/placeholder.svg'} className="w-8 h-8 rounded-full" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{comment.profiles?.full_name || comment.profiles?.username || 'User'}</span>
            <span className="text-xs text-gray-400">{new Date(comment.created_at).toLocaleString()}</span>
          </div>
          <div className="text-[15px] whitespace-pre-wrap">{comment.content}</div>
          <div className="text-xs mt-1">
            <button
              onClick={() => setReplyingToId(comment.id)}
              className="text-blue-600 hover:underline"
            >
              Reply
            </button>
          </div>
        </div>
        {(user?.id === comment.user_id || user?.id === postOwnerId) && (
          <button onClick={() => handleDelete(comment.id)} className="text-red-400 hover:text-red-600 p-1">
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>
      {/* Recursively render replies */}
      {comment.replies?.length > 0 && (
        <div className="ml-6">
          {comment.replies.map((reply: any) => renderComment(reply))}
        </div>
      )}
    </div>
  );
  

  return (
    <div className="w-full max-w-2xl mx-auto px-2">
      <h3 className="text-lg font-semibold mb-2">Comments</h3>
      {user ? (
        <form onSubmit={handleAddComment} className="flex gap-2 mb-4">
          <input
            className="flex-1 border px-3 py-2 rounded focus:outline-bharat-orange"
            placeholder="Write a comment..."
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            maxLength={500}
            disabled={posting}
          />
          <Button type="submit" disabled={!newComment.trim() || posting}>Post</Button>
        </form>
      ) : (
        <div className="mb-4 text-sm text-gray-500 italic flex items-center gap-2">
          <div>Login to comment.</div>
          <Link href="/auth">
            <button className='btn-grad px-5 py-2' >Sign In</button></Link>


        </div>
      )}

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : comments.length === 0 ? (
          <div className="text-gray-400">No comments yet. Be the first to comment!</div>
        ) : (
          comments.map(renderComment)


        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}