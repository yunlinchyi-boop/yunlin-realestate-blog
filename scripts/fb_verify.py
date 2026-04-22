#!/usr/bin/env python3
"""
發文後驗證模組：確認貼文真的出現在 FB 粉絲專頁
"""
import requests, time, sys

def verify_post(post_id, token, page_id, max_retry=3):
    """
    發文後等5秒，查詢 FB Graph API 確認貼文存在
    回傳 True = 確認成功，False = 驗證失敗
    """
    print(f'[驗證] 等待5秒後確認貼文 ID={post_id}...')
    time.sleep(5)

    for attempt in range(1, max_retry + 1):
        try:
            # 查詢貼文是否存在
            r = requests.get(
                f'https://graph.facebook.com/v19.0/{post_id}',
                params={
                    'access_token': token,
                    'fields': 'id,message,created_time,permalink_url'
                },
                timeout=15
            )
            d = r.json()

            if 'id' in d:
                created = d.get('created_time', '')
                permalink = d.get('permalink_url', '')
                print(f'[✅ 驗證成功] 貼文已確認發布')
                print(f'  建立時間：{created}')
                if permalink:
                    print(f'  連結：{permalink}')
                return True
            elif 'error' in d:
                print(f'[WARN] 第{attempt}次驗證失敗：{d["error"].get("message","")}')
                if attempt < max_retry:
                    time.sleep(5)
            else:
                print(f'[WARN] 第{attempt}次：未知回應 {d}')
                if attempt < max_retry:
                    time.sleep(5)

        except Exception as e:
            print(f'[WARN] 第{attempt}次驗證例外：{e}')
            if attempt < max_retry:
                time.sleep(5)

    print(f'[❌ 驗證失敗] 無法確認貼文 ID={post_id}')
    return False


def verify_video_post(post_id, token, max_retry=5):
    """
    影片發文驗證（影片處理需要更長時間）
    """
    print(f'[驗證] 等待10秒後確認影片貼文 ID={post_id}...')
    time.sleep(10)

    for attempt in range(1, max_retry + 1):
        try:
            r = requests.get(
                f'https://graph.facebook.com/v19.0/{post_id}',
                params={
                    'access_token': token,
                    'fields': 'id,description,created_time,permalink_url,status'
                },
                timeout=15
            )
            d = r.json()

            if 'id' in d:
                print(f'[✅ 驗證成功] 影片貼文已確認')
                print(f'  建立時間：{d.get("created_time","")}')
                if d.get('permalink_url'):
                    print(f'  連結：{d["permalink_url"]}')
                return True
            else:
                print(f'[WARN] 第{attempt}次驗證：{d}')
                if attempt < max_retry:
                    time.sleep(10)

        except Exception as e:
            print(f'[WARN] 第{attempt}次例外：{e}')
            if attempt < max_retry:
                time.sleep(10)

    print(f'[❌ 驗證失敗] 無法確認影片貼文 ID={post_id}')
    return False
