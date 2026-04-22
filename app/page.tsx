import Link from 'next/link';
import Image from 'next/image';
import { getProperties, getPropertyTypes } from '@/lib/properties';
import { getPosts, formatDateTW } from '@/lib/posts';
import PropertyFilter from '@/components/PropertyFilter';
import type { Metadata } from 'next';

export const revalidate = 0;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yunlin-realestate-blog.vercel.app';

export const metadata: Metadata = {
  title: '群義房屋｜雲林斗六在地房仲 — 透天、土地、農地、廠房',
  description: '群義房屋雲林雲科加盟店，斗六在地服務超過10年。專營雲林透天厝、農地、土地、廠房買賣。每日房市資訊，免費不推銷諮詢。電話：05-5362808。',
  keywords: ['雲林房屋', '斗六房仲', '雲林透天', '雲林土地', '雲林農地', '斗六買房', '群義房屋', '雲科大附近房屋', '雲林廠房', '斗六中正路'],
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: 'website', locale: 'zh_TW', url: SITE_URL,
    siteName: '群義房屋｜雲林雲科加盟店',
    title: '群義房屋｜雲林斗六在地房仲',
    description: '雲林斗六在地房仲，專營透天、土地、農地、廠房。免費諮詢 05-5362808。',
    images: [{ url: `${SITE_URL}/images/storefront.jpg`, width: 1200, height: 630, alt: '群義房屋雲林雲科加盟店' }],
  },
};

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': ['RealEstateAgent', 'LocalBusiness'],
  name: '群義房屋｜雲林雲科加盟店',
  alternateName: '紅火房屋仲介有限公司',
  description: '雲林斗六在地房仲，專營透天厝、農地、土地、廠房。服務雲林全縣，免費諮詢，不推銷。',
  url: SITE_URL,
  telephone: '+886-5-5362808',
  priceRange: '$$',
  image: `${SITE_URL}/images/storefront.jpg`,
  logo: `${SITE_URL}/images/logo-chyi.png`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: '中正路312號',
    addressLocality: '斗六市',
    addressRegion: '雲林縣',
    postalCode: '640',
    addressCountry: 'TW',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 23.7134,
    longitude: 120.5417,
  },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '09:00', closes: '18:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday'], opens: '09:00', closes: '17:00' },
  ],
  areaServed: ['雲林縣', '斗六市', '斗南鎮', '虎尾鎮', '西螺鎮', '古坑鄉'],
  sameAs: ['https://www.chyi.com.tw/store/055362808'],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '雲林斗六透天厝大概多少錢？',
      acceptedAnswer: { '@type': 'Answer', text: '雲林斗六透天厝目前行情約 600～1,500 萬，市中心精華區或新建案較高，郊區則較為親民。實際價格依坪數、屋齡、地點而有所不同，歡迎來電 05-5362808 免費諮詢。' },
    },
    {
      '@type': 'Question',
      name: '雲林農地怎麼買？有什麼注意事項？',
      acceptedAnswer: { '@type': 'Answer', text: '購買雲林農地需注意：1. 確認地目（農牧用地、林業用地等）2. 了解農地農用規定 3. 確認灌溉水源 4. 查詢是否有工業污染。建議透過在地房仲協助確認產權，避免風險。群義房屋提供免費農地諮詢服務。' },
    },
    {
      '@type': 'Question',
      name: '雲科大附近有哪些好的物件？',
      acceptedAnswer: { '@type': 'Answer', text: '雲科大周邊（斗六市區、林森路、大學路附近）有不少透天厝與公寓物件，租金報酬率約 4～5%，適合投資出租。目前我們有多筆優質物件，歡迎聯絡群義房屋雲科加盟店（05-5362808）了解最新釋出物件。' },
    },
    {
      '@type': 'Question',
      name: '斗六買房流程是什麼？',
      acceptedAnswer: { '@type': 'Answer', text: '斗六買房主要流程：1. 確認預算與需求 2. 委託房仲看物件 3. 出價議價 4. 簽訂買賣契約 5. 辦理貸款（建議先做銀行預審）6. 產權調查 7. 辦理過戶 8. 完成交屋。群義房屋全程陪伴，代書、貸款媒合一站完成。' },
    },
    {
      '@type': 'Question',
      name: '群義房屋的服務費怎麼計算？',
      acceptedAnswer: { '@type': 'Answer', text: '依不動產經紀業管理條例，買賣雙方各付成交價 1% 的仲介費（最高），購買方最高 2%。我們提供透明報價，成交前先說明清楚。歡迎電話諮詢：05-5362808，初次諮詢完全免費。' },
    },
  ],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: '群義房屋｜雲林雲科加盟店',
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/blog?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
};

