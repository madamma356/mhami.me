import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.service.update({
    where: { typeKey: 'THREE_QUESTIONS' },
    data: {
      title: 'แสงสว่างนำทาง (Guiding Light)',
      description: '✨ 3 คำถามเน้นๆ\n✨ เปิดไพ่ 3 ใบต่อคำถาม\n✨ สำหรับคนหน้ามืดตามัว',
      price: 395,
      imageUrl: '/images/service-1-new.png'
    }
  })

  await prisma.service.update({
    where: { typeKey: 'PHROM_YAN' },
    data: {
      title: 'ไขความลับชีวิต (Life Unveiled)',
      description: '✨ 12 ใบ ดูรวมทั้งชีวิต\n✨ สแกนกรรมทะลุปรุโปร่ง\n✨ เตรียมทิชชู่ไว้เช็ดน้ำตา',
      price: 695,
      imageUrl: '/images/service-2-phromyan.png'
    }
  })

  await prisma.service.update({
    where: { typeKey: 'CHANGE_DESTINY' },
    data: {
      title: 'พลิกชะตาฟ้าลิขิต (Destiny Rewrite)',
      description: '✨ โหราศาสตร์ไทยแบบจุกๆ\n✨ หาเบอร์มงคลพลิกชีวิต\n✨ สำหรับสายมูตัวแม่',
      price: 8995,
      imageUrl: '/images/service-3-new.png'
    }
  })

  console.log('Services updated successfully.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
