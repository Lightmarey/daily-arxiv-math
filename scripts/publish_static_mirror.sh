#!/usr/bin/env bash
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel)"
cd "$repo_root"
config_path="${1:?usage: publish_static_mirror.sh <config> <batch[,batch]> <overview> [required-date] [volume-file]}"
batch_path="${2:?usage: publish_static_mirror.sh <config> <batch[,batch]> <overview> [required-date] [volume-file]}"
overview_path="${3:?usage: publish_static_mirror.sh <config> <batch[,batch]> <overview> [required-date] [volume-file]}"
required_date="${4:-}"
volume_path="${5:-}"
lock_dir="$repo_root/.automation/static-mirror.lock"

if ! mkdir "$lock_dir" 2>/dev/null; then
  echo "Static mirror sync is already running." >&2
  exit 1
fi

worktree="$(mktemp -d "${TMPDIR:-/tmp}/arxiv-static-content.XXXXXX")"
cleanup() {
  git -C "$repo_root" worktree remove --force "$worktree" >/dev/null 2>&1 || true
  rmdir "$lock_dir" >/dev/null 2>&1 || true
}
trap cleanup EXIT

git -C "$repo_root" fetch origin main daily-content
if [[ "$(git -C "$repo_root" rev-parse HEAD)" != "$(git -C "$repo_root" rev-parse origin/main)" ]]; then
  echo "Static mirror generator must be exactly origin/main." >&2
  exit 1
fi
if [[ -n "$(git -C "$repo_root" status --porcelain --untracked-files=no)" ]]; then
  echo "Static mirror generator has tracked working-tree changes." >&2
  exit 1
fi
git -C "$repo_root" worktree add --detach "$worktree" origin/daily-content
git -C "$worktree" rm -r --ignore-unmatch README.md index.md archive.md daily papers data/papers

sync_args=(
  "$repo_root/node_modules/.bin/tsx"
  "$repo_root/scripts/sync_static_mirror.ts"
  --output "$worktree"
  --config "$config_path"
  --batch "$batch_path"
  --overview "$overview_path"
)
if [[ -n "$required_date" ]]; then
  sync_args+=(--required-date "$required_date")
fi
if [[ -n "$volume_path" ]]; then
  sync_args+=(--volume-file "$volume_path")
fi
"${sync_args[@]}"

node "$repo_root/scripts/check_secrets.mjs" "$worktree"
git -C "$worktree" add data
if git -C "$worktree" diff --cached --quiet; then
  echo '{"status":"unchanged"}'
  exit 0
fi

latest_date="$(node -e 'const fs=require("fs"); const p=JSON.parse(fs.readFileSync(process.argv[1],"utf8")); process.stdout.write(p.latestDate)' "$worktree/data/manifest.json")"
git -C "$worktree" commit -m "content: mirror ${latest_date}"
git -C "$worktree" push origin HEAD:daily-content
content_sha="$(git -C "$worktree" rev-parse HEAD)"

repo_name="$(gh repo view --json nameWithOwner --jq .nameWithOwner)"
gh api --method POST "repos/${repo_name}/dispatches" \
  -f event_type=static-content-updated \
  -F "client_payload[content_sha]=${content_sha}"
echo "{\"status\":\"pushed\",\"latestDate\":\"${latest_date}\",\"contentSha\":\"${content_sha}\"}"
