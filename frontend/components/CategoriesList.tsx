
"use client"

import { Category } from "@/lib/types"
import { Star } from "lucide-react"
import Link from "next/link"

interface CategoriesListProps {
  categories: Category[]
  selectedCategory: string | null
  favorites: Set<string>
  onToggleFavorite: (categoryId: string) => void
  displayCategories: Category[]
  handlePrefetchCategory: (categoryId: string) => void
}

export function CategoriesList({
  favorites,
  selectedCategory,
  onToggleFavorite,
  displayCategories,
  handlePrefetchCategory
}: CategoriesListProps) {

  return (
    <div className="flex flex-wrap gap-3">
      {displayCategories.map((category) => (
        <Link
          href={`/?category=${category.id}`}
          onMouseEnter={() => handlePrefetchCategory(category.id)}
          key={category.id}
          className={`group flex items-center gap-2.5 rounded-full border-2 px-6 py-3 text-sm font-semibold transition-all duration-200 hover:shadow-md ${selectedCategory === category.id
            ? "border-primary bg-primary text-primary-foreground shadow-md scale-105"
            : "border-border bg-card text-foreground hover:border-primary/60 hover:bg-accent hover:scale-105"
            }`}
        >
          <span>{category.name}</span>
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onToggleFavorite(category.id)
            }}
            className="transition-transform hover:scale-125 active:scale-95"
            aria-label={favorites.has(category.id) ? "Remove from favorites" : "Add to favorites"}
          >
            <Star
              className={`h-4 w-4 transition-colors ${favorites.has(category.id)
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground group-hover:text-amber-400"
                }`}
            />
          </button>
        </Link>
      ))}
    </div>
  )
}
