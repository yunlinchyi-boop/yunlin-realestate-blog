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


def fetch_article_content(url: str) -> str:
    """抓新聞內文（純文字，取前800字分析用）"""
    if not url:
        return ''
    try:
        r = requests.get(url, headers=HEADERS, timeout=10, verify=False)
        # 簡單移除 HTML tag
        text = re.sub(r'<[^>]+>', ' ', r.text)
        text = re.sub(r'\s+', ' ', text)
        # 取中文段落
        chinese = re.findall(r'[\u4e00-\u9fff，。！？、：；「」【】\w]+', text)
        return ' '.join(chinese)[:800]
    except Exception:
        return ''


def analyze_content_for_image(title: str, content: str) -> dict:
    """
    讀新聞標題＋內文，判斷：
    1. Unsplash 搜尋關鍵字（英文）
    2. 海報配色
    3. 三條重點說明（繁體中文）
    """
    full = title + ' ' + content

    # ── 判斷主題（政策優先於純金融）──
    if any(k in full for k in ['打炒房','政策','內政部','財政部','金管會','禁止','限購']):
        query   = 'taiwan,government,parliament,official'
        colors  = {'bg1':'#0d1f3c','bg2':'#1a3560','accent':'#E8D080'}
        bullets = [
            ('政策方向影響市場信心', '觀察後續配套措施'),
            ('自住需求不受限制', '在地購屋族不必過度擔憂'),
            ('雲林房市基本面穩健', '歡迎免費諮詢評估'),
        ]

    elif any(k in full for k in ['聯準會','Fed','升息','降息','利率','央行','貨幣']):
        query   = 'bank,finance,interest-rate,money'
        colors  = {'bg1':'#0a1628','bg2':'#1a3a6b','accent':'#FFC328'}
        bullets = [
            ('房貸利率可能波動', '建議提前鎖定貸款條件'),
            ('自住族評估還款能力', '固定利率降低長期風險'),
            ('雲林房市受影響較小', '在地需求穩健支撐'),
        ]

    elif any(k in full for k in ['預售屋','新建案','建商','完工','交屋']):
        query   = 'construction,building,apartment,architecture,taiwan'
        colors  = {'bg1':'#1a2a0a','bg2':'#2d4a15','accent':'#90E050'}
        bullets = [
            ('新供給釋出 選擇更多', '評估建商信用與履約保證'),
            ('預售屋風險與機會並存', '找在地專業房仲把關'),
            ('雲林新案性價比高', '歡迎諮詢詳細資訊'),
        ]

    elif any(k in full for k in ['農地','土地','建地','地價','徵收','開發']):
        query   = 'farmland,aerial,countryside,land,taiwan'
        colors  = {'bg1':'#0a1e0a','bg2':'#143214','accent':'#80D840'}
        bullets = [
            ('土地資源日趨稀缺', '掌握開發動向是關鍵'),
            ('地價波動影響建案成本', '評估長期增值潛力'),
            ('雲林農地轉用值得關注', '專業諮詢免費提供'),
        ]

    elif any(k in full for k in ['房價','漲','創新高','突破','上漲','增值']):
        query   = 'cityscape,skyline,building,urban,taiwan'
        colors  = {'bg1':'#2a0505','bg2':'#5a0a0a','accent':'#FFC328'}
        bullets = [
            ('房價上漲趨勢持續', '自住族宜早不宜遲'),
            ('雲林房價仍相對親民', '是進場好時機'),
            ('長期持有 保值抗通膨', '立即免費諮詢'),
        ]

    elif any(k in full for k in ['下跌','修正','崩盤','跌價','量縮']):
        query   = 'city,buildings,residential,downtown'
        colors  = {'bg1':'#0a1520','bg2':'#102030','accent':'#60A8E0'}
        bullets = [
            ('市場修正 買點浮現', '理性評估長期價值'),
            ('自住需求不受短期波動影響', '把握好價入場時機'),
            ('雲林抗跌性相對佳', '專業評估免費諮詢'),
        ]

    elif any(k in full for k in ['租金','出租','租屋','包租','租賃']):
        query   = 'apartment,interior,living-room,home,modern'
        colors  = {'bg1':'#1a1205','bg2':'#2e200a','accent':'#D4A840'}
        bullets = [
            ('租金行情持續走升', '投資包租報酬可期'),
            ('評估租金收益率', '找在地專業管理'),
            ('雲林租屋需求穩定', '歡迎投資諮詢'),
        ]

    elif any(k in full for k in ['房貸','貸款','銀行','信貸','寬限期']):
        query   = 'bank,finance,family,home,document'
        colors  = {'bg1':'#051520','bg2':'#0a2535','accent':'#40C880'}
        bullets = [
            ('精算貸款成數與年限', '多家銀行比較最划算'),
            ('注意寬限期後還款壓力', '提前做好財務規劃'),
            ('群義專業協助貸款諮詢', '免費服務不收費'),
        ]

    else:
        query   = 'real-estate,taiwan,city,building,housing'
        colors  = {'bg1':'#1a0505','bg2':'#3a0a0a','accent':'#FFC328'}
        bullets = [
            ('掌握市場第一手資訊', '做出最正確的決策'),
            ('雲林在地專業服務', '20年深耕在地經驗'),
            ('免費諮詢 歡迎私訊', '群義房屋雲科加盟店'),
        ]

    return {'query': query, 'colors': colors, 'bullets': bullets}

