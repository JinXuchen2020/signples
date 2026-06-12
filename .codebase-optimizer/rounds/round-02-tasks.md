# Round 2: 任务清单

**生成时间**: 2026-06-12
**当前阶段**: 阶段2

## 待办任务

### [x] R2-T1 [P1] 模板中 JSON.stringify 空对象判断改为计算属性
- **文件**: `pages/index/index.uvue:8,15,20,24`
- **方案**: 
  1. 在 methods 中添加 `isEmptyObj(obj)` 辅助方法
  2. 模板中替换 `JSON.stringify(activeUser) != '{}'` 为 `!isEmptyObj(activeUser)`
  3. 模板中替换 `JSON.stringify(activeDevice) != '{}'` 为 `!isEmptyObj(activeDevice)`
- **结果**: ✅ 已完成 - 消除模板中反复序列化对象的性能开销

### [x] R2-T2 [P1] 登录请求改用统一 HTTP 封装
- **文件**: `pages/user/index.uvue:130-216`
- **方案**:
  1. 导入 `post` 函数
  2. 将 `uni.request` 登录调用替换为 `await post(APIS.login, { account, password })`
  3. 统一错误处理逻辑
- **结果**: ✅ 已完成 - 登录请求现在走统一 HTTP 层

### [x] R2-T3 [P1] HTTP 请求日志添加环境判断
- **文件**: `utils/http/index.uts:23`
- **方案**:
  1. 将 `console.log('请求url', url)` 改为条件输出 `if (__DEV__)`
- **结果**: ✅ 已完成

### [x] R2-T4 [P1] 批量删除设备改用并发控制
- **文件**: `pages/index/devices.uvue:292-325`
- **方案**:
  1. 将 `for...of` + `await` 改为批次并发执行（每次最多 3 个）
  2. 使用 `Promise.allSettled` 批次处理
- **结果**: ✅ 已完成 - N 个设备从串行改为并发，显著提升速度

### [x] R2-T5 [P1] 媒体文件下载添加并发限制
- **文件**: `pages/programs/editor.uvue:888-923`
- **方案**:
  1. 添加并发下载限制（每次最多 3 个）
  2. 使用队列方式分批处理
- **结果**: ✅ 已完成 - 防止大量媒体文件同时下载导致内存溢出

### [x] R2-T6 [P2] 统一 STORAGE_KEYS 常量为单一数据源
- **文件**: `common/config.uts`, `common/constants.uts`, `store/index.uts`
- **方案**:
  1. 将完整的 STORAGE_KEYS 定义放在 `common/config.uts`
  2. `common/constants.uts` 改为 `export { STORAGE_KEYS } from '@/common/config.uts'`
  3. `store/index.uts` 导入 `common/config.uts` 中的 STORAGE_KEYS
- **结果**: ✅ 已完成 - 消除了 3 个重复定义

### [x] R2-T7 [P2] 增强 deepClone 函数支持特殊类型
- **文件**: `utils/index.uts:91-94`
- **方案**:
  1. 添加对 `Date`、`RegExp`、`Array` 类型的特殊处理
  2. 优先使用 `structuredClone` API
  3. fallback 到 JSON 方式
- **结果**: ✅ 已完成

### [x] R2-T8 [P2] 编辑器自动保存添加安全保护
- **文件**: `pages/programs/editor.uvue:968-985`
- **方案**:
  1. 添加最大自动保存次数计数器（最多 100 次）
  2. 在 `onUnmounted` 中清除前保存最后一份草稿
- **结果**: ✅ 已完成

### [x] R2-T9 [P1] 编辑器 history 深拷贝优化
- **文件**: `pages/programs/shared/history.uts:85-87`
- **方案**:
  1. 优先使用 `structuredClone` API
  2. fallback 到 JSON 方式
- **结果**: ✅ 已完成

### [x] R2-T10 [P1] 清除生产环境 console.log 泄露
- **文件**: `common/router.uts:33`, `pages/programs/shared/file-manager/index.uts:246`, `pages/programs/editor.uvue:834,838`
- **方案**: 添加 `__DEV__` 条件判断或移除调试日志
- **结果**: ✅ 已完成

### [x] R2-T11 [P1] Logger 类绑定开发环境判断
- **文件**: `utils/logger/index.uts:16`
- **方案**: 构造函数中 `this.isDevelopment = __DEV__`
- **结果**: ✅ 已完成

## 本周任务统计
- **总计**: 11 个
- **已完成**: 11 个
- **已跳过**: 0 个
- **推迟**: 0 个
- **待完成**: 0 个
---
**所有任务已完成**
