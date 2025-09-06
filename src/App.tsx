import React from 'react'
import { Layout } from './components/Layout'
import { LoginScreen } from './components/LoginScreen'
import { Dashboard } from './components/Dashboard'
import { ProjectDetail } from './components/ProjectDetail'
import { TaskModal } from './components/TaskModal'

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false)
  const [currentPage, setCurrentPage] = React.useState('dashboard')
  const [selectedProjectId, setSelectedProjectId] = React.useState<string | null>(null)
  const [taskModalOpen, setTaskModalOpen] = React.useState(false)
  const [selectedTaskId, setSelectedTaskId] = React.useState<string | null>(null)

  const handleLogin = () => {
    setIsLoggedIn(true)
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

  const handleTaskSave = (task: any) => {
    console.log('Saving task:', task)
    // In a real app, this would save to the backend
    setTaskModalOpen(false)
    setSelectedTaskId(null)
  }

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />
  }

  const renderContent = () => {
    switch (currentPage) {
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
    <>
      <Layout currentPage={currentPage}>
        {renderContent()}
      </Layout>
      
      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => {
          setTaskModalOpen(false)
          setSelectedTaskId(null)
        }}
        onSave={handleTaskSave}
        mode={selectedTaskId ? 'edit' : 'create'}
      />
    </>
  )
}