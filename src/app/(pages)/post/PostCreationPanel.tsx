// PostCreationPanel.tsx (main component)
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { uploadToCloudinary, MediaType } from '@/lib/cloudinary';
import { supabase } from '@/lib/supabase/client';
import { filterAbuseWords } from '@/lib/content-filter';
import PostTypeSelection from './PostTypeSelection';
import PostForm from './PostForm';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import Loader from '@/components/ui/loader'
import Lenis from "@studio-freight/lenis";
import Popup from '@/components/ui/Popup';

const PostCreationPanel = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [selectedState, setSelectedState] = useState<string>('');
  const [mapUrl, setMapUrl] = useState<string>('');
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPopup, setShowPopup] = React.useState(false);

  const titleRef = useRef<HTMLInputElement>(null);
  const stateRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const mapUrlRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true)
  // Smooth Scroll Effect
  useEffect(() => {
        const lenis = new Lenis({
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
          smooth: true,
          smoothTouch: false,
        } as unknown as ConstructorParameters<typeof Lenis>[0]);
        
      
        function raf(time: number) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }
      
        requestAnimationFrame(raf);
      
        return () => {
          lenis.destroy();
        };
      }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const resetForm = () => {
    setSelectedType(null);
    setTitle('');
    setContent('');
    setFile(null);
    setSelectedState('');
    setMapUrl('');
    setLocation(null);
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const isBlog = selectedType === 'blog';

    if (!selectedType) newErrors.type = 'Select appropriate media';
    if (!title.trim() || title.length < 10 || title.length > 100)
      newErrors.title = 'Title must be between 10 and 100 characters';

    if (isBlog) {
      if (content.trim().split('\n').length < 3)
        newErrors.content = 'Blog content must be at least 3 lines';
    } else if (content && (content.length < 20 || content.length > 200)) {
      newErrors.content = 'Description must be 20–200 characters';
    }

    const fileRequired = ['culture', 'locations', 'foods', 'tour_guide'].includes(selectedType || '');
    if (fileRequired && !file) newErrors.file = 'Please upload a file';

    if (file) {
      const allowedTypesMap: Record<string, string[]> = {
        tour_guide: ['application/pdf', 'image/'],
        blog: ['image/'],
        culture: ['image/', 'video/'],
        locations: ['image/', 'video/'],
        foods: ['image/', 'video/'],
      };
      const allowedTypes = allowedTypesMap[selectedType!] || [];
      const isValidType = allowedTypes.some(type => file.type.startsWith(type) || file.type === type);
      if (!isValidType) newErrors.file = `Invalid file type. Allowed: ${allowedTypes.join(', ')}`;
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast({ title: 'Validation Error', description: Object.values(newErrors)[0] });
      return false;
    }

    return true;
  };

  const captureLocation = () => {
    if (!navigator.geolocation) {
      toast({ title: '', description: 'Geolocation not supported by this browser' });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        toast({ title: '', description: 'Location captured successfully' });
      },
      (err) => {
        toast({ title: '', description: `Failed to capture location: ${err.message}` });
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

   

    try {
      if (!user) {
        toast({ title: '', description: 'You must be logged in to create a post' });
        return;
      }

      setIsUploading(true);
      toast({ title: '', description: 'Uploading your post...' });

      let mediaUrl: string | null = null;

      if (file) {
        const fileType = file.type.startsWith('image/')
          ? 'image'
          : file.type.startsWith('video/')
            ? 'video'
            : file.type === 'application/pdf'
              ? 'pdf'
              : null;

        if (!fileType) {
          toast({ title: '', description: 'Unsupported file type' });
          return;
        }

        mediaUrl = await uploadToCloudinary(file, fileType as MediaType);
        if (!mediaUrl) {
          toast({ title: '', description: 'Failed to upload media. Please try again.' });
          return;
        }
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!profile) {
        let email = user.email;
        if (!email) {
          const { data: authUser, error: authError } = await supabase
            .from('auth.users')
            .select('email')
            .eq('id', user.id)
            .single();

          if (authError || !authUser?.email) {
            toast({ title: '', description: 'Could not retrieve user email' });
            return;
          }
          
          email = authUser.email;
        }

        const { error: profileError } = await supabase.from('profiles').insert({
          id: user.id,
          email: email,
          full_name: user.user_metadata?.full_name || '',
          avatar_url: user.user_metadata?.avatar_url || '',
          username: user.user_metadata?.username || '',
        });

        if (profileError) {
          setShowPopup(true);
          toast({ title: '', description: 'Setup your profile first to post' });
          return;
        }
      }


      const sanitizedTitle = filterAbuseWords(title);
      const sanitizedContent = filterAbuseWords(content);

      const { error: insertError } = await supabase.from('posts').insert({
        user_id: user.id,
        type: selectedType,
        title: sanitizedTitle,
        content: sanitizedContent,
        media_url: mediaUrl,
        state: selectedState,
        map_url: mapUrl || null,
        latitude: location?.latitude || null,
        longitude: location?.longitude || null,
      });

      if (insertError) {
        toast({ title: '', description: `Failed to create post: ${insertError.message}` });
        return;
      }

      const coinMap: Record<string, number> = {
        locations: 50,
        culture: 40,
        foods: 35,
        tour_guide: 60,
        blog: 70,
      };

      const reward = coinMap[selectedType!] || 0;

      const { error: coinError } = await supabase.rpc('increment_user_coins', {
        user_id: user.id,
        amount: reward,
      });

      if (coinError) {
        toast({ title: '', description: `Post created, but coin reward failed: ${coinError.message}` });
      } else {
        toast({ title: '', description: `Post published and earned ${reward} Vibe Coins!` });
      }

      resetForm();
    } catch (error: any) {
      toast({ title: '', description: error.message || 'Unknown error' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>  {loading && <Loader />}

    <Popup isOpen={showPopup} onClose={() => setShowPopup(false)}>
            <div className="text-center space-y-4">
              <p className="text-base font-semibold">Set up your profile before publishing a post</p>
              <div className="flex justify-center gap-4 mt-4">
                <Button variant="outline" onClick={() => setShowPopup(false)}>Cancel</Button>
                <Button onClick={() => router.push('/profile/onboard')}>Set Up</Button>
              </div>
            </div>
          </Popup>
      <form onSubmit={handleSubmit}>
        <Card className="border-2 border-muted">
          <CardHeader>
            <CardTitle className="heading-gradient">Create a New Post</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <PostTypeSelection selectedType={selectedType} setSelectedType={setSelectedType} />
            {selectedType && (
              <PostForm
                selectedType={selectedType}
                title={title}
                setTitle={setTitle}
                content={content}
                setContent={setContent}
                selectedState={selectedState}
                setSelectedState={setSelectedState}
                mapUrl={mapUrl}
                setMapUrl={setMapUrl}
                location={location}
                setLocation={setLocation}
                file={file}
                setFile={setFile}
                captureLocation={captureLocation}
                errors={errors}
                setErrors={setErrors}
                refs={{
                  titleRef,
                  stateRef,
                  contentRef,
                  mapUrlRef,
                  fileInputRef,
                }}
              />
            )}
          </CardContent>
          <CardContent className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
            <Button type="submit" disabled={isUploading}>
              {isUploading ? 'Publishing...' : 'Publish Post'}
            </Button>
          </CardContent>
        </Card>
      </form>
    </>
  );
};

export default PostCreationPanel;
