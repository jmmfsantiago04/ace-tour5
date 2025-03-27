import { 
  getSupportInquiries, 
  getFAQs, 
  getMiceCards, 
  getReviews 
} from '@/app/actions/admin'
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
import { format } from 'date-fns'
import { SupportInquiry, InquiryStatus } from '@/types/support'
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  XCircle,
} from 'lucide-react'
import { AddFAQDialog } from '@/components/admin/AddFAQDialog'
import { AddMiceCardDialog } from '@/components/admin/AddMiceCardDialog'
import { AddReviewDialog } from '@/components/admin/AddReviewDialog'
import { EditFAQDialog } from '@/components/admin/EditFAQDialog'
import { EditMiceCardDialog } from '@/components/admin/EditMiceCardDialog'
import { EditReviewDialog } from '@/components/admin/EditReviewDialog'

export default async function DashboardPage() {
  const { inquiries, error: inquiriesError } = await getSupportInquiries()
  const { data: faqs, error: faqsError } = await getFAQs()
  const { data: miceCards, error: miceCardsError } = await getMiceCards()
  const { data: reviews, error: reviewsError } = await getReviews()

  if (inquiriesError || faqsError || miceCardsError || reviewsError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">Failed to load data</p>
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

        {/* Tabs */}
        <Tabs defaultValue="inquiries" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="inquiries">Support Inquiries</TabsTrigger>
            <TabsTrigger value="faqs">FAQs</TabsTrigger>
            <TabsTrigger value="mice">MICE Cards</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          {/* Support Inquiries Tab */}
          <TabsContent value="inquiries">
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
                        <TableHead className="w-[150px]">Language</TableHead>
                        <TableHead>Title</TableHead>
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
                          <TableCell className="capitalize">{faq.locale}</TableCell>
                          <TableCell className="max-w-md">
                            <p className="truncate text-sm text-gray-600">{faq.title}</p>
                          </TableCell>
                          <TableCell>
                            <EditFAQDialog faq={{
                              id: faq.id,
                              title: faq.title,
                              content: faq.content,
                              isActive: faq.isActive,
                              order: faq.order,
                              locale: faq.locale,
                              category: faq.category || undefined
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
        </Tabs>
      </main>
    </div>
  )
} 