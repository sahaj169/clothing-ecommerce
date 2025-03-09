import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Providers } from "@/components/layout/providers";
import { FloatingCartWrapper } from "@/components/cart/floating-cart-wrapper";
import { getServerAuth } from "@/lib/auth/get-server-auth";
import { LoadingBar } from "@/components/ui/loading-bar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StyleHub - Fashion for Everyone",
  description:
    "Your one-stop destination for trendy fashion across all ages and styles.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get authentication status from server
  const initialAuth = await getServerAuth();

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers initialAuth={initialAuth}>
          <LoadingBar />
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <FloatingCartWrapper />
          </div>
        </Providers>
      </body>
    </html>
  );
}
