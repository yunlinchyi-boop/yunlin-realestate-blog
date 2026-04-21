import type { Metadata } from 'next';
import { Playfair_Display, Noto_Sans_TC } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import Image from 'next/image';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans-tc',
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yunlin-realestate-blog.vercel.app';

export const metadata: Metadata = {
  title: '群義房屋｜雲林雲科加盟店 — 雲林房地產專家',
  description: '雲林斗六在地房仲，專營透天、土地、農地、廠房。每日提供雲林房市最新資訊，協助您找到理想物件。',
  keywords: ['雲林房屋', '斗六房仲', '雲林土地', '雲林透天', '群義房屋'],
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: '群義房屋｜雲林雲科加盟店',
  },
  alternates: {
    types: {
      'application/rss+xml': `${SITE_URL}/feed`,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW" className={`${playfair.variable} ${notoSansTC.variable}`}>
      <body className="min-h-full flex flex-col" style={{ background: '#FFFFFF', color: '#1A1A1A' }}>

        {/* ── 頂部綠色細條 ── */}
        <div style={{ height: 4, background: '#2AA02A' }} />

        {/* ── 導覽列 ── */}
        <header className="sticky top-0 z-50" style={{
          background: '#3CB83C',
          backdropFilter: 'blur(8px)',
        }}>
          <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">

            {/* Logo 圖片 */}
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo-chyi.png"
                alt="群義房屋"
                width={200}
                height={68}
                style={{ objectFit: 'contain', height: 58, width: 'auto' }}
                priority
              />
            </Link>

            {/* 導覽連結 */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/blog" className="nav-link-white">房市專欄</Link>
              <Link href="/about" className="nav-link-white">關於我們</Link>
              <a href="tel:055362808" className="btn-consult-red">立即諮詢</a>
            </nav>

            {/* 手機版 */}
            <a href="tel:055362808" className="md:hidden btn-consult-red" style={{ padding: '6px 14px' }}>
              諮詢
            </a>
          </div>
        </header>

        <div className="flex-1">{children}</div>

        {/* ── 浮動聯絡按鈕 ── */}
        <style>{`
          @keyframes pulse-ring {
            0% { transform: scale(1); opacity: 0.6; }
            70% { transform: scale(1.55); opacity: 0; }
            100% { transform: scale(1.55); opacity: 0; }
          }
          .float-btn-pulse::before {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: 50%;
            background: #CC1122;
            animation: pulse-ring 2s ease-out infinite;
            z-index: -1;
          }
        `}</style>
        <a href="tel:055362808"
          className="float-btn-pulse"
          aria-label="立即致電"
          style={{
            position: 'fixed',
            bottom: 28,
            right: 24,
            zIndex: 999,
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: '#CC1122',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(204,17,34,0.45)',
            color: '#FFFFFF',
          }}>
          {/* 電話 SVG */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
          </svg>
        </a>

        {/* ── 頁尾 ── */}
        <footer style={{ background: '#0F4D24', color: '#FFFFFF' }}>

          {/* 為何選擇我們 + CTA */}
          <div style={{ padding: '72px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="max-w-6xl mx-auto">
              <div className="text-center" style={{ marginBottom: 48 }}>
                <p style={{ color: '#CC1122', fontSize: '0.65rem', letterSpacing: '0.35em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 12 }}>
                  Why Choose Us
                </p>
                <h2 style={{ color: '#FFFFFF', fontFamily: 'var(--font-playfair)', fontSize: '1.8rem', fontWeight: 700, marginBottom: 10 }}>
                  為何選擇群義房屋
                </h2>
                <div style={{ width: 40, height: 3, background: '#CC1122', margin: '0 auto' }} />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: '雲林在地，深耕多年', desc: '紮根雲林斗六超過 10 年，熟悉在地市場與每個社區的特性，給您最精準的置產建議。' },
                  { title: '透明議價，保障權益', desc: '全程透明報價，不隱藏費用，從委託到成交每一步都讓您清楚掌握。' },
                  { title: '物件多元，全縣服務', desc: '透天、農地、土地、廠房一手掌握，服務範圍涵蓋雲林全縣。' },
                  { title: '售後陪伴，完整服務', desc: '成交不是終點，代書、貸款、過戶全程協助，讓置產零壓力。' },
                ].map((item, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', padding: '28px 32px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                      <div style={{ width: 4, height: 40, background: '#CC1122', flexShrink: 0, marginTop: 2 }} />
                      <div>
                        <p style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '1rem', marginBottom: 8 }}>{item.title}</p>
                        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', lineHeight: 1.8 }}>{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ width: 1, height: 48, background: 'rgba(255,255,255,0.15)', margin: '64px auto 0' }} />
              <div className="text-center" style={{ marginTop: 48 }}>
                <p style={{ color: '#CC1122', fontSize: '0.65rem', letterSpacing: '0.35em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 12 }}>Contact Us</p>
                <h2 style={{ color: '#FFFFFF', fontFamily: 'var(--font-playfair)', fontSize: '1.8rem', fontWeight: 700, marginBottom: 10 }}>開始您的置產旅程</h2>
                <div style={{ width: 40, height: 3, background: '#CC1122', margin: '0 auto 20px' }} />
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: 36 }}>專業顧問一對一服務，雲林斗六在地深耕</p>
                <a href="tel:055362808" className="btn-cta-phone" style={{ background: '#CC1122' }}>立即致電　05-5362808</a>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-10">

            {/* 品牌 */}
            <div>
              <p style={{
                fontFamily: 'var(--font-playfair)', fontWeight: 700,
                fontSize: '1.15rem', letterSpacing: '0.05em', color: '#FFFFFF', marginBottom: 4
              }}>
                群義房屋雲林雲科加盟店
              </p>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>
                Chyi Real Estate · Yunlin
              </p>
              <div style={{ width: 36, height: 3, background: '#CC1122', marginBottom: 16 }} />
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.75rem', lineHeight: 1.8 }}>
                紅火房屋仲介有限公司<br />
                經紀人證號：113雲縣字第00302號
              </p>
            </div>

            {/* 快速連結 */}
            <div>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 16 }}>
                探索
              </p>
              <div className="flex flex-col gap-3">
                <Link href="/blog" className="footer-link">房市專欄</Link>
                <Link href="/about" className="footer-link">關於我們</Link>
              </div>
            </div>

            {/* 聯絡 */}
            <div>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 16 }}>
                聯絡我們
              </p>
              <div className="flex flex-col gap-2" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>
                <p>📞 05-5362808</p>
                <p>📍 雲林縣斗六市中正路312號</p>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }} className="text-center py-5">
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem' }}>
              © {new Date().getFullYear()} 群義房屋雲林雲科加盟店 版權所有
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
