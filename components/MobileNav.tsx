'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/blog', label: '房市專欄' },
  { href: '/about', label: '關於我們' },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // 換頁時關閉選單
  useEffect(() => { setOpen(false); }, [pathname]);

  // 開啟時鎖定背景捲動
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {/* 漢堡按鈕 */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? '關閉選單' : '開啟選單'}
        className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5"
        style={{ color: '#FFFFFF' }}
      >
        <span style={{
          display: 'block', width: 22, height: 2, background: '#FFFFFF',
          transition: 'transform 0.25s, opacity 0.25s',
          transform: open ? 'translateY(6px) rotate(45deg)' : 'none',
        }} />
        <span style={{
          display: 'block', width: 22, height: 2, background: '#FFFFFF',
          transition: 'opacity 0.2s',
          opacity: open ? 0 : 1,
        }} />
        <span style={{
          display: 'block', width: 22, height: 2, background: '#FFFFFF',
          transition: 'transform 0.25s, opacity 0.25s',
          transform: open ? 'translateY(-6px) rotate(-45deg)' : 'none',
        }} />
      </button>

      {/* 背景遮罩 */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 40,
            background: 'rgba(0,0,0,0.4)',
            animation: 'fadeIn 0.2s ease',
          }}
        />
      )}

      {/* 下拉選單 */}
      <nav
        style={{
          position: 'fixed',
          top: 84, // 頂部4px色條 + 導覽列80px
          left: 0, right: 0,
          zIndex: 50,
          background: '#2E8B52',
          borderTop: '1px solid rgba(255,255,255,0.15)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
          transform: open ? 'translateY(0)' : 'translateY(-8px)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'transform 0.25s ease, opacity 0.2s ease',
        }}
      >
        <div style={{ padding: '8px 0 16px' }}>
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              style={{
                display: 'block',
                padding: '16px 24px',
                color: '#FFFFFF',
                fontSize: '0.95rem',
                fontWeight: 600,
                letterSpacing: '0.05em',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              {label}
            </Link>
          ))}
          <div style={{ padding: '16px 24px' }}>
            <a
              href="tel:055362808"
              style={{
                display: 'block',
                background: '#CC1122',
                color: '#FFFFFF',
                textAlign: 'center',
                padding: '14px',
                fontWeight: 700,
                fontSize: '1rem',
                letterSpacing: '0.05em',
              }}
            >
              📞 立即致電 05-5362808
            </a>
          </div>
        </div>
      </nav>

      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
    </>
  );
}
