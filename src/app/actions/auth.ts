'use server';

import { signIn } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function authenticate(prevState: any, formData: FormData) {
  try {
    const validatedFields = loginSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    const result = await signIn(validatedFields);

    if (!result.success) {
      return { error: 'Invalid credentials' };
    }

    redirect('/admin');
  } catch (error) {
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