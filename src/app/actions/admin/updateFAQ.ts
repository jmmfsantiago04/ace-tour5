'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const updateFAQSchema = z.object({
  id: z.string(),
  titleEn: z.string().min(1, "English title is required"),
  titleKo: z.string().min(1, "Korean title is required"),
  contentEn: z.string().min(1, "English content is required"),
  contentKo: z.string().min(1, "Korean content is required"),
  category: z.string().optional(),
  order: z.number(),
  isActive: z.boolean(),
})

export async function updateFAQ(data: z.infer<typeof updateFAQSchema>) {
  try {
    const validatedData = updateFAQSchema.parse(data)
    const { id, ...updateData } = validatedData
    
    const faq = await prisma.fAQ.update({
      where: { id },
      data: updateData
    })
    
    revalidatePath('/admin')
    return { success: true, data: faq }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors }
    }
    console.error('Error updating FAQ:', error)
    return { success: false, error: 'Failed to update FAQ' }
  }
} 