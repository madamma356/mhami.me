import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  
  // Try to find blog in Database
  let blog = await prisma.blog.findUnique({
    where: { slug }
  });

  // If not found in DB, return 404
  if (!blog) {
    notFound();
  }

  if (!blog) {
    notFound();
  }

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '5rem', backgroundColor: 'var(--bg-main)' }}>
      {/* Header Image */}
      <div style={{ width: '100%', height: '40vh', minHeight: '300px', backgroundColor: 'rgba(0,0,0,0.5)', position: 'relative', overflow: 'hidden' }}>
        <img 
          src={blog.imageUrl || '/images/logo.png'} 
          alt={blog.title} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} 
        />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, rgba(26,24,22,0.1), var(--bg-main))' }}></div>
      </div>

      <main className="padding-mobile-sm" style={{ padding: '0 1rem', maxWidth: '800px', margin: '-100px auto 0', position: 'relative', zIndex: 10 }}>
        
        {/* Back Button */}
        <Link href="/blog" style={{ display: 'inline-block', marginBottom: '2rem', color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem', letterSpacing: '0.05em' }}>
          <i className="fas fa-arrow-left" style={{ marginRight: '0.5rem' }}></i> กลับสู่หน้าเรื่องราวดีๆ
        </Link>

        {/* Title */}
        <h1 style={{ fontFamily: '"Playfair Display", "Noto Serif Thai", serif', fontSize: 'clamp(2rem, 8vw, 3rem)', color: 'var(--text-main)', marginBottom: '1.5rem', lineHeight: '1.3', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
          {blog.title}
        </h1>
        
        {/* Date */}
        <div style={{ marginBottom: '3rem', color: 'rgba(214, 180, 124, 0.5)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span><i className="far fa-calendar-alt" style={{ marginRight: '0.5rem' }}></i> {new Date(blog.createdAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <span><i className="far fa-folder" style={{ marginRight: '0.5rem' }}></i> บทความฮีลใจ</span>
        </div>

        {/* Content */}
        <div 
          className="blog-content"
          style={{ color: 'var(--text-main)', fontSize: '1.1rem', lineHeight: '1.8', fontWeight: 300 }}
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Footer actions */}
        <div style={{ marginTop: '5rem', paddingTop: '2rem', borderTop: '1px solid rgba(214, 180, 124, 0.2)', display: 'flex', justifyContent: 'center' }}>
          <button className="cozy-button" style={{ padding: '0.8rem 2rem' }}>
            <i className="fas fa-heart" style={{ marginRight: '0.5rem' }}></i> ส่งต่อพลังบวก
          </button>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        .blog-content p {
          margin-bottom: 1.5rem;
        }
        .blog-content h2, .blog-content h3 {
          color: var(--primary);
          margin-top: 3rem;
          margin-bottom: 1rem;
          font-family: "Playfair Display", "Noto Serif Thai", serif;
        }
        .blog-content img {
          max-width: 100%;
          border-radius: 1rem;
          margin: 2rem 0;
        }
        .blog-content a {
          color: var(--primary);
          text-decoration: underline;
        }
      `}} />
    </div>
  );
}
