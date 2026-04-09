'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { getProperties, getPropertyTypes } from '@/lib/properties';

const ICON_MAP: Record<string, string> = {
  透天: '🏡', 公寓: '🏢', 大樓: '🏬', 華廈: '🏛️',
  農地: '🌾', 土地: '📐', 廠房: '🏭', 店面: '🏪', 別墅: '🏰',
};
const FALLBACK_IMGS = [
  '/images/prop_01.jpg', '/images/prop_02.jpg', '/images/prop_03.jpg',
  '/images/prop_04.jpg', '/images/prop_05.jpg', '/images/prop_06.jpg',
  '/images/prop_07.jpg', '/images/prop_08.jpg',
];

// 靜態文章資料（實際由 /blog 頁動態讀取）
const LATEST_POSTS = [
  {
    slug: '2026-04-09-yunlin-house-guide',
    title: '2026年雲林買房完整攻略｜透天厝vs大樓，哪個更值得？',
    description: '雲林斗六、斗南、虎尾買房差異大解析，透天厝與大樓優缺點比較，適合首購族與投資客的最新房市資訊。',
    date: '2026-04-09',
    tags: ['買房攻略', '雲林房市'],
    img: '/images/prop_02.jpg',
  },
  {
    slug: '2026-04-08-fed-rate-impact',
    title: '美聯準會降息對雲林房市有何影響？2026最新解析',
    description: '美聯準會利率政策對台灣房貸利率的影響，以及雲林斗六購屋族應如何因應升降息循環。',
    date: '2026-04-08',
    tags: ['房市分析', '利率'],
    img: '/images/prop_04.jpg',
  },
];

export default function HomePage() {
  const allProperties = getProperties();
  const types = getPropertyTypes();
  const [activeType, setActiveType] = useState('全部');

  const filtered = (activeType === '全部' ? allProperties : allProperties.filter(p => p.type === activeType)).slice(0, 8);

  return (
    <main className="min-h-screen bg-gray-50">

      {/* ── Hero Banner ── */}
      <section className="relative bg-gray-900 text-white overflow-hidden">
        <Image src="/images/shoptitle.png" alt="群義房屋雲林雲科加盟店"
          width={1200} height={260} className="w-full object-cover opacity-70" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent flex flex-col items-center justify-end pb-8 px-6 text-center">
          <h1 className="text-2xl md:text-4xl font-bold mb-2 drop-shadow">群義房屋｜雲林雲科加盟店</h1>
          <p className="text-gray-300 text-xs mb-1 opacity-80">紅火房屋仲介有限公司</p>
          <p className="text-gray-200 text-sm mb-5">每日房市資訊・透天・土地・農地・廠房</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/blog" className="bg-amber-500 hover:bg-amber-400 text-white font-bold px-6 py-2 rounded-full transition shadow text-sm">
              📰 今日房市專欄
            </Link>
            <a href="tel:055362808" className="border border-white/60 text-white px-6 py-2 rounded-full hover:bg-white/10 transition text-sm">
              📞 05-5362808
            </a>
          </div>
        </div>
      </section>

      {/* ══════════ 主角：房地產專欄 ══════════ */}
      <section className="max-w-6xl mx-auto py-10 px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-amber-500 pl-3">每日房市專欄</h2>
            <p className="text-gray-400 text-xs mt-1 pl-3">每日更新・美日房市・雲林在地分析</p>
          </div>
          <Link href="/blog" className="text-sm text-amber-600 hover:underline font-medium">查看全部 →</Link>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {LATEST_POSTS.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
              <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition border border-gray-100 flex h-36">
                <div className="w-40 flex-shrink-0 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                </div>
                <div className="p-4 flex flex-col justify-between flex-1 min-w-0">
                  <div>
                    <div className="flex gap-1 mb-1.5 flex-wrap">
                      {post.tags.map(tag => (
                        <span key={tag} className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full">{tag}</span>
                      ))}
                    </div>
                    <h3 className="font-bold text-gray-900 group-hover:text-amber-600 transition text-sm line-clamp-2 leading-snug">{post.title}</h3>
                  </div>
                  <p className="text-xs text-gray-400">{post.date}</p>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* 更多文章入口 */}
        <Link href="/blog"
          className="mt-5 flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-amber-300 rounded-2xl text-amber-600 hover:bg-amber-50 transition text-sm font-medium">
          📋 查看所有房市文章
        </Link>
      </section>

      {/* ══════════ 輔助：精選物件 ══════════ */}
      <section className="bg-white py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900 border-l-4 border-gray-300 pl-3">精選物件</h2>
              <p className="text-gray-400 text-xs mt-1 pl-3">同步自群義房屋官網・每日自動更新</p>
            </div>
            <a href="https://www.chyi.com.tw/sell_item/?storeid=4759"
              target="_blank" rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-amber-600 hover:underline">
              官網查看全部 →
            </a>
          </div>

          {/* 類型篩選 */}
          <div className="flex gap-2 flex-wrap mb-5">
            {types.map(type => (
              <button key={type} onClick={() => setActiveType(type)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition border ${
                  activeType === type
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-amber-400 hover:text-amber-600'
                }`}>
                {ICON_MAP[type] ?? ''} {type}
              </button>
            ))}
          </div>

          {/* 物件卡片（4欄，最多8筆） */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {filtered.map((p, i) => (
              <a key={i} href={p.link} target="_blank" rel="noopener noreferrer"
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition border border-gray-100 group">
                <div className="relative h-28 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.img || FALLBACK_IMGS[i % FALLBACK_IMGS.length]} alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  <span className="absolute top-1.5 left-1.5 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                    {p.type || '物件'}
                  </span>
                </div>
                <div className="p-2.5">
                  <h3 className="text-xs font-bold text-gray-900 group-hover:text-amber-600 transition line-clamp-1 mb-1">{p.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-amber-600 font-bold text-sm">{p.price}</span>
                    {p.build_ping && <span className="text-xs text-gray-400">{p.build_ping}</span>}
                  </div>
                </div>
              </a>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-gray-400 py-8 text-sm">此類型物件資料整理中...</p>
          )}
        </div>
      </section>

    </main>
  );
}
