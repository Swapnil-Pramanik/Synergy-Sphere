import React from 'react'
import { Plus } from 'lucide-react'
import { TaskCard } from './TaskCard'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

interface Task {
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
}

interface KanbanBoardProps {
  tasks: Task[]
  onTaskClick?: (taskId: string) => void
  onNewTask?: (status: Task['status']) => void
}

const columns = [
  { id: 'todo', title: 'To Do', color: 'bg-gray-100' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-blue-100' },
  { id: 'done', title: 'Done', color: 'bg-green-100' },
] as const

export function KanbanBoard({ tasks, onTaskClick, onNewTask }: KanbanBoardProps) {
  const getTasksByStatus = (status: Task['status']) => 
    tasks.filter(task => task.status === status)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {columns.map((column) => {
        const columnTasks = getTasksByStatus(column.id)
        
        return (
          <Card key={column.id} className="h-fit">
            <CardHeader className={`${column.color} rounded-t-lg`}>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {column.title}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <span className="bg-white px-2 py-1 rounded-full text-sm">
                    {columnTasks.length}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onNewTask?.(column.id)}
                    className="hover:bg-white/50"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {columnTasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="mb-2">No tasks in {column.title.toLowerCase()}</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onNewTask?.(column.id)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Task
                  </Button>
                </div>
              ) : (
                columnTasks.map((task) => (
                  <TaskCard 
                    key={task.id} 
                    {...task} 
                    onClick={onTaskClick}
                  />
                ))
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}