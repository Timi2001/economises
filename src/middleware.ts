import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req: NextRequest) {
  const token = req.headers.get('authorization')?.split(' ')[1];

  if (req.method !== 'GET') {
    if (!token) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    try {
      const { payload } = await jwtVerify(token, secret);
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set('x-user-id', payload.userId as string);
      return NextResponse.next({ headers: requestHeaders });
    } catch (error) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/posts/:path*',
};