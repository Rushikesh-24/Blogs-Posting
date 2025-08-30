import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import EditorForm from "@/components/editor/editor-form"

export const metadata = {
  title: "Edit Post",
}

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: post } = await supabase
    .from("posts")
    .select("id, title, excerpt, content, tags, status")
    .eq("id", params.id)
    .eq("author_id", user.id) // owner-only
    .single()

  if (!post) notFound()

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-6">
        <h1 className="text-pretty text-2xl font-semibold tracking-tight">Edit post</h1>
        <p className="text-muted-foreground mt-2 text-sm">Update your draft or published post.</p>
      </header>
      <EditorForm
        mode="edit"
        userId={user.id}
        postId={post.id}
        initialTitle={post.title ?? ""}
        initialExcerpt={post.excerpt ?? ""}
        initialContent={post.content ?? ""}
        initialTags={(post.tags as string[] | null) ?? []}
        initialStatus={(post.status as string) ?? "draft"}
      />
    </main>
  )
}
