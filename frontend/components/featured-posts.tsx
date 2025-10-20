'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { api } from '@/lib/api'

export function FeaturedPosts() {
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['posts', 'featured'],
    queryFn: () => api.post.getAll.query({
      limit: 6,
      published: true,
    }),
  })

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading posts...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16">
        <div className="text-center">
          <p className="text-red-600">Failed to load posts. Please try again later.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Posts</h2>
        <p className="text-gray-600">Discover our most recent articles and stories</p>
      </div>

      {!posts?.posts?.length ? (
        <div className="text-center">
          <p className="text-gray-600">No posts available yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {post.featuredImage && (
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <span>{post.author?.firstName} {post.author?.lastName}</span>
                  <span className="mx-2">•</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  <Link
                    href={`/posts/${post.slug}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {post.title}
                  </Link>
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt || post.content?.substring(0, 150) + '...'}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {post.categories?.slice(0, 2).map((category) => (
                    <span
                      key={category.id}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                    >
                      {category.name}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/posts/${post.slug}`}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Read more →
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      {posts?.hasMore && (
        <div className="text-center mt-12">
          <Link
            href="/posts"
            className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
          >
            View All Posts
          </Link>
        </div>
      )}
    </section>
  )
}
