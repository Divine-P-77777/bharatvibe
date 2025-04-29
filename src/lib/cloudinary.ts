"use client"
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

export type MediaType = 'image' | 'video' | 'pdf';


export const uploadToCloudinary = async (file: File, type: MediaType): Promise<string | null> => {
  try {
    if (!file) return null;
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('resource_type', type === 'pdf' ? 'auto' : type);
    
    // Get session for authentication
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast.error('Authentication required');
      throw new Error('Authentication required');
    }
    
    console.log('Calling cloudinary-upload function...');

    try {
      const { data, error } = await supabase.functions.invoke('cloudinary-upload', {
        body: formData,
        headers: {
          Authorization: `Bearer ${session.access_token}`
        },
      });
      
      console.log('Cloudinary response:', data);
      
      if (error) {
        console.error('Supabase functions error:', error);
        toast.error(`Upload failed: ${error.message || 'Unknown error'}`);
        throw error;
      }
      
      if (!data || !data.url) {
        console.error('No URL returned from Cloudinary upload');
        toast.error('Upload failed: No URL returned');
        throw new Error('No URL returned from upload');
      }
      
      return data.url;
    } catch (error: any) {
      console.error('Error invoking cloudinary-upload function:', error);
      toast.error(`Upload failed: ${error.message || 'Unknown error'}`);
      throw error;
    }
  } catch (error: any) {
    console.error('Error uploading to Cloudinary:', error);
    toast.error(`Upload failed: ${error.message || 'Unknown error'}`);
    throw error;
  }
};