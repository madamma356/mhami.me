import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.ventingMessage.createMany({
    data: [
      { content: "เหนื่อยจังวันนี้ แต่ก็จะพยายามต่อไปนะ", isFloating: true },
      { content: "แวะมาฮีลใจ หวังว่าทุกคนจะผ่านวันที่แย่ๆ ไปได้", isFloating: true },
      { content: "ขอบคุณที่มีพื้นที่ให้บ่นนะ รู้สึกดีขึ้นนิดหน่อย", isFloating: true },
      { content: "อยากให้ตัวฉันในวันพรุ่งนี้เก่งขึ้นกว่าวันนี้", isFloating: true },
    ]
  })
  console.log('Seeded venting messages')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
