"use client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="mx-auto max-w-lg px-4 py-14">
      <h1 className="text-pretty text-2xl font-semibold tracking-tight">Something went wrong</h1>
      <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
        An unexpected error occurred. You can try again or go back to the homepage.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={() => reset()}
          className="rounded-md border px-3 py-2 text-sm hover:bg-accent"
          aria-label="Try again"
        >
          Try again
        </button>
        <a href="/" className="text-sm underline underline-offset-4">
          Go home
        </a>
      </div>
      <pre className="text-muted-foreground/80 mt-6 overflow-auto whitespace-pre-wrap rounded-md border p-3 text-xs">
        {error.message}
      </pre>
    </main>
  )
}
