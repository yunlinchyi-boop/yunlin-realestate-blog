import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yunlin-realestate-blog.vercel.app';
const PAGE_URL = `${SITE_URL}/guides/yunlin-farmland`;

export const metadata: Metadata = {
  title: '雲林農地購買完全指南（2025年）｜地目、法規、注意事項｜群義房屋',
  description: '購買雲林農地前必看！地目查詢、農用規定、農舍興建條件、投資報酬分析。群義房屋雲科加盟店免費諮詢 05-5362808。',
  keywords: ['雲林農地', '斗六農地', '農地購買', '農地農用', '農舍申請', '雲林土地買賣'],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: '雲林農地購買完全指南（2025年）｜群義房屋',
    description: '購買雲林農地前必看！地目查詢、農用規定、農舍興建條件、投資報酬分析。',
    url: PAGE_URL,
    type: 'article',
    locale: 'zh_TW',
    siteName: '群義房屋｜雲林雲科加盟店',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: '雲林農地購買完全指南（2025年）｜地目、法規、注意事項',
  description: '購買雲林農地前必看！地目查詢、農用規定、農舍興建條件、投資報酬分析。群義房屋雲科加盟店免費諮詢 05-5362808。',
  url: PAGE_URL,
  datePublished: '2025-01-01',
  dateModified: '2025-06-01',
  author: {
    '@type': 'Organization',
    name: '群義房屋｜雲林雲科加盟店',
    url: SITE_URL,
    telephone: '+886-5-5362808',
    address: {
      '@type': 'PostalAddress',
      addressLocality: '斗六市',
      addressRegion: '雲林縣',
      addressCountry: 'TW',
    },
  },
  publisher: {
    '@type': 'Organization',
    name: '群義房屋｜雲林雲科加盟店',
    logo: { '@type': 'ImageObject', url: `${SITE_URL}/images/logo-chyi.png` },
  },
  mainEntityOfPage: { '@type': 'WebPage', '@id': PAGE_URL },
};

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: '首頁', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: '購屋指南', item: `${SITE_URL}/guides` },
    { '@type': 'ListItem', position: 3, name: '雲林農地購買完全指南', item: PAGE_URL },
  ],
};

