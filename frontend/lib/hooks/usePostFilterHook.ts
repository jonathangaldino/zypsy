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

  // Prefetch posts by category
  // When the user enters the category anchor - prefetch the post of this category
  // This is to avoid the user seeing a blank screen for a few seconds
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

  // Set<string> containing the Ids of the categories the user has favorited
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
    onSuccess: (data, variables) => {
      // Update cached date in useQuery
      queryClient.setQueryData(["categories"], (oldData: Category[] | undefined) => {
        if (!oldData) {
          return oldData
        }

        // Return everything, except the category with the updated favorite status
        const newData = oldData.map((category) => {
          if (category.id === variables.categoryId) {
            return {
              ...category,
              favorite: variables.isFavorite
            }
          }
          return category
        })

        console.log("New state after triggering mutation", { oldData, newData })
        return newData;
      })
    },
  })

  const toggleFavorite = (categoryId: string) => {
    const isFavorite = !favorites.has(categoryId)
    toggleFavoriteMutation.mutate({ categoryId, isFavorite })
  }
  const filteredPosts = useMemo(() => {
    console.log("Filtering posts", { showFavoritesOnly, selectedCategory, favorites, posts })
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

  console.log({ filteredPosts })

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
