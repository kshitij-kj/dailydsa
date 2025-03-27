import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.JWT_SECRET });
  const { pathname } = req.nextUrl;

  // Define protected routes
  const protectedRoutes = ['/profile', '/problems'];
  
  // Define auth routes
  const authRoutes = ['/login', '/signup'];

  // If it's a protected route and user is not authenticated
  if (protectedRoutes.includes(pathname) && !token) {
    const url = new URL('/login', req.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // If it's an auth route and user is authenticated
  if (authRoutes.includes(pathname) && token) {
    return NextResponse.redirect(new URL('/problems', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile',
    '/problems',
    '/login',
    '/signup',
  ],
}; 