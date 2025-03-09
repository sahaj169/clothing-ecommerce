"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  ArrowLeft,
  CreditCard,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { PageContainer } from "@/components/layout/page-container";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
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

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  trackingNumber: string;
  estimatedDelivery: string | null;
  items: OrderItem[];
  address: Address | null;
}

interface OrderDetailsClientProps {
  order: Order;
}

export default function OrderDetailsClient({ order }: OrderDetailsClientProps) {
  const router = useRouter();
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancelOrder = async () => {
    if (order.status !== "PROCESSING" && order.status !== "PENDING") {
      toast.error("This order cannot be cancelled");
      return;
    }

    if (
      !confirm(
        "Are you sure you want to cancel this order? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsCancelling(true);
    try {
      const response = await fetch(`/api/orders/${order.id}/cancel`, {
        method: "POST",
      });

      if (response.ok) {
        toast.success("Order cancelled successfully");
        router.refresh();
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to cancel order");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel order");
    } finally {
      setIsCancelling(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case "PROCESSING":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "SHIPPED":
        return <Truck className="h-5 w-5 text-purple-500" />;
      case "DELIVERED":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "CANCELLED":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getPaymentStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case "PAID":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "PENDING":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "FAILED":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
  };

  return (
    <PageContainer>
      <Button
        variant="ghost"
        className="mb-6 flex items-center gap-2"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Order Details</h1>
          <p className="text-gray-500">Order #{order.orderNumber}</p>
          <p className="text-gray-500">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          {(order.status === "PROCESSING" || order.status === "PENDING") && (
            <Button
              variant="destructive"
              onClick={handleCancelOrder}
              disabled={isCancelling}
            >
              {isCancelling ? "Cancelling..." : "Cancel Order"}
            </Button>
          )}
          {order.trackingNumber && (
            <Button onClick={() => router.push(`/order/${order.id}/tracking`)}>
              Track Order
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Order Status</h2>

            <div className="mb-6 flex items-center gap-2">
              {getStatusIcon(order.status)}
              <span className="font-medium">
                {order.status.charAt(0).toUpperCase() +
                  order.status.slice(1).toLowerCase()}
              </span>
            </div>

            <div className="mb-6">
              <h3 className="mb-2 text-lg font-medium">Payment</h3>
              <div className="flex items-center gap-2">
                {getPaymentStatusIcon(order.paymentStatus)}
                <span>
                  {order.paymentStatus.charAt(0).toUpperCase() +
                    order.paymentStatus.slice(1).toLowerCase()}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">
                  {order.paymentMethod.charAt(0).toUpperCase() +
                    order.paymentMethod.slice(1).toLowerCase()}
                </span>
              </div>
            </div>

            {order.trackingNumber && (
              <div className="mb-6">
                <h3 className="mb-2 text-lg font-medium">Tracking</h3>
                <p className="text-gray-600">
                  Tracking Number: {order.trackingNumber}
                </p>
                {order.estimatedDelivery && (
                  <p className="text-gray-600">
                    Estimated Delivery:{" "}
                    {new Date(order.estimatedDelivery).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}

            {order.address && (
              <div>
                <h3 className="mb-2 text-lg font-medium">Shipping Address</h3>
                <p className="text-gray-600">{order.address.name}</p>
                <p className="text-gray-600">{order.address.street}</p>
                <p className="text-gray-600">
                  {order.address.city}, {order.address.state}{" "}
                  {order.address.postalCode}
                </p>
                <p className="text-gray-600">{order.address.country}</p>
                <p className="text-gray-600">{order.address.phone}</p>
              </div>
            )}
          </div>

          <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Order Items</h2>
            <div className="divide-y divide-gray-200">
              {order.items.map((item) => (
                <div key={item.id} className="flex py-4">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={96}
                        height={96}
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
                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>{item.name}</h3>
                        <p className="ml-4">{formatPrice(item.price)}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        {item.size && `Size: ${item.size}`}
                        {item.size && item.color && " | "}
                        {item.color && `Color: ${item.color}`}
                      </p>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <p className="text-gray-500">Qty {item.quantity}</p>
                      <p className="text-gray-500">
                        Subtotal: {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span>{formatPrice(order.shipping)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span>{formatPrice(order.tax)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Discount</span>
                <span className="text-green-600">
                  -{formatPrice(order.discount)}
                </span>
              </div>
            )}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
