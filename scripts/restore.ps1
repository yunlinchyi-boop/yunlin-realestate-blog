# Restore script for yunlin-realestate-blog
# Usage: powershell -ExecutionPolicy Bypass -File scripts/restore.ps1

$BackupRoot  = "C:\Users\User\OneDrive\Desktop\yunlin-realestate-backups"
$ProjectRoot = Split-Path -Parent $PSScriptRoot

if (-not (Test-Path $BackupRoot)) {
    Write-Host "[Restore] No backup folder found: $BackupRoot" -ForegroundColor Red
    exit 1
}

$Backups = Get-ChildItem -Path $BackupRoot -Filter "backup_*.zip" | Sort-Object Name -Descending
if ($Backups.Count -eq 0) {
    Write-Host "[Restore] No backups found." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Available backups:" -ForegroundColor Cyan
for ($i = 0; $i -lt [Math]::Min($Backups.Count, 10); $i++) {
    $b    = $Backups[$i]
    $size = [math]::Round($b.Length / 1MB, 2)
    Write-Host "  [$($i+1)] $($b.BaseName)  ($size MB)"
}

Write-Host ""
$choice = Read-Host "Enter number to restore (Enter to cancel)"
if ([string]::IsNullOrWhiteSpace($choice)) { exit 0 }

$idx = [int]$choice - 1
if ($idx -lt 0 -or $idx -ge $Backups.Count) {
    Write-Host "[Restore] Invalid number." -ForegroundColor Red
    exit 1
}

$Selected = $Backups[$idx]
Write-Host ""
Write-Host "[Restore] Selected: $($Selected.BaseName)" -ForegroundColor Yellow
$confirm = Read-Host "Confirm restore? (y/n)"
if ($confirm -ne 'y') { exit 0 }

# Extract to temp
$TempDir = Join-Path $env:TEMP "yunlin_restore_$(Get-Date -Format 'HHmmss')"
Expand-Archive -Path $Selected.FullName -DestinationPath $TempDir -Force

# Restore (skip node_modules / .next / .git)
$Keep = @("node_modules", ".next", ".git")
Get-ChildItem -Path $TempDir | ForEach-Object {
    if ($_.Name -notin $Keep) {
        $dest = Join-Path $ProjectRoot $_.Name
        if (Test-Path $dest) { Remove-Item $dest -Recurse -Force }
        Copy-Item $_.FullName -Destination $dest -Recurse -Force
        Write-Host "  Restored: $($_.Name)"
    }
}

Remove-Item $TempDir -Recurse -Force
Write-Host ""
Write-Host "[Restore] Complete! Run 'npm install' to verify dependencies." -ForegroundColor Green
