import React from 'react';
import Link from 'next/link';
import HealingRoomInput from '@/components/HealingRoomInput';
import { mockReviews, mockArticles } from '@/lib/mockDb';
import { prisma } from '@/lib/prisma';

export default async function Home() {
  const dbBlogs = await prisma.blog.findMany({
    where: { status: 'published' },
    orderBy: { createdAt: 'desc' },
    take: 3
  });
  
  // Use DB blogs if available, otherwise fallback to mock articles
  const displayBlogs = dbBlogs.length > 0 ? dbBlogs.map(b => ({
    id: b.id,
    title: b.title,
    slug: b.slug,
    excerpt: b.content.substring(0, 150) + '...',
    imageUrl: b.imageUrl || '/images/logo.png'
  })) : mockArticles;
  return (
    <div style={{ minHeight: '100vh', paddingBottom: '5rem' }}>
      


      <main style={{ padding: '2rem 4rem', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* HERO */}
        <section style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <img src="/images/logo.png" alt="Mhami Logo" style={{ height: '120px', marginBottom: '0.5rem', objectFit: 'contain', filter: 'drop-shadow(0 4px 20px rgba(214,180,124,0.3))' }} />
          <p style={{ fontSize: '0.9rem', color: 'var(--primary)', letterSpacing: '0.3em', marginBottom: '2rem', textTransform: 'uppercase', opacity: 0.9 }}>THE SAFE PLACE</p>
          <p style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '1rem', fontWeight: 400 }}>
            ยินดีต้อนรับสู่ "หม่ามี๊ฮีลใจ"
          </p>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: '700px', lineHeight: '1.8', letterSpacing: '0.02em', fontWeight: 300 }}>
            พื้นที่ปลอดภัยที่จะช่วยให้คุณเตรียมพร้อมรับมือ เข้าใจจังหวะชีวิต และมองเห็นแสงสว่างในวันที่มืดมิดที่สุด ผ่าน "โหราศาสตร์ไทย" และ "ไพ่พรหมญาณ"
          </p>
          <a href="/destiny" style={{ textDecoration: 'none' }}>
            <button className="cozy-button filled">เข้าสู่ห้องฮีลใจ</button>
          </a>
        </section>

        {/* WHAT: DESTINY (Two Column Layout) */}
        <section style={{ display: 'flex', gap: '4rem', padding: '4rem 0', minHeight: '80vh', alignItems: 'center' }}>
          
          {/* Left Column: Titles */}
          <div style={{ flex: '0 0 350px' }}>
            <img src="/images/logo.png" alt="Mhami Logo" style={{ height: '80px', marginBottom: '4rem', objectFit: 'contain' }} />
            
            <h2 style={{ fontFamily: '"Playfair Display", "Noto Serif Thai", serif', fontSize: '6rem', color: 'var(--text-main)', lineHeight: '1', letterSpacing: '0.05em', marginBottom: '1rem' }}>WHAT</h2>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ height: '1px', width: '40px', backgroundColor: 'var(--primary)', opacity: 0.6 }}></div>
              <p style={{ fontSize: '1rem', color: 'var(--primary)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>บริการของเรา</p>
            </div>
            
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontStyle: 'italic', fontWeight: 300, paddingLeft: 'calc(40px + 1rem)', lineHeight: '1.6' }}>
              อะไรคือสิ่งที่ขัดขวางคุณ ไม่ให้ไปสู่บางสิ่งบางอย่างที่คุณปรารถนา<br/>
              มาร่วมหาคำตอบไปด้วยกันค่ะ
            </p>
          </div>

          {/* Right Column: Cards */}
          <div style={{ flex: '1', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
            
            {/* Card 1 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div className="healing-card mockup-card flex-1 w-full" style={{ display: 'flex', flexDirection: 'column' }}>
                <img src="/images/service-1-new.png" alt="แสงสว่างนำทาง" className="healing-card-image" style={{ height: '220px', objectFit: 'cover' }} />
                <h3 style={{ color: 'var(--text-main)', marginBottom: '0.2rem', fontSize: '1.4rem' }}>แสงสว่างนำทาง</h3>
                <p style={{ color: 'var(--primary)', marginBottom: '1rem', fontSize: '1rem', fontStyle: 'italic' }}>(Guiding Light)</p>
                <div style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem', lineHeight: '1.6', flex: 1 }}>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <li>✨ 3 คำถามเน้นๆ</li>
                    <li>✨ เปิดไพ่ 3 ใบต่อคำถาม</li>
                    <li>✨ สำหรับคนหน้ามืดตามัว</li>
                  </ul>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ color: 'var(--text-muted)', textDecoration: 'line-through', fontSize: '0.8rem' }}>ปกติ 595.-</span>
                    <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '1.2rem' }}>฿395</span>
                  </div>
                  <a href="/destiny" style={{ textDecoration: 'none' }}>
                    <button className="cozy-button" style={{ padding: '0.4rem 1.5rem', fontSize: '0.8rem' }}>รับคำปรึกษา</button>
                  </a>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div className="healing-card mockup-card flex-1 w-full" style={{ display: 'flex', flexDirection: 'column' }}>
                <Link href="/consultation/life-unveiled" style={{ textDecoration: 'none', display: 'block' }}>
                  <img src="/images/service-2-phromyan.png" alt="ไขความลับชีวิต" className="healing-card-image" style={{ height: '220px', objectFit: 'cover' }} />
                  <h3 style={{ color: 'var(--text-main)', marginBottom: '0.2rem', fontSize: '1.4rem' }}>ไขความลับชีวิต</h3>
                  <p style={{ color: 'var(--primary)', marginBottom: '1rem', fontSize: '1rem', fontStyle: 'italic' }}>(Life Unveiled)</p>
                  <div style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem', lineHeight: '1.6', flex: 1 }}>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <li>✨ 12 ใบ ดูรวมทั้งชีวิต</li>
                      <li>✨ สแกนกรรมทะลุปรุโปร่ง</li>
                      <li>✨ เตรียมทิชชู่ไว้เช็ดน้ำตา</li>
                    </ul>
                  </div>
                </Link>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ color: 'var(--text-muted)', textDecoration: 'line-through', fontSize: '0.8rem' }}>ปกติ 895.-</span>
                    <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '1.2rem' }}>฿695</span>
                  </div>
                  <a href="/destiny" style={{ textDecoration: 'none' }}>
                    <button className="cozy-button" style={{ padding: '0.4rem 1.5rem', fontSize: '0.8rem' }}>สู้ชีวิตต่อ</button>
                  </a>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div className="healing-card mockup-card flex-1 w-full" style={{ display: 'flex', flexDirection: 'column' }}>
                <img src="/images/service-3-new.png" alt="พลิกชะตาฟ้าลิขิต" className="healing-card-image" style={{ height: '220px', objectFit: 'cover' }} />
                <h3 style={{ color: 'var(--text-main)', marginBottom: '0.2rem', fontSize: '1.4rem' }}>พลิกชะตาฟ้าลิขิต</h3>
                <p style={{ color: 'var(--primary)', marginBottom: '1rem', fontSize: '1rem', fontStyle: 'italic' }}>(Destiny Rewrite)</p>
                <div style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem', lineHeight: '1.6', flex: 1 }}>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <li>✨ โหราศาสตร์ไทยแบบจุกๆ</li>
                    <li>✨ หาเบอร์มงคลพลิกชีวิต</li>
                    <li>✨ สำหรับสายมูตัวแม่</li>
                  </ul>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ color: 'var(--text-muted)', textDecoration: 'line-through', fontSize: '0.8rem' }}>ปกติ 12,695.-</span>
                    <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '1.2rem' }}>฿8,995</span>
                  </div>
                  <a href="/destiny" style={{ textDecoration: 'none' }}>
                    <button className="cozy-button" style={{ padding: '0.4rem 1.5rem', fontSize: '0.8rem' }}>เปลี่ยนโชคชะตา</button>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* WHERE: HEALING SPACE */}
        <section style={{ padding: '6rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundImage: 'url(/images/where-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '2rem', marginBottom: '4rem', boxShadow: 'inset 0 0 100px rgba(0,0,0,0.8), 0 20px 40px rgba(0,0,0,0.5)', position: 'relative', overflow: 'hidden' }}>
          
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(17, 10, 7, 0.4), rgba(26, 18, 13, 0.6))', zIndex: 0 }}></div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem', width: '100%', justifyContent: 'center', zIndex: 1 }}>
            <div style={{ height: '1px', flex: '1', maxWidth: '300px', background: 'linear-gradient(90deg, transparent, rgba(214, 180, 124, 0.5))' }}></div>
            <h2 style={{ fontFamily: '"Playfair Display", "Noto Serif Thai", serif', fontSize: '5rem', color: 'var(--text-main)', letterSpacing: '0.05em' }}>WHERE</h2>
            <div style={{ height: '1px', flex: '1', maxWidth: '300px', background: 'linear-gradient(-90deg, transparent, rgba(214, 180, 124, 0.5))' }}></div>
          </div>
          
          <p style={{ fontSize: '1.2rem', color: 'var(--primary)', marginBottom: '0.5rem', zIndex: 1 }}>พื้นที่ปลอดภัยของคุณ</p>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '4rem', zIndex: 1 }}>ระบาย. ปลดปล่อย. สูดลมหายใจ.</p>

          <div style={{ zIndex: 1, width: '100%' }}>
            <HealingRoomInput />
          </div>
          
        </section>

        {/* WHEN: ARTICLES */}
        <section style={{ padding: '6rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem', width: '100%', justifyContent: 'center' }}>
            <div style={{ height: '1px', flex: '1', maxWidth: '300px', background: 'linear-gradient(90deg, transparent, rgba(214, 180, 124, 0.5))' }}></div>
            <h2 style={{ fontFamily: '"Playfair Display", "Noto Serif Thai", serif', fontSize: '5rem', color: 'var(--text-main)', letterSpacing: '0.05em' }}>WHEN</h2>
            <div style={{ height: '1px', flex: '1', maxWidth: '300px', background: 'linear-gradient(-90deg, transparent, rgba(214, 180, 124, 0.5))' }}></div>
          </div>
          
          <p style={{ fontSize: '1.2rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>จังหวะเวลาและคำแนะนำ</p>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '4rem' }}>บทความฮีลใจ</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', width: '100%' }}>
            {displayBlogs.map(article => (
              <div key={article.id} className="healing-card mockup-card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ width: '100%', height: '180px', backgroundColor: 'rgba(0,0,0,0.5)', overflow: 'hidden' }}>
                  <img src={article.imageUrl} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <h3 style={{ color: 'var(--primary)', marginBottom: '1rem', fontSize: '1.25rem' }}>{article.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontWeight: 300, flexGrow: 1 }}>{article.excerpt}</p>
                <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
                  <Link href={`/blog/${article.slug}`}>
                    <button className="cozy-button" style={{ padding: '0.3rem 1rem', fontSize: '0.75rem', borderRadius: '1rem', cursor: 'pointer' }}>อ่านต่อ</button>
                  </Link>
                </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* WHY: THE MATRIARCH */}
        <section style={{ display: 'flex', gap: '4rem', padding: '6rem 0', alignItems: 'center' }}>
          
          {/* Left Column: Titles */}
          <div style={{ flex: '0 0 350px', textAlign: 'right' }}>
            <h2 style={{ fontFamily: '"Playfair Display", "Noto Serif Thai", serif', fontSize: '6rem', color: 'var(--text-main)', lineHeight: '1', letterSpacing: '0.05em', marginBottom: '1rem' }}>WHY</h2>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1rem', marginBottom: '0.5rem' }}>
              <p style={{ fontSize: '1rem', color: 'var(--primary)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>ทำไมต้องหม่ามี๊</p>
              <div style={{ height: '1px', width: '40px', backgroundColor: 'var(--primary)', opacity: 0.6 }}></div>
            </div>
          </div>

          {/* Right Column: Content */}
          <div style={{ flex: '1' }}>
            <div className="healing-card mockup-card" style={{ padding: '3rem' }}>
              <p style={{ color: 'var(--text-main)', lineHeight: '2', fontSize: '1.2rem', fontWeight: 300, fontStyle: 'italic' }}>
                "หม่ามี๊ก็จะแซ่บเหมือนเดิม แต่คงด่าน้อยลงหน่อย จะได้ไม่สร้างพลังลบจนเกินไป คนจะได้อยากเข้ามาพักพิงใจ ไม่อยากเป็นเว็บหมอดูจ๋าๆ แต่อยากเป็นพื้นที่ให้คนมาค้นหาคำตอบ ของทุกคำถามในชีวิต..."
              </p>
            </div>
          </div>
        </section>

        {/* HOW: WALL OF LOVE */}
        <section style={{ padding: '6rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '4rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem', width: '100%', justifyContent: 'center' }}>
            <div style={{ height: '1px', flex: '1', maxWidth: '300px', background: 'linear-gradient(90deg, transparent, rgba(214, 180, 124, 0.5))' }}></div>
            <h2 style={{ fontFamily: '"Playfair Display", "Noto Serif Thai", serif', fontSize: '5rem', color: 'var(--text-main)', letterSpacing: '0.05em' }}>HOW</h2>
            <div style={{ height: '1px', flex: '1', maxWidth: '300px', background: 'linear-gradient(-90deg, transparent, rgba(214, 180, 124, 0.5))' }}></div>
          </div>
          
          <p style={{ fontSize: '1.2rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>กำแพงแห่งความรัก</p>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '4rem' }}>รีวิวจากลูกค้าที่น่ารัก</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', width: '100%' }}>
            {mockReviews.map((review) => (
              <div key={review.id} className="healing-card mockup-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', lineHeight: '1.8', fontWeight: 300 }}>"{review.text}"</p>
                <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--primary)', textAlign: 'right', fontWeight: 500 }}>
                  — {review.author}
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      <style>{`
        .nav-link:hover {
          color: var(--primary) !important;
        }
        .mockup-card {
          border-radius: 1.5rem;
          padding: 1.25rem;
          background: linear-gradient(160deg, rgba(40, 30, 25, 0.6) 0%, rgba(15, 10, 8, 0.8) 100%);
          border: 1px solid rgba(214, 180, 124, 0.4);
          box-shadow: 0 10px 30px rgba(0,0,0,0.8), inset 0 0 20px rgba(214, 180, 124, 0.1);
          width: 100%;
        }
        .mockup-card .healing-card-image {
          border-radius: 1rem;
          margin-bottom: 1.25rem;
        }
      `}</style>
    </div>
  );
}
