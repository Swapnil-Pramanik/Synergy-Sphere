import React from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

interface LayoutProps {
  children: React.ReactNode
  currentPage: string
}

export function Layout({ children, currentPage }: LayoutProps) {
  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <Sidebar currentPage={currentPage} />
      <div className="flex-1 flex flex-col h-screen">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}