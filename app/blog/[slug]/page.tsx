import { getPosts, getPostBySlug } from '@/lib/posts';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPostBySlug(slug);
  if (!result) return {};
  return {
    title: result.post.title,
    description: result.post.description,
    openGraph: {
      title: result.post.title,
      description: result.post.description,
      images: result.post.coverImage ? [result.post.coverImage] : [],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getPostBySlug(slug);
  if (!result) return notFound();
  const { post, contentHtml } = result;

  return (
    <main className="max-w-3xl mx-auto py-16 px-6">
      <div className="mb-8">
        <div className="flex gap-2 mb-3 flex-wrap">
          {post.tags.map((tag) => (
            <span key={tag} className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">{tag}</span>
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
        className="prose prose-gray prose-headings:font-bold prose-a:text-amber-600 max-w-none"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
      <div className="mt-16 pt-8 border-t border-gray-100 text-center text-gray-500 text-sm">
        <p className="font-semibold text-gray-700 mb-1">群義房屋｜雲林雲科加盟店</p>
        <p>📞 05-5362808　📍 雲林縣斗六市中正路312號</p>
      </div>
    </main>
  );
}
