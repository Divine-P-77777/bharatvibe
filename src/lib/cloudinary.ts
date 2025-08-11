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






// import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// import { corsHeaders } from "../_shared/cors.ts";
// const CLOUDINARY_CLOUD_NAME = Deno.env.get("CLOUDINARY_CLOUD_NAME");
// const CLOUDINARY_API_KEY = Deno.env.get("CLOUDINARY_API_KEY");
// const CLOUDINARY_API_SECRET = Deno.env.get("CLOUDINARY_API_SECRET");
// // Maximum file sizes
// const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
// const MAX_VIDEO_SIZE = 400 * 1024 * 1024; // 400MB
// const MAX_PDF_SIZE = 20 * 1024 * 1024; // 20MB
// serve(async (req)=>{
//   console.log("Cloudinary upload function called");
//   // Handle CORS preflight requests
//   if (req.method === 'OPTIONS') {
//     return new Response(null, {
//       headers: corsHeaders
//     });
//   }
//   try {
//     const authHeader = req.headers.get('Authorization');
//     if (!authHeader) {
//       console.error("No authorization header");
//       return new Response(JSON.stringify({
//         error: 'No authorization header'
//       }), {
//         status: 401,
//         headers: {
//           ...corsHeaders,
//           "Content-Type": "application/json"
//         }
//       });
//     }
//     let formData;
//     try {
//       formData = await req.formData();
//     } catch (error) {
//       console.error("Failed to parse form data:", error);
//       return new Response(JSON.stringify({
//         error: 'Failed to parse form data',
//         details: error.message
//       }), {
//         status: 400,
//         headers: {
//           ...corsHeaders,
//           "Content-Type": "application/json"
//         }
//       });
//     }
//     const file = formData.get('file');
//     const resourceType = formData.get('resourceType'); // 'image', 'video', or 'pdf'
//     if (!file) {
//       console.error("No file provided");
//       return new Response(JSON.stringify({
//         error: 'No file provided'
//       }), {
//         status: 400,
//         headers: {
//           ...corsHeaders,
//           "Content-Type": "application/json"
//         }
//       });
//     }
//     console.log(`Processing ${resourceType} file: ${file.name} (${file.size} bytes)`);
//     // Check file size
//     if (resourceType === 'image' && file.size > MAX_IMAGE_SIZE) {
//       console.error(`Image file too large: ${file.size} bytes`);
//       return new Response(JSON.stringify({
//         error: 'Image exceeds maximum size of 10MB'
//       }), {
//         status: 400,
//         headers: {
//           ...corsHeaders,
//           "Content-Type": "application/json"
//         }
//       });
//     }
//     if (resourceType === 'video' && file.size > MAX_VIDEO_SIZE) {
//       console.error(`Video file too large: ${file.size} bytes`);
//       return new Response(JSON.stringify({
//         error: 'Video exceeds maximum size of 400MB'
//       }), {
//         status: 400,
//         headers: {
//           ...corsHeaders,
//           "Content-Type": "application/json"
//         }
//       });
//     }
//     if (resourceType === 'pdf' && file.size > MAX_PDF_SIZE) {
//       console.error(`PDF file too large: ${file.size} bytes`);
//       return new Response(JSON.stringify({
//         error: 'PDF exceeds maximum size of 20MB'
//       }), {
//         status: 400,
//         headers: {
//           ...corsHeaders,
//           "Content-Type": "application/json"
//         }
//       });
//     }
//     // Log out Cloudinary credentials for debugging (will be hidden in logs)
//     console.log("Cloudinary credentials check:");
//     console.log("CLOUD_NAME present:", !!CLOUDINARY_CLOUD_NAME);
//     console.log("API_KEY present:", !!CLOUDINARY_API_KEY);
//     console.log("API_SECRET present:", !!CLOUDINARY_API_SECRET);
//     if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
//       console.error("Missing Cloudinary credentials");
//       return new Response(JSON.stringify({
//         error: 'Missing Cloudinary credentials. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in Supabase secrets.'
//       }), {
//         status: 500,
//         headers: {
//           ...corsHeaders,
//           "Content-Type": "application/json"
//         }
//       });
//     }
//     const timestamp = Math.round(new Date().getTime() / 1000);
//     const folder = `bharat_vibes/${resourceType}s`;
//     // Convert file to ArrayBuffer
//     const arrayBuffer = await file.arrayBuffer();
//     const bytes = new Uint8Array(arrayBuffer);
//     // Create a simple signature string - simplified approach
//     const signature_string = `folder=${folder}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
//     // Use Web Crypto API to generate SHA-1 hash
//     const msgUint8 = new TextEncoder().encode(signature_string);
//     const hashBuffer = await crypto.subtle.digest('SHA-1', msgUint8);
//     const hashArray = Array.from(new Uint8Array(hashBuffer));
//     const signature = hashArray.map((b)=>b.toString(16).padStart(2, '0')).join('');
//     console.log("Signature generated successfully");
//     // Prepare form data for Cloudinary
//     const formDataToSend = new FormData();
//     formDataToSend.append('file', new Blob([
//       bytes
//     ]));
//     formDataToSend.append('api_key', CLOUDINARY_API_KEY);
//     formDataToSend.append('timestamp', timestamp.toString());
//     formDataToSend.append('signature', signature);
//     formDataToSend.append('folder', folder);
//     // Add resource type specific options
//     if (resourceType === 'video') {
//       formDataToSend.append('resource_type', 'video');
//     } else if (resourceType === 'pdf') {
//       formDataToSend.append('resource_type', 'raw');
//     }
//     // Determine upload URL based on resource type
//     let uploadUrl;
//     uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`;
//     console.log(`Uploading to Cloudinary: ${uploadUrl}`);
//     let response;
//     try {
//       response = await fetch(uploadUrl, {
//         method: 'POST',
//         body: formDataToSend
//       });
//     } catch (error) {
//       console.error("Network error uploading to Cloudinary:", error);
//       return new Response(JSON.stringify({
//         error: 'Network error connecting to Cloudinary',
//         details: error.message
//       }), {
//         status: 500,
//         headers: {
//           ...corsHeaders,
//           "Content-Type": "application/json"
//         }
//       });
//     }
//     let result;
//     try {
//       result = await response.json();
//     } catch (error) {
//       console.error("Failed to parse Cloudinary response:", error);
//       return new Response(JSON.stringify({
//         error: 'Failed to parse Cloudinary response',
//         details: error.message
//       }), {
//         status: 500,
//         headers: {
//           ...corsHeaders,
//           "Content-Type": "application/json"
//         }
//       });
//     }
//     console.log(`Cloudinary upload status: ${response.status}`);
//     if (response.ok) {
//       console.log("Upload successful:", result.secure_url);
//       return new Response(JSON.stringify({
//         url: result.secure_url,
//         publicId: result.public_id,
//         format: result.format
//       }), {
//         headers: {
//           ...corsHeaders,
//           "Content-Type": "application/json"
//         }
//       });
//     } else {
//       console.error("Cloudinary error:", result);
//       return new Response(JSON.stringify({
//         error: 'Failed to upload to Cloudinary',
//         details: result
//       }), {
//         status: 500,
//         headers: {
//           ...corsHeaders,
//           "Content-Type": "application/json"
//         }
//       });
//     }
//   } catch (error) {
//     console.error("Unhandled error in cloudinary-upload function:", error);
//     return new Response(JSON.stringify({
//       error: error.message
//     }), {
//       status: 500,
//       headers: {
//         ...corsHeaders,
//         "Content-Type": "application/json"
//       }
//     });
//   }
// });
