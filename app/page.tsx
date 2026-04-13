import Link from 'next/link';
import Image from 'next/image';
import { getProperties, getPropertyTypes } from '@/lib/properties';
import { getPosts, formatDateTW } from '@/lib/posts';
import PropertyFilter from '@/components/PropertyFilter';

export const revalidate = 0;

export default function HomePage() {
  const allProperties = getProperties();
  const types = getPropertyTypes();
  const allPosts = getPosts();
  const latestNews = allPosts.filter(p => !p.slug.includes('-property-')).slice(0, 4);
  const latestPropertyPosts = allPosts.filter(p => p.slug.includes('-property-')).slice(0, 4);

  return (
    <main className="min-h-screen bg-gray-50">

      {/* ── Hero Banner ── */}
      <section className="relative bg-gray-900 text-white overflow-hidden">
        <Image src="/images/shoptitle.png" alt="群義房屋雲林雲科加盟店"
          width={1200} height={260} className="w-full object-cover opacity-70" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent flex flex-col items-center justify-end pb-8 px-6 text-center">
          <h1 className="text-2xl md:text-4xl font-bold mb-2 drop-shadow">群義房屋｜雲林雲科加盟店</h1>
          <p className="text-amber-300 text-base font-semibold mb-2 drop-shadow">紅火房屋仲介有限公司</p>
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
          {latestNews.map((post, i) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
              <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition border border-gray-100 flex h-36">
                <div className="w-40 flex-shrink-0 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center text-4xl">
                    {i === 0 ? '📰' : '📊'}
                  </div>
                </div>
                <div className="p-4 flex flex-col justify-between flex-1 min-w-0">
                  <div>
                    <div className="flex gap-1 mb-1.5 flex-wrap">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full">{tag}</span>
                      ))}
                    </div>
                    <h3 className="font-bold text-gray-900 group-hover:text-amber-600 transition text-sm line-clamp-2 leading-snug">{post.title}</h3>
                  </div>
                  <p className="text-xs text-gray-400">{formatDateTW(post.date)}</p>
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

      {/* ══════════ 最新物件貼文 ══════════ */}
      {latestPropertyPosts.length > 0 && (
        <section className="max-w-6xl mx-auto py-10 px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-blue-500 pl-3">最新物件介紹</h2>
              <p className="text-gray-400 text-xs mt-1 pl-3">每日自動更新・透天・公寓・土地・廠房</p>
            </div>
            <Link href="/blog" className="text-sm text-blue-600 hover:underline font-medium">查看全部 →</Link>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {latestPropertyPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition border border-gray-100 flex h-36">
                  <div className="w-40 flex-shrink-0 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center text-4xl">
                      🏠
                    </div>
                  </div>
                  <div className="p-4 flex flex-col justify-between flex-1 min-w-0">
                    <div>
                      <div className="flex gap-1 mb-1.5 flex-wrap">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{tag}</span>
                        ))}
                      </div>
                      <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition text-sm line-clamp-2 leading-snug">{post.title}</h3>
                    </div>
                    <p className="text-xs text-gray-400">{formatDateTW(post.date)}</p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ══════════ 輔助：精選物件 ══════════ */}
      {allProperties.length > 0 && (
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
            <PropertyFilter properties={allProperties} types={types} />
          </div>
        </section>
      )}

    </main>
  );
}
