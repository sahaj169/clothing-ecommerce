"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Product, Review, Size, User } from "@prisma/client";
import { useCartStore } from "@/lib/store/cart-store";
import type { CartItem } from "@/lib/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/use-auth";
import { ShoppingCart, Trash, Check, Plus, Minus } from "lucide-react";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { ProductImageGallery } from "./product-image-gallery";

interface ProductDetailProps {
  product: Product & {
    reviews: (Review & {
      user: User;
    })[];
  };
}

export function ProductDetail({ product }: ProductDetailProps) {
  const { addItem, removeItem, updateItemQuantity, items, initializeCart } =
    useCartStore();
  const { isAuthenticated } = useAuth();
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Initialize cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart-storage");
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          if (parsedCart.state && Array.isArray(parsedCart.state.items)) {
            initializeCart(parsedCart.state.items);

            // Find if any variation of this product is in cart
            const cartItem = parsedCart.state.items.find(
              (item: CartItem) => item.productId === product.id
            );

            // Auto-select size and quantity if found
            if (cartItem) {
              setSelectedSize(cartItem.size);
              setQuantity(cartItem.quantity);
            }
          }
        } catch (error) {
          console.error("Error parsing cart from localStorage:", error);
        }
      }
      setIsLoading(false);
    }
  }, [initializeCart, product.id]);

  // Check if the product is in cart and get its quantity
  const cartItem = items.find(
    (item) => item.productId === product.id && item.size === selectedSize
  );
  const isInCart = !!cartItem;

  // Update quantity state when cart item changes
  useEffect(() => {
    if (cartItem) {
      setQuantity(cartItem.quantity);
    }
  }, [cartItem]);

  // Update quantity with immediate cart update
  const handleQuantityChange = async (newQuantity: number) => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    if (newQuantity < 1) return;

    setQuantity(newQuantity);

    // If item is in cart, update quantity
    if (isInCart && cartItem) {
      updateItemQuantity(cartItem.id, newQuantity);

      if (isAuthenticated) {
        try {
          await fetch("/api/cart", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: cartItem.id,
              quantity: newQuantity,
            }),
          });
          toast.success("Cart updated");
        } catch (error) {
          console.error("Error updating cart:", error);
          toast.error("Failed to update cart");
        }
      }
    }
  };

  const handleSizeChange = (size: Size) => {
    setSelectedSize(size);
    // Find if this size variation is in cart
    const sizeVariation = items.find(
      (item) => item.productId === product.id && item.size === size
    );
    // Set quantity based on cart or reset to 1
    setQuantity(sizeVariation ? sizeVariation.quantity : 1);
  };

  // Add to cart function
  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    if (!product.inStock) {
      toast.error("This product is out of stock");
      return;
    }

    // If already in cart, just return (quantity updates are handled by +/- buttons)
    if (isInCart) return;

    const cartItem = {
      id: Math.random().toString(36).substring(2) + Date.now().toString(36),
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity,
      size: selectedSize,
      stockCount: product.stockCount,
    };

    addItem(cartItem);
    toast.success("Added to cart");

    if (isAuthenticated) {
      try {
        await fetch("/api/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: product.id,
            quantity,
            size: selectedSize,
          }),
        });
      } catch (error) {
        console.error("Error syncing with server:", error);
      }
    }
  };

  const handleRemoveFromCart = async () => {
    if (!selectedSize) return;

    const cartItem = items.find(
      (item) => item.productId === product.id && item.size === selectedSize
    );

    if (cartItem) {
      removeItem(cartItem.id);
      toast.success("Removed from cart");
      setQuantity(1); // Reset quantity after removing

      if (isAuthenticated) {
        try {
          await fetch("/api/cart", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: cartItem.id,
            }),
          });
        } catch (error) {
          console.error("Error removing from cart:", error);
        }
      }
    }
  };

  if (isLoading || !isMounted) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:px-8">
        {/* Product images */}
        <div className="lg:max-w-lg lg:self-end">
          <ProductImageGallery
            images={product.images}
            productName={product.name}
          />
        </div>

        {/* Product details */}
        <div className="mt-10 lg:col-start-2 lg:mt-0">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {product.name}
          </h1>
          <div className="mt-3">
            <p className="text-3xl tracking-tight text-gray-900">
              {formatPrice(product.price)}
            </p>
          </div>

          {/* Stock availability indicator */}
          <div className="mt-2">
            {product.inStock ? (
              <p className="text-sm text-green-600">
                In Stock (
                {product.stockCount > 0
                  ? `${product.stockCount} items left`
                  : "Available"}
                )
              </p>
            ) : (
              <p className="text-sm text-red-600">Out of Stock</p>
            )}
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-900">Description</h3>
            <div className="mt-2 space-y-6 text-base text-gray-700">
              {product.description}
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">Size</h3>
            </div>

            <div className="mt-2 grid grid-cols-3 gap-3 sm:grid-cols-6">
              {product.size.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`flex items-center justify-center rounded-md border py-3 px-3 text-sm font-medium ${
                    selectedSize === size
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
                  }`}
                  onClick={() => handleSizeChange(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity selector */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
            </div>

            <div className="mt-2 flex items-center">
              <button
                type="button"
                className="rounded-l-md border border-gray-300 px-3 py-2 text-gray-900 hover:bg-gray-50 disabled:opacity-50"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1 || !selectedSize}
              >
                <Minus className="h-4 w-4" />
              </button>
              <div className="border-t border-b border-gray-300 px-4 py-2 text-center w-12">
                {quantity}
              </div>
              <button
                type="button"
                className="rounded-r-md border border-gray-300 px-3 py-2 text-gray-900 hover:bg-gray-50 disabled:opacity-50"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={!selectedSize}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Cart buttons */}
          <div className="mt-6 space-y-2">
            {!isInCart ? (
              <Button
                onClick={handleAddToCart}
                className="w-full"
                disabled={!product.inStock || !selectedSize}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            ) : (
              <Button
                variant="outline"
                className="w-full border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
                disabled={true}
              >
                <Check className="mr-2 h-4 w-4" />
                Added to Cart
              </Button>
            )}

            {isInCart && (
              <Button
                onClick={handleRemoveFromCart}
                variant="outline"
                className="w-full border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <Trash className="mr-2 h-4 w-4" />
                Remove from Cart
              </Button>
            )}

            {!product.inStock && (
              <p className="text-sm text-red-600 mt-2 text-center">
                This product is currently out of stock
              </p>
            )}
          </div>

          {/* Reviews */}
          <div className="mt-10">
            <h3 className="text-lg font-medium text-gray-900">Reviews</h3>
            <div className="mt-6 space-y-6 divide-y divide-gray-200">
              {product.reviews.length > 0 ? (
                product.reviews.map((review) => (
                  <div key={review.id} className="pt-6">
                    <div className="flex items-center">
                      <p className="font-medium text-gray-900">
                        {review.user.name}
                      </p>
                      <div className="ml-4 flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={`h-5 w-5 ${
                              i < review.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 space-y-6 text-sm text-gray-600">
                      <p>{review.comment}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No reviews yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
