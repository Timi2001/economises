'use client'

import { useState } from 'react'
import { AdminSidebar } from './admin-sidebar'
import { AdminPosts } from './admin-posts'
import { AdminUsers } from './admin-users'
import { AdminComments } from './admin-comments'
import { AdminSettings } from './admin-settings'

type AdminTab = 'dashboard' | 'posts' | 'users' | 'comments' | 'settings'

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard')

  const renderContent = () => {
    switch (activeTab) {
      case 'posts':
        return <AdminPosts />
      case 'users':
        return <AdminUsers />
      case 'comments':
        return <AdminComments />
      case 'settings':
        return <AdminSettings />
      default:
        return <AdminPosts /> // Default to posts
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 capitalize">
              {activeTab === 'dashboard' ? 'Admin Dashboard' : activeTab}
            </h1>
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
}
