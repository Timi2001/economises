export function Hero() {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Welcome to
          <span className="text-blue-600 block">Economises Blog</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Discover amazing stories, insights, and perspectives on technology,
          lifestyle, business, and more. Join our community of curious minds.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Start Reading
          </button>
          <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium">
            Subscribe
          </button>
        </div>
      </div>
    </section>
  )
}
