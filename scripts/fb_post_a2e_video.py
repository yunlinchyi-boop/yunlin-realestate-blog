#!/usr/bin/env python3
"""
每2天：A2E.ai 數字人影片 → 發布到 Facebook
流程：抓新聞 → edge-tts語音 → 上傳R2 → A2E.ai生成 → 下載 → 發FB
環境變數：FB_PAGE_ID, FB_ACCESS_TOKEN, A2E_TOKEN, A2E_USER_ID
"""
import asyncio, json, os, sys, requests, datetime, re
import xml.etree.ElementTree as ET
import tempfile, time
sys.stdout.reconfigure(encoding='utf-8') if hasattr(sys.stdout, 'reconfigure') else None

PAGE_ID   = os.environ.get('FB_PAGE_ID', '')
FB_TOKEN  = os.environ.get('FB_ACCESS_TOKEN', '')
A2E_TOKEN = os.environ.get('A2E_TOKEN', '')
A2E_UID   = os.environ.get('A2E_USER_ID', '69e1a0c44d8259007f55495f')
AVATAR_URL = os.environ.get('A2E_AVATAR_URL', '')  # 業務員照片公開URL

HEADERS_A2E = {
    'Authorization': f'Bearer {A2E_TOKEN}',
    'Content-Type': 'application/json',
    'Origin': 'https://video.a2e.ai',
    'Referer': 'https://video.a2e.ai/'
}
HEADERS_RSS = {'User-Agent': 'Mozilla/5.0'}
HIGH_KW = ['聯準會','Fed','升息','降息','利率','房貸','外資','景氣','通膨','預售屋','實價','重劃']

STORE_INFO = """🏠 群義房屋｜雲林雲科加盟店
📞 05-5362808
📍 斗六市中正路312號"""

# ── 抓新聞 ──────────────────────────────────────
def fetch_news():
    import warnings; warnings.filterwarnings('ignore')
    news = []
    for url, src in [
        ('https://www.myhousing.com.tw/feed', '住展房屋網'),
        ('https://house.ettoday.net/rss.xml', 'ETtoday房產'),
    ]:
        try:
            r = requests.get(url, headers=HEADERS_RSS, timeout=10, verify=False)
            root = ET.fromstring(r.content)
            for item in root.iter('item'):
                title = item.findtext('title', '').strip()
                link  = item.findtext('link', '').strip()
                if not title: continue
                score = sum(1 for k in HIGH_KW if k in title)
                news.append({'title': title, 'link': link, 'score': score})
        except Exception as e:
            print(f'[WARN] {e}')
    news = sorted(news, key=lambda x: x['score'], reverse=True)
    return news[0] if news else {'title': '雲林房市行情穩定，自住需求持續', 'link': ''}

# ── 產口播稿（8秒）──────────────────────────────
def build_script(title):
    clean = re.sub(r'【[^】]*】', '', title).strip()[:25]
    return f"大家好，我是群義房屋雲科店。今日房市快訊：{clean}。歡迎來電洽詢，電話 05，5362808。"

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
def post_to_fb(video_path, title, link):
    desc = f"""🎬【今日房市播報】

{title}

{('🔗 ' + link) if link else ''}

💡 這則消息對你的買房決策有什麼影響？歡迎私訊！

➖➖➖➖➖➖➖➖
{STORE_INFO}

#群義房屋雲科店 #雲林房地產 #斗六買房 #房市播報"""

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
    news = fetch_news()
    print(f'[新聞] {news["title"]}')

    with tempfile.TemporaryDirectory() as tmpdir:
        audio_path = os.path.join(tmpdir, 'voice.mp3')
        video_path = os.path.join(tmpdir, 'avatar.mp4')

        # 1. 產語音
        script = build_script(news['title'])
        print(f'[稿] {script}')
        await gen_audio(script, audio_path)

        # 2. 上傳音檔到 R2
        audio_url = upload_to_r2(audio_path, f'audio/{today}.mp3', 'audio/mpeg')

        # 3. A2E.ai 生成
        task_id = a2e_generate(AVATAR_URL, audio_url, f'news_{today}')
        wait_and_download(task_id, video_path)

        # 4. 發FB
        post_to_fb(video_path, news['title'], news['link'])

if __name__ == '__main__':
    asyncio.run(main())
