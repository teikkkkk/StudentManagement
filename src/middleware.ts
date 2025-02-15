
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const roleCookie = request.cookies.get('role')?.value;
    let roles: string[] = [];
    if (roleCookie) {
        try {
            roles = JSON.parse(roleCookie); 
        } catch (error) {
            console.error('Failed to parse role cookie:', error);
        }
    }
    const protectedRoutes: { [key: string]: string[] } = {
        '/CreateQuiz': ['teacher', 'admin'],
        '/CreateQuestion': ['teacher', 'admin'],
        '/User':['admin'],
    };
    const pathname = request.nextUrl.pathname;
    if (protectedRoutes[pathname] && !protectedRoutes[pathname].some(role => roles.includes(role))) {
        return NextResponse.redirect(new URL('/403', request.url));
    }
    return NextResponse.next();  
}
export const config = {
    matcher: ['/CreateQuiz', '/CreateQuestion', '/User'], 
};
