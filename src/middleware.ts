import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import getTokenPayload from './utils/getTokenPayload';
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {

    const tokenData: any = getTokenPayload(request);

    const path = request.nextUrl.pathname;

    const isPublicPath = path ==='/sign-in' || path === '/sign-up' || path === '/verify-email';
    const idSoctorPath = path ==='/list-appoinyment-doctor' || path === '/profile'
    const isPatientPath = path === '/create-appointment' || path ==='/list-appointment-patient' || path === '/profile'

    const token = request.cookies.get('token')?.value || '';

    if((isPublicPath && token) || (token && isPatientPath && tokenData.role === 'doctor') || (token && idSoctorPath && tokenData.role === 'patient')) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    if((!isPublicPath || idSoctorPath || isPatientPath) && !token) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/profile',
    '/create-appointment',
    '/list-appointment-patient',
    '/list-appointment-doctor',
    '/sign-in',
    '/sign-up',
    '/verify-email'
  ]
}