"use client"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type Props = {
  value: string
  onChange: (v: string) => void
  className?: string
}

export default function SearchInput({ value, onChange, className }: Props) {
  return (
    <div className={cn("w-full", className)}>
      <label htmlFor="site-search" className="sr-only">
        Search blogs
      </label>
      <Input
        id="site-search"
        placeholder="Search articles by keywords..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11"
      />
    </div>
  )
}
