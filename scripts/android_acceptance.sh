#!/usr/bin/env bash
set -euo pipefail
mkdir -p artifacts/android/screens
capture() {
  local status=$?
  trap - EXIT
  adb -s emulator-5554 shell screencap -p /sdcard/demo.png || true
  adb -s emulator-5554 pull /sdcard/demo.png artifacts/android/device-final.png || true
  adb -s emulator-5554 logcat -d > artifacts/android/logcat.txt 2>&1 || true
  exit "$status"
}
trap capture EXIT
adb -s emulator-5554 wait-for-device
adb -s emulator-5554 install -r artifacts/android/go-demo.apk
maestro --device emulator-5554 test --format JUNIT --output artifacts/android/junit.xml \
  --debug-output artifacts/android/maestro-debug --test-output-dir artifacts/android/flow-output \
  maestro/ 2>&1 | tee artifacts/android/maestro.log
