# 浏览器完成 Android / iOS 云端验收

## 1. 创建独立仓库

下载 `expo_cloud_demo.zip`。登录 GitHub，创建 `go-expo-cloud-demo` 仓库并勾选 Add a README file。此示例请先放在新仓库，导入会覆盖同名 README，不要在 GO 正式仓库根目录直接覆盖导入。

打开 Code → Codespaces → Create codespace on main，等待云端编辑器出现。

GitHub 账户需要 Codespaces / Actions 可用额度；私有仓库的 macOS runner 费用与配额以自己的账户为准。无需 Expo 登录、EXPO_TOKEN、Apple 开发者证书或 Secrets，本项目没有使用 EAS 构建。

## 2. 上传并导入

把 ZIP 拖到 Codespaces 左侧 Explorer 的仓库根目录，文件名保持 `expo_cloud_demo.zip`。打开 Terminal → New Terminal，执行：

```bash
cd "$(git rev-parse --show-toplevel)"

python3 - <<'PY'
from pathlib import Path
from zipfile import ZipFile
import shutil
archive=Path('expo_cloud_demo.zip')
staging=Path('/tmp/go-expo-demo-import')
if staging.exists():
    shutil.rmtree(staging)
with ZipFile(archive) as bundle:
    bundle.extractall(staging)
for item in (staging/'expo_cloud_demo').iterdir():
    target=Path.cwd()/item.name
    if item.is_dir():
        shutil.copytree(item,target,dirs_exist_ok=True)
    else:
        shutil.copy2(item,target)
print('Imported Expo demo')
PY

chmod +x scripts/*.sh

git add .github .gitignore assets src tests maestro scripts docs App.tsx index.ts app.json package.json package-lock.json tsconfig.json tsconfig.tests.json README.md

git commit -m "Add Expo Android and iOS cloud demo"
git push
```

确认仓库根目录直接包含 package.json 和 App.tsx。工作流应位于 `.github/workflows/cloud-acceptance.yml`，不能多套一层 expo_cloud_demo 目录。ZIP 本身无需提交。

## 3. 启动云端验证

提交自动触发。回到 GitHub 仓库 → Actions → Expo cloud acceptance → 最新运行。

手动运行：Actions → Expo cloud acceptance → Run workflow → main → Run workflow。

先完成 Typecheck and unit tests，再并行运行 Android APK and device tests 与 iOS app and device tests，最后运行 Acceptance gate。原生编译首次需要下载许多依赖，可能耗时数十分钟；两个设备任务分别设置 60 分钟超时。

本配置不需要你手动接受 SDK 提示，也不要求把 android/gradlew 提交到仓库。Actions 会运行 expo prebuild，检查生成的 Wrapper 文件，再执行 chmod 和 Gradle。

## 4. 验收标准

| 项目 | 通过条件 |
| --- | --- |
| SDK 和类型 | expo install --check、配置校验、TypeScript 全部成功 |
| 业务逻辑 | 7 个 Node 单元测试成功 |
| Android 构建 | 独立 APK 生成并安装到模拟器 |
| iOS 构建 | 独立 arm64 Simulator App 生成，`app-architecture.txt` 的 Actual 为 arm64，并安装到模拟器 |
| 设备流程一 | 详情 → 3 晚 / CNY 1197 → 预订确认 → 取消 → 模拟退款 → 重新开始，恢复 1 晚 |
| 设备流程二 | 1 晚下限、7 晚上限、对应按钮禁用；减少到 6 晚价格 CNY 2394 |
| 总验收 | Acceptance gate 为绿，前三项依赖均为 success |

单元测试检查业务模型，Maestro 在真实模拟器 App 界面上点击并断言，两者职责不同。截图辅助确认界面状态，JUnit 与流程日志才是自动测试结果。应用内所有订单均为演示数据。

## 5. 下载与试用

在运行 Summary 页面底部 Artifacts 下载 quality-evidence、android-evidence、ios-evidence。

- Android：解压 android-evidence，安装 go-demo.apk 到 arm64 Android 手机。按系统提示允许该下载来源安装，然后手动操作上述流程。
- iOS：查看云端截图、JUnit 和日志即可验收。交互式试用需要自己的或租用的 Apple Silicon Mac + Xcode（不支持 Intel Mac）；解压 ios-simulator-app.zip 得到 GOCloudDemo.app，启动兼容的 iPhone Simulator 后执行：

```bash
xcrun simctl install booted GOCloudDemo.app
xcrun simctl launch booted com.example.goexpoclouddemo
```

Actions 没有可远程点击的模拟器窗口。当前 iOS 包不能安装到 iPhone 真机；后续真机分发要另行增加签名和分发配置。

## 6. 修改后重新验收

修改源文件后，在 Codespaces 执行：

```bash
git add App.tsx src app.json package.json package-lock.json maestro scripts .github docs
git commit -m "Update Expo demo"
git push
```

提交会启动新运行并取消同分支较早的运行。重跑旧运行仍然使用旧提交，修复配置后应提交新版本。

## 7. 失败定位

| 失败位置 | 查看内容 |
| --- | --- |
| npm ci | package.json 和 package-lock.json 是否一致、网络下载日志 |
| Expo check | SDK 53 对核心包版本的兼容要求 |
| prebuild | app.json、icon.png、生成的 native 目录及 prebuild.log |
| Gradle | android build.log、Java/SDK/NDK 下载情况 |
| CocoaPods / Xcode | pods.log、build.log、xcode-version.txt |
| Maestro 安装 | 下载地址、固定版本、校验和、Java 环境 |
| 模拟器启动 | emulator 步骤，或 available-devices.txt 与 simulator-udid.txt |
| Maestro 流程失败 | junit.xml、maestro.log、maestro-debug、操作截图及设备日志 |

保存第一个失败步骤的完整日志后再定位；不要删除必要测试或让错误步骤 continue-on-error 来制造绿色验收结果。
