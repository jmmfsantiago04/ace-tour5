import { getSupportInquiries } from '@/app/actions/admin'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { format } from 'date-fns'
import { SupportInquiry, InquiryStatus } from '@/types/support'
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  XCircle,
} from 'lucide-react'

export default async function AdminPage() {
  const { inquiries, error } = await getSupportInquiries()

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  const statusStyles: Record<InquiryStatus, { bg: string; icon: React.ReactNode }> = {
    'PENDING': { 
      bg: 'bg-yellow-100 text-yellow-800',
      icon: <Clock className="h-4 w-4" />
    },
    'IN_PROGRESS': { 
      bg: 'bg-blue-100 text-blue-800',
      icon: <AlertCircle className="h-4 w-4" />
    },
    'RESOLVED': { 
      bg: 'bg-green-100 text-green-800',
      icon: <CheckCircle2 className="h-4 w-4" />
    },
    'CLOSED': { 
      bg: 'bg-gray-100 text-gray-800',
      icon: <XCircle className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>

        {/* Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Inquiries</h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-[100px]">Date</TableHead>
                    <TableHead className="w-[150px]">Type</TableHead>
                    <TableHead className="w-[200px]">Name</TableHead>
                    <TableHead className="w-[200px]">Email</TableHead>
                    <TableHead className="w-[120px]">Status</TableHead>
                    <TableHead>Inquiry</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inquiries?.map((inquiry: SupportInquiry) => (
                    <TableRow key={inquiry.id} className="hover:bg-gray-50">
                      <TableCell className="whitespace-nowrap">
                        {format(new Date(inquiry.createdAt), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{inquiry.inquiryType.replace('_', ' ')}</span>
                      </TableCell>
                      <TableCell>{inquiry.fullName}</TableCell>
                      <TableCell>
                        <a href={`mailto:${inquiry.email}`} className="text-blue-600 hover:text-blue-800">
                          {inquiry.email}
                        </a>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[inquiry.status].bg}`}>
                          {statusStyles[inquiry.status].icon}
                          {inquiry.status}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <p className="truncate text-sm text-gray-600">{inquiry.inquiry}</p>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 