import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function test() {
  try {
    const users = await prisma.user.findMany({
      include: {
        orders: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log("Raw users count:", users.length);
    if (users.length > 0) {
      console.log("First user:", users[0]);
    }
  } catch(e) {
    console.error("Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}
test();
