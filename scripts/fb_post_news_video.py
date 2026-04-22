#!/usr/bin/env python3
"""
每日 09:00 抓取房市新聞（第2則）→ edge-tts 語音 → ffmpeg 影片 → 發布到 Facebook
環境變數：FB_PAGE_ID, FB_ACCESS_TOKEN
"""
import asyncio, json, os, sys, requests, datetime, re, xml.etree.ElementTree as ET
import subprocess, tempfile

PAGE_ID = os.environ.get('FB_PAGE_ID', '')
TOKEN   = os.environ.get('FB_ACCESS_TOKEN', '')
HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
today   = datetime.date.today().strftime('%Y-%m-%d')

STORE_INFO = """🏠 群義房屋｜雲林雲科加盟店
📞 05-5362808
📍 斗六市中正路312號"""

HIGH_KW = ['聯準會','Fed','升息','降息','利率','房貸','外資','景氣','通膨','預售屋','實價','重劃']

def fetch_news(rank=2):
    """抓第 rank 高分新聞（避免與 08:30 文字貼重複）"""
    import warnings; warnings.filterwarnings('ignore')
    news = []
    for url, src in [
        ('https://www.myhousing.com.tw/feed', '住展房屋網'),
        ('https://house.ettoday.net/rss.xml', 'ETtoday房產'),
    ]:
        try:
            r = requests.get(url, headers=HEADERS, timeout=10, verify=False)
            root = ET.fromstring(r.content)
            for item in root.iter('item'):
                title = item.findtext('title', '').strip()
                link  = item.findtext('link', '').strip()
                if not title: continue
                score = sum(1 for k in HIGH_KW if k in title)
                news.append({'title': title, 'link': link, 'score': score, 'source': src})
        except Exception as e:
            print(f'[WARN] {src}: {e}')

    news = sorted(news, key=lambda x: x['score'], reverse=True)
    if not news:
        return '雲林房市行情穩定，自住需求持續', '', ''
    idx = min(rank - 1, len(news) - 1)
    return news[idx]['title'], news[idx]['link'], news[idx]['source']

def build_script(title):
    clean = re.sub(r'【[^】]*】', '', title).strip()
    clean = re.sub(r'　.+', '', clean).strip()
    if len(clean) > 28:
        clean = clean[:28] + '…'
    return f"""大家好，我是群義房屋雲科店。

今日房市快訊——
{clean}

這則消息直接影響台灣的房貸利率與資金走向。

對雲林、斗六的買家來說，
現在掌握資訊，就是掌握先機。

想了解在地最新行情，歡迎來電，
電話 0 5，5 3 6 2 8 0 8，
不推銷，只給您最真實的建議。"""

async def gen_audio(script, audio_path):
    import edge_tts
    tts = edge_tts.Communicate(script, voice='zh-TW-HsiaoChenNeural', rate='+5%')
    await tts.save(audio_path)
    print(f'[OK] 語音：{audio_path}')

def gen_video(audio_path, video_path):
    # 背景圖：repo 內的 storefront.jpg
    bg = os.path.join(os.path.dirname(__file__), '..', 'public', 'images', 'storefront.jpg')
    if not os.path.exists(bg):
        # 備用：純黑底
        bg = None

    try:
        import imageio_ffmpeg
        ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:
        ffmpeg = 'ffmpeg'

    if bg:
        cmd = [ffmpeg, '-y', '-loop', '1', '-i', bg, '-i', audio_path,
               '-vf', 'scale=1080:1080:force_original_aspect_ratio=increase,crop=1080:1080,format=yuv420p',
               '-c:v', 'libx264', '-preset', 'fast', '-c:a', 'aac',
               '-shortest', '-movflags', '+faststart', video_path]
    else:
        cmd = [ffmpeg, '-y', '-f', 'lavfi', '-i', 'color=c=0x0F4D24:size=1080x1080:rate=25',
               '-i', audio_path, '-c:v', 'libx264', '-preset', 'fast', '-c:a', 'aac',
               '-shortest', '-movflags', '+faststart', video_path]

    r = subprocess.run(cmd, capture_output=True)
    if r.returncode == 0:
        size = os.path.getsize(video_path) / 1024 / 1024
        print(f'[OK] 影片：{video_path} ({size:.1f} MB)')
    else:
        print(f'[ERROR] ffmpeg: {r.stderr[-300:]}')
        sys.exit(1)

def post_video_to_fb(video_path, title, link):
    if not PAGE_ID or not TOKEN:
        print('[ERROR] 缺少 FB 環境變數')
        sys.exit(1)

    desc = f"""📺【今日房市播報】

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
            data={'description': desc, 'access_token': TOKEN},
            files={'source': ('news_video.mp4', vf, 'video/mp4')},
            timeout=180
        )
    d = r.json()
    if 'id' in d:
        post_id = d['id']
        print(f'[OK] 影片發文成功 ID={post_id}')
        from fb_verify import verify_video_post
        if not verify_video_post(post_id, TOKEN):
            print('[WARN] 驗證失敗，請手動確認')
    else:
        print(f'[ERROR] {d}')
        sys.exit(1)

async def main():
    # 1. 取新聞
    title, link, source = fetch_news(rank=2)
    print(f'新聞（第2則）：{title}')

    with tempfile.TemporaryDirectory() as tmpdir:
        audio_path = os.path.join(tmpdir, 'news_audio.mp3')
        video_path = os.path.join(tmpdir, 'news_video.mp4')

        # 2. 產語音
        script = build_script(title)
        await gen_audio(script, audio_path)

        # 3. 產影片
        gen_video(audio_path, video_path)

        # 4. 發 FB
        post_video_to_fb(video_path, title, link)

if __name__ == '__main__':
    asyncio.run(main())
