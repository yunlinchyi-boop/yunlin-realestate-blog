import Link from 'next/link';
import { getPosts, formatDateTW } from '@/lib/posts';

export default function BlogPage() {
  const posts = getPosts();
  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags)));

  return (
    <main style={{ background: '#0C0C0C', color: '#F5F0E8', minHeight: '100vh' }}>

      {/* 頁面標題區 */}
      <section className="text-center" style={{
        borderBottom: '1px solid #2E2E2E', padding: '80px 24px 60px', background: '#161616'
      }}>
        <p style={{
          color: '#C9A84C', fontSize: '0.7rem', letterSpacing: '0.4em', textTransform: 'uppercase',
          fontFamily: 'var(--font-playfair)', fontStyle: 'italic', marginBottom: 16
        }}>Real Estate Column</p>
        <h1 style={{
          color: '#F5F0E8', fontFamily: 'var(--font-playfair)',
          fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 600, letterSpacing: '0.08em', marginBottom: 12
        }}>房地產專欄</h1>
        <div style={{ width: 36, height: 1, background: '#C9A84C', margin: '0 auto 16px' }} />
        <p style={{ color: '#7A7A7A', fontSize: '0.9rem' }}>雲林房市趨勢・買房攻略・投資分析</p>
      </section>

      <div className="max-w-5xl mx-auto py-16 px-6">

        {/* 標籤篩選 */}
        {allTags.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-12">
            <Link href="/blog" className="btn-gold" style={{ padding: '6px 16px', fontSize: '0.7rem' }}>全部</Link>
            {allTags.map(tag => (
              <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}
                className="btn-outline" style={{ padding: '6px 16px', fontSize: '0.7rem' }}>
                {tag}
              </Link>
            ))}
          </div>
        )}

        {/* 文章列表 */}
        {posts.length === 0 ? (
          <p className="text-center py-20" style={{ color: '#7A7A7A' }}>文章準備中，敬請期待...</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${encodeURIComponent(post.slug)}`} className="group">
                <article className="luxury-card h-full flex flex-col overflow-hidden">
                  {post.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.coverImage} alt={post.title} className="w-full object-cover" style={{ height: 200 }} />
                  ) : (
                    <div className="w-full flex items-center justify-center" style={{
                      height: 200, background: 'linear-gradient(135deg, #1C1C1C 0%, #252010 100%)'
                    }}>
                      <span style={{ fontSize: '3rem', opacity: 0.2 }}>🏠</span>
                    </div>
                  )}

                  <div className="p-6 flex flex-col flex-1" style={{ background: '#1C1C1C' }}>
                    <div className="flex gap-2 mb-3 flex-wrap">
                      {post.tags.map(tag => (
                        <span key={tag} style={{
                          border: '1px solid rgba(201,168,76,0.3)', color: '#C9A84C',
                          fontSize: '0.6rem', padding: '2px 8px', letterSpacing: '0.1em'
                        }}>{tag}</span>
                      ))}
                    </div>

                    <h2 className="post-title text-lg font-semibold leading-snug mb-3"
                      style={{ fontFamily: 'var(--font-playfair)' }}>
                      {post.title}
                    </h2>

                    <p className="text-sm flex-1 line-clamp-3 leading-relaxed" style={{ color: '#7A7A7A' }}>
                      {post.description}
                    </p>

                    <div className="flex items-center justify-between mt-5 pt-4" style={{ borderTop: '1px solid #2E2E2E' }}>
                      <p style={{ color: '#3A3A3A', fontSize: '0.75rem' }}>{formatDateTW(post.date)}</p>
                      <span style={{ color: '#7A7A7A', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                        閱讀 →
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
