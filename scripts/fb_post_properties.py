#!/usr/bin/env python3
"""
每日自動將2則物件資訊發布到 Facebook 粉絲專頁
使用 Facebook Graph API
環境變數：
  FB_PAGE_ID      - 粉絲專頁 ID
  FB_ACCESS_TOKEN - 長效頁面存取權杖（Page Access Token）
"""
import json, os, sys, requests, datetime

PAGE_ID = os.environ.get('FB_PAGE_ID', '')
TOKEN = os.environ.get('FB_ACCESS_TOKEN', '')
PROPERTIES_FILE = os.path.join(os.path.dirname(__file__), '..', 'content', 'properties.json')
BASE_DATE = datetime.date(2026, 1, 1)

STORE_INFO = """公司：紅火房屋
經紀人證號：(113)雲縣地字第302號
📞 服務地址：雲林縣斗六市中正路312號"""

TYPE_EMOJI = {
    '透天': '🏡', '公寓': '🏢', '大樓': '🏬', '華廈': '🏛️',
    '農地': '🌾', '土地': '📐', '廠房': '🏭', '店面': '🏪', '別墅': '🏰',
}

def load_properties():
    with open(PROPERTIES_FILE, encoding='utf-8') as f:
        data = json.load(f)
    return data.get('items', [])

def pick_one(props):
    """固定公式：(day_num * 4 + offset) % len(props)，與 daily_avatar_post.py slot=2 一致，保證不重複"""
    offset = int(os.environ.get('POST_OFFSET', '0'))
    day_num = (datetime.date.today() - BASE_DATE).days
    idx = (day_num * 4 + offset) % len(props)
    return props[idx]

def already_posted_today(title):
    """查今天 FB 是否已有同物件貼文，避免重複發送"""
    if not PAGE_ID or not TOKEN:
        return False
    try:
        today_tw = datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=8))).date().isoformat()
        r = requests.get(
            f'https://graph.facebook.com/v19.0/{PAGE_ID}/posts',
            params={'access_token': TOKEN, 'fields': 'message,created_time', 'limit': 10},
            timeout=10
        )
        for post in r.json().get('data', []):
            post_date = post.get('created_time', '')[:10]
            if post_date == today_tw and title in post.get('message', ''):
                return True
    except Exception as e:
        print(f'[WARN] 查重複失敗（繼續發文）：{e}')
    return False

