import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const messages = await prisma.ventingMessage.findMany({
      where: {
        createdAt: {
          gte: twentyFourHoursAgo
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50 // Limit to 50 floating messages to not overwhelm the UI
    });
    
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching venting messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    if (!body.content || typeof body.content !== 'string' || body.content.trim() === '') {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
    }
    
    // Limit length to 500 characters
    const content = body.content.substring(0, 500);

    const newMessage = await prisma.ventingMessage.create({
      data: {
        content: content,
        isFloating: true
      }
    });
    
    return NextResponse.json(newMessage);
  } catch (error) {
    console.error('Error creating venting message:', error);
    return NextResponse.json({ error: 'Failed to create message' }, { status: 500 });
  }
}
