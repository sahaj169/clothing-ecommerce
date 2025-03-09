import { Skeleton } from "@/components/ui/skeleton";

export function ProductsPageSkeleton() {
  return (
    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="group relative">
          <Skeleton className="aspect-square w-full overflow-hidden rounded-md bg-gray-200" />
          <div className="mt-4 flex justify-between">
            <div>
              <Skeleton className="h-4 w-40 bg-gray-200" />
              <Skeleton className="mt-1 h-4 w-20 bg-gray-200" />
            </div>
            <Skeleton className="h-4 w-16 bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
