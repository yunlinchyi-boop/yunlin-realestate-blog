import Link from 'next/link';
import { getPosts } from '@/lib/posts';

export default function BlogPage() {
  const posts = getPosts();
  return (
    <main className="max-w-5xl mx-auto py-16 px-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">房地產專欄</h1>
      <p className="text-gray-500 mb-12">雲林房市趨勢、買房攻略、投資分析</p>
      {posts.length === 0 ? (
        <p className="text-gray-400 text-center py-20">文章準備中，敬請期待...</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
              <article className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
                {post.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.coverImage} alt={post.title} className="w-full h-52 object-cover" />
                ) : (
                  <div className="w-full h-52 bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center text-5xl">🏠</div>
                )}
                <div className="p-6">
                  <div className="flex gap-2 mb-3 flex-wrap">
                    {post.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">{tag}</span>
                    ))}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 group-hover:text-amber-600 transition mb-2">{post.title}</h2>
                  <p className="text-gray-500 text-sm line-clamp-3">{post.description}</p>
                  <p className="text-xs text-gray-400 mt-4">{post.date}</p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
