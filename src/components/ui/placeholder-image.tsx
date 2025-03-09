"use client";

import Image from "next/image";
import { ImageProps } from "next/image";
import { useState } from "react";

interface PlaceholderImageProps extends Omit<ImageProps, "src" | "alt"> {
  src: string;
  alt: string;
  fallbackSrc?: string;
}

export function PlaceholderImage({
  src,
  alt,
  fallbackSrc = "/images/placeholder.jpg",
  ...props
}: PlaceholderImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  // Handle image load error
  const handleError = () => {
    setImgSrc(fallbackSrc);
  };

  return <Image src={imgSrc} alt={alt} onError={handleError} {...props} />;
}
