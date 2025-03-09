import { Metadata } from "next";
import Link from "next/link";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { prisma } from "@/lib/db/prisma";
import { formatDate } from "@/lib/utils/format-date";

export const metadata: Metadata = {
  title: "Blog | StyleHub",
  description: "Read the latest fashion trends and style tips on our blog.",
};

export default async function BlogPage() {
  const blogs = await prisma.blog.findMany({
    where: {
      published: true,
    },
    include: {
      author: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Fashion Blog
          </h1>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Stay up to date with the latest fashion trends and style tips.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {blogs.map((post) => (
            <article
              key={post.id}
              className="flex flex-col items-start justify-between"
            >
              <div className="relative w-full">
                <Link href={`/blog/${post.slug}`}>
                  <PlaceholderImage
                    src={post.image || "/images/blog/placeholder.jpg"}
                    alt={post.title}
                    width={800}
                    height={400}
                    className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                  />
                </Link>
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
              </div>
              <div className="max-w-xl">
                <div className="mt-8 flex items-center gap-x-4 text-xs">
                  <time
                    dateTime={post.createdAt.toISOString()}
                    className="text-gray-500"
                  >
                    {formatDate(post.createdAt)}
                  </time>
                  <span className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">
                    {post.category}
                  </span>
                </div>
                <div className="group relative">
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                    <Link href={`/blog/${post.slug}`}>
                      <span className="absolute inset-0" />
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                    {post.excerpt}
                  </p>
                </div>
                <div className="relative mt-8 flex items-center gap-x-4">
                  <PlaceholderImage
                    src={post.author.image || "/images/placeholder-avatar.jpg"}
                    alt={post.author.name || ""}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full bg-gray-100"
                  />
                  <div className="text-sm leading-6">
                    <p className="font-semibold text-gray-900">
                      <span className="absolute inset-0" />
                      {post.author.name}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
