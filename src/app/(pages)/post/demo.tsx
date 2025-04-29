'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Image, Video, Book, MapPin, Utensils } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { uploadToCloudinary, MediaType } from '@/lib/cloudinary';

// Indian states list
const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

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
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedState, setSelectedState] = useState<string>('');
  const [mapUrl, setMapUrl] = useState<string>('');
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);



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
    setSelectedState('');
    setMapUrl('');
    setLocation(null);
  };

  const validateForm = () => {
    if (!selectedType) {
      toast.error('Please select a post type');
      return false;
    }

    if (!title.trim() || title.trim().length < 10 || title.trim().length > 100) {
      toast.error('Title must be between 10 and 100 characters');
      return false;
    }

    const isBlog = selectedType === 'blog';

    if (isBlog) {
      if (content.trim().split('\n').length < 3) {
        toast.error('Blog posts require at least 3 lines of content');
        return false;
      }
    } else {
      if (content.trim()) {
        if (content.trim().length < 20 || content.trim().length > 200) {
          toast.error('Description must be 20 to 200 characters long');
          return false;
        }
      }
    }

    if (!title.trim()) {
      toast.error('Please enter a title');
      return false;
    }

    // For blog posts, require content
    if (selectedType === 'blog' && content.trim().split('\n').length < 3) {
      toast.error('Blog posts require at least 3 lines of content');
      return false;
    }

    // For media posts, require a file unless it's a blog
    const fileRequired = ['culture', 'locations', 'foods', 'tour_guide'].includes(selectedType);
    if (fileRequired && !file) {
      toast.error('Please upload a file');
      return false;
    }

    if (file) {
      const allowedTypesMap: Record<string, string[]> = {
        tour_guide: ['application/pdf', 'image/'],
        blog: ['image/'],
        culture: ['image/', 'video/'],
        locations: ['image/', 'video/'],
        foods: ['image/', 'video/'],
      };

      const allowedTypes = allowedTypesMap[selectedType] || [];
      const isValidType = allowedTypes.some(type => file.type.startsWith(type) || file.type === type);

      if (!isValidType) {
        toast.error(`Invalid file type. Allowed: ${allowedTypes.join(', ')}`);
        return false;
      }
    }


    return true;
  };

  const captureLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          toast.success('Location captured successfully');
        },
        (error) => {
          toast.error(`Failed to capture location: ${error.message}`);
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (!user) {
        toast.error('You must be logged in to create a post');
        return;
      }

      setIsUploading(true);
      toast.loading('Uploading your post...');

      let mediaUrl = null;

      // Upload file first
      if (file) {
        try {
          let fileType: MediaType;
          if (file.type.startsWith('image/')) fileType = 'image';
          else if (file.type.startsWith('video/')) fileType = 'video';
          else if (file.type === 'application/pdf') fileType = 'pdf';
          else {
            toast.error('Unsupported file type');
            return;
          }

          console.log(`Uploading ${fileType} to Cloudinary...`);

          mediaUrl = await uploadToCloudinary(file, fileType);

          if (!mediaUrl) {
            toast.error('Failed to upload media. Please try again.');
            return;
          }
        } catch (error: any) {
          console.error('Cloudinary upload error:', error);
          toast.error(`Media upload failed: ${error.message || 'Unknown error'}`);
          return;
        }
      }

      // Check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!profile) {
        const { error: profileInsertError } = await supabase.from('profiles').insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || '',
          avatar_url: user.user_metadata?.avatar_url || '',
        });

        if (profileInsertError) {
          toast.error('Could not create user profile');
          console.error('Profile insert error:', profileInsertError.message);
          return;
        }
      }

      const { error: insertError } = await supabase.from('posts').insert({
        user_id: user.id,
        type: selectedType,
        title,
        content: content || null,
        media_url: mediaUrl,
        state: selectedState || null,
        map_url: mapUrl || null,
        latitude: location?.latitude || null,
        longitude: location?.longitude || null,
      });

      if (insertError) {
        console.error('Insert error:', insertError);
        toast.error(`Failed to create post: ${insertError.message}`);
        console.error('Insert error:', insertError.message, insertError.details);

        return;
      }

      // Award coins
      const { error: updateError } = await supabase.rpc('increment_user_coins', {
        user_id: user.id,
        amount: 1,
      });

      if (updateError) {
        console.warn('Coin update failed:', updateError);
        toast.error(`Post published but coin award failed: ${updateError.message}`);
      } else {
        toast.success('Your post was published and you earned 1 Vibe Coin!');
      }

      resetForm();
    } catch (error: any) {
      console.error('Post creation error:', error);
      toast.error(`Unexpected error: ${error.message || 'Unknown error'}`);
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
    const locationTypes = ['locations', 'culture', 'foods', 'tour_guide'];
    const showLocationCapture = locationTypes.includes(selectedType);

    return (
      <>

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

          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger id="state">
                <SelectValue placeholder="Select a state" />
              </SelectTrigger>
              <SelectContent>
                {INDIAN_STATES.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {!isBlog && (
            <div className="space-y-2">
              <Label htmlFor="content">Description (optional, 20–200 characters)</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Add an optional description..."
                className="min-h-[100px]"
              />
            </div>
          )}

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


          {showLocationCapture && (
            <>
              <div className="space-y-2">
                <Label htmlFor="mapUrl">Map URL (optional)</Label>
                <Input
                  id="mapUrl"
                  value={mapUrl}
                  onChange={(e) => setMapUrl(e.target.value)}
                  placeholder="Enter a Google Maps or other map URL..."
                />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={captureLocation}
                    className="flex items-center gap-2"
                  >
                    <MapPin className="h-4 w-4" />
                    Capture My Location
                  </Button>
                  {location && (
                    <span className="text-sm text-muted-foreground">
                      Lat: {location.latitude.toFixed(6)}, Lon: {location.longitude.toFixed(6)}
                    </span>
                  )}
                </div>
              </div>
            </>
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
                  accept={
                    selectedType === 'blog' ? 'image/*' :
                      selectedType === 'tour_guide' ? 'application/pdf,image/*' :
                        ['culture', 'locations', 'foods'].includes(selectedType) ? 'image/*,video/*' :
                          '*'
                  }

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

      </>
    );
  };

  return (
    <>

      <form onSubmit={handleSubmit} className=''>

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


    </>
  );
};

export default PostCreationPanel;

