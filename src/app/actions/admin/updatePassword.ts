'use server'

import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { getToken } from 'next-auth/jwt'
import { headers } from 'next/headers'
import { authOptions } from '@/lib/auth'

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6)
})

export async function updatePassword(data: z.infer<typeof updatePasswordSchema>) {
  try {
    console.log('Debug - Starting password update process')
    
    const headersList = await headers()
    const cookieHeader = headersList.get('cookie') || ''
    console.log('Debug - Cookie header present:', !!cookieHeader)
    
    // Parse cookies into an object for debugging
    const cookies = Object.fromEntries(
      cookieHeader.split(';').map((c: string) => {
        const [key, ...value] = c.split('=')
        return [key.trim(), value.join('=')]
      })
    )
    console.log('Debug - Available cookies:', Object.keys(cookies))
    console.log('Debug - Session token cookie present:', !!cookies['next-auth.session-token'])
    console.log('Debug - NEXTAUTH_SECRET present:', !!process.env.NEXTAUTH_SECRET)

    const token = await getToken({
      req: {
        headers: headersList,
        cookies
      } as any,
      secureCookie: process.env.NODE_ENV === 'production',
      secret: authOptions.secret || process.env.NEXTAUTH_SECRET,
      cookieName: 'next-auth.session-token'
    })

    console.log('Debug - Auth token present:', !!token)
    console.log('Debug - Token data:', {
      email: token?.email,
      role: token?.role,
      sub: token?.sub
    })

    if (!token?.email) {
      console.log('Debug - Authentication failed: No token or email')
      return { success: false, error: 'Not authenticated' }
    }

    try {
      console.log('Debug - Validating password data')
      const validatedData = updatePasswordSchema.parse(data)
      console.log('Debug - Password validation passed')
      const { currentPassword, newPassword } = validatedData

      // Get user from database
      console.log('Debug - Fetching user from database')
      const user = await prisma.user.findUnique({
        where: { email: token.email }
      })

      if (!user) {
        console.log('Debug - User not found in database')
        return { success: false, error: 'User not found' }
      }
      console.log('Debug - User found in database')

      // Verify current password
      console.log('Debug - Verifying current password')
      const isValid = await bcrypt.compare(currentPassword, user.password)
      console.log('Debug - Current password verification:', isValid ? 'Success' : 'Failed')

      if (!isValid) {
        console.log('Debug - Current password verification failed')
        return { success: false, error: 'Current password is incorrect' }
      }

      // Hash new password
      console.log('Debug - Hashing new password')
      const hashedPassword = await bcrypt.hash(newPassword, 10)
      console.log('Debug - New password hashed successfully')

      // Update password
      console.log('Debug - Updating password in database')
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
      })
      console.log('Debug - Password updated successfully')
      
      return { success: true }
    } catch (validationError) {
      console.error('Debug - Validation error:', validationError)
      if (validationError instanceof z.ZodError) {
        return { success: false, error: 'Invalid password format' }
      }
      throw validationError // Re-throw if it's not a validation error
    }
  } catch (error) {
    console.error('Debug - Error in password update:', error)
    return { success: false, error: 'Failed to update password' }
  }
} 