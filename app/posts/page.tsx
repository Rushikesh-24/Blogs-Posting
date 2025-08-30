import PostList from "@/components/post-list"

export const metadata = {
  title: "All Posts",
}

export default function AllPostsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-6">
        <h1 className="text-pretty text-2xl font-semibold tracking-tight">All Posts</h1>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
          Browse the full collection. Pagination and filters will come after wiring data.
        </p>
      </header>
      <PostList variant="all" limit={60} />
    </main>
  )
}
