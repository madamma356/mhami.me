import { Client } from "@line/bot-sdk";

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || "",
  channelSecret: process.env.LINE_CHANNEL_SECRET || "", 
};

// Lazy initialization to prevent build crash when env vars are missing
let client: Client | null = null;

export const sendLinePushNotification = async (userId: string, messages: any[]) => {
  if (!config.channelAccessToken) {
    console.warn("LINE_CHANNEL_ACCESS_TOKEN is missing. Skipping push notification.");
    return false;
  }

  if (!client) {
    client = new Client(config);
  }

  try {
    await client.pushMessage(userId, messages);
    console.log(`Successfully sent push notification to ${userId}`);
    return true;
  } catch (error) {
    console.error(`Failed to send push notification to ${userId}:`, error);
    return false;
  }
};
