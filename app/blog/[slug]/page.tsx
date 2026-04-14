import { getPosts, getPostBySlug, formatDateTW } from '@/lib/posts';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yunlin-realestate-blog.vercel.app';

export async function generateStaticParams() {
  return getPosts().map((p) => ({ slug: encodeURIComponent(p.slug) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPostBySlug(decodeURIComponent(slug));
  if (!result) return {};
  const { post } = result;
  const canonicalUrl = `${SITE_URL}/blog/${encodeURIComponent(post.slug)}`;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: post.title, description: post.description, url: canonicalUrl,
      type: 'article', publishedTime: post.date, locale: 'zh_TW',
      siteName: '群義房屋｜雲林雲科加盟店',
      images: post.coverImage
        ? [{ url: post.coverImage, width: 1200, height: 630, alt: post.title }]
        : [{ url: `${SITE_URL}/og-default.jpg`, width: 1200, height: 630 }],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getPostBySlug(decodeURIComponent(slug));
  if (!result) return notFound();
  const { post, contentHtml } = result;

  const canonicalUrl = `${SITE_URL}/blog/${encodeURIComponent(post.slug)}`;
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: post.title, description: post.description,
    datePublished: post.date, dateModified: post.date, url: canonicalUrl,
    image: post.coverImage || `${SITE_URL}/og-default.jpg`,
    author: { '@type': 'Organization', name: '群義房屋｜雲林雲科加盟店', url: SITE_URL },
    publisher: {
      '@type': 'Organization', name: '群義房屋｜雲林雲科加盟店',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
  };

  return (
    <main style={{ background: '#0C0C0C', color: '#F5F0E8', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* 文章標題區 */}
      <header style={{ borderBottom: '1px solid #2E2E2E', padding: '64px 24px 48px', background: '#161616' }}>
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-2 mb-5 flex-wrap">
            {post.tags.map(tag => (
              <span key={tag} style={{
                border: '1px solid rgba(201,168,76,0.3)', color: '#C9A84C',
                fontSize: '0.6rem', padding: '3px 10px', letterSpacing: '0.15em', textTransform: 'uppercase'
              }}>{tag}</span>
            ))}
          </div>
          <h1 style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontFamily: 'var(--font-playfair)',
            color: '#F5F0E8', lineHeight: 1.35, fontWeight: 600, marginBottom: 20
          }}>
            {post.title}
          </h1>
          <div style={{ width: 36, height: 1, background: '#C9A84C', marginBottom: 16 }} />
          <p style={{ color: '#7A7A7A', fontSize: '0.75rem', letterSpacing: '0.2em' }}>
            {formatDateTW(post.date)}
          </p>
        </div>
      </header>

      {post.coverImage && (
        <div className="max-w-3xl mx-auto px-6 mt-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.coverImage} alt={post.title} className="w-full object-cover" style={{ height: 320 }} />
        </div>
      )}

      {/* 文章內容 */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <article className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </div>

      {/* 文章底部聯絡 */}
      <div className="max-w-3xl mx-auto px-6 pb-16">
        <div style={{ borderTop: '1px solid #2E2E2E', paddingTop: 40 }}>
          <div className="flex items-center gap-4 mb-10">
            <div style={{ flex: 1, height: 1, background: '#2E2E2E' }} />
            <span style={{ color: '#C9A84C', fontSize: '0.65rem', letterSpacing: '0.35em', textTransform: 'uppercase' }}>
              群義房屋
            </span>
            <div style={{ flex: 1, height: 1, background: '#2E2E2E' }} />
          </div>

          <div className="text-center p-10" style={{ border: '1px solid #2E2E2E', background: '#161616' }}>
            <p style={{
              color: '#C9A84C', fontSize: '0.7rem', letterSpacing: '0.35em', textTransform: 'uppercase',
              fontFamily: 'var(--font-playfair)', fontStyle: 'italic', marginBottom: 8
            }}>Chyi Real Estate</p>
            <p style={{ color: '#F5F0E8', fontSize: '1rem', fontWeight: 500, marginBottom: 4 }}>
              群義房屋｜雲林雲科加盟店
            </p>
            <p style={{ color: '#7A7A7A', fontSize: '0.875rem', marginBottom: 24 }}>
              📞 05-5362808　📍 雲林縣斗六市中正路312號
            </p>
            <a href="tel:055362808" className="btn-gold">立即諮詢</a>
          </div>
        </div>
      </div>
    </main>
  );
}
