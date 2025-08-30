"use client"

import { useState, type FormEvent } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { slugify } from "@/lib/slug"
import { useRouter } from "next/navigation"

type Props = {
  mode: "create" | "edit"
  userId: string
  postId?: string
  initialTitle?: string
  initialExcerpt?: string
  initialContent?: string
  initialTags?: string[]
  initialStatus?: string
}

export default function EditorForm({
  mode,
  userId,
  postId,
  initialTitle = "",
  initialExcerpt = "",
  initialContent = "",
  initialTags = [],
}: Props) {
  const [title, setTitle] = useState(initialTitle)
  const [excerpt, setExcerpt] = useState(initialExcerpt)
  const [content, setContent] = useState(initialContent)
  const [tags, setTags] = useState(initialTags.join(", "))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function onSaveDraft(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const supabase = createClient()

    const parsedTags = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)

    try {
      if (mode === "create") {
        const { data, error } = await supabase
          .from("posts")
          .insert({
            author_id: userId,
            title,
            excerpt,
            content,
            tags: parsedTags,
            status: "draft",
          })
          .select("id")
          .single()
        if (error) throw error
        router.push(`/editor/${data!.id}`)
      } else {
        const { error } = await supabase
          .from("posts")
          .update({
            title,
            excerpt,
            content,
            tags: parsedTags,
          })
          .eq("id", postId!)
        if (error) throw error
      }
      router.refresh()
    } catch (err: any) {
      setError(err?.message || "Failed to save")
    } finally {
      setSaving(false)
    }
  }

  async function onPublish() {
    setSaving(true)
    setError(null)
    const supabase = createClient()
    try {
      const slug = slugify(title || "")
      const { error } = await supabase
        .from("posts")
        .update({
          status: "published",
          slug: slug || null,
          published_at: new Date().toISOString(),
          title,
          excerpt,
          content,
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        })
        .eq("id", postId!) // must exist
      if (error) throw error
      // After publish, go to public post page if you wire routing by slug later
      router.push("/dashboard/posts")
      router.refresh()
    } catch (err: any) {
      setError(err?.message || "Failed to publish")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={onSaveDraft} className="grid gap-6">
      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Input id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Short summary" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="content">Content</Label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-48 rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          placeholder="Write your post..."
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g. design, accessibility"
        />
        <p className="text-xs text-muted-foreground">Comma-separated</p>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : mode === "create" ? "Save draft" : "Save changes"}
        </Button>
        {mode === "edit" ? (
          <Button type="button" variant="outline" onClick={onPublish} disabled={saving}>
            {saving ? "Publishing..." : "Publish"}
          </Button>
        ) : null}
      </div>
    </form>
  )
}
