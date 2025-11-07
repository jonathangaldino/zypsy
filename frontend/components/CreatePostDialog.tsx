"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"
import { Plus } from "lucide-react"
import { Category } from "@/lib/types"
import { createPost } from "@/lib/requests/createPost"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const createPostSchema = z.object({
  description: z.string().min(1, "Description is required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  categoryId: z.string().min(1, "Category is required"),
})

type CreatePostFormData = z.infer<typeof createPostSchema>

interface CreatePostDialogProps {
  categories: Category[]
  selectedCategory: string | null
}

export function CreatePostDialog({ categories, selectedCategory }: CreatePostDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      categoryId: selectedCategory || "",
      date: new Date().toISOString().split("T")[0], // Today's date in YYYY-MM-DD
    },
  })

  const createPostMutation = useMutation({
    mutationFn: ({ categoryId, data }: { categoryId: string; data: { description: string; date: string } }) =>
      createPost(categoryId, data),
    onSuccess: (newPost, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["posts", `category=${variables.categoryId}`],
      })
      setIsDialogOpen(false)
      reset()
    },
    onError: (error) => {
      console.error("Failed to create post:", error)
    },
  })

  const onSubmit = (data: CreatePostFormData) => {
    const { categoryId, ...postData } = data
    createPostMutation.mutate({
      categoryId,
      data: postData,
    })
  }

  return (
    <>
      <button
        onClick={() => setIsDialogOpen(true)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-all"
      >
        <Plus className="h-4 w-4" />
        <span>Create Post</span>
      </button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
            <DialogDescription>
              Add a new post to share your thoughts.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium mb-2">
                Category
              </label>
              <select
                id="categoryId"
                {...register("categoryId")}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="mt-1 text-sm text-red-500">{errors.categoryId.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium mb-2">
                Date
              </label>
              <input
                id="date"
                type="date"
                {...register("date")}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-500">{errors.date.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                id="description"
                {...register("description")}
                rows={6}
                placeholder="Write your post content here..."
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsDialogOpen(false)
                  reset()
                }}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createPostMutation.isPending}
                className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {createPostMutation.isPending ? "Creating..." : "Create Post"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
