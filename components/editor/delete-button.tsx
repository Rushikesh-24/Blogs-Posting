"use client"

import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function DeletePostButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function onDelete() {
    if (!confirm("Delete this post?")) return
    setLoading(true)
    const supabase = createClient()
    await supabase.from("posts").delete().eq("id", id)
    setLoading(false)
    router.refresh()
  }

  return (
    <Button size="sm" variant="destructive" onClick={onDelete} disabled={loading}>
      {loading ? "Deleting..." : "Delete"}
    </Button>
  )
}
