#!/usr/bin/env python3
"""
每次更新前自動備份
備份位置：C:/Users/User/OneDrive/Desktop/yunlin-realestate-blog/backups/YYYY-MM-DD/
"""
import os, shutil, datetime

BLOG_DIR = os.path.join(os.path.dirname(__file__), '..')
BACKUP_ROOT = os.path.join(BLOG_DIR, 'backups')

# 要備份的來源目錄/檔案
TARGETS = [
    'content/posts',
    'content/properties.json',
]

def main():
    today = datetime.date.today().isoformat()
    backup_dir = os.path.join(BACKUP_ROOT, today)

    # 如果今天已備份就跳過
    if os.path.exists(backup_dir):
        print(f"✅ 今日備份已存在：{backup_dir}")
        return

    os.makedirs(backup_dir, exist_ok=True)

    for target in TARGETS:
        src = os.path.normpath(os.path.join(BLOG_DIR, target))
        name = target.replace('/', '_').replace('\\', '_')
        dst = os.path.join(backup_dir, name)

        if not os.path.exists(src):
            continue

        if os.path.isdir(src):
            shutil.copytree(src, dst)
            count = len(os.listdir(src))
            print(f"  📁 備份 {target}/ → {count} 個檔案")
        else:
            shutil.copy2(src, dst)
            print(f"  📄 備份 {target}")

    # 只保留最近 30 天的備份
    all_backups = sorted(os.listdir(BACKUP_ROOT)) if os.path.exists(BACKUP_ROOT) else []
    if len(all_backups) > 30:
        for old in all_backups[:-30]:
            old_path = os.path.join(BACKUP_ROOT, old)
            if os.path.isdir(old_path):
                shutil.rmtree(old_path)
                print(f"  🗑️  清除舊備份：{old}")

    print(f"✅ 備份完成：{backup_dir}")

if __name__ == '__main__':
    main()
