# GO React Native / Expo 全云端验证示例

一个独立、简化的酒店预订 App，使用与 GO 移动端相同的技术栈系列：Expo SDK 53、React Native 0.79、React 19、TypeScript。它不需要后端、Expo 账户或 Apple 开发者证书，即可通过 GitHub Actions 完成 Android/iOS Simulator 云端构建与设备自动测试。

## App 演示流程

查看 Harbour Hotel → 选择 1–7 晚 → 查看价格 → 模拟预订 → 查看订单 → 取消订单 → 模拟退款提示 → 重新开始。

每晚 CNY 399。全部为内存演示数据；没有真实订单、库存、扣款、退款、登录或 GO API 调用。重启归零。界面使用英文以方便双平台截图和自动测试；运行指南为中文。

## 包含内容

| 路径 | 用途 |
| --- | --- |
| `App.tsx`、`index.ts` | 双平台界面和 Expo 入口 |
| `src/booking.ts` | 价格、晚数边界、预订与取消逻辑 |
| `tests/booking.test.cjs` | 7 个业务单元测试 |
| `maestro/` | 双平台共用的 2 条设备验收流程 |
| `app.json`、`package-lock.json` | App 标识、平台配置与锁定依赖 |
| `.github/workflows/cloud-acceptance.yml` | 质量任务、Android、iOS、总验收 |
| `scripts/` | 原生工程生成、构建、模拟器运行、证据保存 |
| `docs/ACCEPTANCE.md` | 只使用浏览器上传和运行的步骤 |
| `docs/VALIDATION.md` | 已完成和待完成的验证记录 |

Android 和 iOS 原生工程由 Expo CNG / prebuild 生成，不在 ZIP 中预先提供。工作流从锁定依赖和 app.json 生成各自的平台目录，立即检查 Gradle Wrapper 与 Xcode 工程是否存在，再编译。这样不依赖手动上传原生工程或提交被模板忽略的 Wrapper 文件。不要在生成目录中长期保存手工改动，应使用 Expo 配置或 config plugin。

## 云端运行

把本包导入一个新建 GitHub 仓库的根目录并提交即可触发工作流。按 [操作指南](docs/ACCEPTANCE.md) 执行。

1. `Typecheck and unit tests`：npm ci、SDK 兼容检查、配置检查、类型检查、7 个单元测试。
2. `Android APK and device tests`：Linux，生成原生工程，编译 Release APK，API 34 模拟器，Maestro 测试。
3. `iOS app and device tests`：macOS 15，生成工程，CocoaPods，Xcode Release Simulator 构建，Maestro 测试。
4. `Acceptance gate`：只有前三个任务全部成功才通过。失败、跳过、取消都不通过。

Release 构建内置 JavaScript，无需常驻 Metro 开发服务器。Android APK 使用 Expo 模板的调试签名，只用于演示；iOS `.app` 是 Simulator 版本，不可安装到 iPhone 真机。

## 产物

| Artifact | 内容 |
| --- | --- |
| `quality-evidence` | 类型、配置、兼容检查、单元测试日志 |
| `android-evidence` | `go-demo.apk`、JUnit、Maestro 日志/截图、设备日志 |
| `ios-evidence` | `ios-simulator-app.zip`、JUnit、Maestro 日志/截图、Xcode/Pods 日志 |

Android APK 包含 x86_64（模拟器）和 arm64-v8a（多数现代 Android 手机），不包含 32 位 ARM。Artifacts 保留 14 天。失败时保存已有证据，工具安装、编译或设备启动早期失败可能没有完整截图或报告。

## 与 GO 的关系

版本对照基于本次读取的 GO 提交 `fa997b90b75956938be0387f73d17aab2d36f7a6`。

| 包 | GO 当前锁文件 | 本示例 |
| --- | --- | --- |
| Expo | 53.0.27 | 53.0.27 |
| React | 19.0.0 | 19.0.0 |
| React Native | 0.79.0 | 0.79.6 |
| Safe Area Context | 5.4.0 | 5.4.0 |

本示例在相同 0.79 系列中使用 0.79.6，以符合 Expo 53.0.27 官方兼容版本；`expo install --check` 已通过。没有修改 GO 仓库。此示例证明基础移动端工具链，不证明 GO 的真实业务、接口、支付或供应商能力已通过。

## 固定版本

- CI Node 22.22.0，Java 17。
- 核心 npm 包固定精确版本，完整 package-lock.json 随包提交。
- Maestro CLI 2.11.0，下载校验 SHA-256。
- macOS/Xcode runner 镜像与 Action 大版本可更新，不是完全冻结的环境；iOS 实际版本在日志中记录。

## 开发命令

```bash
npm ci --no-audit --no-fund
npm run typecheck
npm test
npm run check:expo
npm start
```

本地或租用的云端设备环境中可用 `npm run android` / `npm run ios`。这些是开发模式，会启动 Metro；Actions 使用的 Release 构建则无需 Metro。iOS 原生编译要求 macOS/Xcode。全云端验收无需在自己的电脑安装这些工具。

## 参考

- Expo CNG：https://docs.expo.dev/workflow/continuous-native-generation/
- Expo 原生构建：https://docs.expo.dev/guides/local-app-production/
- Maestro CLI：https://docs.maestro.dev/maestro-cli/how-to-install-maestro-cli
- GO 源码版本：https://github.com/yuguangzhi3836-glitch/GO/tree/fa997b90b75956938be0387f73d17aab2d36f7a6/application/mobile/go-app
