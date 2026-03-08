const Shimmer = ({ className }: { className?: string }) => (
  <div
    className={`relative overflow-hidden rounded-xl bg-muted ${className || ""}`}
  >
    <div
      className="absolute inset-0"
      style={{
        background:
          "linear-gradient(90deg, transparent 0%, hsl(var(--primary) / 0.06) 50%, transparent 100%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.8s ease-in-out infinite",
      }}
    />
  </div>
);

export const HeroSkeleton = () => (
  <div className="min-h-screen flex items-center justify-center bg-background p-4">
    <div className="max-w-2xl mx-auto text-center space-y-6 w-full">
      <Shimmer className="h-44 w-44 mx-auto rounded-full" />
      <Shimmer className="h-10 w-3/4 mx-auto" />
      <Shimmer className="h-6 w-1/2 mx-auto" />
      <div className="flex justify-center gap-4 pt-4">
        {[1, 2, 3, 4].map((i) => (
          <Shimmer key={i} className="h-11 w-11 rounded-full" />
        ))}
      </div>
    </div>
  </div>
);

export const CardSkeleton = () => (
  <div className="rounded-2xl border border-border overflow-hidden">
    <Shimmer className="h-48 w-full rounded-none" />
    <div className="p-4 space-y-3">
      <Shimmer className="h-5 w-2/3" />
      <Shimmer className="h-4 w-full" />
      <Shimmer className="h-10 w-full rounded-xl" />
    </div>
  </div>
);

export const GridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
    {Array.from({ length: count }, (_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

export default Shimmer;
