#!/usr/bin/env python3
"""
每日 08:30 自動抓取房市新聞 → AI 生成配圖 → 發布到 Facebook
圖片生成：Pollinations.ai（免費）+ Pillow 合成中文字與品牌
環境變數：FB_PAGE_ID, FB_ACCESS_TOKEN
"""
import json, os, sys, requests, datetime, random, re, time, io, urllib.parse
import xml.etree.ElementTree as ET
from PIL import Image, ImageDraw, ImageFont, ImageFilter

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
    """尋找系統中文字型，TTC 檔指定 index=0"""
    candidates = [
        ('C:/Windows/Fonts/msjhbd.ttc', 0),   # 微軟正黑體 Bold
        ('C:/Windows/Fonts/msjh.ttc',   0),   # 微軟正黑體
        ('C:/Windows/Fonts/kaiu.ttf',   None), # 標楷體
        ('C:/Windows/Fonts/mingliu.ttc',0),   # 細明體
        ('C:/Windows/Fonts/simsun.ttc', 0),   # 宋體
        ('C:/Windows/Fonts/arial.ttf',  None), # fallback
    ]
    for path, idx in candidates:
        if os.path.exists(path):
            try:
                if idx is not None:
                    return ImageFont.truetype(path, size, index=idx)
                return ImageFont.truetype(path, size)
            except Exception:
                continue
    return ImageFont.load_default()


def generate_news_image(scene_prompt: str, title: str = '') -> bytes | None:
    """
    純 Pillow 設計海報（免費、零外部依賴）：
    - 漸層背景依新聞類型換色
    - 幾何裝飾圖形
    - 繁體中文大標題
    - 品牌底欄
    """
    print(f'[IMG] 設計海報中...')
    W, H = 1024, 1024

    # ── 依 scene_prompt 關鍵字選配色方案 ──
    if 'navy blue' in scene_prompt or 'financial' in scene_prompt:
        c1, c2, accent = (10, 20, 60), (5, 60, 120), (255, 200, 50)    # 深藍金
    elif 'orange' in scene_prompt or 'construction' in scene_prompt:
        c1, c2, accent = (60, 20, 5), (140, 60, 10), (255, 160, 40)    # 深橙棕
    elif 'green' in scene_prompt or 'farmland' in scene_prompt:
        c1, c2, accent = (5, 40, 20), (10, 80, 40), (180, 220, 100)    # 深綠
    elif 'crimson' in scene_prompt or 'upward' in scene_prompt:
        c1, c2, accent = (50, 5, 5), (120, 10, 10), (255, 200, 100)    # 深紅金
    elif 'blue' in scene_prompt and 'white' in scene_prompt:
        c1, c2, accent = (10, 25, 70), (20, 50, 130), (200, 220, 255)  # 官方藍
    elif 'wood' in scene_prompt or 'apartment interior' in scene_prompt:
        c1, c2, accent = (40, 25, 10), (90, 60, 30), (220, 190, 140)   # 木質暖棕
    else:
        c1, c2, accent = (30, 5, 5), (100, 10, 10), (255, 210, 80)     # 預設深紅金

    # ── 1. 漸層背景 ──
    bg = Image.new('RGB', (W, H), c1)
    draw = ImageDraw.Draw(bg)
    for y in range(H):
        t = y / H
        r = int(c1[0] + (c2[0] - c1[0]) * t)
        g = int(c1[1] + (c2[1] - c1[1]) * t)
        b = int(c1[2] + (c2[2] - c1[2]) * t)
        draw.line([(0, y), (W, y)], fill=(r, g, b))

    # ── 2. 幾何裝飾（右側大圓＋斜線帶）──
    # 右上大圓（半透明 accent）
    circle_layer = Image.new('RGBA', (W, H), (0,0,0,0))
    cd = ImageDraw.Draw(circle_layer)
    cd.ellipse([(580, -120), (1100, 400)], fill=(*accent, 30))
    cd.ellipse([(640, -60), (1040, 340)], fill=(*accent, 20))
    # 右下小圓
    cd.ellipse([(750, 650), (980, 880)], fill=(*accent, 15))
    bg = Image.alpha_composite(bg.convert('RGBA'), circle_layer)

    # 斜線裝飾帶（左側）
    sl = Image.new('RGBA', (W, H), (0,0,0,0))
    sd = ImageDraw.Draw(sl)
    for i in range(0, 300, 40):
        sd.line([(i, 0), (0, i)], fill=(*accent, 40), width=2)
    bg = Image.alpha_composite(bg, sl).convert('RGB')
    draw = ImageDraw.Draw(bg)

    # ── 3. 頂部 accent 色橫條 ──
    draw.rectangle([(0, 0), (W, 8)], fill=accent)

    # ── 4. 標題區：左側色塊 ──
    title_y = int(H * 0.30)
    draw.rectangle([(0, title_y), (8, title_y + 200)], fill=accent)  # 左邊豎線

    # ── 5. 繁體中文大標題（自動換行，每14字一行）──
    if title:
        font_xl = _find_font(60)
        font_lg = _find_font(46)
        font_md = _find_font(34)
        lines = [title[i:i+14] for i in range(0, min(len(title), 42), 14)]
        fonts = [font_xl, font_lg, font_md]
        y_pos = title_y + 20
        for idx, line in enumerate(lines[:3]):
            fnt = fonts[min(idx, 2)]
            # 陰影
            draw.text((34, y_pos + 2), line, font=fnt, fill=(0, 0, 0))
            draw.text((32, y_pos),     line, font=fnt, fill=(255, 255, 255))
            bbox = draw.textbbox((0, 0), line, font=fnt)
            y_pos += (bbox[3] - bbox[1]) + 12

    # ── 6. accent 分隔線 ──
    sep_y = int(H * 0.75)
    draw.rectangle([(32, sep_y), (W - 32, sep_y + 3)], fill=(*accent, 200) if len(accent)==4 else accent)

    # ── 7. 來源小字 ──
    font_src = _find_font(26)
    draw.text((36, sep_y + 14), '📰 房市快訊', font=font_src, fill=accent)

    # ── 8. 品牌底欄（深紅色）──
    footer_y = int(H * 0.84)
    draw.rectangle([(0, footer_y), (W, H)], fill=(139, 0, 0))
    draw.line([(0, footer_y), (W, footer_y)], fill=accent, width=4)

    font_brand = _find_font(40)
    font_sub   = _find_font(27)
    draw.text((24, footer_y + 16), '群義房屋｜雲林雲科加盟店', font=font_brand, fill=(255, 255, 255))
    sub_text = '專業雲林在地房仲'
    bbox = draw.textbbox((0, 0), sub_text, font=font_sub)
    sub_w = bbox[2] - bbox[0]
    draw.text((W - sub_w - 24, footer_y + 26), sub_text, font=font_sub, fill=(255, 220, 170))

    # ── 9. 輸出 ──
    buf = io.BytesIO()
    bg.save(buf, format='PNG')
    print(f'[IMG] 海報完成（{len(buf.getvalue())//1024} KB）')
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
