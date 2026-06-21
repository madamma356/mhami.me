import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  for (const user of users) {
    if (user.profileData) {
      let data = JSON.parse(user.profileData);
      data.ascendant = '';
      data.dob = '';
      data.birthTime = '';
      data.province = '';
      await prisma.user.update({
        where: { id: user.id },
        data: { profileData: JSON.stringify(data) }
      });
      console.log(`Cleared profile for ${user.email || user.name}`);
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
