#!/usr/bin/env python3
"""
每日自動同步群義房屋官網物件清單
由 GitHub Actions 每天執行，更新 content/properties.json
"""
import requests, json, re, datetime, sys, os, warnings
warnings.filterwarnings('ignore')

BASE_URL = "https://www.chyi.com.tw"
STORE_ID = "4759"
OUTPUT_FILE = os.path.join(os.path.dirname(__file__), '../content/properties.json')

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120',
    'Referer': f'https://www.chyi.com.tw/sell_item?storeid={STORE_ID}',
}

def parse_block(block_html):
    """解析單一物件 HTML 區塊"""
    text = re.sub(r'<[^>]+>', ' ', block_html)
    text = re.sub(r'\s+', ' ', text).strip()

    link_m = re.search(r'href=["\']([^"\']*sell_item[^"\']*)["\']', block_html)
    link = BASE_URL + link_m.group(1) if link_m and link_m.group(1).startswith('/') else (link_m.group(1) if link_m else '')

    no_m = re.search(r'sell_item/([\w-]+)/', link)
    no = no_m.group(1) if no_m else ''

    title_m = re.search(r'class=["\'][^"\']*obj_title[^"\']*["\'][^>]*>([^<]+)', block_html)
    if not title_m:
        title_m = re.search(r'<h[23][^>]*>([^<]+)', block_html)
    title = title_m.group(1).strip() if title_m else text[:30]

    price_m = re.search(r'(\d[\d,]+)\s*萬', text)
    price = price_m.group(1).replace(',', '') + '萬' if price_m else ''

    type_m = re.search(r'透天|公寓|大樓|別墅|廠房|農地|土地|店面|華廈', text)
    ptype = type_m.group(0) if type_m else ''

    age_m = re.search(r'屋齡[：:\s]*([\d.]+)', text)
    age = age_m.group(1) + '年' if age_m else ''

    build_m = re.search(r'建物[^：:\d]*([\d.]+)\s*坪', text)
    build_ping = build_m.group(1) + '坪' if build_m else ''

    land_m = re.search(r'土地[^：:\d]*([\d.]+)\s*坪', text)
    land_ping = land_m.group(1) + '坪' if land_m else ''

    layout_m = re.search(r'(\d+房\d+廳\d+衛|\d+[LBDK房廳衛]+)', text)
    layout = layout_m.group(1) if layout_m else ''

    unit_m = re.search(r'單[坪價][：:\s]*([\d.]+)\s*萬', text)
    unit_price = unit_m.group(1) + '萬/坪' if unit_m else ''

    addr_m = re.search(r'[\u96f2\u5f70\u5357\u5317\u9ad8\u53f0\u5609\u5c4f][\u6797\u5316\u7fa9\u96c4\u5317\u5357\u6771\u897f\u90fd]+[\u7e23\u5e02].{2,20}[\u8def\u8857\u6bb5\u5df7\u5f04]', text)
    addr = addr_m.group(0).strip() if addr_m else ''

    img_m = re.search(r'<img[^>]+src=["\']([^"\']+\.jpg[^"\']*)["\']', block_html)
    img = img_m.group(1) if img_m else ''
    if img and img.startswith('/'):
        img = BASE_URL + img

    return {
        'no': no, 'title': title, 'price': price, 'addr': addr,
        'unit_price': unit_price, 'layout': layout, 'build_ping': build_ping,
        'land_ping': land_ping, 'age': age, 'type': ptype, 'category': '',
        'img': img, 'link': link,
    }

def fetch_page(page=1):
    url = f"{BASE_URL}/sell_item?storeid={STORE_ID}&p={page}"
    try:
        r = requests.get(url, headers=HEADERS, timeout=20, verify=False)
        r.encoding = 'utf-8'
        return r.text
    except Exception as e:
        print(f"  ❌ 第{page}頁失敗: {e}")
        return ''

def main():
    today = datetime.date.today().isoformat()
    print(f"🔄 同步物件清單（{today}）...")

    all_items = []
    seen = set()

    for page in range(1, 6):
        html = fetch_page(page)
        if not html:
            break

        blocks = re.findall(
            r'<li[^>]*class=["\'][^"\']*house_block[^"\']*["\'][^>]*>(.*?)</li>',
            html, re.DOTALL
        )

        if not blocks:
            print(f"  第{page}頁無物件，結束")
            break

        new = 0
        for b in blocks:
            item = parse_block(b)
            key = item['no'] or (item['title'] + item['price'])
            if key and key not in seen:
                seen.add(key)
                all_items.append(item)
                new += 1

        print(f"  第{page}頁：{new}筆，累計{len(all_items)}筆")

        if new == 0:
            break

    if not all_items:
        print("⚠️ 未抓到物件，保留舊資料")
        sys.exit(0)

    data = {'updated': today, 'total': len(all_items), 'items': all_items}
    output = os.path.normpath(OUTPUT_FILE)
    os.makedirs(os.path.dirname(output), exist_ok=True)
    with open(output, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"✅ 完成：共{len(all_items)}筆 → {output}")

if __name__ == '__main__':
    main()
