# Backup script for yunlin-realestate-blog
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$BackupRoot  = "C:\yunlin-backups"   # 本機路徑，避免 OneDrive 鎖檔
$Timestamp   = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$ZipPath     = Join-Path $BackupRoot "backup_$Timestamp.zip"

if (-not (Test-Path $BackupRoot)) {
    New-Item -ItemType Directory -Path $BackupRoot | Out-Null
}

Write-Host "[Backup] Starting... $Timestamp" -ForegroundColor Cyan

# Temp dir with unique name
$TempDir = Join-Path $env:TEMP "yunlin_bk_$Timestamp"
New-Item -ItemType Directory -Path $TempDir -Force | Out-Null

# Copy (exclude heavy dirs)
$ExcludeDirs = @("node_modules", ".next", ".git")
Get-ChildItem -Path $ProjectRoot | Where-Object { $_.Name -notin $ExcludeDirs } | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination (Join-Path $TempDir $_.Name) -Recurse -Force -ErrorAction SilentlyContinue
}

# Zip
Compress-Archive -Path (Join-Path $TempDir "*") -DestinationPath $ZipPath
Start-Sleep -Milliseconds 300
Remove-Item -Path $TempDir -Recurse -Force -ErrorAction SilentlyContinue

# Git tag
Push-Location $ProjectRoot
$TagName = "backup/$Timestamp"
git tag $TagName 2>&1 | Out-Null
git push origin $TagName 2>&1 | Out-Null
Pop-Location

# Keep only last 10 backups
$All = Get-ChildItem -Path $BackupRoot -Filter "backup_*.zip" | Sort-Object Name
if ($All.Count -gt 10) {
    $All | Select-Object -First ($All.Count - 10) | ForEach-Object {
        Remove-Item $_.FullName -Force -ErrorAction SilentlyContinue
        Write-Host "[Backup] Removed old: $($_.Name)" -ForegroundColor DarkGray
    }
}

$MB = [math]::Round((Get-Item $ZipPath).Length / 1MB, 2)
Write-Host "[Backup] Done!  C:\yunlin-backups\backup_$Timestamp.zip  ($MB MB)" -ForegroundColor Green
Write-Host "[Backup] Git tag: $TagName pushed to GitHub" -ForegroundColor Green
