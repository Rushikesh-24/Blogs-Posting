export type Post = {
  id: string
  title: string
  excerpt: string
  content?: string
  authorId: string
  authorName: string
  createdAt: string
  views: number
  tags?: string[]
}
