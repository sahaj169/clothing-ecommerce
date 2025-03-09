# Image Optimization Guide

This document explains the image optimization techniques implemented in the e-commerce application to improve loading performance.

## Implemented Optimizations

1. **Optimized Image Component**
   - Created a new `OptimizedImage` component that replaces the previous `PlaceholderImage` component
   - Added loading states with smooth transitions
   - Implemented blur-up placeholders for better user experience
   - Added support for image optimization parameters

2. **URL-based Optimization**
   - Added utility functions to optimize image URLs from Unsplash and Pexels
   - Implemented automatic width and quality parameters for better performance
   - Reduced initial image payload by using appropriate sizes

3. **Preloading Critical Images**
   - Added utilities to preload featured product images
   - Implemented priority loading for above-the-fold images
   - Used `requestIdleCallback` for better performance

4. **Next.js Configuration**
   - Updated Next.js config to use modern image formats (WebP, AVIF)
   - Configured appropriate device sizes for responsive images
   - Added cache TTL for better performance

5. **Placeholder Generation**
   - Added utilities to generate lightweight placeholders
   - Implemented SVG, color, and blur placeholder options
   - Used base64-encoded placeholders for instant loading

## Usage Guidelines

### Basic Usage

Replace all instances of `Image` or `PlaceholderImage` with `OptimizedImage`:

```tsx
import { OptimizedImage } from "@/components/ui/optimized-image";

// Basic usage
<OptimizedImage
  src="https://images.unsplash.com/photo-123456789"
  alt="Product image"
  width={500}
  height={500}
/>

// With optimization options
<OptimizedImage
  src="https://images.unsplash.com/photo-123456789"
  alt="Product image"
  width={500}
  height={500}
  priority={true} // For above-the-fold images
  quality={85}
  sizes="(max-width: 768px) 100vw, 500px"
  placeholderType="blur"
/>
```

### Preloading Featured Images

For pages with featured products, use the preloading utility:

```tsx
import { useEffect } from "react";
import { preloadFeaturedProductImages } from "@/lib/preload-images";

// In your component
useEffect(() => {
  const imagesToPreload = products
    .filter(product => product.images.length > 0)
    .map(product => product.images[0]);
  
  preloadFeaturedProductImages(imagesToPreload);
}, [products]);
```

### Optimizing Product Grids

For product grids, use the `priorityImages` prop:

```tsx
<ProductGrid products={featuredProducts} priorityImages={true} />
```

## Performance Tips

1. **Use appropriate image sizes**
   - Don't load large images for small containers
   - Use the `sizes` attribute to help the browser select the right image

2. **Prioritize above-the-fold images**
   - Set `priority={true}` for images visible on initial load
   - Limit priority images to 4-5 per page to avoid performance issues

3. **Use appropriate quality settings**
   - 80-85 is usually sufficient for product images
   - Lower quality (70-75) can be used for thumbnails

4. **Monitor performance**
   - Use Lighthouse or PageSpeed Insights to measure image performance
   - Check Core Web Vitals, especially Largest Contentful Paint (LCP)

## Future Improvements

1. **Implement responsive art direction**
   - Use different image crops for different screen sizes

2. **Add server-side image optimization**
   - Generate optimized images at build time
   - Use a service like Cloudinary or Imgix for advanced optimization

3. **Implement progressive loading**
   - Load low-quality images first, then enhance
   - Consider using LQIP (Low Quality Image Placeholders) 