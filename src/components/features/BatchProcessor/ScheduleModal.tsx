'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar, Clock } from 'lucide-react'

export interface ScheduleModalProps {
  open: boolean
  onClose: () => void
  onSchedule: (scheduledFor: Date) => Promise<void>
}

/**
 * ScheduleModal - Schedule batch job for later execution
 */
export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  open,
  onClose,
  onSchedule,
}) => {
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')

  // Set default to tomorrow at 9 AM
  React.useEffect(() => {
    if (open) {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(9, 0, 0, 0)
      
      const dateStr = tomorrow.toISOString().split('T')[0]
      const timeStr = '09:00'
      
      setDate(dateStr)
      setTime(timeStr)
    }
  }, [open])

  const handleSchedule = async () => {
    if (!date || !time) {
      alert('Please select both date and time')
      return
    }

    const scheduledDateTime = new Date(`${date}T${time}`)
    const now = new Date()

    if (scheduledDateTime <= now) {
      alert('Scheduled time must be in the future')
      return
    }

    setLoading(true)
    try {
      await onSchedule(scheduledDateTime)
      alert('Batch job scheduled successfully!')
      onClose()
    } catch (error) {
      console.error('Schedule error:', error)
      alert(error instanceof Error ? error.message : 'Failed to schedule batch job')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`fixed inset-0 z-50 ${open ? 'block' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative z-10">
          <h2 className="text-xl font-semibold mb-4">Schedule Batch Job</h2>
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                Schedule this batch job to run automatically at a specific date and time. The labels
                will be generated and ready for download when the scheduled time arrives.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <Calendar size={16} className="inline mr-2" />
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <Clock size={16} className="inline mr-2" />
                Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Scheduled for:</strong>{' '}
                {date && time
                  ? new Date(`${date}T${time}`).toLocaleString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })
                  : 'Not set'}
              </p>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handleSchedule}
                disabled={!date || !time || loading}
                className="flex-1"
              >
                {loading ? 'Scheduling...' : 'Schedule Batch Job'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScheduleModal

