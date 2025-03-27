'use server'

import { prisma } from '@/lib/prisma'

export async function getActiveMiceCards() {
  try {
    const miceCards = await prisma.miceCard.findMany({
      where: {
        isActive: true
      },
      orderBy: [
        { order: 'asc' },
        { date: 'desc' }
      ],
      select: {
        id: true,
        label: true,
        date: true,
        content: true,
        imageUrl: true,
        imageAlt: true
      }
    })

    // Transform the data to match the component's expected format
    const formattedCards = miceCards.map(card => ({
      id: card.id,
      label: card.label,
      date: card.date.toLocaleDateString('en-US', { 
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      content: card.content,
      image: {
        url: card.imageUrl,
        alt: card.imageAlt
      }
    }))

    return { success: true, data: formattedCards }
  } catch (error) {
    console.error('Error fetching MICE cards:', error)
    return { success: false, error: 'Failed to fetch MICE cards' }
  }
} 