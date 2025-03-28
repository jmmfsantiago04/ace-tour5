'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const deleteInquirySchema = z.object({
  id: z.string()
})

export async function deleteInquiry(data: z.infer<typeof deleteInquirySchema>) {
  try {
    const { id } = deleteInquirySchema.parse(data)
    
    await prisma.support.delete({
      where: { id }
    })
    
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Error deleting inquiry:', error)
    return { success: false, error: 'Failed to delete inquiry' }
  }
} 