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
        <time className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{post.date}</time>
        <h2 className="mt-4 font-serif text-2xl font-bold leading-tight text-balance group-hover:text-primary transition-colors">
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
