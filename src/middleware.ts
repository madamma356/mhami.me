import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get('host') || '';

  // 1. Force HTTPS in production
  // We check x-forwarded-proto because Railway uses a proxy
  const proto = request.headers.get('x-forwarded-proto');
  if (process.env.NODE_ENV === 'production' && proto && proto !== 'https') {
    url.protocol = 'https:';
    url.host = 'mhami.me';
    url.port = '';
    return NextResponse.redirect(url);
  }

  // 2. Force www.mhami.me to mhami.me
  if (process.env.NODE_ENV === 'production' && host.startsWith('www.')) {
    url.host = host.replace('www.', '');
    url.protocol = 'https:';
    url.port = '';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
