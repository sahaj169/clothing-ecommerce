"use client";

import dynamic from "next/dynamic";

// Dynamically import the FloatingCart component with no SSR
const FloatingCart = dynamic(
  () => import("./floating-cart").then((mod) => mod.FloatingCart),
  {
    ssr: false,
  }
);

export function FloatingCartWrapper() {
  return <FloatingCart />;
}
