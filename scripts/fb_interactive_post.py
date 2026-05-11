#!/usr/bin/env python3
"""
fb_interactive_post.py — 每週自動輪替物件，動態產生 7 天互動式 FB 貼文

用法：
  python fb_interactive_post.py                  # 顯示本週物件 + 今日預覽
  python fb_interactive_post.py --preview        # 預覽本週 7 天所有貼文
  python fb_interactive_post.py --post-today     # 發今天的貼文到 FB
  python fb_interactive_post.py --post-today --dry-run   # 乾跑（不實際發）
  python fb_interactive_post.py --post-day 3    # 發第 3 天貼文
  python fb_interactive_post.py --show-property  # 顯示本週物件
"""

import argparse
import json
import os
import random
import sys
from datetime import date, datetime

import requests

# ── 路徑設定（雲端版：支援 GitHub Actions 環境變數）─────
import pathlib
_HERE = pathlib.Path(__file__).parent.parent  # repo root
PROPERTIES_FILE = str(_HERE / "content" / "properties.json")
PAGE_ID   = os.environ.get("FB_PAGE_ID", "247544815110989")
FB_TOKEN  = os.environ.get("FB_ACCESS_TOKEN", "")
GRAPH_URL = "https://graph.facebook.com/v19.0"


# ── 物件資料 ─────────────────────────────────────────

def load_properties() -> list:
    with open(PROPERTIES_FILE, encoding="utf-8") as f:
        return json.load(f).get("items", [])


def get_week_property() -> dict:
    """依年份週數輪替物件，每週自動換一個"""
    props = load_properties()
    week_num = date.today().isocalendar()[1]
    return props[week_num % len(props)]


# ── 物件資訊解析 ──────────────────────────────────────

def prop_type_emoji(t: str) -> str:
    return {"透天": "🏠", "土地": "🌳", "公寓": "🏢", "農地": "🌾",
            "廠房": "🏭", "別墅": "🏡"}.get(t, "🏠")


def layout_str(p: dict) -> str:
    """格局字串，如 '5房2廳3衛' 或 '940坪農地'"""
    if p.get("layout") and p["layout"] != "0房+0室 0廳 0衛":
        return p["layout"].replace("+0室", "").replace("+", "")
    if p.get("land_ping"):
        return f"{p['land_ping']}農地"
    if p.get("build_ping"):
        return f"{p['build_ping']}"
    return ""


def size_info(p: dict) -> str:
    parts = []
    if p.get("build_ping"):
        parts.append(f"建坪 {p['build_ping']}")
    if p.get("land_ping"):
        parts.append(f"地坪 {p['land_ping']}")
    return "・".join(parts) if parts else ""


# ── 7 天互動式貼文產生器 ──────────────────────────────

