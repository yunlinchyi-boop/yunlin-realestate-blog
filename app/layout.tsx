import type { Metadata } from 'next';
import { Noto_Sans_TC, Playfair_Display } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Link from 'next/link';

const notoSansTC = Noto_Sans_TC({
  variable: '--font-noto-sans-tc',
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: '雲林房地產專家｜群義房屋',
    template: '%s｜群義房屋',
  },
  description: '群義房屋雲林雲科加盟店，提供雲林斗六透天、土地、農地、廠房等房地產專業服務。',
  keywords: ['雲林房地產', '斗六買房', '雲林透天', '雲林土地', '群義房屋'],
  openGraph: {
    siteName: '雲林房地產專家｜群義房屋',
    locale: 'zh_TW',
    type: 'website',
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION ?? '',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="zh-TW" className={`${notoSansTC.variable} ${playfair.variable}`}>
      <head>
        {gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="gtag-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}</Script>
          </>
        )}
      </head>
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
              <span className="text-xs tracking-[0.3em] uppercase" style={{
                color: '#C9A84C',
                fontFamily: 'var(--font-playfair)',
                fontStyle: 'italic'
              }}>
                Chyi Real Estate
              </span>
              <span className="text-sm font-medium tracking-wider" style={{ color: '#F5F0E8' }}>
                群義房屋・雲科店
              </span>
            </Link>

            {/* 導覽連結 */}
            <nav className="hidden md:flex items-center gap-8">
              {[
                { href: '/blog', label: '房市專欄' },
                { href: '/about', label: '關於我們' },
              ].map(({ href, label }) => (
                <Link key={href} href={href}
                  className="text-xs tracking-[0.2em] uppercase transition-colors duration-200"
                  style={{ color: '#7A7A7A' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#F5F0E8')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#7A7A7A')}>
                  {label}
                </Link>
              ))}
              <a href="tel:055362808"
                className="text-xs tracking-[0.2em] uppercase px-5 py-2 border transition-all duration-200"
                style={{ borderColor: '#C9A84C', color: '#C9A84C', background: 'transparent' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#C9A84C'; (e.currentTarget as HTMLElement).style.color = '#0C0C0C'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#C9A84C'; }}>
                立即諮詢
              </a>
            </nav>

            {/* 手機版 */}
            <a href="tel:055362808" className="md:hidden text-xs tracking-widest px-4 py-1.5 border"
              style={{ borderColor: '#C9A84C', color: '#C9A84C' }}>
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
              <p className="text-xs tracking-[0.3em] uppercase mb-1" style={{
                color: '#C9A84C', fontFamily: 'var(--font-playfair)', fontStyle: 'italic'
              }}>
                Chyi Real Estate
              </p>
              <p className="text-base font-medium mb-3" style={{ color: '#F5F0E8' }}>群義房屋｜雲林雲科加盟店</p>
              <div style={{ width: 36, height: 1, background: '#C9A84C', margin: '10px 0 16px' }} />
              <p className="text-xs leading-relaxed" style={{ color: '#7A7A7A' }}>
                紅火房屋仲介有限公司<br />
                經紀人證號：113雲縣字第00302號
              </p>
            </div>

            {/* 快速連結 */}
            <div>
              <p className="text-xs tracking-[0.25em] uppercase mb-4" style={{ color: '#7A7A7A' }}>探索</p>
              <div className="flex flex-col gap-2.5">
                {[{ href: '/blog', label: '房市專欄' }, { href: '/about', label: '關於我們' }].map(({ href, label }) => (
                  <Link key={href} href={href} className="text-sm transition-colors duration-200"
                    style={{ color: '#7A7A7A' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#C9A84C')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#7A7A7A')}>
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* 聯絡 */}
            <div>
              <p className="text-xs tracking-[0.25em] uppercase mb-4" style={{ color: '#7A7A7A' }}>聯絡</p>
              <div className="flex flex-col gap-2 text-sm" style={{ color: '#7A7A7A' }}>
                <p>📞 05-5362808</p>
                <p>📍 雲林縣斗六市中正路312號</p>
              </div>
            </div>
          </div>

          <div className="text-center py-5 text-xs" style={{ borderTop: '1px solid #2E2E2E', color: '#3A3A3A' }}>
            © {new Date().getFullYear()} 群義房屋 版權所有
          </div>
        </footer>
      </body>
    </html>
  );
}
