interface SkeletonProps {
  className?: string;
  rows?: number;
}

export default function Skeleton({
  className = "",
  rows = 1,
}: SkeletonProps) {
  return (
    <div
      aria-busy="true"
      aria-label="Loading"
      className="space-y-3"
    >
      {Array.from({
        length: rows,
      }).map((_, index) => (
        <div
          key={index}
          className={`animate-pulse rounded-lg bg-slate-800 ${className}`}
        />
      ))}
    </div>
  );
}