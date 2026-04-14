import Link from 'next/link';
import { getPosts, formatDateTW } from '@/lib/posts';

export default function BlogPage() {
  const posts = getPosts();
  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags)));

  return (
    <main style={{ background: '#FFFFFF', color: '#1A1A1A', minHeight: '100vh' }}>

      {/* 頁面標題 */}
      <section style={{ background: '#1B2A5E', padding: '64px 24px 48px', textAlign: 'center' }}>
        <p style={{ color: '#CC1122', fontSize: '0.65rem', letterSpacing: '0.35em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 12 }}>
          Real Estate Column
        </p>
        <h1 style={{
          color: '#FFFFFF', fontFamily: 'var(--font-playfair)',
          fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, marginBottom: 12
        }}>
          房地產專欄
        </h1>
        <div style={{ width: 40, height: 3, background: '#CC1122', margin: '0 auto 16px' }} />
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>
          雲林房市趨勢・買房攻略・投資分析
        </p>
      </section>

      <div className="max-w-5xl mx-auto py-14 px-6">

        {/* 標籤篩選 */}
        {allTags.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-10">
            <Link href="/blog" className="btn-navy" style={{ padding: '6px 16px', fontSize: '0.65rem' }}>全部</Link>
            {allTags.map(tag => (
              <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}
                className="btn-navy-outline" style={{ padding: '5px 14px', fontSize: '0.65rem' }}>
                {tag}
              </Link>
            ))}
          </div>
        )}

        {posts.length === 0 ? (
          <p className="text-center py-20" style={{ color: '#767676' }}>文章準備中，敬請期待...</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${encodeURIComponent(post.slug)}`}>
                <article className="brand-card h-full flex flex-col overflow-hidden">
                  {post.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.coverImage} alt={post.title} className="w-full object-cover" style={{ height: 200 }} />
                  ) : (
                    <div style={{
                      height: 200, background: 'linear-gradient(135deg, #1B2A5E 0%, #2E4080 100%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '3rem' }}>🏠</span>
                    </div>
                  )}

                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex gap-2 mb-3 flex-wrap">
                      {post.tags.map(tag => (
                        <span key={tag} style={{
                          background: '#EEF1F8', color: '#1B2A5E',
                          fontSize: '0.6rem', padding: '2px 8px', fontWeight: 600
                        }}>{tag}</span>
                      ))}
                    </div>
                    <h2 className="post-title font-bold leading-snug mb-3"
                      style={{ fontSize: '1rem', fontFamily: 'var(--font-playfair)' }}>
                      {post.title}
                    </h2>
                    <p className="text-sm flex-1 line-clamp-3" style={{ color: '#767676', lineHeight: 1.7 }}>
                      {post.description}
                    </p>
                    <div className="flex items-center justify-between mt-5 pt-4" style={{ borderTop: '1px solid #E5E5E5' }}>
                      <p style={{ color: '#AAAAAA', fontSize: '0.72rem' }}>{formatDateTW(post.date)}</p>
                      <span style={{ color: '#1B2A5E', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
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
