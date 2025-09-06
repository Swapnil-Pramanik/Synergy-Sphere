import React from 'react'
import { Calendar, User, Clock, MoreHorizontal } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'

interface TaskCardProps {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in-progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  assignee: {
    id: string
    name: string
    avatar?: string
    initials: string
  }
  dueDate: string
  project: string
  onClick?: (id: string) => void
}

const priorityConfig = {
  low: { className: 'bg-blue-100 text-blue-700 border-blue-200' },
  medium: { className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  high: { className: 'bg-red-100 text-red-700 border-red-200' },
}

const statusConfig = {
  todo: { className: 'bg-gray-100 text-gray-700 border-gray-200' },
  'in-progress': { className: 'bg-blue-100 text-blue-700 border-blue-200' },
  done: { className: 'bg-green-100 text-green-700 border-green-200' },
}

export function TaskCard({ 
  id, 
  title, 
  description, 
  status, 
  priority, 
  assignee, 
  dueDate, 
  project,
  onClick 
}: TaskCardProps) {
  const priorityInfo = priorityConfig[priority]
  const statusInfo = statusConfig[status]

  return (
    <Card 
      className="hover:shadow-md transition-all cursor-pointer group border-l-4 border-l-green-600" 
      onClick={() => onClick?.(id)}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="text-gray-900 mb-1 group-hover:text-green-600 transition-colors">
              {title}
            </h4>
            {description && (
              <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className={priorityInfo.className}>
            {priority}
          </Badge>
          <Badge variant="outline" className={statusInfo.className}>
            {status.replace('-', ' ')}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Avatar className="w-6 h-6">
              {assignee.avatar && <AvatarImage src={assignee.avatar} />}
              <AvatarFallback className="text-xs">{assignee.initials}</AvatarFallback>
            </Avatar>
            <span className="text-gray-600">{assignee.name}</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>{dueDate}</span>
          </div>
        </div>

        <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
          Project: {project}
        </div>
      </CardContent>
    </Card>
  )
}