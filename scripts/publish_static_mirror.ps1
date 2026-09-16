param(
    [Parameter(Mandatory = $true)][string]$ConfigPath,
    [Parameter(Mandatory = $true)][string]$BatchPath,
    [Parameter(Mandatory = $true)][string]$OverviewPath,
    [string]$RequiredDate,
    [string]$VolumePath
)

$ErrorActionPreference = 'Stop'

function Invoke-Checked {
    param([string]$Command, [string[]]$Arguments)
    & $Command @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "$Command failed with exit code $LASTEXITCODE"
    }
}

$repoRoot = (& git rev-parse --show-toplevel).Trim()
if ($LASTEXITCODE -ne 0 -or -not $repoRoot) { throw 'Not inside a Git worktree.' }
$lockDir = Join-Path $repoRoot '.automation\static-mirror.lock'
try {
    [void][IO.Directory]::CreateDirectory((Split-Path -Parent $lockDir))
    New-Item -ItemType Directory -Path $lockDir -ErrorAction Stop | Out-Null
} catch {
    if (Test-Path -LiteralPath $lockDir) {
        throw 'Static mirror sync is already running.'
    }
    throw "Unable to create static mirror lock: $($_.Exception.Message)"
}

$worktreeAdded = $false
$resolvedWorktree = $null

try {
    $tempRoot = [IO.Path]::GetFullPath([IO.Path]::GetTempPath())
    $worktree = Join-Path $tempRoot ("arxiv-static-content-{0}" -f [guid]::NewGuid())
    $resolvedWorktree = [IO.Path]::GetFullPath($worktree)
    if (-not $resolvedWorktree.StartsWith($tempRoot, [StringComparison]::OrdinalIgnoreCase)) {
        throw 'Temporary worktree escaped the system temp directory.'
    }
    Invoke-Checked git @('-C', $repoRoot, 'fetch', 'origin', 'main', 'daily-content')
    $head = (& git -C $repoRoot rev-parse HEAD).Trim()
    $main = (& git -C $repoRoot rev-parse origin/main).Trim()
    if ($LASTEXITCODE -ne 0 -or $head -ne $main) {
        throw 'Static mirror generator must be exactly origin/main.'
    }
    $trackedChanges = & git -C $repoRoot status --porcelain --untracked-files=no
    if ($LASTEXITCODE -ne 0 -or $trackedChanges) {
        throw 'Static mirror generator has tracked working-tree changes.'
    }

    Invoke-Checked git @('-C', $repoRoot, 'worktree', 'add', '--detach', $resolvedWorktree, 'origin/daily-content')
    $worktreeAdded = $true
    Invoke-Checked git @('-C', $resolvedWorktree, 'rm', '-r', '--ignore-unmatch', 'README.md', 'index.md', 'archive.md', 'daily', 'papers', 'data/papers')

    $tsx = Join-Path $repoRoot 'node_modules\.bin\tsx.cmd'
    if (-not (Test-Path -LiteralPath $tsx)) { throw 'Run npm ci before publishing.' }
    $syncArgs = @(
        (Join-Path $repoRoot 'scripts\sync_static_mirror.ts'),
        '--output', $resolvedWorktree,
        '--config', $ConfigPath,
        '--batch', $BatchPath,
        '--overview', $OverviewPath
    )
    if ($RequiredDate) { $syncArgs += @('--required-date', $RequiredDate) }
    if ($VolumePath) { $syncArgs += @('--volume-file', $VolumePath) }
    Invoke-Checked $tsx $syncArgs

    Invoke-Checked node @((Join-Path $repoRoot 'scripts\check_secrets.mjs'), $resolvedWorktree)
    Invoke-Checked git @('-C', $resolvedWorktree, 'add', 'data')
    & git -C $resolvedWorktree diff --cached --quiet
    $diffStatus = $LASTEXITCODE
    if ($diffStatus -eq 0) {
        @{ status = 'unchanged' } | ConvertTo-Json -Compress
        return
    }
    if ($diffStatus -ne 1) { throw 'Unable to inspect staged static content.' }

    $manifest = Get-Content -LiteralPath (Join-Path $resolvedWorktree 'data\manifest.json') -Raw | ConvertFrom-Json
    Invoke-Checked git @('-C', $resolvedWorktree, 'commit', '-m', "content: mirror $($manifest.latestDate)")
    Invoke-Checked git @('-C', $resolvedWorktree, 'push', 'origin', 'HEAD:daily-content')
    $contentSha = (& git -C $resolvedWorktree rev-parse HEAD).Trim()
    if ($LASTEXITCODE -ne 0) { throw 'Unable to resolve content commit.' }
    $repoName = (& gh repo view --json nameWithOwner --jq '.nameWithOwner').Trim()
    if ($LASTEXITCODE -ne 0 -or -not $repoName) { throw 'Unable to resolve GitHub repository.' }
    Invoke-Checked gh @('api', '--method', 'POST', "repos/$repoName/dispatches", '-f', 'event_type=static-content-updated', '-F', "client_payload[content_sha]=$contentSha")
    @{ status = 'pushed'; latestDate = $manifest.latestDate; contentSha = $contentSha } | ConvertTo-Json -Compress
} finally {
    if ($worktreeAdded) {
        & git -C $repoRoot worktree remove --force $resolvedWorktree *> $null
        if ($LASTEXITCODE -ne 0) {
            Write-Warning "Temporary worktree cleanup failed: $resolvedWorktree"
        }
    }
    if (Test-Path -LiteralPath $lockDir) {
        [IO.Directory]::Delete($lockDir, $false)
    }
}
