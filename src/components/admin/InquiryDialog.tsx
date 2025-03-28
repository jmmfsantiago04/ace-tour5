'use client'

import * as React from 'react'
import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SupportInquiry, InquiryStatus } from '@/types/support'
import { updateInquiryStatus } from '@/app/actions/admin/updateInquiryStatus'
import { toast } from 'sonner'
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  XCircle,
} from 'lucide-react'

interface InquiryDialogProps {
  inquiry: SupportInquiry
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange: (inquiry: SupportInquiry, newStatus: InquiryStatus) => void
}

const statusConfig: Record<InquiryStatus, { label: string; icon: React.ReactNode; bg: string }> = {
  'PENDING': { 
    label: 'Pending',
    icon: <Clock className="h-4 w-4" />,
    bg: 'bg-yellow-100 text-yellow-800'
  },
  'IN_PROGRESS': { 
    label: 'In Progress',
    icon: <AlertCircle className="h-4 w-4" />,
    bg: 'bg-blue-100 text-blue-800'
  },
  'COMPLETED': { 
    label: 'Completed',
    icon: <CheckCircle2 className="h-4 w-4" />,
    bg: 'bg-green-100 text-green-800'
  }
}

export function InquiryDialog({ inquiry, open, onOpenChange, onStatusChange }: InquiryDialogProps) {
  const [status, setStatus] = React.useState<InquiryStatus>(inquiry.status)
  const [isUpdating, setIsUpdating] = React.useState(false)

  async function handleStatusChange(newStatus: InquiryStatus) {
    try {
      setIsUpdating(true)
      const result = await updateInquiryStatus({
        id: inquiry.id,
        status: newStatus
      })

      if (result.success) {
        setStatus(newStatus)
        toast.success('Status updated successfully')
        onStatusChange(inquiry, newStatus)
      } else {
        toast.error('Failed to update status')
      }
    } catch (error) {
      toast.error('Failed to update status')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-4 sm:p-6 w-[95%]">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-semibold">Support Inquiry Details</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Date</p>
              <p className="mt-1">{format(new Date(inquiry.createdAt), 'MMM d, yyyy')}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Type</p>
              <p className="mt-1">{inquiry.inquiryType.replace('_', ' ')}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p className="mt-1">{inquiry.fullName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <a href={`mailto:${inquiry.email}`} className="mt-1 block text-blue-600 hover:text-blue-800">
                {inquiry.email}
              </a>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Status</p>
            <div className="mt-1">
              <Select
                value={status}
                onValueChange={(value: InquiryStatus) => handleStatusChange(value)}
                disabled={isUpdating}
              >
                <SelectTrigger className={`w-[180px] ${statusConfig[status].bg}`}>
                  <SelectValue>
                    <span className="inline-flex items-center gap-2">
                      {statusConfig[status].icon}
                      {statusConfig[status].label}
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statusConfig).map(([value, config]) => (
                    <SelectItem 
                      key={value} 
                      value={value}
                      className="flex items-center gap-2"
                    >
                      {config.icon}
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Inquiry</p>
            <p className="mt-1 whitespace-pre-wrap">{inquiry.inquiry}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 