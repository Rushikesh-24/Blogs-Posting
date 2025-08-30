"use client"

import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SignOutButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function onSignOut() {
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.refresh()
    setLoading(false)
  }

  return (
    <Button variant="outline" size="sm" onClick={onSignOut} disabled={loading}>
      {loading ? "Signing out..." : "Sign out"}
    </Button>
  )
}
