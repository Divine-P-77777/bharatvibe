"use client"
import { useState } from "react";
import Image from "next/image";
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import { ZoomIn, ZoomOut, X ,GalleryHorizontal} from "lucide-react";

export default function ImageWithPreview({ post }: { post: any }) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  if (!post?.media_url) return null;

  return (
    <>
      {/* Thumbnail with Zoom Icon */}
      <div className="relative inline-block">
        <Image
          src={post.media_url}
          alt={post.title}
          width={400}
          height={400}
          className="rounded-2xl object-contain cursor-zoom-in"
          priority
        />
        <div
          className="absolute bottom-2 right-2 p-2 bg-black/50 rounded-full shadow cursor-pointer"
          onClick={() => setIsPreviewOpen(true)}
        >
             <GalleryHorizontal color="white" size={25} />
        </div>
      </div>

      {/* Fullscreen Viewer */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center">
          <TransformWrapper
            initialScale={1}
            minScale={0.5}
            maxScale={5}
            doubleClick={{ mode: "zoomIn" }}
            wheel={{ step: 0.15 }}
            pinch={{ step: 5 }}
          >
            {({ zoomIn, zoomOut }) => (
              <>
                <TransformComponent>
                  <Image
                    src={post.media_url}
                    alt={post.title}
                    width={800}
                    height={800}
                    className="rounded-xl object-contain max-h-[80vh] max-w-[90vw]"
                  />
                </TransformComponent>

                {/* Bottom Controls */}
                <div className="absolute bottom-6 flex items-center gap-6 justify-center w-full">
                  <button
                    onClick={() => zoomOut()}
                    className="bg-white text-black p-2 rounded-full shadow hover:bg-gray-100"
                  >
                    <ZoomOut />
                  </button>
                  <button
                    onClick={() => setIsPreviewOpen(false)}
                    className="bg-white text-black p-2 rounded-full shadow hover:bg-gray-100"
                  >
                    <X />
                  </button>
                  <button
                    onClick={() => zoomIn()}
                    className="bg-white text-black p-2 rounded-full shadow hover:bg-gray-100"
                  >
                    <ZoomIn />
                  </button>
                </div>
              </>
            )}
          </TransformWrapper>
        </div>
      )}
    </>
  );
}
