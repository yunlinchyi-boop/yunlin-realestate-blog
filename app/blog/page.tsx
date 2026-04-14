import Link from 'next/link';
import { getPosts, formatDateTW } from '@/lib/posts';

export default function BlogPage() {
  const posts = getPosts();
  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags)));

  return (
    <main style={{ background:'var(--luxury-black)', color:'var(--luxury-cream)', minHeight:'100vh' }}>

      {/* 頁面標題區 */}
      <section className="border-b py-20 px-6 text-center" style={{ borderColor:'var(--luxury-border)' }}>
        <p className="text-xs tracking-[0.4em] uppercase mb-4"
          style={{ color:'var(--luxury-gold)', fontFamily:'var(--font-playfair)', fontStyle:'italic' }}>
          Real Estate Column
        </p>
        <h1 className="text-3xl font-semibold tracking-wider mb-3"
          style={{ color:'var(--luxury-cream)', fontFamily:'var(--font-playfair)' }}>
          房地產專欄
        </h1>
        <span style={{ display:'block', width:36, height:1, background:'var(--luxury-gold)', margin:'0 auto 16px' }} />
        <p className="text-sm" style={{ color:'var(--luxury-muted)' }}>雲林房市趨勢・買房攻略・投資分析</p>
      </section>

      <div className="max-w-5xl mx-auto py-16 px-6">

        {/* 標籤篩選 */}
        {allTags.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-12">
            <Link href="/blog"
              className="text-xs tracking-[0.15em] uppercase px-4 py-2 border transition-all duration-200 hover:border-[#C9A84C] hover:text-[#C9A84C]"
              style={{ borderColor:'var(--luxury-gold)', color:'var(--luxury-gold)' }}>
              全部
            </Link>
            {allTags.map(tag => (
              <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}
                className="text-xs tracking-[0.15em] uppercase px-4 py-2 border transition-all duration-200 hover:border-[#C9A84C] hover:text-[#C9A84C]"
                style={{ borderColor:'var(--luxury-border)', color:'var(--luxury-muted)' }}>
                {tag}
              </Link>
            ))}
          </div>
        )}

        {/* 文章列表 */}
        {posts.length === 0 ? (
          <p className="text-center py-20" style={{ color:'var(--luxury-muted)' }}>文章準備中，敬請期待...</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${encodeURIComponent(post.slug)}`} className="group">
                <article className="luxury-card h-full flex flex-col overflow-hidden transition-all duration-300">
                  {/* 封面 */}
                  {post.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.coverImage} alt={post.title} className="w-full object-cover" style={{ height:200 }} />
                  ) : (
                    <div className="w-full flex items-center justify-center" style={{ height:200,
                      background:'linear-gradient(135deg, #1C1C1C 0%, #252010 100%)' }}>
                      <span className="text-5xl opacity-30">🏠</span>
                    </div>
                  )}

                  <div className="p-6 flex flex-col flex-1">
                    {/* 標籤 */}
                    <div className="flex gap-2 mb-3 flex-wrap">
                      {post.tags.map(tag => (
                        <span key={tag} className="text-xs px-2 py-0.5"
                          style={{ border:'1px solid #C9A84C44', color:'var(--luxury-gold)', fontSize:'0.65rem' }}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h2 className="text-lg font-semibold leading-snug mb-3 group-hover:text-[#C9A84C] transition-colors duration-200"
                      style={{ color:'var(--luxury-cream)', fontFamily:'var(--font-playfair)' }}>
                      {post.title}
                    </h2>

                    <p className="text-sm flex-1 line-clamp-3 leading-relaxed" style={{ color:'var(--luxury-muted)' }}>
                      {post.description}
                    </p>

                    <div className="flex items-center justify-between mt-5 pt-4 border-t"
                      style={{ borderColor:'var(--luxury-border)' }}>
                      <p className="text-xs" style={{ color:'var(--luxury-subtle)' }}>{formatDateTW(post.date)}</p>
                      <span className="text-xs tracking-widest uppercase transition-colors duration-200 group-hover:text-[#C9A84C]"
                        style={{ color:'var(--luxury-muted)' }}>
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
