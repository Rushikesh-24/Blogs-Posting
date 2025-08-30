import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import PublishToggleButton from "@/components/editor/publish-toggle-button"
import DeletePostButton from "@/components/editor/delete-button"

export const metadata = {
  title: "Your Posts",
}

export default async function DashboardPostsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: posts } = await supabase
    .from("posts")
    .select("id, title, status, updated_at")
    .eq("author_id", user.id)
    .order("updated_at", { ascending: false })

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-pretty text-2xl font-semibold tracking-tight">Your posts</h1>
          <p className="text-muted-foreground mt-1 text-sm">Create drafts, edit, and publish.</p>
        </div>
        <Link href="/editor/new" className="text-sm underline underline-offset-4">
          New post
        </Link>
      </header>

      <ul className="divide-y rounded-md border">
        {(posts ?? []).length === 0 ? (
          <li className="p-4 text-sm text-muted-foreground">No posts yet.</li>
        ) : (
          posts!.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{p.title}</p>
                <p className="text-muted-foreground mt-0.5 text-xs">{p.status}</p>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/editor/${p.id}`} className="text-xs underline underline-offset-4">
                  Edit
                </Link>
                <PublishToggleButton id={p.id} status={p.status as "draft" | "published"} />
                <DeletePostButton id={p.id} />
              </div>
            </li>
          ))
        )}
      </ul>
    </main>
  )
}
