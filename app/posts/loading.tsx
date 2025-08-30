import { GridSkeleton } from "@/components/skeletons"

export default function LoadingPosts() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 space-y-2">
        <div className="h-7 w-44 animate-pulse rounded bg-muted" />
        <div className="h-4 w-80 animate-pulse rounded bg-muted" />
      </div>
      <GridSkeleton count={12} />
    </main>
  )
}
