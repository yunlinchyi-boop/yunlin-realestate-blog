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
      <section className="relative overflow-hidden" style={{ minHeight: '72vh', background: '#1B2A5E' }}>
        <Image src="/images/shoptitle.png" alt="群義房屋雲林雲科加盟店"
          fill className="object-cover" style={{ opacity: 0.18 }} priority />
        {/* 深藍漸層 */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, rgba(17,28,66,0.95) 0%, rgba(27,42,94,0.88) 60%, rgba(46,64,128,0.85) 100%)'
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
            { icon: '🏡', title: '在地深耕', desc: '雲林斗六在地服務，熟悉每條巷弄' },
            { icon: '📊', title: '每日資訊', desc: '即時房市分析，掌握最新行情動態' },
            { icon: '🤝', title: '專業服務', desc: '一對一顧問陪伴，從看房到成交' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center p-10"
              style={{ borderRight: i < 2 ? '1px solid #E5E5E5' : 'none', background: '#FFFFFF' }}>
              <span style={{ fontSize: '2rem', marginBottom: 12 }}>{item.icon}</span>
              <p style={{ color: '#1B2A5E', fontWeight: 700, fontSize: '1rem', marginBottom: 8, letterSpacing: '0.05em' }}>
                {item.title}
              </p>
              <p style={{ color: '#767676', fontSize: '0.85rem', lineHeight: 1.7 }}>{item.desc}</p>
            </div>
          ))}
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
            <div className="grid md:grid-cols-2 gap-4">
              {latestNews.map((post) => (
                <Link key={post.slug} href={`/blog/${encodeURIComponent(post.slug)}`}>
                  <article className="brand-card flex overflow-hidden" style={{ height: 128 }}>
                    <div className="w-3 flex-shrink-0" style={{ background: '#1B2A5E' }} />
                    <div className="p-5 flex flex-col justify-between flex-1 min-w-0">
                      <div>
                        <div className="flex gap-2 mb-2 flex-wrap">
                          {post.tags.slice(0, 2).map(tag => (
                            <span key={tag} style={{
                              background: '#EEF1F8', color: '#1B2A5E',
                              fontSize: '0.6rem', padding: '2px 8px', fontWeight: 600, letterSpacing: '0.05em'
                            }}>{tag}</span>
                          ))}
                        </div>
                        <h3 className="post-title text-sm font-semibold leading-snug line-clamp-2">
                          {post.title}
                        </h3>
                      </div>
                      <p style={{ color: '#AAAAAA', fontSize: '0.72rem' }}>{formatDateTW(post.date)}</p>
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
            <div className="grid md:grid-cols-2 gap-4">
              {latestPropertyPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${encodeURIComponent(post.slug)}`}>
                  <article className="brand-card flex overflow-hidden" style={{ height: 128 }}>
                    <div className="w-3 flex-shrink-0" style={{ background: '#CC1122' }} />
                    <div className="p-5 flex flex-col justify-between flex-1 min-w-0">
                      <div>
                        <div className="flex gap-2 mb-2 flex-wrap">
                          {post.tags.slice(0, 2).map(tag => (
                            <span key={tag} style={{
                              background: '#FFF0F0', color: '#CC1122',
                              fontSize: '0.6rem', padding: '2px 8px', fontWeight: 600
                            }}>{tag}</span>
                          ))}
                        </div>
                        <h3 className="post-title text-sm font-semibold leading-snug line-clamp-2">
                          {post.title}
                        </h3>
                      </div>
                      <p style={{ color: '#AAAAAA', fontSize: '0.72rem' }}>{formatDateTW(post.date)}</p>
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
                  <div style={{ width: 4, height: 24, background: '#1B2A5E' }} />
                  <p style={{ color: '#1B2A5E', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 700 }}>
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
      <section style={{ background: '#1B2A5E', padding: '80px 24px', textAlign: 'center' }}>
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
