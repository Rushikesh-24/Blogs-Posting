import { NextResponse } from "next/server"
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

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()

    // Only published content is publicly readable via RLS
    const { data: p, error } = await supabase
      .from("posts")
      .select("id, author_id, title, excerpt, content, tags, status, published_at, created_at")
      .eq("id", params.id)
      .eq("status", "published")
      .single()

    if (error || !p) return NextResponse.json({ error: "Not found" }, { status: 404 })

    // views
    const { data: m } = await supabase.from("post_metrics").select("views").eq("post_id", p.id).single()
    // author display name
    const { data: prof } = await supabase.from("profiles").select("display_name").eq("user_id", p.author_id).single()

    const post = {
      id: p.id,
      title: p.title,
      excerpt: p.excerpt ?? "",
      content: p.content ?? "",
      authorId: p.author_id,
      authorName: prof?.display_name || "Author",
      createdAt: p.published_at || p.created_at,
      views: m?.views ?? 0,
      tags: p.tags ?? [],
    }

    return NextResponse.json({ post })
  } catch {
    const mock = getMockPosts().find((x) => x.id === params.id)
    if (!mock) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json({ post: mock })
  }
}
