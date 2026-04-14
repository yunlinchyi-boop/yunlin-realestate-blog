#!/usr/bin/env python3
"""
每日自動同步群義房屋官網物件清單（Playwright 版）
由 Windows 排程器每天執行，更新 content/properties.json
"""
import json, re, datetime, sys, os, time, warnings
warnings.filterwarnings('ignore')

from playwright.sync_api import sync_playwright

BASE_URL = "https://www.chyi.com.tw"
STORE_ID = "4759"
OUTPUT_FILE = os.path.join(os.path.dirname(__file__), '../content/properties.json')

def parse_text(text, title, link, img):
    """從 innerText 解析物件欄位"""
    # 物件編號從 link
    no_m = re.search(r'sell_item/([\w-]+)/', link)
    no = no_m.group(1) if no_m else ''

    # 價格：取「總價 xxx 萬」或直接「xxx萬」
    price_m = re.search(r'總價\s*([\d,]+)\s*萬', text) or re.search(r'([\d,]+)\s*萬', text)
    price = price_m.group(1).replace(',', '') + '萬' if price_m else ''

    # 型態（透天/公寓/大樓等）
    type_m = re.search(r'型態\s*([\u4e00-\u9fff]+)', text)
    if not type_m:
        type_m = re.search(r'透天|公寓|大樓|別墅|廠房|農地|土地|店面|華廈', text)
        ptype = type_m.group(0) if type_m else ''
    else:
        ptype = type_m.group(1).strip()

    # 格局
    layout_m = re.search(r'格局\s*([\d]+房[^\n]+)', text)
    layout = layout_m.group(1).strip() if layout_m else ''
    if layout:
        # 只取第一行
        layout = layout.split('\n')[0].strip()

    # 建坪
    build_m = re.search(r'建坪\s*([\d.]+)\s*坪', text)
    build_ping = build_m.group(1) + '坪' if build_m else ''

    # 土地坪
    land_m = re.search(r'土地坪數\s*([\d.]+)\s*坪', text)
    land_ping = land_m.group(1) + '坪' if land_m else ''

    # 屋齡
    age_m = re.search(r'屋齡\s*([\d.]+)\s*年', text)
    age = age_m.group(1) + '年' if age_m else ''

    # 單價
    unit_m = re.search(r'單價\s*([\d.]+)\s*萬', text)
    unit_price = unit_m.group(1) + '萬/坪' if unit_m else ''

    # 地址（通常在格局前一行，取中文地址）
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    addr = ''
    for line in lines:
        if re.search(r'[縣市區鄉鎮]', line) and len(line) < 30 and '電話' not in line:
            addr = line
            break

    return {
        'no': no, 'title': title, 'price': price, 'addr': addr,
        'unit_price': unit_price, 'layout': layout, 'build_ping': build_ping,
        'land_ping': land_ping, 'age': age, 'type': ptype, 'category': '',
        'img': img, 'link': link,
    }

def fetch_page_items(page_obj, page_num):
    url = f"{BASE_URL}/sell_item/?storeid={STORE_ID}&Pg1={page_num}"
    print(f"  🌐 第{page_num}頁: {url}")

    try:
        page_obj.goto(url, wait_until='networkidle', timeout=30000)
    except Exception as e:
        print(f"  ⚠️ 載入逾時（繼續解析）: {e}")

    try:
        page_obj.wait_for_selector('li.house_block', timeout=12000)
    except:
        print(f"  第{page_num}頁無物件，結束")
        return []

    # 滾動觸發圖片載入
    page_obj.evaluate('window.scrollTo(0, 600)')
    page_obj.wait_for_timeout(1500)

    items = page_obj.evaluate('''() => {
        const els = document.querySelectorAll("li.house_block");
        return Array.from(els).map(el => {
            const titleEl = el.querySelector("dl.title dt a");
            const title = titleEl ? titleEl.textContent.trim() : "";
            const link = titleEl ? titleEl.href : "";
            const text = el.innerText || "";
            // 取第一個非 spacer 的圖片
            const imgs = Array.from(el.querySelectorAll("img"))
                .map(i => i.src)
                .filter(s => s && !s.includes("spacer") && !s.includes("favorites"));
            const img = imgs[0] || "";
            return { title, link, text, img };
        });
    }''')

    return items

def main():
    today = datetime.date.today().isoformat()
    print(f"🔄 同步物件清單（{today}）...")

    all_items = []
    seen = set()

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        ctx = browser.new_context(
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120',
            viewport={'width': 1280, 'height': 900},
        )
        pg = ctx.new_page()

        for page_num in range(1, 8):
            raw_items = fetch_page_items(pg, page_num)

            if not raw_items:
                break

            new = 0
            for r in raw_items:
                if not r['title'] and not r['link']:
                    continue
                key = r['link'] or r['title']
                if key in seen:
                    continue
                seen.add(key)
                item = parse_text(r['text'], r['title'], r['link'], r['img'])
                all_items.append(item)
                new += 1

            print(f"  第{page_num}頁：{new}筆，累計{len(all_items)}筆")

            if new == 0:
                break

            time.sleep(1)

        browser.close()

    if not all_items:
        print("⚠️ 未抓到物件，保留舊資料")
        sys.exit(0)

    data = {'updated': today, 'total': len(all_items), 'items': all_items}
    output = os.path.normpath(OUTPUT_FILE)
    os.makedirs(os.path.dirname(output), exist_ok=True)
    with open(output, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"✅ 完成：共{len(all_items)}筆 → {output}")
    # 印出摘要
    for i, item in enumerate(all_items):
        print(f"  [{i+1}] {item['title']} | {item['price']} | {item['type']} | img={'有' if item['img'] else '無'}")

if __name__ == '__main__':
    main()
