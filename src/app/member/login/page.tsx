"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Suspense } from 'react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const handleLineLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    signIn('line', { callbackUrl: '/member' });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-dark)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Background Effects */}
      <div className="bokeh-bg"></div>
      
      {/* Header / Nav */}
      <header style={{ padding: '2rem 5%', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10 }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <h1 style={{ fontFamily: '"Playfair Display", "Noto Serif Thai", serif', color: 'var(--primary)', fontSize: '1.8rem', letterSpacing: '2px', margin: 0, textShadow: '0 0 10px rgba(214,180,124,0.3)' }}>
            Mhami
          </h1>
        </Link>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 5%', zIndex: 10 }}>
        <div className="healing-card mockup-card fade-in" style={{ maxWidth: '500px', width: '100%', padding: '3.5rem 2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          
          <div style={{ position: 'absolute', top: '-50px', left: '-50px', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(214,180,124,0.15) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%' }}></div>
          <div style={{ position: 'absolute', bottom: '-50px', right: '-50px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(214,180,124,0.1) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%' }}></div>

          <i className="fas fa-sparkles" style={{ color: 'var(--primary)', fontSize: '2rem', marginBottom: '1.5rem', textShadow: '0 0 15px var(--primary-glow)' }}></i>
          
          <h2 style={{ color: 'var(--text-main)', marginBottom: '1rem', fontSize: '2rem', fontFamily: '"Playfair Display", "Noto Serif Thai", serif' }}>
            Your Healing Sanctuary
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '1rem', lineHeight: '1.6' }}>
            เข้าสู่ระบบเพื่อเช็คสถานะคิวคำทำนาย อ่านประวัติย้อนหลัง และจัดการข้อมูลชะตาของคุณ
          </p>

          {error && (
            <div style={{ backgroundColor: 'rgba(255,0,0,0.1)', border: '1px solid red', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', color: 'white' }}>
              <strong>พบปัญหาการล็อกอิน:</strong> {error}
            </div>
          )}

          <button 
            onClick={handleLineLogin}
            className="cozy-button" 
            style={{ 
              backgroundColor: '#00B900', 
              color: '#ffffff', 
              border: 'none', 
              width: '100%', 
              padding: '1rem', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '0.8rem',
              fontSize: '1.1rem',
              fontWeight: '500',
              boxShadow: '0 4px 15px rgba(0, 185, 0, 0.3)',
              marginBottom: '1.5rem'
            }}
          >
            <i className="fab fa-line" style={{ fontSize: '1.5rem' }}></i>
            เข้าสู่ระบบด้วย LINE
          </button>

          <div style={{ backgroundColor: 'rgba(214, 180, 124, 0.05)', border: '1px solid rgba(214, 180, 124, 0.2)', borderRadius: '1rem', padding: '1.2rem', textAlign: 'left', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <i className="fas fa-info-circle" style={{ color: 'var(--primary)', marginTop: '0.2rem' }}></i>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              <strong>สำคัญ:</strong> ระบบจะให้คุณเพิ่มเพื่อน Mhami Official Account อัตโนมัติ เพื่อไม่ให้พลาดการแจ้งเตือนคิวและคำทำนายของคุณค่ะ
            </p>
          </div>
          
        </div>
      </main>

      <footer style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', zIndex: 10 }}>
        © {new Date().getFullYear()} Mystic Matriarch. All rights reserved.
      </footer>
    </div>
  );
}

export default function MemberLogin() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
