'use client';

import { useState, useRef } from 'react';

type FAQItem = { q: string; a: string };

export default function AccordionFAQ({ items }: { items: FAQItem[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => (
        <AccordionItem
          key={i}
          item={item}
          isOpen={openIdx === i}
          onToggle={() => setOpenIdx(openIdx === i ? null : i)}
          index={i}
        />
      ))}
    </div>
  );
}

function AccordionItem({
  item,
  isOpen,
  onToggle,
  index,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div
      style={{
        background: '#FFFFFF',
        border: `1.5px solid ${isOpen ? '#1A6B35' : '#E5E5E5'}`,
        transition: 'border-color 0.25s ease',
        overflow: 'hidden',
      }}
      className={`fade-in-up fade-in-up-${Math.min(index + 1, 4)}`}
    >
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          cursor: 'pointer',
          background: 'transparent',
          border: 'none',
          textAlign: 'left',
          gap: 16,
        }}
        aria-expanded={isOpen}
      >
        <span style={{
          fontWeight: 700,
          fontSize: '0.95rem',
          color: isOpen ? '#1A6B35' : '#1A1A1A',
          letterSpacing: '0.02em',
          lineHeight: 1.5,
          transition: 'color 0.2s',
          flex: 1,
        }}>
          Q{index + 1}. {item.q}
        </span>
        {/* 加減號圖示 */}
        <span style={{
          flexShrink: 0,
          width: 28, height: 28,
          borderRadius: '50%',
          background: isOpen ? '#1A6B35' : '#F5F5F5',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.25s, transform 0.25s',
          transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
          color: isOpen ? '#FFFFFF' : '#767676',
          fontWeight: 300, fontSize: '1.4rem', lineHeight: 1,
        }}>
          +
        </span>
      </button>

      {/* 展開內容（高度動畫） */}
      <div
        ref={contentRef}
        style={{
          maxHeight: isOpen ? (contentRef.current?.scrollHeight ?? 500) + 'px' : '0px',
          overflow: 'hidden',
          transition: 'max-height 0.35s ease',
        }}
      >
        <p style={{
          color: '#555555',
          fontSize: '0.875rem',
          lineHeight: 1.9,
          padding: '0 24px 22px',
          borderTop: '1px solid #F0F0F0',
          paddingTop: 16,
        }}>
          {item.a}
        </p>
      </div>
    </div>
  );
}
