import { Client } from "@line/bot-sdk";

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || "",
  channelSecret: process.env.LINE_CHANNEL_SECRET || "", // This is the Messaging API secret, usually different from Login secret, but not strictly needed just to send push messages if token is provided.
};

const client = new Client(config);

export const sendLinePushNotification = async (userId: string, messages: any[]) => {
  if (!config.channelAccessToken) {
    console.warn("LINE_CHANNEL_ACCESS_TOKEN is missing. Skipping push notification.");
    return false;
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
