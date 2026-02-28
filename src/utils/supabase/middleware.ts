import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard')
    const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register')

    if (isProtectedRoute && !user) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    if (user) {
        const userRole = user.user_metadata?.role

        // Role-based routing enforcement
        if (request.nextUrl.pathname.startsWith('/dashboard/customer') && userRole !== 'customer') {
            const url = request.nextUrl.clone()
            url.pathname = userRole === 'worker' ? '/dashboard/worker' : '/login'
            return NextResponse.redirect(url)
        }

        if (request.nextUrl.pathname.startsWith('/dashboard/worker') && userRole !== 'worker') {
            const url = request.nextUrl.clone()
            url.pathname = userRole === 'customer' ? '/dashboard/customer' : '/login'
            return NextResponse.redirect(url)
        }

        // Redirect authenticated users away from auth pages
        if (isAuthRoute) {
            const url = request.nextUrl.clone()
            url.pathname = `/dashboard/${userRole || 'customer'}`
            return NextResponse.redirect(url)
        }
    }

    return supabaseResponse
}
