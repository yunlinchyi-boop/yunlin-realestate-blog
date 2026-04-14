import type { Metadata } from 'next';
import { Playfair_Display, Noto_Sans_TC } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

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

export const metadata: Metadata = {
  title: '群義房屋｜雲林雲科加盟店 — 雲林房地產專家',
  description: '雲林斗六在地房仲，專營透天、土地、農地、廠房。每日提供雲林房市最新資訊，協助您找到理想物件。',
  keywords: ['雲林房屋', '斗六房仲', '雲林土地', '雲林透天', '群義房屋'],
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: '群義房屋｜雲林雲科加盟店',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW" className={`${playfair.variable} ${notoSansTC.variable}`}>
      <body className="min-h-full flex flex-col" style={{ background: '#FFFFFF', color: '#1A1A1A' }}>

        {/* ── 頂部紅色細條 ── */}
        <div style={{ height: 4, background: '#CC1122' }} />

        {/* ── 導覽列 ── */}
        <header className="sticky top-0 z-50" style={{
          background: '#FFFFFF',
          borderBottom: '1px solid #E5E5E5',
          backdropFilter: 'blur(8px)',
        }}>
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

            {/* Logo */}
            <Link href="/" className="flex flex-col leading-none">
              <span style={{
                color: '#1B2A5E',
                fontFamily: 'var(--font-playfair)',
                fontWeight: 700,
                fontSize: '1.15rem',
                letterSpacing: '0.05em',
              }}>
                群義房屋
              </span>
              <span style={{ color: '#767676', fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
                Chyi Real Estate · Yunlin
              </span>
            </Link>

            {/* 導覽連結 */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/blog" className="nav-link">房市專欄</Link>
              <Link href="/about" className="nav-link">關於我們</Link>
              <a href="tel:055362808" className="btn-consult">立即諮詢</a>
            </nav>

            {/* 手機版 */}
            <a href="tel:055362808" className="md:hidden btn-consult" style={{ padding: '6px 14px' }}>
              諮詢
            </a>
          </div>
        </header>

        <div className="flex-1">{children}</div>

        {/* ── 頁尾 ── */}
        <footer style={{ background: '#1B2A5E', color: '#FFFFFF' }}>
          <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-10">

            {/* 品牌 */}
            <div>
              <p style={{
                fontFamily: 'var(--font-playfair)', fontWeight: 700,
                fontSize: '1.15rem', letterSpacing: '0.05em', color: '#FFFFFF', marginBottom: 4
              }}>
                群義房屋
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
              © {new Date().getFullYear()} 群義房屋 版權所有
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
