"use client";

import React from 'react';
import HealingRoomInput from '@/components/HealingRoomInput';
import { mockVentingMessages } from '@/lib/mockDb';

export default function HealingSpacePage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 2rem 6rem', width: '100%' }}>
        
        {/* WHERE: HEALING SPACE */}
        <section style={{ padding: '6rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundImage: 'url(/images/where-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '2rem', marginBottom: '4rem', boxShadow: 'inset 0 0 100px rgba(0,0,0,0.8), 0 20px 40px rgba(0,0,0,0.5)', position: 'relative', overflow: 'hidden' }}>
          
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(17, 10, 7, 0.4), rgba(26, 18, 13, 0.6))', zIndex: 0 }}></div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem', width: '100%', justifyContent: 'center', zIndex: 1 }}>
            <div style={{ height: '1px', flex: '1', maxWidth: '300px', background: 'linear-gradient(90deg, transparent, rgba(214, 180, 124, 0.5))' }}></div>
            <h1 style={{ fontFamily: '"Playfair Display", "Noto Serif Thai", serif', fontWeight: 500, fontSize: '4.5rem', color: 'var(--text-main)', letterSpacing: '0.02em', textShadow: '0 4px 20px rgba(214,180,124,0.3)' }}>พื้นที่ฮีลใจ</h1>
            <div style={{ height: '1px', flex: '1', maxWidth: '300px', background: 'linear-gradient(-90deg, transparent, rgba(214, 180, 124, 0.5))' }}></div>
          </div>
          
          <p style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '0.5rem', zIndex: 1, fontWeight: 400, textShadow: '0 2px 10px rgba(214,180,124,0.4)' }}>พื้นที่ปลอดภัยของคุณ</p>
          <p style={{ fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '4rem', zIndex: 1, fontWeight: 300, letterSpacing: '2px', opacity: 0.9 }}>ระบาย. ปลดปล่อย. สูดลมหายใจ.</p>

          <div style={{ zIndex: 1, width: '100%' }}>
            <HealingRoomInput initialMessages={mockVentingMessages} />
          </div>
          
        </section>

      </main>

    </div>
  );
}
