'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import StatCounter from './StatCounter';

const stats = [
  { num: '10', label: '年在地深耕', plus: true },
  { num: '42', label: '筆精選物件', plus: false },
  { num: '免費', label: '帶看・不推銷', plus: false },
];

export default function HeroContent() {
  return (
    <>
      {/* 主文字區 */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6"
        style={{ flex: 1, paddingTop: 80, paddingBottom: 40 }}>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-block mb-5 px-4 py-1.5 text-xs font-bold tracking-widest uppercase"
          style={{ background: '#CC1122', color: '#FFFFFF', letterSpacing: '0.25em' }}
        >
          雲林 · 斗六在地房仲
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontSize: 'clamp(2.2rem, 6vw, 4rem)',
            fontFamily: 'var(--font-playfair)',
            color: '#FFFFFF', fontWeight: 700,
            lineHeight: 1.15, letterSpacing: '0.05em', marginBottom: 16
          }}
        >
          群義房屋<br />雲林雲科加盟店
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 32 }}
        >
          Chyi Real Estate · Yunlin
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.95rem', marginBottom: 40, letterSpacing: '0.08em' }}
        >
          透天・土地・農地・廠房｜免費諮詢・不推銷
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex gap-4 flex-wrap justify-center"
        >
          <a href="tel:055362808" className="btn-red" style={{ fontSize: '0.9rem', padding: '13px 36px' }}>立即致電 05-5362808</a>
          <Link href="/blog" className="btn-navy-outline" style={{ borderColor: 'rgba(255,255,255,0.5)', color: '#FFFFFF' }}>房市專欄</Link>
        </motion.div>

        {/* 向下滾動提示 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          style={{ marginTop: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
        >
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase' }}>Scroll</p>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2"
            style={{ animation: 'bounce 1.8s ease-in-out infinite' }}>
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </motion.div>
      </div>

      {/* 底部三欄數據條 */}
      <div className="relative z-10" style={{ background: 'rgba(0,0,0,0.45)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="max-w-6xl mx-auto grid grid-cols-3">
          {stats.map((s, i) => (
            <div key={i} style={{ borderRight: i < 2 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
              <StatCounter
                value={s.plus ? `${s.num}+` : s.num}
                label={s.label}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
