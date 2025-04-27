import { Upload, Image, Video, Book, MapPin, Utensils } from 'lucide-react';
export const PostForm = ({ 
    selectedType, 
    title, 
    setTitle, 
    content, 
    setContent, 
    handleFileChange, 
    file, 
    isDarkMode 
  }: any) => {
    const isBlog = selectedType === 'blog';
  
    return (
      <div className="space-y-4 mt-6">
        <div className="space-y-2">
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-orange-300' : 'text-rose-700'}`}>
            Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a captivating title..."
            className={`w-full p-2 rounded-lg border-2 ${isDarkMode ? 
              'bg-gray-800 border-gray-600 text-orange-100' : 
              'bg-amber-50 border-amber-200 text-rose-800'}`}
          />
        </div>
  
        {isBlog && (
          <div className="space-y-2">
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-orange-300' : 'text-rose-700'}`}>
              Content (minimum 3 lines)
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts about India..."
              className={`w-full p-2 rounded-lg border-2 min-h-[150px] ${
                isDarkMode ? 'bg-gray-800 border-gray-600 text-orange-100' : 
                'bg-amber-50 border-amber-200 text-rose-800'
              }`}
            />
          </div>
        )}
  
        <div className="space-y-2">
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-orange-300' : 'text-rose-700'}`}>
            {isBlog ? 'Featured Image' : 'Upload Media'}
          </label>
          <div className={`border-2 rounded-lg p-4 ${
            isDarkMode ? 'border-gray-600 bg-gray-800' : 'border-amber-200 bg-amber-50'
          }`}>
            <div className="flex flex-col items-center justify-center gap-2">
              <Upload className={`h-8 w-8 ${isDarkMode ? 'text-orange-400' : 'text-rose-500'}`} />
              <p className={`text-sm ${isDarkMode ? 'text-orange-300' : 'text-rose-600'}`}>
                {isBlog
                  ? 'Upload a featured image for your blog (optional)'
                  : `Upload ${['culture', 'locations', 'foods'].includes(selectedType) ? 
                    'an image or video' : 'a file'}`}
              </p>
  
              <input
                type="file"
                className="hidden"
                id="file-upload"
                accept={`${['culture', 'locations', 'foods', 'blog'].includes(selectedType) ? 
                  'image/*,video/*' : '*'}`}
                onChange={handleFileChange}
              />
              <label
                htmlFor="file-upload"
                className={`px-4 py-2 rounded-lg text-sm cursor-pointer transition-colors ${
                  isDarkMode ? 
                  'bg-orange-600 text-white hover:bg-orange-500' : 
                  'bg-rose-500 text-white hover:bg-rose-400'
                }`}
              >
                Choose File
              </label>
  
              {file && (
                <p className={`text-sm mt-2 font-medium ${
                  isDarkMode ? 'text-orange-300' : 'text-rose-600'
                }`}>
                  Selected: {file.name}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };