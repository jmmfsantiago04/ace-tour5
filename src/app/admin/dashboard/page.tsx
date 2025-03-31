'use client'

import { 
  getSupportInquiries, 
  getFAQs, 
  getMiceCards, 
  getReviews
} from '@/app/actions/admin'
import { getNewsletterSubscriptions, deleteNewsletterSubscription } from '@/app/actions/newsletter'
import { deleteInquiry } from '@/app/actions/admin/deleteInquiry'
import { getAllBookings } from '@/app/actions/booking'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { format } from 'date-fns'
import { SupportInquiry, InquiryStatus } from '@/types/support'
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  XCircle,
  Loader2,
  Trash2,
  LogOut,
  Download,
} from 'lucide-react'
import { AddFAQDialog } from '@/components/admin/AddFAQDialog'
import { AddMiceCardDialog } from '@/components/admin/AddMiceCardDialog'
import { AddReviewDialog } from '@/components/admin/AddReviewDialog'
import { EditFAQDialog } from '@/components/admin/EditFAQDialog'
import { EditMiceCardDialog } from '@/components/admin/EditMiceCardDialog'
import { EditReviewDialog } from '@/components/admin/EditReviewDialog'
import { InquiryDialog } from '@/components/admin/InquiryDialog'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { updateInquiryStatus } from '@/app/actions/admin/updateInquiryStatus'
import { toast } from 'sonner'
import { logout } from '@/app/actions/admin/logout'
import { PasswordResetDialog } from '@/components/admin/PasswordResetDialog'
import { useRouter } from 'next/navigation'
import { BookingDialog } from '@/components/admin/BookingDialog'

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

export default function DashboardPage() {
  const router = useRouter()
  const [selectedInquiry, setSelectedInquiry] = useState<SupportInquiry | null>(null)
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null)
  const [inquiries, setInquiries] = useState<SupportInquiry[]>([])
  const [faqs, setFaqs] = useState<any[]>([])
  const [miceCards, setMiceCards] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [newsletters, setNewsletters] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<InquiryStatus | 'ALL'>('ALL')
  const [deletingInquiry, setDeletingInquiry] = useState<string | null>(null)
  const [deletingNewsletter, setDeletingNewsletter] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    console.log('Starting to load dashboard data...');
    try {
      console.log('Fetching all data...');
      const [inquiriesRes, faqsRes, miceCardsRes, reviewsRes, newslettersRes, bookingsRes] = await Promise.all([
        getSupportInquiries(),
        getFAQs(),
        getMiceCards(),
        getReviews(),
        getNewsletterSubscriptions(),
        getAllBookings()
      ]);

      console.log('Data fetch results:', {
        inquiries: { success: !inquiriesRes.error, count: inquiriesRes.inquiries?.length },
        faqs: { success: !faqsRes.error, count: faqsRes.data?.length },
        miceCards: { success: !miceCardsRes.error, count: miceCardsRes.data?.length },
        reviews: { success: !reviewsRes.error, count: reviewsRes.data?.length },
        newsletters: { success: !newslettersRes.error, count: newslettersRes.subscriptions?.length },
        bookings: { success: !bookingsRes.error, count: bookingsRes.data?.length }
      });

      if (inquiriesRes.error || faqsRes.error || miceCardsRes.error || reviewsRes.error || newslettersRes.error || bookingsRes.error) {
        console.error('Errors in data fetching:', {
          inquiries: inquiriesRes.error,
          faqs: faqsRes.error,
          miceCards: miceCardsRes.error,
          reviews: reviewsRes.error,
          newsletters: newslettersRes.error,
          bookings: bookingsRes.error
        });
        setError('Failed to load data');
        return;
      }

      console.log('Setting state with fetched data...');
      setInquiries(inquiriesRes.inquiries || []);
      setFaqs(faqsRes.data || []);
      setMiceCards(miceCardsRes.data || []);
      setReviews(reviewsRes.data || []);
      setNewsletters(newslettersRes.subscriptions || []);
      setBookings(bookingsRes.data || []);
      console.log('State updated successfully');
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Error in loadData:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      setError('Failed to load data');
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleStatusChange = useCallback(async (inquiry: SupportInquiry, newStatus: InquiryStatus) => {
    try {
      setUpdatingStatus(inquiry.id)
      const result = await updateInquiryStatus({
        id: inquiry.id,
        status: newStatus
      })

      if (result.success) {
        // Update the inquiry in the list
        setInquiries(prev => prev.map(item => 
          item.id === inquiry.id ? { ...item, status: newStatus } : item
        ))
        
        // Update the selected inquiry if it's open
        if (selectedInquiry?.id === inquiry.id) {
          setSelectedInquiry(prev => prev ? { ...prev, status: newStatus } : null)
        }
        
        toast.success('Status updated successfully')
      } else {
        toast.error('Failed to update status')
      }
    } catch (error) {
      toast.error('Failed to update status')
    } finally {
      setUpdatingStatus(null)
    }
  }, [selectedInquiry])

  const handleDeleteInquiry = useCallback(async (inquiry: SupportInquiry) => {
    try {
      setDeletingInquiry(inquiry.id)
      const result = await deleteInquiry({ id: inquiry.id })

      if (result.success) {
        setInquiries(prev => prev.filter(item => item.id !== inquiry.id))
        toast.success('Inquiry deleted successfully')
      } else {
        toast.error('Failed to delete inquiry')
      }
    } catch (error) {
      toast.error('Failed to delete inquiry')
    } finally {
      setDeletingInquiry(null)
    }
  }, [])

  const handleDeleteNewsletter = useCallback(async (id: string) => {
    try {
      setDeletingNewsletter(id)
      const result = await deleteNewsletterSubscription(id)

      if (result.success) {
        setNewsletters(prev => prev.filter(item => item.id !== id))
        toast.success('Newsletter subscription deleted successfully')
      } else {
        toast.error('Failed to delete newsletter subscription')
      }
    } catch (error) {
      toast.error('Failed to delete newsletter subscription')
    } finally {
      setDeletingNewsletter(null)
    }
  }, [])

  const filteredInquiries = useMemo(() => {
    if (statusFilter === 'ALL') return inquiries
    return inquiries.filter(inquiry => inquiry.status === statusFilter)
  }, [inquiries, statusFilter])

  const handleLogout = async () => {
    try {
      const response = await logout()
      if (response.success) {
        router.push(response.redirectTo)
      } else {
        console.error('Logout failed')
        router.push('/admin/login')
      }
    } catch (error) {
      console.error('Error during logout:', error)
      router.push('/admin/login')
    }
  }

  const handleDownloadNewsletterCSV = useCallback(() => {
    // Create CSV content
    const csvContent = [
      ['Email', 'Subscription Date'], // CSV header
      ...newsletters.map(sub => [
        sub.email,
        format(new Date(sub.createdAt), 'yyyy-MM-dd')
      ])
    ].map(row => row.join(',')).join('\n')

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `newsletter-subscriptions-${format(new Date(), 'yyyy-MM-dd')}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [newsletters])

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <PasswordResetDialog />
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleLogout}
              className="text-red-600 hover:text-red-800 hover:bg-red-100"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="inquiries" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="inquiries">Support Inquiries</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="faqs">FAQs</TabsTrigger>
            <TabsTrigger value="mice">MICE Cards</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="newsletters">Newsletter</TabsTrigger>
          </TabsList>

          {/* Support Inquiries Tab */}
          <TabsContent value="inquiries">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-medium text-gray-900">Recent Inquiries</h2>
                  <Select
                    value={statusFilter}
                    onValueChange={(value: InquiryStatus | 'ALL') => setStatusFilter(value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Statuses</SelectItem>
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
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInquiries?.map((inquiry: SupportInquiry) => (
                        <TableRow 
                          key={inquiry.id} 
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => setSelectedInquiry(inquiry)}
                        >
                          <TableCell className="whitespace-nowrap">
                            {format(new Date(inquiry.createdAt), 'MMM d, yyyy')}
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">{inquiry.inquiryType.replace('_', ' ')}</span>
                          </TableCell>
                          <TableCell>{inquiry.fullName}</TableCell>
                          <TableCell>
                            <a 
                              href={`mailto:${inquiry.email}`} 
                              className="text-blue-600 hover:text-blue-800"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {inquiry.email}
                            </a>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={inquiry.status}
                              onValueChange={(value: InquiryStatus) => {
                                event?.stopPropagation()
                                handleStatusChange(inquiry, value)
                              }}
                              disabled={updatingStatus === inquiry.id}
                            >
                              <SelectTrigger className={`w-[140px] ${statusConfig[inquiry.status].bg}`}>
                                <SelectValue>
                                  <span className="inline-flex items-center gap-2">
                                    {updatingStatus === inquiry.id ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      statusConfig[inquiry.status].icon
                                    )}
                                    {statusConfig[inquiry.status].label}
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
                          </TableCell>
                          <TableCell className="max-w-md">
                            <p className="truncate text-sm text-gray-600">
                              {inquiry.inquiry.length > 100 
                                ? `${inquiry.inquiry.substring(0, 100)}...` 
                                : inquiry.inquiry}
                            </p>
                          </TableCell>
                          <TableCell>
                            {inquiry.status === 'COMPLETED' && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-600 hover:text-red-800 hover:bg-red-100"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteInquiry(inquiry)
                                }}
                                disabled={deletingInquiry === inquiry.id}
                              >
                                {deletingInquiry === inquiry.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Bookings</h2>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="w-[150px]">Date</TableHead>
                        <TableHead className="w-[150px]">Status</TableHead>
                        <TableHead className="w-[200px]">Customer</TableHead>
                        <TableHead className="w-[150px]">Trip Type</TableHead>
                        <TableHead>Route</TableHead>
                        <TableHead className="w-[100px]">Price</TableHead>
                        <TableHead className="w-[150px]">Payment Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings?.map((booking) => (
                        <TableRow 
                          key={booking.id} 
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => setSelectedBooking(booking)}
                        >
                          <TableCell className="whitespace-nowrap">
                            {format(new Date(booking.createdAt), 'MMM d, yyyy')}
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                              booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 
                              booking.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {booking.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{booking.customerName || 'N/A'}</p>
                              <a 
                                href={`mailto:${booking.customerEmail}`}
                                className="text-sm text-blue-600 hover:text-blue-800"
                              >
                                {booking.customerEmail}
                              </a>
                            </div>
                          </TableCell>
                          <TableCell>{booking.tripType}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <p>From: {booking.from}</p>
                              <p>To: {booking.to}</p>
                              <p className="text-gray-500">
                                {format(new Date(booking.departingDate), 'MMM d, yyyy')} at {booking.departureTime}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>${booking.price}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                              booking.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' :
                              booking.paymentStatus === 'FAILED' ? 'bg-red-100 text-red-800' :
                              booking.paymentStatus === 'REFUNDED' ? 'bg-gray-100 text-gray-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {booking.paymentStatus}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* FAQs Tab */}
          <TabsContent value="faqs">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">FAQs Management</h2>
                  <AddFAQDialog />
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="w-[100px]">Order</TableHead>
                        <TableHead className="w-[150px]">Status</TableHead>
                        <TableHead className="w-[150px]">Category</TableHead>
                        <TableHead>English Title</TableHead>
                        <TableHead>Korean Title</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {faqs?.map((faq) => (
                        <TableRow key={faq.id} className="hover:bg-gray-50">
                          <TableCell>{faq.order}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                              faq.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {faq.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </TableCell>
                          <TableCell>{faq.category || '-'}</TableCell>
                          <TableCell className="max-w-md">
                            <p className="truncate text-sm text-gray-600">{faq.titleEn}</p>
                          </TableCell>
                          <TableCell className="max-w-md">
                            <p className="truncate text-sm text-gray-600">{faq.titleKo}</p>
                          </TableCell>
                          <TableCell>
                            <EditFAQDialog faq={{
                              id: faq.id,
                              titleEn: faq.titleEn,
                              titleKo: faq.titleKo,
                              contentEn: faq.contentEn,
                              contentKo: faq.contentKo,
                              category: faq.category || undefined,
                              order: faq.order,
                              isActive: faq.isActive
                            }} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* MICE Cards Tab */}
          <TabsContent value="mice">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">MICE Cards Management</h2>
                  <AddMiceCardDialog />
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="w-[100px]">Order</TableHead>
                        <TableHead className="w-[150px]">Status</TableHead>
                        <TableHead className="w-[200px]">Label</TableHead>
                        <TableHead className="w-[150px]">Date</TableHead>
                        <TableHead>Content</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {miceCards?.map((card) => (
                        <TableRow key={card.id} className="hover:bg-gray-50">
                          <TableCell>{card.order}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                              card.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {card.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </TableCell>
                          <TableCell>{card.label}</TableCell>
                          <TableCell>{format(new Date(card.date), 'MMM d, yyyy')}</TableCell>
                          <TableCell className="max-w-md">
                            <p className="truncate text-sm text-gray-600">{card.content}</p>
                          </TableCell>
                          <TableCell>
                            <EditMiceCardDialog miceCard={{
                              id: card.id,
                              imageUrl: card.imageUrl,
                              date: card.date.toISOString(),
                              content: card.content,
                              isActive: card.isActive,
                              order: card.order,
                              label: card.label,
                              imageAlt: card.imageAlt
                            }} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Reviews Management</h2>
                  <AddReviewDialog />
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="w-[100px]">Order</TableHead>
                        <TableHead className="w-[150px]">Status</TableHead>
                        <TableHead className="w-[100px]">Initial</TableHead>
                        <TableHead className="w-[200px]">Name</TableHead>
                        <TableHead>Review Text</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reviews?.map((review) => (
                        <TableRow key={review.id} className="hover:bg-gray-50">
                          <TableCell>{review.order}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                              review.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {review.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </TableCell>
                          <TableCell>{review.reviewerInitial}</TableCell>
                          <TableCell>{review.reviewerName}</TableCell>
                          <TableCell className="max-w-md">
                            <p className="truncate text-sm text-gray-600">{review.reviewText}</p>
                          </TableCell>
                          <TableCell>
                            <EditReviewDialog review={{
                              id: review.id,
                              isActive: review.isActive,
                              order: review.order,
                              reviewerInitial: review.reviewerInitial,
                              reviewerName: review.reviewerName,
                              reviewText: review.reviewText,
                              readMoreLink: review.readMoreLink || ''
                            }} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Newsletter Tab */}
          <TabsContent value="newsletters">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Newsletter Subscriptions</h2>
                  <Button
                    variant="outline"
                    onClick={handleDownloadNewsletterCSV}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download CSV
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="w-[200px]">Date</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {newsletters?.map((subscription) => (
                        <TableRow key={subscription.id} className="hover:bg-gray-50">
                          <TableCell className="whitespace-nowrap">
                            {format(new Date(subscription.createdAt), 'MMM d, yyyy')}
                          </TableCell>
                          <TableCell>
                            <a 
                              href={`mailto:${subscription.email}`} 
                              className="text-blue-600 hover:text-blue-800"
                            >
                              {subscription.email}
                            </a>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-600 hover:text-red-800 hover:bg-red-100"
                              onClick={() => handleDeleteNewsletter(subscription.id)}
                              disabled={deletingNewsletter === subscription.id}
                            >
                              {deletingNewsletter === subscription.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Inquiry Dialog */}
        {selectedInquiry && (
          <InquiryDialog
            inquiry={selectedInquiry}
            open={!!selectedInquiry}
            onOpenChange={(open) => !open && setSelectedInquiry(null)}
            onStatusChange={handleStatusChange}
          />
        )}

        {/* Booking Dialog */}
        {selectedBooking && (
          <BookingDialog
            booking={selectedBooking}
            open={!!selectedBooking}
            onOpenChange={(open) => !open && setSelectedBooking(null)}
          />
        )}
      </main>
    </div>
  )
} 