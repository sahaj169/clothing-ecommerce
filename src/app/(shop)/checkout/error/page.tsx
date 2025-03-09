"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

function CheckoutErrorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const errorMessage =
    searchParams.get("message") || "Something went wrong with your order.";
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/cart");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="flex flex-col items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Checkout Failed
          </h1>
          <p className="mt-4 text-base text-gray-500 text-center max-w-md">
            {errorMessage}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            You will be redirected to your cart in {countdown} seconds.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
            <Button
              onClick={() => router.push("/cart")}
              className="flex items-center gap-2"
            >
              <ShoppingCart className="h-4 w-4" />
              Return to Cart
            </Button>
          </div>

          <div className="mt-12 border-t border-gray-200 pt-8">
            <p className="text-sm text-gray-500 text-center">
              If you believe this is an error, please contact our{" "}
              <Link
                href="/contact"
                className="text-indigo-600 hover:text-indigo-500"
              >
                customer support
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutErrorPage() {
  return (
    <Suspense>
      <CheckoutErrorContent />
    </Suspense>
  );
}
