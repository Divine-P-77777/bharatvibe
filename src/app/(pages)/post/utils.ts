import imageCompression from 'browser-image-compression';
export const validateFile = (file: File, toast: any) => {
    if (file.type.startsWith('video/') && file.size > 500 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Video files must be smaller than 500MB', variant: 'destructive' });
      return false;
    }
  
    if (file.type.startsWith('image/') && file.size > 10 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Image files must be smaller than 10MB', variant: 'destructive' });
      return false;
    }
  
    return true;
  };
  
  export const compressImage = async (file: File) => {
    const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
    return await imageCompression(file, options);
  };