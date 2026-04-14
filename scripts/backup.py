"""
Backup script for yunlin-realestate-blog
Usage: python scripts/backup.py
"""
import os
import sys
import zipfile
import subprocess
from datetime import datetime
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent
BACKUP_DIR   = Path("C:/yunlin-backups")
EXCLUDE_DIRS = {"node_modules", ".next", ".git", "__pycache__"}
MAX_BACKUPS  = 10

def create_zip(timestamp: str) -> Path:
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    zip_path = BACKUP_DIR / f"backup_{timestamp}.zip"

    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED, compresslevel=6) as zf:
        for item in PROJECT_ROOT.rglob("*"):
            # Skip excluded dirs
            parts = set(item.relative_to(PROJECT_ROOT).parts)
            if parts & EXCLUDE_DIRS:
                continue
            if item.is_file():
                arcname = item.relative_to(PROJECT_ROOT)
                try:
                    zf.write(item, arcname)
                except (PermissionError, OSError):
                    pass  # skip locked files
    return zip_path

def git_tag(timestamp: str):
    tag = f"backup/{timestamp}"
    # Only create local tag — do NOT push (would trigger pre-push hook again = infinite loop)
    subprocess.run(["git", "tag", tag], cwd=PROJECT_ROOT, capture_output=True)
    return tag

def cleanup_old_backups():
    zips = sorted(BACKUP_DIR.glob("backup_*.zip"))
    while len(zips) > MAX_BACKUPS:
        old = zips.pop(0)
        old.unlink()
        print(f"  [Clean] Removed: {old.name}")

def main():
    ts = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    print(f"[Backup] Starting... {ts}")

    zip_path = create_zip(ts)
    size_mb  = round(zip_path.stat().st_size / 1024 / 1024, 2)
    print(f"[Backup] Created: {zip_path.name} ({size_mb} MB)")

    tag = git_tag(ts)
    print(f"[Backup] Git tag: {tag}")

    cleanup_old_backups()
    print("[Backup] Done!")

if __name__ == "__main__":
    main()
