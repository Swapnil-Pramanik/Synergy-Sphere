import React from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

interface LayoutProps {
  children: React.ReactNode
  currentPage: string
  onNavigate: (page: string) => void
  onLogout: () => void
  user: any
}

export function Layout({ children, currentPage, onNavigate, onLogout, user }: LayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const sidebarWidth = sidebarCollapsed ? 80 : 256 // w-20 (5rem) vs w-64 (16rem)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out z-40 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
        style={{ overflowY: 'hidden' }}
      >
        <Sidebar
          currentPage={currentPage}
          onNavigate={onNavigate}
          onLogout={onLogout}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Main area is offset by sidebar width and scrolls independently */}
      <div className="min-h-screen" style={{ marginLeft: sidebarWidth }}>
        {/* Header */}
        <Header
          user={user}
          onLogout={onLogout}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Scrollable Content */}
        <main className="p-6 bg-gray-50 h-[calc(100vh-64px)] overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
