"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Navigation() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const isAdminUser = session?.user && (session.user as any).role === 'ADMIN';

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'หน้าแรก', path: '/' },
    { name: 'ดึงสติกับหม่ามี๊', path: '/destiny' },
    { name: 'พื้นที่ฮีลใจ', path: '/healing-space' },
    { name: 'เรื่องราวดีๆ', path: '/blog' },
    { name: 'Why Mhami?', path: '/about' },
    { name: 'Hall of LOVE', path: '/hall-of-love' },
  ];

  return (
    <nav style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      zIndex: 50,
      transition: 'all 0.3s ease-in-out',
      backgroundColor: isScrolled ? 'rgba(17, 10, 7, 0.85)' : 'transparent',
      backdropFilter: isScrolled ? 'blur(10px)' : 'none',
      borderBottom: isScrolled ? '1px solid rgba(214, 180, 124, 0.1)' : '1px solid transparent',
      padding: isScrolled ? '1rem 0' : '1.5rem 0'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 2rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none' }} onClick={() => setIsMobileMenuOpen(false)}>
          <img src="/images/logo.png" alt="Mhami Logo" style={{ height: isScrolled ? '35px' : '40px', objectFit: 'contain', transition: 'height 0.3s' }} />
        </Link>

        {/* Mobile Hamburger Button */}
        <div className="hidden-desktop block" style={{ zIndex: 60 }}>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '1.5rem', cursor: 'pointer' }}
          >
            <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>
        
        {/* Navigation Links - Desktop */}
        <div className="hidden-mobile" style={{ display: 'flex', gap: '2rem', alignItems: 'center', fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: 300 }}>
          {navLinks.map((link) => {
            const isActive = pathname === link.path || (link.path !== '/' && pathname.startsWith(link.path));
            return (
              <Link 
                key={link.name} 
                href={link.path} 
                style={{ 
                  textDecoration: 'none', 
                  color: isActive ? 'var(--primary)' : 'var(--text-main)',
                  transition: 'color 0.3s',
                  position: 'relative'
                }}
                className="nav-link"
              >
                {link.name}
                {isActive && (
                  <span style={{ position: 'absolute', bottom: '-4px', left: 0, width: '100%', height: '1px', backgroundColor: 'var(--primary)' }}></span>
                )}
              </Link>
            );
          })}
          
          {isAdminUser && (
            <Link 
              href="/admin" 
              style={{ 
                textDecoration: 'none', 
                color: 'var(--primary)',
                transition: 'color 0.3s',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(214, 180, 124, 0.1)',
                padding: '0.4rem 1rem',
                borderRadius: '2rem',
                border: '1px solid rgba(214, 180, 124, 0.3)'
              }}
              className="nav-link"
            >
              <i className="fas fa-crown"></i> Admin
            </Link>
          )}

          {/* Login / Profile Button */}
          <div style={{ marginLeft: '1rem' }}>
            {status === 'loading' ? (
              <div style={{ color: 'var(--text-muted)' }}>...</div>
            ) : session ? (
              <Link 
                href="/member"
                style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', padding: '0.3rem 0.8rem', borderRadius: '2rem', backgroundColor: 'rgba(214, 180, 124, 0.1)', border: '1px solid rgba(214, 180, 124, 0.3)' }}
              >
                <img 
                  src={session.user?.image || "/images/logo.png"} 
                  alt="Profile" 
                  style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--primary)' }} 
                  onError={(e) => { e.currentTarget.src = '/images/logo.png' }}
                />
                <span style={{ color: 'var(--primary)', fontSize: '0.85rem' }}>{session.user?.name || "คุณลูกค้า"}</span>
              </Link>
            ) : (
              <Link 
                href="/member/login"
                className="cozy-button" 
                style={{ textDecoration: 'none', padding: '0.5rem 1.2rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#00B900', color: '#fff', border: 'none' }}
              >
                <i className="fab fa-line" style={{ fontSize: '1.2rem' }}></i>
                เข้าสู่ระบบ
              </Link>
            )}
          </div>
        </div>

      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'rgba(17, 10, 7, 0.98)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(214, 180, 124, 0.2)',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          zIndex: 40
        }} className="hidden-desktop flex-col-mobile">
          {/* User Profile for Mobile */}
          <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid rgba(214, 180, 124, 0.1)', display: 'flex', justifyContent: 'center' }}>
            {status === 'loading' ? (
              <div style={{ color: 'var(--text-muted)' }}>...</div>
            ) : session ? (
              <Link 
                href="/member"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', padding: '0.5rem 1.2rem', borderRadius: '2rem', backgroundColor: 'rgba(214, 180, 124, 0.1)', border: '1px solid rgba(214, 180, 124, 0.3)' }}
              >
                <img 
                  src={session.user?.image || "/images/logo.png"} 
                  alt="Profile" 
                  style={{ width: '35px', height: '35px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--primary)' }} 
                  onError={(e) => { e.currentTarget.src = '/images/logo.png' }}
                />
                <span style={{ color: 'var(--primary)', fontSize: '1rem' }}>{session.user?.name || "คุณลูกค้า"}</span>
              </Link>
            ) : (
              <Link 
                href="/member/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="cozy-button" 
                style={{ textDecoration: 'none', padding: '0.8rem 1.5rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#00B900', color: '#fff', border: 'none', width: '100%', justifyContent: 'center' }}
              >
                <i className="fab fa-line" style={{ fontSize: '1.2rem' }}></i>
                เข้าสู่ระบบด้วย LINE
              </Link>
            )}
          </div>

          {navLinks.map((link) => {
            const isActive = pathname === link.path || (link.path !== '/' && pathname.startsWith(link.path));
            return (
              <Link 
                key={link.name} 
                href={link.path} 
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ 
                  textDecoration: 'none', 
                  color: isActive ? 'var(--primary)' : 'var(--text-main)',
                  transition: 'color 0.3s',
                  fontSize: '1.1rem',
                  textAlign: 'center',
                  fontWeight: isActive ? 500 : 300
                }}
              >
                {link.name}
              </Link>
            );
          })}
          
          {isAdminUser && (
            <Link 
              href="/admin" 
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ 
                textDecoration: 'none', 
                color: 'var(--primary)',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(214, 180, 124, 0.1)',
                padding: '0.8rem 1rem',
                borderRadius: '0.5rem',
                border: '1px solid rgba(214, 180, 124, 0.3)',
                marginTop: '0.5rem'
              }}
            >
              <i className="fas fa-crown"></i> จัดการระบบแอดมิน
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
