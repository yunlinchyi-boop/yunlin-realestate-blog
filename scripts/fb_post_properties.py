#!/usr/bin/env python3
"""
每日自動將2則物件資訊發布到 Facebook 粉絲專頁
使用 Facebook Graph API
環境變數：
  FB_PAGE_ID      - 粉絲專頁 ID
  FB_ACCESS_TOKEN - 長效頁面存取權杖（Page Access Token）
"""
import json, os, sys, requests, datetime, hashlib, random

PAGE_ID = os.environ.get('FB_PAGE_ID', '')
TOKEN = os.environ.get('FB_ACCESS_TOKEN', '')
PROPERTIES_FILE = os.path.join(os.path.dirname(__file__), '..', 'content', 'properties.json')

STORE_INFO = """📞 群義房屋雲科店：05-5362808
🌐 https://www.chyi.com.tw/store/055362808
📍 640雲林縣斗六市中正路312號"""

TYPE_EMOJI = {
    '透天': '🏡', '公寓': '🏢', '大樓': '🏬', '華廈': '🏛️',
    '農地': '🌾', '土地': '📐', '廠房': '🏭', '店面': '🏪', '別墅': '🏰',
}

def load_properties():
    with open(PROPERTIES_FILE, encoding='utf-8') as f:
        data = json.load(f)
    return data.get('items', [])

def pick_two(props):
    """每天固定選2筆（用日期做種子，不重複連續）"""
    today = datetime.date.today().isoformat()
    seed = int(hashlib.md5(today.encode()).hexdigest(), 16)
    rng = random.Random(seed)
    indices = rng.sample(range(len(props)), min(2, len(props)))
    return [props[i] for i in indices]

def make_post_text(prop):
    emoji = TYPE_EMOJI.get(prop.get('type', ''), '🏠')
    title = prop.get('title', '優質物件')
    price = prop.get('price', '')
    addr = prop.get('addr', '')
    layout = prop.get('layout', '')
    build_ping = prop.get('build_ping', '')
    age = prop.get('age', '')
    prop_type = prop.get('type', '')
    unit_price = prop.get('unit_price', '')
    link = prop.get('link', '')

    text = f"""{emoji}【今日物件推薦】{title}

💰 售價：{price}
📍 地址：{addr}
🏠 類型：{prop_type}
📐 格局：{layout}
📏 建坪：{build_ping}
🕐 屋齡：{age}
💵 單價：{unit_price}

👉 物件詳情：{link}

有興趣歡迎致電或私訊，我們提供免費帶看服務 😊

{STORE_INFO}

#雲林買房 #斗六房屋 #群義房屋 #{prop_type} #{addr[:4]}"""

    return text

def post_to_fb(text, image_url=None):
    if not PAGE_ID or not TOKEN:
        print("[ERROR] 缺少 FB_PAGE_ID 或 FB_ACCESS_TOKEN 環境變數")
        return False

    url = f"https://graph.facebook.com/v19.0/{PAGE_ID}/photos" if image_url else \
          f"https://graph.facebook.com/v19.0/{PAGE_ID}/feed"

    payload = {'access_token': TOKEN, 'message': text}
    if image_url:
        payload['url'] = image_url

    r = requests.post(url, data=payload, timeout=30)
    result = r.json()

    if 'id' in result:
        print(f"[OK] 發文成功：ID={result['id']}")
        return True
    else:
        print(f"[ERROR] 發文失敗：{result}")
        return False

def main():
    props = load_properties()
    if not props:
        print("[WARN] 無物件資料")
        sys.exit(0)

    picks = pick_two(props)
    print(f"今日選出 {len(picks)} 個物件發文")

    for i, prop in enumerate(picks, 1):
        print(f"\n--- 第 {i} 篇 ---")
        text = make_post_text(prop)
        image_url = prop.get('img', '')
        print(text[:100] + '...')
        success = post_to_fb(text, image_url if image_url else None)
        if not success:
            sys.exit(1)
        if i < len(picks):
            import time; time.sleep(5)  # 避免連發過快

if __name__ == '__main__':
    main()