export default function HomePage() {
  const allProperties = getProperties();
  const types = getPropertyTypes();
  const allPosts = getPosts();
  const latestNews = allPosts.filter(p => !p.slug.includes('-property-')).slice(0, 4);
  const latestPropertyPosts = allPosts.filter(p => p.slug.includes('-property-')).slice(0, 4);

  return (
    <main style={{ background: '#FFFFFF', color: '#1A1A1A' }}>

      {/* ── Schema.org 結構化資料 ── */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden" style={{ background: '#0F4D24', minHeight: '75vh', display: 'flex', flexDirection: 'column' }}>
        <img src="/images/storefront.jpg" alt="群義房屋雲林雲科加盟店店頭"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.65) 100%)'
        }} />

        {/* 主文字 */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6" style={{ flex: 1, paddingTop: 80, paddingBottom: 40 }}>
          <div className="inline-block mb-5 px-4 py-1.5 text-xs font-bold tracking-widest uppercase"
            style={{ background: '#CC1122', color: '#FFFFFF', letterSpacing: '0.25em' }}>
            雲林 · 斗六在地房仲
          </div>
          <h1 style={{
            fontSize: 'clamp(2.2rem, 6vw, 4rem)',
            fontFamily: 'var(--font-playfair)',
            color: '#FFFFFF', fontWeight: 700,
            lineHeight: 1.15, letterSpacing: '0.05em', marginBottom: 16
          }}>
            群義房屋<br />雲林雲科加盟店
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 32 }}>
            Chyi Real Estate · Yunlin
          </p>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.95rem', marginBottom: 40, letterSpacing: '0.08em' }}>
            透天・土地・農地・廠房｜免費諮詢・不推銷
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <a href="tel:055362808" className="btn-red" style={{ fontSize: '0.9rem', padding: '13px 36px' }}>立即致電 05-5362808</a>
            <Link href="/blog" className="btn-navy-outline" style={{ borderColor: 'rgba(255,255,255,0.5)', color: '#FFFFFF' }}>房市專欄</Link>
          </div>
        </div>

        {/* 底部三欄數據條 */}
        <div className="relative z-10" style={{ background: 'rgba(0,0,0,0.45)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="max-w-6xl mx-auto grid grid-cols-3" >
            {[
              { num: '10+', label: '年在地深耕' },
              { num: '42', label: '筆精選物件' },
              { num: '免費', label: '帶看・不推銷' },
            ].map((s, i) => (
              <div key={i} className="text-center py-5" style={{ borderRight: i < 2 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                <p style={{ color: '#FFFFFF', fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', fontWeight: 700, fontFamily: 'var(--font-playfair)', marginBottom: 2 }}>{s.num}</p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', letterSpacing: '0.1em' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 每日房市專欄 ── */}
      <section style={{ background: '#FFFFFF', padding: '72px 24px' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <div style={{ width: 4, height: 24, background: '#CC1122' }} />
                <p style={{ color: '#CC1122', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 700 }}>
                  Daily Column
                </p>
              </div>
              <h2 style={{ color: '#1A1A1A', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '0.05em' }}>
                每日房市專欄
              </h2>
            </div>
            <Link href="/blog" className="link-navy">查看全部</Link>
          </div>

          {latestNews.length === 0 ? (
            <p style={{ color: '#767676', textAlign: 'center', padding: '60px 0' }}>文章準備中，敬請期待...</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {latestNews.map((post) => (
                <Link key={post.slug} href={`/blog/${encodeURIComponent(post.slug)}`}>
                  <article className="brand-card overflow-hidden">
                    <div style={{ height: 4, background: '#1A6B35' }} />
                    <div className="p-6">
                      <div className="flex gap-2 mb-3 flex-wrap">
                        {post.tags.slice(0, 2).map(tag => (
                          <span key={tag} style={{
                            background: '#EBF5EF', color: '#1A6B35',
                            fontSize: '0.6rem', padding: '3px 10px', fontWeight: 600, letterSpacing: '0.05em'
                          }}>{tag}</span>
                        ))}
                      </div>
                      <h3 className="post-title font-semibold leading-snug line-clamp-2"
                        style={{ fontSize: '1rem', marginBottom: 10 }}>
                        {post.title}
                      </h3>
                      {post.description && (
                        <p style={{ color: '#767676', fontSize: '0.82rem', lineHeight: 1.7, marginBottom: 16 }}
                          className="line-clamp-2">
                          {post.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <p style={{ color: '#AAAAAA', fontSize: '0.72rem' }}>{formatDateTW(post.date)}</p>
                        <span style={{ color: '#1A6B35', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em' }}>閱讀 →</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}

          <Link href="/blog" className="btn-all-posts mt-6">
            瀏覽所有房市文章
          </Link>
        </div>
      </section>

      {/* ── 精選物件 ── */}
      {allProperties.length > 0 && (
        <section style={{ background: '#F7F6F4', padding: '72px 24px' }}>
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <div style={{ width: 4, height: 24, background: '#1A6B35' }} />
                  <p style={{ color: '#1A6B35', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 700 }}>
                    Featured Listings
                  </p>
                </div>
                <h2 style={{ color: '#1A1A1A', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '0.05em' }}>
                  精選物件
                </h2>
                <p style={{ color: '#767676', fontSize: '0.75rem', marginTop: 4 }}>同步自群義房屋官網・每日自動更新</p>
              </div>
              <a href="https://www.chyi.com.tw/sell_item/?storeid=4759" target="_blank" rel="noopener noreferrer"
                className="link-official">
                官網查看全部
              </a>
            </div>
            <PropertyFilter properties={allProperties} types={types} />
          </div>
        </section>
      )}

      {/* ── 每日物件介紹 ── */}
      {latestPropertyPosts.length > 0 && (
        <section style={{ background: '#FFFFFF', padding: '72px 24px', borderTop: '1px solid #E5E5E5' }}>
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <div style={{ width: 4, height: 24, background: '#CC1122' }} />
                  <p style={{ color: '#CC1122', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 700 }}>
                    Daily Property
                  </p>
                </div>
                <h2 style={{ color: '#1A1A1A', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '0.05em' }}>
                  每日物件介紹
                </h2>
                <p style={{ color: '#767676', fontSize: '0.75rem', marginTop: 4 }}>每日精選物件深度介紹</p>
              </div>
              <Link href="/blog" className="link-navy">查看全部</Link>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {latestPropertyPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${encodeURIComponent(post.slug)}`}>
                  <article className="brand-card overflow-hidden">
                    <div style={{ height: 4, background: '#CC1122' }} />
                    <div className="p-6">
                      <div className="flex gap-2 mb-3 flex-wrap">
                        {post.tags.slice(0, 2).map(tag => (
                          <span key={tag} style={{
                            background: '#FFF0F0', color: '#CC1122',
                            fontSize: '0.6rem', padding: '3px 10px', fontWeight: 600, letterSpacing: '0.05em'
                          }}>{tag}</span>
                        ))}
                      </div>
                      <h3 className="post-title font-semibold leading-snug line-clamp-2"
                        style={{ fontSize: '1rem', marginBottom: 10 }}>
                        {post.title}
                      </h3>
                      {post.description && (
                        <p style={{ color: '#767676', fontSize: '0.82rem', lineHeight: 1.7, marginBottom: 16 }}
                          className="line-clamp-2">
                          {post.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <p style={{ color: '#AAAAAA', fontSize: '0.72rem' }}>{formatDateTW(post.date)}</p>
                        <span style={{ color: '#CC1122', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em' }}>查看物件 →</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 常見問題 FAQ ── */}
      <section style={{ background: '#F7F6F4', padding: '72px 24px', borderTop: '1px solid #E5E5E5' }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center" style={{ marginBottom: 48 }}>
            <p style={{ color: '#CC1122', fontSize: '0.65rem', letterSpacing: '0.35em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 12 }}>FAQ</p>
            <h2 style={{ color: '#1A1A1A', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '0.05em' }}>常見問題</h2>
          </div>
          <div className="flex flex-col gap-4">
            {[
              { q: '雲林斗六透天厝大概多少錢？', a: '斗六透天厝目前行情約 600～1,500 萬，市中心精華區或新建案較高，郊區則較為親民。實際價格依坪數、屋齡、地點而有所不同，歡迎來電免費諮詢。' },
              { q: '雲林農地怎麼買？有什麼注意事項？', a: '購買農地需確認地目（農牧/林業用地）、農地農用規定、灌溉水源，並查詢是否有工業污染紀錄。群義房屋提供免費農地諮詢，協助確認產權，避免風險。' },
              { q: '雲科大附近有哪些好的物件？', a: '雲科大周邊透天與公寓物件，租金報酬率約 4～5%，適合投資出租。目前有多筆優質物件，歡迎聯絡我們了解最新釋出資訊。' },
              { q: '斗六買房流程是什麼？', a: '確認預算 → 看物件議價 → 簽約 → 辦理貸款 → 產權調查 → 過戶 → 交屋。群義房屋全程陪伴，代書、貸款媒合一站完成。' },
            ].map((item, i) => (
              <details key={i} style={{ background: '#FFFFFF', border: '1px solid #E5E5E5', padding: '20px 24px' }}>
                <summary style={{ fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', color: '#1A1A1A', letterSpacing: '0.02em' }}>
                  {item.q}
                </summary>
                <p style={{ color: '#555', fontSize: '0.875rem', lineHeight: 1.9, marginTop: 12 }}>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>


    </main>
  );
}
