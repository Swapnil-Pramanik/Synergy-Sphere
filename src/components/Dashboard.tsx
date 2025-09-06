import React from 'react'
import { FolderOpen, CheckSquare, Clock, Users, Brain, TrendingUp, Plus } from 'lucide-react'
import { StatCard } from './StatCard'
import { ProjectCard } from './ProjectCard'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { api } from '../lib/api'

interface DashboardProps {
  onProjectClick: (projectId: string) => void
  onCreateTask?: () => void
  onCreateProject?: () => void
  onNavigate?: (page: string) => void
  refreshTrigger?: number
}

// Dynamic stats from API
const defaultStats = [
  { title: 'Active Projects', key: 'activeProjects', value: 0, icon: FolderOpen, color: 'green' as const, trend: { value: '', isPositive: true } },
  { title: 'Total Tasks', key: 'totalTasks', value: 0, icon: CheckSquare, color: 'blue' as const, trend: { value: '', isPositive: true } },
  { title: 'Completed Tasks', key: 'completedTasks', value: 0, icon: Clock, color: 'purple', trend: { value: '', isPositive: true } },
  { title: 'Team Members', key: 'teamMembers', value: 0, icon: Users, color: 'orange', trend: { value: '', isPositive: true } },
]

export function Dashboard({ onProjectClick, onCreateTask, onCreateProject, onNavigate, refreshTrigger = 0 }: DashboardProps) {
  // Dynamic projects from API
  const [projects, setProjects] = React.useState<any[]>([])
  const [stats, setStats] = React.useState<any[]>(defaultStats)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let mounted = true
    async function load() {
      try {
        setLoading(true)
        const [projectsData, statsData] = await Promise.all([
          api.get('/api/projects'),
          api.get('/api/stats/overview')
        ])
        if (mounted) {
          setProjects(projectsData)
          setStats(defaultStats.map(s => ({ ...s, value: statsData[s.key] ?? 0 })))
        }
      } catch (e: any) {
        if (mounted) setError(e.message)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [refreshTrigger])
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl mb-2">Welcome back! 👋</h1>
            <p className="text-green-100 text-lg">
              You have {stats.find(s=>s.key==='activeProjects')?.value ?? 0} active projects and {(stats.find(s=>s.key==='totalTasks')?.value ?? 0) - (stats.find(s=>s.key==='completedTasks')?.value ?? 0)} pending tasks. Keep up the great work!
            </p>
          </div>
          <div className="hidden lg:block">
            <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
              <TrendingUp className="w-16 h-16 text-white/80" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div>
        <h2 className="text-xl text-gray-900 mb-6">Quick Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>
      </div>

      {/* AI Insights Widget */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl text-gray-900">Your Projects</h2>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={onCreateProject}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>
          <div className="grid gap-6">
            {loading && <div className="text-gray-600">Loading projects...</div>}
            {error && <div className="text-red-600">{error}</div>}
            {!loading && !error && projects.map((project) => (
              <ProjectCard 
                key={project.id}
                id={String(project.id)}
                title={project.title}
                description={project.description}
                status={project.status}
                progress={project.progress}
                dueDate={project.due_date ? new Date(project.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ''}
                tasksCompleted={project.tasksCompleted || 0}
                tasksTotal={project.tasksTotal || 0}
                members={[]}
                onClick={onProjectClick}
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {/* AI Insights */}
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center text-yellow-800">
                <Brain className="w-5 h-5 mr-2" />
                AI Insights
              </CardTitle>
              <CardDescription className="text-yellow-700">
                Smart recommendations for your workflow
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <p className="text-yellow-800 mb-1">⚠️ 2 tasks at risk of delay</p>
                <p className="text-yellow-700">Website Redesign and Mobile App have approaching deadlines.</p>
              </div>
              <div className="text-sm">
                <p className="text-yellow-800 mb-1">💡 Suggested optimization</p>
                <p className="text-yellow-700">Consider reallocating resources from completed projects.</p>
              </div>
              <div className="text-sm">
                <p className="text-yellow-800 mb-1">📈 Team performance</p>
                <p className="text-yellow-700">Sarah and Mike are ahead of schedule this week!</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={onCreateTask}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Task
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => onNavigate?.('team')}
              >
                <Users className="w-4 h-4 mr-2" />
                Invite Team Member
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => onNavigate?.('analytics')}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}