def make_posts(p: dict) -> list[str]:
    """根據物件動態產生 7 天互動式貼文"""
    title  = p.get("title", "")
    price  = p.get("price", "")
    addr   = p.get("addr", "")
    ptype  = p.get("type", "")
    layout = layout_str(p)
    size   = size_info(p)
    age    = p.get("age", "")
    unit_p = p.get("unit_price", "")
    link   = p.get("link", "")
    emoji  = prop_type_emoji(ptype)
    week   = date.today().isocalendar()[1]

    # 隨機種子依週數固定（同週每次執行結果相同）
    rng = random.Random(week * 31 + hash(title) % 997)

    # ── Day 1：依物件類型出不同題 ────────────────────
    import re as _re2
    area_m1 = _re2.match(r'^(.{2,5}?[鄉鎮市區])', addr or '')
    area_d1 = area_m1.group(1) if area_m1 else (addr[:4] if addr else '雲林')

    is_land_d1 = ptype in ('土地', '農地', '廠房', '建地')

    if is_land_d1:
        # 土地類 → 問「你覺得這個地段的未來發展方向是？」
        land_qs = {
            '農地': [
                ('A. 轉型休閒農業，發展生態旅遊', 'B. 維持農耕，穩定收益', 'C. 等待農地解編，長線增值', 'D. 出租給農民，坐收租金'),
            ],
            '土地': [
                ('A. 商業開發，價值飆漲', 'B. 住宅透天，自建自住', 'C. 停車場，現金流穩定', 'D. 持有觀望，等重劃利多'),
            ],
            '廠房': [
                ('A. 製造業直接進駐，效益最快', 'B. 分隔出租，穩定租金', 'C. 轉型倉儲物流，需求大', 'D. 持有等地價上漲'),
            ],
        }
        opts = land_qs.get(ptype, [('A. 自用', 'B. 出租', 'C. 增值', 'D. 觀望')])[0]
        d1 = f"""【{title}｜你看好哪個發展方向？📍】

{emoji} {area_d1}｜{ptype}｜{price}

這塊地的潛力，你怎麼看？

👇 留言投票：
{opts[0]}
{opts[1]}
{opts[2]}
{opts[3]}

說說你的理由，也許我們觀點一致 👀
有問題歡迎私訊，免費諮詢不推銷！

📞 05-5362808
💬 私訊群義房屋・斗六雲科加盟店

#群義房屋 #雲林房屋 #{ptype}買賣 #雲林土地 #雲林房地產"""

    else:
        # 房屋類 → 地段大考驗（步行時間）
        location_options = [
            ("A. 5分鐘", "B. 10分鐘", "C. 15分鐘"),
            ("A. 3分鐘", "B. 8分鐘", "C. 20分鐘"),
            ("A. 走路就到", "B. 騎車5分鐘", "C. 開車才到"),
        ]
        loc_q = rng.choice(location_options)
        d1 = f"""【{title}｜地段大考驗 📍】

{emoji} 聽說{area_d1}這個地段超方便，但你相信嗎？

📌 位置：{addr}
💰 售價：{price}{"  (" + unit_p + ")" if unit_p else ""}

🔍 考考你！從這裡騎車到最近的傳統市場要多久？

👇 留言選答案：
{loc_q[0]}
{loc_q[1]}
{loc_q[2]}

（答案明天公布！）

想直接來走走感受一下？
📞 05-5362808 預約帶看
💬 私訊群義房屋・斗六雲科加盟店

#群義房屋 #雲林房屋 #{ptype}買賣 #斗六房仲 #地段分析"""

    # ── Day 2：格局你來設計（想像互動）──────────────
    space_q_opts = [
        f"如果這間{ptype}是你的，你最想怎麼用？",
        f"你覺得 {layout} 的格局，最適合幾個人住？",
        f"這樣的空間，你第一件想改裝的是什麼？",
    ]
    space_q = rng.choice(space_q_opts)
    d2 = f"""【{title}｜格局你來設計 🏗️】

{emoji} {layout}{"  |  " + size if size else ""}

這樣的格局，你會怎麼規劃？

✅ 每個空間都有它的可能性
✅ {"屋齡 " + age + "，" if age else ""}格局方正好利用
✅ 想要改裝也有足夠空間發揮

💭 {space_q}

在留言區告訴我！
不管是自住、出租、還是給爸媽住——
我們都可以幫你找到最適合的方案 💡

📞 05-5362808
🔗 {link}

#群義房屋 #雲林房屋 #格局 #{ptype} #買房規劃"""

    # ── Day 3：投資算給你看（👍👎 投票）────────────────
    if unit_p:
        invest_line = f"單價 {unit_p}，在這個區域算合理嗎？"
    else:
        invest_line = f"{price} 在這個區域，你覺得值不值？"

    d3 = f"""【{title}｜投資報酬算給你看 💰】

{emoji} 售價 {price}{"  |  " + size if size else ""}

{invest_line}

📊 市場觀察：
・雲林土地近年穩定增值
・{ptype}需求持續
・{"屋齡 " + age + "，保值性高" if age else "自用出租都適合"}

👇 你覺得這個價格：
👍 划算，值得出手
👎 偏高，再觀望

留言 👍 or 👎 告訴我們！
有興趣的直接私訊，我們幫你做更詳細的試算 📋

📞 05-5362808

#群義房屋 #雲林房屋 #房地產投資 #{ptype}投資 #雲林買房"""

    # ── Day 4：依物件類型選不同主題 ────────────────
    # 取地區名稱（從地址萃取）
    import re as _re
    area_m = _re.match(r'^(.{2,5}?[鄉鎮市區])', addr or '')
    area_name = area_m.group(1) if area_m else (addr[:4] if addr else '雲林')

    is_land = ptype in ('土地', '農地', '廠房', '建地')

    if is_land:
        # 土地/農地/廠房 → 改問「你最想用這塊地做什麼」投票
        land_use_opts = {
            '農地': ['A. 種菜養雞，自給自足', 'B. 打造休閒農場，週末來放鬆', 'C. 長期持有，等待增值', 'D. 蓋農舍，享受田園生活'],
            '土地': ['A. 自建透天，一家人住', 'B. 出售/轉用，等待增值', 'C. 停車場或商業用途', 'D. 規劃小型店面出租'],
            '廠房': ['A. 生產製造，直接進駐', 'B. 分租小單位，增加收益', 'C. 倉儲物流用途', 'D. 長期持有，等區段地價上漲'],
        }
        opts = land_use_opts.get(ptype, ['A. 自用', 'B. 出租', 'C. 等增值', 'D. 其他規劃'])
        d4 = f"""【{title}｜你打算怎麼用這塊地？🌿】

{emoji} {area_name}｜{ptype}｜{price}

拿到這塊地，你的第一個念頭是什麼？

👇 來投票：
{opts[0]}
{opts[1]}
{opts[2]}
{opts[3]}

留言告訴我們你的規劃，也許我們有更好的建議！

有問題歡迎私訊，免費諮詢不推銷 😊
📞 05-5362808

#群義房屋 #雲林房屋 #{ptype}買賣 #雲林土地 #雲林房地產"""

    else:
        # 房屋類 → 生活機能猜謎（只用雲林有的設施，不放捷運站）
        facility_sets = [
            ["全聯超市", "早餐店", "診所", "郵局"],
            ["國小學校", "傳統市場", "公園綠地", "藥局"],
            ["便利商店", "銀行ATM", "加油站", "餐廳"],
        ]
        facilities = rng.choice(facility_sets)
        d4 = f"""【{title}｜生活機能大調查 🛒】

{emoji} 住在{area_name}，你的生活有多方便？

📍 {addr} 周邊設施大調查！

以下哪一個「最近」步行就能到？

A. {facilities[0]}
B. {facilities[1]}
C. {facilities[2]}
D. {facilities[3]}

👇 留言猜猜看！答案在留言區 👀

（提示：{area_name}生活機能很完整，答案可能讓你驚喜！）

想親自來走走感受一下嗎？
📞 05-5362808 預約帶看
💬 私訊我們

#群義房屋 #雲林房屋 #生活機能 #雲林生活 #{ptype}"""

    # ── Day 5：你是哪種買家（Tag 朋友）──────────────
    buyer_types = {
        "透天": [("👨‍👩‍👧‍👦 想要三代同堂的大家庭", "🎓 有學齡小孩的爸媽", "💼 想在雲林置業的創業者")],
        "土地": [("🌾 想當農夫的都市人", "💰 看好雲林發展的投資客", "🏡 想蓋農舍享受田園生活的你")],
        "農地": [("🌾 有農耕夢的退休族", "💰 想買農地保值的投資人", "🏕️ 想發展休閒農場的你")],
        "公寓": [("👰 剛結婚的小家庭", "🎓 子女上學需要方便的爸媽", "💼 外地來雲林工作的上班族")],
        "廠房": [("🏭 需要生產空間的製造業", "📦 想要倉儲空間的電商", "🔧 在雲林設廠的企業主")],
    }
    btypes = buyer_types.get(ptype, buyer_types["透天"])[0]
    d5 = f"""【{title}｜你是哪種買家？ 🤔】

{emoji} {title}，{price}

這個物件最適合誰？我們來分析一下！

{btypes[0]}
→ 空間夠大，生活機能齊全 ✅

{btypes[1]}
→ 地段好，日後增值潛力高 ✅

{btypes[2]}
→ 價格實惠，{"自用出租都可以" if ptype not in ["土地","農地","廠房"] else "彈性規劃空間大"} ✅

👇 你是哪一種？留言告訴我們！
然後 tag 一個跟你一樣在找房的朋友 👇

📞 05-5362808
💬 私訊群義房屋・斗六雲科加盟店

#群義房屋 #雲林房屋 #買房攻略 #{ptype} #斗六房仲"""

    # ── Day 6：週末帶看名額（緊迫感）────────────────
    slots = rng.choice([2, 3])
    d6 = f"""【{title}｜週末帶看名額剩 {slots} 個！ 🏃】

{emoji} {title}
📍 {addr}  |  💰 {price}

這週已經有好幾組客人詢問了 🔥

本週末帶看時間：
✅ 週六 10:00 / 14:00
✅ 週日 10:00

還剩 {slots} 個名額！

想看的快私訊或來電 👇
📞 05-5362808
💬 私訊預約（說「我要看{title}」）

帶看特色：
・全程不推銷，讓你自在參觀
・在地 10 年經驗，周邊行情全掌握
・有問題當場回答，不拖拉

👇 留言 +1 搶名額！

#群義房屋 #雲林房屋 #週末看屋 #{ptype} #斗六房仲"""

    # ── Day 7：本週心動物件（投票 + CTA）────────────
    d7 = f"""【{title}｜本週回顧 📋】

{emoji} 看了整整一週了——

🏷️ 物件：{title}
📍 地點：{addr}
💰 售價：{price}{"  (" + unit_p + ")" if unit_p else ""}
📐 規格：{layout}{"  " + size if size else ""}
{"⏳ 屋齡：" + age if age else ""}

你心動了嗎？

👇 留言投票：
1️⃣ 心動了！想預約看屋
2️⃣ 還在考慮，想多了解一點
3️⃣ 幫我轉給有需要的朋友！

不管是哪個，我們都在 📞

📞 05-5362808 立即來電
💬 私訊群義房屋・斗六雲科加盟店
🔗 {link}

#群義房屋 #雲林房屋 #本週精選 #{ptype} #斗六房仲 #雲林買房"""

    return [d1, d2, d3, d4, d5, d6, d7]


