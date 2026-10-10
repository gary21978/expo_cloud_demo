#!/usr/bin/env bash
set -euo pipefail
PLATFORM="${1:?Usage: bash scripts/prebuild.sh android|ios}"
case "$PLATFORM" in android|ios) ;; *) echo 'Unknown platform' >&2; exit 1 ;; esac
mkdir -p "artifacts/$PLATFORM"
CI=1 EXPO_NO_TELEMETRY=1 npx --no-install expo prebuild --platform "$PLATFORM" --no-install 2>&1 | tee "artifacts/$PLATFORM/prebuild.log"
if [[ "$PLATFORM" == android ]]; then
  test -f android/gradlew
  test -f android/gradle/wrapper/gradle-wrapper.jar
  chmod +x android/gradlew
else
  test -f ios/Podfile
  test -d ios/GOCloudDemo.xcodeproj
fi
