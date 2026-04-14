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
    <main style={{ background: '#0C0C0C', color: '#F5F0E8' }}>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden" style={{ minHeight: '80vh', background: '#0C0C0C' }}>
        <Image src="/images/shoptitle.png" alt="群義房屋雲林雲科加盟店"
          fill className="object-cover" style={{ opacity: 0.25 }} priority />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, rgba(12,12,12,0.5) 0%, rgba(12,12,12,0.75) 50%, rgba(12,12,12,0.97) 100%)'
        }} />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 50% 60%, rgba(201,168,76,0.08) 0%, transparent 70%)'
        }} />

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6"
          style={{ minHeight: '80vh' }}>

          <div className="flex items-center gap-4 mb-8">
            <div style={{ width: 60, height: 1, background: 'linear-gradient(to right, transparent, #C9A84C)' }} />
            <span style={{ color: '#C9A84C', fontSize: '0.6rem', letterSpacing: '0.4em', textTransform: 'uppercase' }}>
              Est. Yunlin
            </span>
            <div style={{ width: 60, height: 1, background: 'linear-gradient(to left, transparent, #C9A84C)' }} />
          </div>

          <p style={{
            color: '#C9A84C', fontFamily: 'var(--font-playfair)', fontStyle: 'italic',
            fontSize: '1rem', letterSpacing: '0.3em', marginBottom: 20
          }}>
            Chyi Real Estate · Yunlin
          </p>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 6vw, 4rem)',
            fontFamily: 'var(--font-playfair)',
            color: '#F5F0E8',
            letterSpacing: '0.08em',
            lineHeight: 1.2,
            fontWeight: 700,
            marginBottom: 24,
            textShadow: '0 2px 40px rgba(0,0,0,0.8)'
          }}>
            群義房屋<br />
            <em style={{ color: '#C9A84C' }}>雲林雲科加盟店</em>
          </h1>

          <div className="flex items-center gap-3 mb-6">
            <div style={{ width: 20, height: 1, background: '#C9A84C' }} />
            <div style={{ width: 6, height: 6, background: '#C9A84C', transform: 'rotate(45deg)' }} />
            <div style={{ width: 20, height: 1, background: '#C9A84C' }} />
          </div>

          <p style={{ color: 'rgba(245,240,232,0.45)', letterSpacing: '0.35em', fontSize: '0.75rem', marginBottom: 48 }}>
            透天・土地・農地・廠房　每日房市資訊
          </p>

          <div className="flex gap-5 flex-wrap justify-center">
            <Link href="/blog" className="btn-gold">房市專欄</Link>
            <a href="tel:055362808" className="btn-outline">05-5362808</a>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ opacity: 0.35 }}>
          <span style={{ color: '#F5F0E8', fontSize: '0.6rem', letterSpacing: '0.4em', textTransform: 'uppercase' }}>Scroll</span>
          <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, #C9A84C, transparent)' }} />
        </div>
      </section>

      {/* ── 每日房市專欄 ── */}
      <section style={{ background: '#0C0C0C', padding: '80px 24px' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p style={{
                color: '#C9A84C', fontSize: '0.7rem', letterSpacing: '0.35em', textTransform: 'uppercase',
                fontFamily: 'var(--font-playfair)', fontStyle: 'italic', marginBottom: 8
              }}>Daily Column</p>
              <h2 style={{ color: '#F5F0E8', fontFamily: 'var(--font-playfair)', fontSize: '1.6rem', fontWeight: 600, letterSpacing: '0.08em' }}>
                每日房市專欄
              </h2>
              <div style={{ width: 36, height: 1, background: '#C9A84C', marginTop: 10 }} />
            </div>
            <Link href="/blog" className="link-gold">查看全部</Link>
          </div>

          {latestNews.length === 0 ? (
            <p style={{ color: '#7A7A7A', textAlign: 'center', padding: '60px 0' }}>文章準備中，敬請期待...</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {latestNews.map((post, i) => (
                <Link key={post.slug} href={`/blog/${encodeURIComponent(post.slug)}`} className="group">
                  <article className="luxury-card flex overflow-hidden" style={{ height: 140 }}>
                    <div className="w-32 flex-shrink-0 flex items-center justify-center" style={{
                      background: i === 0
                        ? 'linear-gradient(135deg, #1C1810 0%, #252010 100%)'
                        : 'linear-gradient(135deg, #0E1620 0%, #101C2A 100%)',
                      borderRight: '1px solid #2E2E2E'
                    }}>
                      <span style={{ fontSize: '2rem', opacity: 0.8 }}>{i === 0 ? '📰' : '📊'}</span>
                    </div>
                    <div className="p-5 flex flex-col justify-between flex-1 min-w-0">
                      <div>
                        <div className="flex gap-1.5 mb-2 flex-wrap">
                          {post.tags.slice(0, 2).map(tag => (
                            <span key={tag} style={{
                              border: '1px solid rgba(201,168,76,0.3)',
                              color: '#C9A84C', fontSize: '0.6rem', padding: '2px 8px', letterSpacing: '0.1em'
                            }}>{tag}</span>
                          ))}
                        </div>
                        <h3 className="post-title text-sm font-medium leading-snug line-clamp-2">
                          {post.title}
                        </h3>
                      </div>
                      <p style={{ color: '#7A7A7A', fontSize: '0.75rem' }}>{formatDateTW(post.date)}</p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}

          <Link href="/blog" className="btn-all-posts mt-7">
            瀏覽所有房市文章
          </Link>
        </div>
      </section>

      {/* 金色分隔線 */}
      <div className="max-w-6xl mx-auto px-6">
        <div style={{ height: 1, background: 'linear-gradient(to right, transparent, #C9A84C, transparent)' }} />
      </div>

      {/* ── 最新物件介紹 ── */}
      {latestPropertyPosts.length > 0 && (
        <section style={{ background: '#0C0C0C', padding: '80px 24px' }}>
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p style={{
                  color: '#C9A84C', fontSize: '0.7rem', letterSpacing: '0.35em', textTransform: 'uppercase',
                  fontFamily: 'var(--font-playfair)', fontStyle: 'italic', marginBottom: 8
                }}>Latest Properties</p>
                <h2 style={{ color: '#F5F0E8', fontFamily: 'var(--font-playfair)', fontSize: '1.6rem', fontWeight: 600, letterSpacing: '0.08em' }}>
                  最新物件介紹
                </h2>
                <div style={{ width: 36, height: 1, background: '#C9A84C', marginTop: 10 }} />
              </div>
              <Link href="/blog" className="link-gold">查看全部</Link>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {latestPropertyPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${encodeURIComponent(post.slug)}`} className="group">
                  <article className="luxury-card flex overflow-hidden" style={{ height: 140 }}>
                    <div className="w-32 flex-shrink-0 flex items-center justify-center" style={{
                      background: 'linear-gradient(135deg, #0C1A0E 0%, #142010 100%)',
                      borderRight: '1px solid #2E2E2E'
                    }}>
                      <span style={{ fontSize: '2rem' }}>🏠</span>
                    </div>
                    <div className="p-5 flex flex-col justify-between flex-1 min-w-0">
                      <div>
                        <div className="flex gap-1.5 mb-2 flex-wrap">
                          {post.tags.slice(0, 2).map(tag => (
                            <span key={tag} style={{
                              border: '1px solid #2E2E2E', color: '#7A7A7A', fontSize: '0.6rem', padding: '2px 8px'
                            }}>{tag}</span>
                          ))}
                        </div>
                        <h3 className="post-title text-sm font-medium leading-snug line-clamp-2">
                          {post.title}
                        </h3>
                      </div>
                      <p style={{ color: '#7A7A7A', fontSize: '0.75rem' }}>{formatDateTW(post.date)}</p>
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
        <section style={{ background: '#161616', padding: '80px 24px', borderTop: '1px solid #2E2E2E' }}>
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p style={{
                  color: '#C9A84C', fontSize: '0.7rem', letterSpacing: '0.35em', textTransform: 'uppercase',
                  fontFamily: 'var(--font-playfair)', fontStyle: 'italic', marginBottom: 8
                }}>Featured</p>
                <h2 style={{ color: '#F5F0E8', fontFamily: 'var(--font-playfair)', fontSize: '1.6rem', fontWeight: 600, letterSpacing: '0.08em' }}>
                  精選物件
                </h2>
                <div style={{ width: 36, height: 1, background: '#C9A84C', marginTop: 10 }} />
                <p style={{ color: '#7A7A7A', fontSize: '0.75rem', marginTop: 8 }}>同步自群義房屋官網・每日自動更新</p>
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
      <section style={{ background: '#0C0C0C', padding: '100px 24px', textAlign: 'center', borderTop: '1px solid #2E2E2E' }}>
        <p style={{
          color: '#C9A84C', fontSize: '0.7rem', letterSpacing: '0.4em', textTransform: 'uppercase',
          fontFamily: 'var(--font-playfair)', fontStyle: 'italic', marginBottom: 16
        }}>Contact Us</p>
        <h2 style={{
          color: '#F5F0E8', fontFamily: 'var(--font-playfair)', fontSize: '1.8rem',
          fontWeight: 600, letterSpacing: '0.08em', marginBottom: 12
        }}>開始您的置產旅程</h2>
        <div style={{ width: 36, height: 1, background: '#C9A84C', margin: '0 auto 20px' }} />
        <p style={{ color: '#7A7A7A', fontSize: '0.9rem', marginBottom: 40 }}>專業顧問一對一服務，雲林斗六在地深耕</p>
        <a href="tel:055362808" className="btn-cta-phone">立即致電　05-5362808</a>
      </section>

    </main>
  );
}
