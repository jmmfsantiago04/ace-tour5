'use server'

import { prisma } from '@/lib/prisma'

export async function getActiveFAQs(locale: string = 'en') {
  try {
    const faqs = await prisma.fAQ.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        titleEn: true,
        titleKo: true,
        contentEn: true,
        contentKo: true,
        category: true,
      },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    // Transform the data based on the requested locale
    const localizedFaqs = faqs.map(faq => ({
      id: faq.id,
      titleEn: faq.titleEn,
      titleKo: faq.titleKo,
      contentEn: faq.contentEn,
      contentKo: faq.contentKo,
      category: faq.category,
    }))

    return { success: true, data: localizedFaqs }
  } catch (error) {
    console.error('Error fetching FAQs:', error)
    return { success: false, error: 'Failed to fetch FAQs' }
  }
} 