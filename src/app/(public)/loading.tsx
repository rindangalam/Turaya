import { Skeleton } from "@/components/ui/skeleton";

export default function PublicLoading() {
  return (
    <div className="container-turaya py-16 md:py-24">
      <div className="max-w-2xl">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-4 h-12 w-3/4" />
        <Skeleton className="mt-5 h-5 w-2/3" />
      </div>
      <div className="mt-16 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index}>
            <Skeleton className="aspect-[3/4] w-full" />
            <Skeleton className="mt-4 h-5 w-2/3" />
            <Skeleton className="mt-2 h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
