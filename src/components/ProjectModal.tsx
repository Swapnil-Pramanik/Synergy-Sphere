import React from 'react'
import { Calendar, User, Flag, FileText, Users, Target, Folder } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Badge } from './ui/badge'
import { Checkbox } from './ui/checkbox'
import { api } from '../lib/api'

interface ProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (project: any) => void
  projectId?: string | null
}

const teamMembers = [
  { id: 1, name: 'Alex Morgan', initials: 'AM', email: 'alex@company.com' },
  { id: 2, name: 'Sarah Johnson', initials: 'SJ', email: 'sarah@company.com' },
  { id: 3, name: 'Mike Chen', initials: 'MC', email: 'mike@company.com' },
  { id: 4, name: 'Lisa Park', initials: 'LP', email: 'lisa@company.com' },
  { id: 5, name: 'James Wilson', initials: 'JW', email: 'james@company.com' },
  { id: 6, name: 'Emma Davis', initials: 'ED', email: 'emma@company.com' },
]

const projectTypes = [
  { value: 'web-development', label: 'Web Development', color: 'bg-blue-100 text-blue-700' },
  { value: 'mobile-app', label: 'Mobile App', color: 'bg-green-100 text-green-700' },
  { value: 'design', label: 'Design', color: 'bg-purple-100 text-purple-700' },
  { value: 'marketing', label: 'Marketing', color: 'bg-pink-100 text-pink-700' },
  { value: 'research', label: 'Research', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'other', label: 'Other', color: 'bg-gray-100 text-gray-700' },
]

const priorities = [
  { value: 'low', label: 'Low Priority', color: 'bg-blue-100 text-blue-700' },
  { value: 'medium', label: 'Medium Priority', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'high', label: 'High Priority', color: 'bg-red-100 text-red-700' },
]

const statuses = [
  { value: 'planning', label: 'Planning' },
  { value: 'active', label: 'Active' },
  { value: 'on-hold', label: 'On Hold' },
  { value: 'completed', label: 'Completed' },
]

