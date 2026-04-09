import { getAboutData } from '@/lib/about';
import type { Metadata } from 'next';

export const revalidate = 86400; // 每24小時同步一次

export const metadata: Metadata = {
  title: '關於我們',
  description: '群義房屋雲林雲科加盟店公司簡介、商圈介紹與交通資訊。',
};

export default async function AboutPage() {
  const about = await getAboutData();

  return (
    <main className="max-w-4xl mx-auto py-16 px-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2 border-l-4 border-amber-500 pl-4">關於我們</h1>
      <p className="text-gray-400 text-sm mb-10">資料同步自官網｜最後更新：{about.updatedAt}</p>

      <div className="space-y-8">
        {/* 公司簡介 */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            🏢 公司簡介
          </h2>
          <p className="text-gray-600 leading-relaxed">{about.company}</p>
        </section>

        {/* 商圈簡介 */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-3">🛒 商圈簡介</h2>
          <p className="text-gray-600 leading-relaxed">{about.area}</p>
        </section>

        {/* 交通狀況 */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-3">🚗 交通狀況</h2>
          <p className="text-gray-600 leading-relaxed">{about.traffic}</p>
        </section>

        {/* 學校社區 */}
        {about.school && (
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-3">🎓 學校社區</h2>
            <p className="text-gray-600 leading-relaxed">{about.school}</p>
          </section>
        )}

        {/* 聯絡資訊 */}
        <section className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">📞 聯絡資訊</h2>
          <div className="space-y-2 text-gray-700">
            <p>🏢 紅火房屋仲介有限公司</p>
            <p>📜 經紀人證號：113雲縣字第00302號</p>
            <p>📞 {about.phone}</p>
            <p>📍 {about.address}</p>
          </div>
          <a
            href={`tel:${about.phone.replace(/-/g, '')}`}
            className="mt-5 inline-block bg-amber-500 hover:bg-amber-400 text-white font-bold px-8 py-2.5 rounded-full transition"
          >
            立即諮詢
          </a>
        </section>
      </div>
    </main>
  );
}
