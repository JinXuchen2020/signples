# Round 3: 任务清单

**生成时间**: 2026-06-12
**当前阶段**: 阶段1 (遗留问题修复)

## 待办任务

### [x] R3-T1 [P1] 提取 auth 判断逻辑到独立工具模块
- **文件**: 新建 `common/auth-utils.uts`
- **方案**:
  1. 从 `store/index.uts` 提取 `isLoggedIn` 判断逻辑为纯函数 `isUserLoggedIn(): boolean`
  2. 该函数直接读取 `state.token` 和 `state.loginUser`，不依赖 Vue computed
  3. 修改 `common/router.uts` 导入 `isUserLoggedIn` 替代 `useAuth().isLoggedIn`
  4. 保留原有 `useAuth()` 返回值中 `isLoggedIn` 改为调用新函数
- **风险评估**: 低 — 纯逻辑提取，不改变行为
- **原因**: R1-T10 遗留，消除 router 层对 Vue computed 的依赖
- **结果**: ✅ 已完成 - router.uts 现在导入独立的 auth-utils，不再依赖 store/index.uts 的 useAuth() computed

### [x] R3-T2 [P2] 统一 toast 时长为常量
- **文件**: 所有 .uvue 文件中的 34 处 `duration: 3000`
- **方案**:
  1. 导入 `DEFAULT_TOAST_DURATION` from `@/common/config.uts`
  2. 替换所有 `duration: 3000` 为 `duration: DEFAULT_TOAST_DURATION`
- **文件清单**:
  - `pages/programs/editor.uvue:840,875`
  - `pages/programs/index.uvue:295`
  - `pages/setting/index.uvue:184`
  - `pages/devices/volume.uvue:222,253`
  - `pages/devices/timercontrol.uvue:267,295,330`
  - `pages/devices/restart.uvue:179,215`
  - `pages/devices/poweroffon.uvue:149`
  - `pages/devices/edittime.uvue:258,279,312`
  - `pages/devices/editbrightness.uvue:182,224,244,255`
  - `pages/devices/edit.uvue:187,223,234,276,286`
  - `pages/devices/create.uvue:121,130,162`
  - `components/timer-controls/timer-controls.uvue:147,163,176,185,216`
  - `components/picker-date/picker-date.uvue:137,152`
- **风险评估**: 零风险 — 值完全相同，仅为可维护性改进
- **结果**: ✅ 已完成 - 14个文件中34处 `duration: 3000` 全部替换为 `DEFAULT_TOAST_DURATION`

### [ ] R3-T3 [P2] 跳过 - store bypass 在 pages/programs 中是合法使用
- **文件**: `pages/programs/index.uvue:148,178` 和 `pages/programs/editor.uvue:216,943`
- **方案**: 不修改
- **原因**: `useState()` 用于读取认证状态（token、activeUser），这是业务逻辑的必要部分。store 提供持久化状态，页面需要知道用户是否登录、当前用户是谁。这不是"绕过 API 层"的问题 — API 层负责数据请求，store 负责状态管理，两者职责不同，不存在冲突。

## 任务统计
- **总计**: 3 个
- **已完成**: 2 个
- **已跳过**: 1 个
