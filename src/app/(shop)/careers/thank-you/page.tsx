"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function ThankYouPage() {
  const router = useRouter();

  return (
    <div className="bg-white min-h-[60vh] flex items-center">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
          Application Submitted!
        </h1>
        <p className="mt-4 text-lg text-gray-500">
          Thank you for your interest in joining our team. We have received your
          application and will review it shortly. We will contact you if your
          qualifications match our requirements.
        </p>
        <div className="mt-10">
          <Button onClick={() => router.push("/careers")}>
            View More Opportunities
          </Button>
        </div>
      </div>
    </div>
  );
}
