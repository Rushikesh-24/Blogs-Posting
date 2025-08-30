import { notFound } from "next/navigation"
import { format } from "date-fns"

async function getPost(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_VERCEL_URL ? "https://" + process.env.NEXT_PUBLIC_VERCEL_URL : ""}/api/posts/${id}`,
    {
      // Ensure fresh content for mock; later can be cached with revalidate
      cache: "no-store",
    },
  )
  if (!res.ok) return null
  const data = await res.json()
  return data.post as {
    id: string
    title: string
    content: string
    excerpt: string
    authorName: string
    createdAt: string
    views: number
    tags?: string[]
  }
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id)
  if (!post) notFound()

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <article>
        <header className="mb-6">
          <h1 className="text-pretty text-3xl font-semibold tracking-tight">{post.title}</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            By {post.authorName} • {format(new Date(post.createdAt), "MMM d, yyyy")} • {post.views} views
          </p>
          {post.tags && post.tags.length > 0 ? (
            <ul className="mt-3 flex flex-wrap items-center gap-2">
              {post.tags.map((t) => (
                <li
                  key={t}
                  className="rounded border px-2 py-0.5 text-xs text-muted-foreground"
                  aria-label={`Tag ${t}`}
                >
                  {t}
                </li>
              ))}
            </ul>
          ) : null}
        </header>
        <section className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-relaxed">{post.content}</p>
        </section>
      </article>
    </main>
  )
}
