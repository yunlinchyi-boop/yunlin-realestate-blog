import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yunlin-realestate-blog.vercel.app';
const PAGE_URL = `${SITE_URL}/guides/douliou`;

export const metadata: Metadata = {
  title: '斗六買房完全指南（2025年）｜行情、區域、流程一次搞懂｜群義房屋',
  description: '斗六買房最完整指南！各區域行情分析、購屋流程、農地注意事項、貸款試算。群義房屋雲科加盟店在地10年，免費諮詢 05-5362808。',
  keywords: ['斗六買房', '斗六房價', '斗六透天', '斗六房仲', '雲林買房', '斗六中正路房屋'],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: '斗六買房完全指南（2025年）｜群義房屋',
    description: '斗六買房最完整指南！各區域行情分析、購屋流程、農地注意事項、貸款試算。',
    url: PAGE_URL,
    type: 'article',
    locale: 'zh_TW',
    siteName: '群義房屋｜雲林雲科加盟店',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: '斗六買房完全指南（2025年）｜行情、區域、流程一次搞懂',
  description: '斗六買房最完整指南！各區域行情分析、購屋流程、農地注意事項、貸款試算。群義房屋雲科加盟店在地10年，免費諮詢 05-5362808。',
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
    { '@type': 'ListItem', position: 3, name: '斗六買房完全指南', item: PAGE_URL },
  ],
};

