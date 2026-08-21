import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function DestinyPage() {
  const dbServices = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { price: 'asc' }
  });

  const originalPriceMap: Record<string, number> = {
    'THREE_QUESTIONS': 595,
    'PHROM_YAN': 895,
    'CHANGE_DESTINY': 12695
  };

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
        
        {dbServices.map((service) => {
          const titleMain = service.title.split(' (')[0];
          const titleSub = service.title.includes('(') ? `(${service.title.split(' (')[1]}` : '';
          
          let linkHref = '/consultation/awareness';
          let buttonText = 'รับคำปรึกษา';
          let badgeText = '';
          
          if (service.typeKey === 'PHROM_YAN') {
            linkHref = '/consultation/life-unveiled';
            buttonText = 'สู้ชีวิตต่อ';
            badgeText = 'Deep Healing 🌟';
          } else if (service.typeKey === 'CHANGE_DESTINY') {
            linkHref = '/consultation/destiny-rewrite';
            buttonText = 'เปลี่ยนโชคชะตา';
            badgeText = 'Premium ✨';
          } else {
            badgeText = 'Hot 🔥';
          }
          
          return (
            <div key={service.id} style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="healing-card mockup-card flex-1 w-full" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative' }}>
                  <img src={service.imageUrl || '/images/logo.png'} alt={titleMain} className="healing-card-image" style={{ height: '250px', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'rgba(26, 24, 22, 0.8)', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '0.3rem 0.8rem', borderRadius: '1rem', fontSize: '0.8rem', backdropFilter: 'blur(5px)' }}>
                    {badgeText}
                  </div>
                </div>
                <h3 style={{ color: 'var(--text-main)', marginBottom: '0.2rem', fontSize: '1.5rem', marginTop: '1.5rem' }}>{titleMain}</h3>
                <p style={{ color: 'var(--primary)', marginBottom: '1.5rem', fontSize: '1.1rem', fontStyle: 'italic' }}>{titleSub}</p>
                <div 
                  style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1rem', lineHeight: '1.8', flex: 1 }}
                  dangerouslySetInnerHTML={{ __html: service.description || '' }}
                />
                <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '1rem', border: '1px solid rgba(214, 180, 124, 0.2)', marginBottom: '1.5rem' }}>
                  {originalPriceMap[service.typeKey] && (
                    <span style={{ color: 'var(--text-muted)', textDecoration: 'line-through', fontSize: '0.9rem', display: 'block', marginBottom: '0.2rem' }}>
                      ราคาปกติ {originalPriceMap[service.typeKey].toLocaleString()}.-
                    </span>
                  )}
                  <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '1.5rem' }}>พิเศษ ฿{service.price.toLocaleString()}</span>
                </div>
                <a href={linkHref} style={{ textDecoration: 'none' }}>
                  <button className="cozy-button filled" style={{ width: '100%', padding: '0.8rem', fontSize: '1rem' }}>{buttonText}</button>
                </a>
              </div>
            </div>
          );
        })}

      </section>
    </div>
  );
}
