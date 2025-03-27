'use server'

import { prisma } from '@/lib/prisma'

export async function getActiveReviews() {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        isActive: true
      },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ],
      select: {
        id: true,
        reviewerInitial: true,
        reviewerName: true,
        reviewText: true,
        readMoreLink: true
      }
    })
    return { success: true, data: reviews }
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return { success: false, error: 'Failed to fetch reviews' }
  }
} 