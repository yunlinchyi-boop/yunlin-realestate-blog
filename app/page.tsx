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
    <main style={{ background: 'var(--luxury-black)', color: 'var(--luxury-cream)' }}>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden" style={{ minHeight: '72vh' }}>
        <Image src="/images/shoptitle.png" alt="群義房屋雲林雲科加盟店"
          fill className="object-cover" style={{ opacity: 0.3 }} priority />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(12,12,12,0.4) 0%, rgba(12,12,12,0.92) 100%)' }} />

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6"
          style={{ minHeight: '72vh' }}>
          <p className="text-xs tracking-[0.4em] uppercase mb-5"
            style={{ color: 'var(--luxury-gold)', fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}>
            Chyi Real Estate · Yunlin
          </p>
          <h1 className="font-bold mb-4"
            style={{ fontSize: 'clamp(2rem,5vw,3.2rem)', fontFamily: 'var(--font-playfair)',
              color: 'var(--luxury-cream)', letterSpacing: '0.06em', lineHeight: 1.25 }}>
            群義房屋<br />
            <em style={{ color: 'var(--luxury-gold)' }}>雲林雲科加盟店</em>
          </h1>
          <span style={{ display:'block', width:40, height:1, background:'var(--luxury-gold)', margin:'18px auto' }} />
          <p className="text-xs mb-12" style={{ color:'rgba(245,240,232,0.45)', letterSpacing:'0.3em' }}>
            透天・土地・農地・廠房　每日房市資訊
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <Link href="/blog"
              className="text-xs tracking-[0.2em] uppercase px-8 py-3 border transition-all duration-300 hover:bg-[#C9A84C] hover:text-black"
              style={{ borderColor:'var(--luxury-gold)', color:'var(--luxury-gold)' }}>
              房市專欄
            </Link>
            <a href="tel:055362808"
              className="text-xs tracking-[0.2em] uppercase px-8 py-3 border transition-all duration-300 hover:bg-white/10"
              style={{ borderColor:'rgba(245,240,232,0.3)', color:'var(--luxury-cream)' }}>
              05-5362808
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ opacity:0.35 }}>
          <span className="text-xs tracking-[0.3em] uppercase" style={{ color:'var(--luxury-cream)' }}>Scroll</span>
          <div className="w-px h-10" style={{ background:'linear-gradient(to bottom, var(--luxury-gold), transparent)' }} />
        </div>
      </section>

      {/* ── 每日房市專欄 ── */}
      <section className="max-w-6xl mx-auto py-20 px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase mb-2"
              style={{ color:'var(--luxury-gold)', fontFamily:'var(--font-playfair)', fontStyle:'italic' }}>Daily Column</p>
            <h2 className="text-2xl font-semibold tracking-wider"
              style={{ color:'var(--luxury-cream)', fontFamily:'var(--font-playfair)' }}>每日房市專欄</h2>
            <span style={{ display:'block', width:36, height:1, background:'var(--luxury-gold)', marginTop:10 }} />
          </div>
          <Link href="/blog"
            className="text-xs tracking-[0.2em] uppercase pb-1 border-b transition-colors duration-200 hover:text-[#C9A84C] hover:border-[#C9A84C]"
            style={{ color:'var(--luxury-muted)', borderColor:'var(--luxury-border)' }}>
            查看全部
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {latestNews.map((post, i) => (
            <Link key={post.slug} href={`/blog/${encodeURIComponent(post.slug)}`} className="group">
              <article className="luxury-card flex overflow-hidden" style={{ height:136 }}>
                <div className="w-32 flex-shrink-0 flex items-center justify-center"
                  style={{ background: i===0 ? 'linear-gradient(135deg,#1C1810,#252010)' : 'linear-gradient(135deg,#0E1620,#101C2A)' }}>
                  <span className="text-3xl">{i===0 ? '📰' : '📊'}</span>
                </div>
                <div className="p-5 flex flex-col justify-between flex-1 min-w-0">
                  <div>
                    <div className="flex gap-1.5 mb-2 flex-wrap">
                      {post.tags.slice(0,2).map(tag => (
                        <span key={tag} className="text-xs px-2 py-0.5"
                          style={{ border:'1px solid #C9A84C44', color:'var(--luxury-gold)', fontSize:'0.65rem' }}>{tag}</span>
                      ))}
                    </div>
                    <h3 className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-[#C9A84C] transition-colors duration-200"
                      style={{ color:'var(--luxury-cream)' }}>{post.title}</h3>
                  </div>
                  <p className="text-xs" style={{ color:'var(--luxury-muted)' }}>{formatDateTW(post.date)}</p>
                </div>
              </article>
            </Link>
          ))}
        </div>
        <Link href="/blog"
          className="mt-7 flex items-center justify-center w-full py-4 text-xs tracking-[0.25em] uppercase border transition-all duration-300 hover:border-[#C9A84C] hover:text-[#C9A84C]"
          style={{ borderColor:'var(--luxury-border)', color:'var(--luxury-muted)' }}>
          瀏覽所有房市文章
        </Link>
      </section>

      {/* 金色分隔線 */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px" style={{ background:'linear-gradient(to right, transparent, var(--luxury-gold), transparent)' }} />
      </div>

      {/* ── 最新物件介紹 ── */}
      {latestPropertyPosts.length > 0 && (
        <section className="max-w-6xl mx-auto py-20 px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase mb-2"
                style={{ color:'var(--luxury-gold)', fontFamily:'var(--font-playfair)', fontStyle:'italic' }}>Latest Properties</p>
              <h2 className="text-2xl font-semibold tracking-wider"
                style={{ color:'var(--luxury-cream)', fontFamily:'var(--font-playfair)' }}>最新物件介紹</h2>
              <span style={{ display:'block', width:36, height:1, background:'var(--luxury-gold)', marginTop:10 }} />
            </div>
            <Link href="/blog"
              className="text-xs tracking-[0.2em] uppercase pb-1 border-b hover:text-[#C9A84C] hover:border-[#C9A84C] transition-colors duration-200"
              style={{ color:'var(--luxury-muted)', borderColor:'var(--luxury-border)' }}>
              查看全部
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {latestPropertyPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${encodeURIComponent(post.slug)}`} className="group">
                <article className="luxury-card flex overflow-hidden" style={{ height:136 }}>
                  <div className="w-32 flex-shrink-0 flex items-center justify-center"
                    style={{ background:'linear-gradient(135deg,#0C1A0E,#142010)' }}>
                    <span className="text-3xl">🏠</span>
                  </div>
                  <div className="p-5 flex flex-col justify-between flex-1 min-w-0">
                    <div>
                      <div className="flex gap-1.5 mb-2 flex-wrap">
                        {post.tags.slice(0,2).map(tag => (
                          <span key={tag} className="text-xs px-2 py-0.5"
                            style={{ border:'1px solid var(--luxury-border)', color:'var(--luxury-muted)', fontSize:'0.65rem' }}>{tag}</span>
                        ))}
                      </div>
                      <h3 className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-[#C9A84C] transition-colors duration-200"
                        style={{ color:'var(--luxury-cream)' }}>{post.title}</h3>
                    </div>
                    <p className="text-xs" style={{ color:'var(--luxury-muted)' }}>{formatDateTW(post.date)}</p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── 精選物件 ── */}
      {allProperties.length > 0 && (
        <section className="py-20 px-6" style={{ background:'var(--luxury-dark)' }}>
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-xs tracking-[0.3em] uppercase mb-2"
                  style={{ color:'var(--luxury-gold)', fontFamily:'var(--font-playfair)', fontStyle:'italic' }}>Featured</p>
                <h2 className="text-2xl font-semibold tracking-wider"
                  style={{ color:'var(--luxury-cream)', fontFamily:'var(--font-playfair)' }}>精選物件</h2>
                <span style={{ display:'block', width:36, height:1, background:'var(--luxury-gold)', marginTop:10 }} />
                <p className="text-xs mt-2" style={{ color:'var(--luxury-muted)' }}>同步自群義房屋官網・每日自動更新</p>
              </div>
              <a href="https://www.chyi.com.tw/sell_item/?storeid=4759" target="_blank" rel="noopener noreferrer"
                className="text-xs tracking-[0.2em] uppercase pb-1 border-b hover:text-[#C9A84C] hover:border-[#C9A84C] transition-colors duration-200"
                style={{ color:'var(--luxury-muted)', borderColor:'var(--luxury-border)' }}>
                官網查看全部
              </a>
            </div>
            <PropertyFilter properties={allProperties} types={types} />
          </div>
        </section>
      )}

      {/* ── 底部 CTA ── */}
      <section className="py-24 px-6 text-center border-t" style={{ borderColor:'var(--luxury-border)' }}>
        <p className="text-xs tracking-[0.4em] uppercase mb-4"
          style={{ color:'var(--luxury-gold)', fontFamily:'var(--font-playfair)', fontStyle:'italic' }}>Contact Us</p>
        <h2 className="text-2xl font-semibold mb-3 tracking-wider"
          style={{ color:'var(--luxury-cream)', fontFamily:'var(--font-playfair)' }}>開始您的置產旅程</h2>
        <span style={{ display:'block', width:36, height:1, background:'var(--luxury-gold)', margin:'14px auto 20px' }} />
        <p className="text-sm mb-10" style={{ color:'var(--luxury-muted)' }}>專業顧問一對一服務，雲林斗六在地深耕</p>
        <a href="tel:055362808"
          className="inline-block text-xs tracking-[0.25em] uppercase px-12 py-4 border transition-all duration-300 hover:bg-[#C9A84C] hover:text-black"
          style={{ borderColor:'var(--luxury-gold)', color:'var(--luxury-gold)' }}>
          立即致電　05-5362808
        </a>
      </section>

    </main>
  );
}
