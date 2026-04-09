'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { getProperties, getPropertyTypes } from '@/lib/properties';

const ICON_MAP: Record<string, string> = {
  透天: '🏡', 公寓: '🏢', 大樓: '🏬', 華廈: '🏛️',
  農地: '🌾', 土地: '📐', 廠房: '🏭', 店面: '🏪', 別墅: '🏰',
};

// 物件縮圖對應（依序輪用）
const PROP_IMGS = [
  '/images/prop_01.jpg', '/images/prop_02.jpg', '/images/prop_03.jpg',
  '/images/prop_04.jpg', '/images/prop_05.jpg', '/images/prop_06.jpg',
  '/images/prop_07.jpg', '/images/prop_08.jpg',
];

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
      <section className="relative bg-gray-900 text-white py-0 overflow-hidden">
        <Image
          src="/images/shoptitle.png"
          alt="群義房屋雲林雲科加盟店"
          width={1200}
          height={260}
          className="w-full object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent flex flex-col items-center justify-end pb-8 px-6 text-center">
          <h1 className="text-2xl md:text-4xl font-bold mb-2 drop-shadow">群義房屋｜雲林雲科加盟店</h1>
          <p className="text-gray-200 text-sm mb-5">透天・土地・農地・廠房｜專業服務，安心置產</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a href="tel:055362808"
              className="bg-amber-500 hover:bg-amber-400 text-white font-bold px-6 py-2 rounded-full transition shadow text-sm">
              📞 05-5362808
            </a>
            <Link href="/blog"
              className="border border-white/60 text-white px-6 py-2 rounded-full hover:bg-white/10 transition text-sm">
              📰 專欄文章
            </Link>
          </div>
        </div>
      </section>

      {/* ── 精選物件 ── */}
      <section className="max-w-6xl mx-auto py-10 px-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-900 border-l-4 border-amber-500 pl-3">精選物件</h2>
          <a href="https://www.chyi.com.tw/sell_item/?storeid=4759"
            target="_blank" rel="noopener noreferrer"
            className="text-sm text-amber-600 hover:underline">
            查看全部 →
          </a>
        </div>

        {/* 類型分頁 */}
        <div className="flex gap-2 flex-wrap mb-5">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition border ${
                activeType === type
                  ? 'bg-amber-500 text-white border-amber-500'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-amber-400 hover:text-amber-600'
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
              <div className="relative h-36 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={PROP_IMGS[i % PROP_IMGS.length]}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-0.5 rounded font-medium">
                  {p.type || '物件'}
                </span>
                {p.age && (
                  <span className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded">
                    屋齡{p.age}
                  </span>
                )}
              </div>
              <div className="p-3">
                <h3 className="text-sm font-bold text-gray-900 group-hover:text-amber-600 transition line-clamp-1 mb-1">
                  {p.title}
                </h3>
                {p.addr && <p className="text-xs text-gray-500 line-clamp-1 mb-2">📍 {p.addr}</p>}
                <div className="flex items-center justify-between">
                  <span className="text-amber-600 font-bold text-base">{p.price}</span>
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

      {/* ── 公司簡介 ── */}
      <section className="bg-white py-10 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 border-l-4 border-amber-500 pl-3 mb-6">關於我們</h2>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <p className="text-gray-600 leading-relaxed text-sm mb-4">
                群義房屋雲林雲科加盟店，不論住家、店面、辦公、廠房、土地等買賣租賃，皆提供專業仲介服務。
                我們秉持著專業與熱忱、堅持給客人最用心與最迅速的服務，提供完整成交資訊，誠實告知房屋瑕疵，
                提供客戶專業分析與規劃。
              </p>
              <p className="text-gray-600 leading-relaxed text-sm">
                各大賣場聚集，斗六成大醫院、星巴克、社口商圈、家樂福、HOLA 等，
                食衣住行育樂生活機能一應俱全。
              </p>
            </div>
            <div className="md:w-64 bg-gray-50 rounded-xl p-5 text-sm text-gray-700 space-y-2 flex-shrink-0">
              <p className="font-bold text-gray-900 mb-1">聯絡資訊</p>
              <p>🏢 紅火房屋仲介有限公司</p>
              <p>📜 經紀人證號：113雲縣字第00302號</p>
              <p>📞 05-5362808</p>
              <p>📍 640 雲林縣斗六市中正路312號</p>
              <a href="tel:055362808"
                className="block mt-3 bg-amber-500 hover:bg-amber-400 text-white text-center py-2 rounded-full font-bold transition text-sm">
                立即諮詢
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 最新文章 ── */}
      <section className="max-w-6xl mx-auto py-10 px-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-900 border-l-4 border-amber-500 pl-3">房地產專欄</h2>
          <Link href="/blog" className="text-sm text-amber-600 hover:underline">查看全部 →</Link>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {[
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
          ].map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
              <article className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex">
                <div className="w-32 flex-shrink-0 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                </div>
                <div className="p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex gap-1 mb-1 flex-wrap">
                      {post.tags.map((tag) => (
                        <span key={tag} className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full">{tag}</span>
                      ))}
                    </div>
                    <h3 className="font-bold text-gray-900 group-hover:text-amber-600 transition text-sm line-clamp-2">{post.title}</h3>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">{post.date}</p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>

    </main>
  );
}
