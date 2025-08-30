"use client"

import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import type { Post } from "@/lib/types"
import BlogCard from "./blog-card"

type Props = {
  variant: "trending" | "latest" | "all"
  limit?: number
  query?: string
}

type ApiResponse = { posts: Post[] }

export default function PostList({ variant, limit = 6, query = "" }: Props) {
  const params = new URLSearchParams()
  params.set("variant", variant)
  params.set("limit", String(limit))
  if (query) params.set("q", query)

  const { data, error, isLoading } = useSWR<ApiResponse>(`/api/posts?${params.toString()}`, fetcher, {
    revalidateOnFocus: false,
  })

  if (isLoading) {
    return (
      <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: Math.min(limit, 6) }).map((_, i) => (
          <li key={i} className="rounded-lg border p-4">
            <div className="mb-3 h-5 w-3/5 animate-pulse rounded bg-muted" />
            <div className="mb-2 h-4 w-4/5 animate-pulse rounded bg-muted" />
            <div className="h-4 w-2/5 animate-pulse rounded bg-muted" />
          </li>
        ))}
      </ul>
    )
  }

  if (error) {
    return (
      <div role="status" aria-live="polite" className="mt-4 text-sm text-destructive">
        {/* error handling for data load */}Failed to load posts. Please try again.
      </div>
    )
  }

  const posts = data?.posts ?? []

  return (
    <div className="mt-4">
      <p className="text-muted-foreground mb-2 text-sm" aria-live="polite">
        {posts.length} result{posts.length === 1 ? "" : "s"}
      </p>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <li key={p.id}>
            <BlogCard post={p} />
          </li>
        ))}
      </ul>
    </div>
  )
}
