import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const dbBlogs = await prisma.blog.findMany({
    where: { status: 'published' },
    orderBy: { createdAt: 'desc' }
  });
  
  const displayBlogs = dbBlogs.map(b => ({
    id: b.id,
    title: b.title,
    slug: b.slug,
    excerpt: b.content.substring(0, 150) + '...',
    imageUrl: b.imageUrl || '/images/logo.png',
    date: new Date(b.createdAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })
  }));
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <main className="padding-mobile-sm" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 2rem 6rem', width: '100%' }}>
        
        {/* Header Section */}
        <section style={{ textAlign: 'center', marginBottom: '4rem', padding: '4rem 0 2rem' }}>
          <h1 style={{ fontFamily: '"Playfair Display", "Noto Serif Thai", serif', fontSize: 'clamp(2.5rem, 8vw, 3.5rem)', color: 'var(--primary)', marginBottom: '1rem', letterSpacing: '0.02em', textShadow: '0 4px 20px rgba(214,180,124,0.2)' }}>
            เรื่องราวดีๆ
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', fontWeight: 300 }}>
            บทความฮีลใจและคำแนะนำดีๆ จากหม่ามี๊ เพื่อเติมพลังบวกในทุกๆ วัน
          </p>
        </section>

        {/* Articles Grid */}
        <section>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem', width: '100%' }}>
            {displayBlogs.map(article => (
              <div key={article.id} className="healing-card mockup-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '0', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '200px', backgroundColor: 'rgba(0,0,0,0.5)', overflow: 'hidden' }}>
                  <img src={article.imageUrl} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <h3 style={{ color: 'var(--primary)', marginBottom: '1rem', fontSize: '1.25rem', lineHeight: '1.5' }}>{article.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontWeight: 300, lineHeight: '1.6', flexGrow: 1 }}>{article.excerpt}</p>
                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'rgba(214, 180, 124, 0.5)' }}>{article.date}</span>
                  <Link href={`/blog/${article.slug}`}>
                    <button className="cozy-button" style={{ padding: '0.4rem 1.2rem', fontSize: '0.85rem', borderRadius: '1rem', cursor: 'pointer' }}>อ่านต่อ</button>
                  </Link>
                </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

    </div>
  );
}
