#!/usr/bin/env python3
"""
每日 08:30 自動抓取房市新聞 → AI 生成配圖 → 發布到 Facebook
圖片生成：Pollinations.ai（免費）+ Pillow 合成中文字與品牌
環境變數：FB_PAGE_ID, FB_ACCESS_TOKEN
"""
import json, os, sys, requests, datetime, random, re, time, io, urllib.parse
import xml.etree.ElementTree as ET
from PIL import Image, ImageDraw, ImageFont

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

def _extract_scene_from_title(title: str) -> dict:
    """
    從新聞標題萃取具體場景元素，讓每則新聞產生獨特畫面。
    回傳 dict: scene(背景), color(色調), mood(氛圍)
    """
    # ── 地點萃取 ──
    city_map = {
        '台北':'Taipei city skyline with iconic 101 tower',
        '新北':'New Taipei suburban residential area',
        '台中':'Taichung modern city center',
        '台南':'Tainan historic city blending old and new buildings',
        '高雄':'Kaohsiung harbor waterfront with modern skyline',
        '桃園':'Taoyuan commercial district',
        '雲林':'Yunlin Taiwan countryside with farmland and small town',
        '斗六':'Douliou city center, Yunlin Taiwan',
        '虎尾':'Huwei district, Yunlin Taiwan rural town',
    }
    city_scene = next((v for k, v in city_map.items() if k in title), 'Taiwan city')

    # ── 主題萃取 ──
    if any(k in title for k in ['升息','降息','利率','聯準會','Fed']):
        bg = f'dramatic financial district with {city_scene} backdrop, glowing blue interest rate graph curves soaring upward, golden coins in foreground, cinematic depth of field'
        color = 'navy blue, electric blue, gold'
        mood = 'urgent, impactful, financial power'

    elif any(k in title for k in ['通膨','物價','CPI','貨幣']):
        bg = f'abstract economy visualization: stacks of Taiwan banknotes, price tags floating, {city_scene} in background'
        color = 'warm orange, dark red, white'
        mood = 'serious economic tension'

    elif any(k in title for k in ['預售屋','新建案','建商','新屋','完工']):
        bg = f'brand new modern apartment tower architectural render, glass curtain wall reflecting sunset, construction crane silhouette, {city_scene}'
        color = 'vibrant orange, steel blue, white'
        mood = 'aspirational, modern, forward-looking'

    elif any(k in title for k in ['農地','土地','建地','地價','徵收']):
        bg = f'aerial drone view of green farmland transitioning to urban development, boundary line splitting nature and city, {city_scene} skyline on horizon'
        color = 'deep forest green, golden earth tone, urban gray'
        mood = 'vast, strategic, land value'

    elif any(k in title for k in ['房價','漲','創新高','突破','上漲']):
        bg = f'{city_scene} luxury residential towers at dusk with warm glowing amber windows, bold upward arrow light beam cutting through clouds, reflecting pool below'
        color = 'crimson red, amber gold, charcoal'
        mood = 'powerful upward momentum, prosperity'

    elif any(k in title for k in ['房價','跌','下跌','降價','修正','崩']):
        bg = f'{city_scene} wide-angle residential panorama under overcast dramatic sky, downward diagonal composition, cool tones'
        color = 'steel blue, dark gray, muted white'
        mood = 'cautious, analytical, market correction'

    elif any(k in title for k in ['成交','實價','行情','買氣','市況']):
        bg = f'{city_scene} busy real estate office interior with agents and clients, large window view of city, transaction documents on desk in foreground'
        color = 'warm professional brown, white, gold'
        mood = 'active market, professional trust'

    elif any(k in title for k in ['租金','出租','租屋','包租','房東']):
        bg = f'stylish bright modern apartment interior, floor-to-ceiling windows overlooking {city_scene}, Nordic furniture, warm afternoon sunlight'
        color = 'natural wood, sage green, warm white'
        mood = 'lifestyle, comfort, home feeling'

    elif any(k in title for k in ['政策','打炒房','央行','金管會','財政部','規定','限制']):
        bg = f'Taiwan Presidential Office or government building at golden hour, bold symmetrical architecture, strong perspective vanishing lines, official atmosphere, {city_scene} in background'
        color = 'deep presidential blue, white, silver'
        mood = 'authoritative, policy-driven, official'

    elif any(k in title for k in ['房貸','貸款','銀行','信貸','利率']):
        bg = f'modern bank branch exterior with glass facade, Taiwan family couple looking at documents inside, {city_scene} reflected in windows'
        color = 'trustworthy blue, clean white, forest green'
        mood = 'trust, financial planning, family future'

    elif any(k in title for k in ['外資','外國','投資','資金']):
        bg = f'global financial concept: world map with glowing fund flow lines converging on Taiwan, {city_scene} highlighted with golden light beam from above'
        color = 'deep space blue, glowing gold, cyan'
        mood = 'global scale, capital power, international'

    elif any(k in title for k in ['豪宅','奢華','頂級','億']):
        bg = f'ultra-luxury penthouse with panoramic view of {city_scene} at night, infinity pool on rooftop terrace, sparkling city lights below'
        color = 'black, champagne gold, platinum white'
        mood = 'ultimate luxury, exclusivity, prestige'

    else:
        bg = f'stunning {city_scene} urban real estate panorama, modern glass skyscrapers reflecting dramatic sunset clouds, wide cinematic shot'
        color = 'deep red, white, charcoal gray'
        mood = 'professional real estate, trustworthy brand'

    return {'bg': bg, 'color': color, 'mood': mood}


