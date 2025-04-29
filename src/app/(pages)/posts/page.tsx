'use client';
import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, MapPin, Share2, MessageSquare, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import Loader from '@/components/ui/loader';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Toggle } from '@/components/ui/toggle';
import PostsMap from './components/PostsMap';
import PostLikeButton from './components/PostLikeButton';
import Navbar from '@/components/layout/UserNav';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/lib/supabase/client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useAppSelector } from '@/store/hooks';
import { Document, Page } from 'react-pdf';
import VideoPlayerWithThumbnail from './components/VideoPlayerWithThumbnail';

const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false });

const categories = [
  { id: 'all', label: 'All' },
  { id: 'blog', label: 'Blog' },
  { id: 'culture', label: 'Culture' },
  { id: 'locations', label: 'Locations' },
  { id: 'tour_guide', label: 'Guides' },
  { id: 'foods', label: 'Food' }
];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Delhi',
  'Jammu and Kashmir', 'Ladakh', 'Puducherry'
];

// const PDFViewer = ({ url }: { url: string }) => {
//   const [numPages, setNumPages] = useState<number | null>(null);
//   const [pageNumber, setPageNumber] = useState(1);

//   return (
//     <div className="w-full flex flex-col items-center bg-white dark:bg-zinc-900 rounded-md p-2">
//       <Document
//         file={url}
//         onLoadSuccess={({ numPages }) => setNumPages(numPages)}
//         loading="Loading PDF..."
//         className="w-full"
//       >
//         <Page
//           pageNumber={pageNumber}
//           width={window.innerWidth < 640 ? 300 : 600}
//           className="rounded"
//         />
//       </Document>

//       <div className="mt-2 flex justify-center gap-4 items-center text-sm">
//         <button
//           onClick={() => setPageNumber(p => Math.max(p - 1, 1))}
//           disabled={pageNumber <= 1}
//           className="px-2 py-1 rounded bg-gray-300 dark:bg-zinc-700"
//         >
//           ◀ Prev
//         </button>
//         <span>
//           Page {pageNumber} of {numPages || 1}
//         </span>
//         <button
//           onClick={() => setPageNumber(p => Math.min(p + 1, numPages || 1))}
//           disabled={pageNumber >= (numPages || 1)}
//           className="px-2 py-1 rounded bg-gray-300 dark:bg-zinc-700"
//         >
//           Next ▶
//         </button>
//       </div>
//     </div>
//   );
// };

const PDFViewer = ({ url }: { url: string }) => {
  return (
    <iframe
      src={url}
      title="PDF Viewer"
      className="w-full h-[600px] rounded border"
      allowFullScreen
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

  useEffect(() => { fetchPosts(); }, []);
  useEffect(() => { filterPosts(); }, [searchTerm, activeCategory, selectedState, posts]);

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
      <div className={`px-20 pt-30  min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>

        <div className="flex flex-col md:flex-row gap-3">
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
              {INDIAN_STATES.map(state => (
                <SelectItem key={state} value={state}>{state}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ToggleGroup type="single" value={view} onValueChange={v => v && setView(v)}>
            <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
            <ToggleGroupItem value="map"><MapPin className="h-4 w-4 mr-1" />Map</ToggleGroupItem>
          </ToggleGroup>
        </div>

        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mt-4">
          <TabsList className="flex overflow-x-auto">
            {categories.map(c => (
              <TabsTrigger key={c.id} value={c.id}>{c.label}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {view === 'map' ? <PostsMap posts={filteredPosts} /> : loading ? <Loader /> : (
          <div id="card-grid" className="flex flex-col gap-6 py-6 w-[600px]  mx-auto">
            {currentPosts.map(post => (
              <Card key={post.id} className={`flex flex-col ${isDarkMode ? 'bg-black text-white' : 'bg-white'} shadow-md`}>
                {post.media_url?.endsWith('.pdf') ? (
                  <iframe
                    src={post.media_url}
                    width="100%"
                    height="600px"
                    className="rounded-md"
                    style={{ border: 'none' }}
                  />
                ) : post.media_url?.includes('video') ? (
                  <VideoPlayerWithThumbnail url={post.media_url} />
                ) : (
                  <img src={post.media_url} className="w-full h-auto object-cover" alt="media" />
                )}

                <CardHeader>
                  <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{post.content}</CardDescription>
                </CardHeader>
                <CardFooter className="flex flex-wrap justify-between items-center gap-2 mt-auto">
                  <div className="flex gap-2">
                    <PostLikeButton postId={post.id} />
                    <Link href={`/posts/${post.id}#comments`} className="flex gap-1 items-center text-blue-500 hover:underline">
                      <MessageSquare className="h-4 w-4" /> Comment
                    </Link>
                    <Link href={`/posts/${post.id}`} className="flex gap-1 items-center text-blue-500 hover:underline">
                      <Eye className="h-4 w-4" /> View
                    </Link>
                  </div>
                  <button
                    onClick={() => navigator.share?.({ title: post.title, url: location.origin + '/posts/' + post.id })}
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Share2 className="w-4 h-4" /> Share
                  </button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {activeCategory !== 'all' && filteredPosts.length > 0 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); scrollToTop(); }} />
              </PaginationItem>
              {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                const p = i + 1;
                return (
                  <PaginationItem key={p}>
                    <PaginationLink onClick={() => { setCurrentPage(p); scrollToTop(); }} isActive={p === currentPage}>
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext onClick={() => { setCurrentPage(p => Math.min(p + 1, totalPages)); scrollToTop(); }} />
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