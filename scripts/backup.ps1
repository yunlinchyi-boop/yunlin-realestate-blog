# Backup script for yunlin-realestate-blog
# Usage: powershell -ExecutionPolicy Bypass -File scripts/backup.ps1

$ProjectRoot = Split-Path -Parent $PSScriptRoot
$BackupRoot  = "C:\Users\User\OneDrive\Desktop\yunlin-realestate-backups"
$Timestamp   = Get-Date -Format "yyyy-MM-dd_HH-mm"
$BackupName  = "backup_$Timestamp"
$ZipPath     = Join-Path $BackupRoot "$BackupName.zip"

# Create backup folder
if (-not (Test-Path $BackupRoot)) {
    New-Item -ItemType Directory -Path $BackupRoot | Out-Null
}

Write-Host "[Backup] Starting..." -ForegroundColor Cyan
Write-Host "  Source : $ProjectRoot"
Write-Host "  Target : $ZipPath"

# Copy to temp (exclude heavy dirs)
$ExcludeDirs = @("node_modules", ".next", ".git", "backups")
$TempDir = Join-Path $env:TEMP $BackupName
if (Test-Path $TempDir) { Remove-Item $TempDir -Recurse -Force }
New-Item -ItemType Directory -Path $TempDir | Out-Null

Get-ChildItem -Path $ProjectRoot | Where-Object {
    $_.Name -notin $ExcludeDirs
} | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination (Join-Path $TempDir $_.Name) -Recurse -Force
}

# Zip
Compress-Archive -Path (Join-Path $TempDir "*") -DestinationPath $ZipPath -Force
Remove-Item -Path $TempDir -Recurse -Force

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
        Remove-Item $_.FullName -Force
        Write-Host "  [Clean] Removed old backup: $($_.Name)" -ForegroundColor DarkGray
    }
}

$MB = [math]::Round((Get-Item $ZipPath).Length / 1MB, 2)
Write-Host "[Backup] Done! $ZipPath ($MB MB)" -ForegroundColor Green
Write-Host "[Backup] Git tag: $TagName pushed to GitHub" -ForegroundColor Green
