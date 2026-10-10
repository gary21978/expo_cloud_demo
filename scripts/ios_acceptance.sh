#!/usr/bin/env bash
set -euo pipefail
mkdir -p artifacts/ios/screens
UDID="$(python3 scripts/select_ios_simulator.py)"
printf '%s\n' "$UDID" > artifacts/ios/simulator-udid.txt
capture() {
  local status=$?
  trap - EXIT
  xcrun simctl io "$UDID" screenshot artifacts/ios/device-final.png || true
  xcrun simctl spawn "$UDID" log show --last 5m --style compact --predicate 'process == "GOCloudDemo"' > artifacts/ios/device.log 2>&1 || true
  xcrun simctl shutdown "$UDID" || true
  exit "$status"
}
trap capture EXIT
STATE="$(xcrun simctl list devices available --json | python3 -c 'import json,sys; u=sys.argv[1]; print(next(d["state"] for ds in json.load(sys.stdin)["devices"].values() for d in ds if d["udid"]==u))' "$UDID")"
if [[ "$STATE" != Booted ]]; then xcrun simctl boot "$UDID"; fi
xcrun simctl bootstatus "$UDID" -b
xcrun simctl install "$UDID" build/ios/Build/Products/Release-iphonesimulator/GOCloudDemo.app
maestro --device "$UDID" test --format JUNIT --output artifacts/ios/junit.xml \
  --debug-output artifacts/ios/maestro-debug --test-output-dir artifacts/ios/flow-output \
  maestro/ 2>&1 | tee artifacts/ios/maestro.log
