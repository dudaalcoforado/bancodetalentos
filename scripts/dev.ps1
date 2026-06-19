# Run back-end + front-end in parallel.
$ErrorActionPreference = 'Stop'
$RepoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $RepoRoot

# On Windows `npm` resolves to npm.ps1, which Start-Process can't launch
# directly ("not a valid Win32 application"). Resolve npm.cmd instead.
$npm = (Get-Command npm.cmd -ErrorAction SilentlyContinue).Source
if (-not $npm) { $npm = 'npm.cmd' }

$back  = Start-Process -PassThru -NoNewWindow -FilePath $npm -ArgumentList 'run','start:dev' -WorkingDirectory (Join-Path $RepoRoot 'back-end')
$front = Start-Process -PassThru -NoNewWindow -FilePath $npm -ArgumentList 'run','dev'        -WorkingDirectory (Join-Path $RepoRoot 'front-end')

Write-Host "[dev] back-end PID=$($back.Id)  front-end PID=$($front.Id)"
Write-Host "[dev] back:  http://localhost:3001/api  docs: http://localhost:3001/docs"
Write-Host "[dev] front: http://localhost:3000"

try {
  Wait-Process -Id $back.Id, $front.Id
} finally {
  foreach ($p in @($back, $front)) {
    if (-not $p.HasExited) { try { Stop-Process -Id $p.Id -Force } catch {} }
  }
}
