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

    const customerInfo = order.metadata ? JSON.parse(order.metadata as string) : null;
    let formattedCards: any[] = [];
    if (customerInfo && customerInfo.selectedCards && Array.isArray(customerInfo.selectedCards)) {
      if (serviceName === 'Mini Empower' || serviceName === 'Destiny Rewrite') {
        formattedCards = [
          customerInfo.selectedCards.slice(0, 3).map((n: number) => ({ num: n + 1 })),
          customerInfo.selectedCards.slice(3, 6).map((n: number) => ({ num: n + 1 })),
          customerInfo.selectedCards.slice(6, 9).map((n: number) => ({ num: n + 1 }))
        ];
      } else if (serviceName === 'Life Unveiled') {
        formattedCards = customerInfo.selectedCards.map((n: number) => ({ num: n + 1 }));
      }
    }

    return {
      id: order.orderNumber,
      name: order.user?.name || 'ลูกค้า',
      service: serviceName,
      status: serviceStage,
      date: order.createdAt.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' }),
      prediction: prediction,
      type: order.type,
      customerInfo: customerInfo,
      questions: order.questions || [],
      cards: formattedCards.length > 0 ? formattedCards : (serviceName === 'Life Unveiled' ? Array.from({length: 12}, (_, i) => ({num: i+1})) : [])
    };

  } catch (error) {
    console.error("Error fetching reading:", error);
    return null;
  }
}
