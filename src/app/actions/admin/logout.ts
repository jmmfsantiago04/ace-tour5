'use server'

import { cookies } from 'next/headers'
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'

export async function logout() {
  try {
    console.log('Debug - Starting logout process')
    
    const cookieStore = await cookies()
    
    // Log current cookies before clearing
    const allCookies = cookieStore.getAll()
    console.log('Debug - Current cookies before clearing:', allCookies.map((c: RequestCookie) => c.name))
    
    // Clear all auth-related cookies
    const cookiesToClear = [
      'authjs.session-token',
      'next-auth.session-token',
      'next-auth.callback-url',
      'next-auth.csrf-token'
    ]

    // Clear cookies sequentially to ensure all are properly cleared
    for (const cookieName of cookiesToClear) {
      console.log(`Debug - Clearing ${cookieName}`)
      cookieStore.set(cookieName, '', {
        expires: new Date(0),
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax'
      })
    }

    console.log('Debug - Logout completed')
    return { success: true, redirectTo: '/admin/login' }
  } catch (error) {
    console.error('Debug - Error during logout:', error)
    return { success: false, redirectTo: '/admin/login' }
  }
} 