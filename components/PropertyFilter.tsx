'use client';

import { useState } from 'react';
import type { Property } from '@/lib/properties';

const ICON_MAP: Record<string, string> = {
  透天: '🏡', 公寓: '🏢', 大樓: '🏬', 華廈: '🏛️',
  農地: '🌾', 土地: '📐', 廠房: '🏭', 店面: '🏪', 別墅: '🏰',
};
const FALLBACK_IMGS = [
  '/images/prop_01.jpg', '/images/prop_02.jpg', '/images/prop_03.jpg',
  '/images/prop_04.jpg', '/images/prop_05.jpg', '/images/prop_06.jpg',
  '/images/prop_07.jpg', '/images/prop_08.jpg',
];

export default function PropertyFilter({
  properties,
  types,
}: {
  properties: Property[];
  types: string[];
}) {
  const [activeType, setActiveType] = useState('全部');

  const filtered = (
    activeType === '全部' ? properties : properties.filter((p) => p.type === activeType)
  ).slice(0, 8);

  return (
    <>
      {/* 類型篩選 */}
      <div className="flex gap-2 flex-wrap mb-5">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition border ${
              activeType === type
                ? 'bg-amber-500 text-white border-amber-500'
                : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-amber-400 hover:text-amber-600'
            }`}
          >
            {ICON_MAP[type] ?? ''} {type}
          </button>
        ))}
      </div>

      {/* 物件卡片（4欄，最多8筆） */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {filtered.map((p, i) => (
          <a
            key={i}
            href={p.link}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition border border-gray-100 group"
          >
            <div className="relative h-28 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.img || FALLBACK_IMGS[i % FALLBACK_IMGS.length]}
                alt={p.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <span className="absolute top-1.5 left-1.5 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                {p.type || '物件'}
              </span>
            </div>
            <div className="p-2.5">
              <h3 className="text-xs font-bold text-gray-900 group-hover:text-amber-600 transition line-clamp-1 mb-1">
                {p.title}
              </h3>
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
    </>
  );
}
