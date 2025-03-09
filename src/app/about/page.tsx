import { Building, Users, Heart, Globe } from "lucide-react";
import { PlaceholderImage } from "@/components/ui/placeholder-image";

export const metadata = {
  title: "About Us | StyleHub",
  description:
    "Learn about StyleHub's mission, values, and the team behind your favorite fashion destination.",
};

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative bg-gray-900 py-32 px-6 sm:px-12 lg:px-16">
        <div className="absolute inset-0 overflow-hidden">
          <PlaceholderImage
            src="/images/about-hero.jpg"
            alt="StyleHub team"
            fill
            className="h-full w-full object-cover object-center opacity-20"
            priority
          />
        </div>
        <div className="relative mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            About StyleHub
          </h1>
          <p className="mt-6 text-xl text-gray-300">
            Your one-stop destination for trendy fashion across all ages and
            styles.
          </p>
        </div>
      </div>

      {/* Our story section */}
      <div className="mx-auto max-w-7xl px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Our Story
          </h2>
          <div className="mt-6 text-lg leading-8 text-gray-600">
            <p className="mb-4">
              Founded in 2020, StyleHub began with a simple mission: to make
              fashion accessible to everyone. What started as a small online
              store has grown into a global fashion destination that serves
              customers in over 30 countries.
            </p>
            <p className="mb-4">
              Our founders, fashion enthusiasts with backgrounds in retail and
              technology, recognized a gap in the market for a platform that
              could offer high-quality, trendy clothing at reasonable prices
              while providing an exceptional shopping experience.
            </p>
            <p>
              Today, StyleHub continues to innovate and expand, staying true to
              our core values while adapting to the ever-changing fashion
              landscape. We're proud to dress people of all ages, sizes, and
              styles, helping them express themselves through fashion.
            </p>
          </div>
        </div>
      </div>

      {/* Values section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">
              Our Foundation
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Values That Drive Us
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              At StyleHub, our values guide everything we do, from product
              selection to customer service.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <Users className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Customer First
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  We prioritize our customers' needs and feedback, constantly
                  improving our products and services to exceed expectations.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <Heart className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Sustainability
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  We're committed to reducing our environmental impact through
                  responsible sourcing, eco-friendly packaging, and sustainable
                  practices.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <Globe className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Inclusivity
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  We celebrate diversity and create products for people of all
                  backgrounds, sizes, and styles, ensuring everyone feels
                  represented.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <Building
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </div>
                  Quality
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  We never compromise on quality, carefully selecting materials
                  and partners to ensure our products meet the highest
                  standards.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Team section */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Our Leadership Team
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Meet the passionate individuals driving StyleHub's mission
              forward.
            </p>
          </div>
          <ul
            role="list"
            className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3"
          >
            {[
              {
                name: "Emma Johnson",
                role: "Co-Founder / CEO",
                imageUrl: "/images/team-1.jpg",
              },
              {
                name: "Michael Chen",
                role: "Co-Founder / CTO",
                imageUrl: "/images/team-2.jpg",
              },
              {
                name: "Sarah Williams",
                role: "Chief Design Officer",
                imageUrl: "/images/team-3.jpg",
              },
            ].map((person) => (
              <li key={person.name} className="flex flex-col items-center">
                <div className="relative h-56 w-56 rounded-full overflow-hidden">
                  <PlaceholderImage
                    className="object-cover"
                    src={person.imageUrl}
                    alt={person.name}
                    fill
                  />
                </div>
                <h3 className="mt-6 text-lg font-semibold leading-8 tracking-tight text-gray-900">
                  {person.name}
                </h3>
                <p className="text-base leading-7 text-gray-600">
                  {person.role}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
