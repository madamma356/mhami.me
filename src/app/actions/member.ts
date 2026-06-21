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

function calculateThaiAscendant(dobStr: string, timeStr: string): string {
  if (!dobStr || !timeStr) return '';
  
  const dateParts = dobStr.split('-');
  if (dateParts.length !== 3) return '';
  
  let year = parseInt(dateParts[0]);
  let month = parseInt(dateParts[1]);
  let day = parseInt(dateParts[2]);
  
  const timeParts = timeStr.split(':');
  if (timeParts.length !== 2) return '';
  let hours = parseInt(timeParts[0]);
  let minutes = parseInt(timeParts[1]);

  // Astrological day starts at 06:00 AM standard
  const cutoffTime = 6;
  if (hours < cutoffTime) {
    hours += 24;
    // Subtract 1 day
    const d = new Date(year, month - 1, day);
    d.setDate(d.getDate() - 1);
    year = d.getFullYear();
    month = d.getMonth() + 1;
    day = d.getDate();
  }

  // Calculate total minutes elapsed since 06:00 AM of the astrological day
  const birthMinutesFrom6AM = ((hours - 6) * 60) + minutes;

  // Day of year calculation
  const startOfYear = new Date(year, 0, 0);
  const diff = (new Date(year, month - 1, day).getTime() - startOfYear.getTime()) + ((startOfYear.getTimezoneOffset() - new Date(year, month - 1, day).getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  // April 13 is roughly day 103 (start of Aries in Thai Astrology)
  let daysFromAries = dayOfYear - 103;
  if (daysFromAries < 0) daysFromAries += 365.25;

  // Sun's Longitude in degrees (0 to 360)
  const sunLongitude = (daysFromAries * (360 / 365.25)) % 360;
  
  let sunSign = Math.floor(sunLongitude / 30);
  let sunDegree = sunLongitude % 30;

  // Rising times for Bangkok (อันโตนาที) in minutes - sum is 1440
  // เมษ, พฤษภ, เมถุน, กรกฎ, สิงห์, กันย์, ตุลย์, พิจิก, ธนู, มังกร, กุมภ์, มีน
  const risingTimes = [105, 115, 130, 138, 138, 130, 115, 105, 104, 109, 120, 131];

  let remainingMinutes = birthMinutesFrom6AM;
  let currentSign = sunSign;
  
  // Subtract the remaining time of the Sun's current sign
  const fractionRemaining = (30 - sunDegree) / 30;
  let timeInCurrentSign = fractionRemaining * risingTimes[currentSign];

  if (remainingMinutes >= timeInCurrentSign) {
    remainingMinutes -= timeInCurrentSign;
    currentSign = (currentSign + 1) % 12;

    // Loop through the next signs
    while (remainingMinutes >= risingTimes[currentSign]) {
      remainingMinutes -= risingTimes[currentSign];
      currentSign = (currentSign + 1) % 12;
    }
  }

  const zodiacNames = [
    'ลัคนาราศีเมษ', 'ลัคนาราศีพฤษภ', 'ลัคนาราศีเมถุน', 
    'ลัคนาราศีกรกฎ', 'ลัคนาราศีสิงห์', 'ลัคนาราศีกันย์', 
    'ลัคนาราศีตุลย์', 'ลัคนาราศีพิจิก', 'ลัคนาราศีธนู', 
    'ลัคนาราศีมังกร', 'ลัคนาราศีกุมภ์', 'ลัคนาราศีมีน'
  ];
  
  return zodiacNames[currentSign];
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
    let existingUser = null;

    if (sessionEmail) {
      existingUser = await prisma.user.findUnique({ where: { email: sessionEmail } });
      if (existingUser) userIdToUpdate = existingUser.id;
    }
    
    if (!userIdToUpdate || userIdToUpdate.startsWith('U')) {
      const account = await prisma.account.findFirst({
        where: { provider: 'line', providerAccountId: sessionId },
        include: { user: true }
      });
      if (account) {
        userIdToUpdate = account.user.id;
        existingUser = account.user;
      }
    }

    // Check if data is already locked
    let currentProfile: any = {};
    if (existingUser?.profileData) {
      try { currentProfile = JSON.parse(existingUser.profileData); } catch(e) {}
    }

    // If DOB is already set, prevent overwriting
    const dob = currentProfile.dob ? currentProfile.dob : data.dob;
    const birthTime = currentProfile.birthTime ? currentProfile.birthTime : data.birthTime;
    const province = currentProfile.province ? currentProfile.province : data.province;

    // Calculate ascendant if not already calculated
    let ascendant = currentProfile.ascendant;
    if (!ascendant && dob && birthTime) {
      ascendant = calculateThaiAscendant(dob, birthTime);
    }

    await prisma.user.update({
      where: { id: userIdToUpdate },
      data: {
        name: data.name,
        profileData: JSON.stringify({
          nickname: data.nickname || '',
          dob: dob || '',
          birthTime: birthTime || '',
          province: province || '',
          phone: data.phone || '',
          ascendant: ascendant || ''
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
