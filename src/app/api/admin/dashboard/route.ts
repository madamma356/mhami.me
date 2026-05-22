import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // 1. Total Sales This Month
    const thisMonthOrders = await prisma.order.findMany({
      where: {
        createdAt: { gte: firstDayOfMonth },
        slipStatus: 'passed'
      },
      select: { pricePaid: true }
    });
    const totalSales = thisMonthOrders.reduce((sum, order) => sum + order.pricePaid, 0);

    // 2. Orders waiting for slip approval (Noti)
    const pendingSlipsCount = await prisma.order.count({
      where: { slipStatus: 'unchecked' }
    });

    // 3. Orders waiting for prediction (Noti)
    const pendingPredictionsCount = await prisma.order.count({
      where: {
        slipStatus: 'passed',
        status: { in: ['PENDING', 'PROCESSING'] }
      }
    });

    // 4. Total Customers
    const totalCustomers = await prisma.user.count({
      where: { role: 'USER' }
    });

    // 5. Recent Venting Messages (Last 24 hours)
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const recentVentingCount = await prisma.ventingMessage.count({
      where: { createdAt: { gte: yesterday } }
    });

    return NextResponse.json({
      totalSales,
      pendingSlipsCount,
      pendingPredictionsCount,
      totalCustomers,
      recentVentingCount
    });

  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
