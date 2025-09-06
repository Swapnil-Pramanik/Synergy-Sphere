import React from 'react'
import { ArrowLeft, Calendar, Users, MessageCircle, BarChart3, Brain, Settings } from 'lucide-react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { KanbanBoard } from './KanbanBoard'
import { api } from '../lib/api'

interface ProjectDetailProps {
  projectId: string
  onBack: () => void
  onTaskClick?: (taskId: string) => void
}

// Dynamic project/tasks will be fetched from backend

const statusConfig = {
  active: { label: 'Active', className: 'bg-green-100 text-green-700 border-green-200' },
  completed: { label: 'Completed', className: 'bg-gray-100 text-gray-700 border-gray-200' },
  pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
}

export function ProjectDetail({ projectId, onBack, onTaskClick }: ProjectDetailProps) {
  const [project, setProject] = React.useState<any | null>(null)
  const [tasks, setTasks] = React.useState<any[]>([])
  const [discussions, setDiscussions] = React.useState<any[]>([])
  const [newMessage, setNewMessage] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let mounted = true
    async function load() {
      try {
        setLoading(true)
        const [pr, tk, ds] = await Promise.all([
          api.get(`/api/projects/${projectId}`),
          api.get(`/api/projects/${projectId}/tasks`),
          api.get(`/api/projects/${projectId}/discussions`),
        ])
        if (mounted) { setProject(pr); setTasks(tk); setDiscussions(ds) }
      } catch (e: any) {
        if (mounted) setError(e.message)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [projectId])
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl text-gray-900">{project?.title || 'Project'}</h1>
              <p className="text-gray-600 mt-1">{project?.description || ''}</p>
            </div>
            <Button variant="ghost">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Project Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className={project ? statusConfig[project.status as keyof typeof statusConfig]?.className : 'bg-gray-100 text-gray-700 border-gray-200'}>
                {project ? statusConfig[project.status as keyof typeof statusConfig]?.label : 'Pending'}
              </Badge>
              <span className="text-sm text-gray-600">{project?.progress ?? 0}% Complete</span>
            </div>
            <Progress value={project?.progress ?? 0} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar className="w-5 h-5" />
              <div>
                <p className="text-sm">Due Date</p>
                <p className="text-gray-900">{project?.due_date ? new Date(project.due_date).toDateString() : '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <Users className="w-5 h-5" />
              <div>
                <p className="text-sm">Team Members</p>
                <p className="text-gray-900">{project?.members?.length ?? 0} members</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-gray-600">
              <p className="text-sm">Tasks Progress</p>
              <p className="text-gray-900">{project?.tasksCompleted ?? 0}/{project?.tasksTotal ?? 0} completed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-800">
            <Brain className="w-5 h-5 mr-2" />
            AI Project Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-800">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium mb-1">📊 Progress Analysis</p>
              <p className="text-blue-700">Project is 75% complete and on track for the January deadline.</p>
            </div>
            <div>
              <p className="font-medium mb-1">⚠️ Risk Assessment</p>
              <p className="text-blue-700">User Authentication System may need additional time - consider extending deadline by 2 days.</p>
            </div>
            <div>
              <p className="font-medium mb-1">💡 Optimization Suggestion</p>
              <p className="text-blue-700">Mike Chen has capacity to take on mobile testing task earlier to optimize timeline.</p>
            </div>
            <div>
              <p className="font-medium mb-1">🎯 Next Priority</p>
              <p className="text-blue-700">Focus on completing authentication system before moving to content management.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="tasks" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto">
          <TabsTrigger value="tasks">Task Board</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="discussions">Discussions</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks">
          {loading && <div className="text-gray-600">Loading tasks...</div>}
          {error && <div className="text-red-600">{error}</div>}
          {!loading && !error && (
            <KanbanBoard 
              tasks={tasks.map(t => ({
                id: String(t.id),
                title: t.title,
                description: t.description,
                status: t.status,
                priority: t.priority,
                assignee: t.assignee_user_id ? { id: String(t.assignee_user_id), name: t.assignee_name || 'User', initials: (t.assignee_name||'U').split(' ').map((s:string)=>s[0]).join('').slice(0,2) } : undefined,
                dueDate: t.due_date ? new Date(t.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '',
                project: project?.title || ''
              }))}
              onTaskClick={onTaskClick}
              onNewTask={(status) => console.log('Create new task with status:', status)}
            />
          )}
        </TabsContent>

        <TabsContent value="team">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {project?.members?.map((member: any) => (
              <Card key={member.id}>
                <CardContent className="p-6 text-center">
                  <Avatar className="w-16 h-16 mx-auto mb-4">
                    <AvatarFallback className="text-lg">{(member.name || 'U').split(' ').map((s:string)=>s[0]).join('').slice(0,2)}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{member.role || 'Member'}</p>
                  <Badge variant="outline" className="text-xs">
                    {Math.floor(Math.random() * 3 + 1)} tasks assigned
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="discussions">
          <Card>
            <CardHeader>
              <CardTitle>Project Discussions</CardTitle>
              <CardDescription>Team communication and updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* AI Summary placeholder */}
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-2">
                    <Brain className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-yellow-800 font-medium">Recent activity</p>
                      <p className="text-sm text-yellow-700 mt-1">
                        {discussions.length} message{discussions.length !== 1 ? 's' : ''} in this project.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Messages from API */}
              <div className="space-y-4">
                {discussions.map((msg:any) => (
                  <div key={msg.id} className="flex space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>{(msg.user_name||'U').split(' ').map((s:string)=>s[0]).join('').slice(0,2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-900">{msg.user_name}</span>
                        <span className="text-xs text-gray-500">{new Date(msg.created_at).toLocaleString()}</span>
                      </div>
                      <p className="text-gray-700 mt-1">{msg.message}</p>
                    </div>
                  </div>
                ))}
                {discussions.length === 0 && (
                  <div className="text-gray-600">No messages yet. Be the first to say hello!</div>
                )}
              </div>

              {/* Message input */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex space-x-2">
                    <input 
                      type="text" 
                      placeholder="Type your message..." 
                      value={newMessage}
                      onChange={e=>setNewMessage(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={async ()=>{
                        if (!newMessage.trim()) return;
                        try {
                          const created = await api.post(`/api/projects/${projectId}/discussions`, { message: newMessage.trim() })
                          setDiscussions([created, ...discussions])
                          setNewMessage('')
                        } catch (e) {
                          console.error(e)
                        }
                      }}
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}