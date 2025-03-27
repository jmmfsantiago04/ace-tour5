'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const updateMiceCardSchema = z.object({
  id: z.string(),
  label: z.string().min(1, "Label is required"),
  date: z.string().min(1, "Date is required"),
  content: z.string().min(1, "Content is required"),
  imageUrl: z.string().min(1, "Image URL is required"),
  imageAlt: z.string().min(1, "Image alt text is required"),
  order: z.number(),
  isActive: z.boolean(),
})

export async function updateMiceCard(data: z.infer<typeof updateMiceCardSchema>) {
  try {
    const validatedData = updateMiceCardSchema.parse(data)
    const { id, date, ...rest } = validatedData
    
    const miceCard = await prisma.miceCard.update({
      where: { id },
      data: {
        ...rest,
        date: new Date(date)
      }
    })
    
    revalidatePath('/admin')
    return { success: true, data: miceCard }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors }
    }
    console.error('Error updating MICE card:', error)
    return { success: false, error: 'Failed to update MICE card' }
  }
} 