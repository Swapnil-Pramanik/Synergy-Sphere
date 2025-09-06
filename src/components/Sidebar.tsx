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
  Zap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Button } from './ui/button'

interface SidebarProps {
  currentPage: string
  onNavigate: (page: string) => void
  onLogout: () => void
  collapsed?: boolean
  onToggleCollapse?: () => void
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

export function Sidebar({ currentPage, onNavigate, onLogout, collapsed = false, onToggleCollapse }: SidebarProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Logo Section */}
      <div className={`${collapsed ? 'p-4' : 'p-6'} border-b border-gray-200 flex-shrink-0`}>
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} relative group`}>
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-xl font-semibold text-gray-900">SynergySphere</h1>
              <p className="text-sm text-gray-500">Team Workspace</p>
            </div>
          )}
          
          {/* Logo tooltip when collapsed */}
          {collapsed && (
            <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-out whitespace-nowrap z-50 pointer-events-none">
              SynergySphere
              {/* Arrow pointing to the logo */}
              <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4 border-r-gray-900"></div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 flex flex-col justify-between">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            
            return (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`
                    w-full flex items-center 
                    ${collapsed ? 'justify-center p-3' : 'justify-start px-3 py-2.5'} 
                    rounded-lg transition-all duration-200 
                    ${isActive 
                      ? 'bg-green-100 text-green-700 shadow-sm' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className={`w-5 h-5 ${collapsed ? '' : 'mr-3'} flex-shrink-0`} />
                  {!collapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </button>
                
                {/* Tooltip for collapsed state */}
                {collapsed && (
                  <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-300 ease-out whitespace-nowrap z-50 pointer-events-none">
                    {item.label}
                    {/* Arrow pointing to the button */}
                    <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4 border-r-gray-900"></div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div>
          {/* Divider */}
          <div className="mb-4 border-t border-gray-200" />

          {/* Bottom Items */}
          <div className="space-y-1">
            {bottomItems.map((item) => {
              const Icon = item.icon
              const isLogout = item.id === 'logout'
              
              return (
                <div key={item.id} className="relative group">
                  <button
                    onClick={() => item.id === 'logout' ? onLogout() : onNavigate(item.id)}
                    className={`
                      w-full flex items-center 
                      ${collapsed ? 'justify-center p-3' : 'justify-start px-3 py-2.5'} 
                      rounded-lg transition-all duration-200 
                      ${isLogout 
                        ? 'text-gray-700 hover:bg-red-50 hover:text-red-600' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }
                    `}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className={`w-5 h-5 ${collapsed ? '' : 'mr-3'} flex-shrink-0`} />
                    {!collapsed && (
                      <span className="text-sm font-medium">{item.label}</span>
                    )}
                  </button>
                  
                  {/* Tooltip for collapsed state */}
                  {collapsed && (
                    <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-300 ease-out whitespace-nowrap z-50 pointer-events-none">
                      {item.label}
                      {/* Arrow pointing to the button */}
                      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4 border-r-gray-900"></div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </nav>
    </div>
  )
}