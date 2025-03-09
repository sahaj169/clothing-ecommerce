"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingCart, X, Trash, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { toast } from "react-hot-toast";
import { PlaceholderImage } from "@/components/ui/placeholder-image";

export function FloatingCart() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { items, totalItems, totalPrice, removeItem } = useCartStore();

  // Hide on cart and checkout pages
  const shouldHide =
    pathname?.includes("/cart") || pathname?.includes("/checkout");

  // Show the cart toggle button only if there are items in the cart and not on cart/checkout pages
  useEffect(() => {
    setIsVisible(items.length > 0 && !shouldHide);
  }, [items.length, shouldHide]);

  // Close the cart when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest(".floating-cart-container")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    setIsAnimating(true);
    setIsOpen(!isOpen);
    // Reset animation state after animation completes
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleRemoveItem = (id: string, name: string) => {
    removeItem(id);
    toast.success(`Removed ${name} from cart`);
  };

  const handleGoToCheckout = () => {
    setIsOpen(false);
    router.push("/checkout");
  };

  // If no items in cart or on cart/checkout pages, don't render anything
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 floating-cart-container">
      {/* Collapsed view - just the button */}
      {!isOpen ? (
        <div className="relative">
          <Button
            onClick={handleToggle}
            className={`rounded-full h-12 w-12 md:h-14 md:w-14 shadow-lg flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 transition-transform ${
              isAnimating ? "scale-90" : ""
            }`}
          >
            <ShoppingCart className="h-5 w-5 md:h-6 md:w-6" />
          </Button>
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 md:h-6 md:w-6 flex items-center justify-center">
            {totalItems()}
          </span>
        </div>
      ) : (
        // Expanded view - cart summary
        <div
          className={`bg-white rounded-lg shadow-xl w-[calc(100vw-2rem)] sm:w-80 max-h-[70vh] flex flex-col overflow-hidden border border-gray-200 transition-all ${
            isAnimating ? "scale-95 opacity-90" : ""
          }`}
        >
          <div className="p-3 md:p-4 bg-indigo-600 text-white flex justify-between items-center">
            <h3 className="font-semibold flex items-center gap-2 text-sm md:text-base">
              <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
              Your Cart ({totalItems()} items)
            </h3>
            <button
              onClick={handleToggle}
              className="text-white hover:text-gray-200 transition-colors p-1"
            >
              <X className="h-4 w-4 md:h-5 md:w-5" />
            </button>
          </div>

          <div className="overflow-y-auto flex-grow p-3 md:p-4 max-h-[40vh]">
            {items.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Your cart is empty
              </p>
            ) : (
              <ul className="space-y-3 md:space-y-4">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex gap-2 md:gap-3 pb-3 border-b border-gray-100 group"
                  >
                    <div className="h-14 w-14 md:h-16 md:w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="flex flex-col flex-grow min-w-0">
                      <h4 className="text-xs md:text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        Size: {item.size} | Qty: {item.quantity}
                      </p>
                      {item.stockCount !== undefined &&
                        item.quantity >= item.stockCount && (
                          <p className="text-xs text-amber-600 mt-1">
                            Max quantity available
                          </p>
                        )}
                      <div className="flex justify-between items-center mt-auto">
                        <p className="text-xs md:text-sm font-medium text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        <button
                          onClick={() => handleRemoveItem(item.id, item.name)}
                          className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                          aria-label="Remove item"
                        >
                          <Trash className="h-3 w-3 md:h-4 md:w-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="p-3 md:p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between mb-3">
              <span className="text-xs md:text-sm font-medium">Subtotal</span>
              <span className="text-xs md:text-sm font-medium">
                {formatPrice(totalPrice())}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => {
                  setIsOpen(false);
                  router.push("/cart");
                }}
                variant="outline"
                className="w-full text-xs md:text-sm py-1 md:py-2"
                size="sm"
              >
                View Cart
              </Button>
              <Button
                onClick={handleGoToCheckout}
                className="w-full flex items-center justify-center gap-1 text-xs md:text-sm py-1 md:py-2"
                size="sm"
              >
                <ShoppingBag className="h-3 w-3 md:h-4 md:w-4" />
                Checkout
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
