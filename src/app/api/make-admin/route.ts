import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    // อัปเดต User ทุกคนในระบบให้เป็น ADMIN ชั่วคราว (เพื่อแก้ปัญหาให้คุณแม่เข้าได้)
    await prisma.user.updateMany({
      data: { role: 'ADMIN' }
    });
    
    return NextResponse.json({ 
      success: true, 
      message: '🎉 อัปเดตสิทธิ์ให้เป็น ADMIN เรียบร้อยแล้วค่ะ! กรุณากลับไปที่หน้าเว็บ แล้วกดปุ่ม "ออกจากระบบ" และ "ล็อกอินใหม่" อีกครั้งนะคะ' 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
