"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Career {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
}

export default function CareersPage() {
  const router = useRouter();
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const response = await fetch("/api/careers");
        if (!response.ok) {
          throw new Error("Failed to fetch careers");
        }
        const data = await response.json();
        setCareers(data);
      } catch (error) {
        console.error("Error fetching careers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCareers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Join Our Team
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            We're looking for talented people to help us build the future of
            e-commerce. Check out our open positions below.
          </p>
        </div>

        <div className="mt-12">
          {careers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No open positions at the moment. Please check back later.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {careers.map((career) => (
                <div
                  key={career.id}
                  className="border rounded-lg p-6 hover:border-gray-400 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {career.title}
                      </h2>
                      <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                        <span>{career.department}</span>
                        <span>•</span>
                        <span>{career.location}</span>
                        <span>•</span>
                        <span>{career.type}</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => router.push(`/careers/${career.id}`)}
                      variant="outline"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
