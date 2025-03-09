"use client";

import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { PageContainer } from "@/components/layout/page-container";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  image: string;
}

interface Address {
  name: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

interface OrderDetails {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  total: number;
  items: OrderItem[];
  address: Address;
}

interface CheckoutSuccessClientProps {
  order: OrderDetails | null;
  error?: string;
}

export default function CheckoutSuccessClient({
  order,
  error,
}: CheckoutSuccessClientProps) {
  if (error) {
    return (
      <PageContainer className="max-w-4xl mx-auto">
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-red-100">
            <Package className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="mt-4 text-2xl font-bold">Order Not Found</h1>
          <p className="mt-2 text-gray-500">{error}</p>
          <div className="mt-6">
            <Button asChild>
              <Link href="/account">View Your Orders</Link>
            </Button>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!order) {
    return (
      <PageContainer className="max-w-4xl mx-auto">
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-yellow-100">
            <Package className="h-8 w-8 text-yellow-600" />
          </div>
          <h1 className="mt-4 text-2xl font-bold">
            Order Information Unavailable
          </h1>
          <p className="mt-2 text-gray-500">
            We couldn't retrieve your order information at this time.
          </p>
          <div className="mt-6">
            <Button asChild>
              <Link href="/account">View Your Orders</Link>
            </Button>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="max-w-4xl mx-auto">
      <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="mt-4 text-2xl font-bold">Order Confirmed!</h1>
          <p className="mt-2 text-gray-500">
            Thank you for your order. We've received your order and will begin
            processing it right away.
          </p>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-col md:flex-row justify-between mb-6">
            <div>
              <h2 className="text-lg font-medium">
                Order #{order.orderNumber}
              </h2>
              <p className="text-sm text-gray-500">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button asChild variant="outline" size="sm">
                <Link href={`/order/${order.id}`}>
                  View Order Details <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-base font-medium mb-3">Items</h3>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-start">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover object-center"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/images/placeholder.jpg";
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-100">
                          <Package className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="text-sm font-medium">{item.name}</h4>
                      <p className="mt-1 text-xs text-gray-500">
                        Size: {item.size} | Qty: {item.quantity}
                      </p>
                      <p className="mt-1 text-sm font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-base font-medium mb-3">Shipping Address</h3>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm">
                  <p className="font-medium">{order.address.name}</p>
                  <p>{order.address.street}</p>
                  <p>
                    {order.address.city}, {order.address.state}{" "}
                    {order.address.postalCode}
                  </p>
                  <p>{order.address.country}</p>
                  <p>{order.address.phone}</p>
                </div>
              </div>

              <div>
                <h3 className="text-base font-medium mb-3">
                  Payment Information
                </h3>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm">
                  <p>
                    <span className="font-medium">Method:</span>{" "}
                    {order.paymentMethod === "CREDIT_CARD"
                      ? "Credit Card"
                      : order.paymentMethod === "PAYPAL"
                      ? "PayPal"
                      : order.paymentMethod === "UPI"
                      ? "UPI"
                      : "Bank Transfer"}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    <span
                      className={
                        order.paymentStatus === "PAID"
                          ? "text-green-600"
                          : order.paymentStatus === "PENDING"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }
                    >
                      {order.paymentStatus.charAt(0) +
                        order.paymentStatus.slice(1).toLowerCase()}
                    </span>
                  </p>
                  <p className="mt-2 font-medium">
                    Total: {formatPrice(order.total)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Button asChild variant="outline">
              <Link href="/products">Continue Shopping</Link>
            </Button>
            <Button asChild>
              <Link href={`/order/${order.id}/tracking`}>Track Order</Link>
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
