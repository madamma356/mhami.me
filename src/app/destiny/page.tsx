"use client";

import React from 'react';
import Link from 'next/link';

export default function DestinyPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>


      {/* HEADER */}
      <section style={{ textAlign: 'center', padding: '4rem 2rem 2rem' }}>
        <h1 style={{ fontFamily: '"Playfair Display", "Noto Serif Thai", serif', fontSize: '3.5rem', color: 'var(--primary)', marginBottom: '1rem', letterSpacing: '0.02em', textShadow: '0 4px 20px rgba(214,180,124,0.2)' }}>
          Choose Your Healing Path
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2rem', fontWeight: 300 }}>
          เลือกเส้นทางฮีลใจของคุณ... เพื่อให้เราช่วยเยียวยาและหาทางออกไปพร้อมกัน
        </p>
        <div style={{ display: 'inline-block', backgroundColor: 'rgba(214, 180, 124, 0.1)', border: '1px solid var(--primary)', padding: '0.5rem 1.5rem', borderRadius: '2rem' }}>
          <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--primary)' }}>✦</span> บริการพิมพ์พยากรณ์ส่ง (Text-based only)
          </p>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 2rem 6rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', width: '100%' }}>
        
        {/* Service 1: Awareness */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="healing-card mockup-card flex-1 w-full" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'relative' }}>
              <img src="/images/service-1-new.png" alt="ชุดเตือนสติ" className="healing-card-image" style={{ height: '250px', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'rgba(26, 24, 22, 0.8)', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '0.3rem 0.8rem', borderRadius: '1rem', fontSize: '0.8rem', backdropFilter: 'blur(5px)' }}>
                Hot 🔥
              </div>
            </div>
            <h3 style={{ color: 'var(--text-main)', marginBottom: '0.2rem', fontSize: '1.5rem', marginTop: '1.5rem' }}>แสงสว่างนำทาง</h3>
            <p style={{ color: 'var(--primary)', marginBottom: '1.5rem', fontSize: '1.1rem', fontStyle: 'italic' }}>(Guiding Light)</p>
            <div style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1rem', lineHeight: '1.8', flex: 1 }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}><span style={{ color: 'var(--primary)' }}>✨</span> 3 คำถามเน้นๆ</li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}><span style={{ color: 'var(--primary)' }}>✨</span> เปิดไพ่ 3 ใบต่อคำถาม</li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}><span style={{ color: 'var(--primary)' }}>✨</span> เหมาะสำหรับคนหน้ามืดตามัว</li>
              </ul>
            </div>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '1rem', border: '1px solid rgba(214, 180, 124, 0.2)', marginBottom: '1.5rem' }}>
              <span style={{ color: 'var(--text-muted)', textDecoration: 'line-through', fontSize: '0.9rem', display: 'block', marginBottom: '0.2rem' }}>ราคาปกติ 595.-</span>
              <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '1.5rem' }}>พิเศษ ฿395</span>
            </div>
            <a href="/consultation/awareness" style={{ textDecoration: 'none' }}>
              <button className="cozy-button filled" style={{ width: '100%', padding: '0.8rem', fontSize: '1rem' }}>รับคำปรึกษา</button>
            </a>
          </div>
        </div>

        {/* Service 2: Big Slap */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="healing-card mockup-card flex-1 w-full" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'relative' }}>
              <img src="/images/service-2-phromyan.png" alt="ชุดใหญ่แบบสับ" className="healing-card-image" style={{ height: '250px', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'rgba(26, 24, 22, 0.8)', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '0.3rem 0.8rem', borderRadius: '1rem', fontSize: '0.8rem', backdropFilter: 'blur(5px)' }}>
                Deep Healing 🌟
              </div>
            </div>
            <h3 style={{ color: 'var(--text-main)', marginBottom: '0.2rem', fontSize: '1.5rem', marginTop: '1.5rem' }}>ไขความลับชีวิต</h3>
            <p style={{ color: 'var(--primary)', marginBottom: '1.5rem', fontSize: '1.1rem', fontStyle: 'italic' }}>(Life Unveiled)</p>
            <div style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1rem', lineHeight: '1.8', flex: 1 }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}><span style={{ color: 'var(--primary)' }}>✨</span> 12 ใบ ดูรวมทั้งชีวิต</li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}><span style={{ color: 'var(--primary)' }}>✨</span> สแกนกรรมทะลุปรุโปร่ง</li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}><span style={{ color: 'var(--primary)' }}>✨</span> เตรียมทิชชู่ไว้เช็ดน้ำตา</li>
              </ul>
            </div>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '1rem', border: '1px solid rgba(214, 180, 124, 0.2)', marginBottom: '1.5rem' }}>
              <span style={{ color: 'var(--text-muted)', textDecoration: 'line-through', fontSize: '0.9rem', display: 'block', marginBottom: '0.2rem' }}>ราคาปกติ 895.-</span>
              <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '1.5rem' }}>พิเศษ ฿695</span>
            </div>
            <a href="/consultation/life-unveiled" style={{ textDecoration: 'none' }}>
              <button className="cozy-button filled" style={{ width: '100%', padding: '0.8rem', fontSize: '1rem' }}>สู้ชีวิตต่อ</button>
            </a>
          </div>
        </div>

        {/* Service 3: Change Destiny */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="healing-card mockup-card flex-1 w-full" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'relative' }}>
              <img src="/images/service-3-new.png" alt="อยากเปลี่ยนดวงชะตา" className="healing-card-image" style={{ height: '250px', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'rgba(214, 180, 124, 0.2)', border: '1px solid var(--primary)', color: '#fff', padding: '0.3rem 0.8rem', borderRadius: '1rem', fontSize: '0.8rem', backdropFilter: 'blur(5px)' }}>
                Premium ✨
              </div>
            </div>
            <h3 style={{ color: 'var(--text-main)', marginBottom: '0.2rem', fontSize: '1.5rem', marginTop: '1.5rem' }}>พลิกชะตาฟ้าลิขิต</h3>
            <p style={{ color: 'var(--primary)', marginBottom: '1.5rem', fontSize: '1.1rem', fontStyle: 'italic' }}>(Destiny Rewrite)</p>
            <div style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1rem', lineHeight: '1.8', flex: 1 }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}><span style={{ color: 'var(--primary)' }}>✨</span> โหราศาสตร์ไทยแบบจุกๆ</li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}><span style={{ color: 'var(--primary)' }}>✨</span> หาเบอร์มงคลพลิกชีวิต</li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}><span style={{ color: 'var(--primary)' }}>✨</span> สำหรับสายมูตัวแม่</li>
              </ul>
            </div>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '1rem', border: '1px solid rgba(214, 180, 124, 0.2)', marginBottom: '1.5rem' }}>
              <span style={{ color: 'var(--text-muted)', textDecoration: 'line-through', fontSize: '0.9rem', display: 'block', marginBottom: '0.2rem' }}>ราคาปกติ 12,695.-</span>
              <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '1.5rem' }}>พิเศษ ฿8,995</span>
            </div>
            <a href="/consultation/destiny-rewrite" style={{ textDecoration: 'none' }}>
              <button className="cozy-button filled" style={{ width: '100%', padding: '0.8rem', fontSize: '1rem', backgroundColor: 'var(--primary)', color: 'var(--bg-main)' }}>เปลี่ยนโชคชะตา</button>
            </a>
          </div>
        </div>

      </section>
    </div>
  );
}
