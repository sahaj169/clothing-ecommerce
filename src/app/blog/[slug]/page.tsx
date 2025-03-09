import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { prisma } from "@/lib/db/prisma";
import { formatDate } from "@/lib/utils/format-date";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const blog = await prisma.blog.findUnique({
    where: {
      slug: params.slug,
      published: true,
    },
  });

  if (!blog) {
    return {
      title: "Blog Post Not Found | StyleHub",
      description: "The requested blog post could not be found.",
    };
  }

  return {
    title: `${blog.title} | StyleHub Blog`,
    description: blog.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const blog = await prisma.blog.findUnique({
    where: {
      slug: params.slug,
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
  });

  if (!blog) {
    notFound();
  }

  return (
    <div className="bg-white py-16 sm:py-24">
      <article className="mx-auto max-w-3xl px-6 lg:px-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-4">
            <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-600">
              {blog.category}
            </span>
            <time
              dateTime={blog.createdAt.toISOString()}
              className="text-sm text-gray-500"
            >
              {formatDate(blog.createdAt)}
            </time>
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {blog.title}
            </h1>
          <div className="mt-6 flex items-center justify-center gap-x-3">
            <PlaceholderImage
              src={blog.author.image || "/images/placeholder-avatar.jpg"}
              alt={blog.author.name || ""}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full bg-gray-100"
            />
            <div className="text-sm leading-6">
              <p className="font-semibold text-gray-900">{blog.author.name}</p>
            </div>
            </div>
          </div>

        <div className="mt-16">
          <div className="relative aspect-[16/9] mb-12">
            <PlaceholderImage
              src={blog.image || "/images/blog/placeholder.jpg"}
              alt={blog.title}
              width={1200}
              height={675}
              className="rounded-2xl object-cover"
            />
          </div>

          <div className="prose prose-lg prose-indigo mx-auto mt-8">
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>

          <div className="mt-16 flex items-center gap-x-4">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
