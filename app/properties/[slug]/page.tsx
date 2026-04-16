import { getProperties, getPropertyBySlug, getPropertySlug } from '@/lib/properties';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yunlin-realestate-blog.vercel.app';

export async function generateStaticParams() {
  return getProperties().map((p) => ({ slug: getPropertySlug(p) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getPropertyBySlug(slug);
  if (!p) return {};

  const title = `${p.title}｜${p.price}｜${p.type}｜群義房屋雲林雲科加盟店`;
  const description = `${p.addr}，${p.build_ping ? p.build_ping + '坪' : ''}${p.type}，售價${p.price}。${p.layout}格局，屋齡${p.age}。群義房屋雲林雲科加盟店（05-5362808）免費諮詢。`;
  const canonicalUrl = `${SITE_URL}/properties/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
      locale: 'zh_TW',
      siteName: '群義房屋｜雲林雲科加盟店',
      images: p.img
        ? [{ url: p.img, width: 800, height: 600, alt: p.title }]
        : [{ url: `${SITE_URL}/og-default.jpg`, width: 1200, height: 630 }],
    },
  };
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = getPropertyBySlug(slug);
  if (!p) return notFound();

  const canonicalUrl = `${SITE_URL}/properties/${slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.title,
    description: `${p.addr}，${p.type}，售價${p.price}。${p.layout}格局，屋齡${p.age}。`,
    image: p.img || `${SITE_URL}/og-default.jpg`,
    url: canonicalUrl,
    offers: {
      '@type': 'Offer',
      price: p.price,
      priceCurrency: 'TWD',
      availability: 'https://schema.org/InStock',
    },
    seller: {
      '@type': 'RealEstateAgent',
      name: '群義房屋｜雲林雲科加盟店',
      telephone: '+886-5-5362808',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '中正路312號',
        addressLocality: '斗六市',
        addressRegion: '雲林縣',
        addressCountry: 'TW',
      },
      url: SITE_URL,
    },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '首頁', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: '物件列表', item: `${SITE_URL}/properties` },
      { '@type': 'ListItem', position: 3, name: p.title, item: canonicalUrl },
    ],
  };

  const specs: { label: string; value: string }[] = [
    { label: '地址', value: p.addr },
    { label: '格局', value: p.layout },
    { label: '建坪', value: p.build_ping ? `${p.build_ping}坪` : '－' },
    { label: '地坪', value: p.land_ping ? `${p.land_ping}坪` : '－' },
    { label: '屋齡', value: p.age || '－' },
    { label: '單價', value: p.unit_price || '詳洽' },
    { label: '物件類型', value: p.type },
  ];

  return (
    <main style={{ background: '#FFFFFF', color: '#1A1A1A', minHeight: '100vh' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* 標題區 */}
      <header style={{ background: '#0F4D24', padding: '56px 24px 44px' }}>
        <div className="max-w-4xl mx-auto">
          {/* 麵包屑 */}
          <nav style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', marginBottom: 20, letterSpacing: '0.05em' }}>
            <a href="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>首頁</a>
            <span style={{ margin: '0 8px' }}>›</span>
            <a href="/properties" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>物件列表</a>
            <span style={{ margin: '0 8px' }}>›</span>
            <span style={{ color: 'rgba(255,255,255,0.8)' }}>{p.title}</span>
          </nav>

          {/* 類型 badge */}
          <span style={{
            background: '#CC1122', color: '#FFFFFF',
            fontSize: '0.65rem', padding: '4px 12px', fontWeight: 700,
            letterSpacing: '0.15em', display: 'inline-block', marginBottom: 16,
          }}>
            {p.type}
          </span>

          <h1 style={{
            fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
            color: '#FFFFFF', lineHeight: 1.25, fontWeight: 700, marginBottom: 16,
          }}>
            {p.title}
          </h1>
          <div style={{ width: 36, height: 3, background: '#CC1122', marginBottom: 20 }} />

          {/* 售價大字 */}
          <p style={{ color: '#FFFFFF', fontSize: 'clamp(1.8rem, 5vw, 3rem)', fontWeight: 800, lineHeight: 1 }}>
            {p.price}
          </p>
          {p.unit_price && (
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', marginTop: 6 }}>
              單價 {p.unit_price}
            </p>
          )}
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32 }}>

          {/* 圖片 */}
          {p.img && (
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.img}
                alt={p.title}
                style={{ width: '100%', height: 260, objectFit: 'cover', display: 'block' }}
              />
            </div>
          )}

          {/* 規格表 */}
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F4D24', marginBottom: 16, letterSpacing: '0.05em' }}>
              物件規格
            </h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <tbody>
                {specs.map(({ label, value }) => (
                  <tr key={label} style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <td style={{
                      padding: '10px 12px 10px 0',
                      color: '#6B7280', fontWeight: 600, whiteSpace: 'nowrap', width: '5em',
                    }}>
                      {label}
                    </td>
                    <td style={{ padding: '10px 0', color: '#1A1A1A' }}>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 官網連結 */}
            {p.link && (
              <div style={{ marginTop: 20 }}>
                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    color: '#0F4D24', fontSize: '0.8rem',
                    textDecoration: 'underline', letterSpacing: '0.05em',
                  }}
                >
                  查看官網完整介紹 →
                </a>
              </div>
            )}
          </div>
        </div>

        {/* 聯絡 CTA */}
        <div style={{ background: '#0F4D24', padding: '40px', textAlign: 'center', marginTop: 48 }}>
          <p style={{
            color: '#CC1122', fontSize: '0.65rem', letterSpacing: '0.3em',
            textTransform: 'uppercase', fontWeight: 700, marginBottom: 8,
          }}>
            Chyi Real Estate
          </p>
          <p style={{ color: '#FFFFFF', fontSize: '1.1rem', fontWeight: 700, marginBottom: 4 }}>
            對此物件有興趣？歡迎聯絡我們
          </p>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', marginBottom: 24 }}>
            群義房屋｜雲林雲科加盟店　📞 05-5362808　📍 雲林縣斗六市中正路312號
          </p>
          <a
            href="tel:055362808"
            style={{
              display: 'inline-block',
              background: '#CC1122', color: '#FFFFFF',
              padding: '12px 36px', fontWeight: 700, fontSize: '0.95rem',
              textDecoration: 'none', letterSpacing: '0.1em',
            }}
          >
            立即諮詢
          </a>
        </div>
      </div>
    </main>
  );
}
