import type { Metadata } from 'next';
import { Noto_Sans_TC } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const notoSansTC = Noto_Sans_TC({
  variable: '--font-noto-sans-tc',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
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
  return (
    <html lang="zh-TW" className={`${notoSansTC.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        {/* 頂部導覽 */}
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-gray-900">
              🏠 群義房屋
            </Link>
            <nav className="flex gap-6 text-sm font-medium text-gray-600">
              <Link href="/blog" className="hover:text-amber-600 transition">專欄文章</Link>
              <Link href="/#about" className="hover:text-amber-600 transition">關於我們</Link>
              <a href="tel:055362808" className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-1.5 rounded-full transition">
                📞 立即諮詢
              </a>
            </nav>
          </div>
        </header>

        <div className="flex-1">{children}</div>

        {/* 頁尾 */}
        <footer className="bg-gray-900 text-gray-400 py-10 px-6 text-center text-sm">
          <p className="text-white font-semibold mb-1">群義房屋｜雲林雲科加盟店</p>
          <p>紅火房屋仲介有限公司｜經紀人證號：113雲縣字第00302號</p>
          <p className="mt-1">📞 05-5362808　📍 雲林縣斗六市中正路312號</p>
          <p className="mt-4 text-gray-600">© {new Date().getFullYear()} 群義房屋 版權所有</p>
        </footer>
      </body>
    </html>
  );
}
