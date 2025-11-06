"use client"

import { Category, Post } from "@/lib/types"
import { Card } from "./ui/card"
import { Badge } from "./ui/badge"

type PostCardProps = {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Card
      key={post.id}
      className="group flex flex-col overflow-hidden border-2 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-primary/30"
    >
      <div className="flex flex-1 flex-col p-7">
        <h2 className="font-serif text-2xl font-bold leading-tight text-balance group-hover:text-primary transition-colors">
          {post.date}
        </h2>
        <p className="mt-5 flex-1 text-sm leading-relaxed text-muted-foreground text-pretty">{post.description}</p>
        <div className="mt-7 flex flex-wrap gap-2">
          {post.categories.map((catId) => {
            const category = ([] as Category[]).find((c) => c.id === catId)

            return (
              <Badge
                key={catId}
                variant="secondary"
                className="cursor-pointer font-medium transition-all hover:bg-primary hover:text-primary-foreground hover:scale-105"
              // onClick={() => handleCategoryClick(catId)}
              >
                {category?.name}
              </Badge>
            )
          })}
        </div>
      </div>
    </Card>
  )
}

export function PostListSkeleton() {
  // Varied widths for more natural appearance
  const titleWidths = ['w-full', 'w-5/6', 'w-4/5', 'w-full', 'w-11/12', 'w-5/6']
  const excerptLastLineWidths = ['w-3/4', 'w-4/5', 'w-2/3', 'w-5/6', 'w-3/5', 'w-4/5']
  const badgeCounts = [2, 3, 2, 3, 1, 2]

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card
          key={i}
          className="flex flex-col overflow-hidden border-2"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="flex flex-1 flex-col p-7">
            {/* Date skeleton */}
            <div className="h-3 w-24 animate-pulse rounded bg-muted/70" />

            {/* Title skeleton - matches font-serif text-2xl */}
            <div className="mt-4 space-y-2.5">
              <div className={`h-8 ${titleWidths[i]} animate-pulse rounded bg-muted`} />
              <div className="h-8 w-3/5 animate-pulse rounded bg-muted" />
            </div>

            {/* Excerpt skeleton - matches text-sm leading-relaxed */}
            <div className="mt-5 flex-1 space-y-2.5">
              <div className="h-4 w-full animate-pulse rounded bg-muted/80" />
              <div className="h-4 w-full animate-pulse rounded bg-muted/80" />
              <div className="h-4 w-full animate-pulse rounded bg-muted/80" />
              <div className={`h-4 ${excerptLastLineWidths[i]} animate-pulse rounded bg-muted/80`} />
            </div>

            {/* Category badges skeleton - varied count */}
            <div className="mt-7 flex flex-wrap gap-2">
              {Array.from({ length: badgeCounts[i] }).map((_, badgeIndex) => (
                <div
                  key={badgeIndex}
                  className="h-6 animate-pulse rounded-full bg-muted"
                  style={{
                    width: `${60 + Math.floor((badgeIndex * 20) % 40)}px`,
                    animationDelay: `${(i * 100) + (badgeIndex * 50)}ms`
                  }}
                />
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
