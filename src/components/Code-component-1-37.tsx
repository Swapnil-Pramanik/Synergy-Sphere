import React from 'react'
import { Calendar, Users, MoreHorizontal } from 'lucide-react'
import { Card, CardContent, CardHeader } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

interface ProjectCardProps {
  id: string
  title: string
  description: string
  status: 'active' | 'completed' | 'pending' | 'in-progress'
  progress: number
  dueDate: string
  members: {
    id: string
    name: string
    avatar?: string
    initials: string
  }[]
  tasksCompleted: number
  tasksTotal: number
  onClick?: (id: string) => void
}

const statusConfig = {
  active: { label: 'Active', className: 'bg-green-100 text-green-700 border-green-200' },
  completed: { label: 'Completed', className: 'bg-gray-100 text-gray-700 border-gray-200' },
  pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  'in-progress': { label: 'In Progress', className: 'bg-blue-100 text-blue-700 border-blue-200' },
}

export function ProjectCard({ 
  id, 
  title, 
  description, 
  status, 
  progress, 
  dueDate, 
  members, 
  tasksCompleted, 
  tasksTotal,
  onClick 
}: ProjectCardProps) {
  const statusInfo = statusConfig[status]

  return (
    <Card className="hover:shadow-lg transition-all cursor-pointer group" onClick={() => onClick?.(id)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg text-gray-900 mb-1 group-hover:text-green-600 transition-colors">
              {title}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
          </div>
          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status and Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className={statusInfo.className}>
              {statusInfo.label}
            </Badge>
            <span className="text-sm text-gray-600">{progress}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Task Stats */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            {tasksCompleted}/{tasksTotal} tasks completed
          </span>
          <span className="text-gray-500">
            {tasksTotal - tasksCompleted} remaining
          </span>
        </div>

        {/* Members and Due Date */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-400" />
            <div className="flex -space-x-2">
              {members.slice(0, 3).map((member) => (
                <Avatar key={member.id} className="w-6 h-6 border-2 border-white">
                  {member.avatar && <AvatarImage src={member.avatar} />}
                  <AvatarFallback className="text-xs">{member.initials}</AvatarFallback>
                </Avatar>
              ))}
              {members.length > 3 && (
                <div className="w-6 h-6 bg-gray-100 border-2 border-white rounded-full flex items-center justify-center">
                  <span className="text-xs text-gray-600">+{members.length - 3}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>{dueDate}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}