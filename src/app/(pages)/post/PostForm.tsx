"use client"
import React, { useEffect, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Upload, MapPin } from 'lucide-react';
import { INDIAN_STATES } from '@/constants';
import { Button } from '@/components/ui/Button';

interface PostFormProps {
  selectedType: string | null;
  title: string;
  setTitle: (value: string) => void;
  content: string;
  setContent: (value: string) => void;
  selectedState: string;
  setSelectedState: (value: string) => void;
  mapUrl: string;
  setMapUrl: (value: string) => void;
  location: { latitude: number; longitude: number } | null;
  setLocation: (value: { latitude: number; longitude: number } | null) => void;
  file: File | null;
  setFile: (value: File | null) => void;
  captureLocation: () => void;
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string>) => void;
  refs: {
    titleRef: React.RefObject<HTMLInputElement | null>;
    stateRef: React.RefObject<HTMLDivElement | null>;
    contentRef: React.RefObject<HTMLTextAreaElement | null>;
    mapUrlRef: React.RefObject<HTMLInputElement | null>;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
  };
}

const PostForm: React.FC<PostFormProps> = ({
  selectedType,
  title,
  setTitle,
  content,
  setContent,
  selectedState,
  setSelectedState,
  mapUrl,
  setMapUrl,
  location,
  setLocation,
  file,
  setFile,
  captureLocation,
  errors,
  setErrors,
  refs,
}) => {
  if (!selectedType) return null;

  const isBlog = selectedType === 'blog';
  const locationTypes = ['locations', 'culture', 'foods', 'tour_guide'];
  const showLocationCapture = locationTypes.includes(selectedType);

  const scrollToField = (ref: React.RefObject<any>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      ref.current.classList.add('animate-pulse');
      setTimeout(() => ref.current.classList.remove('animate-pulse'), 1500);
    }
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      if (errors.title) scrollToField(refs.titleRef);
      else if (errors.state) scrollToField(refs.stateRef);
      else if (errors.content) scrollToField(refs.contentRef);
      else if (errors.location) scrollToField(refs.mapUrlRef);
      else if (errors.file) scrollToField(refs.fileInputRef);
    }
  }, [errors]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLInputElement>) => {
    e.preventDefault();
  };

  const titleValid = isBlog ? title.length >= 15 && title.length <= 50 : title.length >= 10 && title.length <= 50;
  const contentValid = isBlog ? content.trim().length >= 200 && content.trim().length <= 3000 : (!content || (content.length >= 20 && content.length <= 200));
  const locationValid = location || (mapUrl && mapUrl.trim() !== '');
  const stateValid = !!selectedState;
  const fileValid = !!file;

  useEffect(() => {
    const newErrors: { [key: string]: string } = {};
    if (!titleValid) newErrors.title = isBlog ? 'Title must be 15–50 characters' : 'Title must be 10–50 characters';
    if (!stateValid) newErrors.state = 'State is required';
    if (!contentValid) newErrors.content = isBlog ? 'Content must be 200–3000 characters' : 'Description must be 20–200 characters';


    if (!fileValid) newErrors.file = 'Media is required';
    setErrors(newErrors);
  }, [title, selectedState, content, mapUrl, location, file]);

  return (
    <div className="space-y-4 mt-6">
      <div className="space-y-2" ref={refs.titleRef}>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a captivating title..."
          className={!titleValid ? 'border-red-500' : ''}
        />
        {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
      </div>

      <div className="space-y-2" ref={refs.stateRef}>
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
        {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">{isBlog ? 'Content (minimum 3 lines)' : 'Description (optional, 20–200 characters)'}</Label>
        <Textarea
          id="content"
          ref={refs.contentRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={isBlog ? 'Share your thoughts about India...' : 'Add an optional description...'}
          className={`min-h-[${isBlog ? 150 : 100}px] ${!contentValid ? 'border-red-500' : ''}`}
        />
        {errors.content && <p className="text-sm text-red-500">{errors.content}</p>}
      </div>

      {showLocationCapture && (
        <>
          <div className="space-y-2" ref={refs.mapUrlRef}>
            <Label htmlFor="mapUrl">Map URL (optional)</Label>
            <Input
              id="mapUrl"
              value={mapUrl}
              onChange={(e) => setMapUrl(e.target.value)}
              placeholder="Enter a Google Maps or other map URL..."
            // className={!locationValid ? 'border-red-500' : ''}
            />
            {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
          </div>
          <div className="space-y-2">
            <Label>Location (optional)</Label>
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

      <div className="space-y-2" ref={refs.fileInputRef}>
        <Label htmlFor="file">{isBlog ? 'Featured Image' : 'Upload Media'}</Label>
        <div
          className="border border-input rounded-md p-4 w-full"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground text-center">
              {isBlog
                ? 'Upload a featured image for your blog (optional)'
                : `Upload ${['culture', 'locations', 'foods'].includes(selectedType) ? 'an image or video' : selectedType === 'tour_guide' ? 'an image or PDF' : 'a file'} — or drag & drop here`}
            </p>
            <Input
              id="file"
              type="file"
              className="hidden"
              accept={
                selectedType === 'blog' ? 'image/*' :
                  selectedType === 'tour_guide' ? 'application/pdf,image/*' :
                    ['culture', 'locations', 'foods'].includes(selectedType) ? 'image/*,video/*' : '*'}
              onChange={handleFileChange}
            />
            <Label
              htmlFor="file"
              className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md text-sm cursor-pointer hover:bg-secondary/80"
            >
              Choose File
            </Label>
            {file && (
              <div className="text-center">
                <p className="text-sm mt-2 font-medium">Selected: {file.name}</p>
                {file.type.startsWith('image/') && <img src={URL.createObjectURL(file)} alt="preview" className="mt-2 max-h-48 object-contain" />}
                {file.type.startsWith('video/') && (
                  <video controls className="mt-2 max-h-48">
                    <source src={URL.createObjectURL(file)} type={file.type} />
                  </video>
                )}
              </div>
            )}
            {errors.file && <p className="text-sm text-red-500">{errors.file}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostForm;
