#!/usr/bin/env python3
"""
每日自動產生房市部落格文章
抓取新聞 → 生成 Markdown → 存入 content/posts/
"""
import requests, warnings, datetime, json, os, re, sys, time, xml.etree.ElementTree as ET
from bs4 import BeautifulSoup
warnings.filterwarnings('ignore')

TODAY = datetime.date.today().strftime('%Y-%m-%d')
POSTS_DIR = os.path.join(os.path.dirname(__file__), '..', 'content', 'posts')
HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}

# ── 新聞抓取 ──────────────────────────────────────────────────

def fetch_myhousing():
    try:
        r = requests.get('https://www.myhousing.com.tw/news/rss',
                         headers=HEADERS, timeout=10, verify=False)
        root = ET.fromstring(r.content.decode('utf-8'))
        items = []
        for item in root.iter('item'):
            title = item.find('title')
            link = item.find('link')
            desc = item.find('description')
            if title is not None and title.text:
                items.append({
                    'source': '住展房屋網',
                    'title': title.text.strip()[:80],
                    'link': link.text.strip() if link is not None else '',
                    'desc': desc.text.strip()[:150] if desc is not None and desc.text else ''
                })
        return items[:8]
    except Exception:
        return []

def fetch_ettoday():
    try:
        r = requests.get('https://house.ettoday.net/', headers=HEADERS, timeout=10, verify=False)
        r.encoding = 'utf-8'
        soup = BeautifulSoup(r.text, 'html.parser')
        items, seen = [], set()
        for a in soup.select('h2 a, h3 a, .piece-title a, .title a'):
            t = a.get_text(strip=True)
            href = a.get('href', '')
            if len(t) > 10 and t not in seen:
                seen.add(t)
                link = href if href.startswith('http') else f'https://house.ettoday.net{href}'
                items.append({'source': 'ETtoday房產雲', 'title': t[:80], 'link': link, 'desc': ''})
            if len(items) >= 8:
                break
        return items
    except Exception:
        return []

def pick_top_news(all_news):
    """挑選最相關的新聞：優先台灣房市關鍵字"""
    keywords = ['房市', '房價', '買房', '房貸', '建商', '不動產', '預售屋', '土地', '雲林',
                '斗六', '利率', '升息', '降息', '成交', '投資']
    scored = []
    for n in all_news:
        score = sum(1 for k in keywords if k in n['title'])
        scored.append((score, n))
    scored.sort(key=lambda x: -x[0])
    return [n for _, n in scored[:3]]

# ── 文章生成 ──────────────────────────────────────────────────

ARTICLE_TEMPLATES = [
    {
        'slug_suffix': 'market-trend',
        'title_prefix': '雲林房市週報',
        'tags': ['房市分析', '雲林房市', '買房攻略'],
        'cover': '/images/prop_01.jpg',
    },
    {
        'slug_suffix': 'buy-guide',
        'title_prefix': '雲林買房指南',
        'tags': ['買房攻略', '首購族', '投資分析'],
        'cover': '/images/prop_03.jpg',
    },
    {
        'slug_suffix': 'news-insight',
        'title_prefix': '今日房市解析',
        'tags': ['房市新聞', '利率分析', '雲林房市'],
        'cover': '/images/prop_05.jpg',
    },
]

def make_slug(date_str, suffix):
    return f"{date_str}-{suffix}"

def generate_article(news_list, template):
    if not news_list:
        return None

    main = news_list[0]
    secondary = news_list[1] if len(news_list) > 1 else None

    title = f"{template['title_prefix']}｜{main['title'][:25]}"
    desc = f"深度解析今日房市動態：{main['title']}。雲林斗六第一線房仲觀點，幫助買房族與投資客掌握最新趨勢。"

    # 文章主體
    body = f"""## 今日房市重點

{main['title']}

📰 來源：{main['link']}

---

## 對雲林買家的影響

這則消息對雲林、斗六地區的房地產市場有直接或間接影響。

**從我們第一線觀察：**

- 自住需求在斗六市中心與雲科大周邊持續穩定
- 社口重劃區開發進度帶動長期發展預期
- 農地與廠房詢問度在近期有所回升
"""

    if secondary:
        body += f"""
## 延伸新聞

{secondary['title']}

📰 來源：{secondary['link']}

---
"""

    body += f"""
## 實際建議

**如果你是首購族：**
現在進場需考量利率走勢，建議把握每月還款額在薪資30%以內的原則。

**如果你是投資客：**
雲林斗六目前租金報酬率約4-5%，相對於其他縣市仍具優勢。

**如果你猶豫不決：**
歡迎直接來找我們，不推銷、純諮詢，幫你分析你的狀況。

---

📞 **群義房屋雲科店｜免費諮詢**

- 電話：05-5362808
- 地址：640雲林縣斗六市中正路312號
- 官網：https://www.chyi.com.tw/store/055362808
"""

    return {
        'title': title,
        'description': desc,
        'body': body,
    }

def write_post(slug, title, description, date, tags, cover, body):
    os.makedirs(POSTS_DIR, exist_ok=True)
    filepath = os.path.join(POSTS_DIR, f"{slug}.md")

    # 不覆蓋已存在的文章
    if os.path.exists(filepath):
        print(f"[SKIP] 文章已存在：{filepath}")
        return False

    tags_yaml = ', '.join(f'"{t}"' for t in tags)
    content = f"""---
title: "{title}"
description: "{description}"
date: "{date}"
tags: [{tags_yaml}]
coverImage: "{cover}"
---

{body}
"""
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"[OK] 產生文章：{filepath}")
    return True

# ── 主程式 ──────────────────────────────────────────────────

def main():
    print(f"[{TODAY}] 開始抓取新聞...")
    all_news = fetch_myhousing() + fetch_ettoday()
    print(f"  抓到 {len(all_news)} 則新聞")

    if not all_news:
        print("[WARN] 無法取得新聞，跳過文章生成")
        return

    top_news = pick_top_news(all_news)
    print(f"  選出 {len(top_news)} 則重點新聞")

    # 選一個今天還沒用過的 template
    import hashlib
    day_hash = int(hashlib.md5(TODAY.encode()).hexdigest(), 16)
    template = ARTICLE_TEMPLATES[day_hash % len(ARTICLE_TEMPLATES)]

    slug = make_slug(TODAY, template['slug_suffix'])
    article = generate_article(top_news, template)

    if article:
        write_post(
            slug=slug,
            title=article['title'],
            description=article['description'],
            date=TODAY,
            tags=template['tags'],
            cover=template['cover'],
            body=article['body'],
        )
    else:
        print("[WARN] 無法生成文章")

if __name__ == '__main__':
    main()
