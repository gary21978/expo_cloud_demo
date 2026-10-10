#!/usr/bin/env bash
set -euo pipefail
mkdir -p artifacts/ios
bash scripts/prebuild.sh ios
(cd ios && pod install) 2>&1 | tee artifacts/ios/pods.log
# Apple Silicon simulator package; this is not an iPhone device build.
# Explicit ARCHS avoids compiling both arm64 and x86_64 for the generic destination.
xcodebuild -workspace ios/GOCloudDemo.xcworkspace -scheme GOCloudDemo \
  -configuration Release -sdk iphonesimulator \
  -destination 'generic/platform=iOS Simulator' \
  -derivedDataPath build/ios CODE_SIGNING_ALLOWED=NO \
  ARCHS=arm64 ONLY_ACTIVE_ARCH=YES \
  build 2>&1 | tee artifacts/ios/build.log
APP_PATH=build/ios/Build/Products/Release-iphonesimulator/GOCloudDemo.app
test -d "$APP_PATH"
APP_ARCHS="$(xcrun lipo -archs "$APP_PATH/GOCloudDemo")"
printf 'Target: iOS Simulator\nExpected: arm64\nActual: %s\n' "$APP_ARCHS" \
  | tee artifacts/ios/app-architecture.txt
if [[ "$APP_ARCHS" != arm64 ]]; then
  echo "Expected an arm64-only simulator app, got: $APP_ARCHS" >&2
  exit 1
fi
ditto -c -k --sequesterRsrc --keepParent \
  "$APP_PATH" \
  artifacts/ios/ios-simulator-app.zip
