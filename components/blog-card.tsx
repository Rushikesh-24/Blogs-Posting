import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Post } from "@/lib/types"
import { format } from "date-fns"
import Link from "next/link"

export default function BlogCard({ post }: { post: Post }) {
  return (
    <Link href={`/posts/${post.id}`} className="block h-full">
      <Card className="h-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-pretty line-clamp-2 text-base">{post.title}</CardTitle>
          <p className="text-muted-foreground text-xs">
            By {post.authorName} • {format(new Date(post.createdAt), "MMM d, yyyy")} • {post.views} views
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-pretty text-sm leading-relaxed text-foreground/80 line-clamp-3">{post.excerpt}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
