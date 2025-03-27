'use server'

import { prisma } from '@/lib/prisma'

export async function getMiceCards() {
  try {
    const miceCards = await prisma.miceCard.findMany({
      orderBy: [
        { order: 'asc' },
        { date: 'desc' }
      ]
    })
    return { success: true, data: miceCards }
  } catch (error) {
    console.error('Error fetching MICE cards:', error)
    return { success: false, error: 'Failed to fetch MICE cards' }
  }
} 