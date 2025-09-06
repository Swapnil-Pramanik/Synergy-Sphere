import React from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Users, Plus, Settings, Filter } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { EventModal } from './EventModal'
import { api } from '../lib/api'

interface CalendarEvent {
  id: string
  title: string
  type: 'task' | 'project' | 'meeting'
  date: Date
  status?: string
  priority?: string
  assignee?: string
  project?: string
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function Calendar() {
  const [currentDate, setCurrentDate] = React.useState(new Date())
  const [events, setEvents] = React.useState<CalendarEvent[]>([])
  const [loading, setLoading] = React.useState(true)
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null)
  const [eventModalOpen, setEventModalOpen] = React.useState(false)
  const [selectedEventId, setSelectedEventId] = React.useState<string | null>(null)
  const [selectedDateForEvent, setSelectedDateForEvent] = React.useState<Date | null>(null)

  React.useEffect(() => {
    loadCalendarData()
  }, [])

  const loadCalendarData = async () => {
    try {
      setLoading(true)
      
      // Get projects and their due dates
      const projects = await api.get('/api/projects')
      const projectEvents: CalendarEvent[] = projects
        .filter((p: any) => p.due_date)
        .map((p: any) => ({
          id: `project-${p.id}`,
          title: p.title,
          type: 'project' as const,
          date: new Date(p.due_date),
          status: p.status,
        }))

      // Get all tasks with due dates
      const allTasks: CalendarEvent[] = []
      for (const project of projects) {
        try {
          const tasks = await api.get(`/api/projects/${project.id}/tasks`)
          const taskEvents = tasks
            .filter((t: any) => t.due_date)
            .map((t: any) => ({
              id: `task-${t.id}`,
              title: t.title,
              type: 'task' as const,
              date: new Date(t.due_date),
              status: t.status,
              priority: t.priority,
              assignee: t.assignee_name,
              project: project.title,
            }))
          allTasks.push(...taskEvents)
        } catch (err) {
          console.warn(`Failed to load tasks for project ${project.id}`)
        }
      }

      // Add some mock meetings for demo
      const meetingEvents: CalendarEvent[] = [
        {
          id: 'meeting-1',
          title: 'Weekly Team Standup',
          type: 'meeting',
          date: new Date(2024, new Date().getMonth(), new Date().getDate() + 1, 10, 0),
        },
        {
          id: 'meeting-2',
          title: 'Project Review',
          type: 'meeting',
          date: new Date(2024, new Date().getMonth(), new Date().getDate() + 3, 14, 0),
        },
      ]

      setEvents([...projectEvents, ...allTasks, ...meetingEvents])
    } catch (err: any) {
      console.error('Failed to load calendar data:', err)
    } finally {
      setLoading(false)
    }
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    const currentDate = new Date(startDate)
    
    while (days.length < 42) { // 6 weeks * 7 days
      days.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + 1)
    }
    
