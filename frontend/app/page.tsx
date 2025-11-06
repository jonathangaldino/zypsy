
"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Header from "@/components/Header"
import { CategoriesFilter, CategoriesFilterSkeleton } from "@/components/CategoriesFilter"
import { CategoriesList } from "@/components/CategoriesList"
import PostCard, { PostListSkeleton } from "@/components/PostCard"
import { usePostFilter } from "@/lib/hooks/usePostFilterHook"

function PostsPage() {
  const { selectedCategory,
    allCategories,
    displayCategories,
    showFavoritesOnly,
    favorites,
    filteredPosts,
    toggleFavorite,
    isLoadingCategories,
    isLoadingPosts,
    handlePrefetchCategory } = usePostFilter()

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {isLoadingCategories ? (
        <CategoriesFilterSkeleton />
      ) : (
        <CategoriesFilter>

          <CategoriesList
            displayCategories={displayCategories}
            categories={allCategories}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            selectedCategory={selectedCategory}
            handlePrefetchCategory={handlePrefetchCategory}
          />
        </CategoriesFilter>
      )}

      {/* Posts */}
      <main className="container mx-auto px-6 py-12 md:py-16">
        {isLoadingPosts ? (
          <PostListSkeleton />
        ) : (
          <>
            <div className="mb-10">
              {selectedCategory && (
                <p className="text-sm font-medium text-muted-foreground">
                  Found {filteredPosts.length} post{filteredPosts.length !== 1 ? "s" : ""}
                  {selectedCategory && ` in "${(allCategories).find((c) => c.id === selectedCategory)?.name}"`}
                  {showFavoritesOnly && " in favorite categories"}
                </p>
              )}
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                />
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="py-32 text-center">
                <p className="text-lg font-medium text-muted-foreground">
                  {selectedCategory ? "No posts found. Try selecting a different category." : "Select a category"}
                </p>
              </div>
            )}

          </>
        )}
      </main >
    </div>
  )
}

// In an usual app, we usually have a wrapper components that provide state, context, and other
// Sometimes, one in server side and other in client side
export default function withQueryClient() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <PostsPage />
    </QueryClientProvider>
  )
}
