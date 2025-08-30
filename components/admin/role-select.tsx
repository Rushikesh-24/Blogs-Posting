"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

export default function RoleSelect({ userId, role }: { userId: string; role: "user" | "admin" }) {
  const [current, setCurrent] = useState<"user" | "admin">(role)
  const [loading, setLoading] = useState(false)

  async function toggleRole() {
    if (!confirm(`Change role to ${current === "admin" ? "user" : "admin"}?`)) return
    setLoading(true)
    const supabase = createClient()
    const next = current === "admin" ? "user" : "admin"
    const { error } = await supabase.from("profiles").update({ role: next }).eq("user_id", userId)
    setLoading(false)
    if (!error) setCurrent(next)
  }

  return (
    <Button size="sm" variant="outline" onClick={toggleRole} disabled={loading}>
      {loading ? "Updating..." : current === "admin" ? "Demote to user" : "Promote to admin"}
    </Button>
  )
}
