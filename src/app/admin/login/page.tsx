"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // If already logged in, redirect to admin
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const isAdmin = localStorage.getItem('mhami_is_admin');
        if (isAdmin === 'true') {
          router.push('/admin');
        }
      } catch (e) {
        console.warn('localStorage read error', e);
      }
    }
  }, [router]);

  const handleLineLogin = () => {
    setIsLoading(true);
    
    // Simulate API request delay for LINE authentication
    setTimeout(() => {
      try {
        localStorage.setItem('mhami_is_admin', 'true');
      } catch (e) {
        console.warn('localStorage write error', e);
      }
      router.push('/admin');
      window.dispatchEvent(new Event('auth-change'));
    }, 1500);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-dark)',
      position: 'relative'
    }}>
      {/* Background Effect */}
      <div className="bokeh-bg"></div>

      <div className="healing-card mockup-card fade-in" style={{
        maxWidth: '400px',
        width: '90%',
        padding: '3rem',
        textAlign: 'center',
        position: 'relative',
        zIndex: 10
      }}>
        <Link href="/">
          <img src="/images/logo.png" alt="Mhami Logo" style={{ height: '60px', objectFit: 'contain', margin: '0 auto 2rem', display: 'block' }} />
        </Link>
        <h2 style={{ color: 'var(--primary)', marginBottom: '0.5rem', fontFamily: '"Playfair Display", "Noto Serif Thai", serif', fontSize: '1.8rem' }}>Admin Control Panel</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '0.9rem' }}>เข้าสู่ระบบด้วย LINE เพื่อจัดการข้อมูล</p>
        
        {isLoading ? (
          <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              width: '40px', height: '40px', 
              border: '3px solid rgba(214, 180, 124, 0.2)', 
              borderTopColor: 'var(--primary)', 
              borderRadius: '50%', 
              animation: 'spin 1s linear infinite' 
            }}></div>
            <p style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>กำลังยืนยันตัวตน...</p>
          </div>
        ) : (
          <button 
            onClick={handleLineLogin} 
            className="cozy-button filled" 
            style={{ 
              width: '100%', 
              padding: '1rem', 
              fontSize: '1rem',
              backgroundColor: '#00B900',
              borderColor: '#00B900',
              color: '#fff',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.8rem'
            }}
          >
            <i className="fab fa-line" style={{ fontSize: '1.5rem' }}></i>
            เข้าสู่ระบบด้วย LINE
          </button>
        )}

        <Link href="/" style={{ display: 'block', marginTop: '2.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', textDecoration: 'none' }}>
          <i className="fas fa-arrow-left" style={{ marginRight: '0.5rem' }}></i> กลับหน้าบ้าน
        </Link>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}
