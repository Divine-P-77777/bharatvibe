'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, MapPin, Share2, MessageSquare, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectNoneItem } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Loader from '@/components/ui/loader';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import Lenis from "@studio-freight/lenis";
import ImageWithPreview from "@/components/ui/ImageWithPreview";
import Navbar from '@/components/layout/UserNav';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/lib/supabase/client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useAppSelector } from '@/store/hooks';
import { INDIAN_STATES, categories } from "@/constants";
import CustomPDFViewer from "./components/CustomPDFViewer";

const PostLikeButton = dynamic(() => import('./components/PostLikeButton'), { ssr: false });
const PostsMap = dynamic(() => import('./components/PostsMap'), { ssr: false });
const VideoPlayerWithThumbnail = dynamic(() => import('./components/VideoPlayerWithThumbnail'), { ssr: false });

const postsPerLoad = 5;

const PostsPage = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  const [displayedPosts, setDisplayedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedState, setSelectedState] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [view, setView] = useState('grid');
  const observerRef = useRef<HTMLDivElement | null>(null);
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const searchParams = useSearchParams();
  const router = useRouter();

  // SMOOTH SCROLL
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))});
    function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => { lenis.destroy(); };
  }, []);

  // FETCH POSTS ONCE ON MOUNT
  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select(`*, profiles:user_id (username, avatar_url, full_name), likes(count), comments(count)`)
        .order('created_at', { ascending: false });
      setPosts(data || []);
      setLoading(false);
    })();
  }, []);

  // FILTER POSTS WHENEVER posts, search, category, or state changes
  useEffect(() => {
    let result = [...posts];
    if (activeCategory !== 'all') result = result.filter(p => p.type === activeCategory);
    if (selectedState) result = result.filter(p => p.state === selectedState);
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p => p.title?.toLowerCase().includes(term) || p.content?.toLowerCase().includes(term));
    }
    setFilteredPosts(result);
    setDisplayedPosts(result.slice(0, postsPerLoad));
    setHasMore(result.length > postsPerLoad);
  }, [posts, searchTerm, activeCategory, selectedState]);

  // INFINITE SCROLL LOAD MORE
  const loadMorePosts = useCallback(() => {
    setDisplayedPosts(prev => {
      const next = filteredPosts.slice(prev.length, prev.length + postsPerLoad);
      setHasMore(filteredPosts.length > prev.length + next.length);
      return [...prev, ...next];
    });
  }, [filteredPosts]);

  useEffect(() => {
    if (!hasMore) return;
    const observer = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) loadMorePosts(); },
      { threshold: 1 }
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => { if (observerRef.current) observer.unobserve(observerRef.current); };
  }, [hasMore, loadMorePosts]);

  // CATEGORY FROM QUERY
  useEffect(() => {
    const categoryFromQuery = searchParams.get('category');
    if (categoryFromQuery) setActiveCategory(categoryFromQuery);
  }, [searchParams]);

  // VIEW CHANGE HANDLER
  const handleViewChange = (v: string | null) => {
    if (!v) return;
    setView(v);
    const params = new URLSearchParams(searchParams.toString());
    params.set('category', v === 'map' ? 'map' : 'all');
    router.replace(`/posts?${params.toString()}`, { scroll: false });
  };

  // UTILS
  const formatImageUrl = (url: string | undefined) => {
    if (!url) return '/not_found.gif';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (!url.startsWith('/')) return '/' + url;
    return url;
  };

  return (
    <>
      <Navbar />
      <div className={`px-4 pt-6 min-h-screen ${isDarkMode ? "bg-black text-white" : "bg-white text-black"}`}>
        <div className="flex flex-col md:flex-row gap-3 pt-30">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input placeholder="Search posts by title or content..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <Select value={selectedState} onValueChange={setSelectedState}>
            <SelectTrigger className="w-[200px]"><SelectValue placeholder="Filter by State" /></SelectTrigger>
            <SelectContent>
              <SelectNoneItem value="none" />
              {INDIAN_STATES.map(state => <SelectItem key={state} value={state}>{state}</SelectItem>)}
            </SelectContent>
          </Select>
          <ToggleGroup type="single" value={view} onValueChange={handleViewChange}>
            <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
            <ToggleGroupItem value="map"><MapPin className="h-4 w-4 mr-1" />Map</ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="mx-auto flex justify-center">
          <Tabs value={activeCategory} onValueChange={category => {
            setActiveCategory(category);
            router.push(`/posts?category=${category}`, { scroll: false });
          }} className="mt-4">
            <TabsList className="flex">
              {categories.map(c => <TabsTrigger key={c.id} value={c.id}>{c.label}</TabsTrigger>)}
            </TabsList>
          </Tabs>
        </div>
        {view === "map" ? (
          <PostsMap posts={displayedPosts} isDarkMode={isDarkMode} />
        ) : loading ? (
          <Loader />
        ) : (
          <div id="card-grid" className="flex flex-col gap-4 py-6 w-full justify-center items-center mx-auto max-w-screen-lg">
            {displayedPosts.map((post) => (
              <Card key={post.id} className={`flex flex-col ${isDarkMode ? "bg-black text-white" : "bg-white"} shadow-md justify-center items-center mx-auto w-full sm:w-[600px] h-fit`}>
                <div className='pt-5'>
                  {post.media_url?.endsWith(".pdf") ? (
                    <CustomPDFViewer url={post.media_url} downloadName={post.title + ".pdf"} />
                  ) : post.media_url?.includes("video") ? (
                    <div className='w-full rounded-full'><VideoPlayerWithThumbnail url={post.media_url} /></div>
                  ) : post.media_url ? (
                    <div className='px-3 sm:px-0'><ImageWithPreview post={{ ...post, media_url: formatImageUrl(post.media_url) }} /></div>
                  ) : (
                    <Image src="/not_found.gif" alt="No media" className="rounded-lg h-fit object-cover " width={500} height={500} />
                  )}
                </div>
       <CardHeader>
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
    <div className="flex items-center gap-3">
      <Link
        href={`/profile/${post.profiles.username}`}
        className={`min-w-[40px] min-h-[40px] w-10 h-10 rounded-full ${
          isDarkMode ? "border-orange-white" : "border-black/60"
        } border-2 bg-gray-200 flex items-center justify-center overflow-hidden hover:shadow-red-400 shadow-md cursor-pointer`}
      >
        {post.profiles?.avatar_url ? (
          <Image
            src={post.profiles.avatar_url}
            alt={post.profiles.username || "User"}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
        ) : (
          <span className="text-gray-500 text-lg">
            {(post.profiles?.username || "U")[0].toUpperCase()}
          </span>
        )}
      </Link>

      <CardTitle className="text-base sm:text-lg line-clamp-2 break-words">
        {post.title}
      </CardTitle>
    </div>

    <CardDescription className="text-sm sm:text-base line-clamp-2 break-words mt-1 sm:mt-0">
      {post.content}
    </CardDescription>
  </div>
</CardHeader>

                <div>
                  <Link href={`/posts/${post.id}`} className="flex gap-1 justify-center ml-3 w-fit px-5 py-1 items-center">
                    <div className='btn-grad2 px-4 py-1'>View</div>
                  </Link>
                </div>
                <div className="flex justify-center mx-auto gap-7 items-center py-3 w-full ">
                  <PostLikeButton postId={post.id} />
                  <Link href={`/posts/${post.id}#comments`} className="flex gap-1 items-center font-bold text-orange-500 hover:underline">
                    <MessageSquare className="h-4 w-4" />
                  </Link>
                  <Link href={`/posts/${post.id}`} className="flex gap-1 justify-center font-bold text-cyan-500 ml-3 w-fit px-5 py-1 items-center">
                    <Eye className="h-4 w-4" />
                  </Link>
                  <button onClick={() => navigator.share?.({ title: post.title, url: location.origin + "/posts/" + post.id, })} className="text-xs text-green-600 font-bold hover:underline flex items-center gap-1">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            ))}
            {hasMore && <div ref={observerRef} className="h-8" />}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default PostsPage;