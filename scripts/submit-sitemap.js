#!/usr/bin/env node
/**
 * 自動提交 sitemap 到 Google Search Console
 * 使用方式：node scripts/submit-sitemap.js
 */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yunlin-realestate-blog.vercel.app';
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;
const PING_URL = `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;

fetch(PING_URL)
  .then(r => console.log(`✅ Sitemap 已提交 Google！狀態：${r.status}\n   ${SITEMAP_URL}`))
  .catch(e => console.error('❌ 提交失敗：', e.message));
