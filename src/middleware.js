import { ME } from '@/data/api'
import { NextResponse } from 'next/server'
const PUBLIC_PATHS = ['/auth/login', '/auth/register', '/auth/reset-password']

export async function middleware(req) {
  const { pathname } = req.nextUrl
  const jwtToken = req.cookies.get('jwt')?.value

  // ------------------------
  // مسیرهای عمومی (auth)
  // ------------------------
  if (PUBLIC_PATHS.includes(pathname)) {
    if (jwtToken) {
      const url = req.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  // ------------------------
  // مسیرهای محافظت‌شده (dashboard)
  // ------------------------
  if (pathname.startsWith('/dashboard')) {
    if (!jwtToken) {
      const url = req.nextUrl.clone()
      url.pathname = '/auth/login'
      return NextResponse.redirect(url)
    }

    // ------------------------
    // مسیرهای ادمین
    // ------------------------
    if (pathname.startsWith('/dashboard/admin')) {
      try {
        const res = await fetch(ME, {
          headers: { Cookie: `jwt=${jwtToken}` },
        })
        const data = await res.json()
        const role = data?.user?.role

        if (role !== 'admin' && role !== 'super-admin') {
          const url = req.nextUrl.clone()
          url.pathname = '/dashboard'
          return NextResponse.redirect(url)
        }
      } catch (err) {
        const url = req.nextUrl.clone()
        url.pathname = '/auth/login'
        return NextResponse.redirect(url)
      }
    }
  }

  return NextResponse.next()
}

// matcher برای auth و dashboard
export const config = {
  matcher: ['/auth/:path*', '/dashboard/:path*'],
}
