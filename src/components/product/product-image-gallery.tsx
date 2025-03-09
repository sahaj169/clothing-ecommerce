"use client";

import { useState } from "react";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export function ProductImageGallery({
  images,
  productName,
}: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Handle navigation to previous image
  const handlePrevious = () => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // Handle navigation to next image
  const handleNext = () => {
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Toggle zoom state
  const toggleZoom = () => {
    setIsZoomed((prev) => !prev);
  };

  // If no images are provided, show a placeholder
  if (!images || images.length === 0) {
    return (
      <div className="aspect-square w-full rounded-lg bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">No image available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main image container */}
      <div className="relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-50 shadow-sm">
        {/* Main image */}
        <div
          className={`h-full w-full transition-transform duration-300 ${
            isZoomed ? "cursor-zoom-out scale-150" : "cursor-zoom-in"
          }`}
          onClick={toggleZoom}
        >
          <OptimizedImage
            src={images[selectedImage]}
            alt={`${productName} - Image ${selectedImage + 1}`}
            width={800}
            height={800}
            className="h-full w-full object-contain object-center"
            priority={true}
            sizes="(max-width: 768px) 100vw, 50vw"
            quality={90}
          />
        </div>

        {/* Zoom indicator */}
        {!isZoomed && (
          <button
            className="absolute bottom-2 right-2 rounded-full bg-white/80 p-1.5 text-gray-700 shadow-sm hover:bg-white hover:text-gray-900"
            onClick={toggleZoom}
            aria-label="Zoom image"
          >
            <ZoomIn size={18} />
          </button>
        )}

        {/* Navigation arrows - only show if there are multiple images */}
        {images.length > 1 && (
          <>
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 text-gray-700 shadow-sm hover:bg-white hover:text-gray-900"
              onClick={handlePrevious}
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 text-gray-700 shadow-sm hover:bg-white hover:text-gray-900"
              onClick={handleNext}
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails - only show if there are multiple images */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              key={index}
              type="button"
              className={`aspect-square overflow-hidden rounded-md transition-all ${
                selectedImage === index
                  ? "ring-2 ring-indigo-500 ring-offset-1"
                  : "ring-1 ring-gray-200 hover:ring-gray-300"
              }`}
              onClick={() => setSelectedImage(index)}
              aria-label={`View image ${index + 1} of ${images.length}`}
              aria-current={selectedImage === index ? "true" : "false"}
            >
              <div className="h-full w-full bg-gray-50 flex items-center justify-center">
                <OptimizedImage
                  src={image}
                  alt={`${productName} - Thumbnail ${index + 1}`}
                  width={100}
                  height={100}
                  className="h-full w-full object-cover"
                  sizes="100px"
                  quality={70}
                  placeholderType="color"
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
