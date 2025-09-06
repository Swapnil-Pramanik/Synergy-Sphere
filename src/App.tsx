import React from 'react'
import { Layout } from './components/Layout'
import { LoginScreen } from './components/LoginScreen'
import { Dashboard } from './components/Dashboard'
import { ProjectDetail } from './components/ProjectDetail'
import { TaskModal } from './components/TaskModal'
import { Tasks } from './components/Tasks'
import { Calendar } from './components/Calendar'
import { Analytics } from './components/Analytics'
import { Team } from './components/Team'
import { Settings } from './components/Settings'
import { ToastProvider } from './components/ui/toast'
import { api } from './lib/api'

interface User {
  id: number
  name: string
  email: string
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(() => !!localStorage.getItem('token'))
  const [user, setUser] = React.useState<User | null>(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })
  const [currentPage, setCurrentPage] = React.useState('dashboard')
  const [selectedProjectId, setSelectedProjectId] = React.useState<string | null>(null)
  const [taskModalOpen, setTaskModalOpen] = React.useState(false)
  const [selectedTaskId, setSelectedTaskId] = React.useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = React.useState(0)

  const handleLogin = (userData: User, token: string) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setIsLoggedIn(false)
    setCurrentPage('dashboard')
    setSelectedProjectId(null)
  }

  const handleNavigate = (page: string) => {
    setCurrentPage(page)
    if (page !== 'project-detail') {
      setSelectedProjectId(null)
    }
  }

  const handleProjectClick = (projectId: string) => {
    setSelectedProjectId(projectId)
    setCurrentPage('project-detail')
  }

  const handleBackToDashboard = () => {
    setSelectedProjectId(null)
    setCurrentPage('dashboard')
  }

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId)
    setTaskModalOpen(true)
  }

  const handleTaskSave = async (task: any) => {
    try {
      // Task creation/update will be handled in the TaskModal component
      setTaskModalOpen(false)
      setSelectedTaskId(null)
      setRefreshTrigger(prev => prev + 1) // Trigger refresh
    } catch (error) {
      console.error('Error saving task:', error)
    }
  }

  const handleCreateTask = () => {
    setSelectedTaskId(null)
    // Use the first project ID if available, otherwise null
    setSelectedProjectId('1') // Default to first project for now
    setTaskModalOpen(true)
  }

  const handleCreateProject = async () => {
    try {
      const projectName = prompt('Enter project name:')
      if (!projectName) return
      
      const projectData = {
        title: projectName,
        description: 'New project created from dashboard',
        status: 'active',
        progress: 0
      }
      
      await api.post('/api/projects', projectData)
      setRefreshTrigger(prev => prev + 1) // Trigger refresh
    } catch (error: any) {
      console.error('Error creating project:', error)
      alert(error.message || 'Failed to create project')
    }
  }

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard 
            onProjectClick={handleProjectClick} 
            onCreateTask={handleCreateTask}
            onCreateProject={handleCreateProject}
            refreshTrigger={refreshTrigger}
          />
        )
      case 'tasks':
        return <Tasks onTaskClick={handleTaskClick} />
      case 'calendar':
        return <Calendar />
      case 'analytics':
        return <Analytics />
      case 'team':
        return <Team />
      case 'settings':
        return <Settings user={user} />
      case 'project-detail':
        return (
          <ProjectDetail 
            projectId={selectedProjectId!}
            onBack={handleBackToDashboard}
            onTaskClick={handleTaskClick}
          />
        )
      default:
        return <Dashboard onProjectClick={handleProjectClick} />
    }
  }

  return (
    <ToastProvider>
      <Layout 
        currentPage={currentPage} 
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        user={user}
      >
        {renderContent()}
      </Layout>
      
      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => {
          setTaskModalOpen(false)
          setSelectedTaskId(null)
        }}
        onSave={handleTaskSave}
        taskId={selectedTaskId}
        projectId={selectedProjectId}
      />
    </ToastProvider>
  )
}
