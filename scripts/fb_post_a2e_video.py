#!/usr/bin/env python3
"""
每2天：A2E.ai 數字人影片 → 發布到 Facebook
流程：抓物件資料 → edge-tts語音 → 上傳R2 → A2E.ai生成 → 下載 → 發FB
環境變數：FB_PAGE_ID, FB_ACCESS_TOKEN, A2E_TOKEN, A2E_USER_ID
"""
import asyncio, json, os, sys, requests, datetime, re, hashlib, random
import tempfile, time
sys.stdout.reconfigure(encoding='utf-8') if hasattr(sys.stdout, 'reconfigure') else None

PAGE_ID    = os.environ.get('FB_PAGE_ID', '')
FB_TOKEN   = os.environ.get('FB_ACCESS_TOKEN', '')
A2E_TOKEN  = os.environ.get('A2E_TOKEN', '')
A2E_UID    = os.environ.get('A2E_USER_ID', '69e1a0c44d8259007f55495f')
AVATAR_URL = os.environ.get('A2E_AVATAR_URL', '')

PROPERTIES_FILE = os.path.join(os.path.dirname(__file__), '..', 'content', 'properties.json')

HEADERS_A2E = {
    'Authorization': f'Bearer {A2E_TOKEN}',
    'Content-Type': 'application/json',
    'Origin': 'https://video.a2e.ai',
    'Referer': 'https://video.a2e.ai/'
}

TYPE_EMOJI = {
    '透天': '🏡', '公寓': '🏢', '大樓': '🏬', '華廈': '🏛️',
    '農地': '🌾', '土地': '📐', '廠房': '🏭', '店面': '🏪', '別墅': '🏰',
}

STORE_INFO = """🏠 群義房屋｜雲林雲科加盟店
📞 05-5362808
📍 斗六市中正路312號"""

# ── 抓物件資料 ──────────────────────────────────
def pick_property():
    with open(PROPERTIES_FILE, encoding='utf-8') as f:
        data = json.load(f)
    props = data.get('items', [])
    if not props:
        return None
    # 每2天輪替不重複（用日期做 seed）
    today = datetime.date.today().isoformat()
    day_num = (datetime.date.today() - datetime.date(2026, 1, 1)).days
    idx = day_num % len(props)
    return props[idx]

# ── 產口播稿（8秒）──────────────────────────────
def build_script(prop):
    title     = prop.get('title', '優質物件')
    price     = prop.get('price', '')
    addr      = prop.get('addr', '')
    layout    = prop.get('layout', '')
    prop_type = prop.get('type', '')
    return (
        f"大家好，我是群義房屋雲科店。"
        f"今日為您推薦「{title}」，"
        f"位於{addr}，"
        f"類型{prop_type}，格局{layout}，"
        f"售價{price}。"
        f"有興趣歡迎來電，電話 05，5362808。"
    )

def build_fb_text(prop):
    emoji     = TYPE_EMOJI.get(prop.get('type', ''), '🏠')
    title     = prop.get('title', '優質物件')
    price     = prop.get('price', '')
    addr      = prop.get('addr', '')
    layout    = prop.get('layout', '')
    build_ping= prop.get('build_ping', '')
    age       = prop.get('age', '')
    prop_type = prop.get('type', '')
    unit_price= prop.get('unit_price', '')
    link      = prop.get('link', '')
    return f"""{emoji}【今日物件推薦】{title}

💰 售價：{price}
📍 地址：{addr}
🏠 類型：{prop_type}
📐 格局：{layout}
📏 建坪：{build_ping}
🕐 屋齡：{age}
💵 單價：{unit_price}

👉 物件詳情：{link}

有興趣歡迎致電或私訊，提供免費帶看服務 😊

{STORE_INFO}

#雲林買房 #斗六房屋 #群義房屋 #{prop_type} #{addr[:4]}"""

# ── edge-tts 產語音 ──────────────────────────────
async def gen_audio(script, path):
    import edge_tts
    tts = edge_tts.Communicate(script, voice='zh-TW-HsiaoChenNeural', rate='+5%')
    await tts.save(path)
    print(f'[OK] 語音：{path}')

