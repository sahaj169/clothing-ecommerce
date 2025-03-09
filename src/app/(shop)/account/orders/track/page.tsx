"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Package, Search, Truck, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";

interface TrackingResult {
  id: string;
  status: string;
  createdAt: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    size: string;
    image: string;
  }[];
}

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [trackingResult, setTrackingResult] = useState<TrackingResult | null>(
    null
  );
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!orderId.trim() || !email.trim()) {
      toast.error("Please enter both order ID and email");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/orders/${orderId}?email=${encodeURIComponent(email)}`
      );
      if (!response.ok) {
        throw new Error((await response.text()) || "Failed to track order");
      }
      const data = await response.json();
      setTrackingResult(data);
    } catch (error) {
      console.error("Error tracking order:", error);
      toast.error(
        "Failed to track order. Please check your order ID and email."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case "shipped":
        return <Truck className="h-6 w-6 text-blue-500" />;
      case "processing":
        return <Package className="h-6 w-6 text-yellow-500" />;
      default:
        return <Clock className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Track Your Order
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            Enter your order ID and email address to track your order status.
          </p>
        </div>

        <div className="mt-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="orderId"
                className="block text-sm font-medium text-gray-700"
              >
                Order ID
              </label>
              <Input
                id="orderId"
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter your order ID"
                className="mt-1"
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="mt-1"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                "Tracking..."
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Track Order
                </>
              )}
            </Button>
          </form>

          {trackingResult && (
            <div className="mt-12 border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">
                    Order #{trackingResult.id}
                  </h2>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(trackingResult.status)}
                    <span className="text-sm font-medium capitalize">
                      {trackingResult.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Order Date</p>
                    <p className="text-sm font-medium">
                      {new Date(trackingResult.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Items</p>
                    <div className="mt-2 space-y-2">
                      {trackingResult.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-gray-500">
                              Size: {item.size} • Quantity: {item.quantity}
                            </p>
                          </div>
                          <p className="text-sm font-medium">
                            $
                            {typeof item.price === "number"
                              ? item.price.toFixed(2)
                              : "0.00"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t">
                <h3 className="text-base font-medium text-gray-900 mb-4">
                  Order Status
                </h3>
                <div className="relative pl-8">
                  <div className="absolute left-0 top-1">
                    <div className="h-4 w-4 rounded-full bg-indigo-600"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {trackingResult.status.charAt(0).toUpperCase() +
                        trackingResult.status.slice(1).replace("_", " ")}
                    </p>
                    <p className="text-xs text-gray-500">
                      Last updated:{" "}
                      {new Date(trackingResult.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Need help with your order?{" "}
              <Button
                variant="link"
                className="p-0 h-auto text-indigo-600 hover:text-indigo-500"
                onClick={() => router.push("/contact")}
              >
                Contact Support
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
