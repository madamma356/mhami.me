"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import crypto from 'crypto';

function getCloudinaryCredentials() {
  const url = process.env.CLOUDINARY_URL;
  if (!url) return null;
  // cloudinary://API_KEY:API_SECRET@CLOUD_NAME
  const regex = /cloudinary:\/\/([^:]+):([^@]+)@(.+)/;
  const match = url.match(regex);
  if (match) {
    return {
      apiKey: match[1],
      apiSecret: match[2],
      cloudName: match[3],
    };
  }
  return null;
}

export async function uploadToCloudinary(base64File: string, folder: string = 'mhami') {
  const creds = getCloudinaryCredentials();
  if (!creds) {
    console.error("Cloudinary credentials not found");
    return null;
  }

  const timestamp = Math.round((new Date()).getTime() / 1000).toString();
  
  // Signature = sha1(folder=mhami&timestamp=123123123API_SECRET)
  const strToSign = `folder=${folder}&timestamp=${timestamp}${creds.apiSecret}`;
  const signature = crypto.createHash('sha1').update(strToSign).digest('hex');

  const formData = new FormData();
  formData.append('file', base64File);
  formData.append('api_key', creds.apiKey);
  formData.append('timestamp', timestamp);
  formData.append('signature', signature);
  formData.append('folder', folder);

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${creds.cloudName}/upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error("Cloudinary Error:", errorText);
      return null;
    }
    
    const data = await res.json();
    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload exception:", error);
    return null;
  }
}

export async function createOrder(data: {
  serviceType: 'THREE_QUESTIONS' | 'PHROM_YAN' | 'CHANGE_DESTINY';
  slipBase64?: string;
  pricePaid: number;
  customerInfo: any;
  questions?: string[];
}) {
  try {
    const session = await getServerSession();
    if (!session || !session.user || !session.user.email) {
      return { success: false, error: "กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อ" };
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!dbUser) {
      return { success: false, error: "ไม่พบข้อมูลผู้ใช้" };
    }

    let slipUrl = null;
    if (data.slipBase64) {
      slipUrl = await uploadToCloudinary(data.slipBase64, 'slips');
    }

    // Generate Order Number
    const count = await prisma.order.count();
    const orderNumber = `ORD-${(count + 1).toString().padStart(3, '0')}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: dbUser.id,
        type: data.serviceType,
        status: 'PENDING',
        pricePaid: data.pricePaid,
        slipUrl: slipUrl || '',
        slipStatus: slipUrl ? 'unchecked' : 'none',
        metadata: JSON.stringify(data.customerInfo),
        questions: data.questions || []
      }
    });

    return { success: true, orderId: order.orderNumber };

  } catch (error: any) {
    console.error("Error creating order:", error);
    return { success: false, error: error.message };
  }
}
