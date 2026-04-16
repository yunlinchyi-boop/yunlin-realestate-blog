#!/usr/bin/env python3
"""
enhance_old_posts.py
掃描 content/posts/ 中字數不足 600 字的文章，
在文末追加補充段落，並更新過短的 description。
"""

import io
import os
import re
import sys

# Windows 終端機強制 UTF-8 輸出，避免 cp950 編碼錯誤
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

# ── 路徑設定 ──────────────────────────────────────────────
SCRIPT_DIR  = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(SCRIPT_DIR)
POSTS_DIR   = os.path.join(PROJECT_DIR, "content", "posts")

WORD_THRESHOLD   = 600   # 低於此字數視為薄弱文章
DESC_MIN_LEN     = 60    # description 低於此長度就補強（中文字元數）

# ── 補充段落模板 ──────────────────────────────────────────
SUPPLEMENT = """
---

## 雲林斗六購屋完整指南

### 現在是買房好時機嗎？

對於雲林、斗六地區的購屋族，有幾個關鍵因素值得評估：

**利率環境**：目前台灣房貸利率相對穩定，青安貸款最低 1.775%，一般貸款約 2.1～2.5%。固定利率方案適合風險意識較高的買家。

**雲林房價走勢**：相較台北、台中，雲林房價增幅溫和，自住客不需過度擔心「買在高點」。斗六市區透天厝目前約 600～1,500 萬，仍在合理範圍。

**外部環境**：台78線快速道路、雲林高鐵計畫等建設陸續推進，對雲林房市的長期發展是正面支撐。

---

### 雲林各區購屋分析

| 區域 | 特色 | 適合族群 | 參考行情 |
|------|------|---------|---------|
| 斗六市中心 | 生活機能完整，中正路、林森路 | 自住首選 | 透天 800萬起 |
| 雲科大周邊 | 租屋需求強，學生族群 | 投資出租 | 公寓 300萬起 |
| 社口重劃區 | 新開發區，長期增值 | 長期投資 | 透天 900萬起 |
| 斗南、虎尾 | 距斗六15分鐘，價位較低 | 預算有限 | 透天 500萬起 |
| 古坑、林內 | 農地廠房為主 | 農地投資 | 依條件議 |

### 買房前必看清單

在決定置產前，建議確認以下事項：

**財務面**
- 自備款是否達到總價 2～3 成（加上稅費、代書費）
- 月收入 × 30% ÷ 當前利率，估算可承受貸款額
- 是否符合青安貸款資格（首購、自住）

**物件面**
- 查詢實價登錄，了解周邊成交行情
- 確認產權清晰（無查封、無抵押糾紛）
- 農地需確認地目、是否可興建農舍

**生活面**
- 通勤距離與大眾運輸
- 子女就學學區
- 周邊生活機能（超市、醫院、商圈）

---

## 群義房屋雲科加盟店｜在地服務

群義房屋雲林雲科加盟店（紅火房屋仲介有限公司），深耕雲林斗六地區超過10年，提供：

- ✅ **免費、不推銷**的物件評估與諮詢
- ✅ 銀行貸款媒合，合作10家以上銀行
- ✅ 透天、農地、建地、廠房專業服務
- ✅ 代書、過戶、貸款一站完成
- ✅ 雲林全縣服務，熟悉在地行情

**聯絡我們**

📞 電話：05-5362808
📍 地址：640 雲林縣斗六市中正路 312 號
🌐 官網：https://www.chyi.com.tw/store/055362808

> 有任何買房、賣屋、投資疑問，歡迎免費諮詢。我們的目標是幫您做對的決定，不是快速成交。
"""

DEFAULT_DESC_SUFFIX = (
    "群義房屋雲科加盟店提供雲林斗六房市在地專業服務，"
    "包含透天厝、農地、廠房買賣，銀行貸款媒合，代書過戶一站完成。"
    "歡迎免費諮詢：05-5362808。"
)


# ── 工具函式 ──────────────────────────────────────────────

def parse_frontmatter(text: str):
    """
    回傳 (frontmatter_str, body_str)。
    frontmatter_str 包含首尾的 ---（含換行），body_str 是剩餘內容。
    若無 frontmatter 回傳 ('', text)。
    """
    if not text.startswith("---"):
        return "", text
    end = text.find("\n---", 3)
    if end == -1:
        return "", text
    fm  = text[: end + 4]   # 含結尾 ---
    body = text[end + 4:]   # 結尾 --- 之後
    return fm, body


