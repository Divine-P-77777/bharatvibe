import React from 'react';
import useVideoThumbnail from '@/hooks/useVideoThumbnail';
import dynamic from 'next/dynamic';

const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false });

const VideoPlayerWithThumbnail = ({ url }: { url: string }) => {
  const thumbnail = useVideoThumbnail(url);

  return (
    <div className="w-fit bg-black sm:w-[500px] h-[400px] rounded-3xl overflow-hidden mt-5 p-3 mx-3">
      <ReactPlayer
        url={url}
        light={
          thumbnail ? (
            <img
              src={thumbnail}
              alt="video thumbnail"
              className="w-full h-full object-cover"
            />
          ) : false
        }
        controls
       className="!rounded-xl"
        width="100%"
        height="100%"
      />
    </div>
  );
};

export default VideoPlayerWithThumbnail;
