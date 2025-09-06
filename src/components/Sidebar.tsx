import React from 'react'
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  BarChart3, 
  Users, 
  Settings, 
  HelpCircle, 
  LogOut,
  Zap
} from 'lucide-react'
import { Button } from './ui/button'

interface SidebarProps {
  currentPage: string
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'team', label: 'Team', icon: Users },
]

const bottomItems = [
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'help', label: 'Help', icon: HelpCircle },
  { id: 'logout', label: 'Logout', icon: LogOut },
]

export function Sidebar({ currentPage }: SidebarProps) {
  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl text-gray-900">SynergySphere</h1>
            <p className="text-sm text-gray-500">Team Workspace</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 flex flex-col justify-between overflow-hidden">
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant={currentPage === item.id ? "secondary" : "ghost"}
                className={`w-full justify-start ${
                  currentPage === item.id 
                    ? 'bg-green-50 text-green-700 border-green-200' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Button>
            )
          })}
        </div>

        <div>
          {/* Divider */}
          <div className="mb-6 border-t border-gray-200" />

          {/* Bottom Items */}
          <div className="space-y-2">
            {bottomItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  className="w-full justify-start text-gray-700 hover:bg-gray-50"
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Button>
              )
            })}
          </div>
        </div>
      </nav>
    </div>
  )
}