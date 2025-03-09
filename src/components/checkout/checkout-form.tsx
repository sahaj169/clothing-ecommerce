"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, CreditCard, Wallet, DollarSign } from "lucide-react";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const addressSchema = z.object({
  name: z.string().min(1, "Name is required"),
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  phone: z.string().min(1, "Phone number is required"),
});

type AddressFormValues = z.infer<typeof addressSchema>;

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

interface CheckoutFormProps {
  addresses: Address[];
  selectedAddressId: string | null;
  setSelectedAddressId: (id: string | null) => void;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
}

export function CheckoutForm({
  addresses,
  selectedAddressId,
  setSelectedAddressId,
  paymentMethod,
  setPaymentMethod,
}: CheckoutFormProps) {
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
  });

  const handleAddNewAddress = async (data: AddressFormValues) => {
    setIsAddingAddress(true);
    try {
      const response = await fetch("/api/addresses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          isDefault: addresses.length === 0,
        }),
      });

      if (response.ok) {
        const newAddress = await response.json();
        setSelectedAddressId(newAddress.id);
        setShowNewAddressForm(false);
        reset(); // Reset form fields
        toast.success("Address added successfully");
      } else {
        toast.error("Failed to add address");
      }
    } catch (error) {
      console.error("Error adding address:", error);
      toast.error("Failed to add address");
    } finally {
      setIsAddingAddress(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-medium text-gray-900">Shipping Address</h2>

        <div className="mt-4 space-y-4">
          {addresses.length > 0 && !showNewAddressForm && (
            <div className="space-y-4">
              <RadioGroup
                value={selectedAddressId || ""}
                onValueChange={setSelectedAddressId}
              >
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className="flex items-start space-x-3 border border-gray-200 rounded-md p-4"
                  >
                    <RadioGroupItem
                      value={address.id}
                      id={`address-${address.id}`}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor={`address-${address.id}`}
                        className="font-medium cursor-pointer"
                      >
                        {address.name}
                      </Label>
                      <p className="text-sm text-gray-500 mt-1">
                        {address.street}
                      </p>
                      <p className="text-sm text-gray-500">
                        {address.city}, {address.state} {address.postalCode}
                      </p>
                      <p className="text-sm text-gray-500">{address.country}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {address.phone}
                      </p>
                    </div>
                  </div>
                ))}
              </RadioGroup>

              <Button
                type="button"
                variant="outline"
                onClick={() => setShowNewAddressForm(true)}
                className="mt-4"
              >
                Add New Address
              </Button>
            </div>
          )}

          {(addresses.length === 0 || showNewAddressForm) && (
            <div className="space-y-4 border border-gray-200 rounded-md p-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" {...register("name")} className="mt-1" />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="street">Street Address</Label>
                <Input id="street" {...register("street")} className="mt-1" />
                {errors.street && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.street.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" {...register("city")} className="mt-1" />
                  {errors.city && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.city.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="state">State / Province</Label>
                  <Input id="state" {...register("state")} className="mt-1" />
                  {errors.state && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.state.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    {...register("postalCode")}
                    className="mt-1"
                  />
                  {errors.postalCode && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.postalCode.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    {...register("country")}
                    className="mt-1"
                  />
                  {errors.country && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.country.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" {...register("phone")} className="mt-1" />
                {errors.phone && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div className="flex justify-between pt-4">
                {addresses.length > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowNewAddressForm(false)}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type="button"
                  onClick={handleSubmit(handleAddNewAddress)}
                  disabled={isAddingAddress}
                >
                  {isAddingAddress ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Address"
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium text-gray-900">Payment Method</h2>
        <div className="mt-4">
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="flex items-start space-x-3 border border-gray-200 rounded-md p-4">
              <RadioGroupItem value="CREDIT_CARD" id="payment-credit-card" />
              <div className="flex-1">
                <Label
                  htmlFor="payment-credit-card"
                  className="font-medium cursor-pointer"
                >
                  Credit/Debit Card
                </Label>
                <p className="text-sm text-gray-500 mt-1">
                  Pay securely with your credit or debit card
                </p>
              </div>
              <CreditCard className="h-5 w-5 text-gray-400" />
            </div>

            <div className="flex items-start space-x-3 border border-gray-200 rounded-md p-4 mt-2">
              <RadioGroupItem value="UPI" id="payment-upi" />
              <div className="flex-1">
                <Label
                  htmlFor="payment-upi"
                  className="font-medium cursor-pointer"
                >
                  UPI
                </Label>
                <p className="text-sm text-gray-500 mt-1">
                  Pay using UPI apps like Google Pay, PhonePe, etc.
                </p>
              </div>
              <Wallet className="h-5 w-5 text-gray-400" />
            </div>

            <div className="flex items-start space-x-3 border border-gray-200 rounded-md p-4 mt-2">
              <RadioGroupItem value="BANK_TRANSFER" id="payment-bank" />
              <div className="flex-1">
                <Label
                  htmlFor="payment-bank"
                  className="font-medium cursor-pointer"
                >
                  Bank Transfer
                </Label>
                <p className="text-sm text-gray-500 mt-1">
                  Pay directly from your bank account
                </p>
              </div>
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}
