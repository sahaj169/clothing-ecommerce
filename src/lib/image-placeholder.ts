/**
 * Utility to generate image placeholders for better loading experience
 */

/**
 * Generate a simple SVG placeholder with specified dimensions and color
 */
export function generateSVGPlaceholder(
  width: number = 100,
  height: number = 100,
  bgColor: string = "#f3f4f6"
): string {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}'%3E%3Crect width='${width}' height='${height}' fill='${bgColor.replace(
    "#",
    "%23"
  )}'/%3E%3C/svg%3E`;
}

/**
 * Generate a simple color placeholder
 */
export function generateColorPlaceholder(color: string = "#f3f4f6"): string {
  return `data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7`;
}

/**
 * Generate a blurred placeholder for an image
 * This is a simplified version - for production, you'd want to use a library like plaiceholder
 */
export function generateBlurPlaceholder(): string {
  // A very small, blurred image as base64
  return "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAAIAAoDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD+/iiiigD/2Q==";
}

/**
 * Get a placeholder based on the image type
 */
export function getImagePlaceholder(
  type: "color" | "svg" | "blur" = "color"
): string {
  switch (type) {
    case "svg":
      return generateSVGPlaceholder();
    case "blur":
      return generateBlurPlaceholder();
    case "color":
    default:
      return generateColorPlaceholder();
  }
}
