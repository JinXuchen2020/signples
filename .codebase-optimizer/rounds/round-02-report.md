# Round 2: 阶段2 分析报告

**分析时间**: 2026-06-12
**当前阶段**: 阶段2
**分析维度**: 性能 → 安全 → 工程化
**分析范围**: 全项目（~3350文件, 450K行）

## 问题汇总

### ⚡ 性能 (Performance) — 5 个问题

#### P1-1: 模板中直接使用 JSON.stringify 进行空对象判断
- **文件**: `pages/index/index.uvue:8,15,20,24`
- **描述**: 4处 `JSON.stringify(activeUser) != '{}'` 和 `JSON.stringify(activeDevice) != '{}'` 在模板中，每次渲染都序列化整个对象
- **方案**: 改为计算属性 `Object.keys(obj).length > 0`

#### P1-2: JSON.parse(JSON.stringify()) 在历史热路径深克隆
- **文件**: `pages/programs/shared/history.uts:86`
- **描述**: 每次 undo/redo/save 调用深克隆整个编辑器状态（所有页面+组件），每次用户交互都触发
- **方案**: 改为结构化浅拷贝，仅复制必要字段

#### P1-3: 6个表单组件始终挂载并激活所有 watcher
- **文件**: `pages/programs/editor.uvue:93-102`
- **描述**: VideoForm/ImageForm/WebForm/WordForm/TextForm/PageForm 全部用 CSS hidden 控制，6个 watcher 在每次选择组件时全触发
- **方案**: 改为 `v-if` 按类型挂载

#### P1-4: 设备列表过滤器 3 次全遍历
- **文件**: `pages/index/devices.uvue:143-178`
- **描述**: `filteredDeviceList` 链式调用 3 次 `.filter()`，每次击键全量重算
- **方案**: 合并为单次 reduce，搜索加防抖

#### P1-5: TouchMove 属性写入无节流
- **文件**: `pages/programs/editor.uvue:633-678`
- **描述**: 每次 touchmove 都写入坐标属性，然后调用 drawPage。draw 虽有 16ms 节流，但属性写入无节流
- **方案**: 坐标更新合并到 rAF 或 setTimeout

### 🔒 安全 (Security) — 5 个问题

#### P1-6: 硬编码 IP 地址 + 明文 HTTP
- **文件**: `api/config.uts:1`, `utils/http/index.uts:1`
- **描述**: `BASE_URL = 'http://1.255.226.145:12106'` 使用明文 HTTP 传输，API 流量（凭证、token、设备数据）未加密
- **方案**: 改为 HTTPS，提取到配置模块，支持环境切换

#### P1-7: 不安全 URL 拼接（6 处）
- **文件**: 
  - `pages/programs/editor.uvue:898-901` — `'?fileName=' + media.src`
  - `pages/programs/editor.uvue:933-934` — `?userAccount=${activeUser.account}`
  - `pages/programs/index.uvue:247-248` — 同上
  - `pages/devices/volume.uvue:157-158` — `?deviceId=${snCode}`
  - `pages/index/index.uvue:210` — `routeGoto('/pages/programs/editor?name=' + name)`
  - `pages/devices/index.uvue:220` — `'?userAccount=' + this.userAccount`
- **描述**: 用户可控数据直接拼接 URL，可能导致参数注入或路径遍历
- **方案**: 使用 URL 参数构造（URLSearchParams 或 encodeURIComponent）

#### P1-8: API 路径 {id} 替换导致的路径遍历风险
- **文件**: `api/config.uts:42-44,48,52,58,61` + 多处 `.replace("{id}", id)`
- **描述**: 用户/设备/监控 ID 直接替换进 API URL，未校验是否为数字
- **方案**: 校验 id 为数字后再替换

#### P1-9: 表单输入缺少验证（5 处）
- **文件**: `pages/user/index.uvue:80,88`（登录）`, `pages/devices/create.uvue:7-43`（设备创建）`, `pages/index/index.uvue:109-122`（节目创建）`, `pages/programs/webForm.uvue:40`（URL输入）
- **描述**: 用户输入未经前端验证直接发送到后端或用于文件路径
- **方案**: 添加前端校验（非空、格式、长度限制）

#### P1-10: 文件系统路径遍历风险
- **文件**: `pages/programs/shared/file-manager/index.uts:41,88,105,163,186,349,359,371,397`, `media-config/index.uts:120,303`, `wordForm.uvue:216`
- **描述**: programName/pageName/fileName 等用户可控值直接拼接文件路径，可用 `../` 逃逸
- **方案**: 对路径组件做白名单校验（禁止 `../`、空字符等）

### 📦 工程化 (Engineering) — 6 个问题

#### P1-11: 无根 package.json / 无脚本
- **描述**: 项目无根 `package.json`，无 lint/typecheck/test/format 脚本
- **建议**: 按 HBuilderX CLI 能力补充必要脚本

#### P1-12: 无 ESLint / Prettier 配置
- **描述**: 整个项目无 `.eslintrc` 或 `.prettierrc`
- **建议**: 添加基础 lint/format 配置

#### P1-13: README.md 仅一行标题
- **文件**: `README.md`
- **描述**: 仅 `# signplex` 一行
- **建议**: 补充项目描述、安装、运行、架构等文档

#### P1-14: 141+ 处显式 `any` 类型
- **文件**: 遍及 `utils/`, `api/`, `pages/` 约 20 个文件
- **描述**: 大量 `any` 类型和 `as any` 转型，丧失 TS 类型检查
- **建议**: 逐步替换为具体类型定义

#### P1-15: 零应用层测试
- **描述**: 仅 1 个第三方插件测试文件且大部分被注释，应用代码零测试
- **建议**: 引入 vitest 或 uni-app 测试框架，覆盖核心功能

#### P2-16: 无 tsconfig.json、无 .editorconfig、无 CI/CD、无 Docker、无 .env
- **建议**: 按需补充

## 各维度汇总

| 维度 | 问题数 | P0 | P1 | P2 |
|------|--------|----|----|----|
| ⚡ 性能 | 5 | 0 | 5 | 0 |
| 🔒 安全 | 5 | 0 | 5 | 0 |
| 📦 工程化 | 6 | 0 | 5 | 1 |
| **合计** | **16** | **0** | **15** | **1** |
