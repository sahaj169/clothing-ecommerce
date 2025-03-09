"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  Package,
  User as UserIcon,
  Search,
  Filter,
  X,
  ChevronDown,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { toast } from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageContainer } from "@/components/layout/page-container";

interface Order {
  id: string;
  createdAt: string;
  status: string;
  total: number;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    size: string;
    image: string;
  }[];
}

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

interface AccountPageProps {
  initialOrders?: Order[];
  initialAddresses?: Address[];
}

export default function AccountPageClient({
  initialOrders = [],
  initialAddresses = [],
}: AccountPageProps) {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState(initialOrders);
  const [addresses, setAddresses] = useState(initialAddresses);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    // If auth is still loading, wait
    if (authLoading) return;

    // If not authenticated after auth is loaded, redirect to login
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // If we don't have initial data, fetch it
    if (initialOrders.length === 0 && initialAddresses.length === 0) {
      fetchData();
    }
  }, [
    isAuthenticated,
    authLoading,
    initialOrders.length,
    initialAddresses.length,
  ]);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      // Fetch orders
      const ordersResponse = await fetch("/api/orders");
      const ordersData = await ordersResponse.json();
      setOrders(ordersData);

      // Fetch addresses
      const addressesResponse = await fetch("/api/addresses");
      const addressesData = await addressesResponse.json();
      setAddresses(addressesData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load your account data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelOrderId) return;

    setIsCancelling(true);
    try {
      const response = await fetch(`/api/orders/${cancelOrderId}/cancel`, {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        // Update the order status in the UI
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === cancelOrderId
              ? { ...order, status: "cancelled" }
              : order
          )
        );
        setCancelOrderId(null);
        toast.success("Order cancelled successfully");
      } else {
        toast.error(data.message || "Failed to cancel order");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel order");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleResetPassword = async () => {
    if (!user?.email) return;

    setIsResetting(true);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(
          "Password reset link sent to your email. Please check your inbox."
        );
      } else {
        toast.error(data.message || "Failed to send reset link");
      }
    } catch (error) {
      console.error("Error sending reset link:", error);
      toast.error("Failed to send reset link");
    } finally {
      setIsResetting(false);
    }
  };

  // Filter orders based on search query and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.id
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      !statusFilter ||
      order.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Get displayed orders based on showAllOrders state
  const displayedOrders = showAllOrders
    ? filteredOrders
    : filteredOrders.slice(0, 2);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "processing":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "shipped":
        return <Package className="h-5 w-5 text-purple-500" />;
      case "delivered":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <PageContainer>
      <h1 className="mb-8 text-3xl font-bold">My Account</h1>

      <Tabs defaultValue="orders">
        <TabsList>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="addresses">Addresses</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="mt-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter by Status
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                  All Orders
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("processing")}>
                  Processing
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("shipped")}>
                  Shipped
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("delivered")}>
                  Delivered
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("cancelled")}>
                  Cancelled
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">No orders found</h3>
              <p className="mt-2 text-gray-500">
                {orders.length === 0
                  ? "You haven't placed any orders yet."
                  : "No orders match your search criteria."}
              </p>
              {orders.length === 0 && (
                <Button
                  className="mt-4"
                  onClick={() => router.push("/products")}
                >
                  Start Shopping
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {displayedOrders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="mb-4 flex flex-col justify-between space-y-2 border-b border-gray-100 pb-4 md:flex-row md:items-center md:space-y-0">
                    <div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-500">
                          Order ID:
                        </span>
                        <span className="ml-2 text-sm">{order.id}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-500">
                          Date:
                        </span>
                        <span className="ml-2 text-sm">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(order.status)}
                        <span
                          className={`text-sm font-medium ${
                            order.status.toLowerCase() === "processing"
                              ? "text-blue-500"
                              : order.status.toLowerCase() === "shipped"
                              ? "text-purple-500"
                              : order.status.toLowerCase() === "delivered"
                              ? "text-green-500"
                              : order.status.toLowerCase() === "cancelled"
                              ? "text-red-500"
                              : "text-yellow-500"
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </div>
                      {order.status.toLowerCase() === "processing" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCancelOrderId(order.id)}
                        >
                          Cancel
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/order/${order.id}`)}
                      >
                        Details
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-4"
                      >
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
                        <div className="flex-1">
                          <h4 className="text-sm font-medium">{item.name}</h4>
                          <p className="mt-1 text-xs text-gray-500">
                            Size: {item.size} | Qty: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 border-t border-gray-100 pt-4 text-right">
                    <p className="text-sm font-medium">
                      Total: {formatPrice(order.total)}
                    </p>
                  </div>
                </div>
              ))}

              {filteredOrders.length > 2 && !showAllOrders && (
                <div className="mt-6 text-center">
                  <Button
                    variant="outline"
                    onClick={() => setShowAllOrders(true)}
                  >
                    View More Orders
                  </Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="addresses" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">My Addresses</h2>
            <Button onClick={() => router.push("/account/addresses/new")}>
              Add New Address
            </Button>
          </div>

          {addresses.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
              <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">No addresses found</h3>
              <p className="mt-2 text-gray-500">
                You haven't added any addresses yet.
              </p>
              <Button
                className="mt-4"
                onClick={() => router.push("/account/addresses/new")}
              >
                Add Address
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
                >
                  {address.isDefault && (
                    <div className="mb-2 inline-block rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                      Default Address
                    </div>
                  )}
                  <h3 className="text-lg font-medium">{address.name}</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    {address.street}
                    <br />
                    {address.city}, {address.state} {address.postalCode}
                    <br />
                    {address.country}
                    <br />
                    {address.phone}
                  </p>
                  <div className="mt-4 flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        router.push(`/account/addresses/${address.id}`)
                      }
                    >
                      Edit
                    </Button>
                    {!address.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          try {
                            const response = await fetch(
                              `/api/addresses/${address.id}/default`,
                              {
                                method: "POST",
                              }
                            );

                            if (response.ok) {
                              // Update addresses in the UI
                              setAddresses((prevAddresses) =>
                                prevAddresses.map((addr) => ({
                                  ...addr,
                                  isDefault: addr.id === address.id,
                                }))
                              );
                              toast.success("Default address updated");
                            } else {
                              toast.error("Failed to update default address");
                            }
                          } catch (error) {
                            console.error(
                              "Error updating default address:",
                              error
                            );
                            toast.error("Failed to update default address");
                          }
                        }}
                      >
                        Set as Default
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Account Settings</h2>
        <div className="mt-4 space-y-4">
          <div>
            <Button variant="outline" onClick={handleResetPassword}>
              {isResetting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Reset Link...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </div>
        </div>
      </div>

      <Dialog
        open={!!cancelOrderId}
        onOpenChange={(open) => {
          if (!open) setCancelOrderId(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this order? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCancelOrderId(null)}
              disabled={isCancelling}
            >
              No, Keep Order
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelOrder}
              disabled={isCancelling}
            >
              {isCancelling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Yes, Cancel Order"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
