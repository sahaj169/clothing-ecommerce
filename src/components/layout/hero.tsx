"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { PlaceholderImage } from "@/components/ui/placeholder-image";

const heroImages = [
  "https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg", // Traditional fashion
  "https://images.pexels.com/photos/949670/pexels-photo-949670.jpeg", // Fashion store
  "https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg", // Shopping bags
  "https://images.pexels.com/photos/6626903/pexels-photo-6626903.jpeg", // Fashion display
  "https://images.pexels.com/photos/5868722/pexels-photo-5868722.jpeg", // Modern fashion
];

export function Hero() {
  const [mounted, setMounted] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleImageError = () => {
    if (currentImageIndex < heroImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else {
      setImageError(true);
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative min-h-[90vh] bg-gradient-to-r from-gray-900 via-gray-800 to-black overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <svg
          className="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          fill="none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <pattern
            id="grid"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-32 sm:pt-24 sm:pb-40">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Text Content */}
          <motion.div
            className="lg:col-span-6 xl:col-span-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:mt-5 sm:text-6xl lg:mt-6">
              <span className="block">Discover Your</span>
              <span className="block text-indigo-400">Signature Style</span>
            </h1>
            <p className="mt-6 text-xl text-gray-300">
              Explore our curated collection of premium fashion. From timeless
              classics to trending styles, find pieces that express your unique
              personality.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:gap-6">
              <Link href="/men" className="flex-1 sm:flex-none">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-lg"
                >
                  Shop Men
                </Button>
              </Link>
              <Link href="/women" className="flex-1 sm:flex-none">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-gray-900 text-lg"
                >
                  Shop Women
                </Button>
              </Link>
            </div>

            {/* Featured Benefits */}
            <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-6">
              {[
                { title: "Free Shipping", desc: "On orders over $100" },
                { title: "Easy Returns", desc: "Within 30 days" },
                { title: "Secure Payment", desc: "100% protected" },
                { title: "24/7 Support", desc: "Here to help" },
              ].map((benefit) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-center sm:text-left"
                >
                  <h3 className="text-white font-semibold">{benefit.title}</h3>
                  <p className="text-gray-400 text-sm mt-1">{benefit.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Image Section */}
          <motion.div
            className="hidden lg:block lg:col-span-6 xl:col-span-7 mt-16 lg:mt-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative h-full">
              {/* Main Image */}
              <div className="relative h-[600px] w-full overflow-hidden rounded-2xl bg-gray-800">
                {!imageError ? (
                  <>
                    <PlaceholderImage
                      src={heroImages[currentImageIndex]}
                      alt="Fashion Collection"
                      fill
                      className={`object-cover object-center transition-opacity duration-300 ${
                        isLoading ? "opacity-0" : "opacity-100"
                      }`}
                      priority
                      onError={handleImageError}
                      onLoad={handleImageLoad}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {isLoading && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
                          <p className="mt-2 text-sm text-gray-300">
                            Loading your style...
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <div className="text-center space-y-3">
                      <p className="text-lg font-medium">
                        Unable to load image
                      </p>
                      <p className="text-sm text-gray-500">
                        We're working on bringing back the latest styles
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 text-white border-white hover:bg-white hover:text-gray-900"
                        onClick={() => {
                          setImageError(false);
                          setCurrentImageIndex(0);
                          setIsLoading(true);
                        }}
                      >
                        Try Again
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Floating Elements */}
              <motion.div
                className="absolute -top-4 -right-4 bg-white/10 backdrop-blur-lg rounded-2xl p-4 shadow-xl"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
                    <span className="text-white font-bold">30%</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Summer Sale</p>
                    <p className="text-gray-300 text-sm">Limited time offer</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-4 bg-white/10 backdrop-blur-lg rounded-2xl p-4 shadow-xl max-w-xs"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      Sustainable Fashion
                    </p>
                    <p className="text-gray-300 text-sm">
                      Eco-friendly materials
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
