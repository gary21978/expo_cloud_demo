#!/usr/bin/env bash
set -euo pipefail
mkdir -p artifacts/ios
bash scripts/prebuild.sh ios
(cd ios && pod install) 2>&1 | tee artifacts/ios/pods.log
# The simulator build requires no Apple account or provisioning profile.
xcodebuild -workspace ios/GOCloudDemo.xcworkspace -scheme GOCloudDemo \
  -configuration Release -sdk iphonesimulator \
  -destination 'generic/platform=iOS Simulator' \
  -derivedDataPath build/ios CODE_SIGNING_ALLOWED=NO \
  build 2>&1 | tee artifacts/ios/build.log
test -d build/ios/Build/Products/Release-iphonesimulator/GOCloudDemo.app
ditto -c -k --sequesterRsrc --keepParent \
  build/ios/Build/Products/Release-iphonesimulator/GOCloudDemo.app \
  artifacts/ios/ios-simulator-app.zip
