'use server'

import { prisma } from '@/lib/prisma'

export async function getReviews() {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    })
    return { success: true, data: reviews }
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return { success: false, error: 'Failed to fetch reviews' }
  }
} 