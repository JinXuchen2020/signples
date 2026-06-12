# Codebase Optimizer - 变更日志

## Round 2

### 2026-06-12
- [R2-T1] 修复 | `pages/index/index.uvue:8-24` | 模板中 JSON.stringify 空对象判断改为 isEmptyObj 方法，消除渲染性能瓶颈
- [R2-T2] 修复 | `pages/user/index.uvue:130-195` | 登录请求改用统一 HTTP post() 封装，替代原生 uni.request
- [R2-T3] 修复 | `utils/http/index.uts:23` | HTTP 请求日志添加 __DEV__ 环境判断，生产环境不输出
- [R2-T4] 修复 | `pages/index/devices.uvue:292-325` | 批量删除设备改为并发控制（每次最多 3 个），替代串行请求
- [R2-T5] 修复 | `pages/programs/editor.uvue:895-930` | 媒体文件下载添加并发限制（每次最多 3 个），防止内存溢出
- [R2-T6] 工程化 | `common/config.uts`, `common/constants.uts`, `store/index.uts` | 统一 STORAGE_KEYS 为单一数据源
- [R2-T7] 修复 | `utils/index.uts:91-94` | deepClone 函数增强支持 Date/RegExp/Array/structuredClone
- [R2-T8] 修复 | `pages/programs/editor.uvue:317-995` | 编辑器自动保存添加最大执行次数限制（100次）和卸载前兜底保存
- [R2-T9] 修复 | `pages/programs/shared/history.uts:85-87` | HistoryManager deepClone 优先使用 structuredClone
- [R2-T10] 安全 | `common/router.uts:33` | routeGoto console.log 添加 __DEV__ 条件判断
- [R2-T11] 安全 | `pages/programs/shared/file-manager/index.uts:246` | 上传失败日志添加 __DEV__ 条件判断
- [R2-T12] 安全 | `pages/programs/editor.uvue:834,838` | 移除 handleSave 中的 console.log 调试信息
- [R2-T13] 安全 | `utils/logger/index.uts:16` | Logger 构造函数初始化 isDevelopment 为 __DEV__

## Round 3

### 2026-06-12
- [R3-T1] 重构 | `common/auth-utils.uts` (新建) | 提取 isUserLoggedIn() 纯函数，消除 router.uts 对 Vue computed 的依赖
- [R3-T1] 重构 | `common/router.uts:1,37,64` | 导入 isUserLoggedIn 替代 useAuth().isLoggedIn.value
- [R3-T1] 重构 | `store/index.uts:4,27,125` | useAuth().isLoggedIn 和 useState().isLoggedIn 调用新函数
- [R3-T2] 修复 | `pages/programs/editor.uvue:840,875` | duration: 3000 → duration: DEFAULT_TOAST_DURATION
- [R3-T2] 修复 | `pages/programs/index.uvue:295` | duration: 3000 → duration: DEFAULT_TOAST_DURATION
- [R3-T2] 修复 | `pages/setting/index.uvue:184` | duration: 3000 → duration: DEFAULT_TOAST_DURATION
- [R3-T2] 修复 | `pages/devices/volume.uvue:222,253` | duration: 3000 → duration: DEFAULT_TOAST_DURATION
- [R3-T2] 修复 | `pages/devices/timercontrol.uvue:267,295,330` | duration: 3000 → duration: DEFAULT_TOAST_DURATION
- [R3-T2] 修复 | `pages/devices/restart.uvue:179,215` | duration: 3000 → duration: DEFAULT_TOAST_DURATION
- [R3-T2] 修复 | `pages/devices/poweroffon.uvue:149` | duration: 3000 → duration: DEFAULT_TOAST_DURATION
- [R3-T2] 修复 | `pages/devices/edittime.uvue:258,279,312` | duration: 3000 → duration: DEFAULT_TOAST_DURATION
- [R3-T2] 修复 | `pages/devices/editbrightness.uvue:182,224,244,255` | duration: 3000 → duration: DEFAULT_TOAST_DURATION
- [R3-T2] 修复 | `pages/devices/edit.uvue:187,223,234,276,286` | duration: 3000 → duration: DEFAULT_TOAST_DURATION
- [R3-T2] 修复 | `pages/devices/create.uvue:121,130,162` | duration: 3000 → duration: DEFAULT_TOAST_DURATION
- [R3-T2] 修复 | `components/timer-controls/timer-controls.uvue:147,163,176,185,216` | duration: 3000 → duration: DEFAULT_TOAST_DURATION
- [R3-T2] 修复 | `components/picker-date/picker-date.uvue:137,152` | duration: 3000 → duration: DEFAULT_TOAST_DURATION
- [R3-T3] 跳过 | `pages/programs/index.uvue` 和 `pages/programs/editor.uvue` 中的 useState() 是合法使用（认证状态读取），不修改
