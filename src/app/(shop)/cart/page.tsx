"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useCartStore } from "@/lib/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CartItemCard } from "@/components/cart/cart-item-card";
import { useAuth } from "@/lib/hooks/use-auth";

export default function CartPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const { isAuthenticated, isLoading } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (isAuthenticated) {
        try {
          const response = await fetch("/api/cart");
          if (response.ok) {
            const data = await response.json();

            // Only sync with server if there are server items and local cart is empty
            // or if we haven't initialized yet
            if (
              (data.items.length > 0 && items.length === 0) ||
              !isInitialized
            ) {
              useCartStore.getState().syncWithServer(data.items);
              setIsInitialized(true);
            }
          }
        } catch (error) {
          console.error("Error fetching cart items:", error);
        }
      } else {
        // For non-authenticated users, just mark as initialized
        setIsInitialized(true);
      }
    };

    if (!isLoading) {
      fetchCartItems();
    }
  }, [isAuthenticated, isLoading, items.length, isInitialized]);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to checkout");
      router.push("/login");
      return;
    }

    router.push("/checkout");
  };

  // Show loading state while initializing
  if (!isInitialized) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Your Cart
          </h1>
          <p className="mt-4 text-gray-500">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Your Cart
          </h1>
          <p className="mt-4 text-gray-500">Your cart is empty.</p>
          <div className="mt-6">
            <Link href="/">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Your Cart
        </h1>

        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <div className="lg:col-span-7">
            <ul
              role="list"
              className="divide-y divide-gray-200 border-t border-b border-gray-200"
            >
              {items.map((item) => (
                <CartItemCard key={item.id} item={item} />
              ))}
            </ul>

            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={() => router.push("/")}>
                Continue Shopping
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  clearCart();
                  toast.success("Cart cleared");
                }}
              >
                Clear Cart
              </Button>
            </div>
          </div>

          <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
            <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Subtotal</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatPrice(totalPrice())}
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <p className="text-base font-medium text-gray-900">
                  Order total
                </p>
                <p className="text-base font-medium text-gray-900">
                  {formatPrice(totalPrice())}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <Button className="w-full" onClick={handleCheckout}>
                Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
