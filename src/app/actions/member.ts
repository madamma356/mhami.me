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
    if (!session || !session.user) {
      return { user: { name: 'Error: Not authenticated' }, activeOrders: [], pastReadings: [] };
    }
    const sessionUser = session.user as any;
    const sessionEmail = session.user.email;
    const sessionId = sessionUser.id;

    if (!sessionEmail && !sessionId) {
      return { user: { name: 'Error: No session email or ID' }, activeOrders: [], pastReadings: [] };
    }

    let dbUser = null;

    // 1. Try to find by email (for new manual upserts)
    if (sessionEmail) {
      dbUser = await prisma.user.findUnique({
        where: { email: sessionEmail },
        include: {
          orders: {
            include: { readings: true },
            orderBy: { createdAt: 'desc' }
          }
        }
      });
    }

    // 2. Try to find by ID (for old PrismaAdapter tokens where ID is CUID)
    if (!dbUser && sessionId) {
      dbUser = await prisma.user.findUnique({
        where: { id: sessionId },
        include: {
          orders: {
            include: { readings: true },
            orderBy: { createdAt: 'desc' }
          }
        }
      });
    }

    // 3. Try to find by Account providerAccountId (if sessionId is LINE ID)
    if (!dbUser && sessionId) {
      const account = await prisma.account.findFirst({
        where: { provider: 'line', providerAccountId: sessionId },
        include: {
          user: {
            include: {
              orders: {
                include: { readings: true },
                orderBy: { createdAt: 'desc' }
              }
            }
          }
        }
      });
      if (account) dbUser = account.user;
    }

    if (!dbUser) {
      return { user: { name: `Error: User not found in DB. Session ID: ${sessionId}` }, activeOrders: [], pastReadings: [] };
    }

    // Parse profile data
    let profileData = {
      name: dbUser.name || '',
      nickname: '',
      dob: '',
      birthTime: '',
      province: '',
      phone: '',
      ascendant: ''
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
              order.type === 'PHROM_YAN' ? '12 Cards' : 'Blueprint',
        slipStatus: order.slipStatus,
        slipUrl: order.slipUrl
      };
    });

    const activeOrders = formattedOrders.filter(o => o.status !== 'พร้อมส่งมอบความสบายใจ');
    const pastReadings = formattedOrders.filter(o => o.status === 'พร้อมส่งมอบความสบายใจ');

    // Check if the user has completed their registration
    const isRegistered = !!(
      profileData.name &&
      profileData.dob &&
      profileData.birthTime &&
      profileData.province
    );

    return {
      user: { ...profileData, isRegistered },
      activeOrders,
      pastReadings
    };

  } catch (error: any) {
    console.error("Error fetching member data:", error);
    return { user: { name: `Error: ${error?.message || String(error)}` }, activeOrders: [], pastReadings: [] };
  }
}

export async function updateMemberProfile(data: any) {
  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session.user as any;
    const sessionEmail = session.user.email;
    const sessionId = sessionUser.id;

    if (!sessionEmail && !sessionId) {
      throw new Error("Not authenticated");
    }

    let userIdToUpdate = sessionId;

    // Find the correct User ID
    if (sessionEmail) {
      const u = await prisma.user.findUnique({ where: { email: sessionEmail } });
      if (u) userIdToUpdate = u.id;
    }
    
    if (!userIdToUpdate || userIdToUpdate.startsWith('U')) { // If it's a LINE ID
      const account = await prisma.account.findFirst({
        where: { provider: 'line', providerAccountId: sessionId },
        include: { user: true }
      });
      if (account) userIdToUpdate = account.user.id;
    }

    await prisma.user.update({
      where: { id: userIdToUpdate },
      data: {
        name: data.name,
        profileData: JSON.stringify({
          nickname: data.nickname || '',
          dob: data.dob || '',
          birthTime: data.birthTime || '',
          province: data.province || '',
          phone: data.phone || '',
          ascendant: data.ascendant || '' // Ensure we preserve ascendant
        })
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error };
  }
}

export async function reuploadSlip(orderNumber: string, slipBase64: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { success: false, error: "Not logged in" };

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return { success: false, error: "User not found" };

    const order = await prisma.order.findUnique({ where: { orderNumber } });
    if (!order || order.userId !== user.id) return { success: false, error: "Order not found" };

    // Upload new slip
    const { uploadToCloudinary } = await import('./checkout');
    const slipUrl = await uploadToCloudinary(slipBase64, 'slips');
    
    if (!slipUrl) return { success: false, error: "Failed to upload slip image" };

    await prisma.order.update({
      where: { id: order.id },
      data: {
        slipUrl,
        slipStatus: 'unchecked',
        status: 'PENDING'
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to reupload slip:", error);
    return { success: false, error: "Failed to reupload slip" };
  }
}
