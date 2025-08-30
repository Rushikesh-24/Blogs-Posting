export function CardSkeleton() {
  return (
    <div className="rounded-lg border p-4">
      <div className="mb-3 h-5 w-3/5 animate-pulse rounded bg-muted" />
      <div className="mb-2 h-4 w-4/5 animate-pulse rounded bg-muted" />
      <div className="h-4 w-2/5 animate-pulse rounded bg-muted" />
    </div>
  )
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <li key={i}>
          <CardSkeleton />
        </li>
      ))}
    </ul>
  )
}