export function ProjectModal({ isOpen, onClose, onSave, projectId }: ProjectModalProps) {
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    status: 'planning' as const,
    priority: 'medium' as const,
    projectType: 'web-development' as const,
    dueDate: '',
    budget: '',
    teamMembers: [] as number[],
    objectives: [''],
    client: '',
  })
  const [loading, setLoading] = React.useState(false)
  const [project, setProject] = React.useState<any>(null)

  React.useEffect(() => {
    if (isOpen && projectId) {
      loadProject()
    } else if (isOpen && !projectId) {
      // Reset form for new project
      setFormData({
        title: '',
        description: '',
        status: 'planning' as const,
        priority: 'medium' as const,
        projectType: 'web-development' as const,
        dueDate: '',
        budget: '',
        teamMembers: [],
        objectives: [''],
        client: '',
      })
      setProject(null)
    }
  }, [isOpen, projectId])

  const loadProject = async () => {
    if (!projectId) return
    
    try {
      setLoading(true)
      const foundProject = await api.get(`/api/projects/${projectId}`)
      
      if (foundProject) {
        setProject(foundProject)
        setFormData({
          title: foundProject.title || '',
          description: foundProject.description || '',
          status: foundProject.status || 'planning',
          priority: foundProject.priority || 'medium',
          projectType: foundProject.project_type || 'web-development',
          dueDate: foundProject.due_date || '',
          budget: foundProject.budget?.toString() || '',
          teamMembers: foundProject.team_members || [],
          objectives: foundProject.objectives || [''],
          client: foundProject.client || '',
        })
      }
    } catch (error) {
      console.error('Failed to load project:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return
    
    try {
      setLoading(true)
      
      const submitData = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        project_type: formData.projectType,
        due_date: formData.dueDate || null,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        team_members: formData.teamMembers,
        objectives: formData.objectives.filter(obj => obj.trim()),
        client: formData.client || null,
        progress: projectId ? project?.progress || 0 : 0,
      }
      
      if (projectId && project) {
        // Update existing project
        await api.put(`/api/projects/${projectId}`, submitData)
      } else {
        // Create new project
        await api.post('/api/projects', submitData)
      }
      
      await onSave(null) // Trigger refresh
      onClose()
    } catch (error: any) {
      console.error('Failed to save project:', error)
      alert(error.message || 'Failed to save project')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | string[] | number[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleTeamMemberToggle = (memberId: number) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.includes(memberId)
        ? prev.teamMembers.filter(id => id !== memberId)
        : [...prev.teamMembers, memberId]
    }))
  }

  const handleObjectiveChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.map((obj, i) => i === index ? value : obj)
    }))
  }

  const addObjective = () => {
    setFormData(prev => ({
      ...prev,
      objectives: [...prev.objectives, '']
    }))
  }

  const removeObjective = (index: number) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index)
    }))
  }

  const selectedPriority = priorities.find(p => p.value === formData.priority)
  const selectedProjectType = projectTypes.find(pt => pt.value === formData.projectType)
  const mode = projectId ? 'edit' : 'create'
  
  if (loading && projectId) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[700px]">
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-600">Loading project...</div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Folder className="w-5 h-5 text-green-600" />
            <span>{mode === 'create' ? 'Create New Project' : 'Edit Project'}</span>
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Set up a new project with team members and objectives.' 
              : 'Update the project details and settings.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Project Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter project title"
              required
            />
          </div>

          {/* Project Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe the project goals and scope..."
              rows={3}
            />
          </div>

          {/* Grid Layout for Selects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Project Type */}
            <div className="space-y-2">
              <Label>Project Type</Label>
              <Select value={formData.projectType} onValueChange={(value) => handleInputChange('projectType', value)}>
                <SelectTrigger>
                  <SelectValue>
                    {selectedProjectType && (
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4" />
                        <span>{selectedProjectType.label}</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {projectTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={type.color}>
                          {type.label}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            {/* Budget */}
            <div className="space-y-2">
              <Label htmlFor="budget">Budget ($)</Label>
              <Input
                id="budget"
                type="number"
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
                placeholder="0"
                min="0"
                step="100"
              />
            </div>
          </div>

          {/* Client */}
          <div className="space-y-2">
            <Label htmlFor="client">Client / Stakeholder</Label>
            <Input
              id="client"
              value={formData.client}
              onChange={(e) => handleInputChange('client', e.target.value)}
              placeholder="Client name or internal department"
            />
          </div>

          {/* Team Members */}
          <div className="space-y-3">
            <Label className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Team Members</span>
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`member-${member.id}`}
                    checked={formData.teamMembers.includes(member.id)}
                    onCheckedChange={() => handleTeamMemberToggle(member.id)}
                  />
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs">
                      {member.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-500 truncate">{member.email}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500">
              Selected: {formData.teamMembers.length} member{formData.teamMembers.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Project Objectives */}
          <div className="space-y-3">
            <Label>Project Objectives</Label>
            {formData.objectives.map((objective, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={objective}
                  onChange={(e) => handleObjectiveChange(index, e.target.value)}
                  placeholder={`Objective ${index + 1}`}
                />
                {formData.objectives.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeObjective(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addObjective}>
              Add Objective
            </Button>
          </div>

          {/* AI Suggestions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-xs">🤖</span>
              </div>
              <div>
                <h4 className="text-sm text-yellow-800 mb-1">AI Project Insights</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Recommended team size: {Math.max(3, Math.min(6, formData.teamMembers.length + 2))} members</li>
                  <li>• Estimated timeline: {formData.projectType === 'web-development' ? '8-12 weeks' : '6-10 weeks'}</li>
                  <li>• Suggested milestones: Planning → Development → Testing → Deployment</li>
                </ul>
              </div>
            </div>
          </div>

          <DialogFooter className="space-x-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={loading}>
              {loading ? 'Saving...' : (mode === 'create' ? 'Create Project' : 'Save Changes')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
