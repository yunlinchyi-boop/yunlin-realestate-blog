import Link from 'next/link';
import { getPosts } from '@/lib/notion';

export const revalidate = 3600;

export default async function HomePage() {
  let posts: Awaited<ReturnType<typeof getPosts>> = [];
  try {
    posts = await getPosts();
  } catch {
    // Notion 尚未設定時顯示空列表
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-100 py-20 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
          雲林房地產專家
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          群義房屋｜雲林雲科加盟店<br />
          專業服務，讓您安心置產
        </p>
        <Link
          href="/blog"
          className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-3 rounded-full transition"
        >
          瀏覽最新文章
        </Link>
      </section>

      {/* 最新文章 */}
      <section className="max-w-5xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">最新文章</h2>
        {posts.length === 0 ? (
          <p className="text-center text-gray-400">文章準備中，敬請期待...</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
                  {post.coverImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.coverImage} alt={post.title} className="w-full h-48 object-cover" />
                  )}
                  <div className="p-5">
                    <div className="flex gap-2 mb-2 flex-wrap">
                      {post.tags.map((tag) => (
                        <span key={tag} className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-amber-600 transition mb-1">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{post.description}</p>
                    <p className="text-xs text-gray-400 mt-3">{post.date}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 關於我 */}
      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">關於群義房屋</h2>
          <p className="text-gray-600 leading-relaxed">
            群義房屋雲林雲科加盟店（紅火房屋仲介有限公司），深耕雲林在地房地產市場，
            提供透天、土地、農地、廠房等各類物件買賣服務。
            經紀人證號：113雲縣字第00302號。
          </p>
          <div className="mt-8 space-y-1 text-gray-700">
            <p>📞 05-5362808</p>
            <p>📍 雲林縣斗六市中正路312號</p>
          </div>
        </div>
      </section>
    </main>
  );
}
