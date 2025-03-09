"use client";

import Image from "next/image";
import { ImageProps } from "next/image";
import { useState, useEffect } from "react";
import { cn, getOptimizedImageUrl } from "@/lib/utils";
import { getImagePlaceholder } from "@/lib/image-placeholder";

interface OptimizedImageProps extends Omit<ImageProps, "src" | "alt"> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  optimizeUrl?: boolean;
  placeholderType?: "color" | "svg" | "blur";
  objectFit?: "cover" | "contain" | "fill" | "none";
}

export function OptimizedImage({
  src,
  alt,
  fallbackSrc = "/images/placeholder.jpg",
  className,
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  quality = 80,
  width = 800,
  height,
  optimizeUrl = true,
  placeholderType = "blur",
  objectFit = "cover",
  ...props
}: OptimizedImageProps) {
  // Optimize the URL if needed
  const optimizedSrc = optimizeUrl
    ? getOptimizedImageUrl(src, Number(width), quality)
    : src;

  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Generate placeholder
  const placeholder = getImagePlaceholder(placeholderType);

  useEffect(() => {
    setImgSrc(optimizedSrc);
    setIsLoading(true);
    setError(false);
  }, [optimizedSrc]);

  // Handle image load error
  const handleError = () => {
    setError(true);
    setImgSrc(fallbackSrc);
  };

  // Handle image load complete
  const handleLoadComplete = () => {
    setIsLoading(false);
  };

  // Determine object-fit style based on prop
  const getObjectFitClass = () => {
    switch (objectFit) {
      case "contain":
        return "object-contain";
      case "fill":
        return "object-fill";
      case "none":
        return "object-none";
      case "cover":
      default:
        return "object-cover";
    }
  };

  return (
    <div className={cn("relative overflow-hidden w-full h-full", className)}>
      {isLoading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
          <span className="sr-only">Loading...</span>
        </div>
      )}
      {imgSrc && (
        <Image
          src={imgSrc}
          alt={alt}
          onError={handleError}
          onLoad={handleLoadComplete}
          priority={priority}
          sizes={sizes}
          quality={quality}
          loading={priority ? "eager" : "lazy"}
          className={cn(
            "transition-opacity duration-300",
            getObjectFitClass(),
            "object-center w-full h-full",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          width={width}
          height={height || width}
          placeholder="blur"
          blurDataURL={placeholder}
          {...props}
        />
      )}
    </div>
  );
}