    return days
  }

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate.toDateString() === date.toDateString()
    })
  }

  const getUpcomingEvents = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    return events
      .filter(event => event.date >= today)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5)
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'project':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'task':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'meeting':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const handleAddEvent = (date?: Date) => {
    setSelectedEventId(null)
    setSelectedDateForEvent(date || new Date())
    setEventModalOpen(true)
  }

  const handleEventSave = async (event: any) => {
    try {
      setEventModalOpen(false)
      setSelectedEventId(null)
      setSelectedDateForEvent(null)
      // In a real app, you'd refresh the calendar data here
      loadCalendarData()
    } catch (error) {
      console.error('Error saving event:', error)
    }
  }

  const days = getDaysInMonth(currentDate)
  const upcomingEvents = getUpcomingEvents()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl text-gray-900">Calendar</h1>
        </div>
        <div className="text-gray-600">Loading calendar...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900">Calendar</h1>
          <p className="text-gray-600">Track deadlines and schedule events</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleAddEvent()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Calendar Grid - Now takes full width minus sidebar */}
        <div className="flex-1">
          <Card className="shadow-xl border border-gray-200/50 bg-white/50 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-200/50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {events.length} events this month
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth('prev')}
                    className="hover:bg-green-50 hover:border-green-200"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDate(new Date())}
                    className="hover:bg-green-50 hover:border-green-200 px-4"
                  >
                    Today
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth('next')}
                    className="hover:bg-green-50 hover:border-green-200"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {/* Weekday Headers */}
              <div className="grid grid-cols-7 border-b-2 border-gray-200">
                {weekdays.map(day => (
                  <div key={day} className="p-4 text-center text-sm font-bold text-gray-800 uppercase tracking-wider bg-gradient-to-b from-gray-50 to-gray-100">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar Days */}
              <div className="grid grid-cols-7">
                {days.map((day, index) => {
                  const isCurrentMonth = day.getMonth() === currentDate.getMonth()
                  const isToday = day.toDateString() === new Date().toDateString()
                  const dayEvents = getEventsForDate(day)
                  
                  return (
                    <div
                      key={index}
                      className={`min-h-32 p-3 border-r border-b border-gray-150 cursor-pointer transition-all duration-300 group relative ${
                        !isCurrentMonth 
                          ? 'text-gray-400 bg-gray-50/30' 
                          : 'hover:bg-gradient-to-br hover:from-blue-50/30 hover:to-green-50/30'
                      } ${
                        isToday 
                          ? 'bg-gradient-to-br from-green-100 to-green-50 border-green-300 shadow-inner' 
                          : ''
                      }`}
                      onClick={() => setSelectedDate(day)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className={`text-sm font-bold transition-all duration-200 ${
                          isToday 
                            ? 'text-white bg-gradient-to-r from-green-600 to-green-500 w-7 h-7 rounded-full flex items-center justify-center shadow-lg' 
                            : isCurrentMonth 
                            ? 'text-gray-900 hover:text-green-600' 
                            : 'text-gray-400'
                        }`}>
                          {day.getDate()}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="opacity-0 group-hover:opacity-100 w-6 h-6 p-0 transition-all duration-200 hover:bg-green-100 hover:text-green-600"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleAddEvent(day)
                          }}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      <div className="space-y-1.5">
                        {dayEvents.slice(0, 3).map(event => (
                          <div
                            key={event.id}
                            className="text-xs px-2.5 py-1.5 rounded-lg text-left cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105 border"
                            style={{
                              backgroundColor: event.type === 'project' ? '#eff6ff' : 
                                             event.type === 'task' ? '#f0fdf4' : '#faf5ff',
                              color: event.type === 'project' ? '#1e40af' :
                                     event.type === 'task' ? '#166534' : '#6b21a8',
                              borderColor: event.type === 'project' ? '#3b82f6' :
                                          event.type === 'task' ? '#22c55e' : '#8b5cf6',
                              borderLeftWidth: '3px'
                            }}
                            title={event.title}
                            onClick={(e) => {
                              e.stopPropagation()
                              // Handle event click
                            }}
                          >
                            <div className="font-semibold truncate">{event.title}</div>
                            {event.assignee && (
                              <div className="text-xs opacity-80 truncate">{event.assignee}</div>
                            )}
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="text-xs text-gray-600 text-center bg-gray-100 hover:bg-gray-200 rounded-lg px-2 py-1.5 cursor-pointer transition-colors">
                            +{dayEvents.length - 3} more events
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Fixed width */}
        <div className="w-80 space-y-6 flex-shrink-0">
          {/* Today's Events */}
          <Card className="shadow-lg border border-gray-200/50 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
              <CardTitle className="flex items-center text-lg">
                <Clock className="w-5 h-5 mr-2 text-blue-600" />
                Today's Events
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-48 overflow-y-auto">
              {getEventsForDate(new Date()).length === 0 ? (
                <div className="text-center py-6">
                  <div className="text-4xl mb-2">📅</div>
                  <p className="text-sm text-gray-500">No events today</p>
                </div>
              ) : (
                getEventsForDate(new Date()).map(event => (
                  <div key={event.id} className="p-3 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200 cursor-pointer hover:bg-gray-50">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-semibold text-gray-900 truncate">
                        {event.title}
                      </h4>
                      <Badge variant="outline" className={`${getEventTypeColor(event.type)} text-xs shrink-0 ml-2`}>
                        {event.type}
                      </Badge>
                    </div>
                    {event.assignee && (
                      <div className="flex items-center text-xs text-gray-600">
                        <Users className="w-3 h-3 mr-1" />
                        {event.assignee}
                      </div>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="shadow-lg border border-gray-200/50 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
              <CardTitle className="flex items-center text-lg">
                <Calendar className="w-5 h-5 mr-2 text-green-600" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-64 overflow-y-auto">
              {upcomingEvents.length === 0 ? (
                <div className="text-center py-6">
                  <div className="text-4xl mb-2">🎯</div>
                  <p className="text-sm text-gray-500">No upcoming events</p>
                </div>
              ) : (
                upcomingEvents.map(event => (
                  <div key={event.id} className="p-3 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200 cursor-pointer hover:bg-gray-50 group">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-semibold text-gray-900 truncate group-hover:text-green-600 transition-colors">
                        {event.title}
                      </h4>
                      <Badge variant="outline" className={`${getEventTypeColor(event.type)} text-xs shrink-0 ml-2`}>
                        {event.type}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-600 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {event.date.toLocaleDateString()} at {event.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {event.assignee && (
                        <div className="flex items-center text-xs text-gray-600">
                          <Users className="w-3 h-3 mr-1" />
                          {event.assignee}
                        </div>
                      )}
                      {event.project && (
                        <div className="text-xs text-gray-500">
                          Project: {event.project}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Calendar Stats */}
          <Card className="shadow-lg border border-gray-200/50 bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle className="flex items-center text-lg">
                <Settings className="w-5 h-5 mr-2 text-purple-600" />
                Calendar Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{events.filter(e => e.type === 'meeting').length}</div>
                  <div className="text-xs text-blue-700 font-medium">Meetings</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                  <div className="text-2xl font-bold text-green-600 mb-1">{events.filter(e => e.type === 'task').length}</div>
                  <div className="text-xs text-green-700 font-medium">Tasks</div>
                </div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                <div className="text-xl font-bold text-purple-600 mb-1">{events.filter(e => e.type === 'project').length}</div>
                <div className="text-xs text-purple-700 font-medium">Project Deadlines</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={eventModalOpen}
        onClose={() => {
          setEventModalOpen(false)
          setSelectedEventId(null)
          setSelectedDateForEvent(null)
        }}
        onSave={handleEventSave}
        eventId={selectedEventId}
        selectedDate={selectedDateForEvent}
      />

      {/* Selected Date Modal */}
      {selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle>Events for {selectedDate.toLocaleDateString()}</CardTitle>
            </CardHeader>
            <CardContent>
              {getEventsForDate(selectedDate).length === 0 ? (
                <p className="text-gray-500">No events scheduled for this date.</p>
              ) : (
                <div className="space-y-3">
                  {getEventsForDate(selectedDate).map(event => (
                    <div key={event.id} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{event.title}</h4>
                        <Badge variant="outline" className={getEventTypeColor(event.type)}>
                          {event.type}
                        </Badge>
                      </div>
                      {event.assignee && (
                        <p className="text-sm text-gray-600">Assigned to: {event.assignee}</p>
                      )}
                      {event.project && (
                        <p className="text-sm text-gray-600">Project: {event.project}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <div className="flex justify-end mt-4">
                <Button variant="outline" onClick={() => setSelectedDate(null)}>
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
