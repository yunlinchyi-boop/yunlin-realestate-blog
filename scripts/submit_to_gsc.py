#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
"""
Google Search Console Sitemap 提交 + Indexing API 請求索引
Service Account: yunlin-indexing@glassy-sky-423704-a3.iam.gserviceaccount.com
"""

import json
import os
import sys
import urllib.request
import urllib.error

# ── 設定 ──────────────────────────────────────────────────────────────────
SA_JSON = r"C:\Users\User\OneDrive\Desktop\yunlin-realestate-blog\google-indexing-sa.json"
SITE_URL = "https://yunlin-realestate-blog.vercel.app"
SITEMAP_URL = "https://yunlin-realestate-blog.vercel.app/sitemap.xml"
POSTS_DIR = r"C:\Users\User\OneDrive\Desktop\yunlin-realestate-blog\content\posts"

# 重要頁面（固定）
IMPORTANT_URLS = [
    "https://yunlin-realestate-blog.vercel.app",
    "https://yunlin-realestate-blog.vercel.app/blog",
    "https://yunlin-realestate-blog.vercel.app/about",
]

# ── 取得最新 5 篇文章 URL ─────────────────────────────────────────────────
def get_latest_post_urls(posts_dir: str, count: int = 5) -> list[str]:
    if not os.path.isdir(posts_dir):
        print(f"⚠️  posts 資料夾不存在：{posts_dir}")
        return []
    files = [f for f in os.listdir(posts_dir) if f.endswith(".md")]
    files.sort(reverse=True)  # 依檔名（日期前綴）降序 → 最新在前
    urls = []
    for fname in files[:count]:
        slug = fname[:-3]  # 去掉 .md
        urls.append(f"https://yunlin-realestate-blog.vercel.app/blog/{slug}")
    return urls

# ── Google Auth（使用 google-auth 取得 access token）─────────────────────
def get_access_token(sa_json_path: str, scopes: list[str]) -> str:
    from google.oauth2 import service_account
    credentials = service_account.Credentials.from_service_account_file(
        sa_json_path, scopes=scopes
    )
    import google.auth.transport.requests
    request = google.auth.transport.requests.Request()
    credentials.refresh(request)
    return credentials.token

# ── 1. 提交 Sitemap 到 Search Console ────────────────────────────────────
def submit_sitemap(token: str):
    print("\n" + "="*60)
    print("1. 提交 Sitemap 到 Google Search Console")
    print("="*60)

    import urllib.parse
    site_url_enc = urllib.parse.quote(SITE_URL, safe="")
    feed_path_enc = urllib.parse.quote(SITEMAP_URL, safe="")
    api_url = f"https://www.googleapis.com/webmasters/v3/sites/{site_url_enc}/sitemaps/{feed_path_enc}"

    req = urllib.request.Request(
        api_url,
        method="PUT",
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Length": "0",
        }
    )
    print(f"PUT {api_url}")
    try:
        with urllib.request.urlopen(req) as resp:
            body = resp.read().decode()
            print(f"✅ 成功！HTTP {resp.status}")
            if body:
                print("   回應:", body[:200])
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f"❌ 失敗 HTTP {e.code}: {body[:500]}")
        print_curl_sitemap(token)

def print_curl_sitemap(token: str):
    import urllib.parse
    site_url_enc = urllib.parse.quote(SITE_URL, safe="")
    feed_path_enc = urllib.parse.quote(SITEMAP_URL, safe="")
    print("\n手動執行（curl）：")
    print(f'curl -X PUT -H "Authorization: Bearer {token}" \\')
    print(f'  "https://www.googleapis.com/webmasters/v3/sites/{site_url_enc}/sitemaps/{feed_path_enc}"')

# ── 2. Indexing API 請求索引 ──────────────────────────────────────────────
def request_indexing(token: str, urls: list[str]):
    print("\n" + "="*60)
    print("2. Indexing API 請求索引")
    print("="*60)
    api_url = "https://indexing.googleapis.com/v3/urlNotifications:publish"

    for url in urls:
        payload = json.dumps({"url": url, "type": "URL_UPDATED"}).encode()
        req = urllib.request.Request(
            api_url,
            data=payload,
            method="POST",
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json",
            }
        )
        try:
            with urllib.request.urlopen(req) as resp:
                body = resp.read().decode()
                resp_data = json.loads(body)
                notify_time = resp_data.get("urlNotificationMetadata", {}).get("latestUpdate", {}).get("notifyTime", "")
                print(f"✅ {url}")
                if notify_time:
                    print(f"   notifyTime: {notify_time}")
        except urllib.error.HTTPError as e:
            body = e.read().decode()
            print(f"⚠️  {url}")
            err_data = json.loads(body) if body.startswith("{") else {}
            err_msg = err_data.get("error", {}).get("message", body[:200])
            print(f"   HTTP {e.code}: {err_msg}")

# ── 主流程 ────────────────────────────────────────────────────────────────
def main():
    print("群義房屋雲科店 — Google Search Console / Indexing API 提交")
    print(f"Service Account: {SA_JSON}")
    print(f"Sitemap: {SITEMAP_URL}")

    # 取得最新 5 篇文章 URL
    post_urls = get_latest_post_urls(POSTS_DIR)
    print(f"\n最新 {len(post_urls)} 篇文章 URL：")
    for u in post_urls:
        print(f"  {u}")

    all_urls = IMPORTANT_URLS + post_urls

    # ── Sitemap 提交（scope: webmasters）
    print("\n取得 Search Console token...")
    try:
        sc_token = get_access_token(SA_JSON, ["https://www.googleapis.com/auth/webmasters"])
        submit_sitemap(sc_token)
    except Exception as ex:
        print(f"❌ Search Console token 失敗：{ex}")

    # ── Indexing API（scope: indexing）
    print("\n取得 Indexing API token...")
    try:
        idx_token = get_access_token(SA_JSON, ["https://www.googleapis.com/auth/indexing"])
        request_indexing(idx_token, all_urls)
    except Exception as ex:
        print(f"❌ Indexing API token 失敗：{ex}")

    print("\n" + "="*60)
    print("完成！")

if __name__ == "__main__":
    main()
