'use server';

import { signIn } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { cookies } from 'next/headers';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function authenticate(prevState: any, formData: FormData) {
  try {
    console.log('Debug - Starting authentication process');
    
    const validatedFields = loginSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });
    
    console.log('Debug - Email being used:', validatedFields.email);
    console.log('Debug - Form validation passed');

    const result = await signIn(validatedFields);
    console.log('Debug - Sign in result:', result);

    if (!result.success) {
      console.log('Debug - Authentication failed:', result.error);
      return { error: 'Invalid credentials' };
    }

    // Check if session cookie was set
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('next-auth.session-token');
    console.log('Debug - Session cookie present:', !!sessionCookie);
    
    if (!sessionCookie) {
      console.log('Debug - No session cookie set after login');
      return { error: 'Session not established' };
    }

    console.log('Debug - Authentication successful, redirecting to admin');
    redirect('/admin');
  } catch (error) {
    console.error('Debug - Authentication error:', error);
    if (error instanceof z.ZodError) {
      return {
        error: 'Invalid email or password format'
      };
    }
    return {
      error: 'An error occurred. Please try again.'
    };
  }
} 