def make_post_text(prop):
    import re as _re
    emoji = TYPE_EMOJI.get(prop.get('type', ''), '🏠')
    title = prop.get('title', '優質物件')
    price = prop.get('price', '')
    addr = prop.get('addr', '')
    layout = prop.get('layout', '')
    build_ping = prop.get('build_ping', '')
    land_ping = prop.get('land_ping', '')
    age = prop.get('age', '')
    prop_type = prop.get('type', '')
    unit_price = prop.get('unit_price', '')
    link = prop.get('link', '')

    m = _re.match(r'^(.{2,4}?[鄉鎮市區])', addr or '')
    area_short = m.group(1) if m else (addr[:5] if addr else '雲林')
    is_land = prop_type in ('土地', '農地', '廠房', '建地')

    TAGS = {
        '透天': '#群義房屋雲科店 #雲林房地產 #房地產推薦 #斗六買房 #透天別墅',
        '土地': '#群義房屋雲科店 #雲林房地產 #房地產推薦 #斗六建地 #土地投資',
        '廠房': '#群義房屋雲科店 #雲林廠房 #斗六工業地 #廠房出售 #雲林房地產',
        '大樓': '#群義房屋雲科店 #雲林大樓 #斗六買房 #雲林房地產 #房地產推薦',
        '公寓': '#群義房屋雲科店 #雲林公寓 #斗六買房 #雲林房地產 #首購推薦',
        '農地': '#群義房屋雲科店 #雲林農地 #農地買賣 #雲林房地產 #田園生活',
    }
    tags = TAGS.get(prop_type, '#群義房屋雲科店 #雲林房地產 #斗六買房 #房地產推薦')

    if is_land:
        # ── 土地／農地／廠房 格式（簡潔投資導向）──────────────
        INTRO_LAND = {
            '農地': f'這是一塊專為田園愛好者準備的夢想基地！\n遠離塵囂、空氣清新，無論是農耕、休閒或長期投資，都是您最理想的選擇。',
            '土地': f'稀有釋出！{area_short}精華地段，地段決定價值。\n無論是規劃自建、資產配置，這裡都是{area_short}最值得把握的投資首選。',
            '廠房': f'廠房難求！{area_short}優質廠房正式釋出。\n合法丁建用地，大型車輛進出順暢，企業主的最佳選擇。',
        }
        intro = INTRO_LAND.get(prop_type, f'{area_short}稀有土地物件釋出，條件優越，機會難得！')

        CORE = {
            '農地': '農業用地，適合農耕、休閒或未來開發規劃',
            '土地': f'{"雙面臨路角地、" if "角" in title else ""}地段精華方正、機能極佳',
            '廠房': '合法丁建、大型車輛進出順暢、產業鏈串聯便利',
        }
        core = CORE.get(prop_type, '地形方正，開發規劃彈性大，投資自用兩相宜')

        text = f"""{emoji} {title} ✨

{intro}

——————————————

🏠 物件基本資訊：
• 物件名稱：{title}
• 物件位置：{addr if addr else area_short}
• 土地坪數：{land_ping if land_ping else '內洽'}
• 投資總價：{price}
• 核心特色：{core}

——————————————

機會不等人，地段決定一切！稀有大坪數角地難得釋出，歡迎您親臨現場感受其宏偉潛力。

📞 賞地專線：05-5362808
讓我們為您的資產增值計畫提供專業建議！

👉 完整物件資訊：{link}

——————————————

{STORE_INFO}

{tags}"""

    else:
        # ── 房屋（透天／公寓／大樓）格式（豐富生活導向）──────────────
        INTRO_HOUSE = {
            '透天': f'想要生活機能滿分，出門就是繁華商圈嗎？\n這間位於{area_short}的透天，無論是大家庭自住，或是想規劃收租的投資客，這間絕對是您的首選！',
            '大樓': f'精緻都會宅，坐擁{area_short}繁華！\n生活機能完善，出門即享便利生活，值得您來看看！',
            '公寓': f'溫馨好宅，{area_short}優質公寓！\n格局方正採光好，社區環境清幽，適合小家庭或首購族！',
            '華廈': f'{area_short}精華地段，品味華廈正式釋出！\n管理完善、環境優質，是您安居置業的最佳選擇！',
            '別墅': f'{area_short}稀有別墅，尊榮享受！\n寬敞庭院、採光絕佳，自住換屋的夢想居所！',
        }
        intro = INTRO_HOUSE.get(prop_type, f'{area_short}優質物件釋出，條件優越，歡迎把握機會！')

        FEATURES_HOUSE = {
            '透天': [f'獨棟透天，土地持分完整，未來增值空間大。', f'格局方正{("，" + layout) if layout else ""}，採光通風良好。', '自住換屋首選，鄰近生活機能。', '好房不等人，歡迎預約看屋！'],
            '大樓': [f'都市精華地段，生活機能完善。', f'格局{layout if layout else "方正"}，管理維護佳，社區環境優。', '鄰近學區商圈，交通四通八達。', '誠摯邀請您來電預約參觀。'],
            '公寓': [f'格局方正，採光通風良好{("，" + layout) if layout else ""}。', '社區環境清幽，鄰里和睦。', '生活機能完善，交通便利。', '適合首購族或小家庭，歡迎詢問。'],
            '華廈': [f'品質華廈，管理完善，社區環境優。', f'格局{layout if layout else "方正"}，採光通風良好。', '鄰近商圈學區，生活便利。', '誠摯邀請您來電預約參觀。'],
        }
        features = FEATURES_HOUSE.get(prop_type, ['物件條件優越，保值增值潛力佳。', '環境清幽，交通便利。', '歡迎來電洽詢，免費諮詢服務。', '誠意買家歡迎預約看屋。'])
        feature_lines = '\n'.join([f'✅ {f}' for f in features])

        text = f"""{emoji} {title} ✨

{intro}

——————————————

🏠 物件基本資訊：
• 物件案名：{title}
• 物件位置：{addr if addr else area_short}
• 銷售價格：{price}
• 物件建坪：{build_ping if build_ping else '內洽'}
• 房屋佈局：{layout if layout else '內洽'}
• 房屋屋齡：{age if age else '內洽'}

——————————————

🌟 物件特色賣點：
{feature_lines}

——————————————

好房不等人，稀有物件釋出趕緊把握！🏠
現在就拿起電話預約現場看屋，讓小編陪您一起找尋夢想中的家！
💬 歡迎私訊粉專，或直接撥打服務專線預約。

👉 完整物件資訊：{link}

——————————————

{STORE_INFO}

{tags}"""

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
        post_id = result['id']
        print(f"[OK] 發文成功：ID={post_id}")
        from fb_verify import verify_post
        if not verify_post(post_id, TOKEN, PAGE_ID):
            print('[WARN] 驗證失敗，請手動確認')
        return True
    else:
        print(f"[ERROR] 發文失敗：{result}")
        return False

def main():
    props = load_properties()
    if not props:
        print("[WARN] 無物件資料")
        sys.exit(0)

    prop = pick_one(props)
    offset = os.environ.get('POST_OFFSET', '0')
    print(f"今日物件（offset={offset}）：{prop.get('title','')}")

    # ── 防重複發文 ──────────────────────────
    title = prop.get('title', '')
    if already_posted_today(title):
        print(f"[SKIP] 今天已發過「{title}」，跳過。")
        sys.exit(0)

    text = make_post_text(prop)
    image_url = prop.get('img', '')
    print(text[:100] + '...')
    success = post_to_fb(text, image_url if image_url else None)
    if not success:
        sys.exit(1)

if __name__ == '__main__':
    main()
