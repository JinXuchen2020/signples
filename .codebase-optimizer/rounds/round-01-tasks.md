# Round 1: 任务清单

**生成时间**: 2026-06-12
**当前阶段**: 阶段1

## 待办任务

### [x] R1-T1 [P0] 移除硬编码默认管理员凭证
- **文件**: `pages/user/index.uvue:107-108`
- **方案**: 已改为 `account: ''`, `password: ''`

### [x] R1-T2 [P0] 修复设备过期逻辑 Bug
- **文件**: `pages/devices/edit.uvue:138`
- **方案**: 已移除多余条件

### [x] R1-T3 [P0] 修复 Canvas 缩放未生效
- **文件**: `pages/programs/editor.uvue:19`
- **方案**: 已乘入 zoomLevel

### [x] R1-T4 [P0] 补充空网络失败处理器
- **文件**: `pages/user/index.uvue:182-184`
- **方案**: 已添加 showToast

### [x] R1-T5 [P1] 提取硬编码中文到国际化
- **文件**: 多处
- **方案**: 已提取 10+ 处硬编码中文到 locale，替换为 $t()/i18n.global.t()

### [x] R1-T6 [P1] 移除未使用的变量和死代码
- **文件**: 多处
- **方案**: 已移除 title/checkLayoutIndex/handleRouteGoto/handleTypeChange/handleIsHasValidityChange/重复 defl

### [x] R1-T7 [P1] 修复弱 Draw Throttle
- **文件**: `pages/programs/editor.uvue:533-538`
- **方案**: 已用 setTimeout 重写

### [x] R1-T8 [P1] 修正 CSS 命名错误和重复属性
- **文件**: 多处
- **方案**: defaultyle→default-style, defalut-form→default-form, 删除重复 border-radius

### [x] R1-T9 [P1] 替换 JSON.stringify 空对象检查
- **文件**: `pages/index/index.uvue`
- **方案**: 脚本部分改为 Object.keys，模板保留（UTS 兼容性）

### [x] R1-T10 [P1] 修复静默 Catch 块
- **文件**: 7 处
- **方案**: 已全部添加 showToast

### [x] R1-T11 [P2] 补充 .gitignore 规则
- **文件**: `.gitignore`
- **方案**: 已添加

### [x] R1-T12 [P2] 修正非标准语言代码
- **文件**: `common/constants.uts`、`locale/index.uts`、`locale/lang/{kr→ko,jp→ja}`、`pages/` 三处引用
- **方案**: kr→ko, jp→ja，添加存储兼容迁移
- **推迟计数**: 0（已修复）

## 本周任务统计
- **总计**: 12 个
- **已完成**: 12 个
- **已跳过**: 0 个
- **推迟**: 0 个
- **待完成**: 0 个
---
**所有任务已完成**
