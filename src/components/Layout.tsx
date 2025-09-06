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
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Desktop Sidebar - Always visible on desktop */}
        <div className={`
          ${sidebarCollapsed ? 'w-20' : 'w-64'} 
          min-h-screen 
          bg-white 
          border-r 
          border-gray-200 
          transition-all 
          duration-300 
          ease-in-out 
          flex-shrink-0
        `}>
          <Sidebar 
            currentPage={currentPage} 
            onNavigate={onNavigate} 
            onLogout={onLogout}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 min-h-screen">
          {/* Header */}
          <Header 
            user={user} 
            onLogout={onLogout}
            sidebarCollapsed={sidebarCollapsed}
            onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
          
          {/* Main Content */}
          <main className="p-6 bg-gray-50 min-h-[calc(100vh-80px)]">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
