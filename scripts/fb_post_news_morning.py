#!/usr/bin/env python3
"""
每日 07:00 自動抓取房地產新聞並發布至 FB 粉絲專頁
來源：Google News RSS（台灣房地產，繁體中文）
環境變數：FB_PAGE_ID, FB_ACCESS_TOKEN
"""
import os, sys, json, random, datetime, requests
import xml.etree.ElementTree as ET

PAGE_ID = os.environ.get("FB_PAGE_ID", "247544815110989")
TOKEN   = os.environ.get("FB_ACCESS_TOKEN", "")
HEADERS = {"User-Agent": "Mozilla/5.0"}

RSS_URLS = [
    "https://news.google.com/rss/search?q=房地產+台灣&hl=zh-TW&gl=TW&ceid=TW:zh-Hant",
    "https://news.google.com/rss/search?q=房市+買房&hl=zh-TW&gl=TW&ceid=TW:zh-Hant",
]

HIGH_KW = ["房價", "房市", "央行", "房貸", "利率", "實價", "買房", "租金", "地產", "建案", "土地", "升息"]


def fetch_news(count: int = 3) -> list[dict]:
    items = []
    seen = set()
    for url in RSS_URLS:
        try:
            r = requests.get(url, headers=HEADERS, timeout=15)
            root = ET.fromstring(r.content)
            for item in root.iter("item"):
                title = item.findtext("title", "").strip()
                link  = item.findtext("link", "").strip()
                pub   = item.findtext("pubDate", "").strip()
                if not title or title in seen:
                    continue
                seen.add(title)
                score = sum(1 for k in HIGH_KW if k in title)
                items.append({"title": title, "link": link, "pub": pub, "score": score})
        except Exception as e:
            print(f"[WARN] RSS 失敗：{e}")

    items.sort(key=lambda x: x["score"], reverse=True)
    return items[:count]


def clean_title(title: str) -> str:
    """移除媒體來源後綴，如 ' - 自由時報'"""
    for sep in [" - ", " | ", "｜"]:
        if sep in title:
            return title[:title.rfind(sep)].strip()
    return title.strip()


def fetch_og_image(url: str) -> bytes | None:
    """抓新聞 OG 圖片"""
    if not url:
        return None
    try:
        import re
        r = requests.get(url, headers=HEADERS, timeout=15, verify=False)
        match = re.search(r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)["\']', r.text)
        if not match:
            match = re.search(r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+property=["\']og:image["\']', r.text)
        if not match:
            return None
        img_url = match.group(1).strip()
        ir = requests.get(img_url, headers=HEADERS, timeout=20, verify=False)
        if ir.status_code == 200 and "image" in ir.headers.get("content-type", ""):
            print(f"[IMG] OG 圖片 {len(ir.content)//1024} KB")
            return ir.content
    except Exception as e:
        print(f"[WARN] OG 圖片失敗：{e}")
    return None


def format_post(news_list: list[dict]) -> str:
    today = datetime.date.today().strftime("%Y年%m月%d日")
    nums = ["①", "②", "③", "④", "⑤"]
    lines = [
        f"📰 【{today} 房地產早報】",
        "",
        "今日重點房市新聞，快速掌握市場脈動 👇",
        "",
    ]
    for i, n in enumerate(news_list):
        title = clean_title(n["title"])
        lines.append(f"{nums[i]} {title}")
        lines.append("")

    lines += [
        "━━━━━━━━━━━━━━━━",
        "🏠 群義房屋・雲科加盟店",
        "📞 05-5362808",
        "💬 有任何房市問題歡迎私訊！",
        "",
        "#群義房屋 #雲林房屋 #斗六房仲 #房地產新聞 #房市早報 #雲林買房",
    ]
    return "\n".join(lines)


def post_to_fb(text: str, img_bytes: bytes | None = None) -> None:
    if not TOKEN:
        print("[ERROR] 缺少 FB_ACCESS_TOKEN 環境變數", file=sys.stderr)
        sys.exit(1)

    if img_bytes:
        r = requests.post(
            f"https://graph.facebook.com/v19.0/{PAGE_ID}/photos",
            data={"message": text, "access_token": TOKEN},
            files={"source": ("news.jpg", img_bytes, "image/jpeg")},
            timeout=60,
        )
    else:
        r = requests.post(
            f"https://graph.facebook.com/v19.0/{PAGE_ID}/feed",
            data={"message": text, "access_token": TOKEN},
            timeout=30,
        )

    d = r.json()
    if "id" in d:
        print(f"[OK] 發文成功 ID={d['id']}（{'含圖' if img_bytes else '純文字'}）")
    else:
        print(f"[ERROR] {d}", file=sys.stderr)
        sys.exit(1)


def main():
    print(f"[{datetime.datetime.now():%Y-%m-%d %H:%M}] 抓取今日房地產新聞...")
    news = fetch_news(3)
    if not news:
        print("[WARN] 無新聞，略過")
        sys.exit(0)

    print(f"[OK] 抓到 {len(news)} 則新聞")
    for n in news:
        print(f"  - {clean_title(n['title'])}")

    text = format_post(news)
    print("\n" + "=" * 50)
    print(text)
    print("=" * 50 + "\n")

    # 用第一則新聞的 OG 圖
    img = fetch_og_image(news[0]["link"])
    post_to_fb(text, img)


if __name__ == "__main__":
    main()
