import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const LOCALE_COOKIE = 'storage-locale'
const SUPPORTED = ['ko', 'en', 'jp']

const CSP_HEADER = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' blob: data: https://blogimg.gumyo.net https://*.r2.cloudflarestorage.com https://avatars.githubusercontent.com https://lh3.googleusercontent.com",
    "font-src 'self'",
    "connect-src 'self' " + (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:9999') + ' ' + (process.env.NEXT_PUBLIC_UPLOAD_SERVER_URL ?? '') + ' https://blogimg.gumyo.net https://*.r2.cloudflarestorage.com',
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
].join('; ')

export const proxy = (request: NextRequest) => {
    const existingLocale = request.cookies.get(LOCALE_COOKIE)?.value
    let locale = existingLocale && SUPPORTED.includes(existingLocale) ? existingLocale : null

    const requestHeaders = new Headers(request.headers)

    if (!locale) {
        const browserLang = request.headers.get('accept-language')?.split(',')[0]?.slice(0, 2)?.toLowerCase()
        locale = browserLang === 'ja' ? 'jp' : browserLang === 'en' ? 'en' : 'ko'
    }

    requestHeaders.set('x-locale', locale)

    const response = NextResponse.next({ request: { headers: requestHeaders } })

    response.headers.set('Content-Security-Policy', CSP_HEADER)
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

    if (!existingLocale || !SUPPORTED.includes(existingLocale)) {
        response.cookies.set(LOCALE_COOKIE, locale, {
            path: '/',
            maxAge: 60 * 60 * 24 * 365,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
        })
    }

    return response
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|fonts).*)'],
}
