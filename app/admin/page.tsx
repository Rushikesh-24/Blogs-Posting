import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import PublishToggleButton from "@/components/editor/publish-toggle-button"
import DeletePostButton from "@/components/editor/delete-button"
import RoleSelect from "@/components/admin/role-select"

export const metadata = {
  title: "Admin",
}

export default async function AdminPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  // Check admin role
  const { data: myProfile } = await supabase.from("profiles").select("role").eq("user_id", user.id).single()

  if (myProfile?.role !== "admin") {
    redirect("/") // not authorized
  }

  // Load posts (all), newest first
  const { data: posts = [] } = await supabase
    .from("posts")
    .select("id, title, status, author_id, updated_at")
    .order("updated_at", { ascending: false })

  // Load metrics for posts
  const postIds = posts.map((p) => p.id)
  const { data: metrics = [] } =
    postIds.length > 0
      ? await supabase.from("post_metrics").select("post_id, views").in("post_id", postIds)
      : { data: [] as { post_id: string; views: number }[] }
  const metricsMap = new Map(metrics.map((m: any) => [m.post_id, m.views]))

  // Load profiles (users)
  const { data: users = [] } = await supabase
    .from("profiles")
    .select("user_id, display_name, role, created_at")
    .order("created_at", { ascending: false })

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-pretty text-2xl font-semibold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">Manage posts and user roles.</p>
      </header>

      <section className="mb-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">All Posts</h2>
          <Link href="/editor/new" className="text-sm underline underline-offset-4">
            New post
          </Link>
        </div>
        <ul className="divide-y rounded-md border">
          {posts.length === 0 ? (
            <li className="p-4 text-sm text-muted-foreground">No posts found.</li>
          ) : (
            posts.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{p.title}</p>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    {p.status} • {metricsMap.get(p.id) ?? 0} views
                  </p>
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
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Users</h2>
        <ul className="divide-y rounded-md border">
          {users.length === 0 ? (
            <li className="p-4 text-sm text-muted-foreground">No users found.</li>
          ) : (
            users.map((u) => (
              <li key={u.user_id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{u.display_name || u.user_id}</p>
                  <p className="text-muted-foreground mt-0.5 text-xs">Role: {u.role}</p>
                </div>
                <RoleSelect userId={u.user_id} role={u.role as "user" | "admin"} />
              </li>
            ))
          )}
        </ul>
      </section>
    </main>
  )
}
