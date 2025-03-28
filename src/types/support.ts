export type InquiryType = 'TRAVEL_CONSULTATION' | 'SHUTTLE_SERVICE' | 'MICE_SERVICE'
export type InquiryStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'

export interface SupportInquiry {
  id: string
  inquiryType: InquiryType
  fullName: string
  email: string
  inquiry: string
  createdAt: Date
  updatedAt: Date
  status: InquiryStatus
} 