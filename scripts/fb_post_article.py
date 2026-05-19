"""
fb_post_article.py — 將今日房市文章摘要發布到 Facebook 粉絲專頁
由 run_daily.py 呼叫
"""
import json
import os
import re
import datetime
import requests
from pathlib import Path

# 雲端版：路徑相對於 repo root（GitHub Actions checkout）
_REPO = Path(__file__).parent.parent
POSTS_DIR = _REPO / 'content' / 'posts'
SITE_URL = 'https://yunlin-realestate-blog.vercel.app'

# 讀 FB 憑證：優先從環境變數（GitHub Actions Secrets），fallback 本機檔案
_FB_PAGE_ID = os.environ.get('FB_PAGE_ID', '')
_FB_TOKEN   = os.environ.get('FB_ACCESS_TOKEN', '')
FB_TOKEN_FILE = Path(r'C:\Users\User\OneDrive\Desktop\群義房屋雲科店\.fb_token.json')

STORE_INFO = """🏠 群義房屋｜雲林雲科加盟店（紅火房屋仲介有限公司）
🪪 113雲縣字第00302號
📞 05-5362808
📍 斗六市中正路312號"""


def get_today_article() -> dict | None:
    """找今天產生的文章，回傳 {slug, title, description, tags}"""
    today = datetime.date.today().strftime('%Y-%m-%d')
    matches = [f for f in POSTS_DIR.glob(f'{today}-*.md')
               if '-property-' not in f.stem and not f.stem.startswith(f'{today}-property')]
    if not matches:
        print(f'  ⚠️  找不到今日新聞文章（{today}-*.md，排除物件頁）')
        return None

    # 取最新一篇
    post_file = sorted(matches)[-1]
    slug = post_file.stem

    content = post_file.read_text(encoding='utf-8')

    # 解析 frontmatter
    title = ''
    description = ''
    tags = []

    title_m = re.search(r'^title:\s*"(.+)"', content, re.MULTILINE)
    desc_m = re.search(r'^description:\s*"(.+)"', content, re.MULTILINE)
    tags_m = re.search(r'^tags:\s*\[(.+)\]', content, re.MULTILINE)
    img_m = re.search(r'^coverImage:\s*"(.+)"', content, re.MULTILINE)

    if title_m:
        title = title_m.group(1)
    if desc_m:
        description = desc_m.group(1)
    if tags_m:
        tags = [t.strip().strip('"') for t in tags_m.group(1).split(',')]

    cover = img_m.group(1) if img_m else ''
    # 相對路徑補完整 URL
    if cover.startswith('/'):
        cover = f'{SITE_URL}{cover}'

    return {
        'slug': slug,
        'title': title,
        'description': description,
        'tags': tags,
        'url': f'{SITE_URL}/blog/{slug}',
        'cover_image': cover,
    }


def build_article_post(article: dict) -> tuple[str, str]:
    """組成 FB 貼文文字"""
    import urllib.parse
    title = article['title']
    desc = article['description']
    url = article['url']
    tags = article.get('tags', [])

    hashtags = ' '.join(f'#{t.replace(" ", "")}' for t in tags) if tags else '#雲林房市 #房市分析'
    hashtags += ' #群義房屋雲科店 #斗六買房'

    post = f"""📊【今日房市分析】

{title}

{desc}

🔗 完整內文：{url}

——————————————
{STORE_INFO}


{hashtags}"""

    return post, url


def post_to_fb(page_id: str, access_token: str, message: str, link: str = '', img_url: str = '') -> bool:
    try:
        if img_url:
            # 附圖發文：直接用 /photos + url 參數，published=true 確保外部可見
            r = requests.post(
                f'https://graph.facebook.com/v19.0/{page_id}/photos',
                data={'caption': message, 'url': img_url, 'published': 'true', 'access_token': access_token},
                timeout=30
            )
        else:
            r = requests.post(
                f'https://graph.facebook.com/v19.0/{page_id}/feed',
                data={'message': message, 'link': link, 'access_token': access_token},
                timeout=15
            )
        data = r.json()
        if 'id' in data:
            print(f'  ✅ 房市文章發文成功！貼文 ID：{data["id"]}')
            return True
        else:
            err = data.get('error', {})
            print(f'  ❌ 發文失敗：{err.get("message", str(data))}')
            return False
    except Exception as e:
        print(f'  ❌ 連線錯誤：{e}')
        return False


def main():
    today = datetime.date.today().strftime('%Y-%m-%d')
    print(f'\n📰 房市文章 FB 發文 ({today})')
    print('=' * 45)

    # 讀 token：優先環境變數，fallback 本機檔案
    page_id = _FB_PAGE_ID
    access_token = _FB_TOKEN
    if not page_id or not access_token:
        if FB_TOKEN_FILE.exists():
            cfg = json.loads(FB_TOKEN_FILE.read_text(encoding='utf-8'))
            page_id = cfg.get('page_id', '')
            access_token = cfg.get('access_token', '')
    if not page_id or not access_token:
        print('❌ FB_PAGE_ID 或 FB_ACCESS_TOKEN 未設定')
        return

    # 找今日文章
    article = get_today_article()
    if not article:
        return

    print(f'  文章：{article["title"][:50]}...')
    print(f'  連結：{article["url"]}')

    post_text, link = build_article_post(article)
    img_url = article.get('cover_image', '')
    post_to_fb(page_id, access_token, post_text, link, img_url)


if __name__ == '__main__':
    main()
