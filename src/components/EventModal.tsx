import React from 'react'
import { Calendar, Clock, Users, MapPin, FileText, Video, Coffee } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Badge } from './ui/badge'
import { Checkbox } from './ui/checkbox'
import { api } from '../lib/api'

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (event: any) => void
  eventId?: string | null
  selectedDate?: Date | null
}

const eventTypes = [
  { value: 'meeting', label: 'Meeting', icon: Users, color: 'bg-blue-100 text-blue-700' },
  { value: 'workshop', label: 'Workshop', icon: Coffee, color: 'bg-purple-100 text-purple-700' },
  { value: 'presentation', label: 'Presentation', icon: FileText, color: 'bg-green-100 text-green-700' },
  { value: 'call', label: 'Video Call', icon: Video, color: 'bg-red-100 text-red-700' },
  { value: 'other', label: 'Other', icon: Calendar, color: 'bg-gray-100 text-gray-700' },
]

const teamMembers = [
  { id: 1, name: 'Alex Morgan', initials: 'AM', email: 'alex@company.com' },
  { id: 2, name: 'Sarah Johnson', initials: 'SJ', email: 'sarah@company.com' },
  { id: 3, name: 'Mike Chen', initials: 'MC', email: 'mike@company.com' },
  { id: 4, name: 'Lisa Park', initials: 'LP', email: 'lisa@company.com' },
  { id: 5, name: 'James Wilson', initials: 'JW', email: 'james@company.com' },
  { id: 6, name: 'Emma Davis', initials: 'ED', email: 'emma@company.com' },
]

export function EventModal({ isOpen, onClose, onSave, eventId, selectedDate }: EventModalProps) {
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    type: 'meeting' as const,
    date: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
    startTime: '09:00',
    endTime: '10:00',
    location: '',
    isVirtual: false,
    meetingLink: '',
    attendees: [] as number[],
    isRecurring: false,
    reminderMinutes: 15,
  })
  const [loading, setLoading] = React.useState(false)
  const [event, setEvent] = React.useState<any>(null)

  React.useEffect(() => {
    if (isOpen && eventId) {
      loadEvent()
    } else if (isOpen && !eventId) {
      // Reset form for new event
      setFormData({
        title: '',
        description: '',
        type: 'meeting' as const,
        date: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
        startTime: '09:00',
        endTime: '10:00',
        location: '',
        isVirtual: false,
        meetingLink: '',
        attendees: [],
        isRecurring: false,
        reminderMinutes: 15,
      })
      setEvent(null)
    }
  }, [isOpen, eventId, selectedDate])

  const loadEvent = async () => {
    if (!eventId) return
    
    try {
      setLoading(true)
      // Mock loading - in real app, you'd load from API
      const mockEvent = {
        id: eventId,
        title: 'Team Standup',
        description: 'Weekly team sync',
        type: 'meeting',
        date: '2024-01-15',
        startTime: '10:00',
        endTime: '11:00',
        location: 'Conference Room A',
        isVirtual: false,
        attendees: [1, 2, 3],
      }
      
      setEvent(mockEvent)
      setFormData({
        title: mockEvent.title,
        description: mockEvent.description,
        type: mockEvent.type,
        date: mockEvent.date,
        startTime: mockEvent.startTime,
        endTime: mockEvent.endTime,
        location: mockEvent.location || '',
        isVirtual: mockEvent.isVirtual || false,
        meetingLink: '',
        attendees: mockEvent.attendees || [],
        isRecurring: false,
        reminderMinutes: 15,
      })
    } catch (error) {
      console.error('Failed to load event:', error)
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
        type: formData.type,
        date: formData.date,
        start_time: formData.startTime,
        end_time: formData.endTime,
        location: formData.location,
        is_virtual: formData.isVirtual,
        meeting_link: formData.meetingLink,
        attendees: formData.attendees,
        is_recurring: formData.isRecurring,
        reminder_minutes: formData.reminderMinutes,
      }
      
      if (eventId && event) {
        // Update existing event - mock API call
        console.log('Updating event:', submitData)
      } else {
        // Create new event - mock API call
        console.log('Creating event:', submitData)
      }
      
      await onSave(null) // Trigger refresh
      onClose()
    } catch (error: any) {
      console.error('Failed to save event:', error)
      alert(error.message || 'Failed to save event')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean | number | number[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAttendeeToggle = (memberId: number) => {
    setFormData(prev => ({
      ...prev,
      attendees: prev.attendees.includes(memberId)
        ? prev.attendees.filter(id => id !== memberId)
        : [...prev.attendees, memberId]
    }))
  }

  const selectedEventType = eventTypes.find(t => t.value === formData.type)
  const mode = eventId ? 'edit' : 'create'
  
  if (loading && eventId) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-600">Loading event...</div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-green-600" />
            <span>{mode === 'create' ? 'Create New Event' : 'Edit Event'}</span>
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Schedule a new meeting or event with team members.' 
              : 'Update the event details and attendees.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Event Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter event title"
              required
            />
          </div>

          {/* Event Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe the purpose and agenda..."
              rows={3}
            />
          </div>

          {/* Event Type and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Event Type */}
            <div className="space-y-2">
              <Label>Event Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue>
                    {selectedEventType && (
                      <div className="flex items-center space-x-2">
                        <selectedEventType.icon className="w-4 h-4" />
                        <span>{selectedEventType.label}</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center space-x-2">
                        <type.icon className="w-4 h-4" />
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          {/* Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time *</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time *</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isVirtual"
                checked={formData.isVirtual}
                onCheckedChange={(checked) => handleInputChange('isVirtual', checked as boolean)}
              />
              <Label htmlFor="isVirtual">Virtual Meeting</Label>
            </div>

            {!formData.isVirtual ? (
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Conference room, address, etc."
                    className="pl-10"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="meetingLink">Meeting Link</Label>
                <div className="relative">
                  <Video className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="meetingLink"
                    value={formData.meetingLink}
                    onChange={(e) => handleInputChange('meetingLink', e.target.value)}
                    placeholder="Zoom, Teams, or Google Meet link"
                    className="pl-10"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Attendees */}
          <div className="space-y-3">
            <Label className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Attendees</span>
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`attendee-${member.id}`}
                    checked={formData.attendees.includes(member.id)}
                    onCheckedChange={() => handleAttendeeToggle(member.id)}
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
              Selected: {formData.attendees.length} attendee{formData.attendees.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Additional Options */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isRecurring"
                checked={formData.isRecurring}
                onCheckedChange={(checked) => handleInputChange('isRecurring', checked as boolean)}
              />
              <Label htmlFor="isRecurring">Recurring Event</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reminderMinutes">Reminder</Label>
              <Select 
                value={formData.reminderMinutes.toString()} 
                onValueChange={(value) => handleInputChange('reminderMinutes', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 minutes before</SelectItem>
                  <SelectItem value="15">15 minutes before</SelectItem>
                  <SelectItem value="30">30 minutes before</SelectItem>
                  <SelectItem value="60">1 hour before</SelectItem>
                  <SelectItem value="1440">1 day before</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* AI Suggestions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-xs">🤖</span>
              </div>
              <div>
                <h4 className="text-sm text-yellow-800 mb-1">AI Event Suggestions</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Optimal duration: 45-60 minutes for team meetings</li>
                  <li>• Suggested time: 10:00 AM - highest team availability</li>
                  <li>• Recommended: Send calendar invite 1 day in advance</li>
                </ul>
              </div>
            </div>
          </div>

          <DialogFooter className="space-x-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={loading}>
              {loading ? 'Saving...' : (mode === 'create' ? 'Create Event' : 'Save Changes')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
