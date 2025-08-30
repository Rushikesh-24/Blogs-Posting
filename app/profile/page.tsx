import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import ProfileForm from "./profile-form"

export const metadata = {
  title: "Your Profile",
}

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  // Load existing profile (owner-only via RLS)
  const { data: profile } = await supabase.from("profiles").select("display_name,bio").eq("user_id", user.id).single()

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <header className="mb-6">
        <h1 className="text-pretty text-2xl font-semibold tracking-tight">Your Profile</h1>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">Update your display name and bio.</p>
      </header>
      <ProfileForm userId={user.id} initialName={profile?.display_name ?? ""} initialBio={profile?.bio ?? ""} />
    </main>
  )
}