export default function DouliouGuidePage() {
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
          }}>購屋指南 · 2025年版</p>
          <h1 style={{
            fontSize: 'clamp(1.6rem, 4.5vw, 2.4rem)',
            color: '#FFFFFF', lineHeight: 1.25, fontWeight: 700, marginBottom: 16
          }}>
            斗六買房完全指南
          </h1>
          <div style={{ width: 36, height: 3, background: '#CC1122', marginBottom: 20 }} />
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', lineHeight: 1.7, maxWidth: 600 }}>
            行情分析 × 區域比較 × 購屋流程 × 貸款試算，一次搞懂斗六買房眉角。
            群義房屋雲科加盟店在地深耕10年，提供免費諮詢服務。
          </p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-12" style={{ lineHeight: 1.85 }}>

        {/* Section 1：斗六房市概況 */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{
            fontSize: '1.35rem', fontWeight: 700, color: '#0F4D24',
            borderLeft: '4px solid #CC1122', paddingLeft: 14, marginBottom: 16
          }}>斗六房市現況（2025年）</h2>
          <p style={{ marginBottom: 16 }}>
            斗六市是雲林縣的縣治所在，近年因雲林科技大學帶動的雲科周邊開發，以及社口重劃區持續推進，房市熱度明顯回升。
            相較於台中、台南等大城市，斗六房價仍屬相對親民，是許多在地首購族與返鄉族群的首選。
          </p>
          <p style={{ marginBottom: 16 }}>
            根據 2024–2025 年實價登錄資料，斗六市透天厝成交行情約落在 <strong style={{ color: '#CC1122' }}>600萬～1,800萬</strong> 之間，
            視區域、屋齡與地坪大小而有明顯差異。土地行情則因地段不同，從每坪5萬到25萬以上皆有。
          </p>
        </section>

        {/* Section 2：各區行情表格 */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{
            fontSize: '1.35rem', fontWeight: 700, color: '#0F4D24',
            borderLeft: '4px solid #CC1122', paddingLeft: 14, marginBottom: 20
          }}>斗六各區行情比較</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem'
            }}>
              <thead>
                <tr style={{ background: '#0F4D24', color: '#FFFFFF' }}>
                  <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600 }}>區域</th>
                  <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600 }}>地段特色</th>
                  <th style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 600 }}>透天行情</th>
                  <th style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 600 }}>土地／坪</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    area: '斗六市中心', desc: '中正路商圈、交通便利、生活機能完整',
                    house: '900萬～1,800萬', land: '15萬～25萬'
                  },
                  {
                    area: '雲科大周邊', desc: '大學城聚落、租金回報穩定、出租需求高',
                    house: '700萬～1,200萬', land: '10萬～18萬'
                  },
                  {
                    area: '社口重劃區', desc: '新開發重劃、道路寬整、建案品質較新',
                    house: '800萬～1,400萬', land: '12萬～20萬'
                  },
                  {
                    area: '斗南∕虎尾（鄰近）', desc: '價格實惠、生活圈自成體系、縣道串聯便捷',
                    house: '600萬～1,000萬', land: '5萬～12萬'
                  },
                ].map((row, i) => (
                  <tr key={row.area} style={{ background: i % 2 === 0 ? '#F9F9F6' : '#FFFFFF', verticalAlign: 'top' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0F4D24', whiteSpace: 'nowrap' }}>{row.area}</td>
                    <td style={{ padding: '12px 14px', color: '#444' }}>{row.desc}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 600, color: '#CC1122' }}>{row.house}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'center', color: '#555' }}>{row.land}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#888', marginTop: 10 }}>
            ※ 以上行情參考 2024–2025 年實價登錄，實際成交依物件條件而異，建議諮詢在地仲介確認。
          </p>
        </section>

        {/* Section 3：購屋流程 */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{
            fontSize: '1.35rem', fontWeight: 700, color: '#0F4D24',
            borderLeft: '4px solid #CC1122', paddingLeft: 14, marginBottom: 20
          }}>購屋完整流程（5大步驟）</h2>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {[
              { step: '1', title: '確認購屋預算', desc: '評估自備款（建議20%以上）、每月可負擔房貸金額、稅費成本（契稅、印花稅、代書費等）。建議先跑銀行預審，確認可貸額度。' },
              { step: '2', title: '鎖定區域看物件', desc: '依生活機能需求（學區、工作地點、交通）選定區域，委託在地仲介媒合。看屋時注意屋齡、格局、地坪、建蔽率、使用分區。' },
              { step: '3', title: '出價議價與簽約', desc: '確認心儀物件後，透過仲介提出斡旋或要約，雙方合意後簽訂「不動產買賣契約書」，並支付定金（通常總價1%～5%）。' },
              { step: '4', title: '辦理房貸', desc: '契約簽訂後30日內送件申請房貸。準備資料：身分證、所得證明、存摺影本、買賣契約書。建議貨比三家、比較利率與寬限期條件。' },
              { step: '5', title: '完稅過戶交屋', desc: '銀行核貸後，由代書辦理增值稅、契稅完稅，至地政事務所辦理所有權移轉登記。過戶完成後交屋、領鑰匙。' },
            ].map((item) => (
              <li key={item.step} style={{ display: 'flex', gap: 20, marginBottom: 24, alignItems: 'flex-start' }}>
                <div style={{
                  minWidth: 40, height: 40, background: '#0F4D24', color: '#FFFFFF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '1.1rem', flexShrink: 0
                }}>{item.step}</div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 6, color: '#1A1A1A' }}>{item.title}</p>
                  <p style={{ color: '#555', fontSize: '0.95rem' }}>{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Section 4：貸款試算 */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{
            fontSize: '1.35rem', fontWeight: 700, color: '#0F4D24',
            borderLeft: '4px solid #CC1122', paddingLeft: 14, marginBottom: 20
          }}>首購族貸款試算（青安 vs 一般房貸）</h2>
          <p style={{ marginBottom: 16 }}>
            以斗六透天 <strong>900萬</strong>、自備款180萬（20%）、貸款720萬為例：
          </p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: '#0F4D24', color: '#FFFFFF' }}>
                  <th style={{ padding: '11px 14px', textAlign: 'left' }}>項目</th>
                  <th style={{ padding: '11px 14px', textAlign: 'center' }}>青年安心成家（青安）</th>
                  <th style={{ padding: '11px 14px', textAlign: 'center' }}>一般房貸</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: '利率（參考）', blue: '約 2.0%（浮動）', normal: '約 2.1%～2.5%（固定/浮動）' },
                  { label: '最高貸款成數', blue: '最高八成', normal: '七～八成（依銀行）' },
                  { label: '寬限期', blue: '最長3年（利息期）', normal: '0～3年（依銀行）' },
                  { label: '月繳金額（寬限期內）', blue: '約 12,000 元', normal: '約 12,600 元' },
                  { label: '月繳金額（本息攤還）', blue: '約 26,700 元', normal: '約 27,500 元' },
                  { label: '適合對象', blue: '首購、無自有住宅', normal: '一般購屋、換屋族' },
                ].map((row, i) => (
                  <tr key={row.label} style={{ background: i % 2 === 0 ? '#F9F9F6' : '#FFFFFF' }}>
                    <td style={{ padding: '11px 14px', fontWeight: 600, color: '#333' }}>{row.label}</td>
                    <td style={{ padding: '11px 14px', textAlign: 'center', color: '#0F4D24', fontWeight: 600 }}>{row.blue}</td>
                    <td style={{ padding: '11px 14px', textAlign: 'center', color: '#555' }}>{row.normal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#888', marginTop: 10 }}>
            ※ 以上試算為參考值，實際利率依銀行核定及市場利率調整。青安申請條件請洽各銀行或群義房屋專員確認。
          </p>
        </section>

        {/* Section 5：常見問題 */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{
            fontSize: '1.35rem', fontWeight: 700, color: '#0F4D24',
            borderLeft: '4px solid #CC1122', paddingLeft: 14, marginBottom: 20
          }}>斗六買房常見問題</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              {
                q: '斗六透天和公寓哪個比較值得買？',
                a: '斗六以透天厝為主流物件，土地持分完整、增值空間較大，適合自住長期持有。公寓總價較低，適合預算有限的首購族或投資出租（雲科大周邊）。建議依自身需求評估。'
              },
              {
                q: '雲科大周邊購屋出租划算嗎？',
                a: '雲科大學生約1.2萬人，租屋需求穩定，透天分租或套房改建年投報率約4%～6%。但需注意建物格局、分租改建合法性及管理成本。'
              },
              {
                q: '斗六農地可以蓋房子嗎？',
                a: '農地原則上只能農用，不得作為一般住宅。若要蓋農舍，需符合農委會規定：取得農地已滿2年、農地面積達0.25公頃以上、申請人需具農民身份。詳見農地購買指南。'
              },
              {
                q: '社口重劃區值得投資嗎？',
                a: '社口重劃區屬新開發區，道路規劃完整，建案品質較新，但周邊生活機能仍在發展中。適合看好未來增值潛力的中長期投資，近期自住仍以市中心或雲科周邊更為便利。'
              },
              {
                q: '購屋需要準備哪些費用（除了房價）？',
                a: '主要附加費用包含：契稅（房價約6%）、印花稅（契約金額千分之一）、代書費（約1.5萬～3萬）、仲介服務費（通常為成交價2%）、銀行鑑價與設定費等。合計約為總價的3%～6%。'
              },
            ].map((item) => (
              <details key={item.q} style={{
                border: '1px solid #E5E5E0', padding: '0',
                cursor: 'pointer'
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

        {/* Section 6：在地優勢說明 */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{
            fontSize: '1.35rem', fontWeight: 700, color: '#0F4D24',
            borderLeft: '4px solid #CC1122', paddingLeft: 14, marginBottom: 16
          }}>為什麼選擇群義房屋雲科加盟店？</h2>
          <ul style={{ paddingLeft: 20, color: '#444', lineHeight: 2 }}>
            <li>深耕斗六在地超過10年，熟悉各區域行情與眉角</li>
            <li>與代書、銀行長期合作，確保交易流程安全順暢</li>
            <li>提供農地、透天、土地各類物件媒合服務</li>
            <li>首購族專人輔導：貸款申請、補助申請全程陪同</li>
            <li>免費諮詢，不強迫推銷，以客戶最佳利益為優先</li>
          </ul>
        </section>

      </div>

      {/* 底部聯絡 CTA */}
      <div className="max-w-3xl mx-auto px-6 pb-16">
        <div style={{ background: '#0F4D24', padding: '40px', textAlign: 'center' }}>
          <p style={{
            color: '#CC1122', fontSize: '0.65rem', letterSpacing: '0.3em',
            textTransform: 'uppercase', fontWeight: 700, marginBottom: 8
          }}>免費諮詢 · 在地10年</p>
          <p style={{ color: '#FFFFFF', fontSize: '1.1rem', fontWeight: 700, marginBottom: 6 }}>
            想在斗六買房？讓我們幫你找到最適合的物件
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
