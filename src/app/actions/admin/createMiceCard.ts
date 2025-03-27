'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const miceCardSchema = z.object({
  label: z.string().min(1, "Label is required"),
  date: z.string().min(1, "Date is required"),
  content: z.string().min(1, "Content is required"),
  imageUrl: z.string().min(1, "Image URL is required"),
  imageAlt: z.string().min(1, "Image alt text is required"),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
})

export async function createMiceCard(data: z.infer<typeof miceCardSchema>) {
  try {
    const validatedData = miceCardSchema.parse(data)
    const miceCard = await prisma.miceCard.create({
      data: {
        ...validatedData,
        date: new Date(validatedData.date) // Convert string date to Date object
      }
    })
    revalidatePath('/admin')
    return { success: true, data: miceCard }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors }
    }
    console.error('Error creating MICE card:', error)
    return { success: false, error: 'Failed to create MICE card' }
  }
} 