"use client";

import React, { useState, useMemo, useEffect } from 'react';
import generatePayload from 'promptpay-qr';
import QRCode from 'qrcode';

interface CheckoutStepProps {
  price: string;
  deliveryTime: string;
  qrImage?: string;
  selectedCards?: number[];
  dividerEvery?: number;
  onSubmit: (data: { fileBase64: string | null; contact: string; couponCode?: string; discount?: number }) => Promise<void>;
}

export default function CheckoutStep({ price, deliveryTime, selectedCards, dividerEvery, onSubmit }: CheckoutStepProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Coupon State
  const [couponInput, setCouponInput] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discount: number, discountType: 'FIXED' | 'PERCENTAGE'} | null>(null);

  const canSubmit = file !== null && !isSubmitting;

  const originalPrice = parseFloat(price.replace(/,/g, ''));
  const finalPrice = useMemo(() => {
    if (!appliedCoupon) return originalPrice;
    if (appliedCoupon.discountType === 'PERCENTAGE') {
      const discountAmount = originalPrice * (appliedCoupon.discount / 100);
      return Math.max(0, originalPrice - discountAmount);
    }
    return Math.max(0, originalPrice - appliedCoupon.discount);
  }, [originalPrice, appliedCoupon]);

  const [dynamicQrUrl, setDynamicQrUrl] = useState<string>('');
  
  useEffect(() => {
    const generateQR = async () => {
      try {
        const payload = generatePayload('0963563659', { amount: finalPrice });
        const dataUrl = await QRCode.toDataURL(payload, {
          color: { dark: '#000000', light: '#ffffff' },
          margin: 2
        });
        setDynamicQrUrl(dataUrl);
      } catch (err) {
        console.error('Failed to generate QR code', err);
      }
    };
    generateQR();
  }, [finalPrice]);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setIsApplyingCoupon(true);
    setCouponError('');
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAppliedCoupon(data.coupon);
        setCouponInput('');
      } else {
        setCouponError(data.error || 'รหัสส่วนลดไม่ถูกต้อง');
      }
    } catch (err) {
      setCouponError('เกิดข้อผิดพลาดในการตรวจสอบรหัส');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    try {
      let base64File = null;
      if (file) {
        const reader = new FileReader();
        base64File = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      }
      await onSubmit({ 
        fileBase64: base64File, 
        contact: 'อ่านในระบบ', 
        couponCode: appliedCoupon?.code, 
        discount: appliedCoupon?.discount 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // No longer using getQrImage since we dynamically generate the QR code


  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Loading Overlay */}
      {isSubmitting && (
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(26, 24, 22, 0.8)', backdropFilter: 'blur(5px)', zIndex: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '1rem', border: '1px solid var(--primary)' }}>
          <div style={{ width: '50px', height: '50px', border: '4px solid rgba(214, 180, 124, 0.2)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
          <p style={{ color: 'var(--primary)', fontSize: '1.2rem', letterSpacing: '0.05em' }}>กำลังส่งพลังงานแห่งคำทำนาย...</p>
        </div>
      )}
      
      {/* Selected Cards Review */}
      {selectedCards && selectedCards.length > 0 && (
        <div style={{ backgroundColor: 'rgba(26, 24, 22, 0.6)', border: '1px solid rgba(214, 180, 124, 0.2)', borderRadius: '1rem', padding: '2rem', backdropFilter: 'blur(10px)', textAlign: 'center' }}>
          <h4 style={{ color: 'var(--primary)', marginBottom: '1.5rem', fontSize: '1.2rem', lineHeight: '1.6' }}>
            ไพ่ของท่านพร้อมแล้วสำหรับนำทาง<br />แสงสว่างกำลังรออยู่
          </h4>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem' }}>
            {/* Group cards if dividerEvery is provided */}
            {(dividerEvery 
              ? Array.from({ length: Math.ceil(selectedCards.length / dividerEvery) }) 
              : [0]
            ).map((_, groupIndex) => {
              const cardsInGroup = dividerEvery 
                ? selectedCards.slice(groupIndex * dividerEvery, (groupIndex + 1) * dividerEvery)
                : selectedCards;
                
              return (
                <div key={groupIndex} style={{ display: 'flex', gap: '0.8rem', padding: '1rem', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '0.8rem', border: '1px solid rgba(214, 180, 124, 0.1)' }}>
                  {cardsInGroup.map((cardId, i) => {
                    const globalIndex = dividerEvery ? groupIndex * dividerEvery + i : i;
                    return (
                      <div key={i} style={{ width: '50px', aspectRatio: '2/3', borderRadius: '6px', border: '1px solid var(--primary)', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
                        <img src="/images/card-back.png" alt="Card Face Down" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', top: '4px', left: '4px', width: '20px', height: '20px', backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(214, 180, 124, 0.5)' }}>
                          <span style={{ color: '#fff', fontSize: '10px' }}>{globalIndex + 1}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Payment Section */}
      <div style={{ backgroundColor: 'rgba(214, 180, 124, 0.05)', border: '1px solid var(--primary)', borderRadius: '1rem', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ color: 'var(--primary)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>สแกนเพื่อเปิดรับคำทำนาย</h3>
          <p style={{ color: 'var(--text-muted)' }}>{deliveryTime}</p>
        </div>
        
        <div style={{ width: '200px', height: '200px', backgroundColor: '#fff', padding: '10px', borderRadius: '1rem', border: '2px solid var(--primary)', boxShadow: '0 0 20px rgba(214, 180, 124, 0.2)' }}>
          {dynamicQrUrl ? (
            <img src={dynamicQrUrl} alt="PromptPay QR" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>Generating...</div>
          )}
        </div>
        
        <div style={{ textAlign: 'center' }}>
          {appliedCoupon && (
            <span style={{ color: 'var(--text-muted)', fontSize: '1.2rem', textDecoration: 'line-through', marginRight: '1rem' }}>
              {originalPrice} บาท
            </span>
          )}
          <span style={{ color: 'var(--text-main)', fontSize: '2.5rem', fontWeight: 'bold' }}>
            {finalPrice} <span style={{ fontSize: '1.2rem', fontWeight: 'normal', color: 'var(--text-muted)' }}>บาท</span>
          </span>
        </div>
      </div>

      {/* Coupon Section */}
      <div style={{ backgroundColor: 'rgba(26, 24, 22, 0.6)', border: '1px solid rgba(214, 180, 124, 0.2)', borderRadius: '1rem', padding: '2rem', backdropFilter: 'blur(10px)' }}>
        <label style={{ display: 'block', color: 'var(--primary)', marginBottom: '1rem', fontSize: '1.1rem' }}>มีรหัสส่วนลดไหมคะลูก?</label>
        
        {appliedCoupon ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(214, 180, 124, 0.1)', border: '1px solid var(--primary)', borderRadius: '0.5rem', padding: '1rem' }}>
            <div>
              <span style={{ color: 'var(--primary)', fontWeight: 'bold', display: 'block', marginBottom: '0.2rem' }}>รหัสที่ใช้: {appliedCoupon.code}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                ได้รับส่วนลด {appliedCoupon.discountType === 'PERCENTAGE' ? `${appliedCoupon.discount}%` : `${appliedCoupon.discount} บาท`}
              </span>
            </div>
            <button 
              type="button" 
              onClick={handleRemoveCoupon}
              style={{ color: '#ff6b6b', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline' }}
            >
              ยกเลิกคูปอง
            </button>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="พิมพ์รหัสส่วนลดตรงนี้..." 
                style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(214, 180, 124, 0.3)', borderRadius: '0.5rem', padding: '1rem', color: 'var(--text-main)', fontSize: '1rem', outline: 'none', textTransform: 'uppercase' }}
              />
              <button 
                type="button"
                onClick={handleApplyCoupon}
                disabled={!couponInput.trim() || isApplyingCoupon}
                className="cozy-button"
                style={{ padding: '0 1.5rem', opacity: (!couponInput.trim() || isApplyingCoupon) ? 0.5 : 1, cursor: (!couponInput.trim() || isApplyingCoupon) ? 'not-allowed' : 'pointer' }}
              >
                {isApplyingCoupon ? 'กำลังเช็ค...' : 'ใช้คูปอง'}
              </button>
            </div>
            {couponError && <p style={{ color: '#ff6b6b', fontSize: '0.9rem', marginTop: '0.8rem' }}>{couponError}</p>}
          </div>
        )}
      </div>

      {/* Slip Upload */}
      <div style={{ backgroundColor: 'rgba(26, 24, 22, 0.6)', border: '1px solid rgba(214, 180, 124, 0.2)', borderRadius: '1rem', padding: '2rem', backdropFilter: 'blur(10px)' }}>
        <label style={{ display: 'block', color: 'var(--primary)', marginBottom: '1rem', fontSize: '1.1rem' }}>อัปโหลดหลักฐานการโอนเงิน</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            style={{ 
              color: 'var(--text-muted)',
              fontSize: '0.9rem'
            }} 
          />
        </div>
      </div>

      {/* Submit Button */}
      <button 
        onClick={handleSubmit} 
        disabled={!canSubmit}
        className="cozy-button filled"
        style={{ width: '100%', padding: '1rem', fontSize: '1.2rem', marginTop: '1rem', opacity: !canSubmit ? 0.5 : 1, cursor: !canSubmit ? 'not-allowed' : 'pointer' }}
      >
        ยืนยันการชำระเงินและดูคำทำนาย
      </button>

    </div>
  );
}
