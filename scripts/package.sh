#!/usr/bin/env bash

set -euo pipefail

pnpm exec astro build
pnpm dlx @halo-dev/theme-package-cli

theme_version="$(node -p "require('./package.json').version")"
theme_archive="dist/astro-pure-halo-${theme_version}.zip"

if [[ ! -f "${theme_archive}" ]]; then
  echo "Theme archive not found: ${theme_archive}" >&2
  exit 1
fi

# The Halo packaging CLI includes LICENSE but not NOTICE by default.
zip -q -j "${theme_archive}" NOTICE
