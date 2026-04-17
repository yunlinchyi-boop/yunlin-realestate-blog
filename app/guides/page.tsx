import type { Metadata } from 'next';
import Link from 'next/link';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yunlin-realestate-blog.vercel.app';
const PAGE_URL = `${SITE_URL}/guides`;

export const metadata: Metadata = {
  title: '雲林購屋指南｜斗六買房・農地・土地・透天｜群義房屋',
  description: '雲林購屋完整指南系列：斗六各區房價行情、農地購買法規、透天購屋流程、貸款試算。群義房屋雲科加盟店在地10年免費諮詢 05-5362808。',
  keywords: ['雲林購屋指南', '斗六買房', '雲林農地', '雲林房仲', '斗六房價', '雲林土地買賣'],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: '雲林購屋指南｜群義房屋雲科加盟店',
    description: '雲林購屋完整指南系列：斗六各區房價行情、農地購買法規、透天購屋流程、貸款試算。',
    url: PAGE_URL,
    type: 'website',
    locale: 'zh_TW',
    siteName: '群義房屋｜雲林雲科加盟店',
  },
};

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: '首頁', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: '購屋指南', item: PAGE_URL },
  ],
};

const guides = [
  {
    slug: 'douliou',
    title: '斗六買房完全指南',
    subtitle: '2025年版',
    description: '斗六各區域行情比較、購屋完整流程、首購族貸款試算、常見問題解答。在地10年仲介，帶你看懂斗六房市。',
    tags: ['斗六房價', '透天行情', '購屋流程', '貸款試算'],
    meta: '約 1,500 字 · 5 大章節',
    badge: '熱門',
    badgeColor: '#CC1122',
  },
  {
    slug: 'yunlin-farmland',
    title: '雲林農地購買完全指南',
    subtitle: '2025年版',
    description: '購買雲林農地前必讀：地目查詢、農用法規、農舍興建5大條件、各鄉鎮行情比較、污染與水源注意事項。',
    tags: ['農地購買', '農舍申請', '農地法規', '各鄉鎮行情'],
    meta: '約 1,500 字 · 6 大章節',
    badge: '必讀',
    badgeColor: '#0F4D24',
  },
];

export default function GuidesIndexPage() {
  return (
    <main style={{ background: '#FFFFFF', color: '#1A1A1A', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* Hero 標題區 */}
      <header style={{ background: '#0F4D24', padding: '64px 24px 52px' }}>
        <div className="max-w-3xl mx-auto">
          <p style={{
            color: '#CC1122', fontSize: '0.65rem', letterSpacing: '0.3em',
            textTransform: 'uppercase', fontWeight: 700, marginBottom: 12
          }}>Buying Guide · 雲林在地</p>
          <h1 style={{
            fontSize: 'clamp(1.6rem, 4.5vw, 2.4rem)',
            color: '#FFFFFF', lineHeight: 1.25, fontWeight: 700, marginBottom: 16
          }}>
            雲林購屋指南
          </h1>
          <div style={{ width: 36, height: 3, background: '#CC1122', marginBottom: 20 }} />
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', lineHeight: 1.7, maxWidth: 560 }}>
            群義房屋雲科加盟店整理的在地購屋知識庫，涵蓋斗六買房、農地購買、土地法規等主題，
            幫助您在雲林買到最合適的不動產。
          </p>
        </div>
      </header>

      {/* 指南卡片 */}
      <div className="max-w-3xl mx-auto px-6 py-14">
        <p style={{
          color: '#888', fontSize: '0.78rem', letterSpacing: '0.15em',
          textTransform: 'uppercase', fontWeight: 600, marginBottom: 24
        }}>共 {guides.length} 篇完整指南</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <article style={{
                border: '1px solid #E5E5E0',
                padding: '28px 30px',
                background: '#FAFAF8',
                cursor: 'pointer',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 12 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <span style={{
                        background: guide.badgeColor, color: '#FFFFFF',
                        fontSize: '0.6rem', padding: '2px 8px', fontWeight: 700, letterSpacing: '0.1em'
                      }}>{guide.badge}</span>
                      <span style={{ color: '#888', fontSize: '0.75rem' }}>{guide.subtitle}</span>
                    </div>
                    <h2 style={{
                      fontSize: '1.15rem', fontWeight: 700, color: '#1A1A1A',
                      lineHeight: 1.3, marginBottom: 0
                    }}>{guide.title}</h2>
                  </div>
                  <div style={{
                    color: '#0F4D24', fontSize: '1.4rem', fontWeight: 300,
                    flexShrink: 0, marginTop: 4
                  }}>→</div>
                </div>

                <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.75, marginBottom: 16 }}>
                  {guide.description}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                  {guide.tags.map(tag => (
                    <span key={tag} style={{
                      border: '1px solid #D0D0CC', color: '#666',
                      fontSize: '0.68rem', padding: '2px 10px', fontWeight: 500
                    }}>{tag}</span>
                  ))}
                </div>

                <p style={{ color: '#AAA', fontSize: '0.75rem' }}>{guide.meta}</p>
              </article>
            </Link>
          ))}
        </div>
      </div>

      {/* 底部聯絡 CTA */}
      <div className="max-w-3xl mx-auto px-6 pb-16">
        <div style={{ background: '#0F4D24', padding: '40px', textAlign: 'center' }}>
          <p style={{
            color: '#CC1122', fontSize: '0.65rem', letterSpacing: '0.3em',
            textTransform: 'uppercase', fontWeight: 700, marginBottom: 8
          }}>Chyi Real Estate · 在地10年</p>
          <p style={{ color: '#FFFFFF', fontSize: '1rem', fontWeight: 700, marginBottom: 4 }}>
            群義房屋｜雲林雲科加盟店
          </p>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', marginBottom: 24 }}>
            📞 05-5362808　📍 雲林縣斗六市中正路312號
          </p>
          <a href="tel:055362808" style={{
            display: 'inline-block', background: '#CC1122', color: '#FFFFFF',
            padding: '12px 36px', fontWeight: 700, fontSize: '0.95rem',
            textDecoration: 'none', letterSpacing: '0.05em'
          }}>立即免費諮詢</a>
        </div>
      </div>
    </main>
  );
}
