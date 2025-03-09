"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export function PageContainer({
  children,
  className,
  fullWidth = false,
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 py-8 sm:px-6 md:py-10 lg:px-8",
        fullWidth ? "max-w-full" : "max-w-7xl",
        className
      )}
    >
      {children}
    </div>
  );
}