def news_to_image_prompt(title, source):
    """
    每則新聞 → 獨特場景 prompt
    世界頂級設計美學：品牌識別 + 繁體中文標題 + 動態場景
    """
    short_title = title[:18] + ('…' if len(title) > 18 else '')
    scene_data = _extract_scene_from_title(title)

    prompt = (
        # 1. 背景場景（依新聞動態生成）
        f"Background scene: {scene_data['bg']}. "

        # 2. 設計版型
        f"Layout: professional square social media poster design, "
        f"top 65% is the vivid background photo, "
        f"middle has a bold semi-transparent dark overlay band, "
        f"bottom 20% is a solid dark crimson (#8B0000) footer bar. "

        # 3. 繁體中文標題文字
        f"Typography: large bold Traditional Chinese text \"{short_title}\" "
        f"rendered in crisp white with subtle black drop shadow, "
        f"positioned center-left over the dark overlay band, "
        f"font style: heavy sans-serif, editorial newspaper headline style. "

        # 4. 品牌識別
        f"Brand footer: inside the crimson footer bar, "
        f"left side shows white Traditional Chinese text \"群義房屋｜雲林雲科加盟店\" in bold, "
        f"right side shows smaller white text \"專業雲林在地房仲\". "

        # 5. 色調與氛圍
        f"Color palette: {scene_data['color']}. "
        f"Mood: {scene_data['mood']}. "

        # 6. 品質指令
        f"Quality: award-winning graphic design, "
        f"4K ultra sharp, professional print quality, "
        f"no watermark, no extra text besides specified Chinese text, "
        f"designed by world-class Taiwanese editorial art director."
    )
    return prompt

def _find_font(size: int) -> ImageFont.FreeTypeFont:
    """尋找系統中文字型，依優先順序嘗試"""
    candidates = [
        # Windows 標準中文字體
        'C:/Windows/Fonts/msjh.ttc',       # 微軟正黑體
        'C:/Windows/Fonts/msjhbd.ttc',     # 微軟正黑體 Bold
        'C:/Windows/Fonts/mingliu.ttc',    # 細明體
        'C:/Windows/Fonts/kaiu.ttf',       # 標楷體
        'C:/Windows/Fonts/simsun.ttc',     # 宋體
        'C:/Windows/Fonts/arial.ttf',      # fallback
    ]
    for path in candidates:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                continue
    return ImageFont.load_default()


