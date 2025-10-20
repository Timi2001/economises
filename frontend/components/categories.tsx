'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { api } from '@/lib/api'

export function Categories() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.category.getAll.query({ activeOnly: true }),
  })

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Categories</h2>
        <p className="text-gray-600">Find posts in your favorite topics</p>
      </div>

      {!categories?.length ? (
        <div className="text-center">
          <p className="text-gray-600">No categories available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="bg-white rounded-lg p-6 hover:shadow-md transition-shadow border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {category.name}
                </h3>
                {category.color && (
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                )}
              </div>

              {category.description && (
                <p className="text-gray-600 text-sm mb-4">
                  {category.description}
                </p>
              )}

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {category._count?.posts || 0} posts
                </span>
                <span className="text-blue-600 text-sm font-medium">
                  Explore →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
