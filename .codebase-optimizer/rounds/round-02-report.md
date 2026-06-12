# Round 2: 正确性 (Correctness) 分析报告

**分析时间**: 2026-06-12
**当前阶段**: 阶段1
**分析维度**: 正确性
**分析范围**: 全项目

## 发现的问题

### 1. [P1] login `fail` 回调空实现 (静默失败)
- **维度**: 正确性
- **文件**: `pages/user/index.uvue:182-184`
- **描述**: `handleLogin()` 中 `uni.request` 的 `fail` 回调为空。网络失败时用户无反馈，loading 不消失。
- **建议**: 添加 `uni.hideLoading()` 和 `uni.showToast` 错误提示
- **状态**: ⏳ 待处理

### 2. [P1] `programs/index.uvue` 推送无 try/catch
- **维度**: 正确性
- **文件**: `pages/programs/index.uvue:271-301`
- **描述**: `handlePushProgram` 无任何 try/catch 包裹多个 await 调用。任一异常会导致未捕获错误。
- **建议**: 用 try/catch 包裹整个方法体
- **状态**: ⏳ 待处理

### 3. [P1] `devices.uvue` DELETE 请求无 `.catch()`
- **维度**: 正确性
- **文件**: `pages/index/devices.uvue:256-261`
- **描述**: `.then()` 无 `.catch()`，请求失败时 loading 不消失，用户无反馈。
- **建议**: 添加 `.catch()` 处理
- **状态**: ⏳ 待处理

### 4. [P1] HTTP 请求 `state.token` 无 null 检查
- **维度**: 正确性
- **文件**: `utils/http/index.uts:34`
- **描述**: `state.token` 可能为 null/undefined，拼接出 `"Bearer null"` 发送。
- **建议**: 添加 null guard: `const token = state?.token ?? '';`
- **状态**: ⏳ 待处理

### 5. [P2] `handleLogin` 中 `getAccountInfo` 异步错误丢失
- **维度**: 正确性
- **文件**: `pages/user/index.uvue`
- **描述**: `getAccountInfo` 在 `uni.request.success` 回调中调用但无 `await`，异常不在 try/catch 范围内。
- **建议**: 添加 `.catch()` 处理
- **状态**: ⏳ 待处理

### 6. [P2] `importProgram` 用户取消后仍返回 MediaConfig
- **维度**: 正确性
- **文件**: `pages/programs/shared/file-manager/index.uts:391-421`
- **描述**: 用户取消覆盖时，仍 `return new MediaConfig(configData)`，告诉调用者导入成功。
- **建议**: 取消时返回 null
- **状态**: ⏳ 待处理

### 7. [P2] `FileManager` token 只在构造函数获取，不刷新
- **维度**: 正确性
- **文件**: `pages/programs/shared/file-manager/index.uts:18-24`
- **描述**: token/programFolder 在构造时捕获一次，用户登出再登录后仍用旧值。
- **建议**: 添加 `refresh()` 方法或在关键操作前重新读取
- **状态**: ⏳ 待处理

### 8. [P2] `devices.uvue` `validEnd` 日期解析无验证
- **维度**: 正确性
- **文件**: `pages/index/devices.uvue:224-234`
- **描述**: `new Date(day)` 在无效日期字符串时产生 `Invalid Date`，后续比较产生 NaN。
- **建议**: 添加日期验证
- **状态**: ⏳ 待处理

### 9. [P2] `index.uvue` `handleDisconnect` role 检查不安全
- **维度**: 正确性
- **文件**: `pages/index/index.uvue:228-231`
- **描述**: `this.userInfo['role']` 在未初始化时为 `undefined`，比较 `undefined == 'user'` 返回 false，管理员可能被错误路由。
- **建议**: 添加显式检查
- **状态**: ⏳ 待处理

## 各维度汇总

| 维度 | 问题数 | P0 | P1 | P2 |
|------|--------|----|----|----|
| 🐛 正确性 | 9 | 0 | 4 | 5 |
| **合计** | **9** | **0** | **4** | **5** |
