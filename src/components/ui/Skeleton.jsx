export function SkeletonBlock({ className = "" }) {
  return <div className={`skeleton ${className}`} aria-hidden="true" />;
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white dark:bg-luxury-charcoal/40 rounded-xl sm:rounded-2xl overflow-hidden border border-gray-100 dark:border-luxury-charcoal">
      <SkeletonBlock className="aspect-[3/4] w-full" />
      <div className="p-2 sm:p-4 lg:p-5 space-y-1.5 sm:space-y-2.5">
        <SkeletonBlock className="h-2.5 w-1/2 rounded-full" />
        <SkeletonBlock className="h-3 sm:h-4 w-4/5 rounded-full" />
        <SkeletonBlock className="h-3 sm:h-4 w-1/3 rounded-full" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-2 sm:gap-6 lg:gap-8 grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
