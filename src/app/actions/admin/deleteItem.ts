'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const deleteItemSchema = z.object({
  id: z.string(),
  type: z.enum(['FAQ', 'MICE_CARD', 'REVIEW'])
})

export async function deleteItem(data: z.infer<typeof deleteItemSchema>) {
  try {
    const { id, type } = deleteItemSchema.parse(data)
    
    switch (type) {
      case 'FAQ':
        await prisma.fAQ.delete({ where: { id } })
        break
      case 'MICE_CARD':
        await prisma.miceCard.delete({ where: { id } })
        break
      case 'REVIEW':
        await prisma.review.delete({ where: { id } })
        break
    }
    
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error(`Error deleting ${data.type}:`, error)
    return { success: false, error: `Failed to delete ${data.type}` }
  }
} 