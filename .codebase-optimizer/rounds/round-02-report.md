# Round 2: 阶段2（进阶质量）分析报告

**分析时间**: 2026-06-12
**当前阶段**: 阶段2
**分析维度**: 性能 → 安全 → 工程化
**分析范围**: 全项目

## 发现的问题

### 1. [P1] 模板中使用 JSON.stringify 进行空对象判断导致严重性能问题
- **维度**: 性能
- **文件**: `pages/index/index.uvue:8,15,20,24`
- **描述**: 在模板中多次调用 `JSON.stringify(activeUser)` 和 `JSON.stringify(activeDevice)` 进行空对象判断。这会在每次渲染周期中被执行，产生大量不必要的序列化和比较开销，导致严重的性能问题和卡顿。
- **建议**: 使用计算属性（computed）或辅助方法替代模板中的 JSON.stringify 判断，例如 `isEmptyObject(obj)` 方法。

### 2. [P1] 硬编码 API 地址使用 HTTP 协议（安全风险）
- **维度**: 安全
- **文件**: `common/config.uts:7`
- **描述**: `API_BASE_URL` 硬编码为 `http://1.255.226.145:12106`，使用明文 HTTP 协议传输数据，包括认证 token 和用户凭证。在生产环境中可能被中间人攻击拦截。
- **建议**: 改为环境变量配置，支持 HTTPS；至少在 config.uts 中添加注释标记环境差异，并预留 HTTPS 切换入口。

### 3. [P1] 登录请求绕过统一 HTTP 拦截器
- **维度**: 安全
- **文件**: `pages/user/index.uvue:137-190`
- **描述**: 登录功能直接使用 `uni.request` 而非统一的 `request` 封装函数。这意味着登录请求没有经过统一的 token 注入、错误处理和 loading 管理。如果未来统一 HTTP 层增加签名/加密逻辑，登录接口会被遗漏。
- **建议**: 重构登录逻辑，使用统一的 `post()` 函数发起请求。

### 4. [P1] 全局状态中 Token 以明文存储在 Storage
- **维度**: 安全
- **文件**: `store/index.uts:38,121`
- **描述**: Token 通过 `setStorage`/`getStorage` 以明文 JSON 形式存储在本地。虽然 uni-app 的 storage 有一定保护，但敏感凭证应尽可能使用更安全的存储机制（如 `setStorage` 的 secure 选项或加密存储）。
- **建议**: 对 token 进行简单加密后再存储，或至少添加安全注释说明当前实现的安全假设。

### 5. [P1] HistoryManager 深拷贝使用 JSON.parse/stringify 导致大数据性能问题
- **维度**: 性能
- **文件**: `pages/programs/shared/history.uts:86`
- **描述**: `deepClone` 使用 `JSON.parse(JSON.stringify(state))`，每次 undo/redo 操作都会对整个页面配置进行完整序列化。在编辑器场景中，当页面包含多个组件时，这个操作可能非常耗时，影响撤销/重做的响应速度。
- **建议**: 考虑使用结构化克隆（structuredClone）或增量状态快照，减少不必要的深拷贝开销。

### 6. [P1] 媒体文件下载并行无限制可能导致内存溢出
- **维度**: 性能
- **文件**: `pages/programs/editor.uvue:897-917`
- **描述**: `getMedias()` 中对所有媒体文件并行发起 `uni.downloadFile` 请求，没有并发限制。如果有大量媒体文件，会同时创建大量下载任务，可能导致内存不足或网络拥塞。
- **建议**: 添加并发控制（如每次最多 3 个并发下载），或使用队列方式分批下载。

### 7. [P1] 批量删除设备使用串行请求（N+1 问题）
- **维度**: 性能
- **文件**: `pages/index/devices.uvue:303-305`
- **描述**: `handleBatchDelete` 中对每个设备逐个发送 DELETE 请求，使用 `for...of` + `await` 串行执行。如果有 N 个设备，总耗时 = N × 单个请求时间，用户体验极差。
- **建议**: 添加并发控制，使用 `Promise.all` 配合批次限制并行发送请求。

### 8. [P1] 开发者控制台日志在生产环境泄露
- **维度**: 安全
- **文件**: `utils/http/index.uts:23`
- **描述**: `console.log('请求url', url)` 在 HTTP 请求模块中持续输出调试信息。请求 URL 可能包含 token 或其他敏感信息，在生产环境中不应输出到控制台。
- **建议**: 使用开发环境条件判断，仅在开发模式下输出日志。

### 9. [P2] 重复定义 STORAGE_KEYS 常量
- **维度**: 工程化
- **文件**: `common/config.uts:33-40`, `common/constants.uts:41-49`, `store/index.uts:13-20`
- **描述**: `STORAGE_KEYS` 在三个文件中分别定义，内容不完全一致。这违反了 DRY 原则，容易导致键名不一致导致的数据读写问题。
- **建议**: 统一到 `common/constants.uts` 或 `common/config.uts` 中，其他地方导入使用。

### 10. [P2] 路由守卫中的登录状态检查使用响应式 value 导致闭包陷阱
- **维度**: 安全
- **文件**: `common/router.uts:34-36`
- **描述**: `routeGoto` 中调用 `useAuth()` 获取 `isLoggedIn` 计算属性，但在非响应式上下文中读取 `.value`。由于每次调用都创建新的 store 实例引用，可能导致 stale closure 问题，判断结果不准确。
- **建议**: 确保 `useAuth()` 返回的是单例引用，或在调用处直接使用全局 state 实例。

### 11. [P2] 编辑器中 setInterval 未设置最大执行次数
- **维度**: 性能
- **文件**: `pages/programs/editor.uvue:968-970`
- **描述**: 自动保存使用 `setInterval` 每 30 秒执行一次，但没有设置最大执行次数限制。如果组件意外未卸载（如页面导航失败），定时器将持续运行导致内存泄漏。
- **建议**: 添加计数器限制最大保存次数，或在 `onUnmounted` 中确保清理的同时记录未保存的草稿。

### 12. [P2] `deepClone` 函数使用 JSON.parse/stringify 无法处理特殊对象
- **维度**: 工程化
- **文件**: `utils/index.uts:91-94`
- **描述**: `deepClone` 使用 `JSON.parse(JSON.stringify(obj))` 实现，无法正确处理 `Date`、`RegExp`、`Map`、`Set`、`undefined`、`Function` 等特殊类型。在编辑器场景下可能导致数据丢失或类型错误。
- **建议**: 增强 `deepClone` 函数以支持常见特殊类型的克隆，或使用 `structuredClone` API。

---

## 各维度汇总

| 维度 | 问题数 | P0 | P1 | P2 |
|------|--------|----|----|----|
| ⚡ 性能 | 4 | 0 | 4 | 0 |
| 🔒 安全 | 4 | 0 | 4 | 0 |
| 📦 工程化 | 2 | 0 | 0 | 2 |
| **合计** | **10** | **0** | **8** | **2** |

## 本轮亮点

- 项目整体架构较为清晰，HTTP 层、Store 层、工具层职责分明
- 已具备完善的错误处理、日志记录、性能监控工具模块
- 编辑器模块实现了完整的撤销/重做、自动保存、拖拽编辑等功能
