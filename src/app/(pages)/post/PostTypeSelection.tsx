"use client";

import React from "react";
import { Upload, Image, Video, Book, MapPin, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/label';

const POST_TYPES = [
  { id: 'culture', label: 'Culture', icon: Image },
  { id: 'locations', label: 'Locations', icon: MapPin },
  { id: 'foods', label: 'Foods', icon: Utensils },
  { id: 'tour_guide', label: 'Tour Guide', icon: Book },
  { id: 'blog', label: 'Blog', icon: Book },
];

interface PostTypeSelectionProps {
  selectedType: string | null;
  setSelectedType: (value: string) => void;
}

const PostTypeSelection: React.FC<PostTypeSelectionProps> = ({ selectedType, setSelectedType }) => {
  return (
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
};

export default PostTypeSelection;
