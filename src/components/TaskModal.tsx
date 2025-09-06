import React from 'react'
import { Calendar, User, Flag, FileText, Folder, Clock, Target } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Badge } from './ui/badge'
import { useToast } from './ui/toast'
import { api } from '../lib/api'

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (task: any) => void
  taskId?: string | null
  projectId?: string | null
}

const teamMembers = [
  { id: 1, name: 'Alex Morgan', initials: 'AM' },
  { id: 2, name: 'Sarah Johnson', initials: 'SJ' },
  { id: 3, name: 'Mike Chen', initials: 'MC' },
  { id: 4, name: 'Lisa Park', initials: 'LP' },
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

export function TaskModal({ isOpen, onClose, onSave, taskId, projectId }: TaskModalProps) {
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    status: 'todo' as const,
    priority: 'medium' as const,
    assigneeId: '',
    dueDate: '',
    project_id: projectId || '',
    estimatedHours: '',
    tags: [] as string[],
  })
  const [loading, setLoading] = React.useState(false)
  const [task, setTask] = React.useState<any>(null)
  const { addToast } = useToast()
  const [projects, setProjects] = React.useState<any[]>([])
  const [availableTags] = React.useState(['Frontend', 'Backend', 'Design', 'Testing', 'Documentation', 'Bug Fix', 'Feature'])

  React.useEffect(() => {
    if (isOpen) {
      loadProjects()
      if (taskId) {
        loadTask()
      } else {
        // Reset form for new task
        setFormData({
          title: '',
          description: '',
          status: 'todo' as const,
          priority: 'medium' as const,
          assigneeId: '',
          dueDate: '',
          project_id: projectId || '',
          estimatedHours: '',
          tags: [],
        })
        setTask(null)
      }
    }
  }, [isOpen, taskId, projectId])

  const loadProjects = async () => {
    try {
      const projectsData = await api.get('/api/projects')
      setProjects(projectsData)
    } catch (error) {
      console.error('Failed to load projects:', error)
    }
  }

  const loadTask = async () => {
    if (!taskId) return
    
    try {
      setLoading(true)
      // For now, we'll need to find the task by searching through projects
      const projects = await api.get('/api/projects')
      let foundTask = null
      
      for (const project of projects) {
        try {
          const tasks = await api.get(`/api/projects/${project.id}/tasks`)
          foundTask = tasks.find((t: any) => t.id.toString() === taskId)
          if (foundTask) {
            foundTask.project_id = project.id
            break
          }
        } catch (err) {
          console.warn(`Failed to load tasks for project ${project.id}`)
        }
      }
      
      if (foundTask) {
        setTask(foundTask)
        setFormData({
          title: foundTask.title || '',
          description: foundTask.description || '',
          status: foundTask.status || 'todo',
          priority: foundTask.priority || 'medium',
          assigneeId: foundTask.assignee_user_id?.toString() || '',
          dueDate: foundTask.due_date || '',
          project_id: foundTask.project_id?.toString() || '',
          estimatedHours: foundTask.estimated_hours?.toString() || '',
          tags: foundTask.tags || [],
        })
      }
    } catch (error) {
      console.error('Failed to load task:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return
    
    try {
      setLoading(true)
      
      if (taskId && task) {
        // Update existing task
        const updateData = {
          title: formData.title,
          description: formData.description,
          status: formData.status,
          priority: formData.priority,
          assignee_user_id: formData.assigneeId ? parseInt(formData.assigneeId) : null,
          due_date: formData.dueDate || null,
          estimated_hours: formData.estimatedHours ? parseFloat(formData.estimatedHours) : null,
          tags: formData.tags,
        }
        
        await api.put(`/api/tasks/${taskId}`, updateData)
        addToast({
          type: 'success',
          title: 'Task Updated',
          description: 'Task has been successfully updated.'
        })
      } else {
        // Create new task
        const createData = {
          project_id: parseInt(formData.project_id),
          title: formData.title,
          description: formData.description,
          status: formData.status,
          priority: formData.priority,
          assignee_user_id: formData.assigneeId ? parseInt(formData.assigneeId) : null,
          due_date: formData.dueDate || null,
        }
        
        await api.post('/api/tasks', createData)
        addToast({
          type: 'success',
          title: 'Task Created',
          description: 'New task has been successfully created.'
        })
      }
      
      await onSave(null) // Trigger refresh
      onClose()
    } catch (error: any) {
      console.error('Failed to save task:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: error.message || 'Failed to save task. Please try again.'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleTagToggle = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }))
  }

  const selectedPriority = priorities.find(p => p.value === formData.priority)
  const selectedAssignee = teamMembers.find(m => m.id.toString() === formData.assigneeId)
  const selectedProject = projects.find(p => p.id.toString() === formData.project_id)
  const mode = taskId ? 'edit' : 'create'
  
  if (loading && taskId) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-600">Loading task...</div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

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
              ? 'Create a new task and assign it to a team member with project details.' 
              : 'Update the task details, assignment, and project settings.'
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

          {/* Project Selection - Only show for new tasks or if no project is pre-selected */}
          {(!taskId || !formData.project_id) && (
            <div className="space-y-2">
              <Label>Project *</Label>
              <Select value={formData.project_id} onValueChange={(value) => handleInputChange('project_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a project">
                    {selectedProject && (
                      <div className="flex items-center space-x-2">
                        <Folder className="w-4 h-4" />
                        <span>{selectedProject.title}</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{
                          backgroundColor: project.status === 'active' ? '#22c55e' : 
                                         project.status === 'completed' ? '#6b7280' : '#f59e0b'
                        }}></div>
                        <span>{project.title}</span>
                        <Badge variant="outline" className="ml-auto text-xs">
                          {project.status}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

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

          {/* Time Estimate and Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Estimated Hours */}
            <div className="space-y-2">
              <Label htmlFor="estimatedHours">Estimated Hours</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="estimatedHours"
                  type="number"
                  value={formData.estimatedHours}
                  onChange={(e) => handleInputChange('estimatedHours', e.target.value)}
                  placeholder="0"
                  min="0"
                  step="0.5"
                  className="pl-10"
                />
              </div>
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
                  <SelectItem value="">Unassigned</SelectItem>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id.toString()}>
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

            {/* Empty placeholder to maintain grid layout */}
            <div></div>
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <Label className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Tags</span>
            </Label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={formData.tags.includes(tag) ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    formData.tags.includes(tag)
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </Badge>
              ))}
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
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={loading}>
              {loading ? 'Saving...' : (mode === 'create' ? 'Create Task' : 'Save Changes')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}