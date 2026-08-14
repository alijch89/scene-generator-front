import { Skeleton } from '@/components/app/ui';

/** The design's shimmer state, shown while the library query is in flight. */
export default function LibraryLoading() {
  return (
    <section aria-busy="true" aria-label="در حال بارگذاری کتابخانه">
      <Skeleton className="mb-5 h-9 w-56" />
      <div className="mb-5 flex gap-2">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-9.5 w-24 rounded-full" />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-[repeat(auto-fill,minmax(210px,1fr))]">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton
            key={i}
            className="h-57.5"
            // staggered, as in the design
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </section>
  );
}
/**
 * @file loading.tsx
 * @description Renders the route-level shimmer fallback while the story library loads.
 */
