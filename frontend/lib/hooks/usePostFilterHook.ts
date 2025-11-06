import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { getCategories } from "../requests/getCategories"
import { getPostsByCategoryId } from "../requests/getPostsByCategoryId"
import { updateCategory } from "../requests/updateCategory"
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Category } from "../types";

export function usePostFilter() {
  const queryClient = useQueryClient()
  const searchParams = useSearchParams();
  const selectedCategory: string | null = searchParams.get("category")
  const showFavoritesOnly: boolean = searchParams.get("favorites") === "true"

  // Requests:
  const { data: allCategories, error, isLoading } = useQuery<unknown, Error, Awaited<ReturnType<typeof getCategories>>>({
    queryKey: ["categories"],
    queryFn: async () => getCategories(),
    initialData: [] // better than undefined?
  })

  const { data: posts, error: postsError, isLoading: postsIsLoading, isFetching: postsIsFetching } = useQuery<unknown, Error, Awaited<ReturnType<typeof getPostsByCategoryId>>>({
    queryKey: ["posts", `category=${selectedCategory}`],
    queryFn: async () => getPostsByCategoryId(selectedCategory!), // okay to use ! because of the option `enabled`
    enabled: selectedCategory !== null,
    initialData: [] // better than undefined?
  })

  // Prefetch posts to prevent blank screen during category navigation
  const handlePrefetchCategory = (categoryId: string) => {
    const queryKey = ["posts", `category=${categoryId}`]
    const cachedData = queryClient.getQueryData(queryKey)

    // Only prefetch if not already cached
    if (!cachedData) {
      queryClient.prefetchQuery({
        queryKey,
        queryFn: () => getPostsByCategoryId(categoryId),
        staleTime: 60 * 1000,
      })
    }
  }

  // IDs of favorited categories
  const favorites = useMemo(() => {
    if (!allCategories) return new Set<string>();

    return new Set(
      allCategories.filter((category) => category.favorite)
        .map((category) => category.id)
    )
  }, [allCategories])

  // Mutation for updating category favorite status in backend
  const toggleFavoriteMutation = useMutation({
    mutationFn: ({ categoryId, isFavorite }: { categoryId: string; isFavorite: boolean }) =>
      updateCategory(categoryId, { favorite: isFavorite }),

    // OPTIMISTIC UPDATE - runs immediately before the request
    onMutate: async ({ categoryId, isFavorite }) => {
      // Cancel any outgoing refetches to prevent them from overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: ["categories"] })

      // Snapshot the previous value for rollback
      const previousCategories = queryClient.getQueryData<Category[]>(["categories"])

      // Optimistically update the cache
      queryClient.setQueryData<Category[]>(["categories"], (oldData) => {
        if (!oldData) return oldData

        return oldData.map((category) =>
          category.id === categoryId
            ? { ...category, favorite: isFavorite }
            : category
        )
      })

      // Return context with the snapshot for rollback
      return { previousCategories }
    },

    onError: (err, variables, context) => {

      // Rollback to the previous state
      if (context?.previousCategories) {
        queryClient.setQueryData(["categories"], context.previousCategories)
      }
    },

    onSuccess: (data, variables) => {

      // Update cached data with the actual response from backend
      queryClient.setQueryData<Category[]>(["categories"], (oldData) => {
        if (!oldData) return oldData

        // Replace the category with the actual backend response
        return oldData.map((category) =>
          category.id === data.id ? data : category
        )
      })
    },

    onSettled: () => {
      // Optionally invalidate to ensure consistency with backend
    }
  })

  const toggleFavorite = (categoryId: string) => {
    const isFavorite = !favorites.has(categoryId)
    toggleFavoriteMutation.mutate({ categoryId, isFavorite })
  }

  const filteredPosts = useMemo(() => {
    if (!posts) return [];

    return posts.filter(post => {
      if (showFavoritesOnly) {
        return post.categories.some((cat) => favorites.has(cat))
      }
      if (selectedCategory) {
        return post.categories.includes(selectedCategory)
      }
      return true
    })
  }, [posts, showFavoritesOnly, selectedCategory, favorites]);

  const displayCategories = useMemo(() => {
    if (showFavoritesOnly) {
      return (allCategories ?? []).filter(c => favorites.has(c.id))
    }

    return allCategories || []
  }, [showFavoritesOnly, allCategories, favorites])


  return {
    selectedCategory,
    showFavoritesOnly,
    favorites,
    filteredPosts,
    toggleFavorite,

    // loading states:
    isLoadingCategories: isLoading,
    isLoadingPosts: postsIsFetching,

    // data:
    allCategories: allCategories || [],
    posts: posts || [],
    displayCategories: displayCategories || [],


    // prefetch functions:
    handlePrefetchCategory
  }
}
