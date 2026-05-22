import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding CMS data...');

  // 1. Seed Services
  const services = [
    {
      typeKey: 'THREE_QUESTIONS',
      title: 'Mini Empower (ไขข้อข้องใจ 3 คำถาม)',
      description: 'เปิดไพ่ตอบคำถามเน้นๆ 3 ข้อ พร้อมพื้นที่ระบายความในใจ',
      price: 195,
      imageUrl: 'https://images.unsplash.com/photo-1602498456745-e9503b30470b?w=800&auto=format&fit=crop',
      isActive: true
    },
    {
      typeKey: 'PHROM_YAN',
      title: 'Life Unveiled (เปิดชะตากับไพ่พรหมญาณ 12 ใบ)',
      description: 'วิเคราะห์พื้นดวงอย่างละเอียด พร้อมเจาะลึก 4 ด้านของชีวิต',
      price: 695,
      imageUrl: 'https://images.unsplash.com/photo-1517409267156-f56f140d34ab?w=800&auto=format&fit=crop',
      isActive: true
    },
    {
      typeKey: 'CHANGE_DESTINY',
      title: 'Destiny Rewrite (ออกแบบดวงชะตาชีวิตใหม่)',
      description: 'บริการจัดวางเบอร์มงคลเฉพาะบุคคล พร้อมฤกษ์มงคล',
      price: 8995,
      imageUrl: 'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=800&auto=format&fit=crop',
      isActive: true
    }
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { typeKey: s.typeKey },
      update: s,
      create: s
    });
  }
  console.log('✅ Services seeded');

  // 2. Seed Reviews
  const reviews = [
    {
      author: "น้องพลอยดาว",
      text: "หม่ามี๊คือพื้นที่ปลอดภัยจริงๆ ค่ะ การเปิดไพ่ 3 คำถามทำให้เราได้คำตอบที่ชัดเจนและตรงประเด็น โดยไม่รู้สึกว่าโดนตัดสินเลย แนะนำมากๆ สำหรับคนที่กำลังสับสน",
      rating: 5,
      isVisible: true
    },
    {
      author: "มัดหมี่",
      text: "ดีไซน์ห้องฮีลใจสวยและสงบมากๆ ค่ะ เข้ามาแล้วรู้สึกเหมือนได้รับการสวมกอดที่อบอุ่นและทำให้ใจเย็นลงได้จริงๆ",
      rating: 5,
      isVisible: true
    },
    {
      author: "ผู้ไม่ประสงค์ออกนาม",
      text: "แค่ได้พิมพ์ระบายความกังวลในพื้นที่ฮีลใจและมองดูมันลอยหายไป ก็รู้สึกโล่งใจขึ้นมาก ฟังดูเหมือนง่ายแต่มันช่วยเยียวยาได้จริงๆ ค่ะ",
      rating: 5,
      isVisible: true
    }
  ];

  for (const r of reviews) {
    const exists = await prisma.review.findFirst({ where: { text: r.text } });
    if (!exists) {
      await prisma.review.create({ data: r });
    }
  }
  console.log('✅ Reviews seeded');

  // 3. Seed Blogs
  const blogs = [
    {
      title: 'Self-Love: พลังแห่งการโอบกอดตัวเอง',
      slug: 'self-love-power',
      content: '<p>การรักตัวเองไม่ใช่ความเห็นแก่ตัว แต่คือจุดเริ่มต้นของการดึงดูดพลังงานดีๆ เข้ามาในชีวิต เมื่อเรารู้จักโอบกอดความไม่สมบูรณ์แบบของตัวเอง...</p>',
      imageUrl: '/images/blog_self_love.png',
      status: 'published'
    },
    {
      title: 'Manifestation: เสกสิ่งที่คิดให้เป็นความจริง',
      slug: 'manifest-reality',
      content: '<p>คุณรู้หรือไม่ว่าจิตใต้สำนึกของเรามีพลังมหาศาลในการดึงดูดสิ่งต่างๆ กฎแห่งแรงดึงดูด (Law of Attraction) จะทำงานได้ดีที่สุดเมื่อเราจูนคลื่นพลังงาน...</p>',
      imageUrl: '/images/blog_manifest.png',
      status: 'published'
    }
  ];

  for (const b of blogs) {
    await prisma.blog.upsert({
      where: { slug: b.slug },
      update: b,
      create: b
    });
  }
  console.log('✅ Blogs seeded');

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
