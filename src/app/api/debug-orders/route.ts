import { NextResponse } from 'next/server';
import { getAdminOrders } from '@/app/actions/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const orders = await getAdminOrders();
    return NextResponse.json({ success: true, count: orders.length, orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.toString(), stack: error.stack });
  }
}
