import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(coupons);
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { code, discount, discountType, isActive, maxUses, expiresAt } = data;

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        discount: parseInt(discount),
        discountType,
        isActive: isActive ?? true,
        maxUses: maxUses ? parseInt(maxUses) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      }
    });

    return NextResponse.json({ success: true, coupon });
  } catch (error: any) {
    console.error("Error creating coupon:", error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "โค้ดนี้มีอยู่ในระบบแล้ว" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 });
  }
}
