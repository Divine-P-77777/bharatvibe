"use client";
import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button'; 
import { useRouter } from 'next/navigation';
import imageCompression from 'browser-image-compression';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Upload, Image, Video, Book, MapPin, Utensils } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

// Post type definitions
const POST_TYPES = [
  { id: 'culture', label: 'Culture', icon: Image },
  { id: 'locations', label: 'Locations', icon: MapPin },
  { id: 'foods', label: 'Foods', icon: Utensils },
  { id: 'tour_guide', label: 'Tour Guide', icon: Book },
  { id: 'blog', label: 'Blog', icon: Book },
];

const PostCreationPanel = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  // const navigate = useNavigate();
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);


  const compressImage = async (file: File) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    return await imageCompression(file, options);
  };

  const validateFile = (file: File) => {
    if (file.type.startsWith('video/') && file.size > 500 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Video files must be smaller than 500MB',
        variant: 'destructive',
      });
      return false;
    }

    if (file.type.startsWith('image/') && file.size > 10 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Image files must be smaller than 10MB',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  // Redirect if not logged in
  if (!user) {
    router.push('/auth');
    return null;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const resetForm = () => {
    setSelectedType(null);
    setTitle('');
    setContent('');
    setFile(null);
  };

  const validateForm = () => {
    if (!selectedType) {
      toast({
        title: 'Error',
        description: 'Please select a post type',
        variant: 'destructive',
      });
      return false;
    }

    if (!title.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a title',
        variant: 'destructive',
      });
      return false;
    }

    // For blog posts, require content
    if (selectedType === 'blog' && content.trim().split('\n').length < 3) {
      toast({
        title: 'Error',
        description: 'Blog posts require at least 3 lines of content',
        variant: 'destructive',
      });
      return false;
    }

    // For media posts, require a file unless it's a blog
    if (selectedType !== 'blog' && !file) {
      toast({
        title: 'Error',
        description: `Please upload an ${selectedType === 'culture' || selectedType === 'locations' || selectedType === 'foods' ? 'image' : 'file'}`,
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsUploading(true);
      
      let mediaUrl = null;
      
      if (file) {
        if (!validateFile(file)) return;

        let processedFile = file;

        // Compress images
        if (file.type.startsWith('image/')) {
          processedFile = await compressImage(file);
        }

        // Upload to Cloudinary
        const formData = new FormData();
        formData.append('file', processedFile);
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

        
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

        const data = await response.json();
        mediaUrl = data.secure_url;
      }
      
      // Create post record in database
      const { error: insertError } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          type: selectedType,
          title,
          content: content || null,
          media_url: mediaUrl,
        });
        
      if (insertError) throw insertError;
      
      // Update user's coins
      const { error: updateError } = await supabase.rpc('increment_user_coins', { 
        user_id: user.id, 
        amount: 1 
      });
        
      if (updateError) throw updateError;
      
      toast({
        title: 'Success',
        description: 'Your post has been published and you earned 1 Vibe Coin!',
      });
      
      resetForm();
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: 'Error',
        description: 'Failed to create post. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const renderPostTypeSelection = () => (
    <div className="space-y-3">
      <Label className="text-base">Select Post Type</Label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
        {POST_TYPES.map((type) => (
          <Button
            key={type.id}
            type="button"
            variant={selectedType === type.id ? 'default' : 'outline'}
            className={`h-24 flex flex-col gap-2 ${selectedType === type.id ? 'border-primary' : ''}`}
            onClick={() => setSelectedType(type.id)}
          >
            <type.icon className="h-6 w-6" />
            <span>{type.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );

  const renderPostForm = () => {
    if (!selectedType) return null;
    
    const isBlog = selectedType === 'blog';
    
    return (
      <div className="space-y-4 mt-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a captivating title..."
          />
        </div>
        
        {isBlog && (
          <div className="space-y-2">
            <Label htmlFor="content">Content (minimum 3 lines)</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts about India..."
              className="min-h-[150px]"
            />
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="file">{isBlog ? 'Featured Image' : 'Upload Media'}</Label>
          <div className="border border-input rounded-md p-4">
            <div className="flex flex-col items-center justify-center gap-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {isBlog 
                  ? 'Upload a featured image for your blog (optional)' 
                  : `Upload ${selectedType === 'culture' || selectedType === 'locations' || selectedType === 'foods' ? 'an image or video' : 'a file'}`}
              </p>
              
              <Input
                id="file"
                type="file"
                className="hidden"
                accept={`${selectedType === 'culture' || selectedType === 'locations' || selectedType === 'foods' || isBlog ? 'image/*,video/*' : '*'}`}
                onChange={handleFileChange}
              />
              <Label 
                htmlFor="file" 
                className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md text-sm cursor-pointer hover:bg-secondary/80"
              >
                Choose File
              </Label>
              
              {file && (
                <p className="text-sm mt-2 font-medium">Selected: {file.name}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="border-2 border-muted">
        <CardHeader>
          <CardTitle className="heading-gradient">Create a New Post</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderPostTypeSelection()}
          {renderPostForm()}
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
          <Button type="submit" disabled={isUploading}>
            {isUploading ? 'Publishing...' : 'Publish Post'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default PostCreationPanel;