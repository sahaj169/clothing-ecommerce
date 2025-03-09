"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Package,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { PageContainer } from "@/components/layout/page-container";
import { formatPrice } from "@/lib/utils";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  image: string;
}

interface OrderStatus {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  total: number;
  items: OrderItem[];
}

interface OrderTrackingClientProps {
  order?: OrderStatus;
  orderId: string;
  isAuthenticated: boolean;
  userEmail?: string;
}

export default function OrderTrackingClient({
  order,
  orderId,
  isAuthenticated,
  userEmail,
}: OrderTrackingClientProps) {
  const router = useRouter();
  const [email, setEmail] = useState(userEmail || "");
  const [isGuestForm, setIsGuestForm] = useState(!isAuthenticated && !order);
  const [loading, setLoading] = useState(false);
  const [trackingOrder, setTrackingOrder] = useState<OrderStatus | undefined>(
    order
  );

  const handleGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `/api/orders/${orderId}?email=${encodeURIComponent(email)}`
      );

      if (response.ok) {
        const data = await response.json();
        setTrackingOrder(data);
        setIsGuestForm(false);
      } else {
        toast.error("Order not found. Please check your email address.");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      toast.error("Failed to fetch order details");
    } finally {
      setLoading(false);
    }
  };

  const getStepStatus = (step: number) => {
    if (!trackingOrder) return "upcoming";

    const status = trackingOrder.status.toUpperCase();

    if (step === 1) {
      return "completed"; // Order placed is always completed
    } else if (step === 2) {
      return ["PROCESSING", "SHIPPED", "DELIVERED"].includes(status)
        ? "completed"
        : status === "CANCELLED"
        ? "cancelled"
        : "upcoming";
    } else if (step === 3) {
      return ["SHIPPED", "DELIVERED"].includes(status)
        ? "completed"
        : status === "CANCELLED"
        ? "cancelled"
        : "upcoming";
    } else if (step === 4) {
      return status === "DELIVERED"
        ? "completed"
        : status === "CANCELLED"
        ? "cancelled"
        : "upcoming";
    }

    return "upcoming";
  };

  if (isGuestForm) {
    return (
      <PageContainer className="max-w-md mx-auto">
        <Button
          variant="ghost"
          className="mb-6 flex items-center gap-2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="mb-6 text-2xl font-bold text-center">
            Track Your Order
          </h1>
          <p className="mb-4 text-gray-500 text-center">
            Enter the email address used for your order to track its status.
          </p>
          <form onSubmit={handleGuestSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Tracking...
                </>
              ) : (
                "Track Order"
              )}
            </Button>
          </form>
        </div>
      </PageContainer>
    );
  }

  if (!trackingOrder) {
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

        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
          <XCircle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-4 text-xl font-semibold">Order Not Found</h2>
          <p className="mt-2 text-gray-500">
            We couldn't find the order you're looking for. Please check the
            order ID and email address.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" onClick={() => setIsGuestForm(true)}>
              Try Again
            </Button>
            <Button onClick={() => router.push("/")}>Return to Home</Button>
          </div>
        </div>
      </PageContainer>
    );
  }

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

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="max-w-xl">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Order #{trackingOrder.orderNumber}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Placed on {new Date(trackingOrder.createdAt).toLocaleDateString()}
          </p>

          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900">
              Tracking Status
            </h2>

            <div className="mt-4 space-y-6">
              {/* Step 1: Order Placed */}
              <div className="relative flex">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full ${
                    getStepStatus(1) === "completed"
                      ? "bg-green-100"
                      : getStepStatus(1) === "cancelled"
                      ? "bg-red-100"
                      : "bg-gray-100"
                  } ring-8 ring-white`}
                >
                  {getStepStatus(1) === "completed" ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : getStepStatus(1) === "cancelled" ? (
                    <XCircle className="h-5 w-5 text-red-500" />
                  ) : (
                    <Clock className="h-5 w-5 text-gray-500" />
                  )}
                </div>
                <div className="ml-4 min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h3
                      className={`text-sm font-medium ${
                        getStepStatus(1) === "completed"
                          ? "text-green-500"
                          : getStepStatus(1) === "cancelled"
                          ? "text-red-500"
                          : "text-gray-500"
                      }`}
                    >
                      Order Placed
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(trackingOrder.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">
                    Your order has been placed and is being processed.
                  </p>
                </div>
              </div>

              {/* Step 2: Processing */}
              <div className="relative flex">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full ${
                    getStepStatus(2) === "completed"
                      ? "bg-green-100"
                      : getStepStatus(2) === "cancelled"
                      ? "bg-red-100"
                      : getStepStatus(2) === "upcoming"
                      ? "bg-gray-100"
                      : "bg-blue-100"
                  } ring-8 ring-white`}
                >
                  {getStepStatus(2) === "completed" ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : getStepStatus(2) === "cancelled" ? (
                    <XCircle className="h-5 w-5 text-red-500" />
                  ) : getStepStatus(2) === "upcoming" ? (
                    <Package className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Package className="h-5 w-5 text-blue-500" />
                  )}
                </div>
                <div className="ml-4 min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h3
                      className={`text-sm font-medium ${
                        getStepStatus(2) === "completed"
                          ? "text-green-500"
                          : getStepStatus(2) === "cancelled"
                          ? "text-red-500"
                          : getStepStatus(2) === "upcoming"
                          ? "text-gray-500"
                          : "text-blue-500"
                      }`}
                    >
                      Processing
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500">
                    Your order is being prepared for shipping.
                  </p>
                </div>
              </div>

              {/* Step 3: Shipped */}
              <div className="relative flex">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full ${
                    getStepStatus(3) === "completed"
                      ? "bg-green-100"
                      : getStepStatus(3) === "cancelled"
                      ? "bg-red-100"
                      : getStepStatus(3) === "upcoming"
                      ? "bg-gray-100"
                      : "bg-purple-100"
                  } ring-8 ring-white`}
                >
                  {getStepStatus(3) === "completed" ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : getStepStatus(3) === "cancelled" ? (
                    <XCircle className="h-5 w-5 text-red-500" />
                  ) : getStepStatus(3) === "upcoming" ? (
                    <Truck className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Truck className="h-5 w-5 text-purple-500" />
                  )}
                </div>
                <div className="ml-4 min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h3
                      className={`text-sm font-medium ${
                        getStepStatus(3) === "completed"
                          ? "text-green-500"
                          : getStepStatus(3) === "cancelled"
                          ? "text-red-500"
                          : getStepStatus(3) === "upcoming"
                          ? "text-gray-500"
                          : "text-purple-500"
                      }`}
                    >
                      Shipped
                    </h3>
                    {trackingOrder.trackingNumber && (
                      <p className="text-sm text-gray-500">
                        Tracking: {trackingOrder.trackingNumber}
                      </p>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    Your order has been shipped and is on its way to you.
                    {trackingOrder.estimatedDelivery && (
                      <span>
                        {" "}
                        Estimated delivery:{" "}
                        {new Date(
                          trackingOrder.estimatedDelivery
                        ).toLocaleDateString()}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Step 4: Delivered */}
              <div className="relative flex">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full ${
                    getStepStatus(4) === "completed"
                      ? "bg-green-100"
                      : getStepStatus(4) === "cancelled"
                      ? "bg-red-100"
                      : "bg-gray-100"
                  } ring-8 ring-white`}
                >
                  {getStepStatus(4) === "completed" ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : getStepStatus(4) === "cancelled" ? (
                    <XCircle className="h-5 w-5 text-red-500" />
                  ) : (
                    <Package className="h-5 w-5 text-gray-500" />
                  )}
                </div>
                <div className="ml-4 min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h3
                      className={`text-sm font-medium ${
                        getStepStatus(4) === "completed"
                          ? "text-green-500"
                          : getStepStatus(4) === "cancelled"
                          ? "text-red-500"
                          : "text-gray-500"
                      }`}
                    >
                      Delivered
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500">
                    {getStepStatus(4) === "completed"
                      ? "Your order has been delivered. Enjoy!"
                      : getStepStatus(4) === "cancelled"
                      ? "Your order was cancelled and will not be delivered."
                      : "Your order will be delivered soon."}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-2">
              <Button onClick={() => router.push("/account")} variant="outline">
                Back to Orders
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
