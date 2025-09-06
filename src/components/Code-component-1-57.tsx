import React from 'react'
import { Calendar, User, Flag, FileText, X } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Badge } from './ui/badge'

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (task: any) => void
  task?: {
    id?: string
    title: string
    description: string
    status: 'todo' | 'in-progress' | 'done'
    priority: 'low' | 'medium' | 'high'
    assigneeId: string
    dueDate: string
  }
  mode: 'create' | 'edit'
}

const teamMembers = [
  { id: '1', name: 'Alex Morgan', initials: 'AM' },
  { id: '2', name: 'Sarah Johnson', initials: 'SJ' },
  { id: '3', name: 'Mike Chen', initials: 'MC' },
  { id: '4', name: 'Lisa Park', initials: 'LP' },
]

const priorities = [
  { value: 'low', label: 'Low Priority', color: 'bg-blue-100 text-blue-700' },
  { value: 'medium', label: 'Medium Priority', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'high', label: 'High Priority', color: 'bg-red-100 text-red-700' },
]

const statuses = [
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
]

export function TaskModal({ isOpen, onClose, onSave, task, mode }: TaskModalProps) {
  const [formData, setFormData] = React.useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'todo',
    priority: task?.priority || 'medium',
    assigneeId: task?.assigneeId || '',
    dueDate: task?.dueDate || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...task,
      ...formData,
      id: task?.id || Date.now().toString(),
    })
    onClose()
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const selectedPriority = priorities.find(p => p.value === formData.priority)
  const selectedAssignee = teamMembers.find(m => m.id === formData.assigneeId)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-green-600" />
            <span>{mode === 'create' ? 'Create New Task' : 'Edit Task'}</span>
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Create a new task and assign it to a team member.' 
              : 'Update the task details and settings.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Task Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter task title"
              required
            />
          </div>

          {/* Task Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe the task in detail..."
              rows={3}
            />
            <p className="text-xs text-gray-500">
              💡 AI Suggestion: Add specific deliverables and acceptance criteria for better clarity
            </p>
          </div>

          {/* Grid Layout for Selects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Priority */}
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                <SelectTrigger>
                  <SelectValue>
                    {selectedPriority && (
                      <div className="flex items-center space-x-2">
                        <Flag className="w-4 h-4" />
                        <span>{selectedPriority.label}</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={priority.color}>
                          {priority.label}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Assignee */}
            <div className="space-y-2">
              <Label>Assign to</Label>
              <Select value={formData.assigneeId} onValueChange={(value) => handleInputChange('assigneeId', value)}>
                <SelectTrigger>
                  <SelectValue>
                    {selectedAssignee && (
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>{selectedAssignee.name}</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs">
                          {member.initials}
                        </div>
                        <span>{member.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* AI Suggestions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-xs">🤖</span>
              </div>
              <div>
                <h4 className="text-sm text-yellow-800 mb-1">AI Task Optimization</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Suggested tags: #frontend #ui-design #responsive</li>
                  <li>• Estimated time: 8-12 hours based on similar tasks</li>
                  <li>• Dependencies: Complete "Design System" task first</li>
                </ul>
              </div>
            </div>
          </div>

          <DialogFooter className="space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              {mode === 'create' ? 'Create Task' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}