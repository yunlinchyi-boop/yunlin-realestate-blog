import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

export type Post = {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  coverImage: string;
  published: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function pageToPost(page: any): Post {
  const props = page.properties ?? {};
  return {
    id: page.id,
    slug: props.Slug?.rich_text?.[0]?.plain_text ?? page.id,
    title: props.Title?.title?.[0]?.plain_text ?? '無標題',
    description: props.Description?.rich_text?.[0]?.plain_text ?? '',
    date: props.Date?.date?.start ?? '',
    tags: props.Tags?.multi_select?.map((t: { name: string }) => t.name) ?? [],
    coverImage: props.CoverImage?.url ?? '',
    published: props.Published?.checkbox ?? false,
  };
}

export async function getPosts(): Promise<Post[]> {
  const response = await notion.search({
    filter: { property: 'object', value: 'page' },
    sort: { direction: 'descending', timestamp: 'last_edited_time' },
  });

  return response.results
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((page: any) => {
      const props = page.properties ?? {};
      return props.Published?.checkbox === true;
    })
    .map(pageToPost);
}

export async function getPostBySlug(slug: string): Promise<{ post: Post; markdown: string } | null> {
  const response = await notion.search({
    query: slug,
    filter: { property: 'object', value: 'page' },
  });

  if (!response.results.length) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const page = response.results.find((p: any) => {
    const props = p.properties ?? {};
    return props.Slug?.rich_text?.[0]?.plain_text === slug;
  });

  if (!page) return null;

  const mdBlocks = await n2m.pageToMarkdown(page.id);
  const markdown = n2m.toMarkdownString(mdBlocks).parent;

  return {
    post: pageToPost(page),
    markdown,
  };
}
