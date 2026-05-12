"use client";

import React from 'react';

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 2rem 6rem', width: '100%' }}>
        
        {/* Header Section */}
        <section style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4rem', marginBottom: '6rem' }}>
          {/* Left: Image */}
          <div style={{ flex: '1', minWidth: '300px', position: 'relative' }}>
            <div style={{ position: 'relative', zIndex: 2, borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.8)' }}>
              <img src="/images/about-ma.jpg" alt="แม่ครูม้า" style={{ width: '100%', display: 'block', objectFit: 'cover' }} />
            </div>
            {/* Decorative border behind */}
            <div style={{ position: 'absolute', top: '-20px', left: '-20px', width: '100%', height: '100%', border: '2px solid var(--primary)', borderRadius: '1.5rem', zIndex: 1, opacity: 0.5 }}></div>
            {/* Soft glow */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '120%', height: '120%', background: 'radial-gradient(circle, rgba(214,180,124,0.15) 0%, transparent 70%)', zIndex: 0 }}></div>
          </div>

          {/* Right: Content */}
          <div style={{ flex: '1.5', minWidth: '300px' }}>
            <h1 style={{ fontFamily: '"Playfair Display", "Noto Serif Thai", serif', fontSize: '3rem', color: 'var(--primary)', marginBottom: '1.5rem', letterSpacing: '0.02em' }}>
              เรื่องราวของ "หม่ามี๊"
            </h1>
            
            <div style={{ backgroundColor: 'rgba(26, 24, 22, 0.7)', padding: '2rem', borderLeft: '4px solid var(--primary)', borderRadius: '0 1rem 1rem 0', marginBottom: '2.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)' }}>
              <p style={{ fontWeight: 600, fontSize: '1.4rem', marginBottom: '0.8rem', color: 'var(--text-main)', letterSpacing: '0.05em' }}>"LOVE YOUR SELF.</p>
              <p style={{ fontWeight: 400, fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>รักตัวเองให้เป็น จูนสมองให้รวย</p>
              <p style={{ fontWeight: 400, fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>...แล้วจักรวาล...</p>
              <p style={{ fontWeight: 500, fontSize: '1.3rem', color: 'var(--primary)', marginTop: '0.5rem' }}>จะคัดสรร 'สิ่งที่ดีที่สุด' มาให้เราเอง"</p>
            </div>

            <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: 'var(--text-main)', lineHeight: '1.8', fontWeight: 300 }}>
              จากประสบการณ์การเป็นพยาบาลวิชาชีพกว่า 10 ปี หม่ามี๊ได้เรียนรู้ว่าบาดแผลทางใจนั้นเจ็บปวดไม่แพ้บาดแผลทางกาย ความสนใจในการฝึกสติ (Mindfulness) ตั้งแต่วัยเด็ก เป็นรากฐานสำคัญที่ช่วยให้หม่ามี๊มองโลกด้วยความเข้าใจ
            </p>
            <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: 'var(--text-main)', lineHeight: '1.8', fontWeight: 300 }}>
              เมื่อผสานเข้ากับ <strong style={{ color: 'var(--primary)', fontWeight: 500 }}>'ศาสตร์แห่งโหราศาสตร์'</strong> ที่ศึกษาอย่างลึกซึ้ง หม่ามี๊จึงค้นพบว่า โหราศาสตร์ไม่ใช่เครื่องมือแห่งความงมงาย แต่เป็น <strong>'เข็มทิศ'</strong> ที่ช่วยให้เราเตรียมพร้อมรับมือ เข้าใจจังหวะชีวิต และมองเห็นแสงสว่างในวันที่มืดมิดที่สุด
            </p>
            <p style={{ marginBottom: '2rem', fontSize: '1.1rem', color: 'var(--text-main)', lineHeight: '1.8', fontWeight: 300 }}>
              พื้นที่แห่งนี้ ถูกสร้างขึ้นมาเพื่อเป็น 'ที่พึ่งเย็นใจ' หม่ามี๊พร้อมจะเป็นพี่สาวที่รับฟัง ช่วยหาคำตอบ และจับมือคุณเดินก้าวผ่านทุกปัญหา เพื่อให้คุณกลับมาเปล่งประกายและมีความสุขในแบบของตัวเองได้อีกครั้ง
            </p>
          </div>
        </section>

        {/* Credentials Section */}
        <section style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', justifyContent: 'center' }}>
            <div style={{ height: '1px', flex: 1, backgroundColor: 'rgba(214, 180, 124, 0.2)' }}></div>
            <h2 style={{ color: 'var(--primary)', fontSize: '1.5rem', letterSpacing: '0.05em' }}>ประวัติการศึกษาด้านพยากรณ์</h2>
            <div style={{ height: '1px', flex: 1, backgroundColor: 'rgba(214, 180, 124, 0.2)' }}></div>
          </div>

          <div style={{ backgroundColor: 'rgba(214, 180, 124, 0.03)', border: '1px solid rgba(214, 180, 124, 0.2)', borderRadius: '1.5rem', padding: '2.5rem', boxShadow: 'inset 0 0 30px rgba(214, 180, 124, 0.02)' }}>
            <ul style={{ listStyleType: 'none', paddingLeft: 0, margin: 0, color: 'var(--text-muted)', lineHeight: 2.2, fontSize: '1.1rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <span style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>✦</span>
                <span><strong>หลักสูตรเลขศาสตร์</strong> รุ่น ๑๒ สิงหาคม ๖๖</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <span style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>✦</span>
                <span><strong>หลักสูตรพรหมญาณพยากรณ์</strong> รุ่น ๙๐</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <span style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>✦</span>
                <span><strong>หลักสูตรกราฟชีวิต</strong> จากสถาบันพรหมญาณพยากรณ์ รุ่น ๒๑</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>✦</span>
                <span><strong>หลักสูตรโหราศาสตร์ ภาคพื้นฐาน</strong> รุ่น โหรานุภาพ 5G จาก สถาบันพยากรณ์ศาสตร์ อ.ลักษณ์ โหราธิบดี</span>
              </li>
            </ul>
          </div>
        </section>
        
      </main>

    </div>
  );
}
