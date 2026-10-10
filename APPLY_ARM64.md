# iOS Apple Silicon 模拟器构建优化

基于 expo_cloud_demo 提交 88b08961c81994a004cc7daf856520c7178bc07c。
解压本包，将 scripts/build_ios.sh、README.md、docs/ACCEPTANCE.md 覆盖到仓库同名位置。
在 Codespaces 仓库根目录执行：

```bash
bash -n scripts/build_ios.sh
git diff -- scripts/build_ios.sh README.md docs/ACCEPTANCE.md
git add scripts/build_ios.sh README.md docs/ACCEPTANCE.md
git commit -m "Build Apple Silicon simulator app with arm64 only"
git push
```

上传和推送后自动运行 Actions；请确认运行使用新提交。
验收：iOS evidence 中 app-architecture.txt 的 Actual 为 arm64，双端测试及 Acceptance gate 成功。
比较 iOS 构建步骤与之前的 14 分 48 秒，而非整个任务时间。
当前更新只在 Linux 验证了 Shell 语法、构建参数与架构检查逻辑；实际 Xcode 编译及 Maestro 测试等待 Actions。
这是 Apple Silicon Mac 的模拟器包，不支持 Intel Mac，不是 iPhone 真机安装包。
