import React from 'react';
import useVideoThumbnail from '@/hooks/useVideoThumbnail';
import dynamic from 'next/dynamic';

const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false });

const VideoPlayerWithThumbnail = ({ url }: { url: string }) => {
  const thumbnail = useVideoThumbnail(url);

  return (
    <ReactPlayer
    url={url}
    light={thumbnail || false} 
    controls
    width="100%"
    height="400px"
    className="rounded-3xl overflow-hidden mt-5 p-3 mx-3"
  />
  
  );
};

export default VideoPlayerWithThumbnail;
