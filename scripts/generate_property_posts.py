#!/usr/bin/env python3
"""
每日自動產生物件介紹部落格文章
公式：(day_num * 4 + slot) % len(props)，與 fb_post_properties.py / daily_avatar_post.py 一致
每天產生 2 篇（slot=0, slot=1），slot=2 給 SadTalker 影片用，slot=3 給 A2E.ai
"""
import json, os, sys, datetime, re

TODAY = datetime.date.today()
TODAY_STR = TODAY.isoformat()
BASE_DATE = datetime.date(2026, 1, 1)
POSTS_DIR = os.path.join(os.path.dirname(__file__), '..', 'content', 'posts')
PROPS_FILE = os.path.join(os.path.dirname(__file__), '..', 'content', 'properties.json')

TYPE_EMOJI = {
    '透天': '🏡', '公寓': '🏢', '大樓': '🏬', '華廈': '🏛️',
    '農地': '🌾', '土地': '📐', '廠房': '🏭', '店面': '🏪', '別墅': '🏰',
}
TAGS_MAP = {
    '土地':  ['土地買賣', '雲林土地', '投資'],
    '農地':  ['農地買賣', '雲林農地', '田園生活'],
    '廠房':  ['廠房出售', '雲林廠房', '工業地'],
    '透天':  ['透天別墅', '雲林房地產', '斗六買房'],
    '公寓':  ['公寓', '首購推薦', '雲林房地產'],
    '大樓':  ['大樓', '雲林房地產', '斗六買房'],
    '華廈':  ['華廈', '雲林房地產', '斗六買房'],
    '店面':  ['店面出售', '雲林商業', '投資'],
    '別墅':  ['別墅', '雲林豪宅', '斗六買房'],
}

LAND_FEATURES = {
    '農地': [
        '農業用地，適合農耕、休閒或未來開發規劃',
        '空氣清新、環境清幽，遠離塵囂的理想基地',
        '雲林縣農地持續受矚目，長期保值增值',
        '適合退休規劃、田園生活、觀光農業',
    ],
    '土地': [
        '地形方正，開發規劃彈性大',
        '精華地段，地段決定價值',
        '投資自用兩相宜，增值潛力佳',
        '雲林縣土地持續受矚目，長期看漲',
    ],
    '廠房': [
        '合法丁建用地，大型車輛進出順暢',
        '產業鏈串聯便利，企業主首選',
        '雲林工業區周邊，物流交通優越',
        '可依需求客製化使用，彈性大',
    ],
}
HOUSE_FEATURES = {
    '透天': [
        '獨棟透天，土地持分完整，未來增值空間大',
        '格局方正，採光通風良好',
        '自住換屋首選，鄰近生活機能',
        '好房不等人，歡迎預約看屋',
    ],
    '公寓': [
        '格局方正，採光通風良好',
        '社區環境清幽，鄰里和睦',
        '生活機能完善，交通便利',
        '適合首購族或小家庭，歡迎詢問',
    ],
    '大樓': [
        '都市精華地段，生活機能完善',
        '管理維護佳，社區環境優',
        '鄰近學區商圈，交通四通八達',
        '誠摯邀請您來電預約參觀',
    ],
}


def load_props():
    with open(PROPS_FILE, encoding='utf-8') as f:
        return json.load(f)['items']


def pick_prop(props, slot):
    day_num = (TODAY - BASE_DATE).days
    idx = (day_num * 4 + slot) % len(props)
    return props[idx]


def safe_slug(title):
    return re.sub(r'[\\/*?:"<>|【】（）()]', '', title)[:20].strip()


def make_md(prop):
    title    = prop.get('title', '')
    addr     = prop.get('addr', '')
    ptype    = prop.get('type', '')
    price    = prop.get('price', '')
    layout   = prop.get('layout', '')
    b_ping   = prop.get('build_ping', '')
    l_ping   = prop.get('land_ping', '')
    age      = prop.get('age', '')
    img      = prop.get('img', '')
    link     = prop.get('link', '')

    is_land  = ptype in ('土地', '農地', '廠房')
    ping     = l_ping if is_land else b_ping
    tags     = TAGS_MAP.get(ptype, ['雲林房地產', '斗六買房'])
    tags_str = json.dumps(tags, ensure_ascii=False)
    cover    = f'"{img}"' if img else '"/images/prop_01.jpg"'

    feats = (LAND_FEATURES if is_land else HOUSE_FEATURES).get(
        ptype, ['物件條件優越，保值增值潛力佳', '環境清幽，交通便利', '歡迎來電洽詢']
    )
    feat_lines = '\n'.join(f'- {f}' for f in feats)

    table_rows = [
        f'| 地址 | {addr} |',
        f'| 類型 | {ptype} |',
    ]
    if layout:
        table_rows.append(f'| 格局 | {layout} |')
    if ping:
        label = '土地坪數' if is_land else '建坪'
        table_rows.append(f'| {label} | {ping} |')
    if age:
        table_rows.append(f'| 屋齡 | {age} |')
    table_rows.append(f'| **售價** | **{price}** |')
    table_str = '\n'.join(table_rows)

    link_line = f'\n🔗 [查看完整物件資訊]({link})\n' if link else ''

    return f"""---
title: 【{ptype}】{title}｜{price}｜{addr}
description: 【{ptype}】{title}，售價 {price}，位於 {addr}。群義房屋雲科店專業仲介服務，免費帶看、不推銷。
date: {TODAY_STR}
tags: {tags_str}
coverImage: {cover}
---

## 物件資訊

| 項目 | 內容 |
|------|------|
{table_str}

---

## 物件特色

{feat_lines}

---

## 關於群義房屋雲科店

我們是雲林在地深耕多年的專業房仲團隊，提供：

✅ **免費帶看服務**，不收任何費用
✅ **銀行貸款媒合**，合作 10+ 家銀行
✅ **產權調查**，確保交易安全
✅ **議價協助**，為您爭取最佳條件

📞 **05-5362808**
📍 640 雲林縣斗六市中正路 312 號
{link_line}
"""


def main():
    props = load_props()
    print(f"[{TODAY_STR}] 物件總數：{len(props)}")
    created = 0

    for slot in [0, 1]:
        prop = pick_prop(props, slot)
        title = prop.get('title', '')
        slug = f"{TODAY_STR}-property-{safe_slug(title)}"
        fpath = os.path.join(POSTS_DIR, f"{slug}.md")

        if os.path.exists(fpath):
            print(f"[SKIP] 已存在：{slug}")
            continue

        content = make_md(prop)
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"[OK] 建立：{slug}  （slot={slot}, idx={(((TODAY - BASE_DATE).days) * 4 + slot) % len(props)}）")
        created += 1

    print(f"完成，新增 {created} 篇物件文章")
    if created == 0:
        print("（今日已產生，無需重複建立）")


if __name__ == '__main__':
    main()
