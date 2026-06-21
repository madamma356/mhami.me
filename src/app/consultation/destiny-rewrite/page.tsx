"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import CheckoutStep from '@/components/CheckoutStep';
import { createOrder } from '@/app/actions/checkout';

export default function DestinyRewritePage() {
  const [step, setStep] = useState(1);
  
  // Form State
  const [profileName, setProfileName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthProvince, setBirthProvince] = useState('');
  const [story, setStory] = useState('');
  const [budget, setBudget] = useState('1999-3999');
  const [carrier, setCarrier] = useState('');
  const [system, setSystem] = useState('');
  
  const [orderId] = useState(() => 'MHM-' + Math.floor(10000 + Math.random() * 90000));

  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/member/login?callbackUrl=/consultation/destiny-rewrite');
    }
  }, [status, router]);

  if (status === 'loading' || status === 'unauthenticated') {
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
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', position: 'relative', maxWidth: '400px', margin: '0 auto 3rem' }}>
      <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', backgroundColor: 'rgba(214, 180, 124, 0.2)', zIndex: 0 }}></div>
      {[
        { num: 1, label: 'ข้อมูลสายมู' },
        { num: 2, label: 'ชำระเงิน' },
        { num: 3, label: 'รอรับความสำเร็จ' }
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
            พลิกชะตาฟ้าลิขิต
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: 300, fontStyle: 'italic' }}>
            (Destiny Rewrite)
          </p>
        </div>

        <StepIndicator />

        {/* Content Area */}
        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
          
          {/* STEP 1: INFORMATION */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ backgroundColor: 'rgba(26, 24, 22, 0.6)', border: '1px solid rgba(214, 180, 124, 0.2)', borderRadius: '1rem', padding: '2rem', backdropFilter: 'blur(10px)' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                  การเปลี่ยนชะตาต้องการความแม่นยำ กรุณากรอกข้อมูลวันเดือนปีเกิดและเวลาตกฟากให้ตรงตามสูติบัตร
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', color: 'var(--primary)', marginBottom: '0.5rem', fontSize: '1rem' }}>ชื่อของคุณ</label>
                    <input 
                      type="text" 
                      value={profileName} 
                      onChange={(e) => setProfileName(e.target.value)} 
                      style={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(214, 180, 124, 0.3)', borderRadius: '0.5rem', padding: '0.8rem', color: 'var(--text-main)', fontSize: '1rem', outline: 'none' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: 'var(--primary)', marginBottom: '0.5rem', fontSize: '1rem' }}>เบอร์โทรที่ใช้อยู่ (จะดูให้ว่าพังตรงไหน)</label>
                    <input 
                      type="text" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                      style={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(214, 180, 124, 0.3)', borderRadius: '0.5rem', padding: '0.8rem', color: 'var(--text-main)', fontSize: '1rem', outline: 'none' }} 
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', color: 'var(--primary)', marginBottom: '0.5rem', fontSize: '1rem' }}>วันเกิด</label>
                    <input 
                      type="date" 
                      value={dob} 
                      onChange={(e) => setDob(e.target.value)} 
                      style={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(214, 180, 124, 0.3)', borderRadius: '0.5rem', padding: '0.8rem', color: 'var(--text-muted)', fontSize: '1rem', outline: 'none', colorScheme: 'dark' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: 'var(--primary)', marginBottom: '0.5rem', fontSize: '1rem' }}>เวลาตกฟาก (เวลาเกิด)</label>
                    <input 
                      type="time" 
                      value={birthTime} 
                      onChange={(e) => setBirthTime(e.target.value)} 
                      style={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(214, 180, 124, 0.3)', borderRadius: '0.5rem', padding: '0.8rem', color: 'var(--text-muted)', fontSize: '1rem', outline: 'none', colorScheme: 'dark' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: 'var(--primary)', marginBottom: '0.5rem', fontSize: '1rem' }}>จังหวัดที่เกิด</label>
                    <input 
                      type="text" 
                      value={birthProvince} 
                      onChange={(e) => setBirthProvince(e.target.value)} 
                      style={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(214, 180, 124, 0.3)', borderRadius: '0.5rem', padding: '0.8rem', color: 'var(--text-main)', fontSize: '1rem', outline: 'none' }} 
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', color: 'var(--primary)', marginBottom: '0.5rem', fontSize: '1rem' }}>ปัญหาที่อยากแก้ไขด่วนที่สุด</label>
                  <textarea 
                    rows={3} 
                    value={story} 
                    onChange={(e) => setStory(e.target.value)} 
                    style={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(214, 180, 124, 0.3)', borderRadius: '0.5rem', padding: '0.8rem', color: 'var(--text-main)', fontSize: '1rem', outline: 'none', resize: 'vertical' }} 
                    placeholder="ความรักติดขัด? การเงินไม่เดิน? สุขภาพ?..." 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', color: 'var(--primary)', marginBottom: '0.5rem', fontSize: '1rem' }}>งบประมาณค่าเบอร์มงคล</label>
                    <select 
                      value={budget} 
                      onChange={(e) => setBudget(e.target.value)} 
                      style={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(214, 180, 124, 0.3)', borderRadius: '0.5rem', padding: '0.8rem', color: 'var(--text-main)', fontSize: '1rem', outline: 'none', appearance: 'none' }}
                    >
                      <option value="" disabled style={{ color: '#000' }}>เลือกงบประมาณของคุณ</option>
                      <option value="1000-5000" style={{ color: '#000' }}>1,000 - 5,000 บาท</option>
                      <option value="5000-10000" style={{ color: '#000' }}>5,000 - 10,000 บาท</option>
                      <option value="10000-20000" style={{ color: '#000' }}>10,000 - 20,000 บาท</option>
                      <option value="unlimited" style={{ color: '#000' }}>ทุ่มไม่อั้น ขอปังที่สุด</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', color: 'var(--primary)', marginBottom: '0.5rem', fontSize: '1rem' }}>ค่ายที่ต้องการ</label>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      {['AIS', 'TRUE', 'DTAC', 'ไม่ระบุ'].map((c) => (
                        <label key={c} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                          <input type="radio" name="carrier" value={c} checked={carrier === c} onChange={() => setCarrier(c)} style={{ accentColor: 'var(--primary)' }} />
                          {c}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              <button 
                onClick={handleNext}
                disabled={!profileName || !phone || !dob || !birthTime || !birthProvince || !story || !budget}
                className="cozy-button filled"
                style={{ width: '100%', padding: '1rem', fontSize: '1.2rem', marginTop: '1rem', opacity: (!profileName || !phone || !dob || !birthTime || !birthProvince || !story || !budget) ? 0.5 : 1, cursor: (!profileName || !phone || !dob || !birthTime || !birthProvince || !story || !budget) ? 'not-allowed' : 'pointer' }}
              >
                ยืนยันข้อมูลเพื่อเปิดดวงชะตา
              </button>
            </div>
          )}

          {/* STEP 2: CHECKOUT */}
          {step === 2 && (
            <div>
              <div style={{ backgroundColor: 'rgba(214, 180, 124, 0.1)', border: '1px solid var(--primary)', borderRadius: '1rem', padding: '2rem', marginBottom: '2rem', textAlign: 'left' }}>
                <h4 style={{ color: 'var(--primary)', fontSize: '1.3rem', marginBottom: '1rem', borderBottom: '1px solid rgba(214, 180, 124, 0.2)', paddingBottom: '0.5rem' }}>
                  <i className="fas fa-gift" style={{ marginRight: '0.5rem' }}></i> สิ่งที่คุณจะได้รับหลังการโอนชำระเงิน
                </h4>
                <ul style={{ color: 'var(--text-main)', fontSize: '1rem', lineHeight: '1.8', paddingLeft: '1.5rem', margin: 0 }}>
                  <li>ได้รับ <b>Blueprint ชีวิต</b> ที่มีพื้นฐานดวงชะตา ตามหลักโหราศาสตร์ไทย 1 ฉบับ</li>
                  <li>ได้รับ <b>Lucky Number</b> เลขมงคลประจำดวงชะตา ไว้ใช้งานได้ตลอดชีวิต</li>
                  <li>รับ <b>คำพยากรณ์ดวงจร 3 เดือน</b> ภายในเล่ม</li>
                  <li>บริการจัดหา <b>ซิมมงคลให้ฟรี</b> <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>(ไม่รวมราคาซิม)</span></li>
                  <li><b>นัดคิวพูดคุยดวงชะตากับแม่หมอ Secret</b> ถามตอบได้ภายใน 60 นาที</li>
                </ul>
              </div>

              <CheckoutStep 
                price="8995" 
                deliveryTime="หม่ามี๊จะวิเคราะห์ดวงชะตาอย่างละเอียด และคัดเลือกเบอร์มงคลที่ตรงดวงที่สุดให้ภายใน 1-3 วัน"
                onSubmit={async (data) => {
                  const result = await createOrder({
                    serviceType: 'CHANGE_DESTINY',
                    slipBase64: data.fileBase64 || undefined,
                    pricePaid: data.finalPrice,
                    customerInfo: {
                      name: profileName,
                      phone,
                      dob,
                      birthTime,
                      birthProvince,
                      story,
                      budget,
                      carrier
                    }
                  });
                  if (result.success && result.orderId) {
                    setOrderId(result.orderId);
                    handleNext();
                  } else {
                    alert(result.error || 'เกิดข้อผิดพลาดในการสั่งซื้อ กรุณาลองใหม่อีกครั้ง หรือติดต่อแอดมิน');
                  }
                }}
              />
            </div>
          )}

          {/* STEP 3: SUCCESS */}
          {step === 3 && (
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ color: 'var(--primary)', fontSize: '2.5rem', marginBottom: '1rem' }}>พลิกชะตาฟ้าลิขิต</h3>
              
              <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: 'rgba(214, 180, 124, 0.1)', borderRadius: '0.5rem', display: 'inline-block', border: '1px solid var(--primary)' }}>
                <p style={{ color: 'var(--primary)', fontSize: '1.2rem', margin: 0 }}>หมายเลขคำสั่งซื้อ: <span style={{ fontWeight: 'bold' }}>{orderId}</span></p>
              </div>

              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '3rem', lineHeight: '1.6' }}>
                หม่ามี๊ได้รับข้อมูลดวงชะตาของคุณเรียบร้อยแล้ว<br/>
                กรุณารอรับคำแนะนำเบอร์มงคลพลิกชีวิตที่ Profile ของคุณภายใน 1-3 วันนะคะ
              </p>

              <div style={{ backgroundColor: 'rgba(26, 24, 22, 0.6)', border: '1px solid rgba(214, 180, 124, 0.2)', borderRadius: '1rem', padding: '2rem', marginBottom: '2rem', textAlign: 'left' }}>
                <h4 style={{ color: 'var(--primary)', marginBottom: '1rem', fontSize: '1.2rem', borderBottom: '1px solid rgba(214, 180, 124, 0.1)', paddingBottom: '0.5rem' }}>
                  ข้อมูลดวงชะตา: <span style={{ color: 'var(--text-main)' }}>{profileName}</span>
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}><span style={{ color: 'var(--text-main)' }}>เบอร์โทร:</span> {phone}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}><span style={{ color: 'var(--text-main)' }}>วันเกิด:</span> {dob}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}><span style={{ color: 'var(--text-main)' }}>เวลาตกฟาก:</span> {birthTime}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}><span style={{ color: 'var(--text-main)' }}>จังหวัดที่เกิด:</span> {birthProvince}</p>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.6', whiteSpace: 'pre-wrap', marginBottom: '1rem' }}>
                  <span style={{ color: 'var(--text-main)' }}>ปัญหาที่อยากแก้ไข:</span><br/>
                  {story}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}><span style={{ color: 'var(--text-main)' }}>งบประมาณ:</span> {budget}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}><span style={{ color: 'var(--text-main)' }}>ค่ายที่ต้องการ:</span> {carrier}</p>
                </div>
              </div>

              <div style={{ backgroundColor: 'rgba(0, 195, 0, 0.05)', border: '1px solid #00C300', borderRadius: '1rem', padding: '2rem', marginBottom: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <h4 style={{ color: '#00C300', fontSize: '1.3rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>นัดคิวพูดคุยดวงชะตา</h4>
                <p style={{ color: 'var(--text-main)', fontSize: '1rem', lineHeight: '1.8', textAlign: 'center', fontWeight: 300, marginBottom: '1rem' }}>
                  อย่าลืม! คุณมีสิทธิ์ <b>นัดคิวพูดคุยดวงชะตากับแม่หมอ Secret</b> ถามตอบได้ภายใน 60 นาที<br/>
                  รวมถึงรับ <b>Blueprint ชีวิต</b>, <b>Lucky Number</b>, <b>คำพยากรณ์ดวงจร 3 เดือน</b> และบริการหา <b>ซิมมงคลฟรี</b>
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

              <div style={{ backgroundColor: 'rgba(26, 24, 22, 0.6)', border: '1px solid rgba(214, 180, 124, 0.2)', borderRadius: '1rem', padding: '2rem', marginBottom: '3rem', display: 'inline-block' }}>
                <p style={{ color: 'var(--primary)', fontSize: '1.2rem', fontStyle: 'italic' }}>"จงเตรียมตัวให้พร้อม เพราะหลังจากนี้ชีวิตจะเปลี่ยนไปตลอดกาล"</p>
              </div>
              <br/>
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
