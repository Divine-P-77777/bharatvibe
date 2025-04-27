"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useAppSelector } from '@/store/hooks';
import { PostTypeSelection } from './PostTypeSelection';
import { PostForm } from './PostForm';
import { compressImage, validateFile } from './utils';
import { containsAbuseWords, filterAbuseWords } from '@/lib/content-filter';
import imageCompression from 'browser-image-compression';
import { Label } from '@/components/ui/label';
import { Upload, Image, Video, Book, MapPin, Utensils } from 'lucide-react';
import { Button} from '@/components/ui/Button';

const POST_TYPES = [
  { id: 'culture', label: 'Culture', icon: Image },
  { id: 'locations', label: 'Locations', icon: MapPin },
  { id: 'foods', label: 'Foods', icon: Utensils },
  { id: 'tour_guide', label: 'Tour Guide', icon: Book },
  { id: 'blog', label: 'Blog', icon: Book },
];


export default function PostCreationPanel() {
  const { user } = useAuth();
  const router = useRouter();
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const resetForm = () => {
    setSelectedType(null);
    setTitle('');
    setContent('');
    setFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Basic validation
      if (!selectedType || !title.trim()) {
        alert('Please fill all required fields');
        return;
      }

      // Content filtering
      if (containsAbuseWords(title) || containsAbuseWords(content)) {
        alert('Your content contains inappropriate language. Please revise your post.');
        return;
      }

      setIsUploading(true);
      let mediaUrl = null;

      if (file) {
        // Improved compression with less quality loss
        const compressionOptions = {
          maxSizeMB: 2, // Increased from 1MB for better quality
          maxWidthOrHeight: 2560, // Higher resolution maintained
          useWebWorker: true,
          initialQuality: 0.8, // Maintain better image quality
        };

        const processedFile = file.type.startsWith('image/')
          ? await imageCompression(file, compressionOptions)
          : file;

        // Cloudinary upload
        const formData = new FormData();
        formData.append('file', processedFile);
        formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );
        

        if (!response.ok) throw new Error('Upload failed');
        const data = await response.json();
        if (!response.ok) {
          console.error('Cloudinary Error:', data);
          throw new Error(data.error.message || 'Upload failed');
        }
        mediaUrl = data.secure_url;
      }

      // Database insert
      const { error: insertError } = await supabase
        .from('posts')
        .insert({
          user_id: user!.id,
          type: selectedType,
          title: filterAbuseWords(title), // Cleaned title
          content: content ? filterAbuseWords(content) : null, // Cleaned content
          media_url: mediaUrl
        });

      if (insertError) throw insertError;

      // Update coins
      const { error: coinError } = await supabase.rpc('increment_user_coins', {
        user_id: user!.id,
        amount: 1
      });

      if (coinError) throw coinError;

      alert('Post published successfully! +1 Vibe Coin earned');
      resetForm();
    } catch (error) {
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : 'Failed to create post');
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


  if (!user) {
    router.push('/auth');
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className={`rounded-xl ${isDarkMode ?
      'bg-gradient-to-r from-gray-800 to-gray-900 shadow-orange-600 text-orange-400' :
      'bg-gradient-to-r from-amber-200 to-rose-200 shadow-rose-500 text-rose-700'
      } bg-opacity-90 backdrop-blur-xl p-8 shadow-xl`}>
      <div className="space-y-6">
        <h2 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-orange-400' : 'text-rose-600'}`}>
          Create a New Post
        </h2>

        <PostTypeSelection
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          isDarkMode={isDarkMode}
        />

        {selectedType && (
          <PostForm
            selectedType={selectedType}
            title={title}
            setTitle={setTitle}
            content={content}
            setContent={setContent}
            handleFileChange={handleFileChange}
            file={file}
            isDarkMode={isDarkMode}
          />
        )}

        <div className="flex justify-end gap-3 pt-6">
          <button
            type="button"
            onClick={resetForm}
            className={`px-4 py-2 rounded-lg border-2 ${isDarkMode ?
              'border-orange-500 text-orange-400 hover:bg-gray-700' :
              'border-rose-500 text-rose-600 hover:bg-amber-100'
              }`}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isUploading}
            className={`px-4 py-2 rounded-lg transition-colors ${isDarkMode ?
              'bg-orange-600 hover:bg-orange-500 text-white' :
              'bg-rose-500 hover:bg-rose-400 text-white'
              } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isUploading ? 'Publishing...' : 'Publish Post'}
          </button>
        </div>
      </div>
    </form>
  );
};