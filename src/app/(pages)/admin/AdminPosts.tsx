
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Eye, Trash2, AlertTriangle, Search, Check } from 'lucide-react';
import Link from 'next/link';

export default function AdminPosts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    fetchPosts();
  }, []);
  
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles:user_id (
          username,
          full_name,
          avatar_url,
          email,
          is_blocked
        ),
        likes (
          id
        ),
        comments (
          id
        )
      `)
      .order('created_at', { ascending: false });
    
      setPosts((data || []).map(post => ({
        ...post,
        likes_count: post.likes?.length || 0,
        comments_count: post.comments?.length || 0,
      })));
      
        
      if (error) throw error;
   
    } catch (error: any) {
      console.error('Error fetching posts:', error);
      toast.error(`Failed to load posts: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) return;
    
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);
        
      if (error) throw error;
      
      setPosts(posts.filter(post => post.id !== postId));
      toast.success('Post deleted successfully');
    } catch (error: any) {
      console.error('Error deleting post:', error);
      toast.error(`Failed to delete post: ${error.message}`);
    }
  };

  const approvePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ is_approved: true })
        .eq('id', postId);
        
      if (error) throw error;
      
      setPosts(posts.map(post => 
        post.id === postId ? { ...post, is_approved: true } : post
      ));
      
      toast.success('Post approved successfully');
    } catch (error: any) {
      console.error('Error approving post:', error);
      toast.error(`Failed to approve post: ${error.message}`);
    }
  };
  
  const filteredPosts = searchTerm 
    ? posts.filter(post => 
        post.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        post.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.profiles?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : posts;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Content Moderation</h2>
        <div className="relative">
          <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search posts..."
            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md w-64 dark:bg-gray-700 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bharat-orange mx-auto"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">Loading posts...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <div 
                key={post.id} 
                className={`border rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm ${
                  !post.is_approved ? 'border-yellow-400 dark:border-yellow-600' : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="p-4 sm:p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {post.title}
                      </h3>
                      <div className="flex items-center mt-1">
                        <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mr-2">
                          {post.profiles?.avatar_url ? (
                            <img 
                              src={post.profiles.avatar_url} 
                              alt={post.profiles.username || 'User'} 
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-500 font-semibold">
                              {(post.profiles?.username?.charAt(0) || 'U').toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Posted by {post.profiles?.full_name || post.profiles?.username || 'Unknown user'} 
                          <span className="mx-1">•</span>
                          {new Date(post.created_at).toLocaleDateString()}
                          {post.profiles?.is_blocked && (
                            <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200">
                              Blocked User
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {!post.is_approved && (
                        <button
                          onClick={() => approvePost(post.id)}
                          className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                          title="Approve post"
                        >
                          <Check className="h-5 w-5" />
                        </button>
                      )}
                      <Link
                        href={`/posts/${post.id}`}
                        className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        title="View post"
                      >
                        <Eye className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => deletePost(post.id)}
                        className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        title="Delete post"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  {post.media_url && (
                    <div className="mt-4 h-48 overflow-hidden rounded-md">
                      <img 
                        src={post.media_url} 
                        alt={post.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                      {post.content}
                    </p>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex space-x-4">
                      <span>{post.likes_count || 0} likes</span>
                      <span>{post.comments_count || 0} comments</span>
                      <span>{post.views || 0} views</span>
                    </div>
                    {!post.is_approved && (
                      <div className="flex items-center text-yellow-600 dark:text-yellow-400">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        <span>Awaiting approval</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-12 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-lg">
              {searchTerm ? 'No posts found matching your search' : 'No posts found'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}