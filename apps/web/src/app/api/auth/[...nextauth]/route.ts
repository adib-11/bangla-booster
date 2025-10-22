import NextAuth from 'next-auth';
import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { getOwnerByEmail, getOwnerById } from '@/lib/db';

export const authOptions: NextAuthConfig = {
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const email = credentials.email as string;
          const password = credentials.password as string;

          // Fetch owner from database
          const owner = await getOwnerByEmail(email);

          if (!owner || !owner.hashedPassword) {
            return null;
          }

          // Verify password
          const isValidPassword = await bcrypt.compare(password, owner.hashedPassword);

          if (!isValidPassword) {
            return null;
          }

          // Return user object (excluding hashedPassword)
          return {
            id: owner.id,
            email: owner.email,
            name: owner.businessName || owner.email,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      
      // Always fetch fresh subdomain from database for middleware checks
      if (token.id) {
        try {
          const owner = await getOwnerById(token.id as string);
          if (owner) {
            token.subdomain = owner.subdomain;
            token.businessName = owner.businessName;
          }
        } catch (error) {
          console.error('Error fetching owner in JWT callback:', error);
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        if (token.email) {
          session.user.email = token.email as string;
        }
        (session.user as any).subdomain = token.subdomain as string;
        (session.user as any).businessName = token.businessName as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
