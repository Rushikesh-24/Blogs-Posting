import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import Link from "next/link"
import { Suspense } from "react"
import "./globals.css"
import SignOutButton from "@/components/auth/sign-out-button"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.app",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let role: string | null = null
  if (user) {
    const { data: prof } = await supabase.from("profiles").select("role").eq("user_id", user.id).maybeSingle()
    role = prof?.role ?? null
  }

  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <header role="banner" className="border-b">
            <nav aria-label="Main" className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
              <Link href="/" className="font-semibold">
                Blog
              </Link>
              <div className="flex items-center gap-4">
                <Link href="/posts" className="text-sm hover:underline underline-offset-4">
                  Posts
                </Link>
                {role === "admin" ? (
                  <Link href="/admin" className="text-sm hover:underline underline-offset-4">
                    Admin
                  </Link>
                ) : null}
                {user ? (
                  <div className="flex items-center gap-3">
                    <Link href="/editor/new" className="text-sm hover:underline underline-offset-4">
                      Write
                    </Link>
                    <Link href="/dashboard/posts" className="text-sm hover:underline underline-offset-4">
                      Dashboard
                    </Link>
                    <Link href="/profile" className="text-sm hover:underline underline-offset-4">
                      Profile
                    </Link>
                    <SignOutButton />
                  </div>
                ) : (
                  <Link href="/auth/login" className="text-sm hover:underline underline-offset-4">
                    Sign in
                  </Link>
                )}
              </div>
            </nav>
          </header>
          {children}
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
