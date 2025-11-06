import { useQuery } from "@tanstack/react-query"
import { getCategories } from "../requests/getCategories"
import { getPostsByCategoryId } from "../requests/getPostsByCategoryId"
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function usePostFilter() {
  const searchParams = useSearchParams();
  const selectedCategory: string | null = searchParams.get("category")
  const showFavoritesOnly: boolean = searchParams.get("favorites") === "true"

  // Requests:
  const { data: allCategories, error, isLoading } = useQuery<unknown, Error, Awaited<ReturnType<typeof getCategories>>>({
    queryKey: ["categories"],
    queryFn: async () => getCategories()
  })

  const { data: posts, error: postsError, isLoading: postsIsLoading } = useQuery<unknown, Error, Awaited<ReturnType<typeof getPostsByCategoryId>>>({
    queryKey: ["posts", `category=${selectedCategory}`],
    queryFn: async () => getPostsByCategoryId(selectedCategory!), // okay to use ! because of the option `enabled`
    enabled: selectedCategory !== null
  })

  console.log(posts)

  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  // Load favorites and selected category from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites")
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)))
    }

    const params = new URLSearchParams(window.location.search)
    const categoryParam = params.get("category")
    if (categoryParam) {
      // setSelectedCategory(categoryParam)
    }
  }, [])


  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(Array.from(favorites)))
  }, [favorites])

  const toggleFavorite = (categoryId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(categoryId)) {
        newFavorites.delete(categoryId)
      } else {
        newFavorites.add(categoryId)
      }
      return newFavorites
    })
  }

  // Filter posts based on selected category or favorites
  const filteredPosts = (posts ?? []).filter((post) => {
    if (showFavoritesOnly) {
      return post.categories.some((cat) => favorites.has(cat))
    }
    if (selectedCategory) {
      return post.categories.includes(selectedCategory)
    }
    return true
  })

  const displayCategories = showFavoritesOnly ? (allCategories ?? []).filter((cat) => favorites.has(cat.id)) : (allCategories || [])

  return {
    selectedCategory,
    showFavoritesOnly,
    favorites,
    filteredPosts,
    toggleFavorite,

    // loading states:
    isLoadingCategories: isLoading,
    isLoadingPosts: postsIsLoading,

    // data:
    allCategories: allCategories || [],
    posts: posts || [],
    displayCategories: displayCategories || [],
  }
}
