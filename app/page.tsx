'use client';

import Link from 'next/link';
import { useState } from 'react';
import { getProperties, getPropertyTypes } from '@/lib/properties';

const ICON_MAP: Record<string, string> = {
  透天: '🏡', 公寓: '🏢', 大樓: '🏬', 華廈: '🏛️',
  農地: '🌾', 土地: '📐', 廠房: '🏭', 店面: '🏪', 別墅: '🏰',
};

export default function HomePage() {
  const allProperties = getProperties();
  const types = getPropertyTypes();
  const [activeType, setActiveType] = useState('全部');

  const filtered = activeType === '全部'
    ? allProperties
    : allProperties.filter((p) => p.type === activeType);

  return (
    <main className="min-h-screen bg-gray-50">

      {/* ── Hero Banner ── */}
      <section className="bg-gradient-to-br from-red-800 to-red-600 text-white py-16 px-6 text-center">
        <p className="text-red-200 text-sm tracking-widest mb-2 uppercase">Yunlin Real Estate Expert</p>
        <h1 className="text-3xl md:text-5xl font-bold mb-3">群義房屋｜雲林雲科加盟店</h1>
        <p className="text-red-100 text-lg mb-8">透天・土地・農地・廠房｜專業服務，安心置產</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <a href="tel:055362808"
            className="bg-white text-red-700 font-bold px-6 py-2.5 rounded-full hover:bg-red-50 transition shadow">
            📞 05-5362808
          </a>
          <Link href="/blog"
            className="border border-white text-white px-6 py-2.5 rounded-full hover:bg-white/10 transition">
            📰 專欄文章
          </Link>
        </div>
      </section>

      {/* ── 精選物件 ── */}
      <section className="max-w-6xl mx-auto py-12 px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            <span className="border-l-4 border-red-600 pl-3">精選物件</span>
          </h2>
          <a href="https://www.chyi.com.tw/sell_item/?storeid=4759"
            target="_blank" rel="noopener noreferrer"
            className="text-sm text-red-600 hover:underline">
            查看全部 →
          </a>
        </div>

        {/* 類型分頁 */}
        <div className="flex gap-2 flex-wrap mb-6">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition border ${
                activeType === type
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-red-400 hover:text-red-600'
              }`}
            >
              {ICON_MAP[type] ?? ''} {type}
            </button>
          ))}
        </div>

        {/* 物件卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((p, i) => (
            <a
              key={i}
              href={p.link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition border border-gray-100 group"
            >
              {/* 物件圖示佔位 */}
              <div className="h-36 bg-gradient-to-br from-red-50 to-orange-100 flex flex-col items-center justify-center relative">
                <span className="text-4xl">{ICON_MAP[p.type] ?? '🏠'}</span>
                <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded">
                  {p.type || '物件'}
                </span>
                {p.age && (
                  <span className="absolute top-2 right-2 bg-gray-700/70 text-white text-xs px-2 py-0.5 rounded">
                    屋齡{p.age}
                  </span>
                )}
              </div>
              <div className="p-3">
                <h3 className="text-sm font-bold text-gray-900 group-hover:text-red-600 transition line-clamp-1 mb-1">
                  {p.title}
                </h3>
                {p.addr && <p className="text-xs text-gray-500 line-clamp-1 mb-2">📍 {p.addr}</p>}
                <div className="flex items-center justify-between">
                  <span className="text-red-600 font-bold text-base">{p.price}</span>
                  {p.build_ping && <span className="text-xs text-gray-400">{p.build_ping}</span>}
                </div>
                {p.layout && <p className="text-xs text-gray-500 mt-1">{p.layout}</p>}
              </div>
            </a>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-gray-400 py-12">此類型物件資料整理中...</p>
        )}
      </section>

      {/* ── 最新文章 ── */}
      <LatestArticles />

    </main>
  );
}

// 文章區塊獨立 Server 行為模擬（用靜態資料）
function LatestArticles() {
  return (
    <section className="max-w-6xl mx-auto py-12 px-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          <span className="border-l-4 border-red-600 pl-3">房地產專欄</span>
        </h2>
        <Link href="/blog" className="text-sm text-red-600 hover:underline">查看全部 →</Link>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {[
          {
            slug: '2026-04-09-yunlin-house-guide',
            title: '2026年雲林買房完整攻略｜透天厝vs大樓，哪個更值得？',
            description: '雲林斗六、斗南、虎尾買房差異大解析，透天厝與大樓優缺點比較，適合首購族與投資客的最新房市資訊。',
            date: '2026-04-09',
            tags: ['買房攻略', '雲林房市'],
          },
          {
            slug: '2026-04-08-fed-rate-impact',
            title: '美聯準會降息對雲林房市有何影響？2026最新解析',
            description: '美聯準會利率政策對台灣房貸利率的影響，以及雲林斗六購屋族應如何因應升降息循環。',
            date: '2026-04-08',
            tags: ['房市分析', '利率'],
          },
        ].map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
            <article className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition">
              <div className="flex gap-2 mb-2 flex-wrap">
                {post.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">{tag}</span>
                ))}
              </div>
              <h3 className="font-bold text-gray-900 group-hover:text-red-600 transition mb-1 line-clamp-2">{post.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-2">{post.description}</p>
              <p className="text-xs text-gray-400 mt-3">{post.date}</p>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
