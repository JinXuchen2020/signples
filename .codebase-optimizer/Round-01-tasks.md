# Round 1: 任务清单

**生成时间**: 2026-06-12
**当前阶段**: 阶段1

## 待办任务

### [x] R1-T1 [P0] 创建用户创建页面 (user/create.uvue)
- **文件**: `pages/user/create.uvue`
- **方案**: 创建新的用户创建页面，包含完整的表单（账户名、密码、角色选择等），参考 `pages/index/users.uvue` 中的用户选择逻辑和 `pages/user/edit.uvue` 的页面结构，实现表单验证和提交逻辑。

### [x] R1-T2 [P0] 完善用户编辑页 (user/edit.uvue)
- **文件**: `pages/user/edit.uvue`
- **方案**: 将空模板改造为完整的编辑页面，添加表单UI（账户名、密码、角色等），添加数据加载（onLoad 中获取 userId），添加保存/提交逻辑，添加表单验证。

### [x] R1-T3 [P0] 添加设置页菜单点击事件 (setting/index.uvue)
- **文件**: `pages/setting/index.uvue`
- **方案**: 为16个菜单项添加 `@tap` 或 `@click` 处理器，每个处理器调用 `routeGoto()` 跳转到对应子页面。包括：Brightness(亮度)、Volume(音量)、Time(时间)、Network(网络)、SyncPlay(同步播放)、LocalPlay(本地播放)、ScreenRotation(屏幕旋转)、SoftSplicing(软拼接)、Restart(重启)、Power(电源)、Reset(重置)、BindCloud(绑定云)、DevicePassword(设备密码)、MonitorInfo(监控信息)、DeviceInfo(设备信息)。

### [x] R1-T4 [P0] 替换播放器页面硬编码 (player/index.uvue)
- **文件**: `pages/player/index.uvue`
- **方案**: 从 store 或 API 加载当前播放列表和活跃设备信息。添加 `getProgramList()` 和 `getActiveDevice()` 方法，使用 v-for 渲染动态节目列表，从 store 获取当前设备名。

### [x] R1-T5 [P0] 统一 formatDuration 函数
- **文件**: `utils/index.uts:25-32`, `pages/programs/shared/form-utils/index.uts:86-93`
- **方案**: 删除 `form-utils/index.uts` 中的重复 `formatDuration`，保留 `utils/index.uts` 中的版本。更新 `pages/programs/videoForm.uvue:87` 的 import 指向 `utils/index.uts`。

### [x] R1-T6 [P0] 统一 getProgramFolder 函数
- **文件**: `pages/programs/shared/media-config/index.uts:6-8`, `pages/programs/shared/form-utils/index.uts:68-70`
- **方案**: 删除 `form-utils/index.uts` 中的 `getProgramFolder`，在 `media-config/index.uts` 中使用命名常量 `STORAGE_KEYS.PROGRAM_FOLDER`。更新 `form-utils/index.uts` 的 `getProgramFolder` 引用改为从 `media-config` 导入，或统一在 `utils/index.uts` 中定义。

### [x] R1-T7 [P0] 提取 BASE_URL 为环境变量
- **文件**: `api/config.uts:1`, `utils/http/index.uts:1`
- **方案**: 创建统一的配置模块 `common/config.uts`，将 BASE_URL 从硬编码字符串改为集中管理。确保所有 API 调用使用统一配置。

### [x] R1-T8 [P1] 消除 JSON.parse(JSON.stringify(err)) 反模式
- **文件**: 18处（主要在 `pages/devices/*.uvue` 和 `components/timer-controls/*.uvue`）
- **方案**: 创建类型安全的错误处理工具函数 `safeCloneError(err)` 和 `formatErrorMessage(err)`，替换所有重复调用。

### [x] R1-T9 [P1] 提取魔法数字为常量
- **文件**: 多处
  - `pages/programs/edit.uvue:116` - 3000 → `DEFAULT_TOAST_DURATION`
  - `pages/setting/index.uvue:212` - 0.8 → `DARK_MODE_SCALE`
  - `components/picker-date/picker-date.uvue:63,68` - 2030, 2025 → `MAX_YEAR`, `MIN_YEAR`
  - `utils/index.uts:42` - 3600 → `SECONDS_PER_HOUR`
  - `pages/devices/edittime.uvue:292,316-317` - 60*60000 → `MILLISECONDS_PER_HOUR`
  - `pages/programs/shared/form-utils/index.uts` - CANVAS_WIDTH/HEIGHT
  - `pages/programs/shared/media-config/index.uts` - Canvas 尺寸常量
- **方案**: 在 `common/config.uts` 中定义所有魔法数字常量，在各文件中使用常量替换硬编码值。

### [-] R1-T10 [P1] 解耦 router.uts 对 store 的依赖
- **文件**: `common/router.uts`
- **方案**: 将 auth 相关逻辑提取到独立模块，路由函数接收认证状态参数而非直接调用 `useAuth()`。或者使用中间件模式，在页面跳转前检查认证状态。
- **跳过原因**: 涉及架构重构，需要在后续轮次中谨慎处理

### [-] R1-T11 [P1] 页面层绕过 API 层直接使用 store
- **文件**: `pages/programs/index.uvue:148`, `pages/programs/editor.uvue:216`
- **方案**: 移除页面中对 store 的直接导入，改为通过 API 层获取数据。对于 `useState` 的使用，评估是否可以完全通过 store 组件替代页面级状态管理。
- **跳过原因**: 涉及架构重构，需要在后续轮次中谨慎处理

### [x] R1-T12 [P2] 统一 deepClone 实现
- **文件**: `utils/index.uts:91-99`, `pages/programs/shared/history.uts:85-87`
- **方案**: 统一使用 JSON 序列化版本，简化实现。

## 本周任务统计
- **总计**: 12 个
- **已完成**: 10 个
- **已跳过**: 2 个（不计入修复率）
- **推迟**: 0 个（下轮强制排入）
- **待完成**: 0 个
---
**所有任务已完成**  ← 完成时替换此行
