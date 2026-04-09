import Link from 'next/link';
import { getPosts } from '@/lib/posts';

export default function HomePage() {
  const posts = getPosts().slice(0, 6);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-100 py-24 px-6 text-center">
        <p className="text-amber-600 font-semibold mb-3 tracking-widest text-sm uppercase">雲林在地房地產專家</p>
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-5">
          群義房屋｜雲科加盟店
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          透天、土地、農地、廠房｜專業服務讓您安心置產
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/blog" className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-3 rounded-full transition shadow-md">
            瀏覽專欄文章
          </Link>
          <a href="tel:055362808" className="border-2 border-amber-500 text-amber-600 hover:bg-amber-50 font-semibold px-8 py-3 rounded-full transition">
            📞 立即諮詢
          </a>
        </div>
      </section>

      {/* 最新文章 */}
      <section className="max-w-5xl mx-auto py-20 px-6">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold text-gray-900">最新文章</h2>
          <Link href="/blog" className="text-amber-600 hover:underline text-sm font-medium">查看全部 →</Link>
        </div>
        {posts.length === 0 ? (
          <p className="text-center text-gray-400 py-16">文章準備中，敬請期待...</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition h-full flex flex-col">
                  {post.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.coverImage} alt={post.title} className="w-full h-48 object-cover" />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center text-4xl">🏠</div>
                  )}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex gap-2 mb-2 flex-wrap">
                      {post.tags.map((tag) => (
                        <span key={tag} className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">{tag}</span>
                      ))}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-amber-600 transition mb-2">{post.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 flex-1">{post.description}</p>
                    <p className="text-xs text-gray-400 mt-3">{post.date}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 服務項目 */}
      <section className="bg-amber-50 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">服務項目</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: '🏡', label: '透天厝' },
              { icon: '🌾', label: '農地買賣' },
              { icon: '🏭', label: '廠房租售' },
              { icon: '📐', label: '土地仲介' },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition">
                <div className="text-4xl mb-3">{item.icon}</div>
                <p className="font-semibold text-gray-800">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 關於我們 */}
      <section id="about" className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">關於群義房屋</h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            群義房屋雲林雲科加盟店（紅火房屋仲介有限公司），深耕雲林在地房地產市場多年，
            提供透天、土地、農地、廠房等各類物件買賣服務，
            以誠信專業為核心，讓每一位客戶安心置產。
          </p>
          <div className="mt-10 inline-flex flex-col gap-2 text-gray-700 bg-gray-50 rounded-2xl px-10 py-6">
            <p>📜 經紀人證號：113雲縣字第00302號</p>
            <p>📞 05-5362808</p>
            <p>📍 雲林縣斗六市中正路312號</p>
          </div>
        </div>
      </section>
    </main>
  );
}
