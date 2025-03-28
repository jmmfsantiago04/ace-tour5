'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { InquiryStatus } from '@/types/support'

const updateInquiryStatusSchema = z.object({
  id: z.string(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED'])
})

export async function updateInquiryStatus(data: z.infer<typeof updateInquiryStatusSchema>) {
  try {
    const validatedData = updateInquiryStatusSchema.parse(data)
    const { id, status } = validatedData
    
    const inquiry = await prisma.support.update({
      where: { id },
      data: { status }
    })
    
    revalidatePath('/admin')
    return { success: true, data: inquiry }
  } catch (error) {
    console.error('Error updating inquiry status:', error)
    return { success: false, error: 'Failed to update inquiry status' }
  }
} 