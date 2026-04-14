/**
 * Google Indexing API 主動通知腳本
 * 用途：文章發布後呼叫 Google Indexing API，讓 Google 快速收錄
 *
 * 使用方式：
 *   npx ts-node scripts/google-index.ts                  # 通知所有文章
 *   npx ts-node scripts/google-index.ts <slug>           # 通知單篇
 *
 * 需要環境變數：
 *   GOOGLE_SERVICE_ACCOUNT_JSON  (Google Cloud Service Account JSON 字串)
 *   NEXT_PUBLIC_SITE_URL         (網站網址，預設 https://yunlin-realestate-blog.vercel.app)
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// ── 設定 ────────────────────────────────────────────────────────────────────
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yunlin-realestate-blog.vercel.app';
const SA_JSON   = process.env.GOOGLE_SERVICE_ACCOUNT_JSON ?? '';

if (!SA_JSON) {
  console.error('❌ 缺少 GOOGLE_SERVICE_ACCOUNT_JSON 環境變數');
  console.error('   請到 Google Cloud Console → IAM & Admin → Service Accounts → 下載 JSON');
  process.exit(1);
}

// ── 取得 Access Token ────────────────────────────────────────────────────────
async function getAccessToken(): Promise<string> {
  const { google } = await import('googleapis');
  const sa = JSON.parse(SA_JSON);
  const auth = new google.auth.GoogleAuth({
    credentials: sa,
    scopes: ['https://www.googleapis.com/auth/indexing'],
  });
  const client = await auth.getClient();
  const token = await client.getAccessToken();
  if (!token.token) throw new Error('無法取得 Access Token');
  return token.token;
}

// ── 呼叫 Indexing API ────────────────────────────────────────────────────────
async function notifyGoogle(url: string, token: string): Promise<void> {
  const res = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ url, type: 'URL_UPDATED' }),
  });

  const data = await res.json() as Record<string, unknown>;

  if (res.ok) {
    console.log(`✅ 已通知 Google：${url}`);
  } else {
    console.error(`❌ 失敗 ${url}：`, JSON.stringify(data));
  }
}

// ── 讀取所有文章 slug ────────────────────────────────────────────────────────
function getPostSlugs(): string[] {
  const postsDir = path.join(process.cwd(), 'content', 'posts');
  if (!fs.existsSync(postsDir)) return [];
  return fs.readdirSync(postsDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''));
}

// ── 主程式 ───────────────────────────────────────────────────────────────────
async function main() {
  const targetSlug = process.argv[2]; // 可選：指定單篇 slug

  const slugs = targetSlug ? [targetSlug] : getPostSlugs();
  if (slugs.length === 0) {
    console.log('⚠️  沒有找到任何文章');
    return;
  }

  console.log(`📡 準備通知 Google，共 ${slugs.length} 篇文章...\n`);

  let token: string;
  try {
    token = await getAccessToken();
  } catch (e) {
    console.error('❌ 取得 Access Token 失敗：', e);
    process.exit(1);
  }

  // 逐一通知（每秒1篇，避免 rate limit）
  for (const slug of slugs) {
    const url = `${SITE_URL}/blog/${encodeURIComponent(slug)}`;
    await notifyGoogle(url, token);
    await new Promise((r) => setTimeout(r, 1000));
  }

  // 也通知首頁和 blog 列表頁
  await notifyGoogle(SITE_URL, token);
  await notifyGoogle(`${SITE_URL}/blog`, token);

  console.log('\n🎉 全部通知完成！Google 通常在 24 小時內收錄。');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
