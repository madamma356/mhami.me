"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { getAdminOrders, updateAdminPrediction, updateOrderStatus, uploadAdminPdf, getAllCustomers, updateCustomerAscendant } from '@/app/actions/admin';
import Footer from '@/components/Footer';

const mockOrders = [
    { 
      id: '#MH-10024', date: '26 เม.ย. 69 - 14:30', name: 'K. พลอย', lineId: 'ploy_genz', service: 'Mini Empower', price: '195.-', slipUrl: 'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?q=80&w=600&auto=format&fit=crop', slipStatus: 'pending', serviceStage: 'รับฝากหัวใจ', prediction: {},
      customerInfo: { name: 'พลอยปภัส', story: 'ช่วงนี้รู้สึกสับสนเรื่องงานมากๆ ค่ะ อยากเปลี่ยนงานแต่ก็กลัวว่าที่ใหม่จะไม่ดีเท่าที่เก่า ส่วนเรื่องความรักก็เงียบเหงามาก อยากรู้ว่าครึ่งปีหลังจะมีโชคเรื่องไหนบ้างมั้ยคะ' },
      questions: ['ปีนี้มีโอกาสจะได้เลื่อนขั้นเปลี่ยนงานไหมคะ?', 'ความรักช่วงนี้จะเป็นยังไง จะมีคนคุยใหม่ๆ เข้ามาไหม?', 'เรื่องการเงินครึ่งปีหลัง จะมีโชคลาภหรือติดขัดอะไรไหมคะ?'],
      cards: [
        [ { num: 1 }, { num: 15 }, { num: 28 } ],
        [ { num: 5 }, { num: 42 }, { num: 19 } ],
        [ { num: 11 }, { num: 33 }, { num: 7 } ]
      ]
    },
    { id: '#MH-10023', date: '26 เม.ย. 69 - 13:15', name: 'K. ต้น', lineId: 'ton_1990', service: 'Destiny Rewrite', price: '8,995.-', slipUrl: 'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?q=80&w=600&auto=format&fit=crop', slipStatus: 'approved', serviceStage: 'กำลังเชื่อมต่อพลังงาน', prediction: {}, customerInfo: { name: 'ชนาธิป', phone: '081-234-5678', birthdate: '15/08/2533', birthtime: '09:45', birthprovince: 'กรุงเทพมหานคร', story: 'อยากเปลี่ยนเบอร์ใหม่ครับ เบอร์เดิมทำอะไรก็ติดขัด เงินเก็บไม่อยู่เลย', budget: '1,000 - 5,000 บาท', carrier: 'AIS' } },
    { id: '#MH-10022', date: '25 เม.ย. 69 - 20:10', name: 'K. เมย์', lineId: 'maymay', service: 'Life Unveiled', price: '695.-', slipUrl: 'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?q=80&w=600&auto=format&fit=crop', slipStatus: 'approved', serviceStage: 'พร้อมส่งมอบความสบายใจ', prediction: {}, customerInfo: { name: 'เมธาวี', job: 'เจ้าของธุรกิจส่วนตัว', relationship: 'มีแฟน/แต่งงานแล้ว', story: 'อยากรู้ภาพรวมชีวิตในปีนี้ค่ะ ว่าจะมีโอกาสได้ขยับขยายเรื่องงานและเงินไหม แล้วก็อยากรู้เรื่องสิ่งที่ต้องระวังเป็นพิเศษค่ะ', focus: 'ภาพรวมชีวิต' } }
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [viewingSlipOrder, setViewingSlipOrder] = useState<any>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [predictionData, setPredictionData] = useState<any>({});
  
  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [customersList, setCustomersList] = useState<any[]>([]);
  const [servicesList, setServicesList] = useState<any[]>([]);
  const [reviewsList, setReviewsList] = useState<any[]>([]);
  const [blogsList, setBlogsList] = useState<any[]>([]);
  
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const dbOrders = await getAdminOrders();
        if (dbOrders && dbOrders.length > 0) {
          setOrdersList(dbOrders);
        } else {
          setOrdersList(mockOrders); // Fallback to mock data
        }
      } catch (err) {
        setOrdersList(mockOrders);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();

    const fetchCustomers = async () => {
      const dbCustomers = await getAllCustomers();
      if (dbCustomers && dbCustomers.length > 0) {
        setCustomersList(dbCustomers);
      }
    };
    fetchCustomers();

    const fetchCMSData = async () => {
      try {
        const [servicesRes, reviewsRes, blogsRes] = await Promise.all([
          fetch('/api/admin/services'),
          fetch('/api/admin/reviews'),
          fetch('/api/admin/blogs')
        ]);
        if (servicesRes.ok) setServicesList(await servicesRes.json());
        if (reviewsRes.ok) setReviewsList(await reviewsRes.json());
        if (blogsRes.ok) setBlogsList(await blogsRes.json());
      } catch (e) {
        console.error("Failed to fetch CMS data", e);
      }
    };
    fetchCMSData();
  }, []);

  const handleOpenWorkspace = (order: any) => {
    setSelectedOrder(order);
    setPredictionData(order.prediction || {});
  };

  const getStatusColor = (status: string) => {
    if (status === 'รับฝากหัวใจ') return '#FF6B81';
    if (status === 'กำลังเชื่อมต่อพลังงาน') return '#FBBF24';
    if (status === 'พร้อมส่งมอบความสบายใจ') return '#34D399';
    return 'var(--text-main)';
  };

  const handleSavePrediction = async () => {
    setOrdersList(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, prediction: predictionData } : o));
    
    if (selectedOrder.dbId) {
      if (selectedOrder.service === 'Destiny Rewrite' && predictionData.pdfBase64) {
        // Upload PDF if present
        await uploadAdminPdf(selectedOrder.dbId, predictionData.pdfBase64);
      } else {
        await updateAdminPrediction(selectedOrder.dbId, predictionData);
      }
    }
    alert('บันทึกคำทำนายลงฐานข้อมูลเรียบร้อยแล้ว');
  };

  const handleCopyToClipboard = () => {
    let text = `✨ หม่ามี๊ทำนายเสร็จเรียบร้อยแล้วนะคะ คุณ ${selectedOrder.name}\n\n👉 สามารถกดดูผลคำทำนายแบบเต็มๆ และรูปไพ่ที่เปิดได้ที่ลิงก์นี้เลยค่ะ:\nhttp://localhost:3001/reading/${selectedOrder.id.replace('#', '')}`;
    navigator.clipboard.writeText(text);
    alert('คัดลอกลิงก์สำหรับส่ง LINE เรียบร้อยแล้ว');
  };

  const handleApproveSlip = async (id: string, status: 'approved' | 'rejected') => {
    setOrdersList(prev => prev.map(o => o.id === id ? { ...o, slipStatus: status } : o));
    setViewingSlipOrder(null);
    const order = ordersList.find(o => o.id === id);
    if (order && order.dbId) {
      await updateOrderStatus(order.dbId, status, order.serviceStage);
    }
  };

  const handleUpdateServiceStage = async (id: string, stage: string) => {
    setOrdersList(prev => prev.map(o => o.id === id ? { ...o, serviceStage: stage } : o));
    const order = ordersList.find(o => o.id === id);
    if (order && order.dbId) {
      await updateOrderStatus(order.dbId, order.slipStatus, stage);
    }
  };

  // CMS Functions
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingItem?.id ? 'PUT' : 'POST';
    const res = await fetch('/api/admin/services', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingItem)
    });
    if (res.ok) {
      const saved = await res.json();
      setServicesList(prev => method === 'POST' ? [saved, ...prev] : prev.map(s => s.id === saved.id ? saved : s));
      setIsServiceModalOpen(false);
      setEditingItem(null);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('ยืนยันการลบบริการนี้?')) return;
    const res = await fetch(`/api/admin/services?id=${id}`, { method: 'DELETE' });
    if (res.ok) setServicesList(prev => prev.filter(s => s.id !== id));
  };

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingItem?.id ? 'PUT' : 'POST';
    const res = await fetch('/api/admin/reviews', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingItem)
    });
    if (res.ok) {
      const saved = await res.json();
      setReviewsList(prev => method === 'POST' ? [saved, ...prev] : prev.map(r => r.id === saved.id ? saved : r));
      setIsReviewModalOpen(false);
      setEditingItem(null);
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm('ยืนยันการลบรีวิวนี้?')) return;
    const res = await fetch(`/api/admin/reviews?id=${id}`, { method: 'DELETE' });
    if (res.ok) setReviewsList(prev => prev.filter(r => r.id !== id));
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingItem?.id ? 'PUT' : 'POST';
    const res = await fetch('/api/admin/blogs', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingItem)
    });
    if (res.ok) {
      const saved = await res.json();
      setBlogsList(prev => method === 'POST' ? [saved, ...prev] : prev.map(b => b.id === saved.id ? saved : b));
      setIsBlogModalOpen(false);
      setEditingItem(null);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm('ยืนยันการลบบทความนี้?')) return;
    const res = await fetch(`/api/admin/blogs?id=${id}`, { method: 'DELETE' });
    if (res.ok) setBlogsList(prev => prev.filter(b => b.id !== id));
  };


  const handleUpdateAscendant = async (userId: string, ascendant: string) => {
    setCustomersList(prev => prev.map(c => c.id === userId ? { ...c, ascendant } : c));
    await updateCustomerAscendant(userId, ascendant);
  };

  useEffect(() => {
    if (status === 'loading') return;

    let isAuthed = false;
    
    // Check NextAuth session first
    if (session?.user && (session.user as any).role === 'ADMIN') {
      isAuthed = true;
    } 
    // Fallback to old localStorage method
    else if (typeof window !== 'undefined' && localStorage.getItem('mhami_is_admin') === 'true') {
      isAuthed = true;
    }

    if (isAuthed) {
      setIsAuthorized(true);
    } else {
      router.push('/admin/login');
    }
  }, [router, session, status]);

  const handleLogout = async () => {
    localStorage.removeItem('mhami_is_admin');
    window.dispatchEvent(new Event('auth-change'));
    await signOut({ callbackUrl: '/' });
  };

  const navItems = [
    { id: 'dashboard', label: 'ภาพรวม (Dashboard)', icon: 'fa-chart-pie', group: 'ระบบจัดการหลัก' },
    { id: 'orders', label: 'คำสั่งซื้อ & เช็คสลิป', icon: 'fa-shopping-cart', group: 'ระบบจัดการหลัก' },
    { id: 'customers', label: 'ข้อมูลลูกค้า', icon: 'fa-users', group: 'ระบบจัดการหลัก' },
    { id: 'services', label: 'บริการพยากรณ์', icon: 'fa-magic', group: 'จัดการเนื้อหาเว็บไซต์' },
    { id: 'reviews', label: 'ระบบรีวิวลูกค้า', icon: 'fa-star', group: 'จัดการเนื้อหาเว็บไซต์' },
    { id: 'blog', label: 'บทความฮีลใจ (Blog)', icon: 'fa-pen-nib', group: 'จัดการเนื้อหาเว็บไซต์' },
  ];

  if (!isAuthorized) {
    return <div style={{ minHeight: '100vh', backgroundColor: 'var(--background)' }}></div>;
  }

  return (
    <div style={{
      position: 'fixed',
      top: '90px', left: 0, right: 0, bottom: 0,
      backgroundColor: 'transparent',
      zIndex: 10,
      display: 'flex',
      overflow: 'hidden'
    }}>
      {/* Sidebar */}
      <aside style={{
        width: '280px',
        backgroundColor: 'rgba(26, 24, 22, 0.95)',
        borderRight: '1px solid rgba(214, 180, 124, 0.1)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ padding: '2rem', textAlign: 'center', borderBottom: '1px solid rgba(214, 180, 124, 0.1)' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'block' }}>
            <img src="/images/logo.png" alt="Mhami Logo" style={{ height: '45px', objectFit: 'contain', margin: '0 auto', display: 'block' }} />
          </Link>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Admin Control Panel</p>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 0' }}>
          <div style={{ padding: '0 2rem 0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>ระบบจัดการหลัก</div>
          {navItems.filter(item => item.group === 'ระบบจัดการหลัก').map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                width: '100%', textAlign: 'left', padding: '1rem 2rem', background: activeTab === item.id ? 'rgba(214, 180, 124, 0.1)' : 'transparent',
                border: 'none', borderLeft: activeTab === item.id ? '4px solid var(--primary)' : '4px solid transparent',
                color: activeTab === item.id ? 'var(--primary)' : 'var(--text-main)',
                cursor: 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1rem'
              }}
            >
              <i className={`fas ${item.icon}`} style={{ width: '20px', textAlign: 'center' }}></i>
              {item.label}
            </button>
          ))}

          <div style={{ padding: '2rem 2rem 0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '1rem' }}>จัดการเนื้อหาเว็บไซต์</div>
          {navItems.filter(item => item.group === 'จัดการเนื้อหาเว็บไซต์').map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                width: '100%', textAlign: 'left', padding: '1rem 2rem', background: activeTab === item.id ? 'rgba(214, 180, 124, 0.1)' : 'transparent',
                border: 'none', borderLeft: activeTab === item.id ? '4px solid var(--primary)' : '4px solid transparent',
                color: activeTab === item.id ? 'var(--primary)' : 'var(--text-main)',
                cursor: 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1rem'
              }}
            >
              <i className={`fas ${item.icon}`} style={{ width: '20px', textAlign: 'center' }}></i>
              {item.label}
            </button>
          ))}
        </div>

        <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(214, 180, 124, 0.1)', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'block' }}>
            <button className="cozy-button" style={{ width: '100%', padding: '0.8rem', fontSize: '0.9rem' }}>
              <i className="fas fa-home" style={{ marginRight: '0.5rem' }}></i> กลับหน้าแรก
            </button>
          </Link>
          <button onClick={handleLogout} className="cozy-button" style={{ width: '100%', padding: '0.8rem', fontSize: '0.9rem', color: '#ff6b6b', borderColor: 'rgba(255, 107, 107, 0.2)' }}>
            <i className="fas fa-sign-out-alt" style={{ marginRight: '0.5rem' }}></i> ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'transparent' }}>
        {/* Admin Header removed to prevent duplication with Main Navigation */}        {/* Scrollable Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '3rem' }}>
          
          {/* TAB: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="fade-in">
              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                {[
                  { label: 'ยอดขายรวมเดือนนี้', value: '฿ 45,900', icon: 'fa-coins', color: 'var(--primary)' },
                  { label: 'ออเดอร์รอตรวจสอบ', value: '12 คิว', icon: 'fa-clipboard-list', color: '#ffb142' },
                  { label: 'ลูกค้าทั้งหมด', value: '1,240', icon: 'fa-users', color: 'var(--text-main)' }
                ].map((stat, i) => (
                  <div key={i} style={{ backgroundColor: 'rgba(26, 24, 22, 0.6)', border: '1px solid rgba(214, 180, 124, 0.2)', borderRadius: '1rem', padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: 'rgba(214, 180, 124, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color, fontSize: '1.8rem' }}>
                      <i className={`fas ${stat.icon}`}></i>
                    </div>
                    <div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.3rem' }}>{stat.label}</p>
                      <p style={{ color: 'var(--text-main)', fontSize: '1.8rem', fontWeight: 600 }}>{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Orders Table */}
              <h3 style={{ color: 'var(--primary)', marginBottom: '1.5rem', fontSize: '1.2rem' }}>คำสั่งซื้อล่าสุด (รอตรวจสลิป)</h3>
              <div style={{ backgroundColor: 'rgba(26, 24, 22, 0.6)', border: '1px solid rgba(214, 180, 124, 0.2)', borderRadius: '1rem', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-main)', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(214, 180, 124, 0.2)', background: 'rgba(0,0,0,0.2)' }}>
                      <th style={{ padding: '1.5rem', color: 'var(--primary)', fontWeight: 400 }}>รหัสออเดอร์</th>
                      <th style={{ padding: '1.5rem', color: 'var(--primary)', fontWeight: 400 }}>ชื่อลูกค้า</th>
                      <th style={{ padding: '1.5rem', color: 'var(--primary)', fontWeight: 400 }}>บริการ</th>
                      <th style={{ padding: '1.5rem', color: 'var(--primary)', fontWeight: 400 }}>ยอดโอน</th>
                      <th style={{ padding: '1.5rem', color: 'var(--primary)', fontWeight: 400 }}>สถานะ</th>
                      <th style={{ padding: '1.5rem', color: 'var(--primary)', fontWeight: 400 }}>จัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordersList.slice(0, 5).map((order, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(214, 180, 124, 0.1)' }}>
                        <td style={{ padding: '1.5rem' }}>
                          <button onClick={() => handleOpenWorkspace(order)} style={{ background: 'none', border: 'none', color: 'var(--primary)', textDecoration: 'underline', cursor: 'pointer', fontWeight: 500 }}>
                            {order.id}
                          </button>
                        </td>
                        <td style={{ padding: '1.5rem' }}>{order.name}</td>
                        <td style={{ padding: '1.5rem', color: 'var(--text-muted)' }}>{order.service}</td>
                        <td style={{ padding: '1.5rem' }}>{order.price}</td>
                        <td style={{ padding: '1.5rem' }}>
                          <span style={{ 
                            padding: '0.4rem 1rem', borderRadius: '2rem', fontSize: '0.8rem', 
                            backgroundColor: order.slipStatus === 'pending' ? '#ffb14220' : order.slipStatus === 'approved' ? '#33d9b220' : '#ff6b6b20', 
                            color: order.slipStatus === 'pending' ? '#ffb142' : order.slipStatus === 'approved' ? '#33d9b2' : '#ff6b6b' 
                          }}>
                            {order.slipStatus === 'pending' ? 'รอตรวจสลิป' : order.slipStatus === 'approved' ? 'สลิปถูกต้อง' : 'สลิปไม่ถูกต้อง'}
                          </span>
                        </td>
                        <td style={{ padding: '1.5rem' }}>
                          <button 
                            onClick={() => setActiveTab('orders')}
                            className={order.slipStatus === 'pending' ? 'cozy-button filled' : 'cozy-button'} 
                            style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}
                          >
                            {order.slipStatus === 'pending' ? 'ตรวจสอบ' : 'รายละเอียด'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: ORDERS */}
          {activeTab === 'orders' && (
            <div className="fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>จัดการคำสั่งซื้อและสลิปโอนเงิน</h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <input type="text" placeholder="ค้นหารหัสออเดอร์..." style={{ padding: '0.8rem 1.2rem', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(214, 180, 124, 0.3)', borderRadius: '0.5rem', color: 'var(--text-main)', outline: 'none' }} />
                  <button className="cozy-button"><i className="fas fa-filter"></i> ตัวกรอง</button>
                </div>
              </div>

              <div style={{ backgroundColor: 'rgba(26, 24, 22, 0.6)', border: '1px solid rgba(214, 180, 124, 0.2)', borderRadius: '1rem', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-main)', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(214, 180, 124, 0.2)', background: 'rgba(0,0,0,0.2)' }}>
                      <th style={{ padding: '1.5rem', color: 'var(--primary)', fontWeight: 400 }}>วันที่/เวลา</th>
                      <th style={{ padding: '1.5rem', color: 'var(--primary)', fontWeight: 400 }}>รหัสออเดอร์</th>
                      <th style={{ padding: '1.5rem', color: 'var(--primary)', fontWeight: 400 }}>ลูกค้า</th>
                      <th style={{ padding: '1.5rem', color: 'var(--primary)', fontWeight: 400 }}>บริการ</th>
                      <th style={{ padding: '1.5rem', color: 'var(--primary)', fontWeight: 400 }}>สลิปโอนเงิน</th>
                      <th style={{ padding: '1.5rem', color: 'var(--primary)', fontWeight: 400 }}>สถานะบริการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordersList.map((order, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(214, 180, 124, 0.1)' }}>
                        <td style={{ padding: '1.5rem', color: 'var(--text-muted)' }}>{order.date}</td>
                        <td style={{ padding: '1.5rem' }}>
                          <button onClick={() => handleOpenWorkspace(order)} style={{ background: 'none', border: 'none', color: 'var(--primary)', textDecoration: 'underline', cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <i className="fas fa-edit"></i> {order.id}
                          </button>
                        </td>
                        <td style={{ padding: '1.5rem' }}>{order.name} <br/><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Line: {order.lineId}</span></td>
                        <td style={{ padding: '1.5rem', color: 'var(--text-muted)' }}>{order.service}</td>
                        <td style={{ padding: '1.5rem' }}>
                          {order.slipStatus === 'pending' && (
                            <button onClick={() => setViewingSlipOrder(order)} style={{ background: 'none', border: 'none', color: '#ffb142', textDecoration: 'underline', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <i className="fas fa-image"></i> ⏳ รอตรวจสลิป
                            </button>
                          )}
                          {order.slipStatus === 'approved' && (
                            <button onClick={() => setViewingSlipOrder(order)} style={{ background: 'none', border: 'none', color: '#33d9b2', textDecoration: 'underline', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <i className="fas fa-check-circle"></i> สลิปถูกต้อง
                            </button>
                          )}
                          {order.slipStatus === 'rejected' && (
                            <button onClick={() => setViewingSlipOrder(order)} style={{ background: 'none', border: 'none', color: '#ff6b6b', textDecoration: 'underline', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <i className="fas fa-times-circle"></i> สลิปไม่ถูกต้อง
                            </button>
                          )}
                        </td>
                        <td style={{ padding: '1.5rem' }}>
                          <select 
                            value={order.serviceStage}
                            onChange={(e) => handleUpdateServiceStage(order.id, e.target.value)}
                            style={{ 
                              backgroundColor: 'rgba(0,0,0,0.4)', color: getStatusColor(order.serviceStage), 
                              border: '1px solid rgba(214, 180, 124, 0.3)', padding: '0.5rem 1rem', 
                              borderRadius: '0.5rem', outline: 'none', cursor: 'pointer',
                              fontFamily: 'inherit', fontSize: '0.85rem', fontWeight: 'bold'
                            }}
                          >
                            <option value="รับฝากหัวใจ">📥 รับฝากหัวใจ</option>
                            <option value="กำลังเชื่อมต่อพลังงาน">🔮 กำลังเชื่อมต่อพลังงาน</option>
                            <option value="พร้อมส่งมอบความสบายใจ">✨ พร้อมส่งมอบความสบายใจ</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: CUSTOMERS */}
          {activeTab === 'customers' && (
            <div className="fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>ข้อมูลลูกค้าทั้งหมด</h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <input type="text" placeholder="ค้นหาชื่อ หรือ เบอร์โทร..." style={{ padding: '0.8rem 1.2rem', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(214, 180, 124, 0.3)', borderRadius: '0.5rem', color: 'var(--text-main)', outline: 'none' }} />
                  <button className="cozy-button"><i className="fas fa-search"></i></button>
                </div>
              </div>
              <div style={{ backgroundColor: 'rgba(26, 24, 22, 0.6)', border: '1px solid rgba(214, 180, 124, 0.2)', borderRadius: '1rem', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-main)', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(214, 180, 124, 0.2)', background: 'rgba(0,0,0,0.2)' }}>
                      <th style={{ padding: '1.5rem', color: 'var(--primary)', fontWeight: 400 }}>รหัสลูกค้า</th>
                      <th style={{ padding: '1.5rem', color: 'var(--primary)', fontWeight: 400 }}>ชื่อ-นามสกุล / ชื่อเล่น</th>
                      <th style={{ padding: '1.5rem', color: 'var(--primary)', fontWeight: 400 }}>ช่องทางติดต่อ</th>
                      <th style={{ padding: '1.5rem', color: 'var(--primary)', fontWeight: 400 }}>วันเกิด / เวลาเกิด</th>
                      <th style={{ padding: '1.5rem', color: 'var(--primary)', fontWeight: 400 }}>จังหวัด</th>
                      <th style={{ padding: '1.5rem', color: 'var(--primary)', fontWeight: 400 }}>สถานะ</th>
                      <th style={{ padding: '1.5rem', color: 'var(--primary)', fontWeight: 400 }}>ลัคนาราศี</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customersList.map((c, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(214, 180, 124, 0.1)' }}>
                        <td style={{ padding: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>{c.id.substring(0, 8)}...</td>
                        <td style={{ padding: '1.5rem' }}>
                          <span style={{ color: 'var(--text-main)', display: 'block' }}>{c.name}</span>
                          {c.nickname && <span style={{ color: 'var(--primary)', fontSize: '0.85rem' }}>({c.nickname})</span>}
                        </td>
                        <td style={{ padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                          <div style={{ marginBottom: '0.2rem' }}><i className="fas fa-phone" style={{ width: '20px' }}></i> {c.contact}</div>
                          <div><i className="fab fa-line" style={{ color: '#00B900', width: '20px' }}></i> {c.lineId}</div>
                        </td>
                        <td style={{ padding: '1.5rem', color: 'var(--text-main)' }}>
                          <div style={{ marginBottom: '0.2rem' }}>{c.dob}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}><i className="far fa-clock"></i> {c.birthTime} น.</div>
                        </td>
                        <td style={{ padding: '1.5rem', color: 'var(--text-main)' }}>{c.province}</td>
                        <td style={{ padding: '1.5rem' }}>
                          <span style={{ padding: '0.4rem 1rem', borderRadius: '2rem', fontSize: '0.8rem', backgroundColor: `${c.statusColor}20`, color: c.statusColor, border: `1px solid ${c.statusColor}40` }}>{c.status} ({c.orders} ออเดอร์)</span>
                        </td>
                        <td style={{ padding: '1.5rem' }}>
                          <select 
                            value={c.ascendant || ''}
                            onChange={(e) => handleUpdateAscendant(c.id, e.target.value)}
                            style={{ 
                              backgroundColor: 'rgba(0,0,0,0.4)', color: 'var(--text-main)', 
                              border: '1px solid rgba(214, 180, 124, 0.3)', padding: '0.5rem', 
                              borderRadius: '0.5rem', outline: 'none', cursor: 'pointer',
                              fontFamily: 'inherit', fontSize: '0.9rem', width: '150px'
                            }}
                          >
                            <option value="">-- ยังไม่คำนวณ --</option>
                            <optgroup label="🔥 ธาตุไฟ">
                              <option value="เมษ ♈">เมษ ♈</option>
                              <option value="สิงห์ ♌">สิงห์ ♌</option>
                              <option value="ธนู ♐">ธนู ♐</option>
                            </optgroup>
                            <optgroup label="🌍 ธาตุดิน">
                              <option value="พฤษภ ♉">พฤษภ ♉</option>
                              <option value="กันย์ ♍">กันย์ ♍</option>
                              <option value="มังกร ♑">มังกร ♑</option>
                            </optgroup>
                            <optgroup label="💨 ธาตุลม">
                              <option value="เมถุน ♊">เมถุน ♊</option>
                              <option value="ตุลย์ ♎">ตุลย์ ♎</option>
                              <option value="กุมภ์ ♒">กุมภ์ ♒</option>
                            </optgroup>
                            <optgroup label="💧 ธาตุน้ำ">
                              <option value="กรกฎ ♋">กรกฎ ♋</option>
                              <option value="พิจิก ♏">พิจิก ♏</option>
                              <option value="มีน ♓">มีน ♓</option>
                            </optgroup>
                          </select>
                        </td>
                      </tr>
                    ))}
                    {customersList.length === 0 && (
                      <tr>
                        <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>ยังไม่มีข้อมูลลูกค้าในระบบ หรือกำลังโหลดข้อมูล...</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: SERVICES */}
          {activeTab === 'services' && (
            <div className="fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>จัดการบริการพยากรณ์</h3>
                <button 
                  className="cozy-button filled" 
                  onClick={() => { setEditingItem({ isActive: true }); setIsServiceModalOpen(true); }}
                >
                  <i className="fas fa-plus"></i> เพิ่มบริการใหม่
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {servicesList.map((s, i) => (
                  <div key={i} style={{ backgroundColor: 'rgba(26, 24, 22, 0.6)', border: `1px solid ${s.isActive ? 'rgba(214, 180, 124, 0.4)' : 'rgba(255,255,255,0.1)'}`, borderRadius: '1rem', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ height: '150px', backgroundImage: `url(${s.imageUrl || '/images/logo.png'})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: s.isActive ? 1 : 0.4 }}></div>
                    <div style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <h4 style={{ color: 'var(--text-main)', fontSize: '1.1rem', margin: 0 }}>{s.title}</h4>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => { setEditingItem(s); setIsServiceModalOpen(true); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><i className="fas fa-edit"></i></button>
                          <button onClick={() => handleDeleteService(s.id)} style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer' }}><i className="fas fa-trash"></i></button>
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ color: 'var(--primary)', fontSize: '1.2rem', margin: 0 }}>{s.price}.-</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ color: s.isActive ? '#33d9b2' : 'var(--text-muted)', fontSize: '0.8rem' }}>{s.isActive ? 'เปิดรับคิว' : 'ปิดชั่วคราว'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {servicesList.length === 0 && (
                  <p style={{ color: 'var(--text-muted)' }}>ยังไม่มีข้อมูลบริการ</p>
                )}
              </div>
            </div>
          )}

          {/* TAB: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>ระบบจัดการรีวิวลูกค้า</h3>
                <button 
                  className="cozy-button filled" 
                  onClick={() => { setEditingItem({ isVisible: true }); setIsReviewModalOpen(true); }}
                >
                  <i className="fas fa-plus"></i> เพิ่มรีวิวใหม่
                </button>
              </div>
              <div style={{ backgroundColor: 'rgba(26, 24, 22, 0.6)', border: '1px solid rgba(214, 180, 124, 0.2)', borderRadius: '1rem', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-main)', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(214, 180, 124, 0.2)', background: 'rgba(0,0,0,0.2)' }}>
                      <th style={{ padding: '1.5rem', color: 'var(--primary)', fontWeight: 400 }}>ชื่อลูกค้า</th>
                      <th style={{ padding: '1.5rem', color: 'var(--primary)', fontWeight: 400 }}>ข้อความรีวิว</th>
                      <th style={{ padding: '1.5rem', color: 'var(--primary)', fontWeight: 400 }}>วันที่</th>
                      <th style={{ padding: '1.5rem', color: 'var(--primary)', fontWeight: 400 }}>โชว์หน้าหลัก</th>
                      <th style={{ padding: '1.5rem', color: 'var(--primary)', fontWeight: 400 }}>จัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviewsList.map((r, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(214, 180, 124, 0.1)' }}>
                        <td style={{ padding: '1.5rem', whiteSpace: 'nowrap' }}>{r.author}</td>
                        <td style={{ padding: '1.5rem', color: 'var(--text-muted)', maxWidth: '400px' }}>
                          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>"{r.text}"</div>
                        </td>
                        <td style={{ padding: '1.5rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{new Date(r.createdAt).toLocaleDateString('th-TH')}</td>
                        <td style={{ padding: '1.5rem' }}>
                          <span style={{ padding: '0.4rem 1rem', borderRadius: '2rem', fontSize: '0.8rem', backgroundColor: r.isVisible ? '#33d9b220' : 'rgba(255,255,255,0.05)', color: r.isVisible ? '#33d9b2' : 'var(--text-muted)', border: `1px solid ${r.isVisible ? '#33d9b240' : 'transparent'}` }}>{r.isVisible ? 'แสดงอยู่' : 'ซ่อน'}</span>
                        </td>
                        <td style={{ padding: '1.5rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => { setEditingItem(r); setIsReviewModalOpen(true); }} className="cozy-button" style={{ padding: '0.4rem', fontSize: '0.9rem' }}><i className="fas fa-edit"></i></button>
                            <button onClick={() => handleDeleteReview(r.id)} className="cozy-button" style={{ padding: '0.4rem', fontSize: '0.9rem', color: '#ff6b6b', borderColor: '#ff6b6b20' }}><i className="fas fa-trash"></i></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {reviewsList.length === 0 && (
                      <tr>
                        <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>ยังไม่มีข้อมูลรีวิว</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: BLOG */}
          {activeTab === 'blog' && (
            <div className="fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>ระบบจัดการบทความ (Blog CMS)</h3>
                <button 
                  className="cozy-button filled" 
                  onClick={() => { setEditingItem({ status: 'published' }); setIsBlogModalOpen(true); }}
                >
                  <i className="fas fa-pen-nib"></i> สร้างบทความใหม่
                </button>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                {blogsList.map((b, i) => (
                  <div key={i} style={{ backgroundColor: 'rgba(26, 24, 22, 0.6)', border: '1px solid rgba(214, 180, 124, 0.2)', borderRadius: '1rem', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <span style={{ padding: '0.3rem 0.8rem', borderRadius: '2rem', fontSize: '0.75rem', backgroundColor: b.status === 'published' ? '#33d9b220' : 'rgba(255,255,255,0.05)', color: b.status === 'published' ? '#33d9b2' : 'var(--text-muted)' }}>{b.status}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{new Date(b.createdAt).toLocaleDateString('th-TH')}</span>
                    </div>
                    <h4 style={{ color: 'var(--text-main)', fontSize: '1.2rem', marginBottom: '1rem', lineHeight: '1.4' }}>{b.title}</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '2rem', flex: 1 }}>{b.content.substring(0, 100)}...</p>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid rgba(214, 180, 124, 0.1)', paddingTop: '1.5rem' }}>
                      <button onClick={() => { setEditingItem(b); setIsBlogModalOpen(true); }} className="cozy-button" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}><i className="fas fa-edit" style={{ marginRight: '0.5rem' }}></i> แก้ไข</button>
                      <button onClick={() => handleDeleteBlog(b.id)} className="cozy-button" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', color: '#ff6b6b', borderColor: '#ff6b6b20' }}><i className="fas fa-trash"></i></button>
                    </div>
                  </div>
                ))}
                {blogsList.length === 0 && (
                  <p style={{ color: 'var(--text-muted)' }}>ยังไม่มีบทความ</p>
                )}
              </div>
            </div>
          )}

          {/* FALLBACK (If any other tab is selected) */}
          {!['dashboard', 'orders', 'customers', 'services', 'reviews', 'blog'].includes(activeTab) && (
             <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', textAlign: 'center' }}>
               <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(214, 180, 124, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                 <i className="fas fa-tools" style={{ fontSize: '2.5rem', color: 'var(--primary)' }}></i>
               </div>
               <h3 style={{ color: 'var(--text-main)', fontSize: '1.5rem', marginBottom: '1rem' }}>กำลังพัฒนาระบบส่วนนี้</h3>
               <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '400px', lineHeight: '1.6' }}>ระบบจัดการจะเปิดให้ใช้งานในอัปเดตถัดไปของ Mhami Healing Space นะคะ</p>
             </div>
          )}

          <div style={{ margin: 'auto -3rem -3rem -3rem', marginTop: '3rem' }}>
            <Footer />
          </div>
        </div>
      </main>

      {/* Slip Modal Overlay */}
      {viewingSlipOrder && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 10000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(5px)'
        }} onClick={() => setViewingSlipOrder(null)}>
          <div className="fade-in" style={{
            position: 'relative',
            maxWidth: '90%', maxHeight: '90%',
            backgroundColor: 'var(--bg-dark)',
            padding: '1.5rem', borderRadius: '1rem',
            border: '1px solid rgba(214, 180, 124, 0.3)',
            display: 'flex', flexDirection: 'column', alignItems: 'center'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ color: 'var(--primary)', margin: 0 }}>สลิปโอนเงิน ออเดอร์ {viewingSlipOrder.id}</h3>
              <button onClick={() => setViewingSlipOrder(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
            </div>
            <img src={viewingSlipOrder.slipUrl} alt="Payment Slip" style={{ maxWidth: '100%', maxHeight: '65vh', objectFit: 'contain', borderRadius: '0.5rem' }} />
            
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => handleApproveSlip(viewingSlipOrder.id, 'approved')} className="cozy-button filled" style={{ padding: '0.8rem 2rem', backgroundColor: viewingSlipOrder.slipStatus === 'approved' ? '#33d9b2' : 'transparent', borderColor: '#33d9b2', color: viewingSlipOrder.slipStatus === 'approved' ? '#000' : '#33d9b2', flex: 1, maxWidth: '150px' }}><i className="fas fa-check"></i> อนุมัติ</button>
              <button onClick={() => handleApproveSlip(viewingSlipOrder.id, 'rejected')} className="cozy-button" style={{ padding: '0.8rem 2rem', backgroundColor: viewingSlipOrder.slipStatus === 'rejected' ? '#ff6b6b' : 'transparent', color: viewingSlipOrder.slipStatus === 'rejected' ? '#000' : '#ff6b6b', borderColor: '#ff6b6b', flex: 1, maxWidth: '150px' }}><i className="fas fa-times"></i> ปฏิเสธ</button>
              <button onClick={() => setViewingSlipOrder(null)} className="cozy-button" style={{ padding: '0.8rem 2rem', flex: 1, maxWidth: '150px' }}>ปิด</button>
            </div>
          </div>
        </div>
      )}

      {/* Workspace / Order Details Modal */}
      {selectedOrder && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 10000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(10px)', padding: '2rem'
        }} onClick={() => setSelectedOrder(null)}>
          <div className="fade-in" style={{
            position: 'relative',
            width: '100%', maxWidth: '800px', maxHeight: '90vh',
            backgroundColor: 'var(--bg-dark)',
            borderRadius: '1rem',
            border: '1px solid rgba(214, 180, 124, 0.3)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden'
          }} onClick={e => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(214, 180, 124, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(26, 24, 22, 0.9)' }}>
              <div>
                <h3 style={{ color: 'var(--primary)', margin: '0 0 0.5rem', fontSize: '1.3rem' }}>ออเดอร์ {selectedOrder.id} - {selectedOrder.service}</h3>
                <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>ลูกค้า: {selectedOrder.name} (LINE: {selectedOrder.lineId})</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
              
              {/* Mini Empower Form */}
              {selectedOrder.service === 'Mini Empower' && (
                <div>
                  {/* Customer Info Section */}
                  <div style={{ backgroundColor: 'rgba(214, 180, 124, 0.05)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(214, 180, 124, 0.2)', marginBottom: '2rem' }}>
                    <h4 style={{ color: 'var(--primary)', marginBottom: '1rem' }}><i className="fas fa-user" style={{ marginRight: '0.5rem' }}></i> ข้อมูลลูกค้า</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      {selectedOrder.customerInfo?.name && <div><strong style={{ color: 'var(--text-muted)' }}>ชื่อ:</strong> <span style={{ color: 'var(--text-main)' }}>{selectedOrder.customerInfo.name}</span></div>}
                      {selectedOrder.customerInfo?.phone && <div><strong style={{ color: 'var(--text-muted)' }}>เบอร์โทร:</strong> <span style={{ color: 'var(--text-main)' }}>{selectedOrder.customerInfo.phone}</span></div>}
                      {selectedOrder.customerInfo?.birthdate && <div><strong style={{ color: 'var(--text-muted)' }}>วันเกิด:</strong> <span style={{ color: 'var(--text-main)' }}>{selectedOrder.customerInfo.birthdate}</span></div>}
                      {selectedOrder.customerInfo?.birthtime && <div><strong style={{ color: 'var(--text-muted)' }}>เวลาตกฟาก:</strong> <span style={{ color: 'var(--text-main)' }}>{selectedOrder.customerInfo.birthtime}</span></div>}
                      {selectedOrder.customerInfo?.birthprovince && <div><strong style={{ color: 'var(--text-muted)' }}>จังหวัดที่เกิด:</strong> <span style={{ color: 'var(--text-main)' }}>{selectedOrder.customerInfo.birthprovince}</span></div>}
                      {selectedOrder.customerInfo?.budget && <div><strong style={{ color: 'var(--text-muted)' }}>งบประมาณ:</strong> <span style={{ color: 'var(--text-main)' }}>{selectedOrder.customerInfo.budget}</span></div>}
                      {selectedOrder.customerInfo?.carrier && <div><strong style={{ color: 'var(--text-muted)' }}>ค่ายที่ต้องการ:</strong> <span style={{ color: 'var(--text-main)' }}>{selectedOrder.customerInfo.carrier}</span></div>}
                      {selectedOrder.customerInfo?.job && <div><strong style={{ color: 'var(--text-muted)' }}>อาชีพ:</strong> <span style={{ color: 'var(--text-main)' }}>{selectedOrder.customerInfo.job}</span></div>}
                      {selectedOrder.customerInfo?.relationship && <div><strong style={{ color: 'var(--text-muted)' }}>สถานภาพ:</strong> <span style={{ color: 'var(--text-main)' }}>{selectedOrder.customerInfo.relationship}</span></div>}
                      {selectedOrder.customerInfo?.focus && <div><strong style={{ color: 'var(--text-muted)' }}>เรื่องที่อยากเน้นย้ำ:</strong> <span style={{ color: 'var(--primary)' }}>{selectedOrder.customerInfo.focus}</span></div>}
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}><strong>{selectedOrder.service === 'Destiny Rewrite' ? 'ปัญหาที่อยากแก้ไขด่วนที่สุด:' : 'เรื่องราวที่เผชิญ:'}</strong></p>
                    <div style={{ color: 'var(--text-main)', fontSize: '1rem', lineHeight: '1.6', backgroundColor: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.5rem', fontStyle: 'italic' }}>
                      "{selectedOrder.customerInfo?.story || 'ไม่ระบุ'}"
                    </div>
                  </div>

                  <h4 style={{ color: 'var(--text-main)', marginBottom: '1.5rem' }}>คำถามและไพ่ที่ได้</h4>
                  {[1, 2, 3].map(qNum => (
                    <div key={qNum} style={{ marginBottom: '2.5rem', backgroundColor: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(214, 180, 124, 0.1)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        {/* Question */}
                        <div>
                          <p style={{ color: 'var(--primary)', fontSize: '1rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>คำถามข้อที่ {qNum}: <span style={{ color: 'var(--text-main)', fontWeight: 'normal' }}>{selectedOrder.questions?.[qNum-1] || 'ลูกค้าไม่ได้ระบุคำถาม'}</span></p>
                        </div>
                        {/* Card Visuals (3 Cards) */}
                        <div style={{ display: 'flex', gap: '1rem' }}>
                          {(selectedOrder.cards?.[qNum-1] || [1,2,3]).map((c: any, i: number) => (
                            <div key={i} style={{ width: '80px', flexShrink: 0 }}>
                              <img src={`/images/cards/${c.num || i+1}.png`} alt={`Card ${c.num || i+1}`} style={{ width: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.5)', border: '1px solid rgba(214, 180, 124, 0.5)', display: 'block' }} />
                            </div>
                          ))}
                        </div>
                      </div>
                      <textarea 
                        value={predictionData[`q${qNum}`] || ''}
                        onChange={(e) => setPredictionData({...predictionData, [`q${qNum}`]: e.target.value})}
                        placeholder="พิมพ์คำทำนาย..."
                        style={{ width: '100%', height: '120px', backgroundColor: 'rgba(26, 24, 22, 0.8)', border: '1px solid rgba(214, 180, 124, 0.3)', borderRadius: '0.5rem', padding: '1rem', color: 'var(--text-main)', fontFamily: 'inherit', resize: 'vertical', outline: 'none' }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Life Unveiled Form */}
              {selectedOrder.service === 'Life Unveiled' && (
                <div>
                  {/* Customer Info Section */}
                  <div style={{ backgroundColor: 'rgba(214, 180, 124, 0.05)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(214, 180, 124, 0.2)', marginBottom: '2rem' }}>
                    <h4 style={{ color: 'var(--primary)', marginBottom: '1rem' }}><i className="fas fa-user" style={{ marginRight: '0.5rem' }}></i> ข้อมูลลูกค้า</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      {selectedOrder.customerInfo?.name && <div><strong style={{ color: 'var(--text-muted)' }}>ชื่อ:</strong> <span style={{ color: 'var(--text-main)' }}>{selectedOrder.customerInfo.name}</span></div>}
                      {selectedOrder.customerInfo?.phone && <div><strong style={{ color: 'var(--text-muted)' }}>เบอร์โทร:</strong> <span style={{ color: 'var(--text-main)' }}>{selectedOrder.customerInfo.phone}</span></div>}
                      {selectedOrder.customerInfo?.birthdate && <div><strong style={{ color: 'var(--text-muted)' }}>วันเกิด:</strong> <span style={{ color: 'var(--text-main)' }}>{selectedOrder.customerInfo.birthdate}</span></div>}
                      {selectedOrder.customerInfo?.birthtime && <div><strong style={{ color: 'var(--text-muted)' }}>เวลาตกฟาก:</strong> <span style={{ color: 'var(--text-main)' }}>{selectedOrder.customerInfo.birthtime}</span></div>}
                      {selectedOrder.customerInfo?.birthprovince && <div><strong style={{ color: 'var(--text-muted)' }}>จังหวัดที่เกิด:</strong> <span style={{ color: 'var(--text-main)' }}>{selectedOrder.customerInfo.birthprovince}</span></div>}
                      {selectedOrder.customerInfo?.budget && <div><strong style={{ color: 'var(--text-muted)' }}>งบประมาณ:</strong> <span style={{ color: 'var(--text-main)' }}>{selectedOrder.customerInfo.budget}</span></div>}
                      {selectedOrder.customerInfo?.carrier && <div><strong style={{ color: 'var(--text-muted)' }}>ค่ายที่ต้องการ:</strong> <span style={{ color: 'var(--text-main)' }}>{selectedOrder.customerInfo.carrier}</span></div>}
                      {selectedOrder.customerInfo?.job && <div><strong style={{ color: 'var(--text-muted)' }}>อาชีพ:</strong> <span style={{ color: 'var(--text-main)' }}>{selectedOrder.customerInfo.job}</span></div>}
                      {selectedOrder.customerInfo?.relationship && <div><strong style={{ color: 'var(--text-muted)' }}>สถานภาพ:</strong> <span style={{ color: 'var(--text-main)' }}>{selectedOrder.customerInfo.relationship}</span></div>}
                      {selectedOrder.customerInfo?.focus && <div><strong style={{ color: 'var(--text-muted)' }}>เรื่องที่อยากเน้นย้ำ:</strong> <span style={{ color: 'var(--primary)' }}>{selectedOrder.customerInfo.focus}</span></div>}
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}><strong>{selectedOrder.service === 'Destiny Rewrite' ? 'ปัญหาที่อยากแก้ไขด่วนที่สุด:' : 'เรื่องราวที่เผชิญ:'}</strong></p>
                    <div style={{ color: 'var(--text-main)', fontSize: '1rem', lineHeight: '1.6', backgroundColor: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.5rem', fontStyle: 'italic' }}>
                      "{selectedOrder.customerInfo?.story || 'ไม่ระบุ'}"
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                    <div style={{ textAlign: 'center', padding: '1.5rem', backgroundColor: 'rgba(214, 180, 124, 0.05)', borderRadius: '1rem', border: '1px solid rgba(214, 180, 124, 0.2)', width: '100%' }}>
                      <h4 style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>พรหมญาณพยากรณ์ 12 ใบ ไขความลับชีวิต</h4>
                      <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '1rem',
                        alignItems: 'center',
                        maxWidth: '800px',
                        margin: '0 auto'
                      }}>
                        {(() => {
                          const cards = selectedOrder.cards || Array.from({length: 12}, (_, i) => ({num: i+1}));
                          const posNames = ['วาสนา', 'ทรัพย์สิน', 'บ้านช่อง', 'ญาติมิตร', 'บุตรบริวาร', 'ศัตรู', 'คู่ครอง', 'โรคภัย', 'ความสุข', 'การงาน', 'ลาภยศ', 'สรุป'];
                          
                          const renderCard = (index: number) => {
                            const c = cards[index];
                            if (!c) return null;
                            return (
                              <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--primary)', marginBottom: '0.3rem', fontWeight: 'bold' }}>{index+1}. {posNames[index]}</span>
                                <img src={`/images/cards/${c.num}.png`} alt={`Card ${c.num}`} style={{ width: '65px', height: 'auto', borderRadius: '4px', boxShadow: '0 2px 5px rgba(0,0,0,0.5)', border: '1px solid rgba(214, 180, 124, 0.5)' }} />
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
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    {[
                      { key: 'overall', label: 'ภาพรวมชีวิต' },
                      { key: 'obstacles', label: 'จุดติดปัญหา' },
                      { key: 'career', label: 'การงาน' },
                      { key: 'finance', label: 'การเงิน' },
                      { key: 'love', label: 'ความรัก' },
                      { key: 'adjustment', label: 'สิ่งที่ต้องปรับ' }
                    ].map((cat, i) => (
                      <div key={i}>
                        <p style={{ color: 'var(--primary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>{i+1}. {cat.label}</p>
                        <textarea 
                          value={predictionData[cat.key] || ''}
                          onChange={(e) => setPredictionData({...predictionData, [cat.key]: e.target.value})}
                          placeholder={`คำทำนาย ${cat.label}...`}
                          style={{ width: '100%', height: '120px', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(214, 180, 124, 0.2)', borderRadius: '0.5rem', padding: '0.8rem', color: 'var(--text-main)', fontFamily: 'inherit', resize: 'vertical', outline: 'none', fontSize: '0.9rem' }}
                        />
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: '1.5rem' }}>
                    <p style={{ color: 'var(--primary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}><i className="fas fa-gift" style={{ marginRight: '0.5rem' }}></i>โบนัส: คำคม 1 ประโยค</p>
                    <input 
                      type="text"
                      value={predictionData.quote || ''}
                      onChange={(e) => setPredictionData({...predictionData, quote: e.target.value})}
                      placeholder="เช่น 'จงเป็นตัวเองในเวอร์ชันที่ดีที่สุด'..."
                      style={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(214, 180, 124, 0.2)', borderRadius: '0.5rem', padding: '0.8rem', color: 'var(--text-main)', fontFamily: 'inherit', outline: 'none', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>
              )}

              {/* Destiny Rewrite Form */}
              {selectedOrder.service === 'Destiny Rewrite' && (
                <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                  
                  {/* Customer Info Section */}
                  <div style={{ backgroundColor: 'rgba(214, 180, 124, 0.05)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(214, 180, 124, 0.2)', marginBottom: '3rem', textAlign: 'left' }}>
                    <h4 style={{ color: 'var(--primary)', marginBottom: '1rem' }}><i className="fas fa-user" style={{ marginRight: '0.5rem' }}></i> ข้อมูลลูกค้า</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      {selectedOrder.customerInfo?.name && <div><strong style={{ color: 'var(--text-muted)' }}>ชื่อ:</strong> <span style={{ color: 'var(--text-main)' }}>{selectedOrder.customerInfo.name}</span></div>}
                      {selectedOrder.customerInfo?.phone && <div><strong style={{ color: 'var(--text-muted)' }}>เบอร์โทร:</strong> <span style={{ color: 'var(--text-main)' }}>{selectedOrder.customerInfo.phone}</span></div>}
                      {selectedOrder.customerInfo?.birthdate && <div><strong style={{ color: 'var(--text-muted)' }}>วันเกิด:</strong> <span style={{ color: 'var(--text-main)' }}>{selectedOrder.customerInfo.birthdate}</span></div>}
                      {selectedOrder.customerInfo?.birthtime && <div><strong style={{ color: 'var(--text-muted)' }}>เวลาตกฟาก:</strong> <span style={{ color: 'var(--text-main)' }}>{selectedOrder.customerInfo.birthtime}</span></div>}
                      {selectedOrder.customerInfo?.birthprovince && <div><strong style={{ color: 'var(--text-muted)' }}>จังหวัดที่เกิด:</strong> <span style={{ color: 'var(--text-main)' }}>{selectedOrder.customerInfo.birthprovince}</span></div>}
                      {selectedOrder.customerInfo?.budget && <div><strong style={{ color: 'var(--text-muted)' }}>งบประมาณ:</strong> <span style={{ color: 'var(--text-main)' }}>{selectedOrder.customerInfo.budget}</span></div>}
                      {selectedOrder.customerInfo?.carrier && <div><strong style={{ color: 'var(--text-muted)' }}>ค่ายที่ต้องการ:</strong> <span style={{ color: 'var(--text-main)' }}>{selectedOrder.customerInfo.carrier}</span></div>}
                      {selectedOrder.customerInfo?.job && <div><strong style={{ color: 'var(--text-muted)' }}>อาชีพ:</strong> <span style={{ color: 'var(--text-main)' }}>{selectedOrder.customerInfo.job}</span></div>}
                      {selectedOrder.customerInfo?.relationship && <div><strong style={{ color: 'var(--text-muted)' }}>สถานภาพ:</strong> <span style={{ color: 'var(--text-main)' }}>{selectedOrder.customerInfo.relationship}</span></div>}
                      {selectedOrder.customerInfo?.focus && <div><strong style={{ color: 'var(--text-muted)' }}>เรื่องที่อยากเน้นย้ำ:</strong> <span style={{ color: 'var(--primary)' }}>{selectedOrder.customerInfo.focus}</span></div>}
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}><strong>{selectedOrder.service === 'Destiny Rewrite' ? 'ปัญหาที่อยากแก้ไขด่วนที่สุด:' : 'เรื่องราวที่เผชิญ:'}</strong></p>
                    <div style={{ color: 'var(--text-main)', fontSize: '1rem', lineHeight: '1.6', backgroundColor: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.5rem', fontStyle: 'italic' }}>
                      "{selectedOrder.customerInfo?.story || 'ไม่ระบุ'}"
                    </div>
                  </div>

                  <i className="fas fa-file-pdf" style={{ fontSize: '4rem', color: 'var(--primary)', marginBottom: '1.5rem' }}></i>
                  <h4 style={{ color: 'var(--text-main)', marginBottom: '1rem' }}>อัปโหลดไฟล์ Blueprint (PDF)</h4>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>เลือกไฟล์ PDF เพื่อส่งมอบให้ลูกค้า</p>
                  
                  <input 
                    type="file" 
                    accept=".pdf"
                    id="admin-pdf-upload"
                    style={{ display: 'none' }}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          setPredictionData({ ...predictionData, pdfBase64: reader.result as string, fileName: file.name });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <label htmlFor="admin-pdf-upload" className="cozy-button" style={{ padding: '0.8rem 2rem', borderStyle: 'dashed', cursor: 'pointer', display: 'inline-block' }}>
                    <i className="fas fa-upload" style={{ marginRight: '0.5rem' }}></i> เลือกไฟล์ PDF
                  </label>
                  
                  {predictionData.fileName && (
                    <p style={{ color: 'var(--text-main)', marginTop: '1rem', fontSize: '0.9rem' }}>
                      <i className="fas fa-file-pdf" style={{ color: '#ff6b81', marginRight: '0.5rem' }}></i> {predictionData.fileName}
                    </p>
                  )}
                  {predictionData.pdfUrl && !predictionData.fileName && (
                    <p style={{ color: '#33d9b2', marginTop: '1rem', fontSize: '0.9rem' }}><i className="fas fa-check-circle"></i> มีไฟล์ถูกอัปโหลดไว้แล้ว</p>
                  )}
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid rgba(214, 180, 124, 0.1)', display: 'flex', justifyContent: 'space-between', backgroundColor: 'rgba(26, 24, 22, 0.9)' }}>
              <button onClick={() => setSelectedOrder(null)} className="cozy-button" style={{ padding: '0.8rem 2rem' }}>ปิด</button>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={handleCopyToClipboard} className="cozy-button" style={{ borderColor: 'rgba(214, 180, 124, 0.5)' }}>
                  <i className="far fa-copy" style={{ marginRight: '0.5rem' }}></i> คัดลอกลิงก์ส่ง LINE
                </button>
                <button onClick={handleSavePrediction} className="cozy-button filled" style={{ padding: '0.8rem 2rem', backgroundColor: '#33d9b2', borderColor: '#33d9b2', color: '#000' }}>
                  <i className="fas fa-save" style={{ marginRight: '0.5rem' }}></i> บันทึกคำทำนาย
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* CMS Modals */}
      {isServiceModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div className="fade-in" style={{ backgroundColor: 'var(--bg-main)', width: '100%', maxWidth: '600px', borderRadius: '1rem', border: '1px solid rgba(214, 180, 124, 0.2)', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
            <div style={{ padding: '2rem', borderBottom: '1px solid rgba(214, 180, 124, 0.1)' }}>
              <h3 style={{ color: 'var(--primary)', margin: 0 }}>{editingItem?.id ? 'แก้ไขบริการ' : 'เพิ่มบริการใหม่'}</h3>
            </div>
            <form onSubmit={handleSaveService} style={{ padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>ชื่อบริการ (Title)</label>
                <input type="text" value={editingItem?.title || ''} onChange={e => setEditingItem({ ...editingItem, title: e.target.value })} style={{ width: '100%', padding: '1rem', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(214, 180, 124, 0.2)', borderRadius: '0.5rem', color: 'var(--text-main)' }} required />
              </div>
              <div>
                <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>ประเภท/รหัสบริการ (เช่น PHROM_YAN)</label>
                <input type="text" value={editingItem?.typeKey || ''} onChange={e => setEditingItem({ ...editingItem, typeKey: e.target.value })} style={{ width: '100%', padding: '1rem', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(214, 180, 124, 0.2)', borderRadius: '0.5rem', color: 'var(--text-main)' }} required />
              </div>
              <div>
                <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>ราคา (บาท)</label>
                <input type="number" value={editingItem?.price || 0} onChange={e => setEditingItem({ ...editingItem, price: e.target.value })} style={{ width: '100%', padding: '1rem', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(214, 180, 124, 0.2)', borderRadius: '0.5rem', color: 'var(--text-main)' }} required />
              </div>
              <div>
                <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>ลิงก์รูปภาพประกอบ (Image URL)</label>
                <input type="text" value={editingItem?.imageUrl || ''} onChange={e => setEditingItem({ ...editingItem, imageUrl: e.target.value })} style={{ width: '100%', padding: '1rem', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(214, 180, 124, 0.2)', borderRadius: '0.5rem', color: 'var(--text-main)' }} />
              </div>
              <div>
                <label style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={editingItem?.isActive || false} onChange={e => setEditingItem({ ...editingItem, isActive: e.target.checked })} style={{ width: '20px', height: '20px' }} />
                  เปิดรับคิว (Active)
                </label>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsServiceModalOpen(false)} className="cozy-button">ยกเลิก</button>
                <button type="submit" className="cozy-button filled">บันทึก</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isReviewModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div className="fade-in" style={{ backgroundColor: 'var(--bg-main)', width: '100%', maxWidth: '600px', borderRadius: '1rem', border: '1px solid rgba(214, 180, 124, 0.2)', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
            <div style={{ padding: '2rem', borderBottom: '1px solid rgba(214, 180, 124, 0.1)' }}>
              <h3 style={{ color: 'var(--primary)', margin: 0 }}>{editingItem?.id ? 'แก้ไขรีวิว' : 'เพิ่มรีวิวใหม่'}</h3>
            </div>
            <form onSubmit={handleSaveReview} style={{ padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>ชื่อลูกค้า</label>
                <input type="text" value={editingItem?.author || ''} onChange={e => setEditingItem({ ...editingItem, author: e.target.value })} style={{ width: '100%', padding: '1rem', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(214, 180, 124, 0.2)', borderRadius: '0.5rem', color: 'var(--text-main)' }} required />
              </div>
              <div>
                <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>ข้อความรีวิว</label>
                <textarea rows={5} value={editingItem?.text || ''} onChange={e => setEditingItem({ ...editingItem, text: e.target.value })} style={{ width: '100%', padding: '1rem', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(214, 180, 124, 0.2)', borderRadius: '0.5rem', color: 'var(--text-main)', resize: 'none' }} required></textarea>
              </div>
              <div>
                <label style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={editingItem?.isVisible || false} onChange={e => setEditingItem({ ...editingItem, isVisible: e.target.checked })} style={{ width: '20px', height: '20px' }} />
                  โชว์ที่หน้าหลัก (Visible)
                </label>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsReviewModalOpen(false)} className="cozy-button">ยกเลิก</button>
                <button type="submit" className="cozy-button filled">บันทึก</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isBlogModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div className="fade-in" style={{ backgroundColor: 'var(--bg-main)', width: '100%', maxWidth: '800px', borderRadius: '1rem', border: '1px solid rgba(214, 180, 124, 0.2)', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
            <div style={{ padding: '2rem', borderBottom: '1px solid rgba(214, 180, 124, 0.1)' }}>
              <h3 style={{ color: 'var(--primary)', margin: 0 }}>{editingItem?.id ? 'แก้ไขบทความ' : 'สร้างบทความใหม่'}</h3>
            </div>
            <form onSubmit={handleSaveBlog} style={{ padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>หัวข้อบทความ (Title)</label>
                <input type="text" value={editingItem?.title || ''} onChange={e => setEditingItem({ ...editingItem, title: e.target.value })} style={{ width: '100%', padding: '1rem', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(214, 180, 124, 0.2)', borderRadius: '0.5rem', color: 'var(--text-main)' }} required />
              </div>
              <div>
                <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>URL Slug (เช่น how-to-love-yourself)</label>
                <input type="text" value={editingItem?.slug || ''} onChange={e => setEditingItem({ ...editingItem, slug: e.target.value })} style={{ width: '100%', padding: '1rem', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(214, 180, 124, 0.2)', borderRadius: '0.5rem', color: 'var(--text-main)' }} required />
              </div>
              <div>
                <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>เนื้อหาบทความ (รองรับ HTML)</label>
                <textarea rows={10} value={editingItem?.content || ''} onChange={e => setEditingItem({ ...editingItem, content: e.target.value })} style={{ width: '100%', padding: '1rem', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(214, 180, 124, 0.2)', borderRadius: '0.5rem', color: 'var(--text-main)', resize: 'vertical' }} required></textarea>
              </div>
              <div>
                <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>ลิงก์รูปภาพหน้าปก (Cover Image URL)</label>
                <input type="text" value={editingItem?.imageUrl || ''} onChange={e => setEditingItem({ ...editingItem, imageUrl: e.target.value })} style={{ width: '100%', padding: '1rem', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(214, 180, 124, 0.2)', borderRadius: '0.5rem', color: 'var(--text-main)' }} />
              </div>
              <div>
                <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>สถานะ (Status)</label>
                <select value={editingItem?.status || 'published'} onChange={e => setEditingItem({ ...editingItem, status: e.target.value })} style={{ width: '100%', padding: '1rem', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(214, 180, 124, 0.2)', borderRadius: '0.5rem', color: 'var(--text-main)' }}>
                  <option value="published">เผยแพร่ (Published)</option>
                  <option value="draft">ร่าง (Draft)</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsBlogModalOpen(false)} className="cozy-button">ยกเลิก</button>
                <button type="submit" className="cozy-button filled">บันทึก</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
