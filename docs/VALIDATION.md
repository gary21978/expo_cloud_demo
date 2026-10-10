# 验证记录

日期：2026-10-10。

## 实际已执行

| 项目 | 结果 |
| --- | --- |
| npm 依赖解析与安装 | 成功，生成并提交 package-lock.json；本地安装禁用 lifecycle scripts |
| TypeScript | npm run typecheck 成功 |
| 业务单元测试 | 7 PASS，0 FAIL，0 SKIP |
| Expo 兼容版本检查 | expo install --check：Dependencies are up to date |
| 配置目标校验 | Android/iOS App ID 与 Maestro flow App ID 一致，锁文件存在 |
| 双端原生工程生成 | expo prebuild --platform all --no-install 成功；未执行 CocoaPods |
| Android 工程 | gradlew、gradle-wrapper.jar 存在，Release 使用调试签名 |
| iOS 工程 | GOCloudDemo.xcodeproj 生成，bundle ID 正确，最低 iOS 15.1 |
| Android JavaScript 打包 | Metro / Expo export 成功，生成 Hermes .hbc |
| iOS JavaScript 打包 | Metro / Expo export 成功，生成 Hermes .hbc |
| Maestro | 固定 2.11.0 CLI 实际运行，两个 flow 均 check-syntax 返回 OK |
| 下载完整性 | 固定 Maestro release ZIP 的 SHA-256，安装脚本校验 |
| 工作流 | actionlint 1.7.7 校验成功，未启用外部 shellcheck/pyflakes |
| Shell | 所有脚本通过 bash -n |

本地检查环境为 Node 24.19.0 / npm 11.9.0；CI 使用 GO 现有移动端 CI 同系列的 Node 22.22.0。

## 尚未执行

- Gradle 编译出 APK。
- CocoaPods / Xcode 编译出 iOS Simulator App。
- Android/iOS 模拟器实际运行两个 Maestro 流程。
- 首次 GitHub Actions 完整通过。

本环境没有 Android SDK/模拟器，也没有 macOS/Xcode。JavaScript 打包成功并不等于原生构建通过，flow 语法通过也不等于设备操作通过。正式验收以新仓库中的 Acceptance gate 和原始设备测试日志为准。

## 本地实现中的修正

- 添加 expo-system-ui、明确 edge-to-edge、提供 App 图标，修正首次 prebuild 的配置提示。
- 采用 SDK 53 兼容的 React Native 0.79.6；GO 检出的锁文件仍是 0.79.0，本次没有修改 GO。
- 原生目录由 CI 自动生成并检查，避免模板忽略 Gradle Wrapper 后导致仓库缺文件。
- SDK 安装明确指定 platform-tools，避免旧 tools 包不存在的问题。
- Release App 内置 JS，设备运行不依赖 Metro。
- 截图通过 Maestro test-output-dir 保存到产物目录；设备脚本保留原始退出码，不会因保存证据而掩盖失败。

## 范围

此项目为独立示例，不连接 GO 服务器、真实支付、供应商库存、登录账户或推送服务。取消与退款文字仅是内存状态变化。GO 真实业务验收需另行接入测试 API、测试账户与完整业务断言。
