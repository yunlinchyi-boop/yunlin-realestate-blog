'use client';

const FEATURED = [
  {
    emoji: '👑',
    title: '雲科透天金店面',
    subtitle: '5房2廳6衛・54.88坪',
    price: '1,950萬',
    link: 'https://www.chyi.com.tw/sell_item/2594-917645W/?storeid=4759',
    img: 'https://app.chyi.com.tw/images/sell/115/917645W_obj_256_17761495541821.jpg',
    accentColor: '#CC1122',
    sellingPoints: [
      '🏫 雲科大商圈核心，人流旺盛',
      '🏪 一樓可開店，自住出租兩相宜',
      '🚗 近市場・交通便利，生活機能滿分',
      '💰 35.5萬/坪，雲林首選投資標的',
    ],
  },
  {
    emoji: '🏠',
    title: '斗六公誠學區透天',
    subtitle: '7房3廳2衛・25.3坪',
    price: '688萬',
    link: 'https://www.chyi.com.tw/sell_item/2594-421011N/?storeid=4759',
    img: 'https://app.chyi.com.tw/images/sell/114/421011N_obj_256_17512637370787.jpg',
    accentColor: '#1A6B35',
    sellingPoints: [
      '🎓 公誠國小學區，教育資源優質',
      '🏠 7房超大格局，三代同堂首選',
      '💸 688萬實惠入手，斗六市區難得',
      '📍 生活機能完整，鄰近學校市場',
    ],
  },
  {
    emoji: '🌳',
    title: '古坑雙面路香蕉園農地',
    subtitle: '土地・古坑鄉雙面臨路',
    price: '438萬',
    link: 'https://www.chyi.com.tw/sell_item/2594-653470T/?storeid=4759',
    img: 'https://app.chyi.com.tw/images/sell/114/653470T_obj_256_17478077864722.jpg',
    accentColor: '#8B6914',
    sellingPoints: [
      '🛣️ 雙面臨路，出入方便進出零阻礙',
      '🍌 現況香蕉園，農耕立即可用',
      '🏡 古坑精華地段，景觀與投資兼具',
      '🔑 農地稀缺，早買早安心',
    ],
  },
];

export default function FeaturedWeeklySection() {
  return (
    <section style={{ background: '#FFFDF7', padding: '72px 24px', borderTop: '1px solid #E5E5E5' }}>
      <div className="max-w-6xl mx-auto">

        {/* 標題 */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ width: 4, height: 24, background: '#CC1122' }} />
            <p style={{ color: '#CC1122', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 700 }}>
              Hot Picks This Week
            </p>
          </div>
          <h2 style={{ color: '#1A1A1A', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '0.05em' }}>
            本週熱門精選 ✨
          </h2>
          <p style={{ color: '#767676', fontSize: '0.75rem', marginTop: 4 }}>
            斗六黃金物件精選・免費帶看・不推銷
          </p>
        </div>

        {/* 物件卡片 */}
        <div className="flex flex-col gap-6">
          {FEATURED.map((item, idx) => (
            <a
              key={idx}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'block', textDecoration: 'none' }}
            >
              <div style={{
                background: '#FFFFFF',
                border: '1px solid #E5E5E5',
                overflow: 'hidden',
                transition: 'box-shadow 0.25s ease, transform 0.25s ease',
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                }}
              >
                {/* 頂部色條 */}
                <div style={{ height: 4, background: item.accentColor }} />

                <div className="md:flex">
                  {/* 照片 */}
                  <div style={{ flexShrink: 0, width: '100%', maxWidth: 260 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.img}
                      alt={item.title}
                      style={{ width: '100%', height: 190, objectFit: 'cover', display: 'block' }}
                    />
                  </div>

                  {/* 內容 */}
                  <div style={{ flex: 1, padding: '22px 28px' }}>
                    {/* 標題 + 價格 */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
                      <div>
                        <h3 style={{ color: '#1A1A1A', fontWeight: 700, fontSize: '1.15rem', marginBottom: 3 }}>
                          {item.emoji} {item.title}
                        </h3>
                        <p style={{ color: '#767676', fontSize: '0.8rem' }}>{item.subtitle}</p>
                      </div>
                      <span style={{
                        background: '#CC1122', color: '#FFFFFF',
                        fontWeight: 800, fontSize: '1.15rem',
                        padding: '4px 14px', letterSpacing: '0.02em', flexShrink: 0,
                      }}>
                        {item.price}
                      </span>
                    </div>

                    {/* 核心賣點 */}
                    <div style={{ marginBottom: 18 }}>
                      <p style={{ color: '#AAAAAA', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 10 }}>
                        核心賣點
                      </p>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '5px 16px' }}>
                        {item.sellingPoints.map((pt, j) => (
                          <li key={j} style={{ color: '#333', fontSize: '0.875rem', lineHeight: 1.6 }}>{pt}</li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA */}
                    <div style={{
                      display: 'inline-block',
                      background: item.accentColor, color: '#FFFFFF',
                      padding: '8px 22px', fontSize: '0.82rem', fontWeight: 700,
                      letterSpacing: '0.05em',
                    }}>
                      查看完整物件 →
                    </div>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
