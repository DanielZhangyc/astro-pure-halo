#!/usr/bin/env bash

set -euo pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
runtime_dir="${HALO_RUNTIME_DIR:-${project_dir}/.halo-test}"
halo_version="${HALO_VERSION:-2.25.0}"
halo_jar="${runtime_dir}/halo-${halo_version}.jar"
halo_port="${HALO_PORT:-8090}"
halo_work_dir="${HALO_WORK_DIR:-$(dirname "${project_dir}")/.halo2-astro-pure-halo}"
theme_dir="${halo_work_dir}/themes/astro-pure-halo"

if [[ ! -f "${halo_jar}" ]]; then
  "${project_dir}/scripts/halo-download.sh"
fi

mkdir -p "${halo_work_dir}/themes"

if [[ -e "${theme_dir}" && ! -L "${theme_dir}" ]]; then
  echo "Cannot link the theme: ${theme_dir} already exists and is not a symlink." >&2
  exit 1
fi

ln -sfn "${project_dir}" "${theme_dir}"

echo "Halo work directory: ${halo_work_dir}"
echo "Theme source: ${project_dir}"
echo "Open http://localhost:${halo_port} after Halo starts."

exec java \
  -Dfile.encoding=UTF-8 \
  -Xms256m \
  -Xmx512m \
  -jar "${halo_jar}" \
  "--spring.config.additional-location=optional:file:${project_dir}/dev/halo/" \
  "--halo.work-dir=${halo_work_dir}" \
  "--halo.external-url=http://localhost:${halo_port}" \
  "--server.port=${halo_port}"
