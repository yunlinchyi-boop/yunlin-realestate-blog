import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDir = path.join(process.cwd(), 'content/posts');

export function formatDateTW(date: string): string {
  if (!date) return '';
  const [y, m, d] = date.split('-');
  return `${y}年${parseInt(m)}月${parseInt(d)}日`;
}

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  coverImage: string;
};

export function getPosts(): Post[] {
  if (!fs.existsSync(postsDir)) return [];
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'));
  return files
    .map((file) => {
      const slug = file.replace(/\.md$/, '');
      const raw = fs.readFileSync(path.join(postsDir, file), 'utf8');
      const { data } = matter(raw);
      return {
        slug,
        title: data.title ?? slug,
        description: data.description ?? '',
        date: data.date instanceof Date
          ? `${data.date.getUTCFullYear()}-${String(data.date.getUTCMonth() + 1).padStart(2, '0')}-${String(data.date.getUTCDate()).padStart(2, '0')}`
          : (data.date ? String(data.date) : ''),
        tags: data.tags ?? [],
        coverImage: data.coverImage ?? '',
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostBySlug(slug: string): Promise<{ post: Post; contentHtml: string } | null> {
  const filePath = path.join(postsDir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);
  const processed = await remark().use(html).process(content);
  return {
    post: {
      slug,
      title: data.title ?? slug,
      description: data.description ?? '',
      date: data.date instanceof Date
          ? `${data.date.getUTCFullYear()}-${String(data.date.getUTCMonth() + 1).padStart(2, '0')}-${String(data.date.getUTCDate()).padStart(2, '0')}`
          : (data.date ? String(data.date) : ''),
      tags: data.tags ?? [],
      coverImage: data.coverImage ?? '',
    },
    contentHtml: processed.toString(),
  };
}
