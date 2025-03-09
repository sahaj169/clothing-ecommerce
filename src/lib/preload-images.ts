/**
 * Utility to preload critical images for better performance
 */

/**
 * Preload a single image
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Preload multiple images
 */
export function preloadImages(srcs: string[]): Promise<void[]> {
  return Promise.all(srcs.map(preloadImage));
}

/**
 * Preload featured product images
 * This can be called in layout or page components
 */
export async function preloadFeaturedProductImages(
  images: string[]
): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    // Use requestIdleCallback for better performance
    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(() => {
        preloadImages(images);
      });
    } else {
      // Fallback for browsers that don't support requestIdleCallback
      setTimeout(() => {
        preloadImages(images);
      }, 1);
    }
  } catch (error) {
    console.error("Error preloading images:", error);
  }
}
