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
      <body className="min-h-full flex flex-col antialiased" style={{ background: '#0C0C0C', color: '#F5F0E8' }}>

        {/* ── 頂部導覽列 ── */}
        <header className="sticky top-0 z-50" style={{
          background: 'rgba(12,12,12,0.96)',
          borderBottom: '1px solid #2E2E2E',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)'
        }}>
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

            {/* Logo */}
            <Link href="/" className="flex flex-col leading-none">
              <span style={{
                color: '#C9A84C',
                fontFamily: 'var(--font-playfair)',
                fontStyle: 'italic',
                fontSize: '0.7rem',
                letterSpacing: '0.3em',
                textTransform: 'uppercase'
              }}>
                Chyi Real Estate
              </span>
              <span style={{ color: '#F5F0E8', fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.15em' }}>
                群義房屋・雲科店
              </span>
            </Link>

            {/* 導覽連結 */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/blog" className="nav-link">房市專欄</Link>
              <Link href="/about" className="nav-link">關於我們</Link>
              <a href="tel:055362808" className="btn-consult">立即諮詢</a>
            </nav>

            {/* 手機版 */}
            <a href="tel:055362808" className="md:hidden btn-consult" style={{ padding: '6px 16px' }}>
              諮詢
            </a>
          </div>
        </header>

        <div className="flex-1">{children}</div>

        {/* ── 頁尾 ── */}
        <footer style={{ background: '#161616', borderTop: '1px solid #2E2E2E' }}>
          <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-10">

            {/* 品牌 */}
            <div>
              <p style={{
                color: '#C9A84C', fontFamily: 'var(--font-playfair)', fontStyle: 'italic',
                fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 6
              }}>
                Chyi Real Estate
              </p>
              <p style={{ color: '#F5F0E8', fontSize: '1rem', fontWeight: 500, marginBottom: 12 }}>
                群義房屋｜雲林雲科加盟店
              </p>
              <div style={{ width: 36, height: 1, background: '#C9A84C', marginBottom: 16 }} />
              <p style={{ color: '#7A7A7A', fontSize: '0.75rem', lineHeight: 1.7 }}>
                紅火房屋仲介有限公司<br />
                經紀人證號：113雲縣字第00302號
              </p>
            </div>

            {/* 快速連結 */}
            <div>
              <p style={{ color: '#7A7A7A', fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 16 }}>
                探索
              </p>
              <div className="flex flex-col gap-3">
                <Link href="/blog" className="footer-link">房市專欄</Link>
                <Link href="/about" className="footer-link">關於我們</Link>
              </div>
            </div>

            {/* 聯絡 */}
            <div>
              <p style={{ color: '#7A7A7A', fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 16 }}>
                聯絡
              </p>
              <div className="flex flex-col gap-2" style={{ color: '#7A7A7A', fontSize: '0.875rem' }}>
                <p>📞 05-5362808</p>
                <p>📍 雲林縣斗六市中正路312號</p>
              </div>
            </div>
          </div>

          <div className="text-center py-5" style={{ borderTop: '1px solid #2E2E2E', color: '#3A3A3A', fontSize: '0.75rem' }}>
            © {new Date().getFullYear()} 群義房屋 版權所有
          </div>
        </footer>
      </body>
    </html>
  );
}
