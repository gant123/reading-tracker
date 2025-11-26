import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

// In NextAuth v5, 'auth' is a wrapper that acts as the middleware
export default auth((req) => {
  // 1. Check for valid session
  // In the wrapper, the session is available at req.auth
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;
  
  const isDashboardRoute = 
    nextUrl.pathname.startsWith('/child') || 
    nextUrl.pathname.startsWith('/parent');
  
  const isAuthRoute = 
    nextUrl.pathname === '/login' || 
    nextUrl.pathname === '/register';

  // 2. Protect Dashboard Routes
  if (isDashboardRoute) {
    if (!isLoggedIn) {
      // Redirect to login, adding the current URL as a callback
      return NextResponse.redirect(new URL('/login', nextUrl));
    }
    return NextResponse.next();
  }

  // 3. Redirect Logged-In Users away from Login/Register
  if (isAuthRoute) {
    if (isLoggedIn) {
      // @ts-ignore: Assuming your session user has a 'role'
      const role = req.auth?.user?.role;
      const dashboardUrl = role === 'PARENT' ? '/parent' : '/child';
      return NextResponse.redirect(new URL(dashboardUrl, nextUrl));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
});

// 4. The Matcher Config
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)', 
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};