#!/usr/bin/env python3
"""
每日自動將2則物件資訊發布到 Facebook 粉絲專頁
使用 Facebook Graph API
環境變數：
  FB_PAGE_ID      - 粉絲專頁 ID
  FB_ACCESS_TOKEN - 長效頁面存取權杖（Page Access Token）
"""
import json, os, sys, requests, datetime, random

PAGE_ID = os.environ.get('FB_PAGE_ID', '')
TOKEN = os.environ.get('FB_ACCESS_TOKEN', '')
PROPERTIES_FILE = os.path.join(os.path.dirname(__file__), '..', 'content', 'properties.json')
BASE_DATE = datetime.date(2026, 1, 1)

STORE_INFO = """🏠 群義房屋｜雲林雲科加盟店（紅火房屋仲介有限公司）
📜 113雲縣字第00302號
📞 05-5362808
📍 斗六市中正路312號"""

# 每種類型有多個 emoji，每次隨機挑一個
TYPE_EMOJI_POOL = {
    '透天': ['🏡', '🏠', '🏘️', '🏗️', '🔑', '🌟', '💎'],
    '公寓': ['🏢', '🏠', '🏙️', '🔑', '🌆', '✨', '💫'],
    '大樓': ['🏬', '🏙️', '🌇', '🏗️', '🔑', '⭐', '🌟'],
    '華廈': ['🏛️', '💎', '🏙️', '👑', '🌟', '✨', '🔑'],
    '農地': ['🌾', '🌿', '🌳', '🍃', '🌱', '🌻', '🏕️'],
    '土地': ['🗺️', '📍', '🌄', '🏔️', '🌏', '💡', '🔭'],
    '廠房': ['🏭', '⚙️', '🔧', '🏗️', '🚛', '🔩', '🏢'],
    '店面': ['🏪', '🛍️', '🏬', '💼', '💰', '🎯', '🌟'],
    '別墅': ['🏰', '🏡', '👑', '💎', '🌟', '🌺', '✨'],
}

def get_emoji(prop_type: str) -> str:
    pool = TYPE_EMOJI_POOL.get(prop_type, ['🏠', '🔑', '🌟', '✨', '💎', '🏙️', '🌆'])
    return random.choice(pool)

def load_properties():
    with open(PROPERTIES_FILE, encoding='utf-8') as f:
        data = json.load(f)
    return data.get('items', [])

def pick_one(props):
    """
    固定公式：(day_num * 4 + offset) % len(props)
    offset 優先讀 POST_OFFSET 環境變數；
    若未設定（例如 monitor 補跑的 workflow_dispatch），
    則自動依台灣時間判斷：08-12點=0, 12-15點=1, 15點以後=2
    """
    env_offset = os.environ.get('POST_OFFSET', '').strip()
    if env_offset.isdigit():
        offset = int(env_offset)
    else:
        # 自動依台灣時間決定 offset，防止補跑重複
        tw_hour = (datetime.datetime.utcnow() + datetime.timedelta(hours=8)).hour
        if tw_hour < 12:
            offset = 0
        elif tw_hour < 15:
            offset = 1
        else:
            offset = 2
    day_num = (datetime.date.today() - BASE_DATE).days
    idx = (day_num * 4 + offset) % len(props)
    return props[idx]

def check_token_expiry():
    """檢查 data_access_expires_at — 僅印 log，警告由 check-fb-token.yml 每週發 email"""
    if not PAGE_ID or not TOKEN:
        return
    try:
        app_id = '1743055436664534'
        app_secret = '69e072261ccfc3e5120459056e7527d6'
        r = requests.get(
            'https://graph.facebook.com/v19.0/debug_token',
            params={'input_token': TOKEN, 'access_token': f'{app_id}|{app_secret}'},
            timeout=10
        )
        data = r.json().get('data', {})
        expires_at = data.get('data_access_expires_at', 0)
        if expires_at:
            import time
            days_left = int((expires_at - time.time()) / 86400)
            print(f'[Token] data_access 剩餘 {days_left} 天')
    except Exception:
        pass  # 不影響發文流程

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
            # FB created_time 是 UTC，轉成台灣時間再比對
            ct = post.get('created_time', '')
            if ct:
                try:
                    dt_utc = datetime.datetime.fromisoformat(ct.replace('Z','+00:00'))
                    dt_tw  = dt_utc + datetime.timedelta(hours=8)
                    post_date = dt_tw.date().isoformat()
                except Exception:
                    post_date = ct[:10]
            else:
                continue
            if post_date == today_tw and title in post.get('message', ''):
                return True
    except Exception as e:
        print(f'[WARN] 查重複失敗（繼續發文）：{e}')
    return False

