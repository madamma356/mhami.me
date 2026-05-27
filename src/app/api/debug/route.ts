import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasClientId: !!process.env.LINE_CLIENT_ID,
    hasClientSecret: !!process.env.LINE_CLIENT_SECRET,
    clientIdLength: process.env.LINE_CLIENT_ID?.length || 0,
    clientSecretLength: process.env.LINE_CLIENT_SECRET?.length || 0,
    nextAuthUrl: process.env.NEXTAUTH_URL,
    nextAuthSecret: !!process.env.NEXTAUTH_SECRET,
  });
}
