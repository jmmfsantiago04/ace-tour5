'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const faqSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  category: z.string().optional(),
  locale: z.string().default("en"),
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