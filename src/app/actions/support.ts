'use server'

import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const supportSchema = z.object({
  inquiryType: z.enum(['TRAVEL_CONSULTATION', 'SHUTTLE_SERVICE', 'MICE_SERVICE']),
  fullName: z.string().min(2),
  email: z.string().email(),
  inquiry: z.string().min(10).max(1000),
})

type State = {
  message?: string | null
  errors?: Record<string, string[]> | null
}

export async function createSupportInquiry(prevState: State, formData: FormData): Promise<State> {
  try {
    const validatedFields = supportSchema.parse({
      inquiryType: formData.get('inquiryType'),
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      inquiry: formData.get('inquiry'),
    })

    await prisma.support.create({
      data: validatedFields,
    })

    return { 
      message: 'Thank you for your inquiry. We will get back to you soon.',
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
    
    return {
      message: null,
      errors: {
        form: ['Failed to submit inquiry. Please try again.']
      }
    }
  }
} 