import { NextResponse } from 'next/server'

export async function middleware(request) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/Admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname === '/maintenance'
  ) {
    return NextResponse.next()
  }

  const isDev = request.nextUrl.searchParams.get('dev') === 'true'
  const isLocalhost = request.nextUrl.hostname === 'localhost' || request.nextUrl.hostname === '127.0.0.1'
  
  if (isLocalhost && isDev) {
    return NextResponse.next()
  }

  try {
    const settingsUrl = new URL('/api/settings', request.url)
    const response = await fetch(settingsUrl.toString(), {
      headers: {
        'User-Agent': 'Next.js Middleware'
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      if (data.maintenanceMode) {
        return NextResponse.redirect(new URL('/maintenance', request.url))
      }
    }
  } catch (error) {
    console.error('Error checking maintenance mode:', error)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
