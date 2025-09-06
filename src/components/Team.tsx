import React from 'react'
import { Users, UserPlus, Mail, Phone, MoreVertical, Crown, Shield, User, Calendar, CheckSquare, AlertCircle } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Input } from './ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { api } from '../lib/api'

interface TeamMember {
  id: number
  name: string
  email: string
  role?: string
  avatar?: string
  status: 'active' | 'inactive' | 'busy'
  tasksTotal: number
  tasksCompleted: number
  joinedDate: string
  lastActive: string
}

export function Team() {
  const [members, setMembers] = React.useState<TeamMember[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [inviteModalOpen, setInviteModalOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')

  React.useEffect(() => {
    loadTeamData()
  }, [])

  const loadTeamData = async () => {
    try {
      setLoading(true)
      
      // Get all projects to find team members
      const projects = await api.get('/api/projects')
      const memberMap = new Map<number, TeamMember>()
      
      // Get all unique team members from projects
      for (const project of projects) {
        try {
          const projectDetail = await api.get(`/api/projects/${project.id}`)
          if (projectDetail.members) {
            projectDetail.members.forEach((member: any) => {
              if (!memberMap.has(member.id)) {
                memberMap.set(member.id, {
                  id: member.id,
                  name: member.name,
                  email: `${member.name.toLowerCase().replace(' ', '.')}@synergysphere.com`,
                  role: member.role || 'Member',
                  status: Math.random() > 0.3 ? 'active' : Math.random() > 0.5 ? 'busy' : 'inactive',
                  tasksTotal: 0,
                  tasksCompleted: 0,
                  joinedDate: '2024-01-15', // Mock data
                  lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
                })
              }
            })
          }
        } catch (err) {
          console.warn(`Failed to load project ${project.id} details`)
        }
      }

      // Get task counts for each member
      const allTasks: any[] = []
      for (const project of projects) {
        try {
          const tasks = await api.get(`/api/projects/${project.id}/tasks`)
          allTasks.push(...tasks)
        } catch (err) {
          console.warn(`Failed to load tasks for project ${project.id}`)
        }
      }

      // Update task counts
      memberMap.forEach((member) => {
        const memberTasks = allTasks.filter(task => task.assignee_name === member.name)
        member.tasksTotal = memberTasks.length
        member.tasksCompleted = memberTasks.filter(task => task.status === 'done').length
      })

      // Add some default team members if none found
      if (memberMap.size === 0) {
        const defaultMembers = [
          { id: 1, name: 'Alex Morgan', role: 'Project Manager', status: 'active' },
          { id: 2, name: 'Sarah Johnson', role: 'UI Designer', status: 'active' },
          { id: 3, name: 'Mike Chen', role: 'Frontend Developer', status: 'busy' },
          { id: 4, name: 'Lisa Park', role: 'Backend Developer', status: 'active' },
        ]

        defaultMembers.forEach(member => {
          const memberTasks = allTasks.filter(task => task.assignee_name === member.name)
          memberMap.set(member.id, {
            ...member,
            email: `${member.name.toLowerCase().replace(' ', '.')}@synergysphere.com`,
            tasksTotal: memberTasks.length,
            tasksCompleted: memberTasks.filter(task => task.status === 'done').length,
            joinedDate: '2024-01-15',
            lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          } as TeamMember)
        })
      }

      setMembers(Array.from(memberMap.values()))
    } catch (err: any) {
      setError(err.message || 'Failed to load team data')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'busy':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <div className="w-2 h-2 bg-green-500 rounded-full" />
      case 'busy':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full" />
      case 'inactive':
        return <div className="w-2 h-2 bg-gray-500 rounded-full" />
      default:
        return <div className="w-2 h-2 bg-gray-500 rounded-full" />
    }
  }

  const getRoleIcon = (role: string) => {
    if (role?.toLowerCase().includes('manager')) {
      return <Crown className="w-4 h-4 text-yellow-600" />
    } else if (role?.toLowerCase().includes('lead')) {
      return <Shield className="w-4 h-4 text-blue-600" />
    }
    return <User className="w-4 h-4 text-gray-600" />
  }

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl text-gray-900">Team</h1>
        </div>
        <div className="text-gray-600">Loading team data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl text-gray-900">Team</h1>
        </div>
        <div className="text-red-600">Error: {error}</div>
      </div>
    )
  }

  const activeMembers = members.filter(m => m.status === 'active').length
  const totalTasks = members.reduce((sum, m) => sum + m.tasksTotal, 0)
  const completedTasks = members.reduce((sum, m) => sum + m.tasksCompleted, 0)
  const avgCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900">Team</h1>
          <p className="text-gray-600">Manage your team members and their roles</p>
        </div>
        
        <Dialog open={inviteModalOpen} onOpenChange={setInviteModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <UserPlus className="w-4 h-4 mr-2" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" placeholder="Enter email address" type="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="designer">Designer</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setInviteModalOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  Send Invite
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Members</p>
                <p className="text-2xl font-semibold text-gray-900">{members.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Members</p>
                <p className="text-2xl font-semibold text-green-600">{activeMembers}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckSquare className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tasks</p>
                <p className="text-2xl font-semibold text-purple-600">{totalTasks}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-2xl font-semibold text-orange-600">{avgCompletionRate}%</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <Input
            placeholder="Search team members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      {/* Team Members Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <Card key={member.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="bg-gradient-to-br from-green-400 to-green-600 text-white">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">{member.name}</h3>
                      {getStatusIcon(member.status)}
                    </div>
                    <p className="text-sm text-gray-500">{member.email}</p>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Mail className="w-4 h-4 mr-2" />
                      Send Message
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CheckSquare className="w-4 h-4 mr-2" />
                      Assign Task
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Calendar className="w-4 h-4 mr-2" />
                      View Schedule
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getRoleIcon(member.role || '')}
                    <span className="text-sm font-medium text-gray-700">{member.role}</span>
                  </div>
                  <Badge variant="outline" className={getStatusColor(member.status)}>
                    {member.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Tasks Completed</p>
                    <p className="font-semibold">
                      {member.tasksCompleted} / {member.tasksTotal}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Success Rate</p>
                    <p className="font-semibold">
                      {member.tasksTotal > 0 
                        ? Math.round((member.tasksCompleted / member.tasksTotal) * 100) 
                        : 0}%
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 text-xs text-gray-500 space-y-1">
                  <div>Joined: {new Date(member.joinedDate).toLocaleDateString()}</div>
                  <div>Last active: {new Date(member.lastActive).toLocaleDateString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No team members found matching your search.</p>
          </CardContent>
        </Card>
      )}

      {/* Team Activities (Recent) */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Team Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-green-100 text-green-700">SJ</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">Sarah Johnson</span> completed the "Homepage Layout" task
                </p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-blue-100 text-blue-700">MC</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">Mike Chen</span> started working on "Navigation Menu"
                </p>
                <p className="text-xs text-gray-500">4 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-purple-100 text-purple-700">LP</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">Lisa Park</span> was assigned to "User Authentication System"
                </p>
                <p className="text-xs text-gray-500">6 hours ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
