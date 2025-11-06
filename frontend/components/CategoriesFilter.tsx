
"use client"

import type { ReactNode } from "react"
import Link from "next/link"

interface CategoriesFilterProps {
  children: ReactNode
}

export function CategoriesFilter({
  children,
}: CategoriesFilterProps) {

  return (
    <>
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-5">
          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-full px-6 font-medium transition-all hover:scale-105"
            >
              All categories
            </Link>

            <Link
              href="/?favorites=true"
              // variant={showFavoritesOnly ? "default" : "ghost"}
              className="rounded-full px-6 font-medium transition-all hover:scale-105"
            >
              Favorite categories
            </Link>
          </div>
        </div>
      </div>

      <div className="border-b border-border/50 bg-secondary/20">
        <div className="container mx-auto px-6 py-8">
          {children}
        </div>
      </div>
    </>
  )
}

export function CategoriesFilterSkeleton() {
  return (
    <>
      {/* Filter Tabs Skeleton */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-5">
          <div className="flex flex-wrap gap-3">
            <div className="h-10 w-36 animate-pulse rounded-full bg-muted" />
            <div className="h-10 w-44 animate-pulse rounded-full bg-muted" />
          </div>
        </div>
      </div>

      {/* Categories Skeleton */}
      <div className="border-b border-border/50 bg-secondary/20">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-wrap gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-11 animate-pulse rounded-full bg-muted"
                style={{ width: `${1 * 80 + 120}px` }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
