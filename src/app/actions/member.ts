"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextAuthOptions } from "next-auth";

// We need to import authOptions, but it might not be exported from route.ts.
// Since we don't have an authOptions export in lib, we will just use the email.
// Wait, we can get session.user.email and find the user.

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getMemberData() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return { user: null, orders: [] };
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        orders: {
          include: { readings: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!dbUser) {
      return { user: null, orders: [] };
    }

    // Parse profile data
    let profileData = {
      name: dbUser.name || 'คุณลูกค้า',
      dob: '',
      birthTime: '',
      province: '',
      phone: '',
      lineId: ''
    };

    if (dbUser.profileData) {
      try {
        const parsed = JSON.parse(dbUser.profileData);
        profileData = { ...profileData, ...parsed };
      } catch (e) {}
    }

    // Format orders
    const formattedOrders = dbUser.orders.map(order => {
      let serviceName = order.type;
      let serviceStage = order.status === 'PENDING' ? 'กำลังเชื่อมต่อพลังงาน' : 
                         order.status === 'PROCESSING' ? 'กำลังเชื่อมต่อพลังงาน' : 
                         'พร้อมส่งมอบความสบายใจ';

      if (order.type === 'THREE_QUESTIONS') serviceName = 'Mini Empower';
      if (order.type === 'PHROM_YAN') serviceName = 'Life Unveiled';
      if (order.type === 'CHANGE_DESTINY') serviceName = 'Destiny Rewrite';

      return {
        id: order.orderNumber,
        service: serviceName,
        status: serviceStage,
        date: order.createdAt.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' }),
        type: order.type === 'THREE_QUESTIONS' ? '3 Questions' : 
              order.type === 'PHROM_YAN' ? '12 Cards' : 'Blueprint'
      };
    });

    const activeOrders = formattedOrders.filter(o => o.status !== 'พร้อมส่งมอบความสบายใจ');
    const pastReadings = formattedOrders.filter(o => o.status === 'พร้อมส่งมอบความสบายใจ');

    return {
      user: profileData,
      activeOrders,
      pastReadings
    };

  } catch (error) {
    console.error("Error fetching member data:", error);
    return { user: null, orders: [] };
  }
}

export async function updateMemberProfile(data: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      throw new Error("Not authenticated");
    }

    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: data.name,
        profileData: JSON.stringify(data)
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error };
  }
}