def count_chinese_and_ascii_words(text: str) -> int:
    """
    中文：每個字算 1 詞；英文/數字：空白分隔算 1 詞。
    回傳大致字數，用於判斷薄弱文章。
    """
    chinese = len(re.findall(r'[\u4e00-\u9fff]', text))
    # 去掉中文後剩下的非空白序列（英文單字、數字等）
    no_chinese = re.sub(r'[\u4e00-\u9fff]', ' ', text)
    ascii_words = len(no_chinese.split())
    return chinese + ascii_words


def get_frontmatter_field(fm: str, field: str) -> str:
    """從 frontmatter 字串取得指定欄位值（單行）。"""
    pattern = rf'^{field}:\s*(.+)$'
    m = re.search(pattern, fm, re.MULTILINE)
    return m.group(1).strip().strip('"').strip("'") if m else ""


def set_frontmatter_field(fm: str, field: str, value: str) -> str:
    """更新或新增 frontmatter 中的指定欄位。"""
    escaped_value = value.replace('"', '\\"')
    new_line = f'{field}: "{escaped_value}"'
    pattern = rf'^{field}:.*$'
    if re.search(pattern, fm, re.MULTILINE):
        return re.sub(pattern, new_line, fm, flags=re.MULTILINE)
    # 欄位不存在 → 插在 --- 結尾前
    return fm.rstrip().rstrip('-').rstrip() + f'\n{new_line}\n---'


def already_has_supplement(body: str) -> bool:
    return "群義房屋雲科加盟店｜在地服務" in body or "雲林斗六購屋完整指南" in body


# ── 主流程 ────────────────────────────────────────────────

def main():
    posts = [f for f in os.listdir(POSTS_DIR) if f.endswith(".md")]
    posts.sort()

    thin_posts      = []  # 字數不足
    already_done    = []  # 已有補充段落（跳過）
    ok_posts        = []  # 字數足夠
    enhanced_posts  = []  # 本次處理
    error_posts     = []  # 發生錯誤

    print(f"\n掃描目錄：{POSTS_DIR}")
    print(f"共找到 {len(posts)} 篇文章\n")
    print("=" * 60)

    for fname in posts:
        fpath = os.path.join(POSTS_DIR, fname)
        try:
            with open(fpath, "r", encoding="utf-8") as f:
                raw = f.read()

            fm, body = parse_frontmatter(raw)
            word_count = count_chinese_and_ascii_words(body)

            status = f"  [{fname}]  字數≈{word_count}"

            if word_count >= WORD_THRESHOLD:
                ok_posts.append(fname)
                print(f"✅ {status}（足夠，略過）")
                continue

            if already_has_supplement(body):
                already_done.append(fname)
                print(f"⏭️  {status}（已有補充段落，略過）")
                continue

            thin_posts.append(fname)
            print(f"⚠️  {status}（字數不足，即將補強）")

            # 1. 補充段落追加到 body 末尾
            new_body = body.rstrip() + "\n" + SUPPLEMENT

            # 2. 檢查 description 是否過短，必要時補強
            desc = get_frontmatter_field(fm, "description")
            new_fm = fm
            desc_updated = False
            if len(desc) < DESC_MIN_LEN:
                new_desc = (desc + "　" + DEFAULT_DESC_SUFFIX).strip() if desc else DEFAULT_DESC_SUFFIX
                new_fm = set_frontmatter_field(fm, "description", new_desc)
                desc_updated = True

            # 3. 寫回檔案
            new_content = new_fm + new_body
            with open(fpath, "w", encoding="utf-8") as f:
                f.write(new_content)

            new_word_count = count_chinese_and_ascii_words(new_body)
            enhanced_posts.append(fname)
            desc_note = "（description 也已更新）" if desc_updated else ""
            print(f"   → 補強完成，新字數≈{new_word_count} {desc_note}")

        except Exception as e:
            error_posts.append((fname, str(e)))
            print(f"❌ [{fname}] 發生錯誤：{e}", file=sys.stderr)

    # ── 結果摘要 ──────────────────────────────────────────
    print("\n" + "=" * 60)
    print("【執行結果摘要】")
    print(f"  總文章數：{len(posts)}")
    print(f"  字數足夠（略過）：{len(ok_posts)}")
    print(f"  已有補充（略過）：{len(already_done)}")
    print(f"  本次補強完成：{len(enhanced_posts)}")
    if error_posts:
        print(f"  發生錯誤：{len(error_posts)}")
        for fn, err in error_posts:
            print(f"    - {fn}：{err}")
    print()
    if enhanced_posts:
        print("本次補強的文章：")
        for fn in enhanced_posts:
            print(f"  • {fn}")
    else:
        print("沒有文章需要補強。")
    print()


if __name__ == "__main__":
    main()
