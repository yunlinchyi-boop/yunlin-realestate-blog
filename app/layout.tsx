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
      <body className="min-h-full flex flex-col antialiased" style={{ background: 'var(--luxury-black)', color: 'var(--luxury-cream)' }}>

        {/* ── 頂部導覽列 ── */}
        <header className="sticky top-0 z-50 border-b" style={{ background: 'rgba(12,12,12,0.95)', borderColor: 'var(--luxury-border)', backdropFilter: 'blur(12px)' }}>
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

            {/* Logo */}
            <Link href="/" className="flex flex-col leading-none group">
              <span className="text-xs tracking-[0.3em] uppercase" style={{ color: 'var(--luxury-gold)', fontFamily: 'var(--font-playfair)' }}>
                Chyi Real Estate
              </span>
              <span className="text-sm font-medium tracking-wider" style={{ color: 'var(--luxury-cream)' }}>
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
                  style={{ color: 'var(--luxury-muted)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--luxury-cream)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--luxury-muted)')}>
                  {label}
                </Link>
              ))}
              <a href="tel:055362808"
                className="text-xs tracking-[0.2em] uppercase px-5 py-2 border transition-all duration-200"
                style={{ borderColor: 'var(--luxury-gold)', color: 'var(--luxury-gold)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--luxury-gold)'; (e.currentTarget as HTMLElement).style.color = 'var(--luxury-black)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--luxury-gold)'; }}>
                立即諮詢
              </a>
            </nav>

            {/* 手機版 */}
            <a href="tel:055362808" className="md:hidden text-xs tracking-widest px-4 py-1.5 border"
              style={{ borderColor: 'var(--luxury-gold)', color: 'var(--luxury-gold)' }}>
              諮詢
            </a>
          </div>
        </header>

        <div className="flex-1">{children}</div>

        {/* ── 頁尾 ── */}
        <footer className="border-t" style={{ background: 'var(--luxury-dark)', borderColor: 'var(--luxury-border)' }}>
          <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-10">

            {/* 品牌 */}
            <div>
              <p className="text-xs tracking-[0.3em] uppercase mb-1" style={{ color: 'var(--luxury-gold)', fontFamily: 'var(--font-playfair)' }}>
                Chyi Real Estate
              </p>
              <p className="text-base font-medium mb-3" style={{ color: 'var(--luxury-cream)' }}>群義房屋｜雲林雲科加盟店</p>
              <span className="gold-line" />
              <p className="text-xs leading-relaxed" style={{ color: 'var(--luxury-muted)' }}>
                紅火房屋仲介有限公司<br />
                經紀人證號：113雲縣字第00302號
              </p>
            </div>

            {/* 快速連結 */}
            <div>
              <p className="text-xs tracking-[0.25em] uppercase mb-4" style={{ color: 'var(--luxury-muted)' }}>探索</p>
              <div className="flex flex-col gap-2.5">
                {[{ href: '/blog', label: '房市專欄' }, { href: '/about', label: '關於我們' }].map(({ href, label }) => (
                  <Link key={href} href={href} className="text-sm transition-colors duration-200"
                    style={{ color: 'var(--luxury-muted)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--luxury-gold)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--luxury-muted)')}>
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* 聯絡 */}
            <div>
              <p className="text-xs tracking-[0.25em] uppercase mb-4" style={{ color: 'var(--luxury-muted)' }}>聯絡</p>
              <div className="flex flex-col gap-2 text-sm" style={{ color: 'var(--luxury-muted)' }}>
                <p>📞 05-5362808</p>
                <p>📍 雲林縣斗六市中正路312號</p>
              </div>
            </div>
          </div>

          <div className="border-t text-center py-5 text-xs" style={{ borderColor: 'var(--luxury-border)', color: 'var(--luxury-subtle)' }}>
            © {new Date().getFullYear()} 群義房屋 版權所有
          </div>
        </footer>
      </body>
    </html>
  );
}