def generate_news_image(scene_prompt: str, title: str = '') -> bytes | None:
    """
    免費圖片生成流程：
    1. Pollinations.ai 生成背景（免費，無需 API Key）
    2. Pillow 合成：暗色遮罩 + 繁體中文標題 + 品牌底欄
    回傳 PNG bytes（直接傳給 FB /photos 的 source 欄位）
    """
    print(f'[IMG] Pollinations 生成背景中...')
    try:
        encoded = urllib.parse.quote(scene_prompt)
        url = f'https://image.pollinations.ai/prompt/{encoded}?width=1024&height=1024&nologo=true&seed={random.randint(1,99999)}'
        r = requests.get(url, timeout=60)
        if r.status_code != 200:
            print(f'[WARN] Pollinations 失敗 {r.status_code}')
            return None
        bg = Image.open(io.BytesIO(r.content)).convert('RGB').resize((1024, 1024))
    except Exception as e:
        print(f'[WARN] 背景圖下載失敗：{e}')
        return None

    draw = ImageDraw.Draw(bg)
    W, H = 1024, 1024

    # ── 1. 中間標題區暗色半透明遮罩 ──
    overlay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    ov_draw = ImageDraw.Draw(overlay)
    ov_draw.rectangle([(0, int(H*0.58)), (W, int(H*0.78))], fill=(0, 0, 0, 160))
    bg = Image.alpha_composite(bg.convert('RGBA'), overlay).convert('RGB')
    draw = ImageDraw.Draw(bg)

    # ── 2. 品牌底欄（深紅色實底）──
    footer_y = int(H * 0.82)
    draw.rectangle([(0, footer_y), (W, H)], fill=(139, 0, 0))

    # ── 3. 繁體中文標題 ──
    if title:
        short = title[:18] + ('…' if len(title) > 18 else '')
        font_title = _find_font(52)
        # 陰影
        draw.text((42, int(H*0.61)), short, font=font_title, fill=(0, 0, 0))
        draw.text((40, int(H*0.60)), short, font=font_title, fill=(255, 255, 255))

    # ── 4. 品牌文字 ──
    font_brand = _find_font(40)
    font_sub   = _find_font(28)
    draw.text((30, footer_y + 18), '群義房屋｜雲林雲科加盟店', font=font_brand, fill=(255, 255, 255))
    draw.text((W - 280, footer_y + 28), '專業雲林在地房仲', font=font_sub, fill=(255, 220, 180))

    # ── 5. 輸出 PNG bytes ──
    buf = io.BytesIO()
    bg.save(buf, format='PNG')
    print(f'[IMG] 合成完成（{len(buf.getvalue())//1024} KB）')
    return buf.getvalue()

def post_to_fb(text, img_bytes=None):
    if not PAGE_ID or not TOKEN:
        print('[ERROR] 缺少 FB 環境變數')
        sys.exit(1)

    if img_bytes:
        # 附圖發文（直接上傳 bytes，不需圖片託管）
        r = requests.post(
            f'https://graph.facebook.com/v19.0/{PAGE_ID}/photos',
            data={'message': text, 'access_token': TOKEN},
            files={'source': ('news.png', img_bytes, 'image/png')},
            timeout=60
        )
    else:
        # 純文字發文
        r = requests.post(
            f'https://graph.facebook.com/v19.0/{PAGE_ID}/feed',
            data={'message': text, 'access_token': TOKEN},
            timeout=30
        )

    d = r.json()
    if 'id' in d:
        post_id = d['id']
        print(f'[OK] 發文成功 ID={post_id}（{"含圖" if img_bytes else "純文字"}）')
        from fb_verify import verify_post
        if not verify_post(post_id, TOKEN, PAGE_ID):
            print('[WARN] 驗證失敗，請手動確認')
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

    # 免費生成配圖（Pollinations.ai + Pillow，0點數）
    scene_prompt = news_to_image_prompt(top['title'], top['source'])
    img_bytes = generate_news_image(scene_prompt, title=top['title'])

    post_to_fb(text, img_bytes)

if __name__ == '__main__':
    main()
