
"use client"

import type { ReactNode } from "react"
import Link from "next/link"

interface CategoriesFilterProps {
  children: ReactNode
  showFavoritesOnly: boolean
  selectedCategory: string | null
}

export function CategoriesFilter({
  children,
  showFavoritesOnly,
  selectedCategory,
}: CategoriesFilterProps) {
  // "All categories" is active when not in favorites mode and no category is selected
  const isAllCategoriesActive = !showFavoritesOnly && !selectedCategory

  return (
    <>
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-5">
          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className={`rounded-full border-2 px-6 py-2.5 font-semibold text-sm transition-all duration-200 hover:scale-105 ${
                isAllCategoriesActive
                  ? "border-primary bg-primary text-primary-foreground shadow-md"
                  : "border-transparent bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              All categories
            </Link>

            <Link
              href="/?favorites=true"
              className={`rounded-full border-2 px-6 py-2.5 font-semibold text-sm transition-all duration-200 hover:scale-105 ${
                showFavoritesOnly
                  ? "border-primary bg-primary text-primary-foreground shadow-md"
                  : "border-transparent bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
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
