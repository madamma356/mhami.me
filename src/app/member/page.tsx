"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getMemberData, updateMemberProfile } from '@/app/actions/member';
import { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';

export default function MemberDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  // Mock User State
  const [user, setUser] = useState({
    name: 'กำลังโหลด...',
    nickname: '-',
    dob: '',
    birthTime: '',
    province: '-',
    phone: '-',
    ascendant: '',
    isRegistered: true
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...user });
  const [isLoading, setIsLoading] = useState(true);

  const handleSaveProfile = async () => {
    setUser({ ...editForm });
    setIsEditing(false);
    // API call to Supabase/backend
    await updateMemberProfile(editForm);
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  // Mock Data
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [pastReadings, setPastReadings] = useState<any[]>([]);

  const getAscendantStyle = (asc: string) => {
    if (!asc) return { color: 'var(--text-muted)', bg: 'rgba(255,255,255,0.05)', icon: 'fas fa-hourglass-half' };
    if (asc.includes('เมษ') || asc.includes('สิงห์') || asc.includes('ธนู')) return { color: '#ff7675', bg: 'rgba(255, 118, 117, 0.1)', icon: 'fas fa-fire' };
    if (asc.includes('พฤษภ') || asc.includes('กันย์') || asc.includes('มังกร')) return { color: '#e1b12c', bg: 'rgba(225, 177, 44, 0.1)', icon: 'fas fa-leaf' };
    if (asc.includes('เมถุน') || asc.includes('ตุลย์') || asc.includes('กุมภ์')) return { color: '#74b9ff', bg: 'rgba(116, 185, 255, 0.1)', icon: 'fas fa-wind' };
    if (asc.includes('กรกฎ') || asc.includes('พิจิก') || asc.includes('มีน')) return { color: '#0984e3', bg: 'rgba(9, 132, 227, 0.1)', icon: 'fas fa-water' };
    return { color: 'var(--primary)', bg: 'rgba(214, 180, 124, 0.1)', icon: 'fas fa-star' };
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/member/login');
    } else if (session?.user && (session.user as any).role === 'ADMIN') {
      router.push('/admin');
    }
  }, [status, session, router]);

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const data = await getMemberData();
        if (data && data.user) {
          // If we got real data, update state
          setUser(prev => ({ ...prev, ...data.user }));
          setEditForm(prev => ({ ...prev, ...data.user }));
          setActiveOrders(data.activeOrders);
          setPastReadings(data.pastReadings);
        }
      } catch (e) {
        // Fallback to mock data on error
      } finally {
        setIsLoading(false);
      }
    }
    fetchMemberData();
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-dark)', padding: '2rem 5%' }}>
      
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', borderBottom: '1px solid rgba(214, 180, 124, 0.2)', paddingBottom: '1rem' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <h1 style={{ fontFamily: '"Playfair Display", "Noto Serif Thai", serif', color: 'var(--primary)', fontSize: '1.8rem', letterSpacing: '2px', margin: 0 }}>
            Mhami
          </h1>
        </Link>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link href="/" className="cozy-button" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', backgroundColor: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)' }}>
            กลับหน้าแรก
          </Link>
          <button onClick={handleLogout} className="cozy-button" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', backgroundColor: 'rgba(255, 107, 129, 0.1)', color: '#ff6b81', border: '1px solid rgba(255, 107, 129, 0.3)' }}>
            ออกจากระบบ
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>
        
        {/* Left Column (Content) */}
        <div>
          {/* Welcome Section */}
          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ color: 'var(--primary)', fontSize: '2.5rem', fontFamily: '"Playfair Display", "Noto Serif Thai", serif', marginBottom: '0.5rem' }}>
              Your Healing Sanctuary
            </h2>
            <p style={{ color: 'var(--text-main)', fontSize: '1.2rem', fontWeight: 300 }}>
              ยินดีต้อนรับกลับมาค่ะ, <span style={{ color: 'var(--primary)', fontWeight: 500 }}>{user.name}</span>
            </p>
          </div>

          {/* Active Consultations */}
          <div style={{ marginBottom: '4rem' }}>
            <h3 style={{ color: 'var(--text-main)', fontSize: '1.5rem', marginBottom: '1.5rem', borderLeft: '4px solid var(--primary)', paddingLeft: '1rem' }}>
              สถานะคำทำนายปัจจุบัน
            </h3>
            
            {activeOrders.length > 0 ? (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {activeOrders.map(order => (
                  <div key={order.id} className="healing-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>ออเดอร์ {order.id} • {order.date}</span>
                      <h4 style={{ color: 'var(--primary)', fontSize: '1.2rem', margin: '0 0 0.5rem 0' }}>{order.service}</h4>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ display: 'inline-block', backgroundColor: 'rgba(214, 180, 124, 0.1)', color: 'var(--accent-bokeh)', padding: '0.5rem 1rem', borderRadius: '2rem', fontSize: '0.9rem', border: '1px solid rgba(255, 215, 0, 0.3)' }}>
                        <i className="fas fa-spinner fa-spin" style={{ marginRight: '0.5rem' }}></i>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>ไม่มีคำทำนายที่กำลังดำเนินการในขณะนี้</p>
            )}
          </div>

          {/* Past Readings */}
          <div>
            <h3 style={{ color: 'var(--text-main)', fontSize: '1.5rem', marginBottom: '1.5rem', borderLeft: '4px solid var(--primary)', paddingLeft: '1rem' }}>
              คลังคำทำนายย้อนหลัง
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {pastReadings.map(reading => (
                <div key={reading.id} className="healing-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{reading.date}</span>
                    <span style={{ color: 'var(--primary)', fontSize: '0.85rem' }}><i className="fas fa-star"></i> {reading.type}</span>
                  </div>
                  <h4 style={{ color: 'var(--text-main)', fontSize: '1.3rem', margin: '0 0 1.5rem 0', flex: 1 }}>{reading.service}</h4>
                  <Link href={`/reading/${reading.id}`} className="cozy-button filled" style={{ textAlign: 'center', width: '100%', textDecoration: 'none' }}>
                    อ่านผลทำนาย
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Profile) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '2rem' }}>
          
          {/* Registration Invitation Banner */}
          {!user.isRegistered && !isLoading && !isEditing && (
            <div 
              onClick={() => setIsEditing(true)}
              className="healing-card fade-in" 
              style={{ 
                padding: '1.5rem', 
                background: 'linear-gradient(135deg, rgba(214, 180, 124, 0.15) 0%, rgba(26, 24, 22, 0.8) 100%)',
                border: '1px solid var(--primary)',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              <h4 style={{ color: 'var(--primary)', margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
                <i className="fas fa-sparkles" style={{ marginRight: '0.5rem' }}></i> 
                คำนวณลัคนาราศีฟรี!
              </h4>
              <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: '1.5', margin: '0 0 1rem 0' }}>
                กรอกข้อมูลวันเกิดให้ครบ เพื่อให้หม่ามี๊คำนวณลัคนาราศีให้ฟรี! นำไปใช้ดูดวงใน Channel ได้แม่นยำยิ่งขึ้น ✨
              </p>
              <button className="cozy-button filled" style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}>
                คลิกเพื่อกรอกข้อมูล
              </button>
            </div>
          )}

          <div className="healing-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{ color: 'var(--primary)', margin: 0, fontSize: '1.3rem' }}>ข้อมูลชะตาของคุณ</h3>
              {!isEditing && (
                <button onClick={() => setIsEditing(true)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <i className="fas fa-edit" style={{ marginRight: '0.3rem' }}></i> แก้ไข
                </button>
              )}
            </div>

          {isEditing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'block', marginBottom: '0.3rem' }}>ชื่อ-นามสกุล</label>
                <input 
                  type="text" 
                  value={editForm.name} 
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="cozy-input"
                  placeholder="ชื่อ-นามสกุลจริง"
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'block', marginBottom: '0.3rem' }}>ชื่อเล่น</label>
                <input 
                  type="text" 
                  value={editForm.nickname} 
                  onChange={(e) => setEditForm({...editForm, nickname: e.target.value})}
                  className="cozy-input"
                  placeholder="ชื่อเล่น"
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'block', marginBottom: '0.3rem' }}>วัน/เดือน/ปีเกิด</label>
                <input 
                  type="date" 
                  value={editForm.dob} 
                  onChange={(e) => setEditForm({...editForm, dob: e.target.value})}
                  className="cozy-input"
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'block', marginBottom: '0.3rem' }}>เวลาเกิด</label>
                <input 
                  type="time" 
                  value={editForm.birthTime} 
                  onChange={(e) => setEditForm({...editForm, birthTime: e.target.value})}
                  className="cozy-input"
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'block', marginBottom: '0.3rem' }}>จังหวัดที่เกิด</label>
                <input 
                  type="text" 
                  value={editForm.province} 
                  onChange={(e) => setEditForm({...editForm, province: e.target.value})}
                  className="cozy-input"
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'block', marginBottom: '0.3rem' }}>เบอร์โทรศัพท์</label>
                <input 
                  type="text" 
                  value={editForm.phone} 
                  onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                  className="cozy-input"
                  style={{ width: '100%' }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button onClick={() => setIsEditing(false)} className="cozy-button" style={{ flex: 1, backgroundColor: 'transparent', border: '1px solid var(--text-muted)', color: 'var(--text-muted)' }}>
                  ยกเลิก
                </button>
                <button onClick={handleSaveProfile} className="cozy-button filled" style={{ flex: 1 }}>
                  บันทึก
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 0.3rem 0' }}>ลัคนาราศี (คำนวณจากเวลาเกิด)</p>
                {user.ascendant ? (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: getAscendantStyle(user.ascendant).bg, padding: '0.5rem 1rem', borderRadius: '0.5rem', border: `1px solid ${getAscendantStyle(user.ascendant).color}40` }}>
                    <i className={getAscendantStyle(user.ascendant).icon} style={{ color: getAscendantStyle(user.ascendant).color }}></i>
                    <span style={{ color: getAscendantStyle(user.ascendant).color, fontWeight: 'bold' }}>{user.ascendant}</span>
                  </div>
                ) : (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <i className="fas fa-hourglass-half" style={{ color: 'var(--text-muted)' }}></i>
                    <span style={{ color: 'var(--text-muted)' }}>รอหม่ามี๊คำนวณชะตา...</span>
                  </div>
                )}
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 0.3rem 0' }}>ชื่อ-นามสกุล</p>
                  <p style={{ color: 'var(--text-main)', margin: 0, fontSize: '1rem' }}>{user.name || '-'}</p>
                </div>
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 0.3rem 0' }}>ชื่อเล่น</p>
                  <p style={{ color: 'var(--text-main)', margin: 0, fontSize: '1rem' }}>{user.nickname || '-'}</p>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 0.3rem 0' }}>วัน/เดือน/ปีเกิด</p>
                  <p style={{ color: 'var(--text-main)', margin: 0, fontSize: '1rem' }}>{user.dob ? new Date(user.dob).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}</p>
                </div>
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 0.3rem 0' }}>เวลาเกิด</p>
                  <p style={{ color: 'var(--text-main)', margin: 0, fontSize: '1rem' }}>{user.birthTime || '-'}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 0.3rem 0' }}>จังหวัดที่เกิด</p>
                  <p style={{ color: 'var(--text-main)', margin: 0, fontSize: '1rem' }}>{user.province || '-'}</p>
                </div>
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 0.3rem 0' }}>เบอร์โทรศัพท์</p>
                  <p style={{ color: 'var(--text-main)', margin: 0, fontSize: '1rem' }}>{user.phone || '-'}</p>
                </div>
              </div>
              
              <div style={{ marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(214, 180, 124, 0.1)' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: '1.5', margin: 0 }}>
                  <i className="fas fa-info-circle" style={{ color: 'var(--primary)', marginRight: '0.3rem' }}></i>
                  ข้อมูลชะตาของคุณจะถูกเก็บเป็นความลับและนำไปใช้เพื่อเปิดไพ่และคำนวณดวงชะตาเท่านั้น
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
      
      {/* CSS for inputs and mobile responsiveness */}
      <style dangerouslySetInnerHTML={{__html: `
        .cozy-input {
          background-color: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(214, 180, 124, 0.3);
          color: var(--text-main);
          padding: 0.8rem 1rem;
          border-radius: 0.5rem;
          font-family: inherit;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }
        .cozy-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 10px rgba(214, 180, 124, 0.2);
        }
        @media (max-width: 900px) {
          .healing-card {
            padding: 1.5rem;
          }
          div[style*="grid-template-columns: 1fr 350px"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="position: sticky"] {
            position: relative !important;
            top: 0 !important;
          }
        }
      `}} />
    </div>
  );
}
