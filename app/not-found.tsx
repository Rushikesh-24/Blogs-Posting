export default function NotFound() {
  return (
    <main className="mx-auto max-w-lg px-4 py-14">
      <h1 className="text-pretty text-2xl font-semibold tracking-tight">Page not found</h1>
      <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <a href="/" className="mt-6 inline-block text-sm underline underline-offset-4">
        Back to home
      </a>
    </main>
  )
}
