import { Header } from '@/components/header'
import { Hero } from '@/components/hero'
import { FeaturedPosts } from '@/components/featured-posts'
import { Categories } from '@/components/categories'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FeaturedPosts />
          <Categories />
        </div>
      </main>
    </div>
  )
}
