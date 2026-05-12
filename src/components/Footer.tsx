"use client";

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: 'rgba(26, 24, 22, 0.6)', padding: '3rem 1.5rem', textAlign: 'center', borderTop: '1px solid rgba(214, 180, 124, 0.1)', marginTop: 'auto', backdropFilter: 'blur(10px)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <img src="/images/logo.png" alt="Mhami Logo" style={{ height: '50px', objectFit: 'contain', margin: '0 auto 1.5rem', display: 'block' }} />
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '1.5rem' }}>
          {/* Facebook */}
          <a href="https://www.facebook.com/maecoolma" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', transition: 'color 0.3s', fontSize: '1.5rem' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
            <i className="fab fa-facebook"></i>
          </a>
          
          {/* Instagram */}
          <a href="https://instagram.com/maecoolma" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', transition: 'color 0.3s', fontSize: '1.5rem' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
            <i className="fab fa-instagram"></i>
          </a>

          {/* LINE */}
          <a href="https://lin.ee/tVi0PyU" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', transition: 'color 0.3s', fontSize: '1.5rem' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
            <i className="fab fa-line"></i>
          </a>

          {/* TikTok */}
          <a href="https://tiktok.com/@maecoolma" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', transition: 'color 0.3s', fontSize: '1.5rem' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
            <i className="fab fa-tiktok"></i>
          </a>
        </div>
        
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
          &copy; 2026 mhami. All rights reserved. | <Link href="#" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Privacy Policy (Safe Space Guarantee)</Link>
        </p>
      </div>
    </footer>
  );
}

