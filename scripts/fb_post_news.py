#!/usr/bin/env python3
"""
每日 08:30 自動抓取房市新聞並發布文字貼文到 Facebook（第1則新聞）
環境變數：FB_PAGE_ID, FB_ACCESS_TOKEN
"""
import json, os, sys, requests, datetime, random, re, xml.etree.ElementTree as ET

PAGE_ID = os.environ.get('FB_PAGE_ID', '')
TOKEN   = os.environ.get('FB_ACCESS_TOKEN', '')
HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

STORE_INFO = """🏠 群義房屋｜雲林雲科加盟店
📞 05-5362808
📍 斗六市中正路312號"""

HIGH_KW = ['聯準會','Fed','升息','降息','利率','房貸','外資','景氣','通膨','預售屋','實價','重劃']

def fetch_rss(url, source):
    try:
        r = requests.get(url, headers=HEADERS, timeout=10, verify=False)
        root = ET.fromstring(r.content)
        items = []
        for item in root.iter('item'):
            title = item.findtext('title', '').strip()
            link  = item.findtext('link', '').strip()
            if not title: continue
            score = sum(1 for k in HIGH_KW if k in title)
            items.append({'title': title, 'link': link, 'score': score, 'source': source})
        return items
    except Exception as e:
        print(f'[WARN] {source}: {e}')
        return []

def fetch_news():
    news = []
    news += fetch_rss('https://www.myhousing.com.tw/feed', '住展房屋網')
    news += fetch_rss('https://house.ettoday.net/rss.xml', 'ETtoday房產')
    news += fetch_rss('https://www.cnyes.com/rss/cat/tw_stock', '鉅亨網')
    return sorted(news, key=lambda x: x['score'], reverse=True)

def make_post(title, link, source):
    templates = [
        f"""📊【今日房市觀察】

{title}
📰 來源：{source}

這則消息對雲林、斗六想買房的朋友可能有影響：
• 利率與資金走向持續變動
• 在地自住需求仍然穩定
• 現在掌握資訊，才能做對決策

有問題歡迎私訊，免費諮詢 😊

{('🔗 ' + link) if link else ''}

➖➖➖➖➖➖➖➖
{STORE_INFO}

#群義房屋雲科店 #雲林房地產 #斗六買房 #房市新聞""",

        f"""🌐【今日國際房市】

{title}
📰 來源：{source}

全球資金動向直接影響台灣房貸利率。
身為雲林在地房仲，我們幫你看懂市場！

{('🔗 ' + link) if link else ''}

💬 有疑問歡迎私訊，不推銷、純諮詢

➖➖➖➖➖➖➖➖
{STORE_INFO}

#群義房屋雲科店 #雲林房地產 #房市快訊"""
    ]
    return random.choice(templates)

def post_to_fb(text):
    if not PAGE_ID or not TOKEN:
        print('[ERROR] 缺少 FB 環境變數')
        sys.exit(1)
    r = requests.post(
        f'https://graph.facebook.com/v19.0/{PAGE_ID}/feed',
        data={'message': text, 'access_token': TOKEN},
        timeout=30
    )
    d = r.json()
    if 'id' in d:
        print(f'[OK] 發文成功 ID={d["id"]}')
    else:
        print(f'[ERROR] {d}')
        sys.exit(1)

def main():
    news = fetch_news()
    if not news:
        print('[WARN] 無新聞資料，略過')
        sys.exit(0)
    top = news[0]
    print(f'今日新聞（第1則）：{top["title"]}')
    text = make_post(top['title'], top['link'], top['source'])
    post_to_fb(text)

if __name__ == '__main__':
    main()