export default function YunlinFarmlandGuidePage() {
  return (
    <main style={{ background: '#FFFFFF', color: '#1A1A1A', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* Hero 標題區 */}
      <header style={{ background: '#0F4D24', padding: '64px 24px 52px' }}>
        <div className="max-w-3xl mx-auto">
          <p style={{
            color: '#CC1122', fontSize: '0.65rem', letterSpacing: '0.3em',
            textTransform: 'uppercase', fontWeight: 700, marginBottom: 12
          }}>農地指南 · 2025年版</p>
          <h1 style={{
            fontSize: 'clamp(1.6rem, 4.5vw, 2.4rem)',
            color: '#FFFFFF', lineHeight: 1.25, fontWeight: 700, marginBottom: 16
          }}>
            雲林農地購買完全指南
          </h1>
          <div style={{ width: 36, height: 3, background: '#CC1122', marginBottom: 20 }} />
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', lineHeight: 1.7, maxWidth: 600 }}>
            地目查詢 × 農用法規 × 農舍條件 × 各鄉鎮行情，購買雲林農地前必讀完整指南。
            群義房屋雲科加盟店提供免費農地諮詢服務。
          </p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-12" style={{ lineHeight: 1.85 }}>

        {/* Section 1：農地購買前必知 */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{
            fontSize: '1.35rem', fontWeight: 700, color: '#0F4D24',
            borderLeft: '4px solid #CC1122', paddingLeft: 14, marginBottom: 16
          }}>農地購買前必知：地目與使用分區</h2>
          <p style={{ marginBottom: 16 }}>
            購買雲林農地前，最重要的第一步是確認「地目」與「使用分區」。台灣土地依《區域計畫法》劃分為不同使用分區，
            農地管制規定嚴格，若未事先查明，可能購入後無法如預期使用。
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 20 }}>
            {[
              { title: '田', desc: '最常見農地地目，適合水稻、蔬菜等農作物耕種，不可隨意變更使用。', tag: '農業區' },
              { title: '旱', desc: '旱作農地，適合玉米、甘蔗、果樹等旱地作物。法規規定與「田」相似。', tag: '農業區' },
              { title: '林', desc: '林業用地，以種植林木為主，申請農舍條件與一般農地不同。', tag: '林業區' },
              { title: '建', desc: '已編定建築用地，可依規定申請建築執照，與農地性質完全不同。', tag: '可建地' },
            ].map((item) => (
              <div key={item.title} style={{
                border: '1px solid #E5E5E0', padding: '16px', background: '#FAFAF8'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{
                    background: '#0F4D24', color: '#FFFFFF', padding: '2px 10px',
                    fontWeight: 700, fontSize: '1rem'
                  }}>{item.title}</span>
                  <span style={{
                    background: item.tag === '可建地' ? '#CC1122' : '#888',
                    color: '#FFFFFF', fontSize: '0.65rem', padding: '2px 8px', fontWeight: 600
                  }}>{item.tag}</span>
                </div>
                <p style={{ fontSize: '0.88rem', color: '#555', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ background: '#FFF8F8', border: '1px solid #FFCDD0', padding: '14px 18px' }}>
            <p style={{ fontWeight: 700, color: '#CC1122', marginBottom: 6, fontSize: '0.9rem' }}>
              查詢方式
            </p>
            <p style={{ fontSize: '0.88rem', color: '#555', lineHeight: 1.7 }}>
              至內政部「不動產說明書應記載事項」查詢，或前往雲林縣地政事務所調閱地籍資料。
              也可透過「國土規劃地理資訊系統」（geoagri.ntu.edu.tw）線上查詢使用分區及編定地目。
            </p>
          </div>
        </section>

        {/* Section 2：農用規定 */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{
            fontSize: '1.35rem', fontWeight: 700, color: '#0F4D24',
            borderLeft: '4px solid #CC1122', paddingLeft: 14, marginBottom: 16
          }}>農地農用規定（2025年現行法規）</h2>
          <p style={{ marginBottom: 16 }}>
            依《農業發展條例》第31條規定，農業用地不得作非農業使用。私法人原則不得承受農地，
            且受讓農地後須確實農業經營，違者地政機關得限期改善或強制徵收。
          </p>
          <ul style={{ paddingLeft: 20, lineHeight: 2.1, color: '#444', marginBottom: 16 }}>
            <li>農地不得興建一般住宅（無農民身份者不得建農舍）</li>
            <li>農地不得變更為停車場、廠房、倉庫等非農業設施（未取得許可）</li>
            <li>若作物無明顯農業使用跡象，可能遭縣政府認定違規並開罰</li>
            <li>移轉後30日內需向農業主管機關申報，並承諾農業使用</li>
          </ul>
          <div style={{ background: '#F0F7F2', border: '1px solid #B7D9C2', padding: '14px 18px' }}>
            <p style={{ fontWeight: 700, color: '#0F4D24', marginBottom: 6, fontSize: '0.9rem' }}>
              實務建議
            </p>
            <p style={{ fontSize: '0.88rem', color: '#555', lineHeight: 1.7 }}>
              購地後若短期未能耕作，至少維持土地整潔、種植少量作物或綠肥，避免被認定閒置荒廢。
              建議與當地農民合作代耕，確保農用紀錄完整。
            </p>
          </div>
        </section>

        {/* Section 3：農舍興建條件 */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{
            fontSize: '1.35rem', fontWeight: 700, color: '#0F4D24',
            borderLeft: '4px solid #CC1122', paddingLeft: 14, marginBottom: 16
          }}>農舍興建條件（5大要件）</h2>
          <p style={{ marginBottom: 20 }}>
            許多人買農地是為了蓋農舍自住，但農舍申請條件嚴格，須同時符合以下要件：
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              { num: '01', title: '申請人須具農民身份', desc: '需持有農保（農民健康保險）資格，或能提出實際農業經營的佐證（農業收入、農地使用紀錄等）。' },
              { num: '02', title: '農地面積達0.25公頃以上', desc: '申請興建農舍的農地面積須在2,500平方公尺（約756坪）以上。部分縣市要求更高，雲林縣依各鄉鎮主計畫規定。' },
              { num: '03', title: '取得農地已滿2年', desc: '申請人持有該筆農地須滿2年（730天以上），且申請農舍期間農地須持續農業使用。' },
              { num: '04', title: '農舍面積限制', desc: '農舍建築面積不得超過農地面積的10%（且最高以660平方公尺為上限），地板面積合計最高330平方公尺。' },
              { num: '05', title: '農舍不得移轉分割', desc: '農舍與其坐落農地不得分離移轉或出租，出售農舍時農地必須一同移轉給同一買受人。' },
            ].map((item, i) => (
              <div key={item.num} style={{
                display: 'flex', gap: 0,
                borderBottom: i < 4 ? '1px solid #E5E5E0' : 'none'
              }}>
                <div style={{
                  background: i % 2 === 0 ? '#0F4D24' : '#1A6B35',
                  color: '#FFFFFF', padding: '16px 18px', fontWeight: 700,
                  fontSize: '1.1rem', minWidth: 56, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>{item.num}</div>
                <div style={{ padding: '16px 20px' }}>
                  <p style={{ fontWeight: 700, marginBottom: 4, fontSize: '0.95rem' }}>{item.title}</p>
                  <p style={{ color: '#555', fontSize: '0.88rem', lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4：注意事項清單 */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{
            fontSize: '1.35rem', fontWeight: 700, color: '#0F4D24',
            borderLeft: '4px solid #CC1122', paddingLeft: 14, marginBottom: 16
          }}>購買前必查注意事項</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {[
              { icon: '🔍', title: '土壤污染查詢', desc: '至環保署「土壤及地下水污染整治網」查詢是否列管污染場址，農地如有污染將影響農用資格與轉讓。' },
              { icon: '💧', title: '灌溉水源確認', desc: '確認農地是否有農田水利會渠道灌溉，或需自行抽水。水源穩定性影響農地農用可行性及價值。' },
              { icon: '🛣️', title: '臨路寬度與地籍線', desc: '確認農地是否臨公路（計畫道路或現有道路），道路寬度影響農舍可否申請建照。建議調閱地籍圖確認。' },
              { icon: '📋', title: '現況地上物', desc: '勘查農地現況，確認是否有未申報違建、舊農舍、電塔、管線等地上物，避免日後產生糾紛。' },
              { icon: '⚡', title: '電力牽引可行性', desc: '農舍需申請用電，確認台電幹線距農地距離，距離過遠可能需負擔高額牽線費用。' },
              { icon: '📍', title: '地籍分割線與坡度', desc: '確認農地實際形狀與坡度，不規則地形或坡地農地在施工及農業使用上均受限制。' },
            ].map((item) => (
              <div key={item.title} style={{
                border: '1px solid #E5E5E0', padding: '16px 18px', background: '#FAFAF8'
              }}>
                <p style={{ fontSize: '1.3rem', marginBottom: 8 }}>{item.icon}</p>
                <p style={{ fontWeight: 700, marginBottom: 6, fontSize: '0.92rem', color: '#1A1A1A' }}>{item.title}</p>
                <p style={{ fontSize: '0.85rem', color: '#555', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5：雲林農地行情 */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{
            fontSize: '1.35rem', fontWeight: 700, color: '#0F4D24',
            borderLeft: '4px solid #CC1122', paddingLeft: 14, marginBottom: 20
          }}>雲林各鄉鎮農地行情（2025年參考）</h2>
          <p style={{ marginBottom: 16 }}>
            雲林縣農地因地段、地目、臨路條件不同，行情差異顯著。以下為各主要鄉鎮參考行情：
          </p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: '#0F4D24', color: '#FFFFFF' }}>
                  <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600 }}>鄉鎮</th>
                  <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600 }}>地段特色</th>
                  <th style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 600 }}>農地行情／坪</th>
                  <th style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 600 }}>投資熱度</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { area: '古坑鄉', desc: '山區咖啡產業帶動，觀光農業發展成熟', price: '3萬～8萬', heat: '★★★★' },
                  { area: '林內鄉', desc: '台3線沿線交通便利，平地農地面積大', price: '2萬～6萬', heat: '★★★' },
                  { area: '莿桐鄉', desc: '平原農業區，傳統水稻產區，地形平整', price: '1.5萬～4萬', heat: '★★' },
                  { area: '西螺鎮', desc: '濁水溪流域沃土，蔬菜主產區，鄰近交流道', price: '2.5萬～6萬', heat: '★★★' },
                  { area: '斗六市郊', desc: '縣治邊緣農地，未來開發潛力受矚目', price: '4萬～12萬', heat: '★★★★' },
                ].map((row, i) => (
                  <tr key={row.area} style={{ background: i % 2 === 0 ? '#F9F9F6' : '#FFFFFF', verticalAlign: 'top' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0F4D24', whiteSpace: 'nowrap' }}>{row.area}</td>
                    <td style={{ padding: '12px 14px', color: '#444' }}>{row.desc}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 600, color: '#CC1122', whiteSpace: 'nowrap' }}>{row.price}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'center', color: '#888' }}>{row.heat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#888', marginTop: 10 }}>
            ※ 以上行情參考 2024–2025 年成交資料，實際價格依地目、臨路、面積等條件差異甚大。
          </p>
        </section>

        {/* Section 6：常見問題 */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{
            fontSize: '1.35rem', fontWeight: 700, color: '#0F4D24',
            borderLeft: '4px solid #CC1122', paddingLeft: 14, marginBottom: 20
          }}>農地購買常見問題</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              {
                q: '沒有農民身份可以買農地嗎？',
                a: '自然人（個人）可以購買農地，但無農民身份者不得申請興建農舍。購入後仍須符合農業使用規定，違規使用可能被罰款或強制改善。公司法人原則上不得購買農地。'
              },
              {
                q: '買農地可以當投資嗎？',
                a: '農地長期增值潛力視地點而定，尤其位於縣市邊界或開發計畫周邊的農地，未來若調整使用分區，地價可大幅增加。但農地移轉後須持有一定年限才能再轉售，且必須確保農業使用。'
              },
              {
                q: '農地可以種太陽能板嗎？',
                a: '農地上設置農業用光電設施（農電共生）有嚴格條件限制，需申請農業主管機關核准，且農地須持續種植作物，不可完全遮蔽。相關規定持續更新，建議購買前諮詢主管機關或在地專業仲介。'
              },
              {
                q: '農地的貸款成數比一般房地產低？',
                a: '是的。農地（非建地）銀行貸款成數通常較低，約五至七成，且利率可能略高於建地房貸。建議購買前先向合作銀行詢問可貸成數，並準備足夠自備款。'
              },
              {
                q: '雲林農地交易稅費如何計算？',
                a: '農地移轉主要稅費：土地增值稅（自用農地依法減免，但需符合農用條件）、代書費（約1.5萬～2.5萬）、地政規費（土地面積×公告地價×0.1%）。農地移轉若符合農用免徵土地增值稅規定，可節省大筆稅費。'
              },
            ].map((item) => (
              <details key={item.q} style={{
                border: '1px solid #E5E5E0', padding: '0', cursor: 'pointer'
              }}>
                <summary style={{
                  padding: '14px 18px', fontWeight: 600, fontSize: '0.95rem',
                  listStyle: 'none', display: 'flex', justifyContent: 'space-between',
                  color: '#1A1A1A', userSelect: 'none'
                }}>
                  {item.q}
                  <span style={{ color: '#CC1122', fontWeight: 700, marginLeft: 12, flexShrink: 0 }}>＋</span>
                </summary>
                <div style={{ padding: '0 18px 16px', color: '#555', fontSize: '0.9rem', lineHeight: 1.8 }}>
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </section>

      </div>

      {/* 底部聯絡 CTA */}
      <div className="max-w-3xl mx-auto px-6 pb-16">
        <div style={{ background: '#0F4D24', padding: '40px', textAlign: 'center' }}>
          <p style={{
            color: '#CC1122', fontSize: '0.65rem', letterSpacing: '0.3em',
            textTransform: 'uppercase', fontWeight: 700, marginBottom: 8
          }}>農地專業諮詢 · 免費服務</p>
          <p style={{ color: '#FFFFFF', fontSize: '1.1rem', fontWeight: 700, marginBottom: 6 }}>
            有農地購買需求？讓專業在地仲介為您評估
          </p>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', marginBottom: 28 }}>
            群義房屋｜雲林雲科加盟店<br />
            📞 05-5362808　📍 雲林縣斗六市中正路312號
          </p>
          <a href="tel:055362808" style={{
            display: 'inline-block', background: '#CC1122', color: '#FFFFFF',
            padding: '12px 36px', fontWeight: 700, fontSize: '0.95rem',
            textDecoration: 'none', letterSpacing: '0.05em'
          }}>立即免費諮詢</a>
        </div>
      </div>
    </main>
  );
}
