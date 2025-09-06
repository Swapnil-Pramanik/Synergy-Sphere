import React from 'react'
import { ArrowLeft, Calendar, Users, MessageCircle, BarChart3, Brain, Settings } from 'lucide-react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { KanbanBoard } from './KanbanBoard'

interface ProjectDetailProps {
  projectId: string
  onBack: () => void
  onTaskClick?: (taskId: string) => void
}

// Mock project data
const project = {
  id: '1',
  title: 'Website Redesign',
  description: 'Complete overhaul of company website with modern design and improved UX. This project involves redesigning the entire user interface, improving performance, and adding new features.',
  status: 'active' as const,
  progress: 75,
  dueDate: 'January 15, 2024',
  members: [
    { id: '1', name: 'Alex Morgan', role: 'Project Manager', initials: 'AM' },
    { id: '2', name: 'Sarah Johnson', role: 'UI Designer', initials: 'SJ' },
    { id: '3', name: 'Mike Chen', role: 'Frontend Developer', initials: 'MC' },
    { id: '4', name: 'Lisa Park', role: 'Backend Developer', initials: 'LP' },
  ],
  tasksCompleted: 12,
  tasksTotal: 16,
}

// Mock task data
const tasks = [
  {
    id: '1',
    title: 'Design Homepage Layout',
    description: 'Create wireframes and mockups for the new homepage',
    status: 'done' as const,
    priority: 'high' as const,
    assignee: { id: '2', name: 'Sarah Johnson', initials: 'SJ' },
    dueDate: 'Jan 10',
    project: 'Website Redesign'
  },
  {
    id: '2',
    title: 'Implement Navigation Menu',
    description: 'Build responsive navigation with dropdown menus',
    status: 'in-progress' as const,
    priority: 'medium' as const,
    assignee: { id: '3', name: 'Mike Chen', initials: 'MC' },
    dueDate: 'Jan 12',
    project: 'Website Redesign'
  },
  {
    id: '3',
    title: 'User Authentication System',
    description: 'Set up login, signup, and password reset functionality',
    status: 'in-progress' as const,
    priority: 'high' as const,
    assignee: { id: '4', name: 'Lisa Park', initials: 'LP' },
    dueDate: 'Jan 14',
    project: 'Website Redesign'
  },
  {
    id: '4',
    title: 'Content Management Integration',
    description: 'Connect with CMS for dynamic content updates',
    status: 'todo' as const,
    priority: 'medium' as const,
    assignee: { id: '4', name: 'Lisa Park', initials: 'LP' },
    dueDate: 'Jan 16',
    project: 'Website Redesign'
  },
  {
    id: '5',
    title: 'Mobile Responsiveness Testing',
    description: 'Test and optimize for all mobile devices',
    status: 'todo' as const,
    priority: 'low' as const,
    assignee: { id: '3', name: 'Mike Chen', initials: 'MC' },
    dueDate: 'Jan 18',
    project: 'Website Redesign'
  },
]

const statusConfig = {
  active: { label: 'Active', className: 'bg-green-100 text-green-700 border-green-200' },
  completed: { label: 'Completed', className: 'bg-gray-100 text-gray-700 border-gray-200' },
  pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
}

export function ProjectDetail({ projectId, onBack, onTaskClick }: ProjectDetailProps) {
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
              <h1 className="text-2xl text-gray-900">{project.title}</h1>
              <p className="text-gray-600 mt-1">{project.description}</p>
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
              <Badge variant="outline" className={statusConfig[project.status].className}>
                {statusConfig[project.status].label}
              </Badge>
              <span className="text-sm text-gray-600">{project.progress}% Complete</span>
            </div>
            <Progress value={project.progress} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar className="w-5 h-5" />
              <div>
                <p className="text-sm">Due Date</p>
                <p className="text-gray-900">{project.dueDate}</p>
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
                <p className="text-gray-900">{project.members.length} members</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-gray-600">
              <p className="text-sm">Tasks Progress</p>
              <p className="text-gray-900">{project.tasksCompleted}/{project.tasksTotal} completed</p>
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
          <KanbanBoard 
            tasks={tasks} 
            onTaskClick={onTaskClick}
            onNewTask={(status) => console.log('Create new task with status:', status)}
          />
        </TabsContent>

        <TabsContent value="team">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {project.members.map((member) => (
              <Card key={member.id}>
                <CardContent className="p-6 text-center">
                  <Avatar className="w-16 h-16 mx-auto mb-4">
                    <AvatarFallback className="text-lg">{member.initials}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{member.role}</p>
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
              {/* AI Summary */}
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-2">
                    <Brain className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-yellow-800 font-medium">AI Summary of Recent Discussions</p>
                      <p className="text-sm text-yellow-700 mt-1">
                        Last 10 messages focused on authentication implementation challenges. 
                        Team agreed to use OAuth 2.0 for social login integration. 
                        Design review scheduled for tomorrow at 2 PM.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mock messages */}
              <div className="space-y-4">
                <div className="flex space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>SJ</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-900">Sarah Johnson</span>
                      <span className="text-xs text-gray-500">2 hours ago</span>
                    </div>
                    <p className="text-gray-700 mt-1">
                      Just finished the homepage mockups! The new design looks much cleaner. 
                      I've uploaded them to the shared folder. Let me know what you think! 🎨
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>MC</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-900">Mike Chen</span>
                      <span className="text-xs text-gray-500">4 hours ago</span>
                    </div>
                    <p className="text-gray-700 mt-1">
                      Navigation menu is almost complete. Having some issues with the mobile dropdown - 
                      should be resolved by tomorrow. 📱
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>LP</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-900">Lisa Park</span>
                      <span className="text-xs text-gray-500">1 day ago</span>
                    </div>
                    <p className="text-gray-700 mt-1">
                      Started working on the authentication system. Planning to implement OAuth 2.0 
                      for social logins. Any preferences on which providers to support first?
                    </p>
                  </div>
                </div>
              </div>

              {/* Message input */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>AM</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex space-x-2">
                    <input 
                      type="text" 
                      placeholder="Type your message..." 
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
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