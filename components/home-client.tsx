"use client"

import { useState } from "react"
import SearchInput from "./search-input"
import PostList from "./post-list"
import Link from "next/link"

export default function HomeClient() {
  const [query, setQuery] = useState("")

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-pretty text-3xl font-semibold tracking-tight">Blog</h1>
        <p className="text-muted-foreground mt-2 max-w-prose leading-relaxed">
          Read, search, and explore articles. Clean black-and-white theme focused on readability.
        </p>
      </header>

      <section className="mb-8">
        <SearchInput value={query} onChange={setQuery} />
      </section>

      <section aria-labelledby="trending" className="mb-10">
        <h2 id="trending" className="text-balance text-xl font-semibold">
          Trending
        </h2>
        <PostList variant="trending" limit={6} query={query} />
      </section>

      <section aria-labelledby="latest" className="mb-10">
        <h2 id="latest" className="text-balance text-xl font-semibold">
          Latest
        </h2>
        <PostList variant="latest" limit={6} query={query} />
      </section>

      <section aria-labelledby="all" className="mb-4">
        <div className="flex items-center justify-between">
          <h2 id="all" className="text-balance text-xl font-semibold">
            All Blogs
          </h2>
          <Link href="/posts" className="text-sm underline underline-offset-4">
            Browse all
          </Link>
        </div>
        <PostList variant="all" limit={24} query={query} />
      </section>
    </div>
  )
}
