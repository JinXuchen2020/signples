# Round 2: 任务清单

**生成时间**: 2026-06-12
**当前阶段**: 阶段2

## 待办任务

### [ ] R2-T1 [P1] 模板中 JSON.stringify 空对象判断改为计算属性
- **文件**: `pages/index/index.uvue:8,15,20,24`
- **方案**: 
  1. 在 data 中添加 `isEmptyDevice` 和 `isEmptyUser` 响应式变量
  2. 或在 methods 中添加 `isEmptyObj(obj)` 辅助方法
  3. 在 onShow 中初始化这两个变量
  4. 模板中替换 `JSON.stringify(activeUser) != '{}'` 为 `!isEmptyUser`
  5. 模板中替换 `JSON.stringify(activeDevice) != '{}'` 为 `!isEmptyDevice`

### [ ] R2-T2 [P1] 登录请求改用统一 HTTP 封装
- **文件**: `pages/user/index.uvue:130-216`
- **方案**:
  1. 导入 `post` 函数
  2. 将 `uni.request` 登录调用替换为 `await post(APIS.login, { account, password })`
  3. 将 `request` 调用中 `getAccountInfo` 的逻辑保持不变（已经是统一的）
  4. 统一错误处理逻辑

### [ ] R2-T3 [P1] HTTP 请求日志添加环境判断
- **文件**: `utils/http/index.uts:23`
- **方案**:
  1. 将 `console.log('请求url', url)` 改为条件输出
  2. 使用 `import { isDev } from '@/common/config.uts'` 或检查 `__DEV__` 环境变量

### [ ] R2-T4 [P1] 批量删除设备改用并发控制
- **文件**: `pages/index/devices.uvue:292-325`
- **方案**:
  1. 添加一个 `batchRequest` 辅助函数，支持并发限制
  2. 将 `for...of` + `await` 改为批次并发执行（每次最多 3 个）
  3. 使用 `Promise.all` 批次处理

### [ ] R2-T5 [P1] 媒体文件下载添加并发限制
- **文件**: `pages/programs/editor.uvue:888-923`
- **方案**:
  1. 添加并发下载限制（每次最多 3 个）
  2. 使用队列方式分批处理 `downloadPromises`
  3. 添加错误处理：单个下载失败不影响其他文件

### [ ] R2-T6 [P2] 统一 STORAGE_KEYS 常量为单一数据源
- **文件**: `common/config.uts`, `common/constants.uts`, `store/index.uts`
- **方案**:
  1. 将完整的 STORAGE_KEYS 定义放在 `common/constants.uts`
  2. 删除 `common/config.uts` 中的重复定义（保留不冲突的配置）
  3. 删除 `store/index.uts` 中的本地定义，改为 `import { STORAGE_KEYS } from '@/common/constants.uts'`

### [ ] R2-T7 [P2] 增强 deepClone 函数支持特殊类型
- **文件**: `utils/index.uts:91-94`
- **方案**:
  1. 增强 `deepClone` 函数，添加对 `Date`、`Array`、`RegExp` 类型的特殊处理
  2. 检查是否有 `structuredClone` API 可用，优先使用
  3. 保持向后兼容，fallback 到 JSON 方式

### [ ] R2-T8 [P2] 编辑器自动保存添加安全保护
- **文件**: `pages/programs/editor.uvue:968-985`
- **方案**:
  1. 添加最大自动保存次数计数器（如最多 100 次后停止）
  2. 在 `onUnmounted` 中在清除定时器前保存最后一份草稿
  3. 确保清理逻辑完整

### [ ] R2-T9 [P1] 编辑器 history 深拷贝优化
- **文件**: `pages/programs/shared/history.uts:85-87`
- **方案**:
  1. 检查是否可使用 `structuredClone` API
  2. 如果不可用，添加注释标记当前性能限制
  3. 考虑在 `maxSize` 过大时截断早期历史

## 本周任务统计
- **总计**: 9 个
- **已完成**: 0 个
- **已跳过**: 0 个
- **推迟**: 0 个
- **待完成**: 9 个
