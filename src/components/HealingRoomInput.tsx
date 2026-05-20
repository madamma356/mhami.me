"use client";

import React, { useState, useEffect } from 'react';

export default function HealingRoomInput({ initialMessages = [] }: { initialMessages?: { id: string, content: string, isUser?: boolean }[] }) {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<{ id: string, content: string, isUser?: boolean }[]>(initialMessages);
  const [animating, setAnimating] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/venting');
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setMessages(data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch venting messages', error);
    }
  };

  useEffect(() => {
    setIsClient(true);
    fetchMessages();
    const interval = setInterval(fetchMessages, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleRelease = async () => {
    if (!text.trim()) return;
    
    setAnimating(true);
    
    try {
      const res = await fetch('/api/venting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text })
      });
      
      if (res.ok) {
        const newMessage = await res.json();
        // Optimistically add to UI, mark as user message so it glows more
        setMessages(prev => [{ ...newMessage, isUser: true }, ...prev]);
        setText('');
      }
    } catch (error) {
      console.error('Failed to post venting message', error);
    } finally {
      setAnimating(false);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Floating Stars Display */}
      <div style={{ minHeight: '150px', marginBottom: '2rem', position: 'relative' }}>
        {isClient && messages.map((msg, idx) => {
          // Deterministic pseudo-random for initial SSR match, then stable on client
          const topPos = ((idx * 37) % 80);
          const leftPos = ((idx * 43) % 80);
          return (
            <div 
              key={msg.id}
              style={{
                position: 'absolute',
                top: `${topPos}%`,
                left: `${leftPos}%`,
                color: msg.isUser ? '#ffffff' : 'var(--primary)',
                opacity: msg.isUser ? 1 : 0.6,
                fontSize: msg.isUser ? '1rem' : '0.8rem',
                fontWeight: msg.isUser ? 500 : 300,
                animation: msg.isUser ? 'float-user 6s infinite ease-in-out' : 'float 6s infinite ease-in-out',
                animationDelay: `${(idx * 1.5) % 4}s`,
                textShadow: msg.isUser ? '0 0 15px rgba(255, 255, 255, 0.8)' : '0 0 8px rgba(214, 180, 124, 0.8)',
                zIndex: msg.isUser ? 10 : 1
              }}
            >
              {msg.isUser ? '✨' : '✦'} {msg.content.substring(0, msg.isUser ? 50 : 20)}{msg.content.length > (msg.isUser ? 50 : 20) ? '...' : ''}
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <p style={{ color: 'var(--text-main)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>พื้นที่สำหรับแบ่งปันความคิด ความกลัว และความหวัง...</p>
      </div>
      
      <div style={{ 
        position: 'relative', 
        transition: 'all 1s ease', 
        transform: animating ? 'translateY(-50px) scale(0.5)' : 'none', 
        opacity: animating ? 0 : 1,
        border: '1px solid var(--primary)',
        borderRadius: '1rem',
        padding: '1.5rem',
        boxShadow: '0 0 30px rgba(214, 180, 124, 0.1), inset 0 0 20px rgba(214, 180, 124, 0.05)',
        backgroundColor: 'rgba(26, 24, 22, 0.4)'
      }}>
        <textarea 
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="เขียนระบายจากหัวใจ..."
          style={{ 
            width: '100%', 
            minHeight: '120px', 
            backgroundColor: 'transparent', 
            border: 'none',
            color: 'var(--text-main)', 
            outline: 'none', 
            resize: 'none', 
            marginBottom: '1.5rem', 
            fontFamily: 'inherit',
            fontSize: '1.1rem',
            fontStyle: 'italic'
          }}
        />
        <div style={{ textAlign: 'center' }}>
          <button 
            onClick={handleRelease}
            className="cozy-button"
            disabled={animating}
            style={{ borderRadius: '2rem', padding: '0.5rem 2rem', textTransform: 'none', letterSpacing: 'normal' }}
          >
            {animating ? 'กำลังล่องลอย...' : 'ปลดปล่อยความรู้สึก'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) translateX(0px); opacity: 0.5; }
          50% { transform: translateY(-10px) translateX(10px); opacity: 0.9; }
          100% { transform: translateY(0px) translateX(0px); opacity: 0.5; }
        }
        @keyframes float-user {
          0% { transform: translateY(0px) translateX(0px); opacity: 0.9; }
          50% { transform: translateY(-15px) translateX(5px); opacity: 1; }
          100% { transform: translateY(0px) translateX(0px); opacity: 0.9; }
        }
      `}</style>
    </div>
  );
}
