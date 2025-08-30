export type MockPost = {
  id: string
  title: string
  excerpt: string
  content: string
  authorId: string
  authorName: string
  createdAt: string
  views: number
  tags?: string[]
}

// Using a function so timestamps are reasonably fresh when invoked.
export function getMockPosts(): MockPost[] {
  const now = Date.now()
  const base = [
    {
      id: "1",
      title: "Designing for Clarity: The Power of Black & White UI",
      excerpt: "Explore how a minimalist palette improves readability, focus, and accessibility across devices.",
      content:
        "Black and white UI emphasizes content and hierarchy. In this article, we explore type, spacing, and contrast ratios to keep interfaces crisp without sacrificing emotion.",
      authorId: "a1",
      authorName: "Alex Chen",
      createdAt: new Date(now - 1000 * 60 * 60 * 12).toISOString(),
      views: 1240,
      tags: ["design", "accessibility"],
    },
    {
      id: "2",
      title: "Server Components: Practical Patterns for Real Apps",
      excerpt: "A pragmatic guide to composing Server and Client Components with data fetching best practices.",
      content:
        "Server Components allow you to fetch data on the server and stream UI. We’ll discuss boundaries, caching, and when to opt into client interactivity.",
      authorId: "a2",
      authorName: "Riley Patel",
      createdAt: new Date(now - 1000 * 60 * 60 * 36).toISOString(),
      views: 980,
      tags: ["react", "nextjs"],
    },
    {
      id: "3",
      title: "SWR Essentials: Smooth Loading and Caching",
      excerpt: "From skeletons to revalidation strategies: build snappy UIs without over-fetching.",
      content:
        "SWR provides a powerful cache layer for React apps. Learn patterns for mutation, optimistic updates, and suspense integration.",
      authorId: "a3",
      authorName: "Samira Khan",
      createdAt: new Date(now - 1000 * 60 * 60 * 2).toISOString(),
      views: 620,
      tags: ["react", "swr"],
    },
    {
      id: "4",
      title: "Content Architecture for Scalable Blogs",
      excerpt: "Model posts, authors, and metrics to support trending, search, and recommendations.",
      content:
        "A solid content model helps teams move faster. We cover post metadata, authorship, metrics tables, and indexing strategy.",
      authorId: "a4",
      authorName: "Jordan Lee",
      createdAt: new Date(now - 1000 * 60 * 60 * 50).toISOString(),
      views: 310,
      tags: ["content", "architecture"],
    },
    {
      id: "5",
      title: "From Draft to Publish: Editorial Workflows",
      excerpt: "Set up roles, review states, and guardrails so teams ship consistently high-quality posts.",
      content:
        "Workflows align creators and editors. Explore statuses, roles, and guardrails that scale quality without friction.",
      authorId: "a5",
      authorName: "Taylor Morgan",
      createdAt: new Date(now - 1000 * 60 * 60 * 6).toISOString(),
      views: 860,
      tags: ["workflow", "teams"],
    },
    {
      id: "6",
      title: "Search That Matters: Ranking and Relevance",
      excerpt: "Design a search pipeline that combines keyword matching with behavioral signals.",
      content:
        "Keyword matching is a start; clicks and dwell time improve relevance. We outline a path from simple filters to learned ranking.",
      authorId: "a6",
      authorName: "Casey Nguyen",
      createdAt: new Date(now - 1000 * 60 * 60 * 72).toISOString(),
      views: 1420,
      tags: ["search", "ranking"],
    },
  ] as const

  return base.map((p) => ({ ...p }))
}
