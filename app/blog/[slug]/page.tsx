import { getPostBySlug, getPosts } from '@/lib/notion';
import { notFound } from 'next/navigation';

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const posts = await getPosts();
    return posts.map((post) => ({ slug: post.slug }));
  } catch {
    return [];
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let result = null;
  try {
    result = await getPostBySlug(slug);
  } catch {
    // Notion 尚未設定
  }

  if (!result) return notFound();

  const { post, markdown } = result;

  return (
    <main className="max-w-3xl mx-auto py-16 px-6">
      <div className="mb-8">
        <div className="flex gap-2 mb-3 flex-wrap">
          {post.tags.map((tag) => (
            <span key={tag} className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">{post.title}</h1>
        <p className="text-gray-500 text-sm">{post.date}</p>
      </div>

      {post.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.coverImage} alt={post.title} className="w-full h-64 object-cover rounded-2xl mb-10" />
      )}

      <article
        className="prose prose-gray max-w-none"
        dangerouslySetInnerHTML={{ __html: markdown }}
      />

      <div className="mt-16 pt-8 border-t border-gray-100 text-center text-gray-500 text-sm">
        <p className="font-semibold text-gray-700 mb-1">群義房屋｜雲林雲科加盟店</p>
        <p>📞 05-5362808　📍 雲林縣斗六市中正路312號</p>
      </div>
    </main>
  );
}
