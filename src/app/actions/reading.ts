"use server";

import { prisma } from "@/lib/prisma";

export async function getReadingById(id: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber: id },
      include: {
        user: true,
        readings: true
      }
    });

    if (!order) return null;

    let prediction = {};
    if (order.readings && order.readings.length > 0) {
      prediction = order.readings.reduce((acc, r) => {
        try {
          const parsed = JSON.parse(r.prediction);
          return { ...acc, ...parsed };
        } catch (e) {
          acc[`pos_${r.position}`] = r.prediction;
          return acc;
        }
      }, {} as any);
    }

    let serviceName = order.type;
    let serviceStage = order.status === 'PENDING' ? 'รับฝากหัวใจ' : 
                       order.status === 'PROCESSING' ? 'กำลังเชื่อมต่อพลังงาน' : 
                       'พร้อมส่งมอบความสบายใจ';

    if (order.type === 'THREE_QUESTIONS') serviceName = 'Mini Empower';
    if (order.type === 'PHROM_YAN') serviceName = 'Life Unveiled';
    if (order.type === 'CHANGE_DESTINY') serviceName = 'Destiny Rewrite';

    return {
      id: order.orderNumber,
      name: order.user?.name || 'ลูกค้า',
      service: serviceName,
      status: serviceStage,
      date: order.createdAt.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' }),
      prediction: prediction,
      type: order.type,
      customerInfo: order.metadata ? JSON.parse(order.metadata as string) : null,
      questions: order.questions || [],
      cards: order.readings.reduce((acc, r) => {
        acc[`pos_${r.position}`] = r.cards;
        return acc;
      }, {} as any)
    };

  } catch (error) {
    console.error("Error fetching reading:", error);
    return null;
  }
}
