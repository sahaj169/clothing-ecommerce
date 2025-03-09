"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function LoadingBar() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    let timeoutId: NodeJS.Timeout;

    const startLoading = () => {
      setLoading(true);
      setProgress(0);

      // Quick initial progress
      setProgress(30);

      // Gradual progress
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          const increment = Math.random() * 10;
          return Math.min(prev + increment, 90);
        });
      }, 500);
    };

    const stopLoading = () => {
      clearInterval(progressInterval);
      setProgress(100);

      timeoutId = setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 200);
    };

    startLoading();
    stopLoading();

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timeoutId);
    };
  }, [pathname, searchParams]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-100">
      <div
        className="h-full bg-indigo-600 transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          transition:
            progress === 100 ? "all 200ms ease-out" : "all 500ms ease-in-out",
        }}
      />
    </div>
  );
}