# ── FB 發文 ───────────────────────────────────────────

def post_to_fb(text: str) -> dict:
    token = FB_TOKEN
    if not token:
        print("❌ FB_ACCESS_TOKEN 未設定")
        sys.exit(1)
    resp = requests.post(f"{GRAPH_URL}/{PAGE_ID}/feed",
                         data={"message": text, "access_token": token})
    return resp.json()


# ── 指令 ─────────────────────────────────────────────

WEEKDAY_NAMES = ["一", "二", "三", "四", "五", "六", "日"]
DAY_THEMES    = ["地段大考驗", "格局你來設計", "投資算給你看",
                 "生活機能大挑戰", "你是哪種買家", "週末帶看名額", "本週心動物件"]


def cmd_show_property():
    p = get_week_property()
    wn = date.today().isocalendar()[1]
    print(f"\n📅 第 {wn} 週主打物件：")
    print(f"  {prop_type_emoji(p.get('type',''))} {p['title']} — {p['price']}")
    print(f"  📍 {p.get('addr','')}  |  {p.get('type','')}  |  {layout_str(p)}")
    print(f"  🔗 {p.get('link','')}\n")


def cmd_preview():
    p = get_week_property()
    posts = make_posts(p)
    wn = date.today().isocalendar()[1]
    print(f"\n{'='*60}")
    print(f"📅 第{wn}週 | 主打：{p['title']} — {p['price']}")
    print(f"{'='*60}")
    for i, (post, theme) in enumerate(zip(posts, DAY_THEMES)):
        print(f"\n【Day {i+1}（星期{WEEKDAY_NAMES[i]}）{theme}】")
        print("-" * 40)
        print(post)
    print(f"\n{'='*60}\n")


