'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const updateReviewSchema = z.object({
  id: z.string(),
  reviewerInitial: z.string().length(1, "Initial must be a single character"),
  reviewerName: z.string().min(1, "Reviewer name is required"),
  reviewText: z.string().min(1, "Review text is required"),
  readMoreLink: z.string().optional(),
  order: z.number(),
  isActive: z.boolean(),
})

export async function updateReview(data: z.infer<typeof updateReviewSchema>) {
  try {
    const validatedData = updateReviewSchema.parse(data)
    const { id, ...updateData } = validatedData
    
    const review = await prisma.review.update({
      where: { id },
      data: updateData
    })
    
    revalidatePath('/admin')
    return { success: true, data: review }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors }
    }
    console.error('Error updating review:', error)
    return { success: false, error: 'Failed to update review' }
  }
} 