'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const faqSchema = z.object({
  titleEn: z.string().min(1, "English title is required"),
  titleKo: z.string().min(1, "Korean title is required"),
  contentEn: z.string().min(1, "English content is required"),
  contentKo: z.string().min(1, "Korean content is required"),
  category: z.string().optional(),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
})

export async function createFAQ(data: z.infer<typeof faqSchema>) {
  try {
    const validatedData = faqSchema.parse(data)
    const faq = await prisma.fAQ.create({
      data: validatedData
    })
    revalidatePath('/admin')
    return { success: true, data: faq }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors }
    }
    console.error('Error creating FAQ:', error)
    return { success: false, error: 'Failed to create FAQ' }
  }
} 