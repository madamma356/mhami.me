import React from 'react';
import { prisma } from '@/lib/prisma';

export default async function HallOfLovePage() {
  const dbReviews = await prisma.review.findMany({
    where: { isVisible: true },
    orderBy: { createdAt: 'desc' }
  });
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 2rem 6rem', width: '100%' }}>
        
        {/* Header Section */}
        <section style={{ textAlign: 'center', marginBottom: '4rem', padding: '4rem 0 2rem' }}>
          <h1 style={{ fontFamily: '"Playfair Display", "Noto Serif Thai", serif', fontSize: '3.5rem', color: 'var(--primary)', marginBottom: '1rem', letterSpacing: '0.02em', textShadow: '0 4px 20px rgba(214,180,124,0.2)' }}>
            Hall of LOVE
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', fontWeight: 300 }}>
            ศูนย์รวมรีวิวแห่งความรักและพลังงานดีๆ จากผู้ที่เคยมารับคำปรึกษา
          </p>
        </section>

        {/* Reviews Grid */}
        <section>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem', width: '100%' }}>
            {dbReviews.map((review) => (
              <div key={review.id} className="healing-card mockup-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', lineHeight: '1.8', fontWeight: 300 }}>"{review.text}"</p>
                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <span style={{ color: 'var(--primary)', fontSize: '1.5rem' }}>⭐⭐⭐⭐⭐</span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--primary)', textAlign: 'right', fontWeight: 500 }}>
                    — {review.author}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

    </div>
  );
}
