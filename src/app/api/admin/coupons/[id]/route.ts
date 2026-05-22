import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();
    const { code, discount, discountType, isActive, maxUses, expiresAt } = data;

    const coupon = await prisma.coupon.update({
      where: { id: params.id },
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
    console.error("Error updating coupon:", error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "โค้ดนี้มีอยู่ในระบบแล้ว" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update coupon" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.coupon.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 });
  }
}