# ── 上傳到 A2E R2 ────────────────────────────────
def upload_to_r2(file_path, key, file_type):
    """取得預簽URL → 上傳檔案 → 回傳公開URL"""
    r = requests.post(
        'https://video.a2e.ai/api/v1/r2/upload-presigned-url',
        headers=HEADERS_A2E,
        json={'key': f'{A2E_UID}/{key}', 'fileType': file_type},
        timeout=30
    )
    d = r.json()
    if d.get('code') != 0:
        raise Exception(f'取得預簽URL失敗：{d}')

    upload_url = d['data']['uploadUrl']
    public_url = d['data'].get('publicUrl') or upload_url.split('?')[0]

    # 上傳
    with open(file_path, 'rb') as f:
        requests.put(upload_url, data=f,
                     headers={'Content-Type': file_type}, timeout=60)
    print(f'[OK] 上傳完成：{public_url[:60]}...')
    return public_url

# ── A2E.ai 生成影片 ──────────────────────────────
def a2e_generate(image_url, audio_url, name):
    """呼叫 A2E.ai talkingPhoto/start"""
    r = requests.post(
        'https://video.a2e.ai/api/v1/talkingPhoto/start',
        headers=HEADERS_A2E,
        json={
            'name': name,
            'image_url': image_url,
            'audio_url': audio_url,
        },
        timeout=30
    )
    d = r.json()
    print(f'[A2E start] {r.status_code} {json.dumps(d)[:200]}')
    if d.get('code') != 0:
        raise Exception(f'A2E生成失敗：{d}')
    task_id = d['data'].get('id') or d['data'].get('task_id') or d['data'].get('_id')
    return task_id

# ── 等待完成並下載 ────────────────────────────────
def wait_and_download(task_id, output_path, max_wait=600):
    print(f'[..] 等待 A2E.ai 生成（task={task_id}）...')
    for i in range(max_wait // 15):
        time.sleep(15)
        r = requests.get(
            f'https://video.a2e.ai/api/v1/talkingPhoto/task/{task_id}',
            headers=HEADERS_A2E, timeout=15
        )
        d = r.json()
        status = d.get('data', {}).get('status', '')
        print(f'  [{i*15}s] status={status}')
        if status in ('completed', 'done', 'success', 'finished'):
            video_url = d['data'].get('output_url') or d['data'].get('video_url') or d['data'].get('result_url')
            if video_url:
                resp = requests.get(video_url, timeout=120)
                with open(output_path, 'wb') as f:
                    f.write(resp.content)
                print(f'[OK] 下載完成：{output_path}')
                return True
        elif status in ('failed', 'error'):
            raise Exception(f'A2E生成失敗：{d}')
    raise Exception('A2E生成超時')

# ── 發布到 FB ────────────────────────────────────
def post_to_fb(video_path, prop):
    desc = build_fb_text(prop)
    print('[..] 上傳影片到 FB...')
    with open(video_path, 'rb') as vf:
        r = requests.post(
            f'https://graph.facebook.com/v19.0/{PAGE_ID}/videos',
            data={'description': desc, 'access_token': FB_TOKEN},
            files={'source': ('avatar.mp4', vf, 'video/mp4')},
            timeout=300
        )
    d = r.json()
    if 'id' in d:
        print(f'[OK] FB發文成功 ID={d["id"]}')
    else:
        print(f'[ERROR] {d}')
        sys.exit(1)

# ── 主流程 ────────────────────────────────────────
async def main():
    if not A2E_TOKEN:
        print('[ERROR] 缺少 A2E_TOKEN 環境變數')
        sys.exit(1)

    today = datetime.date.today().strftime('%Y%m%d')

    # 1. 抓物件
    prop = pick_property()
    if not prop:
        print('[ERROR] 無物件資料')
        sys.exit(1)
    print(f'[物件] {prop.get("title","")} | {prop.get("price","")} | {prop.get("addr","")}')

    with tempfile.TemporaryDirectory() as tmpdir:
        audio_path = os.path.join(tmpdir, 'voice.mp3')
        video_path = os.path.join(tmpdir, 'avatar.mp4')

        # 2. 產語音
        script = build_script(prop)
        print(f'[稿] {script}')
        await gen_audio(script, audio_path)

        # 3. 上傳音檔到 R2
        audio_url = upload_to_r2(audio_path, f'audio/{today}.mp3', 'audio/mpeg')

        # 4. A2E.ai 生成
        task_id = a2e_generate(AVATAR_URL, audio_url, f'prop_{today}')
        wait_and_download(task_id, video_path)

        # 5. 發FB（帶完整物件資訊）
        post_to_fb(video_path, prop)

if __name__ == '__main__':
    asyncio.run(main())
