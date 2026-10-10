#!/usr/bin/env bash
set -euo pipefail
mkdir -p artifacts/android
bash scripts/prebuild.sh android
# Release embeds JavaScript; no Metro server is needed on the installed app.
(cd android && ./gradlew :app:assembleRelease --no-daemon --max-workers=2 -PreactNativeArchitectures=x86_64,arm64-v8a) 2>&1 | tee artifacts/android/build.log
cp android/app/build/outputs/apk/release/app-release.apk artifacts/android/go-demo.apk
