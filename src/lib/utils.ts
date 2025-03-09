import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

export function generateSKU(productName: string, id: string) {
  const namePrefix = productName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 3);

  return `${namePrefix}-${id.slice(-6).toUpperCase()}`;
}

export function generateOrderNumber() {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp.slice(-6)}${random}`;
}

export function generateRandomId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatPhoneNumber(phoneNumber: string) {
  const cleaned = phoneNumber.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return "(" + match[1] + ") " + match[2] + "-" + match[3];
  }
  return phoneNumber;
}

export function isValidEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

/**
 * Generate an optimized image URL with width and quality parameters
 */
export function getOptimizedImageUrl(
  url: string,
  width: number = 800,
  quality: number = 80
): string {
  // Only process URLs from supported domains
  if (
    !url ||
    (!url.startsWith("https://images.unsplash.com") &&
      !url.startsWith("https://images.pexels.com"))
  ) {
    return url;
  }

  // For Unsplash, use their native image optimization API
  if (url.startsWith("https://images.unsplash.com")) {
    // Check if URL already has query parameters
    const hasParams = url.includes("?");
    const separator = hasParams ? "&" : "?";

    // Simply append optimization parameters to the existing URL
    return `${url}${separator}auto=format&w=${width}&q=${quality}`;
  }

  // For Pexels, append query parameters for optimization
  if (url.startsWith("https://images.pexels.com")) {
    // Check if URL already has query parameters
    const hasParams = url.includes("?");
    const separator = hasParams ? "&" : "?";

    // Return optimized Pexels URL
    return `${url}${separator}auto=compress&w=${width}&q=${quality}`;
  }

  return url;
}
