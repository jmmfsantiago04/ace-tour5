'use server'

import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
})

type State = {
  message?: string | null
  errors?: Record<string, string[]> | null
}

export async function subscribeToNewsletter(prevState: State, formData: FormData): Promise<State> {
  try {
    const validatedFields = newsletterSchema.parse({
      email: formData.get('email'),
    })

    await prisma.newsletter.create({
      data: validatedFields,
    })

    return { 
      message: 'Thank you for subscribing to our newsletter!',
      errors: null
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        message: null,
        errors: Object.fromEntries(
          Object.entries(error.flatten().fieldErrors).map(([key, value]) => [
            key,
            value || []
          ])
        )
      }
    }
    
    // Check for unique constraint violation
    if (error.code === 'P2002') {
      return {
        message: null,
        errors: {
          email: ['This email is already subscribed to our newsletter.']
        }
      }
    }
    
    return {
      message: null,
      errors: {
        form: ['Failed to subscribe. Please try again.']
      }
    }
  }
}

// Admin action to get all newsletter subscriptions
export async function getNewsletterSubscriptions() {
  try {
    const subscriptions = await prisma.newsletter.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return { success: true, subscriptions }
  } catch (error) {
    console.error('Error fetching newsletter subscriptions:', error)
    return { success: false, error: 'Failed to fetch newsletter subscriptions' }
  }
}

// Admin action to delete a newsletter subscription
export async function deleteNewsletterSubscription(id: string) {
  try {
    await prisma.newsletter.delete({
      where: { id }
    })
    return { success: true }
  } catch (error) {
    console.error('Error deleting newsletter subscription:', error)
    return { success: false, error: 'Failed to delete newsletter subscription' }
  }
} 