def cmd_post_today(dry_run=False):
    p = get_week_property()
    posts = make_posts(p)
    idx = date.today().weekday()  # 0=Mon, 6=Sun
    post_text = posts[idx]
    theme = DAY_THEMES[idx]
    wd = WEEKDAY_NAMES[idx]

    print(f"\n📤 Day {idx+1}（星期{wd}）{theme}")
    print(f"🏠 {p['title']} — {p['price']}")
    print("-" * 40)
    print(post_text)
    print("-" * 40)

    if dry_run:
        print("\n[乾跑模式，未實際發文]\n")
        return

    result = post_to_fb(post_text)
    if "id" in result:
        print(f"\n✅ 發文成功！ID：{result['id']}")
    else:
        print(f"\n❌ 發文失敗：{result}")


def cmd_post_day(day: int, dry_run=False):
    p = get_week_property()
    posts = make_posts(p)
    idx = (day - 1) % 7
    post_text = posts[idx]
    theme = DAY_THEMES[idx]
    wd = WEEKDAY_NAMES[idx]

    print(f"\n📤 Day {day}（星期{wd}）{theme}")
    print(f"🏠 {p['title']} — {p['price']}")
    print("-" * 40)
    print(post_text)
    print("-" * 40)

    if dry_run:
        print("\n[乾跑模式]\n")
        return

    result = post_to_fb(post_text)
    if "id" in result:
        print(f"\n✅ 成功！ID：{result['id']}")
    else:
        print(f"\n❌ 失敗：{result}")


# ── CLI ──────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="群義房屋 FB 每週互動式貼文")
    parser.add_argument("--show-property", action="store_true")
    parser.add_argument("--preview",       action="store_true")
    parser.add_argument("--post-today",    action="store_true")
    parser.add_argument("--post-day",      type=int, metavar="N")
    parser.add_argument("--dry-run",       action="store_true")
    args = parser.parse_args()

    if args.show_property:
        cmd_show_property()
    elif args.preview:
        cmd_preview()
    elif args.post_today:
        cmd_post_today(dry_run=args.dry_run)
    elif args.post_day:
        cmd_post_day(args.post_day, dry_run=args.dry_run)
    else:
        cmd_show_property()
        idx = date.today().weekday()
        p = get_week_property()
        posts = make_posts(p)
        print(f"今日（星期{WEEKDAY_NAMES[idx]}）預覽：\n")
        print(posts[idx])
        print("\n用 --post-today 發文，--preview 看全週，--dry-run 乾跑")


if __name__ == "__main__":
    main()
