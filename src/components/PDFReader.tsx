"use client";

import { useState } from 'react';

interface PDFReaderProps {
  url: string;
}

export default function PDFReader({ url }: PDFReaderProps) {
  // Since we use native iframe, we don't know the exact number of pages easily without a library.
  // But for a mock/prototype, we can assume a fixed number or just let them flip a few pages.
  const [pageNumber, setPageNumber] = useState<number>(1);
  const maxPages = 5; // Mock max pages

  function previousPage() {
    if (pageNumber > 1) setPageNumber(pageNumber - 1);
  }

  function nextPage() {
    if (pageNumber < maxPages) setPageNumber(pageNumber + 1);
  }

  return (
    <div className="pdf-reader-container" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.3)',
      borderRadius: '1rem',
      padding: '1rem',
      position: 'relative'
    }}>
      
      <div style={{ 
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)', 
        borderRadius: '8px', 
        overflow: 'hidden',
        backgroundColor: '#fff',
        width: '100%',
        maxWidth: '600px',
        height: '800px',
        position: 'relative'
      }}>
        {/* Native Iframe PDF Viewer with UI hidden */}
        <iframe 
          src={`${url}#page=${pageNumber}&toolbar=0&navpanes=0&scrollbar=0&view=FitH`} 
          style={{ width: '100%', height: '100%', border: 'none', display: 'block' }} 
          title="Blueprint PDF"
        />
        
        {/* Overlay to prevent scrolling inside the iframe (forces them to use our buttons) */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10, cursor: 'default' }}></div>
      </div>

      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1.5rem', 
        marginTop: '1.5rem',
        backgroundColor: 'rgba(214, 180, 124, 0.1)',
        padding: '0.5rem 1.5rem',
        borderRadius: '2rem',
        border: '1px solid rgba(214, 180, 124, 0.3)',
        zIndex: 20
      }}>
        <button 
          type="button" 
          disabled={pageNumber <= 1} 
          onClick={previousPage}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: pageNumber <= 1 ? 'rgba(214, 180, 124, 0.3)' : 'var(--primary)', 
            cursor: pageNumber <= 1 ? 'not-allowed' : 'pointer',
            fontSize: '1.2rem',
            padding: '0.5rem'
          }}
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        
        <p style={{ color: 'var(--text-main)', margin: 0, fontSize: '0.9rem', letterSpacing: '1px' }}>
          หน้า {pageNumber} <span style={{ color: 'var(--text-muted)' }}>/ {maxPages}</span>
        </p>

        <button 
          type="button" 
          disabled={pageNumber >= maxPages} 
          onClick={nextPage}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: pageNumber >= maxPages ? 'rgba(214, 180, 124, 0.3)' : 'var(--primary)', 
            cursor: pageNumber >= maxPages ? 'not-allowed' : 'pointer',
            fontSize: '1.2rem',
            padding: '0.5rem'
          }}
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );
}
