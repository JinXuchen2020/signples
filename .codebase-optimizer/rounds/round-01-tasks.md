# Round 1: 任务清单

**生成时间**: 2026-06-12
**当前阶段**: 阶段1

## 待办任务

### [ ] R1-T1 [P1] 统一 BASE_URL 到 api/config.uts
- **文件**: `api/config.uts:1`, `utils/http/index.uts:1`
- **方案**: 
  1. 保留 `api/config.uts` 中的 `BASE_URL` 和 `APIS`
  2. `utils/http/index.uts` 删除 `BASE_URL` 硬编码，改为 `import { BASE_URL } from '@/api/config.uts'`

### [ ] R1-T2 [P1] 修复 `handleTouchEnd` 创建重复组件实例
- **文件**: `pages/programs/editor.uvue:695-704`
- **方案**: 移除 `handleTouchEnd` 中的 `createComponentByType` 重新创建逻辑，直接修改现有实例的属性

### [ ] R1-T3 [P1] 修复 `historyManager` 监听器泄漏
- **文件**: `pages/programs/editor.uvue:393`, `pages/programs/editor.uvue:992-1000`
- **方案**: 保存 `historyManager.onChange` 的返回值（清理函数），在 `onUnmounted` 中调用

### [ ] R1-T4 [P1] 合并重复的 `createComponentByType` 函数
- **文件**: `pages/programs/shared/media-config/index.uts:10-18`, `pages/programs/editor.uvue:474-481`
- **方案**: 导出 `media-config/index.uts` 中的 `createComponentByType`，`editor.uvue` 导入使用

### [ ] R1-T5 [P2] 简化 `options-tab` 模板冗余
- **文件**: `pages/programs/editor.uvue:87-90`
- **方案**: 移除 `v-if`/`v-else`，直接用 `:class="{active: activeTab == N}"`

### [ ] R1-T6 [P2] 修复 `getCanvasRect` 空值检查
- **文件**: `pages/programs/editor.uvue:489-506`
- **方案**: 添加 rect 为 null 时的处理逻辑

### [ ] R1-T7 [P2] 移除 `editor.uvue` 重复的 `defl` 变量
- **文件**: `pages/programs/editor.uvue:483`, `pages/programs/editor.uvue:967`
- **方案**: 将 `defl` 声明移到顶层常量位置

## 本周任务统计
- **总计**: 7 个
- **已完成**: 0 个
- **待完成**: 7 个

---
**所有任务已完成**  ← 完成时替换此行
