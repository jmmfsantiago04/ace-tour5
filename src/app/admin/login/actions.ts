'use server';

import { signIn } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function handleLogin(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const result = await signIn({ email, password });

  if (result.success) {
    redirect('/admin/dashboard');
  }

  return result;
} 