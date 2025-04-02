import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter your email and password');
        }

        try {
          const { db } = await connectToDatabase();
          
          const user = await db.collection('users').findOne({ 
            email: credentials.email 
          });
          
          if (!user) {
            throw new Error('No user found with this email');
          }

          const isValid = await bcrypt.compare(credentials.password, user.password);
          
          if (!isValid) {
            throw new Error('Invalid password');
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role || 'user',
            isVerified: user.isVerified || false,
          };
        } catch (error) {
          console.error('Auth error:', error);
          throw new Error(error.message || 'Authentication failed');
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.isVerified = user.isVerified;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.isVerified = token.isVerified;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions); 