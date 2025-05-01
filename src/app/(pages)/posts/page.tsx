'use client';
import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, MapPin, Share2, MessageSquare, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectNoneItem } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import Loader from '@/components/ui/loader';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Toggle } from '@/components/ui/toggle';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

import { useRouter } from 'next/navigation';



import Navbar from '@/components/layout/UserNav';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/lib/supabase/client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useAppSelector } from '@/store/hooks';
import { Document, Page } from 'react-pdf';

import { INDIAN_STATES } from "@/constants";
import { categories } from "@/constants";

const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false });
const PostLikeButton = dynamic(() => import('./components/PostLikeButton'), { ssr: false });
const PostsMap = dynamic(() => import('./components/PostsMap'), { ssr: false });
const VideoPlayerWithThumbnail = dynamic(() => import('./components/VideoPlayerWithThumbnail'), { ssr: false });

type PDFViewerProps = {
  url: string;
  fallback_gif_url: string;
};

const PDFViewer = ({ url, fallback_gif_url }: PDFViewerProps) => {
  const [pdfFailed, setPdfFailed] = useState(false);
  const [isPdf, setIsPdf] = useState(true);

  useEffect(() => {
    if (!url.endsWith('.pdf')) {
      setIsPdf(false); // If not PDF, don't try to load it as a PDF
    }
  }, [url]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPdfFailed(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [url]);

  const handleLoad = () => setPdfFailed(false);

  return isPdf ? (
    !pdfFailed ? (
      <iframe
        src={url}
        width="100%"
        height="600px"
        className="rounded-md"
        style={{ border: 'none' }}
        onLoad={handleLoad}
      />
    ) : (
      <img
        src={fallback_gif_url}
        alt="Fallback GIF"
        className="rounded-md w-full h-[600px] object-cover"
      />
    )
  ) : (
    <img
      src={fallback_gif_url}
      alt="Fallback GIF"
      className="rounded-md w-full h-[600px] object-cover"
    />
  );
};

const PostsPage = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState('grid');
  const [selectedState, setSelectedState] = useState('');
  const observerRef = useRef<HTMLDivElement | null>(null);
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const postsPerPage = 10;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = activeCategory === 'all' ? filteredPosts : filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const [imgError, setImgError] = useState(false);

  const searchParams = useSearchParams();
  const categoryFromQuery = searchParams.get('category');
  const router = useRouter();

  useEffect(() => {
    if (categoryFromQuery) setActiveCategory(categoryFromQuery);
  }, [categoryFromQuery]);

  const formatImageUrl = (url: string | undefined) => {
    if (!url) return '/not_found.gif';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (!url.startsWith('/')) return '/' + url;
    return url;
  };


  const handleError = () => {
    setImgError(true);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [searchTerm, activeCategory, selectedState, posts]);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    if (!error) setPosts(data || []);
    setLoading(false);
  };

  const filterPosts = () => {
    let result = [...posts];
    if (activeCategory !== 'all') result = result.filter(p => p.type === activeCategory);
    if (selectedState) result = result.filter(p => p.state === selectedState);
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p => p.title?.toLowerCase().includes(term) || p.content?.toLowerCase().includes(term));
    }
    setFilteredPosts(result);
    setCurrentPage(1);
  };

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    if (entries[0].isIntersecting && activeCategory === 'all') {
      setCurrentPage(prev => prev + 1);
    }
  }, [activeCategory]);

  useEffect(() => {
    if (activeCategory !== 'all') return;

    const observer = new IntersectionObserver(handleIntersection, { threshold: 1 });
    const current = observerRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [filteredPosts, activeCategory]);

  const scrollToTop = () => {
    document.getElementById('card-grid')?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <>
      <Navbar />
      <div
        className={`px-4 pt-6 min-h-screen ${isDarkMode ? "bg-black text-white" : "bg-white text-black"
          }`}
      >
        <div className="flex flex-col md:flex-row gap-3 pt-30">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search posts by title or content..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={selectedState} onValueChange={setSelectedState}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by State" />
            </SelectTrigger>
            <SelectContent>
              <SelectNoneItem value="none" />
              {INDIAN_STATES.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ToggleGroup type="single" value={view} onValueChange={(v) => v && setView(v)}>
            <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
            <ToggleGroupItem value="map">
              <MapPin className="h-4 w-4 mr-1" />
              Map
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="mx-auto flex justify-center">

          <Tabs
            value={activeCategory}
            onValueChange={(category) => {
              setActiveCategory(category);
              router.push(`/posts?category=${category}`, { scroll: false });
            }} className="mt-4"
          >
            <TabsList className="flex">
              {categories.map((c) => (
                <TabsTrigger key={c.id} value={c.id}>
                  {c.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {view === "map" ? (
          <PostsMap posts={filteredPosts} />
        ) : loading ? (
          <Loader />
        ) : (
          <div
            id="card-grid"
            className="flex flex-col gap-4 py-6 w-full justify-center items-center mx-auto max-w-screen-lg"
          >
            {currentPosts.map((post) => (
              <Card
                key={post.id}
                className={`flex flex-col ${isDarkMode ? "bg-black text-white" : "bg-white"
                  } shadow-md justify-center items-center mx-auto w-full sm:w-[600px] h-fit`}
              >
                {post.media_url?.endsWith(".pdf") ? (
                  <PDFViewer url={post.media_url} fallback_gif_url="/pdf_fallback.gif" />
                ) : post.media_url?.includes("video") ? (
                  <VideoPlayerWithThumbnail url={post.media_url} />
                ) : post.media_url ? (
                  <Image
                    src={formatImageUrl(post.media_url)}
                    alt="media"
                    className="rounded-lg h-fit object-cover"
                    width={500}
                    height={500}
                    onError={handleError}
                  />

                ) : (
                  <Image
                    src="/not_found.gif"
                    alt="No media"
                    className="rounded-lg h-fit object-cover"
                    width={500}
                    height={500}
                  />
                )}

                <CardHeader>
                  <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{post.content}

                  </CardDescription>
                </CardHeader>
                <div>
                  <Link
                    href={`/posts/${post.id}`}
                    className="flex gap-1 justify-center ml-3 w-fit px-5 py-1 items-center"
                  >
                    <div className='btn-grad2 px-4 py-1'>View</div>
                  </Link>
                </div>

                {/* <CardFooter className="flex  justify-between items-center gap-3 mt-auto"> */}
                <div className="flex justify-center mx-auto gap-7 items-center py-3 w-full ">
                  <PostLikeButton postId={post.id} />
                  <Link
                    href={`/posts/${post.id}#comments`}
                    className="flex gap-1 items-center font-bold text-orange-500 hover:underline"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Link>
                  <Link
                    href={`/posts/${post.id}`}
                    className="flex gap-1 justify-center font-bold text-cyan-500 ml-3 w-fit px-5 py-1 items-center"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
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
                  </button>
                </div>

                {/* </CardFooter> */}
              </Card>
            ))}
          </div>
        )}

        {activeCategory !== "all" && filteredPosts.length > 0 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => {
                    setCurrentPage((p) => Math.max(1, p - 1));
                    scrollToTop();
                  }}
                />
              </PaginationItem>
              {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                const p = i + 1;
                return (
                  <PaginationItem key={p}>
                    <PaginationLink
                      onClick={() => {
                        setCurrentPage(p);
                        scrollToTop();
                      }}
                      isActive={p === currentPage}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext
                  onClick={() => {
                    setCurrentPage((p) => Math.min(p + 1, totalPages));
                    scrollToTop();
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}

        <div ref={observerRef} />
      </div>
      <Footer />
    </>
  );

};

export default PostsPage;