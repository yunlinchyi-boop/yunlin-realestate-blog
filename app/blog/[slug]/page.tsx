import { getPosts, getPostBySlug, formatDateTW } from '@/lib/posts';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yunlin-realestate-blog.vercel.app';

export async function generateStaticParams() {
  return getPosts().map((p) => ({ slug: encodeURIComponent(p.slug) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const result = await getPostBySlug(decodedSlug);
  if (!result) return {};
  const { post } = result;
  const canonicalUrl = `${SITE_URL}/blog/${encodeURIComponent(post.slug)}`;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: post.title,
      description: post.description,
      url: canonicalUrl,
      type: 'article',
      publishedTime: post.date,
      locale: 'zh_TW',
      siteName: '群義房屋｜雲林雲科加盟店',
      images: post.coverImage
        ? [{ url: post.coverImage, width: 1200, height: 630, alt: post.title }]
        : [{ url: `${SITE_URL}/og-default.jpg`, width: 1200, height: 630, alt: '群義房屋' }],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const result = await getPostBySlug(decodedSlug);
  if (!result) return notFound();
  const { post, contentHtml } = result;

  const canonicalUrl = `${SITE_URL}/blog/${encodeURIComponent(post.slug)}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    url: canonicalUrl,
    image: post.coverImage || `${SITE_URL}/og-default.jpg`,
    author: { '@type': 'Organization', name: '群義房屋｜雲林雲科加盟店', url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: '群義房屋｜雲林雲科加盟店',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
  };

  return (
    <main style={{ background:'var(--luxury-black)', color:'var(--luxury-cream)', minHeight:'100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* 文章標題區 */}
      <header className="border-b py-16 px-6" style={{ borderColor:'var(--luxury-border)', background:'var(--luxury-dark)' }}>
        <div className="max-w-3xl mx-auto">
          {/* 標籤 */}
          <div className="flex gap-2 mb-5 flex-wrap">
            {post.tags.map(tag => (
              <span key={tag} className="text-xs px-3 py-1 tracking-widest uppercase"
                style={{ border:'1px solid #C9A84C44', color:'var(--luxury-gold)', fontSize:'0.65rem' }}>
                {tag}
              </span>
            ))}
          </div>

          <h1 className="font-semibold mb-4 leading-snug"
            style={{ fontSize:'clamp(1.5rem,4vw,2.2rem)', fontFamily:'var(--font-playfair)', color:'var(--luxury-cream)' }}>
            {post.title}
          </h1>

          <span style={{ display:'block', width:36, height:1, background:'var(--luxury-gold)', marginBottom:14 }} />

          <p className="text-xs tracking-widest" style={{ color:'var(--luxury-muted)' }}>
            {formatDateTW(post.date)}
          </p>
        </div>
      </header>

      {/* 封面圖 */}
      {post.coverImage && (
        <div className="max-w-3xl mx-auto px-6 mt-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.coverImage} alt={post.title}
            className="w-full object-cover" style={{ height:300 }} />
        </div>
      )}

      {/* 文章內容 */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <article
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </div>

      {/* 文章底部 */}
      <div className="max-w-3xl mx-auto px-6 pb-16">
        <div className="border-t pt-10" style={{ borderColor:'var(--luxury-border)' }}>
          {/* 分隔裝飾 */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px" style={{ background:'var(--luxury-border)' }} />
            <span className="text-xs tracking-[0.3em] uppercase" style={{ color:'var(--luxury-gold)' }}>群義房屋</span>
            <div className="flex-1 h-px" style={{ background:'var(--luxury-border)' }} />
          </div>

          <div className="text-center p-8" style={{ border:'1px solid var(--luxury-border)' }}>
            <p className="text-xs tracking-[0.3em] uppercase mb-2"
              style={{ color:'var(--luxury-gold)', fontFamily:'var(--font-playfair)', fontStyle:'italic' }}>
              Chyi Real Estate
            </p>
            <p className="text-base font-medium mb-1" style={{ color:'var(--luxury-cream)' }}>群義房屋｜雲林雲科加盟店</p>
            <p className="text-sm mb-4" style={{ color:'var(--luxury-muted)' }}>📞 05-5362808　📍 雲林縣斗六市中正路312號</p>
            <a href="tel:055362808"
              className="inline-block text-xs tracking-[0.2em] uppercase px-8 py-2.5 border transition-all duration-300 hover:bg-[#C9A84C] hover:text-black"
              style={{ borderColor:'var(--luxury-gold)', color:'var(--luxury-gold)' }}>
              立即諮詢
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
