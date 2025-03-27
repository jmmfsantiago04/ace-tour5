'use server'

import { prisma } from '@/lib/prisma'
import { SupportInquiry, InquiryStatus } from '@/types/support'

export async function getSupportInquiries(): Promise<{ inquiries?: SupportInquiry[], error?: string }> {
  try {
    const inquiries = await prisma.support.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return { inquiries }
  } catch (error) {
    console.error('Error fetching support inquiries:', error)
    return { error: 'Failed to fetch support inquiries' }
  }
}

export async function updateInquiryStatus(
  id: string, 
  status: InquiryStatus
): Promise<{ inquiry?: SupportInquiry, error?: string }> {
  try {
    const inquiry = await prisma.support.update({
      where: { id },
      data: { status }
    })
    return { inquiry }
  } catch (error) {
    console.error('Error updating inquiry status:', error)
    return { error: 'Failed to update inquiry status' }
  }
} 