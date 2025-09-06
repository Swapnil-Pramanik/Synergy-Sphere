import React from 'react'
import { FolderOpen, CheckSquare, Clock, Users, Brain, TrendingUp, Plus } from 'lucide-react'
import { StatCard } from './StatCard'
import { ProjectCard } from './ProjectCard'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'

interface DashboardProps {
  onProjectClick: (projectId: string) => void
}

// Mock data
const stats = [
  { title: 'Active Projects', value: 8, icon: FolderOpen, color: 'green' as const, trend: { value: '12%', isPositive: true } },
  { title: 'Total Tasks', value: 156, icon: CheckSquare, color: 'blue' as const, trend: { value: '8%', isPositive: true } },
  { title: 'Completed Tasks', value: 89, icon: Clock, color: 'purple' as const, trend: { value: '23%', isPositive: true } },
  { title: 'Team Members', value: 24, icon: Users, color: 'orange' as const, trend: { value: '4%', isPositive: true } },
]

const projects = [
  {
    id: '1',
    title: 'Website Redesign',
    description: 'Complete overhaul of company website with modern design and improved UX',
    status: 'active' as const,
    progress: 75,
    dueDate: 'Jan 15',
    tasksCompleted: 12,
    tasksTotal: 16,
    members: [
      { id: '1', name: 'Alex Morgan', initials: 'AM' },
      { id: '2', name: 'Sarah Johnson', initials: 'SJ' },
      { id: '3', name: 'Mike Chen', initials: 'MC' },
    ]
  },
  {
    id: '2',
    title: 'Mobile App Development',
    description: 'Cross-platform mobile application for iOS and Android',
    status: 'in-progress' as const,
    progress: 45,
    dueDate: 'Feb 28',
    tasksCompleted: 9,
    tasksTotal: 20,
    members: [
      { id: '4', name: 'Emma Davis', initials: 'ED' },
      { id: '5', name: 'James Wilson', initials: 'JW' },
      { id: '6', name: 'Lisa Park', initials: 'LP' },
      { id: '7', name: 'Tom Brown', initials: 'TB' },
    ]
  },
  {
    id: '3',
    title: 'Brand Identity Refresh',
    description: 'New logo, color palette, and brand guidelines for 2024',
    status: 'pending' as const,
    progress: 20,
    dueDate: 'Mar 10',
    tasksCompleted: 3,
    tasksTotal: 15,
    members: [
      { id: '8', name: 'Ryan Taylor', initials: 'RT' },
      { id: '9', name: 'Sophie Lee', initials: 'SL' },
    ]
  },
  {
    id: '4',
    title: 'Customer Support Portal',
    description: 'Self-service portal with knowledge base and ticket system',
    status: 'completed' as const,
    progress: 100,
    dueDate: 'Dec 15',
    tasksCompleted: 22,
    tasksTotal: 22,
    members: [
      { id: '10', name: 'David Kim', initials: 'DK' },
      { id: '11', name: 'Anna White', initials: 'AW' },
      { id: '12', name: 'Chris Green', initials: 'CG' },
    ]
  }
]

export function Dashboard({ onProjectClick }: DashboardProps) {
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl mb-2">Welcome back, Alex! 👋</h1>
            <p className="text-green-100 text-lg">
              You have 8 active projects and 67 pending tasks. Keep up the great work!
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
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>
          <div className="grid gap-6">
            {projects.map((project) => (
              <ProjectCard 
                key={project.id} 
                {...project} 
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
              <Button variant="outline" className="w-full justify-start">
                <Plus className="w-4 h-4 mr-2" />
                Create New Task
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Invite Team Member
              </Button>
              <Button variant="outline" className="w-full justify-start">
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