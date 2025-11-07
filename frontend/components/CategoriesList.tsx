
"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Category } from "@/lib/types"
import { Star, Plus } from "lucide-react"
import Link from "next/link"
import { createCategory } from "@/lib/requests/createCategory"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface CategoriesListProps {
  categories: Category[]
  selectedCategory: string | null
  favorites: Set<string>
  onToggleFavorite: (categoryId: string) => void
  displayCategories: Category[]
  handlePrefetchCategory: (categoryId: string) => void
  showFavoritesOnly: boolean
}

export function CategoriesList({
  favorites,
  selectedCategory,
  onToggleFavorite,
  displayCategories,
  handlePrefetchCategory,
  showFavoritesOnly
}: CategoriesListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [categoryName, setCategoryName] = useState("")
  const queryClient = useQueryClient()

  const createCategoryMutation = useMutation({
    mutationFn: (data: { name: string; favorite: boolean }) => createCategory(data),
    onSuccess: (newCategory) => {
      queryClient.setQueryData<Category[]>(["categories"], (oldData) => {
        if (!oldData) return [newCategory]
        return [...oldData, newCategory]
      })
      setIsDialogOpen(false)
      setCategoryName("")
    },
    onError: (error) => {
      console.error("Failed to create category:", error)
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (categoryName.trim()) {
      createCategoryMutation.mutate({
        name: categoryName.trim(),
        favorite: showFavoritesOnly
      })
    }
  }

  return (
    <>
      <div className="flex flex-wrap gap-3">
        {displayCategories.map((category) => (
          <Link
            href={showFavoritesOnly ? `/?favorites=true&category=${category.id}` : `/?category=${category.id}`}
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

        <button
          onClick={() => setIsDialogOpen(true)}
          className="group flex items-center gap-2.5 rounded-full border-2 border-dashed px-6 py-3 text-sm font-semibold transition-all duration-200 hover:shadow-md border-border bg-card text-foreground hover:border-primary/60 hover:bg-accent hover:scale-105"
        >
          <Plus className="h-4 w-4" />
          <span>Create</span>
        </button>
      </div>

      {/* This is definitely not the best place to put the Dialog but serves its purpose  */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
            <DialogDescription>
              Add a new category to organize your posts.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="categoryName" className="block text-sm font-medium mb-2">
                Category Name
              </label>
              <input
                id="categoryName"
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Enter category name"
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
                required
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDialogOpen(false)}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createCategoryMutation.isPending || !categoryName.trim()}
                className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {createCategoryMutation.isPending ? "Creating..." : "Create Category"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
