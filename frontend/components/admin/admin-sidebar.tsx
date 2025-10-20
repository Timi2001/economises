import Link from 'next/link'

type AdminTab = 'dashboard' | 'posts' | 'users' | 'comments' | 'settings'

interface AdminSidebarProps {
  activeTab: AdminTab
  onTabChange: (tab: AdminTab) => void
}

const menuItems = [
  { id: 'posts' as AdminTab, label: 'Posts', icon: '📝' },
  { id: 'users' as AdminTab, label: 'Users', icon: '👥' },
  { id: 'comments' as AdminTab, label: 'Comments', icon: '💬' },
  { id: 'settings' as AdminTab, label: 'Settings', icon: '⚙️' },
]

export function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  return (
    <aside className="w-64 bg-white shadow-lg min-h-screen">
      <div className="p-6">
        <Link href="/" className="text-xl font-bold text-gray-900">
          Economises Blog
        </Link>
        <p className="text-sm text-gray-600 mt-1">Admin Panel</p>
      </div>

      <nav className="px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
        <Link
          href="/"
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          ← Back to Blog
        </Link>
      </div>
    </aside>
  )
}
