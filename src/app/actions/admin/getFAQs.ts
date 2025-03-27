'use server'

import { prisma } from '@/lib/prisma'

export async function getFAQs() {
  try {
    const faqs = await prisma.fAQ.findMany({
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    })
    return { success: true, data: faqs }
  } catch (error) {
    console.error('Error fetching FAQs:', error)
    return { success: false, error: 'Failed to fetch FAQs' }
  }
} 