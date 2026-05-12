"use client";

import React, { useState, useEffect } from 'react';

interface CardPickerProps {
  maxCards: number;
  onComplete: (selectedIndices: number[]) => void;
  title?: string;
  subtitle?: string;
}

export default function CardPicker({ maxCards, onComplete, title, subtitle }: CardPickerProps) {
  const [selected, setSelected] = useState<(number | null)[]>(Array(maxCards).fill(null));
  const [isShuffling, setIsShuffling] = useState(false);
  const [cardsOrder, setCardsOrder] = useState<number[]>(Array.from({ length: 67 }).map((_, i) => i));

  const shuffleArray = (array: number[]) => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  useEffect(() => {
    setCardsOrder(prev => shuffleArray(prev));
  }, []);

  const toggleCard = (index: number) => {
    if (isShuffling) return;
    
    const selectedIndex = selected.indexOf(index);
    if (selectedIndex !== -1) {
      const newSelected = [...selected];
      newSelected[selectedIndex] = null;
      setSelected(newSelected);
      onComplete(newSelected.filter(c => c !== null) as number[]);
    } else {
      const emptySlotIndex = selected.indexOf(null);
      if (emptySlotIndex !== -1) {
        const newSelected = [...selected];
        newSelected[emptySlotIndex] = index;
        setSelected(newSelected);
        onComplete(newSelected.filter(c => c !== null) as number[]);
      }
    }
  };

  const handleShuffle = () => {
    setIsShuffling(true);
    setSelected(Array(maxCards).fill(null));
    onComplete([]);
    
    setTimeout(() => {
      setCardsOrder(prev => shuffleArray(prev));
      setIsShuffling(false);
    }, 1200);
  };

  return (
    <div style={{ backgroundColor: 'rgba(26, 24, 22, 0.6)', border: '1px solid rgba(214, 180, 124, 0.2)', borderRadius: '1rem', padding: '2rem', backdropFilter: 'blur(10px)', marginBottom: '2rem' }}>
      <style>{`
        @keyframes mysticShuffleLeft {
          0% { transform: translate3d(0, 0, 0) rotate(0deg); opacity: 1; z-index: 1; }
          50% { transform: translate3d(-15px, -5px, 10px) rotate(-8deg) scale(0.9); opacity: 0.7; z-index: 10; }
          100% { transform: translate3d(0, 0, 0) rotate(0deg); opacity: 1; z-index: 1; }
        }
        @keyframes mysticShuffleRight {
          0% { transform: translate3d(0, 0, 0) rotate(0deg); opacity: 1; z-index: 1; }
          50% { transform: translate3d(15px, 5px, 10px) rotate(8deg) scale(0.9); opacity: 0.7; z-index: 10; }
          100% { transform: translate3d(0, 0, 0) rotate(0deg); opacity: 1; z-index: 1; }
        }
      `}</style>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        {title && <h3 style={{ color: 'var(--primary)', fontSize: '1.5rem', marginBottom: '0.5rem', letterSpacing: '0.02em' }}>{title}</h3>}
        {subtitle && <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>{subtitle}</p>}
      </div>
      
      {/* Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)', padding: '1rem 1.5rem', borderRadius: '1rem', border: '1px solid rgba(214, 180, 124, 0.1)', marginBottom: '2rem' }}>
        <span style={{ color: 'var(--text-main)', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: 'var(--primary)' }}>✦</span> เลื่อนไพ่จนกว่าจะเจอใบที่สะดุดตา
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ color: 'var(--primary)', fontSize: '1.2rem', fontWeight: 'bold' }}>
            {selected.filter(c => c !== null).length} <span style={{ color: 'var(--text-muted)', fontWeight: 'normal', fontSize: '1rem' }}>/ {maxCards}</span>
          </div>
          <button 
            onClick={handleShuffle} 
            disabled={isShuffling}
            className="cozy-button"
            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <span>✨</span> สับไพ่ใหม่
          </button>
        </div>
      </div>

      {/* Card Grid */}
      <div style={{ padding: '1.5rem', backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: '1rem', border: '1px solid rgba(214, 180, 124, 0.05)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(45px, 1fr))', gap: '0.5rem' }}>
          {cardsOrder.map((cardIndex, index) => {
            const selectedOrderIndex = selected.indexOf(cardIndex);
            const isSelected = selectedOrderIndex !== -1;
            const selectedOrder = selectedOrderIndex + 1;
            
            return (
              <button
                key={cardIndex}
                type="button"
                onClick={() => toggleCard(cardIndex)}
                disabled={!isSelected && selected.indexOf(null) === -1 || isShuffling}
                style={{ 
                  position: 'relative', 
                  aspectRatio: '2/3', 
                  borderRadius: '4px',
                  overflow: 'hidden',
                  cursor: isSelected || (!isSelected && selected.indexOf(null) !== -1) ? 'pointer' : 'not-allowed',
                  border: isSelected ? '2px solid var(--primary)' : '1px solid rgba(214, 180, 124, 0.3)',
                  transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  transitionDelay: isShuffling ? '0s' : `${index * 0.015}s`,
                  animation: isShuffling 
                    ? (index % 2 === 0 ? 'mysticShuffleLeft 0.6s infinite ease-in-out' : 'mysticShuffleRight 0.6s infinite ease-in-out') 
                    : 'none',
                  opacity: isShuffling ? 0.8 : (isSelected ? 0.7 : 1),
                  transform: isShuffling ? 'none' : (isSelected ? 'scale(0.95) translateY(-5px)' : 'scale(1)'),
                  boxShadow: isSelected ? '0 0 15px rgba(214, 180, 124, 0.4)' : 'none',
                  background: 'transparent',
                  padding: 0
                }}
              >
                <img src="/images/card-back.png" alt="Card Back" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {isSelected && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(26, 24, 22, 0.6)', backdropFilter: 'blur(2px)' }}>
                    <span style={{ color: 'var(--primary)', fontSize: '1.5rem', fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{selectedOrder}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Selected Cards Display Area */}
      <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(214, 180, 124, 0.2)', textAlign: 'center' }}>
        <h4 style={{ color: 'var(--text-main)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>ไพ่ที่คุณเลือก</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
          {selected.map((cardIndex, i) => {
            const hasCard = cardIndex !== null;
            return (
              <div 
                key={i} 
                style={{ 
                  width: '60px', 
                  aspectRatio: '2/3', 
                  borderRadius: '8px', 
                  border: hasCard ? '2px solid var(--primary)' : '1px dashed rgba(214, 180, 124, 0.3)',
                  backgroundColor: hasCard ? 'transparent' : 'rgba(0,0,0,0.2)',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: hasCard ? '0 4px 10px rgba(214, 180, 124, 0.2)' : 'none',
                  transition: 'all 0.3s'
                }}
              >
                {hasCard ? (
                  <>
                    <img src="/images/card-back.png" alt="Selected Card" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(26, 24, 22, 0.4)' }}>
                      <span style={{ color: 'var(--primary)', fontSize: '1.2rem', fontWeight: 'bold', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>{i + 1}</span>
                    </div>
                  </>
                ) : (
                  <span style={{ color: 'rgba(214, 180, 124, 0.3)', fontSize: '1.2rem' }}>{i + 1}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
