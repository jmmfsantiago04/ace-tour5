'use server'

import { prisma } from '@/lib/prisma'

export async function getActiveFAQs(locale: string) {
  try {
    const faqs = await prisma.fAQ.findMany({
      where: {
        isActive: true,
        locale: locale
      },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ],
      select: {
        id: true,
        title: true,
        content: true
      }
    })
    return { success: true, data: faqs }
  } catch (error) {
    console.error('Error fetching FAQs:', error)
    return { success: false, error: 'Failed to fetch FAQs' }
  }
} 