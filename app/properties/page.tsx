import { getProperties, getPropertySlug } from '@/lib/properties';
import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yunlin-realestate-blog.vercel.app';

const TYPE_ORDER = ['透天', '土地', '農地', '廠房', '店面', '套房', '大樓'];

const TYPE_COLORS: Record<string, string> = {
  透天: '#0F4D24',
  土地: '#7C5A2A',
  農地: '#4A7C2A',
  廠房: '#1A3A6B',
  店面: '#CC1122',
  套房: '#5A1A6B',
  大樓: '#1A5A6B',
};

export async function generateMetadata(): Promise<Metadata> {
  const properties = getProperties();
  const total = properties.length;
  const title = '雲林房屋物件列表｜透天・土地・農地・廠房｜群義房屋';
  const description = `群義房屋雲林雲科加盟店最新物件，共${total}筆。透天厝、農地、建地、廠房一次查詢。`;
  const canonicalUrl = `${SITE_URL}/properties`;

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
      images: [{ url: `${SITE_URL}/og-default.jpg`, width: 1200, height: 630 }],
    },
  };
}

export default function PropertiesPage() {
  const properties = getProperties();
  const total = properties.length;

  // 按類型分組
  const grouped = properties.reduce<Record<string, typeof properties>>((acc, p) => {
    const key = p.type || '其他';
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {});

  // 排序：依 TYPE_ORDER，其餘排後面
  const sortedTypes = [
    ...TYPE_ORDER.filter((t) => grouped[t]),
    ...Object.keys(grouped).filter((t) => !TYPE_ORDER.includes(t)),
  ];

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '首頁', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: '物件列表', item: `${SITE_URL}/properties` },
    ],
  };

  return (
    <main style={{ background: '#FFFFFF', color: '#1A1A1A', minHeight: '100vh' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* 標題區 */}
      <header style={{ background: '#0F4D24', padding: '56px 24px 44px' }}>
        <div className="max-w-6xl mx-auto">
          <p style={{
            color: '#CC1122', fontSize: '0.65rem', letterSpacing: '0.3em',
            textTransform: 'uppercase', fontWeight: 700, marginBottom: 12,
          }}>
            Property Listings
          </p>
          <h1 style={{
            fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
            color: '#FFFFFF', fontWeight: 700, lineHeight: 1.25, marginBottom: 12,
          }}>
            雲林房屋物件列表
          </h1>
          <div style={{ width: 36, height: 3, background: '#CC1122', marginBottom: 16 }} />
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>
            群義房屋雲林雲科加盟店　最新物件共 <strong style={{ color: '#FFFFFF' }}>{total}</strong> 筆
          </p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {sortedTypes.map((type) => (
          <section key={type} style={{ marginBottom: 56 }}>
            {/* 類型標題 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <span style={{
                background: TYPE_COLORS[type] ?? '#333',
                color: '#FFFFFF', fontSize: '0.7rem', fontWeight: 700,
                padding: '4px 14px', letterSpacing: '0.1em',
              }}>
                {type}
              </span>
              <span style={{ color: '#9CA3AF', fontSize: '0.8rem' }}>
                共 {grouped[type].length} 筆
              </span>
              <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
            </div>

            {/* 物件卡片 grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 24,
            }}>
              {grouped[type].map((p) => (
                <a
                  key={p.no}
                  href={`/properties/${getPropertySlug(p)}`}
                  style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                >
                  <article style={{
                    border: '1px solid #E5E7EB',
                    overflow: 'hidden',
                  }}>
                    {/* 圖片 */}
                    <div style={{ position: 'relative', height: 180, background: '#F3F4F6', overflow: 'hidden' }}>
                      {p.img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.img}
                          alt={p.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                      ) : (
                        <div style={{
                          width: '100%', height: '100%', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                          color: '#9CA3AF', fontSize: '0.8rem',
                        }}>
                          暫無圖片
                        </div>
                      )}
                      {/* 類型 badge */}
                      <span style={{
                        position: 'absolute', top: 10, left: 10,
                        background: TYPE_COLORS[type] ?? '#333',
                        color: '#FFFFFF', fontSize: '0.6rem',
                        padding: '3px 8px', fontWeight: 700, letterSpacing: '0.1em',
                      }}>
                        {p.type}
                      </span>
                    </div>

                    {/* 內容 */}
                    <div style={{ padding: '16px 18px' }}>
                      <h2 style={{
                        fontSize: '0.95rem', fontWeight: 700, color: '#111827',
                        marginBottom: 6, lineHeight: 1.4,
                        display: '-webkit-box', WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      }}>
                        {p.title}
                      </h2>
                      <p style={{ color: '#CC1122', fontSize: '1.15rem', fontWeight: 800, marginBottom: 6 }}>
                        {p.price}
                      </p>
                      <p style={{ color: '#6B7280', fontSize: '0.78rem', marginBottom: 0 }}>
                        📍 {p.addr}
                      </p>
                      {p.build_ping && (
                        <p style={{ color: '#9CA3AF', fontSize: '0.75rem', marginTop: 4 }}>
                          建坪 {p.build_ping}坪　{p.layout}
                        </p>
                      )}
                    </div>
                  </article>
                </a>
              ))}
            </div>
          </section>
        ))}

        {/* 底部聯絡 */}
        <div style={{ background: '#0F4D24', padding: '40px', textAlign: 'center', marginTop: 16 }}>
          <p style={{
            color: '#CC1122', fontSize: '0.65rem', letterSpacing: '0.3em',
            textTransform: 'uppercase', fontWeight: 700, marginBottom: 8,
          }}>
            Chyi Real Estate
          </p>
          <p style={{ color: '#FFFFFF', fontSize: '1rem', fontWeight: 700, marginBottom: 4 }}>
            群義房屋｜雲林雲科加盟店
          </p>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', marginBottom: 24 }}>
            📞 05-5362808　📍 雲林縣斗六市中正路312號
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
            免費諮詢
          </a>
        </div>
      </div>
    </main>
  );
}
