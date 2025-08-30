export default function LoadingPostDetail() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-4 h-8 w-3/4 animate-pulse rounded bg-muted" />
      <div className="mb-2 h-4 w-48 animate-pulse rounded bg-muted" />
      <div className="mb-6 flex gap-2">
        <div className="h-5 w-16 animate-pulse rounded bg-muted" />
        <div className="h-5 w-20 animate-pulse rounded bg-muted" />
      </div>
      <div className="space-y-3">
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-11/12 animate-pulse rounded bg-muted" />
        <div className="h-4 w-10/12 animate-pulse rounded bg-muted" />
        <div className="h-4 w-9/12 animate-pulse rounded bg-muted" />
      </div>
    </main>
  )
}
