import { NextRequest, NextResponse } from 'next/server';
import cookie from 'cookie';

// Define the paths that should be protected
const protectedPaths = ['/login'];
console.log("middle ware called");

export function middleware(req: NextRequest) {
  // Parse the cookies from the request headers
  const cookies = cookie.parse(req.headers.get('cookie') || '');

  // Check if the user is logged in (we check for the `authToken` cookie)
  const isLoggedIn = cookies.authToken;

  // If the request is to the login page and the user is logged in, redirect
  if (protectedPaths.includes(req.nextUrl.pathname) && isLoggedIn) {
    return NextResponse.redirect(new URL('/', req.url)); // Redirect to homepage or dashboard
  }

  // Allow the request to continue
  return NextResponse.next();
}
