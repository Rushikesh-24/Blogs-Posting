"use client"

import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function PublishToggleButton({ id, status }: { id: string; status: "draft" | "published" }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function toggle() {
    setLoading(true)
    const supabase = createClient()
    const nextStatus = status === "published" ? "draft" : "published"
    const payload: Record<string, any> = { status: nextStatus }
    if (nextStatus === "published") payload.published_at = new Date().toISOString()
    const { error } = await supabase.from("posts").update(payload).eq("id", id)
    setLoading(false)
    if (!error) router.refresh()
  }

  return (
    <Button size="sm" variant="outline" onClick={toggle} disabled={loading}>
      {loading ? "Updating..." : status === "published" ? "Unpublish" : "Publish"}
    </Button>
  )
}
