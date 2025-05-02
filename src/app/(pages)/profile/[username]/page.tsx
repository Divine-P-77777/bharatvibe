// app/profile/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useAppSelector } from '@/store/hooks';

import UserNav from '@/components/layout/UserNav';
import Footer from '@/components/layout/Footer';
import Loader from '@/components/ui/loader';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import Popup from '@/components/ui/Popup';
import { Trash2 } from 'lucide-react';
import { useParams } from 'next/navigation';

const VideoPlayerWithThumbnail = dynamic(() => import('@/app/(pages)/posts/components/VideoPlayerWithThumbnail'), { ssr: false });
const StatsPanel = dynamic(() => import('../StatsPanel'), { ssr: false });
const ProfileCard = dynamic(() => import('../ProfileCard'), { ssr: false });

interface Post {
    id: string;
    title: string;
    type: string;
    media_url?: string;
    created_at: string;
    user_id: string;
}

interface Profile {
    id: string;
    username: string;
    email: string;
    created_at: string;
}



const PDFViewer = ({ url, fallback_gif_url }: { url: string; fallback_gif_url: string }) => {
    const [pdfFailed, setPdfFailed] = useState(false);
    const [isPdf, setIsPdf] = useState(true);

    useEffect(() => {
        if (!url.endsWith('.pdf')) setIsPdf(false);
    }, [url]);

    useEffect(() => {
        const timer = setTimeout(() => setPdfFailed(true), 5000);
        return () => clearTimeout(timer);
    }, [url]);

    const handleLoad = () => setPdfFailed(false);

    return isPdf && !pdfFailed ? (
        <iframe src={url} width="100%" height="600px" className="rounded-md" style={{ border: 'none' }} onLoad={handleLoad} />
    ) : (
        <img src={fallback_gif_url} alt="Fallback GIF" className="rounded-md w-full h-[600px] object-cover" />
    );
};

export default function ProfilePage() {
    const { user } = useAuth();
    const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
    const params = useParams();
    const username = typeof params?.username === 'string' ? params.username : Array.isArray(params?.username) ? params.username[0] : '';

    const [profile, setProfile] = useState<Profile | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
    const [page, setPage] = useState(1);

    const isOwnProfile = username === user?.user_metadata?.username;

    const formatImageUrl = (url?: string) => {
        if (!url) return '/not_found.gif';
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        return '/' + url;
    };

    const deletePost = async () => {
        if (!selectedPostId) return;
        await supabase.from('posts').delete().eq('id', selectedPostId);
        setPosts((prev) => prev.filter((p) => p.id !== selectedPostId));
        setShowPopup(false);
        setSelectedPostId(null);
    };

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const fetchProfile = async () => {
            const { data } = await supabase.from('profiles').select('*').eq('username', username).single();
            if (data) setProfile(data);
        };
        fetchProfile();
    }, [username]);

    useEffect(() => {
        if (profile?.id) {
            supabase.from('posts')
                .select('id, title, type, media_url, created_at, user_id')

                .eq('user_id', profile.id)
                .order('created_at', { ascending: false })
                .range((page - 1) * 10, page * 10 - 1)
                .then(({ data }) => {
                    if (data) setPosts(data);
                });
        }
    }, [profile, page]);

    useEffect(() => {
        if (!user) {
            const interval = setInterval(() => {
                setShowPopup(true);
            }, 120000);
            return () => clearInterval(interval);
        }
    }, [user]);

    if (!profile) return null;

    return (
        <div className={isDarkMode ? 'bg-black text-white min-h-screen' : 'bg-orange-50 text-black min-h-screen'}>
            {loading && <Loader />}
            <UserNav />
            <div className="max-w-5xl mx-auto py-10 px-4">
                <div className="mb-10 mt-10">
                    <ProfileCard
                        user={{ ...profile, email: isOwnProfile ? profile.email : '', created_at: profile.created_at }}
                        isOwnProfile={isOwnProfile}
                    />
                    {!isOwnProfile && (
                        <p className="text-sm text-muted-foreground mt-2">
                            Member since: {new Date(profile.created_at).toLocaleDateString()}
                        </p>
                    )}
                </div>

                {isOwnProfile && (
                    <div className="mb-12">
                        <StatsPanel />
                    </div>
                )}

                <div className="mt-10">
                    <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-orange-500' : 'text-black'}`}>
                        {isOwnProfile ? 'Your Posts' : `${profile.username}'s Posts`}
                    </h3>
                    {posts.length === 0 ? (
                        <p className="text-muted-foreground">No posts yet</p>
                    ) : (
                        <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
                            {posts.map((post) => (
                                <div
                                    key={post.id}
                                    className={`break-inside-avoid border rounded-lg p-4 shadow-sm relative ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white'}`}
                                >
                                    <p className="text-sm text-gray-500">{post.type.toUpperCase()}</p>
                                    <h4 className="font-semibold text-lg mb-1">{post.title}</h4>

                                    {post.media_url?.endsWith('.pdf') ? (
                                        <PDFViewer url={post.media_url} fallback_gif_url="/pdf_fallback.gif" />
                                    ) : post.media_url?.includes('video') ? (
                                        <VideoPlayerWithThumbnail url={post.media_url} />
                                    ) : post.media_url ? (
                                        <Image
                                            src={formatImageUrl(post.media_url)}
                                            alt="media"
                                            className="rounded-lg w-full object-cover"
                                            width={500}
                                            height={500}
                                        />
                                    ) : (
                                        <Image
                                            src="/not_found.gif"
                                            alt="No media"
                                            className="rounded-lg w-full object-cover"
                                            width={500}
                                            height={500}
                                        />
                                    )}

                                    <div className="flex gap-2 mt-2">
                                        <Link href={`/posts/${post.id}`} className="btn-grad2 px-4 py-1 text-sm">View</Link>
                                        {post.user_id === user?.id && (
                                            <button
                                                onClick={() => {
                                                    setSelectedPostId(post.id);
                                                    setShowPopup(true);
                                                }}
                                                className="ml-auto p-1 rounded-full text-red-500 hover:bg-red-100"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="flex justify-center mt-6 gap-4">
                        <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1} className="px-4 py-2 rounded bg-gray-300">Prev</button>
                        <span className="self-center">Page {page}</span>
                        <button onClick={() => setPage((p) => p + 1)} className="px-4 py-2 rounded bg-gray-300">Next</button>
                    </div>
                </div>
            </div>
            <Footer />

            <Popup isOpen={showPopup} onClose={() => setShowPopup(false)}>
                {user ? (
                    <>
                        <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
                        <p className="mb-6">Are you sure you want to delete this post? This action cannot be undone.</p>
                        <div className="flex justify-end gap-4">
                            <button className="px-4 py-2 rounded bg-gray-200" onClick={() => setShowPopup(false)}>Cancel</button>
                            <button className="px-4 py-2 rounded bg-red-500 text-white" onClick={deletePost}>Delete</button>
                        </div>
                    </>
                ) : (
                    <>
                        <h3 className="text-lg font-semibold mb-2">Please Login</h3>
                        <p className="mb-4">To continue exploring profiles on BharatVibes, please log in.</p>
                        <Link href="/auth" className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-xl shadow">
                            Login
                        </Link>
                    </>
                )}
            </Popup>
        </div>
    );
}