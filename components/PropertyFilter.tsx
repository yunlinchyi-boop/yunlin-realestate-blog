'use client';

import { useState } from 'react';
import type { Property } from '@/lib/properties';

const FALLBACK_IMGS = [
  '/images/prop_01.jpg', '/images/prop_02.jpg', '/images/prop_03.jpg',
  '/images/prop_04.jpg', '/images/prop_05.jpg', '/images/prop_06.jpg',
  '/images/prop_07.jpg', '/images/prop_08.jpg',
];

export default function PropertyFilter({
  properties,
  types,
}: {
  properties: Property[];
  types: string[];
}) {
  const [activeType, setActiveType] = useState('全部');

  const filtered = (
    activeType === '全部' ? properties : properties.filter((p) => p.type === activeType)
  );

  return (
    <>
      {/* 類型篩選 */}
      <div className="flex gap-2 flex-wrap mb-8">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            style={{
              padding: '7px 18px',
              fontSize: '0.82rem',
              fontWeight: 600,
              border: activeType === type ? '2px solid #1A6B35' : '2px solid #E5E5E5',
              background: activeType === type ? '#1A6B35' : '#FFFFFF',
              color: activeType === type ? '#FFFFFF' : '#767676',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {type}
          </button>
        ))}
      </div>

      {/* 物件卡片 */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p, i) => (
          <a
            key={i}
            href={p.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'block', textDecoration: 'none' }}
          >
            <div style={{
              background: '#FFFFFF',
              border: '1px solid #E5E5E5',
              overflow: 'hidden',
              transition: 'box-shadow 0.25s ease, transform 0.25s ease',
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.12)';
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
              }}
            >
              {/* 照片 */}
              <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', overflow: 'hidden', background: '#F0F0F0' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.img || FALLBACK_IMGS[i % FALLBACK_IMGS.length]}
                  alt={p.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  onError={e => { (e.target as HTMLImageElement).src = FALLBACK_IMGS[i % FALLBACK_IMGS.length]; }}
                />
                {/* 物件類型標籤 */}
                {p.type && (
                  <span style={{
                    position: 'absolute', top: 12, left: 12,
                    background: '#1A6B35', color: '#FFFFFF',
                    fontSize: '0.72rem', fontWeight: 700,
                    padding: '4px 10px', letterSpacing: '0.05em',
                  }}>
                    {p.type}
                  </span>
                )}
              </div>

              {/* 資訊 */}
              <div style={{ padding: '18px 20px 20px' }}>
                <h3 style={{
                  color: '#1A1A1A', fontWeight: 700, fontSize: '1.05rem',
                  marginBottom: 10, lineHeight: 1.4,
                  overflow: 'hidden', display: '-webkit-box',
                  WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                }}>
                  {p.title}
                </h3>

                {/* 地址＋坪數 */}
                <div style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
                  {p.addr && (
                    <span style={{ color: '#767676', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9 13.38 11.5 12 11.5z"/>
                      </svg>
                      {p.addr}
                    </span>
                  )}
                  {p.build_ping && (
                    <span style={{ color: '#767676', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
                        <path d="M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 0h8v8h-8z"/>
                      </svg>
                      {p.build_ping}
                    </span>
                  )}
                </div>

                {/* 格局 */}
                {p.layout && (
                  <p style={{ color: '#555', fontSize: '0.82rem', marginBottom: 12 }}>
                    {p.layout}
                  </p>
                )}

                {/* 價格 */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <span style={{ color: '#CC1122', fontWeight: 800, fontSize: '1.4rem', lineHeight: 1 }}>
                    {p.price}
                  </span>
                  {p.unit_price && (
                    <span style={{ color: '#AAAAAA', fontSize: '0.75rem' }}>{p.unit_price}</span>
                  )}
                </div>

                {/* 立即詢問按鈕 */}
                <div style={{
                  background: '#1A6B35', color: '#FFFFFF',
                  textAlign: 'center', padding: '10px',
                  fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.05em',
                }}>
                  立即詢問
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      {filtered.length === 0 && (
        <p style={{ color: '#AAAAAA', textAlign: 'center', padding: '60px 0', fontSize: '0.9rem' }}>
          此類型物件資料整理中...
        </p>
      )}
    </>
  );
}
