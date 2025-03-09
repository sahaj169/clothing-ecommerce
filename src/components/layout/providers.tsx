"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/lib/context/auth-context";

interface ProvidersProps {
  children: React.ReactNode;
  initialAuth?: any;
}

export function Providers({ children, initialAuth }: ProvidersProps) {
  return (
    <SessionProvider>
      <AuthProvider initialAuth={initialAuth}>
        {children}
        <Toaster position="top-center" />
      </AuthProvider>
    </SessionProvider>
  );
}
