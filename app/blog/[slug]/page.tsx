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
    '@context': 'https://schema.org',
    '@type': ['NewsArticle', 'BlogPosting'],
    headline: post.title,
    description: post.description,
    datePublished: post.date ? `${post.date}T08:00:00+08:00` : new Date().toISOString(),
    dateModified: post.date ? `${post.date}T08:00:00+08:00` : new Date().toISOString(),
    url: canonicalUrl,
    image: {
      '@type': 'ImageObject',
      url: post.coverImage || `${SITE_URL}/images/storefront.jpg`,
      width: 1200,
      height: 630,
    },
    author: {
      '@type': 'Organization',
      name: '群義房屋｜雲林雲科加盟店',
      url: SITE_URL,
      telephone: '+886-5-5362808',
      address: { '@type': 'PostalAddress', addressLocality: '斗六市', addressRegion: '雲林縣', addressCountry: 'TW' },
    },
    publisher: {
      '@type': 'Organization',
      name: '群義房屋｜雲林雲科加盟店',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/images/logo-chyi.png`, width: 200, height: 68 },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
    inLanguage: 'zh-TW',
    keywords: post.tags.join(', '),
    articleSection: '雲林房市',
    about: { '@type': 'Thing', name: '雲林房地產' },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '首頁', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: '房市專欄', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: canonicalUrl },
    ],
  };

  return (
    <main style={{ background: '#FFFFFF', color: '#1A1A1A', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* 標題區 */}
      <header style={{ background: '#0F4D24', padding: '56px 24px 44px' }}>
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-2 mb-5 flex-wrap">
            {post.tags.map(tag => (
              <span key={tag} style={{
                background: 'rgba(255,255,255,0.12)', color: '#FFFFFF',
                fontSize: '0.6rem', padding: '3px 10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase'
              }}>{tag}</span>
            ))}
          </div>
          <h1 style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontFamily: 'var(--font-playfair)',
            color: '#FFFFFF', lineHeight: 1.3, fontWeight: 700, marginBottom: 16
          }}>
            {post.title}
          </h1>
          <div style={{ width: 36, height: 3, background: '#CC1122', marginBottom: 16 }} />
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
            {formatDateTW(post.date)}
          </p>
        </div>
      </header>

      {/* 封面圖 */}
      {post.coverImage && (
        <div className="max-w-3xl mx-auto px-6 mt-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.coverImage} alt={post.title} className="w-full object-cover" style={{ height: 320 }} />
        </div>
      )}

      {/* 文章內容 */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <article className="prose prose-xl max-w-none" dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </div>

      {/* 底部聯絡框 */}
      <div className="max-w-3xl mx-auto px-6 pb-16">
        <div style={{ background: '#0F4D24', padding: '40px', textAlign: 'center' }}>
          <p style={{
            color: '#CC1122', fontSize: '0.65rem', letterSpacing: '0.3em',
            textTransform: 'uppercase', fontWeight: 700, marginBottom: 8
          }}>Chyi Real Estate</p>
          <p style={{ color: '#FFFFFF', fontSize: '1rem', fontWeight: 700, marginBottom: 4 }}>
            群義房屋｜雲林雲科加盟店
          </p>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', marginBottom: 24 }}>
            📞 05-5362808　📍 雲林縣斗六市中正路312號
          </p>
          <a href="tel:055362808" className="btn-red">立即諮詢</a>
        </div>
      </div>
    </main>
  );
}
