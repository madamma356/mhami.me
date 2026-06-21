"use server";

import { prisma } from "@/lib/prisma";
import { uploadToCloudinary } from "./checkout";

export async function getAdminOrders() {
  try {
    const orders = await prisma.order.findMany({
      include: { 
        user: true, 
        readings: true 
      },
      orderBy: { createdAt: 'desc' }
    });
    
    // Map Prisma models to the UI shape expected by the frontend
    return orders.map(order => {
      // Parse metadata if exists
      let customerInfo = {};
      if (order.metadata) {
        try { customerInfo = JSON.parse(order.metadata); } catch(e) {}
      } else if (order.user?.profileData) {
        try { customerInfo = JSON.parse(order.user.profileData); } catch(e) {}
      }

      // Try to construct a readable prediction format from readings
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

      // Map service types to display names
      let serviceName = order.type;
      let serviceStage = order.status === 'PENDING' ? 'รับฝากหัวใจ' : 
                         order.status === 'PROCESSING' ? 'กำลังเชื่อมต่อพลังงาน' : 
                         'พร้อมส่งมอบความสบายใจ';

      if (order.type === 'THREE_QUESTIONS') serviceName = 'Mini Empower';
      if (order.type === 'PHROM_YAN') serviceName = 'Life Unveiled';
      if (order.type === 'CHANGE_DESTINY') serviceName = 'Destiny Rewrite';

      let formattedCards: any[] = [];
      if (customerInfo.selectedCards && Array.isArray(customerInfo.selectedCards)) {
        if (serviceName === 'Mini Empower' || serviceName === 'Destiny Rewrite') {
          // Group into arrays of 3 cards for each question
          formattedCards = [
            customerInfo.selectedCards.slice(0, 3).map((n: number) => ({ num: n + 1 })),
            customerInfo.selectedCards.slice(3, 6).map((n: number) => ({ num: n + 1 })),
            customerInfo.selectedCards.slice(6, 9).map((n: number) => ({ num: n + 1 }))
          ];
        } else if (serviceName === 'Life Unveiled') {
          // Flat array of 12 cards
          formattedCards = customerInfo.selectedCards.map((n: number) => ({ num: n + 1 }));
        }
      }

      return {
        id: order.orderNumber, // e.g. ORD-001
        dbId: order.id,
        date: order.createdAt.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' }),
        name: order.user?.name || 'ลูกค้า',
        lineId: order.contactInfo || '-',
        service: serviceName,
        price: `${order.pricePaid}.-`,
        slipUrl: order.slipUrl || 'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?q=80&w=600&auto=format&fit=crop',
        slipStatus: order.slipStatus === 'passed' ? 'approved' : 
                    order.slipStatus === 'unchecked' ? 'pending' : order.slipStatus,
        serviceStage: serviceStage,
        prediction: prediction,
        customerInfo: {
          name: order.user?.name,
          ...customerInfo
        },
        questions: order.questions || [],
        cards: formattedCards
      };
    });
  } catch (error) {
    console.error("Error fetching admin orders:", error);
    return [];
  }
}

export async function updateAdminPrediction(dbId: string, predictionData: any) {
  try {
    await prisma.reading.upsert({
      where: {
        orderId_position: {
          orderId: dbId,
          position: 0
        }
      },
      update: {
        prediction: JSON.stringify(predictionData)
      },
      create: {
        orderId: dbId,
        position: 0,
        cards: [],
        prediction: JSON.stringify(predictionData)
      }
    });

    await prisma.order.update({
      where: { id: dbId },
      data: { status: 'COMPLETED' }
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating prediction:", error);
    return { success: false, error };
  }
}

export async function updateOrderStatus(dbId: string, slipStatus: string, serviceStage: string) {
  try {
    let newStatus: any = 'PENDING';
    if (serviceStage === 'กำลังเชื่อมต่อพลังงาน') newStatus = 'PROCESSING';
    if (serviceStage === 'พร้อมส่งมอบความสบายใจ') newStatus = 'COMPLETED';

    await prisma.order.update({
      where: { id: dbId },
      data: {
        slipStatus,
        status: newStatus
      }
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating status:", error);
    return { success: false, error };
  }
}

export async function uploadAdminPdf(dbId: string, pdfBase64: string) {
  try {
    const pdfUrl = await uploadToCloudinary(pdfBase64, 'blueprints');
    if (!pdfUrl) {
      return { success: false, error: "อัปโหลดไฟล์ไม่สำเร็จ" };
    }

    // We will save the PDF URL in a reading with position 0 or save it to order metadata
    // Or just store it as `pdfUrl` in predictionData
    // Let's create a Reading for it
    await prisma.reading.upsert({
      where: {
        orderId_position: {
          orderId: dbId,
          position: 0
        }
      },
      update: {
        prediction: JSON.stringify({ pdfUrl })
      },
      create: {
        orderId: dbId,
        position: 0,
        cards: [],
        prediction: JSON.stringify({ pdfUrl })
      }
    });

    await prisma.order.update({
      where: { id: dbId },
      data: { status: 'COMPLETED' }
    });

    return { success: true, pdfUrl };
  } catch (error) {
    console.error("Error uploading admin PDF:", error);
    return { success: false, error };
  }
}

export async function getAllCustomers() {
  try {
    const users = await prisma.user.findMany({
      include: {
        orders: true
      }
    });

    return users.map(user => {
      let profileData: any = {};
      try {
        if (user.profileData) {
          profileData = JSON.parse(user.profileData);
        }
      } catch (e) {}

      // Identify VIP based on orders count
      const ordersCount = user.orders?.length || 0;
      const status = ordersCount > 3 ? 'VIP' : 'Active';
      const statusColor = ordersCount > 3 ? 'var(--primary)' : '#33d9b2';

      return {
        id: user.id || 'unknown',
        name: user.name || 'คุณลูกค้า',
        nickname: profileData.nickname || '',
        contact: profileData.phone || user.email || '-',
        lineId: profileData.lineId || '-',
        date: user.orders && user.orders.length > 0 ? user.orders[0].createdAt.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' }) : '-',
        orders: ordersCount,
        status: status,
        statusColor: statusColor,
        dob: profileData.dob || '-',
        birthTime: profileData.birthTime || '-',
        province: profileData.province || '-',
        ascendant: profileData.ascendant || ''
      };
    });
  } catch (error: any) {
    console.error("Error fetching all customers:", error);
    return [{
      id: 'ERR',
      name: 'Error: ' + (error?.message || 'Unknown error'),
      nickname: '',
      contact: '-',
      lineId: '-',
      date: '-',
      orders: 0,
      status: 'Error',
      statusColor: '#ff0000',
      dob: '-',
      birthTime: '-',
      province: '-',
      ascendant: ''
    }];
  }
}

export async function updateCustomerAscendant(userId: string, ascendant: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) return { success: false, error: 'User not found' };

    let profileData: any = {};
    try {
      if (user.profileData) {
        profileData = JSON.parse(user.profileData);
      }
    } catch (e) {}

    profileData.ascendant = ascendant;

    await prisma.user.update({
      where: { id: userId },
      data: {
        profileData: JSON.stringify(profileData)
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating customer ascendant:", error);
    return { success: false, error };
  }
}

