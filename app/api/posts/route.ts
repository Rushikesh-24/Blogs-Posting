import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getMockPosts } from "@/lib/mock-posts"

type DbPost = {
  id: string
  author_id: string
  title: string
  excerpt: string | null
  content: string | null
  tags: string[] | null
  status: "draft" | "published"
  published_at: string | null
  created_at: string
}

type Metric = { post_id: string; views: number }
type Profile = { user_id: string; display_name: string | null }

async function fetchLatest(supabase: Awaited<ReturnType<typeof createClient>>, q: string | null, limit: number) {
  let query = supabase
    .from("posts")
    .select("id, author_id, title, excerpt, content, tags, status, published_at, created_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit)

  if (q) {
    // search title OR excerpt
    query = query.or(`title.ilike.%${q}%,excerpt.ilike.%${q}%`)
  }

  const { data: posts, error } = await query
  if (error || !posts) throw error || new Error("Failed latest")

  // fetch metrics for these posts
  const ids = posts.map((p) => p.id)
  const { data: metrics } = await supabase.from("post_metrics").select("post_id, views").in("post_id", ids)
  const metricsMap = new Map((metrics || []).map((m: Metric) => [m.post_id, m.views]))

  // fetch author display names
  const authorIds = Array.from(new Set(posts.map((p) => p.author_id)))
  const { data: profiles } = await supabase.from("profiles").select("user_id, display_name").in("user_id", authorIds)
  const profileMap = new Map((profiles || []).map((p: Profile) => [p.user_id, p.display_name || "Author"]))

  return posts.map((p: DbPost) => ({
    id: p.id,
    title: p.title,
    excerpt: p.excerpt ?? "",
    content: undefined,
    authorId: p.author_id,
    authorName: profileMap.get(p.author_id) || "Author",
    createdAt: p.published_at || p.created_at,
    views: metricsMap.get(p.id) ?? 0,
    tags: p.tags ?? [],
  }))
}

async function fetchTrending(supabase: Awaited<ReturnType<typeof createClient>>, q: string | null, limit: number) {
  // get top by views first
  const { data: top, error } = await supabase
    .from("post_metrics")
    .select("post_id, views")
    .order("views", { ascending: false })
    .limit(limit * 2)
  if (error || !top) throw error || new Error("Failed metrics")

  const ids = (top as Metric[]).map((m) => m.post_id)
  if (ids.length === 0) return []

  let postsQ = supabase
    .from("posts")
    .select("id, author_id, title, excerpt, content, tags, status, published_at, created_at")
    .in("id", ids)
    .eq("status", "published")

  if (q) {
    postsQ = postsQ.or(`title.ilike.%${q}%,excerpt.ilike.%${q}%`)
  }

  const { data: posts, error: pErr } = await postsQ
  if (pErr || !posts) throw pErr || new Error("Failed trending posts")

  // author names
  const authorIds = Array.from(new Set(posts.map((p) => p.author_id)))
  const { data: profiles } = await supabase.from("profiles").select("user_id, display_name").in("user_id", authorIds)
  const profileMap = new Map((profiles || []).map((p: Profile) => [p.user_id, p.display_name || "Author"]))

  const metricsMap = new Map((top as Metric[]).map((m) => [m.post_id, m.views]))

  // sort by metric views according to top order
  const postsMap = new Map(posts.map((p) => [p.id, p]))
  const sorted = ids
    .map((id) => postsMap.get(id))
    .filter(Boolean)
    .slice(0, limit) as DbPost[]

  return sorted.map((p: DbPost) => ({
    id: p.id,
    title: p.title,
    excerpt: p.excerpt ?? "",
    content: undefined,
    authorId: p.author_id,
    authorName: profileMap.get(p.author_id) || "Author",
    createdAt: p.published_at || p.created_at,
    views: metricsMap.get(p.id) ?? 0,
    tags: p.tags ?? [],
  }))
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const variant = (url.searchParams.get("variant") || "all") as "trending" | "latest" | "all"
  const q = (url.searchParams.get("q") || "").trim()
  const limit = Number(url.searchParams.get("limit") || 6)

  try {
    const supabase = await createClient()

    if (variant === "trending") {
      const posts = await fetchTrending(supabase, q || null, limit)
      return NextResponse.json({ posts })
    }

    // latest and all share same base query (all is just more items)
    const posts = await fetchLatest(supabase, q || null, limit)
    return NextResponse.json({ posts })
  } catch {
    // Fallback to mock data (keeps app working before SQL scripts run)
    let items = getMockPosts()

    if (q) {
      const qq = q.toLowerCase()
      items = items.filter((p) => {
        const hay = `${p.title} ${p.excerpt} ${(p.tags || []).join(" ")}`.toLowerCase()
        return hay.includes(qq)
      })
    }

    if (variant === "trending") {
      items.sort((a, b) => b.views - a.views)
    } else {
      items.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    }

    return NextResponse.json({ posts: items.slice(0, limit) })
  }
}
