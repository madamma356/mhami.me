"use client";

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { getReadingById } from '@/app/actions/reading';

const PDFReader = dynamic(() => import('@/components/PDFReader'), { 
  ssr: false, 
  loading: () => <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--primary)' }}><i className="fas fa-spinner fa-spin fa-2x"></i></div> 
});

export default function ReadingResult({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const fetchReading = async () => {
      try {
        const dbOrder = await getReadingById(id);
        if (dbOrder) {
          setOrder({
            ...dbOrder,
            id: dbOrder.id.startsWith('#') ? dbOrder.id : `#${dbOrder.id}`,
            serviceStage: dbOrder.status
          });
          return;
        }
      } catch (e) {
        console.error(e);
      }

      // Mock database fallback based on ID
      if (id === 'MH-10024' || id === '#MH-10024') {
      setOrder({
        id: '#MH-10024', name: 'คุณพลอย', service: 'Mini Empower', serviceStage: 'รับฝากหัวใจ',
        customerInfo: { name: 'พลอยปภัส', job: 'พนักงานบริษัทเอกชน', relationship: 'โสดสนิท', story: 'ช่วงนี้รู้สึกสับสนเรื่องงานมากๆ ค่ะ อยากเปลี่ยนงานแต่ก็กลัวว่าที่ใหม่จะไม่ดีเท่าที่เก่า ส่วนเรื่องความรักก็เงียบเหงามาก อยากรู้ว่าครึ่งปีหลังจะมีโชคเรื่องไหนบ้างมั้ยคะ', focus: 'การงานและการเงิน' },
        questions: ['ปีนี้มีโอกาสจะได้เลื่อนขั้นเปลี่ยนงานไหมคะ?', 'ความรักช่วงนี้จะเป็นยังไง จะมีคนคุยใหม่ๆ เข้ามาไหม?', 'เรื่องการเงินครึ่งปีหลัง จะมีโชคลาภหรือติดขัดอะไรไหมคะ?'],
        cards: [
          [ { num: 1 }, { num: 15 }, { num: 28 } ],
          [ { num: 5 }, { num: 42 }, { num: 19 } ],
          [ { num: 11 }, { num: 33 }, { num: 7 } ]
        ],
        prediction: {
          q1: 'ไพ่บอกว่าช่วงนี้คุณมีเกณฑ์จะได้พบกับการเปลี่ยนแปลงที่ดีในเรื่องงานค่ะ จะมีผู้ใหญ่เข้ามาอุปถัมภ์',
          q2: 'เรื่องความรัก แนะนำให้โฟกัสที่ตัวเองก่อนนะคะ ช่วงนี้ปล่อยใจให้สบาย ไม่ต้องไปเร่งรีบ',
          q3: 'การเงินจะเริ่มคล่องตัวขึ้นในช่วงกลางเดือนค่ะ แต่อย่าเพิ่งลงทุนอะไรเสี่ยงๆ นะคะ'
        }
      });
    } else if (id === 'MH-10022') {
      setOrder({
        id: '#MH-10022', name: 'คุณเมย์', service: 'Life Unveiled', serviceStage: 'พร้อมส่งมอบความสบายใจ',
        customerInfo: { name: 'เมธาวี', job: 'เจ้าของธุรกิจส่วนตัว', relationship: 'มีแฟน/แต่งงานแล้ว', story: 'อยากรู้ภาพรวมชีวิตในปีนี้ค่ะ ว่าจะมีโอกาสได้ขยับขยายเรื่องงานและเงินไหม แล้วก็อยากรู้เรื่องสิ่งที่ต้องระวังเป็นพิเศษค่ะ', focus: 'ภาพรวมชีวิต' },
        cards: [{num: 1}, {num: 42}, {num: 15}, {num: 28}, {num: 9}, {num: 33}, {num: 7}, {num: 55}, {num: 19}, {num: 11}, {num: 62}, {num: 3}],
        prediction: {
          overall: 'พื้นดวงเป็นคนมีบุญเก่ามาเยอะ ตกน้ำไม่ไหลตกไฟไม่ไหม้ จะหยิบจับอะไรก็มีคนคอยช่วยเหลือสนับสนุนอยู่ตลอด',
          obstacles: 'ระวังเรื่องความเครียดสะสม และการแบกรับปัญหาของคนรอบข้างมากเกินไปจนตัวเองลำบาก',
          career: 'ช่วงนี้งานเด่นมาก จะได้เลื่อนขั้นหรือมีผู้ใหญ่เล็งเห็นผลงาน แต่ต้องแลกมาด้วยความรับผิดชอบที่หนักขึ้น',
          finance: 'การเงินมาจากความสามารถพิเศษของตัวเอง ยิ่งขยันยิ่งได้มาก จะมีโชคลาภจากการเดินทางสั้นๆ',
          love: 'คนโสดมีเกณฑ์พบรักจากการทำงาน หรือคนที่อายุมากกว่าเข้ามาอุปถัมภ์ ส่วนคนมีคู่ให้ระวังคำพูดเวลาอารมณ์ร้อน',
          adjustment: 'ควรหาเวลาพักผ่อนบ้าง ปล่อยวางเรื่องที่ควบคุมไม่ได้ และหมั่นทำบุญกรวดน้ำให้เจ้ากรรมนายเวร',
          quote: 'ความสุขไม่ใช่สิ่งที่เราต้องตามหา แต่มันคือสิ่งที่เราสร้างขึ้นเอง'
        }
      });
    } else if (id === 'MH-10023') {
      setOrder({
        id: '#MH-10023', name: 'คุณต้น', service: 'Destiny Rewrite', serviceStage: 'กำลังเชื่อมต่อพลังงาน',
        customerInfo: { name: 'ชนาธิป', phone: '081-234-5678', birthdate: '15/08/2533', birthtime: '09:45', birthprovince: 'กรุงเทพมหานคร', story: 'อยากเปลี่ยนเบอร์ใหม่ครับ เบอร์เดิมทำอะไรก็ติดขัด เงินเก็บไม่อยู่เลย', budget: '1,000 - 5,000 บาท', carrier: 'AIS' },
        prediction: {
          pdfUrl: '/mock-blueprint.pdf'
        }
      });
    } else {
      // Not found
      setOrder(null);
    }
  };
  
  fetchReading();
  }, [id]);

  if (!order) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-dark)' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="bokeh-bg"></div>
          <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>กำลังค้นหาคำทำนาย...</h2>
          <p style={{ color: 'var(--text-muted)' }}>กรุณารอสักครู่ หรือตรวจสอบรหัสออเดอร์อีกครั้ง</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    if (status === 'รับฝากหัวใจ') return '#FF6B81';
    if (status === 'กำลังเชื่อมต่อพลังงาน') return '#FBBF24';
    if (status === 'พร้อมส่งมอบความสบายใจ') return '#34D399';
    return 'var(--text-main)';
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('คัดลอกลิงก์เรียบร้อยแล้ว ส่งให้เพื่อนได้เลยค่ะ!');
  };

  const PyramidRow = ({ children }: { children: React.ReactNode }) => (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
      {children}
    </div>
  );

  const CardPos = ({ num, name }: { num: number, name: string }) => (
    <div style={{ width: '60px', textAlign: 'center', animation: 'fadeInUp 0.6s ease-out forwards', animationDelay: `${num * 0.1}s`, opacity: 0 }}>
      <div style={{ width: '60px', height: '90px', backgroundColor: 'var(--primary)', backgroundImage: 'linear-gradient(135deg, rgba(214, 180, 124, 1) 0%, rgba(184, 134, 11, 1) 100%)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a1816', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.3rem', boxShadow: '0 4px 10px rgba(0,0,0,0.5)', border: '2px solid rgba(255,255,255,0.3)' }}>
        {num}
      </div>
      <div style={{ fontSize: '0.65rem', color: 'var(--primary)', backgroundColor: 'rgba(214, 180, 124, 0.1)', padding: '0.2rem', borderRadius: '4px', border: '1px solid rgba(214, 180, 124, 0.3)' }}>
        {name}
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-dark)', padding: '2rem 1rem', position: 'relative', overflow: 'hidden' }}>
      <div className="bokeh-bg"></div>
      
      <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <img src="/images/logo.png" alt="Mhami Logo" style={{ height: '50px', marginBottom: '1.5rem' }} />
          <h1 style={{ color: 'var(--primary)', fontSize: '2rem', fontFamily: '"Playfair Display", "Noto Serif Thai", serif', marginBottom: '0.5rem' }}>ผลคำทำนายของคุณ</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>ออเดอร์: {order.id} | ลูกค้า: {order.name}</p>
          <div style={{ display: 'inline-block', backgroundColor: 'rgba(0,0,0,0.5)', padding: '0.5rem 1.5rem', borderRadius: '2rem', border: '1px solid rgba(214, 180, 124, 0.2)' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginRight: '0.5rem' }}>สถานะ:</span>
            <span style={{ color: getStatusColor(order.serviceStage), fontWeight: 'bold', fontSize: '0.9rem' }}>
              {order.serviceStage === 'รับฝากหัวใจ' && '📥 '}
              {order.serviceStage === 'กำลังเชื่อมต่อพลังงาน' && '🔮 '}
              {order.serviceStage === 'พร้อมส่งมอบความสบายใจ' && '✨ '}
              {order.serviceStage}
            </span>
          </div>
        </div>

        {/* 1. Mini Empower (3 Questions) */}
        {order.service === 'Mini Empower' && (
          <div className="healing-card mockup-card fade-in" style={{ padding: '3rem' }}>
            <h2 style={{ color: 'var(--primary)', textAlign: 'center', marginBottom: '2rem', fontSize: '1.5rem' }}><i className="fas fa-sparkles"></i> Mini Empower (3 คำถาม)</h2>
            
            {/* Customer Info */}
            {order.customerInfo && (
              <div style={{ backgroundColor: 'rgba(214, 180, 124, 0.05)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(214, 180, 124, 0.2)', marginBottom: '2rem' }}>
                <h4 style={{ color: 'var(--primary)', marginBottom: '1rem' }}><i className="fas fa-user" style={{ marginRight: '0.5rem' }}></i> เรื่องราวของคุณ</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  {order.customerInfo?.name && <div><strong style={{ color: 'var(--text-muted)' }}>ชื่อ:</strong> <span style={{ color: 'var(--text-main)' }}>{order.customerInfo.name}</span></div>}
                  {order.customerInfo?.phone && <div><strong style={{ color: 'var(--text-muted)' }}>เบอร์โทร:</strong> <span style={{ color: 'var(--text-main)' }}>{order.customerInfo.phone}</span></div>}
                  {order.customerInfo?.birthdate && <div><strong style={{ color: 'var(--text-muted)' }}>วันเกิด:</strong> <span style={{ color: 'var(--text-main)' }}>{order.customerInfo.birthdate}</span></div>}
                  {order.customerInfo?.birthtime && <div><strong style={{ color: 'var(--text-muted)' }}>เวลาตกฟาก:</strong> <span style={{ color: 'var(--text-main)' }}>{order.customerInfo.birthtime}</span></div>}
                  {order.customerInfo?.birthprovince && <div><strong style={{ color: 'var(--text-muted)' }}>จังหวัดที่เกิด:</strong> <span style={{ color: 'var(--text-main)' }}>{order.customerInfo.birthprovince}</span></div>}
                  {order.customerInfo?.budget && <div><strong style={{ color: 'var(--text-muted)' }}>งบประมาณ:</strong> <span style={{ color: 'var(--text-main)' }}>{order.customerInfo.budget}</span></div>}
                  {order.customerInfo?.carrier && <div><strong style={{ color: 'var(--text-muted)' }}>ค่ายที่ต้องการ:</strong> <span style={{ color: 'var(--text-main)' }}>{order.customerInfo.carrier}</span></div>}
                  {order.customerInfo?.job && <div><strong style={{ color: 'var(--text-muted)' }}>อาชีพ:</strong> <span style={{ color: 'var(--text-main)' }}>{order.customerInfo.job}</span></div>}
                  {order.customerInfo?.relationship && <div><strong style={{ color: 'var(--text-muted)' }}>สถานภาพ:</strong> <span style={{ color: 'var(--text-main)' }}>{order.customerInfo.relationship}</span></div>}
                  {order.customerInfo?.focus && <div><strong style={{ color: 'var(--text-muted)' }}>เรื่องที่อยากเน้นย้ำ:</strong> <span style={{ color: 'var(--primary)' }}>{order.customerInfo.focus}</span></div>}
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}><strong>{order.service === 'Destiny Rewrite' ? 'ปัญหาที่อยากแก้ไขด่วนที่สุด:' : 'เรื่องราวที่เผชิญ:'}</strong></p>
                <div style={{ color: 'var(--text-main)', fontSize: '1rem', lineHeight: '1.6', backgroundColor: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.5rem', fontStyle: 'italic' }}>
                  "{order.customerInfo?.story || 'ไม่ระบุ'}"
                </div>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {[1, 2, 3].map(qNum => (
                <div key={qNum} style={{ backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(214, 180, 124, 0.2)', padding: '2rem', borderRadius: '1rem' }}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ color: 'var(--primary)', fontSize: '1rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>คำถามข้อที่ {qNum}: <span style={{ color: 'var(--text-main)', fontWeight: 'normal' }}>{order.questions?.[qNum-1] || 'ลูกค้าไม่ได้ระบุคำถาม'}</span></p>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    {(order.cards?.[qNum-1] || [1,2,3]).map((c: any, i: number) => (
                      <div key={i} style={{ width: '80px', flexShrink: 0 }}>
                        <img src={`/images/cards/${c.num || i+1}.png`} alt={`Card ${c.num || i+1}`} style={{ width: '100%', height: 'auto', borderRadius: '6px', boxShadow: '0 4px 10px rgba(0,0,0,0.5)', border: '1px solid rgba(214, 180, 124, 0.5)', display: 'block' }} />
                      </div>
                    ))}
                  </div>

                  <div style={{ backgroundColor: 'rgba(214, 180, 124, 0.05)', padding: '1.5rem', borderRadius: '0.8rem', borderLeft: '3px solid var(--primary)' }}>
                    <h3 style={{ color: 'var(--primary)', fontSize: '1.1rem', marginBottom: '1rem' }}><i className="fas fa-comment-dots" style={{ marginRight: '0.5rem' }}></i>คำทำนายจากหม่ามี๊</h3>
                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>{order.prediction[`q${qNum}`]}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <button onClick={handleShare} className="cozy-button"><i className="fas fa-share-alt"></i> แชร์คำทำนาย</button>
            </div>
          </div>
        )}

        {/* 2. Life Unveiled (12 Cards Pyramid) */}
        {order.service === 'Life Unveiled' && (
          <div className="fade-in">
            {/* Customer Info */}
            <div style={{ backgroundColor: 'rgba(214, 180, 124, 0.05)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(214, 180, 124, 0.2)', marginBottom: '2rem' }}>
              <h4 style={{ color: 'var(--primary)', marginBottom: '1rem' }}><i className="fas fa-user" style={{ marginRight: '0.5rem' }}></i> เรื่องราวของคุณ</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  {order.customerInfo?.name && <div><strong style={{ color: 'var(--text-muted)' }}>ชื่อ:</strong> <span style={{ color: 'var(--text-main)' }}>{order.customerInfo.name}</span></div>}
                  {order.customerInfo?.phone && <div><strong style={{ color: 'var(--text-muted)' }}>เบอร์โทร:</strong> <span style={{ color: 'var(--text-main)' }}>{order.customerInfo.phone}</span></div>}
                  {order.customerInfo?.birthdate && <div><strong style={{ color: 'var(--text-muted)' }}>วันเกิด:</strong> <span style={{ color: 'var(--text-main)' }}>{order.customerInfo.birthdate}</span></div>}
                  {order.customerInfo?.birthtime && <div><strong style={{ color: 'var(--text-muted)' }}>เวลาตกฟาก:</strong> <span style={{ color: 'var(--text-main)' }}>{order.customerInfo.birthtime}</span></div>}
                  {order.customerInfo?.birthprovince && <div><strong style={{ color: 'var(--text-muted)' }}>จังหวัดที่เกิด:</strong> <span style={{ color: 'var(--text-main)' }}>{order.customerInfo.birthprovince}</span></div>}
                  {order.customerInfo?.budget && <div><strong style={{ color: 'var(--text-muted)' }}>งบประมาณ:</strong> <span style={{ color: 'var(--text-main)' }}>{order.customerInfo.budget}</span></div>}
                  {order.customerInfo?.carrier && <div><strong style={{ color: 'var(--text-muted)' }}>ค่ายที่ต้องการ:</strong> <span style={{ color: 'var(--text-main)' }}>{order.customerInfo.carrier}</span></div>}
                  {order.customerInfo?.job && <div><strong style={{ color: 'var(--text-muted)' }}>อาชีพ:</strong> <span style={{ color: 'var(--text-main)' }}>{order.customerInfo.job}</span></div>}
                  {order.customerInfo?.relationship && <div><strong style={{ color: 'var(--text-muted)' }}>สถานภาพ:</strong> <span style={{ color: 'var(--text-main)' }}>{order.customerInfo.relationship}</span></div>}
                  {order.customerInfo?.focus && <div><strong style={{ color: 'var(--text-muted)' }}>เรื่องที่อยากเน้นย้ำ:</strong> <span style={{ color: 'var(--primary)' }}>{order.customerInfo.focus}</span></div>}
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}><strong>เรื่องราวที่เผชิญ:</strong></p>
                <div style={{ color: 'var(--text-main)', fontSize: '1rem', lineHeight: '1.6', backgroundColor: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.5rem', fontStyle: 'italic' }}>
                  "{order.customerInfo?.story || 'ไม่ระบุ'}"
                </div>
            </div>

            {/* Pyramid Visual */}
            <div className="healing-card mockup-card" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h2 style={{ color: 'var(--primary)', textAlign: 'center', marginBottom: '2rem', fontSize: '1.5rem' }}><i className="fas fa-eye"></i> พรหมญาณพยากรณ์ 12 ใบ ไขความลับชีวิต</h2>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '1rem',
                alignItems: 'center',
                width: '100%',
                maxWidth: '800px',
                backgroundColor: 'rgba(0,0,0,0.3)', 
                padding: '2rem 1.5rem', 
                borderRadius: '1rem', 
                border: '1px solid rgba(214, 180, 124, 0.1)'
              }}>
                {(() => {
                  const cards = order.cards || Array.from({length: 12}, (_, i) => ({num: i+1}));
                  const posNames = ['วาสนา', 'ทรัพย์สิน', 'บ้านช่อง', 'ญาติมิตร', 'บุตรบริวาร', 'ศัตรู', 'คู่ครอง', 'โรคภัย', 'ความสุข', 'การงาน', 'ลาภยศ', 'สรุป'];
                  
                  const renderCard = (index: number) => {
                    const c = cards[index];
                    if (!c) return null;
                    return (
                      <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--primary)', marginBottom: '0.5rem', fontWeight: 'bold' }}>{index+1}. {posNames[index]}</span>
                        <img src={`/images/cards/${c.num}.png`} alt={`Card ${c.num}`} style={{ width: '100%', maxWidth: '80px', height: 'auto', borderRadius: '6px', boxShadow: '0 4px 10px rgba(0,0,0,0.5)', border: '1px solid rgba(214, 180, 124, 0.5)' }} />
                      </div>
                    );
                  };

                  return (
                    <>
                      {/* Row 1: [1] */}
                      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        {renderCard(0)}
                      </div>
                      {/* Row 2: [2, 3] */}
                      <div style={{ display: 'flex', gap: '3rem', justifyContent: 'center' }}>
                        {renderCard(1)} {renderCard(2)}
                      </div>
                      {/* Row 3: [4, 12, 5] */}
                      <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                        {renderCard(3)} {renderCard(11)} {renderCard(4)}
                      </div>
                      {/* Row 4: [6, 11, 10, 9, 8, 7] */}
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        {renderCard(5)} {renderCard(10)} {renderCard(9)} {renderCard(8)} {renderCard(7)} {renderCard(6)}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Detailed Readings */}
            <div className="healing-card mockup-card" style={{ padding: '3rem' }}>
              <h3 style={{ color: 'var(--text-main)', marginBottom: '2rem', textAlign: 'center', fontSize: '1.5rem' }}><i className="fas fa-sparkles" style={{ color: 'var(--primary)', marginRight: '0.5rem' }}></i> คำทำนายจากหม่ามี๊</h3>
              
              {order.prediction.specialMessage && (
                <div style={{ backgroundColor: 'rgba(214, 180, 124, 0.1)', padding: '2rem', borderRadius: '1rem', border: '1px solid rgba(214, 180, 124, 0.3)', marginBottom: '2rem' }}>
                  <h4 style={{ color: 'var(--primary)', fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className="fas fa-envelope-open-text"></i> คำทำนายจากใจหม่ามี๊
                  </h4>
                  <p style={{ color: 'var(--text-main)', lineHeight: 1.8, whiteSpace: 'pre-wrap', fontSize: '1.1rem' }}>{order.prediction.specialMessage}</p>
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', marginBottom: '3rem' }}>
                {[
                  { key: 'overall', label: 'ภาพรวมชีวิต', icon: 'fa-globe' },
                  { key: 'obstacles', label: 'จุดติดปัญหา', icon: 'fa-exclamation-circle' },
                  { key: 'career', label: 'การงาน', icon: 'fa-briefcase' },
                  { key: 'finance', label: 'การเงิน', icon: 'fa-coins' },
                  { key: 'love', label: 'ความรัก', icon: 'fa-heart' },
                  { key: 'adjustment', label: 'สิ่งที่ต้องปรับ', icon: 'fa-tools' }
                ].map((cat, i) => (
                  <div key={i} style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(214, 180, 124, 0.15)' }}>
                    <h4 style={{ color: 'var(--primary)', fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <i className={`fas ${cat.icon}`}></i> {cat.label}
                    </h4>
                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>{order.prediction[cat.key] || '-'}</p>
                  </div>
                ))}
              </div>


              {order.prediction.quote && (
                <div style={{ backgroundColor: 'rgba(214, 180, 124, 0.1)', padding: '2rem', borderRadius: '1rem', border: '2px dashed rgba(214, 180, 124, 0.4)', textAlign: 'center' }}>
                  <h4 style={{ color: 'var(--primary)', marginBottom: '1rem', fontSize: '1.1rem' }}><i className="fas fa-gift" style={{ marginRight: '0.5rem' }}></i>โบนัสจากหม่ามี๊</h4>
                  <p style={{ color: 'var(--text-main)', fontStyle: 'italic', fontSize: '1.2rem', lineHeight: 1.6 }}>"{order.prediction.quote}"</p>
                </div>
              )}
            </div>

            <div style={{ textAlign: 'center', marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
              <button onClick={handleShare} className="cozy-button"><i className="fas fa-share-alt"></i> แชร์คำทำนาย</button>
              
              <div style={{ marginTop: '2rem', padding: '2rem', backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: '1rem', border: '1px solid rgba(214, 180, 124, 0.2)', maxWidth: '500px', width: '100%' }}>
                <h4 style={{ color: 'var(--primary)', marginBottom: '1rem' }}><i className="fas fa-phone-alt"></i> นัดหมายพูดคุยเจาะลึก</h4>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>หากต้องการปรึกษาหรือเจาะลึกปัญหาเพิ่มเติม สามารถนัดคิวพูดคุยส่วนตัว 30 นาทีกับหม่ามี๊ได้เลยนะคะ</p>
                <a href="https://lin.ee/yourlineid" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <button className="cozy-button" style={{ backgroundColor: '#00B900', color: '#fff', border: 'none', padding: '0.8rem 2rem', fontSize: '1rem' }}>
                    <i className="fab fa-line" style={{ marginRight: '0.5rem' }}></i> นัดหมายผ่าน LINE
                  </button>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* 3. Destiny Rewrite (PDF & LINE CTA) */}
        {order.service === 'Destiny Rewrite' && (
          <div className="healing-card mockup-card fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
            <h2 style={{ color: 'var(--primary)', marginBottom: '1rem', fontSize: '1.8rem' }}><i className="fas fa-book-open"></i> Blueprint พลิกชะตาฟ้าลิขิต</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>คู่มือชีวิตและเบอร์มงคลของคุณจัดทำเสร็จเรียบร้อยแล้ว</p>
            
            {/* Customer Info */}
            {order.customerInfo && (
              <div style={{ backgroundColor: 'rgba(214, 180, 124, 0.05)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(214, 180, 124, 0.2)', marginBottom: '3rem', textAlign: 'left' }}>
                <h4 style={{ color: 'var(--primary)', marginBottom: '1rem' }}><i className="fas fa-user" style={{ marginRight: '0.5rem' }}></i> เรื่องราวของคุณ</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  {order.customerInfo?.name && <div><strong style={{ color: 'var(--text-muted)' }}>ชื่อ:</strong> <span style={{ color: 'var(--text-main)' }}>{order.customerInfo.name}</span></div>}
                  {order.customerInfo?.phone && <div><strong style={{ color: 'var(--text-muted)' }}>เบอร์โทร:</strong> <span style={{ color: 'var(--text-main)' }}>{order.customerInfo.phone}</span></div>}
                  {order.customerInfo?.birthdate && <div><strong style={{ color: 'var(--text-muted)' }}>วันเกิด:</strong> <span style={{ color: 'var(--text-main)' }}>{order.customerInfo.birthdate}</span></div>}
                  {order.customerInfo?.birthtime && <div><strong style={{ color: 'var(--text-muted)' }}>เวลาตกฟาก:</strong> <span style={{ color: 'var(--text-main)' }}>{order.customerInfo.birthtime}</span></div>}
                  {order.customerInfo?.birthprovince && <div><strong style={{ color: 'var(--text-muted)' }}>จังหวัดที่เกิด:</strong> <span style={{ color: 'var(--text-main)' }}>{order.customerInfo.birthprovince}</span></div>}
                  {order.customerInfo?.budget && <div><strong style={{ color: 'var(--text-muted)' }}>งบประมาณ:</strong> <span style={{ color: 'var(--text-main)' }}>{order.customerInfo.budget}</span></div>}
                  {order.customerInfo?.carrier && <div><strong style={{ color: 'var(--text-muted)' }}>ค่ายที่ต้องการ:</strong> <span style={{ color: 'var(--text-main)' }}>{order.customerInfo.carrier}</span></div>}
                  {order.customerInfo?.job && <div><strong style={{ color: 'var(--text-muted)' }}>อาชีพ:</strong> <span style={{ color: 'var(--text-main)' }}>{order.customerInfo.job}</span></div>}
                  {order.customerInfo?.relationship && <div><strong style={{ color: 'var(--text-muted)' }}>สถานภาพ:</strong> <span style={{ color: 'var(--text-main)' }}>{order.customerInfo.relationship}</span></div>}
                  {order.customerInfo?.focus && <div><strong style={{ color: 'var(--text-muted)' }}>เรื่องที่อยากเน้นย้ำ:</strong> <span style={{ color: 'var(--primary)' }}>{order.customerInfo.focus}</span></div>}
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}><strong>{order.service === 'Destiny Rewrite' ? 'ปัญหาที่อยากแก้ไขด่วนที่สุด:' : 'เรื่องราวที่เผชิญ:'}</strong></p>
                <div style={{ color: 'var(--text-main)', fontSize: '1rem', lineHeight: '1.6', backgroundColor: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.5rem', fontStyle: 'italic' }}>
                  "{order.customerInfo?.story || 'ไม่ระบุ'}"
                </div>
              </div>
            )}

            <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto 3rem' }}>
              <div style={{ marginBottom: '2rem' }}>
                <PDFReader url={order.prediction.pdfUrl} />
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <a href={order.prediction.pdfUrl} download className="cozy-button filled" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-download"></i> ดาวน์โหลดไฟล์ PDF เก็บไว้
                </a>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(214, 180, 124, 0.2)', paddingTop: '3rem' }}>
              <h3 style={{ color: 'var(--text-main)', marginBottom: '1rem' }}>ขั้นตอนต่อไป: เพิ่มเพื่อนเพื่อเลือกเบอร์มงคลกับหม่ามี๊</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
                หลังจากอ่าน Blueprint แล้ว กรุณาแอด LINE หม่ามี๊เพื่อทำการนัดคิวพูดคุย 60 นาที และดำเนินการจัดหาซิมมงคลที่เหมาะสมกับดวงชะตาของคุณค่ะ
              </p>
              <a href="https://lin.ee/yourline" target="_blank" className="cozy-button" style={{ backgroundColor: '#00B900', color: '#fff', border: 'none', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className="fab fa-line" style={{ fontSize: '1.5rem' }}></i> แอด LINE @madamma
              </a>
            </div>
          </div>
        )}

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
