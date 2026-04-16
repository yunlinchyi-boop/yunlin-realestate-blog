import Link from 'next/link';
import Image from 'next/image';
import { getProperties, getPropertyTypes } from '@/lib/properties';
import { getPosts, formatDateTW } from '@/lib/posts';
import PropertyFilter from '@/components/PropertyFilter';

export const revalidate = 0;

export default function HomePage() {
  const allProperties = getProperties();
  const types = getPropertyTypes();
  const allPosts = getPosts();
  const latestNews = allPosts.filter(p => !p.slug.includes('-property-')).slice(0, 4);
  const latestPropertyPosts = allPosts.filter(p => p.slug.includes('-property-')).slice(0, 4);

  return (
    <main style={{ background: '#FFFFFF', color: '#1A1A1A' }}>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden" style={{ minHeight: '72vh', background: '#0F4D24' }}>
        <Image src="/images/storefront.jpg" alt="群義房屋雲林雲科加盟店店頭"
          fill className="object-cover" style={{ opacity: 1 }} priority />
        {/* 半透明深色遮罩（讓文字可讀）*/}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.55) 100%)'
        }} />

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6"
          style={{ minHeight: '72vh' }}>

          {/* 紅色標籤 */}
          <div className="inline-block mb-6 px-4 py-1.5 text-xs font-bold tracking-widest uppercase"
            style={{ background: '#CC1122', color: '#FFFFFF', letterSpacing: '0.25em' }}>
            雲林 · 斗六在地房仲
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 6vw, 3.8rem)',
            fontFamily: 'var(--font-playfair)',
            color: '#FFFFFF',
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: '0.05em',
            marginBottom: 20
          }}>
            群義房屋<br />雲林雲科加盟店
          </h1>

          <p style={{
            color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem',
            letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 40
          }}>
            Chyi Real Estate · Yunlin
          </p>

          {/* 白色細線 */}
          <div style={{ width: 48, height: 2, background: '#FFFFFF', opacity: 0.3, margin: '0 auto 32px' }} />

          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: 40, letterSpacing: '0.1em' }}>
            透天・土地・農地・廠房｜每日房市資訊
          </p>

          <div className="flex gap-4 flex-wrap justify-center">
            <Link href="/blog" className="btn-red">房市專欄</Link>
            <a href="tel:055362808" className="btn-navy-outline"
              style={{ borderColor: 'rgba(255,255,255,0.6)', color: '#FFFFFF' }}>
              05-5362808
            </a>
          </div>

        </div>
      </section>

      {/* ── 三大特色 ── */}
      <section style={{ background: '#F7F6F4', padding: '56px 24px', borderBottom: '1px solid #E5E5E5' }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-0" style={{ border: '1px solid #E5E5E5' }}>
          {[
            { num: '01', title: '在地深耕', desc: '雲林斗六在地服務 10 年以上，每條巷弄都熟悉' },
            { num: '02', title: '每日資訊', desc: '即時房市行情分析，第一時間掌握最新動態' },
            { num: '03', title: '專業服務', desc: '一對一顧問全程陪伴，從看房、議價到成交' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col p-10"
              style={{ borderRight: i < 2 ? '1px solid #E5E5E5' : 'none', background: '#FFFFFF' }}>
              <p style={{ color: '#E5E5E5', fontSize: '3rem', fontWeight: 700, fontFamily: 'var(--font-playfair)', lineHeight: 1, marginBottom: 16 }}>
                {item.num}
              </p>
              <div style={{ width: 32, height: 3, background: '#CC1122', marginBottom: 16 }} />
              <p style={{ color: '#1A6B35', fontWeight: 700, fontSize: '1rem', marginBottom: 10, letterSpacing: '0.05em' }}>
                {item.title}
              </p>
              <p style={{ color: '#767676', fontSize: '0.85rem', lineHeight: 1.8 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 為何選擇我們 ── */}
      <section style={{ background: '#0F4D24', padding: '80px 24px' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center" style={{ marginBottom: 48 }}>
            <p style={{ color: '#CC1122', fontSize: '0.65rem', letterSpacing: '0.35em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 12 }}>
              Why Choose Us
            </p>
            <h2 style={{
              color: '#FFFFFF', fontFamily: 'var(--font-playfair)',
              fontSize: '1.8rem', fontWeight: 700, marginBottom: 10
            }}>
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
              <div key={i} style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '28px 32px',
                transition: 'background 0.2s',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{ width: 4, height: 40, background: '#CC1122', flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <p style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '1rem', marginBottom: 8, letterSpacing: '0.03em' }}>
                      {item.title}
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', lineHeight: 1.8 }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center" style={{ marginTop: 48 }}>
            <a href="tel:055362808" className="btn-red" style={{ fontSize: '0.8rem', padding: '14px 48px' }}>
              免費諮詢 05-5362808
            </a>
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

      {/* ── 分隔 ── */}
      <div style={{ height: 1, background: '#E5E5E5' }} />

      {/* ── 最新物件介紹 ── */}
      {latestPropertyPosts.length > 0 && (
        <section style={{ background: '#F7F6F4', padding: '72px 24px' }}>
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <div style={{ width: 4, height: 24, background: '#CC1122' }} />
                  <p style={{ color: '#CC1122', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 700 }}>
                    Latest Properties
                  </p>
                </div>
                <h2 style={{ color: '#1A1A1A', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '0.05em' }}>
                  最新物件介紹
                </h2>
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
                            fontSize: '0.6rem', padding: '3px 10px', fontWeight: 600
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
                        <span style={{ color: '#CC1122', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em' }}>閱讀 →</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 精選物件 ── */}
      {allProperties.length > 0 && (
        <section style={{ background: '#FFFFFF', padding: '72px 24px', borderTop: '1px solid #E5E5E5' }}>
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

      {/* ── 底部 CTA ── */}
      <section style={{ background: '#1A6B35', padding: '80px 24px', textAlign: 'center' }}>
        <p style={{ color: '#CC1122', fontSize: '0.65rem', letterSpacing: '0.35em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 12 }}>
          Contact Us
        </p>
        <h2 style={{
          color: '#FFFFFF', fontFamily: 'var(--font-playfair)',
          fontSize: '1.8rem', fontWeight: 700, marginBottom: 10
        }}>
          開始您的置產旅程
        </h2>
        <div style={{ width: 40, height: 3, background: '#CC1122', margin: '0 auto 20px' }} />
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: 36 }}>
          專業顧問一對一服務，雲林斗六在地深耕
        </p>
        <a href="tel:055362808" className="btn-cta-phone"
          style={{ background: '#CC1122' }}>
          立即致電　05-5362808
        </a>
      </section>

    </main>
  );
}
