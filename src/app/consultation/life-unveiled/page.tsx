"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import CardPicker from '@/components/CardPicker';
import CheckoutStep from '@/components/CheckoutStep';
import { createOrder } from '@/app/actions/checkout';

export default function LifeUnveiledPage() {
  const [step, setStep] = useState(1);
  const [cards, setCards] = useState<number[]>([]);
  const [orderId, setOrderId] = useState('');

  // Step 1 Profile Information
  const [profileName, setProfileName] = useState('');
  const [career, setCareer] = useState('');
  const [status, setStatus] = useState('');
  const [story, setStory] = useState('');
  const [extraNote, setExtraNote] = useState('');

  const { status: authStatus } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.push('/member/login?callbackUrl=/consultation/life-unveiled');
    }
  }, [authStatus, router]);

  if (authStatus === 'loading' || authStatus === 'unauthenticated') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--bg-dark)' }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-spinner fa-spin" style={{ color: 'var(--primary)', fontSize: '3rem', marginBottom: '1rem' }}></i>
          <p style={{ color: 'var(--primary)' }}>กำลังตรวจสอบสถานะการเข้าสู่ระบบ...</p>
        </div>
      </div>
    );
  }

  const handleNext = () => {
    setStep(s => s + 1);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const StepIndicator = () => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', backgroundColor: 'rgba(214, 180, 124, 0.2)', zIndex: 0 }}></div>
      {[
        { num: 1, label: 'ข้อมูลส่วนตัว' },
        { num: 2, label: 'เลือกไพ่ 12 ใบ' },
        { num: 3, label: 'ชำระเงิน' },
        { num: 4, label: 'คำทำนาย' }
      ].map((s) => {
        const isActive = step >= s.num;
        const isCurrent = step === s.num;
        return (
          <div key={s.num} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, gap: '0.5rem' }}>
            <div style={{ 
              width: '40px', height: '40px', borderRadius: '50%', 
              backgroundColor: isActive ? 'var(--primary)' : '#1a1816',
              border: `1px solid ${isActive ? 'var(--primary)' : 'rgba(214, 180, 124, 0.3)'}`,
              color: isActive ? 'var(--bg-main)' : 'var(--text-muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 'bold', fontSize: '1.2rem',
              boxShadow: isCurrent ? '0 0 15px rgba(214, 180, 124, 0.4)' : 'none',
              transition: 'all 0.3s'
            }}>
              {s.num}
            </div>
            <span style={{ color: isActive ? 'var(--primary)' : 'var(--text-muted)', fontSize: '0.8rem', opacity: isCurrent ? 1 : 0.7 }}>{s.label}</span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>


      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 2rem 6rem', width: '100%' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontFamily: '"Playfair Display", "Noto Serif Thai", serif', fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '1rem' }}>
            ไขความลับชีวิต
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: 300, fontStyle: 'italic' }}>
            (Life Unveiled - 12 Cards)
          </p>
        </div>

        <StepIndicator />

        {/* Content Area */}
        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
          
          {/* STEP 1: INFORMATION */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                <div style={{ backgroundColor: 'rgba(26, 24, 22, 0.6)', border: '1px solid rgba(214, 180, 124, 0.2)', borderRadius: '1rem', padding: '2rem', backdropFilter: 'blur(10px)' }}>
                  <label style={{ display: 'block', color: 'var(--primary)', marginBottom: '0.8rem', fontSize: '1.1rem' }}>ชื่อของคุณ</label>
                  <input 
                    type="text" 
                    value={profileName} 
                    onChange={(e) => setProfileName(e.target.value)} 
                    style={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(214, 180, 124, 0.3)', borderRadius: '0.5rem', padding: '1rem', color: 'var(--text-main)', fontSize: '1rem', outline: 'none' }} 
                  />
                </div>
                <div style={{ backgroundColor: 'rgba(26, 24, 22, 0.6)', border: '1px solid rgba(214, 180, 124, 0.2)', borderRadius: '1rem', padding: '2rem', backdropFilter: 'blur(10px)' }}>
                  <label style={{ display: 'block', color: 'var(--primary)', marginBottom: '0.8rem', fontSize: '1.1rem' }}>อาชีพปัจจุบัน</label>
                  <input 
                    type="text" 
                    value={career} 
                    onChange={(e) => setCareer(e.target.value)} 
                    style={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(214, 180, 124, 0.3)', borderRadius: '0.5rem', padding: '1rem', color: 'var(--text-main)', fontSize: '1rem', outline: 'none' }} 
                  />
                </div>
              </div>

              <div style={{ backgroundColor: 'rgba(26, 24, 22, 0.6)', border: '1px solid rgba(214, 180, 124, 0.2)', borderRadius: '1rem', padding: '2rem', backdropFilter: 'blur(10px)' }}>
                <label style={{ display: 'block', color: 'var(--primary)', marginBottom: '1rem', fontSize: '1.1rem' }}>สถานภาพปัจจุบัน</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                  {['โสดสนิท', 'มีคนคุยแต่ไม่ให้สถานะ', 'มีแฟน/แต่งงานแล้ว', 'มีความซับซ้อน', 'อกหัก', 'หย่าร้าง'].map((s) => (
                    <label key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', backgroundColor: status === s ? 'rgba(214, 180, 124, 0.2)' : 'rgba(0,0,0,0.3)', border: `1px solid ${status === s ? 'var(--primary)' : 'rgba(214, 180, 124, 0.3)'}`, padding: '0.8rem 1.2rem', borderRadius: '0.5rem', transition: 'all 0.3s' }}>
                      <input 
                        type="radio" 
                        name="status" 
                        value={s} 
                        checked={status === s} 
                        onChange={() => setStatus(s)} 
                        style={{ accentColor: 'var(--primary)' }} 
                      />
                      <span style={{ color: 'var(--text-main)' }}>{s}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ backgroundColor: 'rgba(26, 24, 22, 0.6)', border: '1px solid rgba(214, 180, 124, 0.2)', borderRadius: '1rem', padding: '2rem', backdropFilter: 'blur(10px)' }}>
                <label style={{ display: 'block', color: 'var(--primary)', marginBottom: '0.8rem', fontSize: '1.1rem' }}>เรื่องราวที่อยากระบายให้หม่ามี๊ฟัง</label>
                <textarea 
                  rows={4} 
                  value={story} 
                  onChange={(e) => setStory(e.target.value)} 
                  style={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(214, 180, 124, 0.3)', borderRadius: '0.5rem', padding: '1rem', color: 'var(--text-main)', fontSize: '1rem', outline: 'none', resize: 'vertical' }} 
                  placeholder="เขียนอธิบายมาได้เต็มที่ พื้นที่นี้มีแต่ความเข้าใจ..." 
                />
              </div>

              <div style={{ backgroundColor: 'rgba(26, 24, 22, 0.6)', border: '1px solid rgba(214, 180, 124, 0.2)', borderRadius: '1rem', padding: '2rem', backdropFilter: 'blur(10px)' }}>
                <label style={{ display: 'block', color: 'var(--primary)', marginBottom: '0.8rem', fontSize: '1.1rem' }}>เรื่องเฉพาะที่อยากเน้นย้ำ</label>
                <input 
                  type="text" 
                  value={extraNote} 
                  onChange={(e) => setExtraNote(e.target.value)} 
                  style={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(214, 180, 124, 0.3)', borderRadius: '0.5rem', padding: '1rem', color: 'var(--text-main)', fontSize: '1rem', outline: 'none' }} 
                  placeholder="(ถ้ามี)..." 
                />
              </div>

              <button 
                onClick={handleNext}
                disabled={!profileName.trim() || !career.trim() || !status || !story.trim()}
                className="cozy-button filled"
                style={{ width: '100%', padding: '1rem', fontSize: '1.2rem', marginTop: '1rem', opacity: (!profileName.trim() || !career.trim() || !status || !story.trim()) ? 0.5 : 1, cursor: (!profileName.trim() || !career.trim() || !status || !story.trim()) ? 'not-allowed' : 'pointer' }}
              >
                ไปหน้าเลือกไพ่
              </button>
            </div>
          )}

          {/* STEP 2: CHOOSE CARDS */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              <div style={{ backgroundColor: 'rgba(214, 180, 124, 0.05)', border: '1px solid rgba(214, 180, 124, 0.3)', borderRadius: '1rem', padding: '2rem', textAlign: 'center' }}>
                <span style={{ fontSize: '2rem', color: 'var(--primary)', display: 'block', marginBottom: '1rem' }}>✨</span>
                <p style={{ color: 'var(--primary)', fontSize: '1.1rem', lineHeight: '1.8', fontStyle: 'italic', marginBottom: '0.5rem' }}>
                  "หลับตาลงช้าๆ ทำจิตใจให้สงบ นึกถึงสิ่งศักดิ์สิทธิ์ที่คุณเคารพนับถือ..."
                </p>
                <p style={{ color: 'var(--text-main)', fontSize: '1rem', lineHeight: '1.8', fontWeight: 300, marginBottom: '1.5rem' }}>
                  ขอเบิกทางให้การเปิดไพ่ในวันนี้ เป็นแสงสว่างนำทางในทุกปัญหาที่ติดขัด<br/>
                  ขอให้พลังงานดีๆ และครูบาอาจารย์ในหน้าไพ่ทุกใบ ช่วยสื่อสารคำทำนายได้อย่างแม่นยำและเกิดประโยชน์สูงสุด
                </p>
                <p style={{ color: 'var(--primary)', fontSize: '1.1rem', fontWeight: 500 }}>
                  เมื่อคุณพร้อมแล้ว... ค่อยๆ ลืมตาขึ้น แล้วเลือกไพ่ของคุณได้เลยค่ะ
                </p>
              </div>

              <CardPicker 
                maxCards={12} 
                onComplete={setCards} 
                title="ตั้งสติ สูดหายใจลึกๆ แล้วเลือกไพ่ 12 ใบ" 
                subtitle="ไพ่ 12 ใบนี้จะบอกภาพรวมชีวิตของคุณทั้งหมดในทุกๆ ด้านอย่างละเอียด"
              />
              <button 
                onClick={handleNext}
                disabled={cards.length !== 12}
                className="cozy-button filled"
                style={{ width: '100%', padding: '1rem', fontSize: '1.2rem', opacity: cards.length !== 12 ? 0.5 : 1, cursor: cards.length !== 12 ? 'not-allowed' : 'pointer' }}
              >
                ยืนยันไพ่ที่เลือก
              </button>
            </div>
          )}

          {/* STEP 3: CHECKOUT */}
          {step === 3 && (
            <CheckoutStep 
              price="695" 
              deliveryTime="หม่ามี๊จะเปิดไพ่ 12 ใบ และส่งผลคำทำนายแบบเจาะลึก 12 ด้านให้ทาง Profile ภายใน 1-2 วัน"
              selectedCards={cards}
              dividerEvery={4}
              onSubmit={async (data) => {
                const result = await createOrder({
                  serviceType: 'PHROM_YAN',
                  slipBase64: data.fileBase64 || undefined,
                  pricePaid: data.finalPrice,
                  customerInfo: {
                    name: profileName,
                    career,
                    status,
                    story,
                    extraNote,
                    selectedCards: cards
                  }
                });
                if (result.success && result.orderId) {
                  setOrderId(result.orderId);
                  setStep(4);
                } else {
                  alert(result.error || 'เกิดข้อผิดพลาดในการสั่งซื้อ กรุณาลองใหม่อีกครั้ง หรือติดต่อแอดมิน');
                }
              }}
            />
          )}

          {/* STEP 4: REVEAL / SUCCESS */}
          {step === 4 && (
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ color: 'var(--primary)', fontSize: '2.5rem', marginBottom: '1rem' }}>ไขความลับชีวิตของคุณ</h3>
              
              <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: 'rgba(214, 180, 124, 0.1)', borderRadius: '0.5rem', display: 'inline-block', border: '1px solid var(--primary)' }}>
                <p style={{ color: 'var(--primary)', fontSize: '1.2rem', margin: 0 }}>หมายเลขคำสั่งซื้อ: <span style={{ fontWeight: 'bold' }}>{orderId}</span></p>
              </div>

              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.6' }}>
                หม่ามี๊ได้รับข้อมูลและหน้าไพ่ของคุณเรียบร้อยแล้ว<br/>
                กรุณารอรับคำทำนายที่ Profile ของคุณภายใน 1-2 วันนะคะ
              </p>

              <div style={{ backgroundColor: 'rgba(0, 195, 0, 0.05)', border: '1px solid #00C300', borderRadius: '1rem', padding: '2rem', marginBottom: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <h4 style={{ color: '#00C300', fontSize: '1.3rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>อัปเกรดคำทำนาย (ฟรี!)</h4>
                <p style={{ color: 'var(--text-main)', fontSize: '1rem', lineHeight: '1.6', textAlign: 'center', fontWeight: 300 }}>
                  สำหรับบริการไพ่ 12 ใบ หากอ่านคำทำนายแล้วยังไม่ชัดเจน<br/>
                  คุณมีสิทธิ์ <b>นัดคิวคุยฮีลใจกับหม่ามี๊ 30 นาที</b> พร้อมเปิดไพ่ถามเพิ่มได้อีก 3 ใบ
                </p>
                <div style={{ width: '150px', height: '150px', borderRadius: '0.5rem', backgroundColor: '#fff', padding: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '1rem 0' }}>
                  <img src="/images/qr/line-madamma.png" alt="LINE QR" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '0.5rem' }}>แคปเจอร์หน้าจอนี้ (พร้อมเลข Order) แล้วส่งมาที่</p>
                  <p style={{ color: '#00C300', fontSize: '1.2rem', fontWeight: 'bold' }}>LINE ID: @madamma</p>
                  <a href="https://lin.ee/tVi0PyU" target="_blank" rel="noreferrer" className="cozy-button" style={{ borderColor: '#00C300', color: '#00C300', marginTop: '1.5rem', textTransform: 'none' }}>เพิ่มเพื่อนผ่านลิงก์</a>
                </div>
              </div>

              <div style={{ backgroundColor: 'rgba(26, 24, 22, 0.6)', border: '1px solid rgba(214, 180, 124, 0.2)', borderRadius: '1rem', padding: '2rem', marginBottom: '2rem', textAlign: 'left' }}>
                <h4 style={{ color: 'var(--primary)', marginBottom: '1rem', fontSize: '1.2rem', borderBottom: '1px solid rgba(214, 180, 124, 0.1)', paddingBottom: '0.5rem' }}>
                  ข้อมูลของคุณ: <span style={{ color: 'var(--text-main)' }}>{profileName}</span>
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}><span style={{ color: 'var(--text-main)' }}>อาชีพ:</span> {career}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}><span style={{ color: 'var(--text-main)' }}>สถานภาพ:</span> {status}</p>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.6', whiteSpace: 'pre-wrap', marginBottom: extraNote ? '1rem' : '0' }}>
                  <span style={{ color: 'var(--text-main)' }}>เรื่องราวที่อยากระบาย:</span><br/>
                  {story}
                </p>
                {extraNote && (
                  <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                    <span style={{ color: 'var(--text-main)' }}>เรื่องที่เน้นย้ำ:</span> {extraNote}
                  </p>
                )}
              </div>

              <div style={{ backgroundColor: 'rgba(26, 24, 22, 0.6)', border: '1px solid rgba(214, 180, 124, 0.2)', borderRadius: '1rem', padding: '2rem', marginBottom: '3rem', textAlign: 'left' }}>
                <h4 style={{ color: 'var(--text-main)', marginBottom: '1.5rem', fontSize: '1.2rem', textAlign: 'center' }}>หน้าไพ่ภาพรวมชีวิตของคุณ</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(45px, 80px))', justifyContent: 'center', gap: '1rem' }}>
                  {cards.map((cardId, i) => (
                    <div key={i} style={{ aspectRatio: '2/3', borderRadius: '6px', border: '1px solid var(--primary)', position: 'relative', overflow: 'hidden' }}>
                      <img src={`/images/cards/${cardId + 1}.png`} alt={`Card ${cardId + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.src = '/images/card-back.png' }} />
                      <div style={{ position: 'absolute', top: '4px', left: '4px', width: '20px', height: '20px', backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(214, 180, 124, 0.5)' }}>
                        <span style={{ color: '#fff', fontSize: '10px' }}>{i + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Link href="/">
                <button className="cozy-button filled" style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>
                  กลับสู่หน้าหลัก
                </button>
              </Link>
            </div>
          )}

        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
