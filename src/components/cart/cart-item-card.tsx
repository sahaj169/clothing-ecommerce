"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { CartItem } from "@/lib/store/cart-store";
import { useAuth } from "@/lib/hooks/use-auth";

interface CartItemCardProps {
  item: CartItem;
}

export function CartItemCard({ item }: CartItemCardProps) {
  const { removeItem, updateItemQuantity } = useCartStore();
  const { isAuthenticated } = useAuth();

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;

    updateItemQuantity(item.id, newQuantity);

    if (isAuthenticated) {
      try {
        await fetch("/api/cart", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: item.id,
            quantity: newQuantity,
          }),
        });
      } catch (error) {
        console.error("Error updating cart item:", error);
      }
    }
  };

  const handleRemoveItem = async () => {
    removeItem(item.id);

    if (isAuthenticated) {
      try {
        await fetch("/api/cart", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: item.id,
          }),
        });
      } catch (error) {
        console.error("Error removing cart item:", error);
      }
    }
  };

  return (
    <li className="flex py-6">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <Image
          src={item.image}
          alt={item.name}
          width={100}
          height={100}
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3>
              <Link href={`/product/${item.productId}`}>{item.name}</Link>
            </h3>
            <p className="ml-4">{formatPrice(item.price * item.quantity)}</p>
          </div>
          <p className="mt-1 text-sm text-gray-500">Size: {item.size}</p>
        </div>
        <div className="flex flex-1 items-end justify-between text-sm">
          <div className="flex items-center">
            <button
              type="button"
              className="rounded-md border border-gray-300 px-2 py-1 text-gray-900 hover:bg-gray-50"
              onClick={() => handleQuantityChange(item.quantity - 1)}
            >
              -
            </button>
            <span className="mx-2 w-8 text-center">{item.quantity}</span>
            <button
              type="button"
              className="rounded-md border border-gray-300 px-2 py-1 text-gray-900 hover:bg-gray-50"
              onClick={() => handleQuantityChange(item.quantity + 1)}
            >
              +
            </button>
          </div>

          <button
            type="button"
            className="text-indigo-600 hover:text-indigo-500"
            onClick={handleRemoveItem}
          >
            <Trash className="h-5 w-5" />
          </button>
        </div>
      </div>
    </li>
  );
}