def make_post_text(prop):
    import re as _re
    title = prop.get('title', '優質物件')
    price = prop.get('price', '')
    addr = prop.get('addr', '')
    layout = prop.get('layout', '')
    build_ping = prop.get('build_ping', '')
    land_ping = prop.get('land_ping', '')
    prop_type = prop.get('type', '')
    link = prop.get('link', '')

    # 只取縣市層級（不顯示鄉鎮，避免地址過於精確）
    m = _re.match(r'^(.{2,3}[縣市])', addr or '')
    area_short = m.group(1) if m else '雲林縣'
    is_land = prop_type in ('土地', '農地', '廠房', '建地') or \
              (prop_type in ('其他', '') and any(k in title for k in ('農地', '建地', '土地', '廠房', '地')))

    TAGS = {
        '透天': '#群義房屋雲科店 #雲林房地產 #房地產推薦 #斗六買房 #透天別墅',
        '土地': '#群義房屋雲科店 #雲林房地產 #房地產推薦 #斗六建地 #土地投資',
        '廠房': '#群義房屋雲科店 #雲林廠房 #斗六工業地 #廠房出售 #雲林房地產',
        '大樓': '#群義房屋雲科店 #雲林大樓 #斗六買房 #雲林房地產 #房地產推薦',
        '公寓': '#群義房屋雲科店 #雲林公寓 #斗六買房 #雲林房地產 #首購推薦',
        '農地': '#群義房屋雲科店 #雲林農地 #農地買賣 #雲林房地產 #田園生活',
        '建地': '#群義房屋雲科店 #雲林房地產 #建地 #土地投資 #斗六買房',
    }
    tags = TAGS.get(prop_type, '#群義房屋雲科店 #雲林房地產 #斗六買房 #房地產推薦')

    FEATURE = {
        '農地': '農業用地，適合農耕、休閒或未來開發規劃，長期持有增值潛力佳。',
        '建地': '合法建地，可自建或開發，地形方正易規劃。',
        '土地': f'{"雙面臨路角地，" if "角" in title else ""}地段精華，投資自用兩相宜。',
        '廠房': '合法丁建用地，大型車輛進出順暢，產業鏈串聯便利。',
        '透天': '獨棟透天，土地持分完整，自住換屋首選。',
        '大樓': '生活機能完善，管理維護佳，交通四通八達。',
        '公寓': '格局方正採光好，社區環境清幽，適合小家庭或首購族。',
        '華廈': '品質華廈，管理完善，鄰近商圈學區。',
    }
    feature = FEATURE.get(prop_type, '物件條件優越，保值增值潛力佳，歡迎來電洽詢。')

    if is_land:
        emoji = '🌿' if prop_type == '農地' else ('🏗️' if prop_type == '建地' else '🌳')
        area_info = f'• 土地面積：{land_ping if land_ping else "內洽"}'
        text = f"""{emoji}【今日物件介紹】

物件名稱：{title}
{area_info}
• 建議總價：{price}
• 區域：{area_short if area_short else '內洽'}
• 物件特色：{feature}

不推銷、免費諮詢，有興趣歡迎私訊或來電 😊
🔗 完整資訊：{link}
➖➖➖➖➖➖➖➖
{STORE_INFO}

{tags}"""
    else:
        emoji = '🏡'
        text = f"""{emoji}【今日物件介紹】

物件名稱：{title}
• 格局：{layout if layout else '內洽'}
• 建議總價：{price}
• 區域：{area_short if area_short else '內洽'}
• 物件特色：{feature}

不推銷、免費諮詢，有興趣歡迎私訊或來電 😊
🔗 完整資訊：{link}
➖➖➖➖➖➖➖➖
{STORE_INFO}

{tags}"""

    return text

def post_to_fb(text, image_url=None):
    if not PAGE_ID or not TOKEN:
        print("[ERROR] 缺少 FB_PAGE_ID 或 FB_ACCESS_TOKEN 環境變數")
        return False

    url = f"https://graph.facebook.com/v19.0/{PAGE_ID}/photos" if image_url else \
          f"https://graph.facebook.com/v19.0/{PAGE_ID}/feed"

    if image_url:
        payload = {'access_token': TOKEN, 'caption': text, 'url': image_url, 'published': 'true'}
    else:
        payload = {'access_token': TOKEN, 'message': text}

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
    check_token_expiry()
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
