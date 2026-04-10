import Link from 'next/link';
import { getPosts, formatDateTW } from '@/lib/posts';

export default function BlogPage({ searchParams }: { searchParams: Promise<{ tag?: string }> }) {
  const posts = getPosts();

  return (
    <BlogPageClient posts={posts} searchParamsPromise={searchParams} />
  );
}

function BlogPageClient({
  posts,
  searchParamsPromise,
}: {
  posts: ReturnType<typeof getPosts>;
  searchParamsPromise: Promise<{ tag?: string }>;
}) {
  // Since this is a server component, we handle tag filtering server-side
  return <BlogList posts={posts} />;
}

function BlogList({ posts }: { posts: ReturnType<typeof getPosts> }) {
  // Get all unique tags
  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags)));

  return (
    <main className="max-w-5xl mx-auto py-16 px-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">房地產專欄</h1>
      <p className="text-gray-500 mb-8">雲林房市趨勢、買房攻略、投資分析</p>

      {/* 標籤篩選 */}
      {allTags.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-10">
          <Link href="/blog" className="text-sm bg-gray-100 hover:bg-amber-100 text-gray-700 hover:text-amber-700 px-3 py-1.5 rounded-full transition">
            全部
          </Link>
          {allTags.map((tag) => (
            <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}
              className="text-sm bg-gray-100 hover:bg-amber-100 text-gray-700 hover:text-amber-700 px-3 py-1.5 rounded-full transition">
              {tag}
            </Link>
          ))}
        </div>
      )}

      {posts.length === 0 ? (
        <p className="text-gray-400 text-center py-20">文章準備中，敬請期待...</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
              <article className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition h-full flex flex-col">
                {post.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.coverImage} alt={post.title} className="w-full h-52 object-cover" />
                ) : (
                  <div className="w-full h-52 bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center text-5xl">🏠</div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex gap-2 mb-3 flex-wrap">
                    {post.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">{tag}</span>
                    ))}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 group-hover:text-amber-600 transition mb-2">{post.title}</h2>
                  <p className="text-gray-500 text-sm line-clamp-3 flex-1">{post.description}</p>
                  <p className="text-xs text-gray-400 mt-4">{formatDateTW(post.date)}</p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
