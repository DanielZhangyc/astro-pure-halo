#!/usr/bin/env bash

set -euo pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
runtime_dir="${HALO_RUNTIME_DIR:-${project_dir}/.halo-test}"
halo_version="${HALO_VERSION:-2.25.0}"
halo_jar="${runtime_dir}/halo-${halo_version}.jar"

mkdir -p "${runtime_dir}"

if [[ -f "${halo_jar}" ]]; then
  echo "Halo ${halo_version} is already available at ${halo_jar}"
  exit 0
fi

echo "Downloading Halo ${halo_version}..."
curl --fail --location --retry 3 \
  "https://dl.halo.run/release/halo-${halo_version}.jar" \
  --output "${halo_jar}"

echo "Downloaded ${halo_jar}"
