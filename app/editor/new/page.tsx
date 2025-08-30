import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import EditorForm from "@/components/editor/editor-form"

export const metadata = {
  title: "New Post",
}

export default async function NewPostPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-6">
        <h1 className="text-pretty text-2xl font-semibold tracking-tight">Create a new post</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Write your draft and save it. You can publish from the dashboard.
        </p>
      </header>
      <EditorForm mode="create" userId={user.id} />
    </main>
  )
}
