import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      return NextResponse.json({ error: 'รหัสส่วนลดไม่ถูกต้อง' }, { status: 404 });
    }

    if (!coupon.isActive) {
      return NextResponse.json({ error: 'รหัสส่วนลดนี้ถูกปิดใช้งานแล้ว' }, { status: 400 });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({ error: 'รหัสส่วนลดนี้หมดอายุแล้ว' }, { status: 400 });
    }

    if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ error: 'รหัสส่วนลดนี้ถูกใช้ครบจำนวนที่กำหนดแล้ว' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discount: coupon.discount,
        discountType: coupon.discountType,
      }
    });

  } catch (error) {
    console.error('Coupon validation error:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการตรวจสอบรหัสส่วนลด' }, { status: 500 });
  }
}
