#!/usr/bin/env bash

set -euo pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
watcher_pid=""

cleanup() {
  if [[ -n "${watcher_pid}" ]]; then
    kill "${watcher_pid}" 2>/dev/null || true
  fi
}

trap cleanup EXIT INT TERM

cd "${project_dir}"
pnpm build
pnpm theme:watch &
watcher_pid=$!

echo
echo "============================================================"
echo "Astro Pure Halo development environment"
echo "Site:    http://localhost:${HALO_PORT:-8090}"
echo "Console: http://localhost:${HALO_PORT:-8090}/console"
echo "Press Ctrl+C to stop Halo and the theme watcher."
echo "============================================================"
echo

"${project_dir}/scripts/halo-start.sh"
