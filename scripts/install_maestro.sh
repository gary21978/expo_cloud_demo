#!/usr/bin/env bash
set -euo pipefail
# Fixed release and checksum: downloaded from the official Maestro release.
VERSION=2.11.0
SHA256=5384593cb4e7a106489e75a821d157dd43f4e438df6bc308b72e82c685e1283a
DEST="${RUNNER_TEMP:-/tmp}/go-expo-demo-maestro"
mkdir -p "$DEST"
curl -fsSL --retry 3 "https://github.com/mobile-dev-inc/Maestro/releases/download/cli-$VERSION/maestro.zip" -o "$DEST/maestro.zip"
python3 - "$DEST/maestro.zip" "$SHA256" <<'PY'
import hashlib,sys
with open(sys.argv[1],'rb') as f:
    actual=hashlib.file_digest(f,'sha256').hexdigest()
if actual != sys.argv[2]:
    raise SystemExit('Maestro archive checksum mismatch')
PY
unzip -q -o "$DEST/maestro.zip" -d "$DEST"
chmod +x "$DEST/maestro/bin/maestro"
if [[ -n "${GITHUB_PATH:-}" ]]; then
  printf '%s\n' "$DEST/maestro/bin" >> "$GITHUB_PATH"
fi
"$DEST/maestro/bin/maestro" --version
