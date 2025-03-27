import { NextAuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { compare } from "bcrypt";
import { cookies } from 'next/headers';
import { JWT } from 'next-auth/jwt';

// Define the User type that matches your Prisma schema
type User = {
  id: string;
  email: string;
  name: string | null;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
};

// Extend the built-in types
declare module "next-auth" {
  interface User {
    role: string;
    password: string;
  }
  
  interface Session {
    user: {
      role: string;
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        }) as User | null;

        if (!user || user.role !== "ADMIN") {
          return null;
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          password: user.password
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          role: user.role,
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          role: token.role,
        },
      };
    },
  },
};

type SignInResponse = {
  success: boolean;
  error?: string;
};

export async function signIn(credentials: { email: string; password: string }): Promise<SignInResponse> {
  const user = await prisma.user.findUnique({
    where: {
      email: credentials.email
    }
  }) as User | null;

  if (!user || user.role !== "ADMIN") {
    return { success: false, error: "Invalid credentials" };
  }

  const isPasswordValid = await compare(credentials.password, user.password);

  if (!isPasswordValid) {
    return { success: false, error: "Invalid credentials" };
  }

  // Create a session token
  const token: JWT = {
    name: user.name || undefined,
    email: user.email,
    picture: undefined,
    sub: user.id,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
    jti: crypto.randomUUID()
  };

  // Store the token in cookies
  const cookieStore = cookies();
  const cookieValue = JSON.stringify(token);
  const maxAge = 24 * 60 * 60; // 24 hours

  // Set the cookie using Response headers
  const response = new Response(null, {
    status: 200,
    headers: {
      'Set-Cookie': `next-auth.session-token=${cookieValue}; Path=/; HttpOnly; Secure=${process.env.NODE_ENV === 'production'}; SameSite=Lax; Max-Age=${maxAge}`
    }
  });

  return { success: true };
} 