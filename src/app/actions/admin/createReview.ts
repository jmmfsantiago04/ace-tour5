'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const reviewSchema = z.object({
  reviewerInitial: z.string().length(1, "Initial must be a single character"),
  reviewerName: z.string().min(1, "Reviewer name is required"),
  reviewText: z.string().min(1, "Review text is required"),
  readMoreLink: z.string().optional(),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
})

export async function createReview(data: z.infer<typeof reviewSchema>) {
  try {
    const validatedData = reviewSchema.parse(data)
    const review = await prisma.review.create({
      data: validatedData
    })
    revalidatePath('/admin')
    return { success: true, data: review }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors }
    }
    console.error('Error creating review:', error)
    return { success: false, error: 'Failed to create review' }
  }
} 