def make_post(title, link, source):
    templates = [
        f"""📰 今日房市重點

【{source}】{title}

這則消息對雲林、斗六想買房的朋友可能有影響：
• 利率與資金走向持續變動
• 在地自住需求仍然穩定
• 現在掌握資訊，才能做對決策

有問題歡迎私訊，免費諮詢 😊
{('🔗 完整分析：' + link) if link else ''}

➖➖➖➖➖➖➖➖
{STORE_INFO}

#群義房屋雲科店 #雲林房地產 #斗六買房 #房市新聞""",

        f"""🏠 今日房市重點

【{source}】{title}

全球資金動向直接影響台灣房貸利率。
身為雲林在地房仲，我們幫你看懂市場！

💬 有疑問歡迎私訊，不推銷、純諮詢
{('🔗 完整分析：' + link) if link else ''}

➖➖➖➖➖➖➖➖
{STORE_INFO}

#群義房屋雲科店 #雲林房地產 #房市快訊""",

        f"""📊 今日房市重點

【{source}】{title}

雲林斗六在地房仲第一手觀察：
• 掌握市場動態，買賣不吃虧
• 雲林房市溫和穩健，自住好時機
• 免費諮詢，不推銷

{('🔗 ' + link) if link else ''}

➖➖➖➖➖➖➖➖
{STORE_INFO}

#群義房屋雲科店 #雲林房地產 #斗六房市"""
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


def _get_bullet_points_legacy(title: str) -> list[str]:
    """依新聞標題產生三條重點說明"""
    if any(k in title for k in ['升息','降息','利率','聯準會','Fed']):
        return ['房貸利率將隨之波動', '自住族提前評估還款能力', '鎖定固定利率降低風險']
    elif any(k in title for k in ['打炒房','政策','央行','規定','限制']):
        return ['回歸市場機制', '健全房市發展', '保障居住權益']
    elif any(k in title for k in ['預售屋','新建案','建商']):
        return ['新案供給量增加', '購屋前做好財務規劃', '在地需求持續穩健']
    elif any(k in title for k in ['農地','土地','建地','地價']):
        return ['土地資源日趨稀缺', '開發潛力值得關注', '在地投資機會浮現']
    elif any(k in title for k in ['房價','漲','創新高','突破']):
        return ['剛需族趁早進場', '雲林房價相對親民', '長期持有保值抗通膨']
    elif any(k in title for k in ['房價','跌','下跌','修正']):
        return ['市場修正買點浮現', '自住族把握進場時機', '理性評估長期價值']
    elif any(k in title for k in ['租金','出租','租屋']):
        return ['租金報酬率值得評估', '包租代管降低風險', '雲林租屋需求穩定']
    elif any(k in title for k in ['房貸','貸款','銀行']):
        return ['精算貸款成數與利率', '多家銀行比較最划算', '免費諮詢歡迎私訊']
    else:
        return ['掌握市場第一手資訊', '雲林在地專業服務', '免費諮詢歡迎私訊']


def _fetch_bg_photo(query: str) -> Image.Image | None:
    """從 Unsplash source 取得免費照片（無需 API Key）"""
    keywords = {
        'financial': 'bank,finance,city',
        'policy':    'taiwan,government,building',
        'apartment': 'apartment,modern,building',
        'land':      'farmland,aerial,nature',
        'luxury':    'luxury,penthouse,skyline',
        'interior':  'apartment,interior,modern',
        'cityview':  'city,skyline,taiwan',
    }
    kw = 'city,building,taiwan'
    for k, v in keywords.items():
        if k in query:
            kw = v
            break
    seed = random.randint(1, 500)
    url = f'https://source.unsplash.com/1024x1024/?{kw}&sig={seed}'
    try:
        r = requests.get(url, timeout=20, allow_redirects=True)
        if r.status_code == 200 and 'image' in r.headers.get('content-type', ''):
            return Image.open(io.BytesIO(r.content)).convert('RGB').resize((1024, 1024))
    except Exception as e:
        print(f'[WARN] Unsplash 失敗：{e}')
    return None


def _fetch_unsplash_photo(query: str) -> Image.Image | None:
    """Unsplash source（免費，無需 API Key）"""
    try:
        url = f'https://source.unsplash.com/1024x1024/?{query}&sig={random.randint(1,9999)}'
        r = requests.get(url, timeout=25, allow_redirects=True)
        if r.status_code == 200 and 'image' in r.headers.get('content-type',''):
            return Image.open(io.BytesIO(r.content)).convert('RGB').resize((1024,1024))
    except Exception as e:
        print(f'[WARN] Unsplash: {e}')
    return None


def fetch_og_image(url: str) -> bytes | None:
    """直接抓新聞文章的 OG 圖片（og:image meta tag）"""
    if not url:
        return None
    try:
        r = requests.get(url, headers=HEADERS, timeout=15, verify=False)
        # 找 og:image
        match = re.search(r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)["\']', r.text)
        if not match:
            match = re.search(r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+property=["\']og:image["\']', r.text)
        if not match:
            print('[IMG] 找不到 og:image')
            return None
        img_url = match.group(1).strip()
        print(f'[IMG] OG圖片：{img_url}')
        ir = requests.get(img_url, headers=HEADERS, timeout=20, verify=False)
        if ir.status_code == 200 and 'image' in ir.headers.get('content-type', ''):
            print(f'[IMG] 抓到 OG 圖片 {len(ir.content)//1024} KB')
            return ir.content
    except Exception as e:
        print(f'[WARN] fetch_og_image 失敗：{e}')
    return None


def generate_news_image(title: str, content: str = '') -> bytes | None:
    """
    讀新聞內文 → 分析主題 → 抓對應照片 → HTML 合成海報
    完全依新聞內容決定，不套固定公式
    ⚠️ 此函數已棄用（使用者要求不合成，改用 fetch_og_image 直接抓原圖）
    """
    print(f'[IMG] 分析新聞內容，設計海報中...')

    # 1. 分析內文決定配色、照片關鍵字、重點條列
    meta = analyze_content_for_image(title, content)
    c     = meta['colors']
    bulls = meta['bullets']
    query = meta['query']

    # 2. 載入本地主題照片（依新聞內容選對應圖）
    import base64, os as _os
    # 直接用 query 關鍵字對應本地照片
    if 'government' in query or 'parliament' in query or 'official' in query:
        photo_key = 'government'
    elif 'construction' in query or 'architecture' in query:
        photo_key = 'building'
    elif 'farmland' in query or 'countryside' in query or 'land' in query:
        photo_key = 'land'
    elif 'interior' in query or 'living' in query:
        photo_key = 'interior'
    elif 'finance' in query or 'interest' in query or 'money' in query:
        photo_key = 'finance'
    elif 'bank' in query and 'family' in query:
        photo_key = 'bank'
    else:
        photo_key = 'cityview'

    base_dir = _os.path.join(_os.path.dirname(_os.path.abspath(__file__)), '..')
    photo_path = _os.path.join(base_dir, 'assets', 'bg_photos', f'{photo_key}.jpg')
    print(f'[IMG] 使用照片：{photo_key}.jpg')
    photo_b64 = ''
    if _os.path.exists(photo_path):
        photo_b64 = base64.b64encode(open(photo_path,'rb').read()).decode()

    # 3. 標題換行（每8字一行，最多3行）
    lines, rem = [], title
    while rem:
        lines.append(rem[:8]); rem = rem[8:]
        if len(lines) == 3:
            if rem: lines[-1] = lines[-1][:7] + '…'
            break
    title_html = '<br>'.join(lines)

    # 4. 子彈條列 HTML
    bullet_html = ''
    for main_txt, sub_txt in bulls:
        bullet_html += f'''
        <li class="bullet-item">
          <div class="bullet-dot"></div>
          <div>
            <div class="bt">{main_txt}</div>
            <div class="bs">{sub_txt}</div>
          </div>
        </li>'''

    # 5. 背景：若有照片用 base64 嵌入，否則用漸層
    if photo_b64:
        bg_style = f'background: linear-gradient(to right, {c["bg1"]}ff 0%, {c["bg1"]}ff 42%, {c["bg1"]}cc 58%, {c["bg1"]}55 75%, transparent 100%), url(data:image/jpeg;base64,{photo_b64}) center/cover no-repeat;'
    else:
        bg_style = f'background: linear-gradient(135deg, {c["bg1"]} 0%, {c["bg2"]} 100%);'

    # 6. HTML 海報
    html = f'''<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<style>
*{{margin:0;padding:0;box-sizing:border-box;}}
html,body{{width:1024px;height:1024px;overflow:hidden;}}
body{{
  font-family:"Noto Sans CJK TC","Noto Sans TC","Microsoft JhengHei","微軟正黑體",sans-serif;
  {bg_style}
  position:relative;
}}
.top-bar{{position:absolute;top:0;left:0;right:0;height:8px;background:{c["accent"]};}}
.left-bar{{position:absolute;left:26px;top:52px;width:6px;height:820px;
  background:linear-gradient(180deg,{c["accent"]},{c["accent"]}22);border-radius:3px;}}
.glow{{position:absolute;width:500px;height:500px;border-radius:50%;
  right:-80px;top:-80px;
  background:radial-gradient(circle,{c["accent"]}28 0%,transparent 65%);}}
.content{{position:absolute;left:52px;top:58px;right:40px;}}
.tag{{display:inline-block;background:{c["accent"]};color:#111;
  font-size:21px;font-weight:900;padding:5px 16px;border-radius:6px;
  letter-spacing:1px;margin-bottom:26px;}}
.title{{font-size:96px;font-weight:900;color:#fff;line-height:1.08;
  text-shadow:3px 3px 14px rgba(0,0,0,0.75);margin-bottom:26px;word-break:break-all;}}
.divider{{width:88px;height:5px;background:{c["accent"]};border-radius:3px;margin-bottom:30px;}}
ul{{list-style:none;}}
.bullet-item{{display:flex;align-items:flex-start;margin-bottom:20px;}}
.bullet-dot{{width:13px;height:13px;border-radius:50%;background:{c["accent"]};
  box-shadow:0 0 8px {c["accent"]};flex-shrink:0;margin-top:8px;margin-right:16px;}}
.bt{{font-size:29px;font-weight:800;color:#fff;}}
.bs{{font-size:19px;color:rgba(255,255,255,0.72);margin-top:3px;}}
.footer{{position:absolute;bottom:0;left:0;right:0;height:112px;
  background:#8B0000;border-top:5px solid {c["accent"]};
  display:flex;align-items:center;justify-content:space-between;padding:0 34px;}}
.brand{{font-size:41px;font-weight:900;color:#fff;letter-spacing:1px;}}
.sub{{font-size:25px;color:#FFD8A0;font-weight:700;}}
</style></head>
<body>
<div class="glow"></div>
<div class="top-bar"></div>
<div class="left-bar"></div>
<div class="content">
  <div class="tag">&#128240; 房市快訊</div>
  <div class="title">{title_html}</div>
  <div class="divider"></div>
  <ul>{bullet_html}</ul>
</div>
<div class="footer">
  <span class="brand">群義房屋｜雲林雲科加盟店</span>
  <span class="sub">專業雲林在地房仲</span>
</div>
</body></html>'''

    try:
        from html2image import Html2Image
        import tempfile, os
        with tempfile.TemporaryDirectory() as tmp:
            hti = Html2Image(output_path=tmp, size=(1024, 1024), custom_flags=['--no-sandbox', '--disable-dev-shm-usage'])
            hti.screenshot(html_str=html, save_as='poster.png')
            out_path = os.path.join(tmp, 'poster.png')
            if os.path.exists(out_path):
                data = open(out_path, 'rb').read()
                print(f'[IMG] 海報完成（{len(data)//1024} KB）')
                return data
    except Exception as e:
        print(f'[WARN] html2image 失敗：{e}')

    return None

def post_to_fb(text, img_bytes=None):
    if not PAGE_ID or not TOKEN:
        print('[ERROR] 缺少 FB 環境變數')
        sys.exit(1)

    if img_bytes:
        # 附圖發文（直接上傳 bytes，不需圖片託管）
        r = requests.post(
            f'https://graph.facebook.com/v19.0/{PAGE_ID}/photos',
            data={'caption': text, 'published': 'true', 'access_token': TOKEN},
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

def get_today_posted_links() -> set:
    """直接查 FB API，取得今天已發過的新聞連結（最可靠，不依賴任何檔案）"""
    posted = set()
    try:
        today_str = datetime.date.today().isoformat()  # e.g. 2026-05-14
        r = requests.get(
            f'https://graph.facebook.com/v19.0/{PAGE_ID}/posts',
            params={'fields': 'message,created_time', 'limit': 20, 'access_token': TOKEN},
            timeout=10
        )
        for post in r.json().get('data', []):
            if post.get('created_time', '')[:10] != today_str:
                continue
            msg = post.get('message', '')
            # 從貼文內容抽出連結
            for word in msg.split():
                if word.startswith('http'):
                    posted.add(word.rstrip('）)】\n'))
    except Exception as e:
        print(f'[WARN] 無法查詢已發貼文：{e}')
    return posted

def check_token_expiry():
    """檢查 data_access_expires_at，提前14天警告"""
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
            if days_left <= 14:
                print(f'[⚠️ TOKEN警告] data_access 將在 {days_left} 天後到期，請重新授權！')
            else:
                print(f'[OK] Token data_access 有效，剩餘 {days_left} 天')
    except Exception as e:
        print(f'[WARN] Token 檢查失敗：{e}')

def main():
    check_token_expiry()
    news = fetch_news()
    if not news:
        print('[WARN] 無新聞資料，略過')
        sys.exit(0)

    # 查今天 FB 已發過的連結，跳過重複
    posted_today = get_today_posted_links()
    print(f'[INFO] 今天已發連結數：{len(posted_today)}')

    top = None
    for item in news:
        if item['link'] not in posted_today:
            top = item
            break

    if not top:
        print('[SKIP] 今天所有新聞都已發布過，略過')
        sys.exit(0)

    print(f'今日新聞：{top["title"]}')
    text = make_post(top['title'], top['link'], top['source'])

    # 直接抓新聞文章的 OG 圖片（不合成，不自製海報）
    print(f'[NEWS] 抓取新聞 OG 圖片：{top["link"]}')
    img_bytes = fetch_og_image(top['link'])

    post_to_fb(text, img_bytes)

if __name__ == '__main__':
    main()
