// import { POST_TYPES } from "./types";
import { Upload, Image, Video, Book, MapPin, Utensils } from 'lucide-react';

const POST_TYPES = [
  { id: 'culture', label: 'Culture', icon: Image },
  { id: 'locations', label: 'Locations', icon: MapPin },
  { id: 'foods', label: 'Foods', icon: Utensils },
  { id: 'tour_guide', label: 'Tour Guide', icon: Book },
  { id: 'blog', label: 'Blog', icon: Book },
];

export const PostTypeSelection = ({ selectedType, setSelectedType, isDarkMode }: any) => (
  <div className="space-y-3">
    <label className={`text-lg font-semibold ${isDarkMode ? 'text-orange-400' : 'text-rose-600'}`}>
      Select Post Type
    </label>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
      {POST_TYPES.map((type) => (
        <button
          key={type.id}
          type="button"
          onClick={() => setSelectedType(type.id)}
          className={`h-24 flex flex-col items-center justify-center gap-2 p-2 rounded-lg border-2 transition-all
            ${selectedType === type.id ? 
              (isDarkMode ? 'bg-gray-800 border-orange-500' : 'bg-amber-100 border-rose-500') : 
              (isDarkMode ? 'border-gray-600 hover:border-orange-400' : 'border-amber-200 hover:border-rose-300')}
            ${isDarkMode ? 'text-orange-400' : 'text-rose-600'}`}
        >
          <type.icon className="h-6 w-6" />
          <span className="text-sm font-medium">{type.label}</span>
        </button>
      ))}
    </div>
  </div>
);