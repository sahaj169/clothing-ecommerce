"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useCartStore } from "@/lib/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { OrderSummary } from "@/components/checkout/order-summary";
import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";

interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

interface CheckoutClientProps {
  addresses: Address[];
  isAuthenticated: boolean;
}

export default function CheckoutClient({
  addresses,
  isAuthenticated,
}: CheckoutClientProps) {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    addresses.find((addr) => addr.isDefault)?.id ||
      (addresses.length > 0 ? addresses[0].id : null)
  );
  const [paymentMethod, setPaymentMethod] = useState<string>("CREDIT_CARD");
  const [isReviewing, setIsReviewing] = useState(false);

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <PageContainer className="max-w-4xl mx-auto">
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-500 mb-6">
            Add some items to your cart before checking out.
          </p>
          <Button onClick={() => router.push("/products")}>
            Continue Shopping
          </Button>
        </div>
      </PageContainer>
    );
  }

  const handleContinueToReview = () => {
    if (!selectedAddressId) {
      toast.error("Please select an address or add a new one");
      return;
    }

    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    setIsReviewing(true);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Please select an address");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            size: item.size,
            color: item.color || "BLACK",
            price: item.price,
          })),
          addressId: selectedAddressId,
          paymentMethod,
          total: totalPrice(),
          subtotal: totalPrice(),
          tax: 0,
          shipping: 0,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to place order");
      }

      clearCart();
      router.push(`/checkout/success?orderId=${data.id}`);
    } catch (error: any) {
      console.error("Error placing order:", error);
      toast.error(error.message || "Failed to place order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <form className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                {isReviewing ? "Review Order" : "Checkout"}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {isReviewing
                  ? "Please review your order details before placing your order."
                  : "Please fill in your shipping and payment details."}
              </p>
            </div>

            {!isReviewing ? (
              <CheckoutForm
                addresses={addresses}
                selectedAddressId={selectedAddressId}
                setSelectedAddressId={setSelectedAddressId}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
              />
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Shipping Address</h3>
                  {selectedAddressId && (
                    <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50 p-4">
                      {addresses
                        .filter((address) => address.id === selectedAddressId)
                        .map((address) => (
                          <div key={address.id}>
                            <p className="font-medium">{address.name}</p>
                            <p>{address.street}</p>
                            <p>
                              {address.city}, {address.state}{" "}
                              {address.postalCode}
                            </p>
                            <p>{address.country}</p>
                            <p>{address.phone}</p>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-medium">Payment Method</h3>
                  <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <p>
                      {paymentMethod === "CREDIT_CARD"
                        ? "Credit Card"
                        : paymentMethod === "PAYPAL"
                        ? "PayPal"
                        : paymentMethod === "UPI"
                        ? "UPI"
                        : "Bank Transfer"}
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <h3 className="text-lg font-medium mb-2">Order Items</h3>
                  <div className="divide-y divide-gray-200">
                    {items.map((item) => (
                      <div
                        key={`${item.id}-${item.size}`}
                        className="flex py-4"
                      >
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover object-center"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gray-100">
                              <span className="text-gray-400">No image</span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4 flex flex-1 flex-col">
                          <div>
                            <div className="flex justify-between text-base font-medium text-gray-900">
                              <h3>{item.name}</h3>
                              <p className="ml-4">{formatPrice(item.price)}</p>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                              Size: {item.size}
                            </p>
                          </div>
                          <div className="flex flex-1 items-end justify-between text-sm">
                            <p className="text-gray-500">Qty {item.quantity}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between border-t border-gray-200 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (isReviewing) {
                    setIsReviewing(false);
                  } else {
                    router.push("/cart");
                  }
                }}
              >
                {isReviewing ? "Back to Checkout" : "Back to Cart"}
              </Button>
              <Button
                type="button"
                onClick={
                  isReviewing ? handlePlaceOrder : handleContinueToReview
                }
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="mr-2 h-4 w-4 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : isReviewing ? (
                  "Place Order"
                ) : (
                  "Continue to Review"
                )}
              </Button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-2">
          <div className="sticky top-6">
            <OrderSummary
              items={items}
              total={totalPrice()}
              showItems={true}
              showShipping={true}
              showTerms={true}
              paymentMethod={paymentMethod}
              compact={false}
            />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
