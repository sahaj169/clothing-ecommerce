"use client";

import Image from "next/image";
import Link from "next/link";
import { CartItem } from "@/lib/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { OptimizedImage } from "@/components/ui/optimized-image";

interface OrderSummaryProps {
  items: CartItem[];
  total: number;
  showItems?: boolean;
  showShipping?: boolean;
  showTerms?: boolean;
  paymentMethod?: string;
  compact?: boolean;
}

export function OrderSummary({
  items,
  total,
  showItems = true,
  showShipping = true,
  showTerms = false,
  paymentMethod,
  compact = false,
}: OrderSummaryProps) {
  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>

      {showItems && items.length > 0 && (
        <div
          className={`${
            compact ? "mt-2" : "mt-4"
          } divide-y divide-gray-200 border-t border-b border-gray-200`}
        >
          {items.map((item) => (
            <div key={item.id} className={`flex ${compact ? "py-3" : "py-6"}`}>
              <div
                className={`${
                  compact ? "h-16 w-16" : "h-20 w-20"
                } flex-shrink-0 overflow-hidden rounded-md border border-gray-200`}
              >
                <OptimizedImage
                  src={item.image}
                  alt={item.name}
                  width={compact ? 64 : 80}
                  height={compact ? 64 : 80}
                  className="h-full w-full object-cover object-center"
                />
              </div>

              <div className="ml-4 flex flex-1 flex-col">
                <div>
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <h3 className={compact ? "text-sm" : "text-base"}>
                      {item.name}
                    </h3>
                    <p className="ml-4">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                  <p
                    className={`${
                      compact ? "mt-0.5" : "mt-1"
                    } text-sm text-gray-500`}
                  >
                    Size: {item.size} {!compact && `| Qty: ${item.quantity}`}
                  </p>
                </div>
                {!compact && (
                  <div className="flex flex-1 items-end justify-between text-sm">
                    <p className="text-gray-500">Qty {item.quantity}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {paymentMethod && (
        <div className="mt-4 mb-4 border-b border-gray-200 pb-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <p>Payment Method</p>
            <p className="font-medium">
              {paymentMethod === "CREDIT_CARD" && "Credit/Debit Card"}
              {paymentMethod === "UPI" && "UPI"}
              {paymentMethod === "COD" && "Cash on Delivery"}
            </p>
          </div>
        </div>
      )}

      <div className={`${compact ? "space-y-3 pt-3" : "space-y-6 pt-6"}`}>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">Subtotal</p>
          <p className="text-sm font-medium text-gray-900">
            {formatPrice(total)}
          </p>
        </div>

        {showShipping && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Shipping</p>
            <p className="text-sm font-medium text-green-600">Free</p>
          </div>
        )}

        <div
          className={`flex items-center justify-between border-t border-gray-200 ${
            compact ? "pt-3" : "pt-6"
          }`}
        >
          <p className="text-base font-medium text-gray-900">Total</p>
          <p className="text-base font-medium text-gray-900">
            {formatPrice(total)}
          </p>
        </div>
      </div>

      {showTerms && (
        <div className="mt-4">
          <p className="text-center text-xs text-gray-500">
            By placing your order, you agree to our{" "}
            <Link
              href="/legal/terms"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Terms and Conditions
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
