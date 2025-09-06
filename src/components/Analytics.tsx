import React from 'react'
import { TrendingUp, BarChart3, PieChart, Calendar, Users, CheckSquare, AlertCircle, Target } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell } from 'recharts'
import { api } from '../lib/api'

interface AnalyticsData {
  projectProgress: Array<{ name: string; progress: number; status: string }>
  taskCompletion: Array<{ month: string; completed: number; total: number }>
  teamPerformance: Array<{ name: string; tasksCompleted: number; tasksTotal: number; efficiency: number }>
  statusDistribution: Array<{ name: string; value: number; color: string }>
  weeklyTrend: Array<{ week: string; completed: number; created: number }>
}

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6366f1', '#ec4899']

export function Analytics() {
  const [analytics, setAnalytics] = React.useState<AnalyticsData | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [timeRange, setTimeRange] = React.useState('month')

  React.useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      
      // Get projects data
      const projects = await api.get('/api/projects')
      
      // Get all tasks data
      const allTasks: any[] = []
      for (const project of projects) {
        try {
          const tasks = await api.get(`/api/projects/${project.id}/tasks`)
          allTasks.push(...tasks.map((task: any) => ({ ...task, project_name: project.title })))
        } catch (err) {
          console.warn(`Failed to load tasks for project ${project.id}`)
        }
      }

      // Process analytics data
      const projectProgress = projects.map((p: any) => ({
        name: p.title.length > 15 ? p.title.substring(0, 15) + '...' : p.title,
        progress: p.progress || 0,
        status: p.status
      }))

      // Mock task completion trend data
      const taskCompletion = [
        { month: 'Jan', completed: 12, total: 18 },
        { month: 'Feb', completed: 15, total: 22 },
        { month: 'Mar', completed: 20, total: 25 },
        { month: 'Apr', completed: 18, total: 28 },
        { month: 'May', completed: 22, total: 30 },
        { month: 'Jun', completed: 25, total: 32 }
      ]

      // Process team performance (mock data with real task assignments)
      const teamMembers = ['Alex Morgan', 'Sarah Johnson', 'Mike Chen', 'Lisa Park']
      const teamPerformance = teamMembers.map(member => {
        const memberTasks = allTasks.filter(task => task.assignee_name === member)
        const completed = memberTasks.filter(task => task.status === 'done').length
        const total = memberTasks.length
        return {
          name: member,
          tasksCompleted: completed,
          tasksTotal: total,
          efficiency: total > 0 ? Math.round((completed / total) * 100) : 0
        }
      })

      // Status distribution
      const todoCount = allTasks.filter(t => t.status === 'todo').length
      const inProgressCount = allTasks.filter(t => t.status === 'in-progress').length
      const doneCount = allTasks.filter(t => t.status === 'done').length

      const statusDistribution = [
        { name: 'Completed', value: doneCount, color: '#10b981' },
        { name: 'In Progress', value: inProgressCount, color: '#f59e0b' },
        { name: 'To Do', value: todoCount, color: '#6b7280' }
      ].filter(item => item.value > 0)

      // Weekly trend (mock data)
      const weeklyTrend = [
        { week: 'Week 1', completed: 8, created: 10 },
        { week: 'Week 2', completed: 12, created: 8 },
        { week: 'Week 3', completed: 15, created: 12 },
        { week: 'Week 4', completed: 10, created: 15 }
      ]

      setAnalytics({
        projectProgress,
        taskCompletion,
        teamPerformance,
        statusDistribution,
        weeklyTrend
      })
      
    } catch (err: any) {
      setError(err.message || 'Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl text-gray-900">Analytics</h1>
        </div>
        <div className="text-gray-600">Loading analytics...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl text-gray-900">Analytics</h1>
        </div>
        <div className="text-red-600">Error: {error}</div>
      </div>
    )
  }

  if (!analytics) return null

  const totalTasks = analytics.statusDistribution.reduce((sum, item) => sum + item.value, 0)
  const completedTasks = analytics.statusDistribution.find(item => item.name === 'Completed')?.value || 0
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900">Analytics</h1>
          <p className="text-gray-600">Track team performance and project insights</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-2xl font-semibold text-green-600">{completionRate}%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tasks</p>
                <p className="text-2xl font-semibold text-gray-900">{totalTasks}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckSquare className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Projects</p>
                <p className="text-2xl font-semibold text-purple-600">{analytics.projectProgress.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Team Members</p>
                <p className="text-2xl font-semibold text-orange-600">{analytics.teamPerformance.length}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Project Progress Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Project Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.projectProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => [`${value}%`, 'Progress']}
                  labelFormatter={(label: string) => `Project: ${label}`}
                />
                <Bar dataKey="progress" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Task Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="w-5 h-5 mr-2" />
              Task Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <RechartsPieChart 
                  data={analytics.statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {analytics.statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </RechartsPieChart>
                <Tooltip formatter={(value: any) => [`${value} tasks`, 'Count']} />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="flex justify-center mt-4">
              <div className="flex flex-wrap gap-4">
                {analytics.statusDistribution.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-600">{item.name} ({item.value})</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Task Completion Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Task Completion Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.taskCompletion}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  name="Completed"
                />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#6b7280" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#6b7280', strokeWidth: 2, r: 3 }}
                  name="Total"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Weekly Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill="#10b981" name="Completed" />
                <Bar dataKey="created" fill="#f59e0b" name="Created" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Team Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Team Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {analytics.teamPerformance.map((member) => (
              <div key={member.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-medium">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{member.name}</h4>
                    <p className="text-sm text-gray-500">
                      {member.tasksCompleted} of {member.tasksTotal} tasks completed
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-24">
                    <Progress value={member.efficiency} className="h-2" />
                  </div>
                  <Badge 
                    variant="outline" 
                    className={
                      member.efficiency >= 80 
                        ? 'border-green-200 bg-green-50 text-green-800'
                        : member.efficiency >= 60 
                        ? 'border-yellow-200 bg-yellow-50 text-yellow-800'
                        : 'border-red-200 bg-red-50 text-red-800'
                    }
                  >
                    {member.efficiency}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-800">
            <AlertCircle className="w-5 h-5 mr-2" />
            Key Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm">
            <p className="text-blue-800 mb-1">📈 Overall Performance</p>
            <p className="text-blue-700">
              Your team has a {completionRate}% task completion rate this month. 
              {completionRate >= 80 ? ' Excellent work!' : completionRate >= 60 ? ' Good progress, keep it up!' : ' There\'s room for improvement.'}
            </p>
          </div>
          
          {analytics.teamPerformance.length > 0 && (
            <div className="text-sm">
              <p className="text-blue-800 mb-1">🏆 Top Performer</p>
              <p className="text-blue-700">
                {analytics.teamPerformance.reduce((prev, current) => 
                  prev.efficiency > current.efficiency ? prev : current
                ).name} is leading with the highest completion rate this period.
              </p>
            </div>
          )}
          
          <div className="text-sm">
            <p className="text-blue-800 mb-1">📅 Trend Analysis</p>
            <p className="text-blue-700">
              Task completion has been {analytics.taskCompletion.length >= 2 && 
              analytics.taskCompletion[analytics.taskCompletion.length - 1].completed > 
              analytics.taskCompletion[analytics.taskCompletion.length - 2].completed 
                ? 'increasing' : 'stable'} over the past few months.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
