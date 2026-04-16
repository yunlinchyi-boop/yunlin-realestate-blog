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

YUNLIN_MARKET_DATA = {
    'price_ranges': {
        '透天': '600～1,500萬（斗六市區，依坪數屋齡）',
        '農地': '每分地約30～200萬（依地點、灌溉條件）',
        '土地': '建地約每坪5～30萬（市區較高）',
        '公寓': '300～800萬（老公寓較低，近雲科大較高）',
        '廠房': '500萬起（依面積、道路寬度）',
    },
    'areas': ['斗六市區', '雲科大周邊', '社口重劃區', '斗南鎮', '虎尾鎮', '林內鄉', '古坑鄉'],
    'loan_rate': '青安貸款最低1.775%，一般貸款約2.1～2.5%',
    'yield_rate': '租金報酬率約4～5%（雲科大周邊出租型物件）',
}

AREA_INSIGHTS = [
    ('斗六市中心', '生活機能完整，中正路、林森路周邊最為熱門，透天厝自住需求穩定。'),
    ('雲科大周邊', '租屋需求旺盛，公寓與透天皆有，投資出租報酬率相對穩定。'),
    ('社口重劃區', '生活機能持續完善，新建案較多，長期增值空間可期。'),
    ('斗南、虎尾', '距斗六車程約15分鐘，價位較低，適合預算有限的首購族。'),
]

def generate_article(news_list, template):
    import datetime as dt
    if not news_list:
        return None

    main = news_list[0]
    secondary = news_list[1] if len(news_list) > 1 else None
    third = news_list[2] if len(news_list) > 2 else None
    today = dt.date.today()
    year = today.year
    month = today.month

    # 更精準的標題（含關鍵字）
    main_kw = main['title'][:20].replace('｜', '').replace('【', '').replace('】', '').strip()
    title = f"{template['title_prefix']}｜{main_kw}（{year}年{month}月）"
    desc = f"{main['title'][:40]}。群義房屋雲林雲科加盟店第一線觀點：雲林斗六買家該如何因應？透天厝、農地、土地最新行情一次解析。"

    body = f"""## 今日房市焦點

**{main['title']}**

📰 新聞來源：{main['link']}

{main.get('desc', '這則消息牽動台灣整體房市，也對雲林斗六的買家帶來直接或間接的影響。')}

---

## 雲林斗六房市現況（{year}年{month}月）

根據群義房屋雲科加盟店的第一線觀察，目前雲林房市呈現以下趨勢：

### 各區域行情

"""
    for area, insight in AREA_INSIGHTS:
        body += f"**{area}**：{insight}\n\n"

    body += f"""
### 主要物件類型參考行情

| 物件類型 | 參考價格 |
|---------|---------|
"""
    for ptype, price in YUNLIN_MARKET_DATA['price_ranges'].items():
        body += f"| {ptype} | {price} |\n"

    body += f"""
> ⚠️ 以上為參考行情，實際成交價依個別物件條件而異。歡迎來電詢問最新實價。

---

## 這則新聞對雲林買家的影響

這則消息對雲林、斗六地區的房地產市場有以下幾個面向的影響：

### 1. 對首購族的影響

首購族在雲林置產，最需要關注的是**房貸利率走勢**。目前{YUNLIN_MARKET_DATA['loan_rate']}。每月還款金額建議控制在家庭收入的30%以內，確保財務安全。

雲林相對台北、台中，房價親民許多，以斗六透天厝為例，600～800萬的預算即可入手市區標準物件，月付約2.5～3.5萬元（依貸款成數）。

### 2. 對投資客的影響

雲林投資型物件中，**雲科大周邊出租**是目前詢問度最高的類型。租金報酬率約{YUNLIN_MARKET_DATA['yield_rate']}，相對台中、桃園仍具競爭力。

農地方面，近年詢問度持續上升，但需特別注意農用規定，避免購入後無法使用的風險。

### 3. 對觀望族的影響

雲林房市屬於**溫和型市場**，不像台北急漲急跌。對於有意置產但仍在觀望的買家，建議：

- 先做好**銀行貸款預審**，掌握自身可用額度
- 選定2～3個目標區域，定期追蹤物件變化
- 遇到喜歡的物件，不用搶，但也不宜拖太久

---
"""

    if secondary:
        body += f"""## 延伸房市新聞

**{secondary['title']}**

📰 來源：{secondary['link']}

{secondary.get('desc', '')}

"""

    if third:
        body += f"""**{third['title']}**

📰 來源：{third['link']}

---
"""

    body += f"""## 常見購屋問題

**Q：雲林買房需要準備多少自備款？**

一般而言，銀行最高貸款約7～8成，因此需準備**2～3成自備款**加上代書費、仲介費等相關費用。以600萬透天為例，自備款約需120～180萬。

**Q：農地可以蓋房子嗎？**

農地原則上不可興建住宅，僅能蓋農舍（需符合農業使用規定）。購買前務必確認地目與使用限制。

**Q：雲林交通方便嗎？影響房價嗎？**

台78線（東西向快速道路）、台3線貫通，加上高鐵雲林站（虎尾六輕附近）的開發效應，整體交通條件近年持續改善，對周邊房價有正面支撐。

---

## 群義房屋雲科加盟店｜免費諮詢

我們是雲林斗六在地房仲，10年以上在地深耕，提供：

✅ **免費、不推銷**的物件諮詢
✅ 銀行貸款媒合（合作10+家銀行）
✅ 農地、透天、廠房專業評估
✅ 代書、過戶一站服務

📞 **05-5362808**
📍 640 雲林縣斗六市中正路 312 號（免費停車）
🌐 [查看線上物件](https://www.chyi.com.tw/store/055362808)

> 有問題歡迎直接來電或到店，我們的目標是幫您做出最適合自己的決定，而不是快速成交。
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
