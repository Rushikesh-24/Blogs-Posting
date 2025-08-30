"use client"

import { useState, type FormEvent } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Props = {
  userId: string
  initialName: string
  initialBio: string
}

export default function ProfileForm({ userId, initialName, initialBio }: Props) {
  const [displayName, setDisplayName] = useState(initialName)
  const [bio, setBio] = useState(initialBio)
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus("saving")
    setError(null)
    const supabase = createClient()

    // Upsert owner profile; RLS ensures user_id must match auth.uid()
    const { error } = await supabase
      .from("profiles")
      .upsert({ user_id: userId, display_name: displayName || null, bio: bio || null }, { onConflict: "user_id" })

    if (error) {
      setError(error.message)
      setStatus("error")
      return
    }
    setStatus("saved")
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6">
      <div className="grid gap-2">
        <Label htmlFor="display-name">Display name</Label>
        <Input
          id="display-name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Your name"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="bio">Bio</Label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="A short bio"
          className="min-h-24 rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={status === "saving"}>
          {status === "saving" ? "Saving..." : status === "saved" ? "Saved" : "Save changes"}
        </Button>
      </div>
    </form>
  )
}
