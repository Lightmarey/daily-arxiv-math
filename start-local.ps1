[CmdletBinding()]
param(
  [switch]$NoBrowser
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$projectRoot = $PSScriptRoot
$automationDir = Join-Path $projectRoot '.automation'
$envFile = Join-Path $projectRoot '.env'
$tokenFile = Join-Path $automationDir 'ingest-token'
$siteFile = Join-Path $automationDir 'site-url'
$siteUrl = 'http://localhost:3000'
$npmCommand = Get-Command npm.cmd -ErrorAction SilentlyContinue
if (-not $npmCommand) {
  $npmCommand = Get-Command npm -ErrorAction SilentlyContinue
}

function Set-EnvValue {
  param(
    [Parameter(Mandatory)] [string]$Path,
    [Parameter(Mandatory)] [string]$Key,
    [Parameter(Mandatory)] [string]$Value
  )

  $lines = if (Test-Path -LiteralPath $Path) {
    @(Get-Content -LiteralPath $Path | Where-Object { $_ -notmatch "^$([regex]::Escape($Key))=" })
  } else {
    @()
  }
  @($lines) + "$Key=$Value" | Set-Content -LiteralPath $Path -Encoding utf8
}

function Test-LocalSite {
  try {
    $response = Invoke-RestMethod -NoProxy -Uri "$siteUrl/api/config" -TimeoutSec 3
    return $null -ne $response.site
  } catch {
    return $false
  }
}

if (-not $npmCommand) { throw 'npm was not found on PATH.' }
if (-not (Test-Path -LiteralPath (Join-Path $projectRoot 'config.local.json'))) {
  Copy-Item -LiteralPath (Join-Path $projectRoot 'config.example.json') -Destination (Join-Path $projectRoot 'config.local.json')
}

New-Item -ItemType Directory -Path $automationDir -Force | Out-Null
$localToken = if (Test-Path -LiteralPath $tokenFile) {
  (Get-Content -LiteralPath $tokenFile -Raw).Trim()
} else {
  [Convert]::ToHexString(
    [Security.Cryptography.RandomNumberGenerator]::GetBytes(32)
  ).ToLowerInvariant()
}
if (-not $localToken) {
  throw 'The local ingest token is empty.'
}

$tokenKey = 'INGEST' + '_TOKEN'
Set-EnvValue -Path $envFile -Key $tokenKey -Value $localToken
Set-EnvValue -Path $envFile -Key 'SITE_ORIGIN' -Value $siteUrl
Set-Content -LiteralPath $tokenFile -Value $localToken -Encoding ascii -NoNewline
Set-Content -LiteralPath $siteFile -Value $siteUrl -Encoding ascii -NoNewline

if (-not (Test-LocalSite)) {
  $stdoutLog = Join-Path $automationDir 'local-dev.stdout.log'
  $stderrLog = Join-Path $automationDir 'local-dev.stderr.log'
  $process = Start-Process -FilePath $npmCommand.Source `
    -ArgumentList @('run', 'dev') `
    -WorkingDirectory $projectRoot `
    -WindowStyle Hidden `
    -RedirectStandardOutput $stdoutLog `
    -RedirectStandardError $stderrLog `
    -PassThru
  Set-Content -LiteralPath (Join-Path $automationDir 'local-dev.pid') -Value $process.Id -Encoding ascii -NoNewline

  $ready = $false
  for ($attempt = 0; $attempt -lt 60; $attempt++) {
    Start-Sleep -Seconds 1
    if ($process.HasExited) {
      $tail = if (Test-Path -LiteralPath $stderrLog) {
        (Get-Content -LiteralPath $stderrLog -Tail 20) -join [Environment]::NewLine
      } else {
        'No error log was produced.'
      }
      throw "The local server exited before it became ready.`n$tail"
    }
    if (Test-LocalSite) {
      $ready = $true
      break
    }
  }
  if (-not $ready) {
    throw "The local server did not become ready within 60 seconds. Check $stderrLog"
  }
}

$headers = @{ Authorization = "Bearer $localToken" }
try {
  Invoke-RestMethod -NoProxy -Uri "$siteUrl/api/ingest/state" -Headers $headers -TimeoutSec 5 | Out-Null
} catch {
  throw 'The site is running but the local ingest token is not active. Stop the existing dev server and run this script again.'
}

if (-not $NoBrowser) {
  Start-Process $siteUrl
}

Write-Host "Local arXiv tracker is ready at $siteUrl"
