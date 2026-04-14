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

  // JSON-LD Article Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    url: canonicalUrl,
    image: post.coverImage || `${SITE_URL}/og-default.jpg`,
    author: {
      '@type': 'Organization',
      name: '群義房屋｜雲林雲科加盟店',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: '群義房屋｜雲林雲科加盟店',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
  };

  return (
    <main className="max-w-3xl mx-auto py-16 px-6">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mb-8">
        <div className="flex gap-2 mb-3 flex-wrap">
          {post.tags.map((tag) => (
            <span key={tag} className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">{tag}</span>
          ))}
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">{post.title}</h1>
        <p className="text-gray-500 text-sm">{formatDateTW(post.date)}</p>
      </div>

      {post.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.coverImage} alt={post.title} className="w-full h-64 object-cover rounded-2xl mb-10" />
      )}

      <article
        className="prose prose-gray prose-headings:font-bold prose-a:text-amber-600 max-w-none"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />

      <div className="mt-16 pt-8 border-t border-gray-100 text-center text-gray-500 text-sm">
        <p className="font-semibold text-gray-700 mb-1">群義房屋｜雲林雲科加盟店</p>
        <p>📞 05-5362808　📍 雲林縣斗六市中正路312號</p>
      </div>
    </main>
  );
}
