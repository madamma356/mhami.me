"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import CardPicker from '@/components/CardPicker';
import CheckoutStep from '@/components/CheckoutStep';
import { createOrder } from '@/app/actions/checkout';

export default function AwarenessPage() {
  const [step, setStep] = useState(1);
  const [cards1, setCards1] = useState<number[]>([]);
  const [cards2, setCards2] = useState<number[]>([]);
  const [cards3, setCards3] = useState<number[]>([]);
  
  const [orderId, setOrderId] = useState('');
  
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [q3, setQ3] = useState('');

  // Step 1 Profile Information
  const [profileName, setProfileName] = useState('');
  const [story, setStory] = useState('');

  const handleNext = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(s => s + 1);
  };

  const StepIndicator = () => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', backgroundColor: 'rgba(214, 180, 124, 0.2)', zIndex: 0 }}></div>
      {[
        { num: 1, label: 'ข้อมูลของคุณ' },
        { num: 2, label: 'เลือกไพ่' },
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
            แสงสว่างนำทาง
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: 300, fontStyle: 'italic' }}>
            (Guiding Light)
          </p>
        </div>

        <StepIndicator />

        {/* Content Area */}
        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
          
          {/* STEP 1: INFORMATION */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ backgroundColor: 'rgba(26, 24, 22, 0.6)', border: '1px solid rgba(214, 180, 124, 0.2)', borderRadius: '1rem', padding: '2rem', backdropFilter: 'blur(10px)' }}>
                <label style={{ display: 'block', color: 'var(--primary)', marginBottom: '0.8rem', fontSize: '1.1rem' }}>ชื่อของคุณ (นามแฝงก็ได้นะคะ)</label>
                <input 
                  type="text" 
                  value={profileName} 
                  onChange={(e) => setProfileName(e.target.value)} 
                  style={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(214, 180, 124, 0.3)', borderRadius: '0.5rem', padding: '1rem', color: 'var(--text-main)', fontSize: '1rem', outline: 'none' }} 
                  placeholder="พิมพ์ชื่อของคุณ..." 
                />
              </div>

              <div style={{ backgroundColor: 'rgba(26, 24, 22, 0.6)', border: '1px solid rgba(214, 180, 124, 0.2)', borderRadius: '1rem', padding: '2rem', backdropFilter: 'blur(10px)' }}>
                <label style={{ display: 'block', color: 'var(--primary)', marginBottom: '0.8rem', fontSize: '1.1rem' }}>ระบายเรื่องราวที่คุณกำลังเผชิญ</label>
                <textarea 
                  rows={5} 
                  value={story} 
                  onChange={(e) => setStory(e.target.value)} 
                  style={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(214, 180, 124, 0.3)', borderRadius: '0.5rem', padding: '1rem', color: 'var(--text-main)', fontSize: '1rem', outline: 'none', resize: 'vertical' }} 
                  placeholder="พื้นที่นี้ปลอดภัยเสมอ เล่ามาให้ละเอียดได้เลยค่ะ..." 
                />
              </div>

              <button 
                onClick={handleNext}
                disabled={!profileName.trim() || !story.trim()}
                className="cozy-button filled"
                style={{ width: '100%', padding: '1rem', fontSize: '1.2rem', marginTop: '1rem', opacity: (!profileName.trim() || !story.trim()) ? 0.5 : 1, cursor: (!profileName.trim() || !story.trim()) ? 'not-allowed' : 'pointer' }}
              >
                ไปสู่ขั้นตอนต่อไป
              </button>
            </div>
          )}

          {/* STEP 2: CHOOSE CARDS */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              
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

              {/* Question 1 */}
              <div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '0.8rem', fontSize: '1.1rem' }}>
                    <span style={{ backgroundColor: 'rgba(214, 180, 124, 0.2)', padding: '0.2rem 0.8rem', borderRadius: '1rem', fontSize: '0.9rem' }}>คำถามที่ 1</span>
                  </label>
                  <input 
                    type="text" 
                    value={q1} 
                    onChange={(e) => setQ1(e.target.value)} 
                    style={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(214, 180, 124, 0.3)', borderRadius: '0.5rem', padding: '1rem', color: 'var(--text-main)', fontSize: '1rem', outline: 'none' }} 
                    placeholder="พิมพ์คำถามที่ชัดเจน..." 
                  />
                </div>
                <CardPicker maxCards={3} onComplete={setCards1} title="ตั้งจิตอธิษฐาน แล้วเลือกไพ่ 3 ใบ" />
              </div>

              <div style={{ height: '1px', backgroundColor: 'rgba(214, 180, 124, 0.1)' }}></div>

              {/* Question 2 */}
              <div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '0.8rem', fontSize: '1.1rem' }}>
                    <span style={{ backgroundColor: 'rgba(214, 180, 124, 0.2)', padding: '0.2rem 0.8rem', borderRadius: '1rem', fontSize: '0.9rem' }}>คำถามที่ 2</span>
                  </label>
                  <input 
                    type="text" 
                    value={q2} 
                    onChange={(e) => setQ2(e.target.value)} 
                    style={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(214, 180, 124, 0.3)', borderRadius: '0.5rem', padding: '1rem', color: 'var(--text-main)', fontSize: '1rem', outline: 'none' }} 
                    placeholder="พิมพ์คำถามข้อที่ 2..." 
                  />
                </div>
                <CardPicker maxCards={3} onComplete={setCards2} title="สับไพ่ในใจ แล้วเลือกมาอีก 3 ใบ" />
              </div>

              <div style={{ height: '1px', backgroundColor: 'rgba(214, 180, 124, 0.1)' }}></div>

              {/* Question 3 */}
              <div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '0.8rem', fontSize: '1.1rem' }}>
                    <span style={{ backgroundColor: 'rgba(214, 180, 124, 0.2)', padding: '0.2rem 0.8rem', borderRadius: '1rem', fontSize: '0.9rem' }}>คำถามที่ 3</span>
                  </label>
                  <input 
                    type="text" 
                    value={q3} 
                    onChange={(e) => setQ3(e.target.value)} 
                    style={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(214, 180, 124, 0.3)', borderRadius: '0.5rem', padding: '1rem', color: 'var(--text-main)', fontSize: '1rem', outline: 'none' }} 
                    placeholder="คำถามสุดท้าย..." 
                  />
                </div>
                <CardPicker maxCards={3} onComplete={setCards3} title="ไพ่ 3 ใบสุดท้าย ชี้ชะตา" />
              </div>

              <button 
                onClick={handleNext}
                disabled={cards1.length !== 3 || cards2.length !== 3 || cards3.length !== 3 || !q1.trim() || !q2.trim() || !q3.trim()}
                className="cozy-button filled"
                style={{ width: '100%', padding: '1rem', fontSize: '1.2rem', marginTop: '1rem', opacity: (cards1.length !== 3 || cards2.length !== 3 || cards3.length !== 3 || !q1.trim() || !q2.trim() || !q3.trim()) ? 0.5 : 1, cursor: (cards1.length !== 3 || cards2.length !== 3 || cards3.length !== 3 || !q1.trim() || !q2.trim() || !q3.trim()) ? 'not-allowed' : 'pointer' }}
              >
                ยืนยันไพ่ที่เลือก
              </button>
            </div>
          )}

          {/* STEP 3: CHECKOUT */}
          {step === 3 && (
            <CheckoutStep 
              price="395" 
              deliveryTime="หม่ามี๊จะส่งคำทำนายให้ภายใน 24 ชม."
              selectedCards={[...cards1, ...cards2, ...cards3]}
              dividerEvery={3}
              onSubmit={async (data) => {
                const result = await createOrder({
                  serviceType: 'THREE_QUESTIONS',
                  slipBase64: data.fileBase64 || undefined,
                  pricePaid: data.discount !== undefined ? Math.max(0, 395 - data.discount) : 395,
                  customerInfo: {
                    name: profileName,
                    story,
                    selectedCards: [...cards1, ...cards2, ...cards3]
                  },
                  questions: [q1, q2, q3]
                });
                if (result.success && result.orderId) {
                  setOrderId(result.orderId);
                  handleNext();
                } else {
                  alert(result.error || 'เกิดข้อผิดพลาดในการสั่งซื้อ กรุณาลองใหม่อีกครั้ง หรือติดต่อแอดมิน');
                }
              }}
            />
          )}

          {/* STEP 4: REVEAL / SUCCESS */}
          {step === 4 && (
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ color: 'var(--primary)', fontSize: '2.5rem', marginBottom: '1rem' }}>เปิดรับพลังงานแห่งการตื่นรู้</h3>
              
              <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: 'rgba(214, 180, 124, 0.1)', borderRadius: '0.5rem', display: 'inline-block', border: '1px solid var(--primary)' }}>
                <p style={{ color: 'var(--primary)', fontSize: '1.2rem', margin: 0 }}>หมายเลขคำสั่งซื้อ: <span style={{ fontWeight: 'bold' }}>{orderId}</span></p>
              </div>

              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '3rem', lineHeight: '1.6' }}>
                หม่ามี๊ได้รับข้อมูลและหน้าไพ่ของคุณเรียบร้อยแล้ว<br/>
                กรุณารอรับคำทำนายที่ Profile ของคุณภายใน 24 ชั่วโมงค่ะ
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'left', marginBottom: '3rem' }}>
                <div style={{ backgroundColor: 'rgba(26, 24, 22, 0.6)', border: '1px solid rgba(214, 180, 124, 0.2)', borderRadius: '1rem', padding: '1.5rem' }}>
                  <h4 style={{ color: 'var(--primary)', marginBottom: '1rem', fontSize: '1.2rem', borderBottom: '1px solid rgba(214, 180, 124, 0.1)', paddingBottom: '0.5rem' }}>
                    ข้อมูลของคุณ: <span style={{ color: 'var(--text-main)' }}>{profileName}</span>
                  </h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                    <span style={{ color: 'var(--text-main)' }}>เรื่องราวที่คุณกำลังเผชิญ:</span><br/>
                    {story}
                  </p>
                </div>

                {[
                  { q: q1, cards: cards1 },
                  { q: q2, cards: cards2 },
                  { q: q3, cards: cards3 },
                ].map((item, idx) => (
                  <div key={idx} style={{ backgroundColor: 'rgba(26, 24, 22, 0.6)', border: '1px solid rgba(214, 180, 124, 0.2)', borderRadius: '1rem', padding: '1.5rem' }}>
                    <h4 style={{ color: 'var(--text-main)', marginBottom: '1rem', fontSize: '1.1rem', borderBottom: '1px solid rgba(214, 180, 124, 0.1)', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--primary)' }}>คำถามที่ {idx + 1}:</span> {item.q}
                    </h4>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      {item.cards.map((cardId, i) => (
                        <div key={i} style={{ width: '60px', aspectRatio: '2/3', borderRadius: '6px', border: '1px solid var(--primary)', position: 'relative', overflow: 'hidden' }}>
                          <img src={`/images/cards/${cardId + 1}.png`} alt={`Card ${cardId + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.src = '/images/card-back.png' }} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
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
