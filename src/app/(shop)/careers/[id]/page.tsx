"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

interface JobDetails {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
}

export default function CareerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [isApplying, setIsApplying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    coverLetter: "",
    resume: null as File | null,
  });

  useEffect(() => {
    const fetchCareerDetails = async () => {
      try {
        const response = await fetch(`/api/careers/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch career details");
        }
        const data = await response.json();
        setJobDetails(data);
      } catch (error) {
        console.error("Error fetching career details:", error);
        toast.error("Failed to load career details");
        router.push("/careers");
      }
    };

    fetchCareerDetails();
  }, [params.id, router]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("coverLetter", formData.coverLetter);
      formDataToSend.append("careerId", params.id as string);
      if (formData.resume) {
        formDataToSend.append("resume", formData.resume);
      }

      const response = await fetch("/api/careers/apply", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      toast.success("Application submitted successfully!");
      router.push("/careers/thank-you");
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!jobDetails) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="border-b pb-10">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            {jobDetails.title}
          </h1>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
            <span>{jobDetails.department}</span>
            <span>•</span>
            <span>{jobDetails.location}</span>
            <span>•</span>
            <span>{jobDetails.type}</span>
          </div>
        </div>

        <div className="mt-8 space-y-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Description</h2>
            <p className="mt-4 text-gray-600">{jobDetails.description}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Requirements
            </h2>
            <ul className="mt-4 list-disc pl-5 space-y-2 text-gray-600">
              {jobDetails.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Responsibilities
            </h2>
            <ul className="mt-4 list-disc pl-5 space-y-2 text-gray-600">
              {jobDetails.responsibilities.map((resp, index) => (
                <li key={index}>{resp}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <Button
            size="lg"
            onClick={() => setIsApplying(true)}
            className="w-full sm:w-auto"
          >
            Apply Now
          </Button>
        </div>

        {isApplying && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">
                Apply for {jobDetails.title}
              </h2>
              <form onSubmit={handleApply} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <Input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <Input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <Input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Cover Letter
                  </label>
                  <Textarea
                    required
                    value={formData.coverLetter}
                    onChange={(e) =>
                      setFormData({ ...formData, coverLetter: e.target.value })
                    }
                    rows={4}
                    placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Resume
                  </label>
                  <Input
                    required
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        resume: e.target.files ? e.target.files[0] : null,
                      })
                    }
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Accepted formats: PDF, DOC, DOCX
                  </p>
                </div>

                <div className="flex gap-2 justify-end mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsApplying(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
