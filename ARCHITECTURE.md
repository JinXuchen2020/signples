# 项目架构文档

## 当前架构状态 (v4.5)

### 新增功能

#### 1. 编辑器撤销/重做
- `pages/programs/shared/history.uts` - 历史记录管理器
- 支持最多 50 步撤销/重做
- 记录组件添加、删除、修改操作

#### 2. 设备列表搜索和筛选
- `pages/index/devices.uvue` - 设备列表页面
- 支持按名称/SN 搜索
- 支持按状态筛选（全部/在线/离线）

#### 3. 设备批量操作
- 支持批量选择设备
- 支持批量删除设备
- 选中设备计数显示

#### 4. 组件复制/粘贴
- 支持复制选中的组件
- 支持粘贴已复制的组件
- 自动生成新的组件 ID 和名称

#### 5. 自动保存草稿
- 编辑器每 30 秒自动保存草稿
- 防止编辑内容丢失
- 只保存有变更的内容

#### 6. 下拉刷新
- 设备列表下拉刷新
- 实时更新设备状态

#### 7. 节目导入/导出
- `FileManager.exportProgram()` - 导出节目为 JSON
- `FileManager.importProgram()` - 从 JSON 导入节目
- 支持节目迁移和备份

#### 8. 组件拖拽排序
- 编辑器工具栏新增上移/下移按钮
- 可调整组件在页面中的顺序
- 自动记录历史支持撤销

#### 9. 草稿箱
- `pages/programs/index.uvue` - 节目列表页面
- 本地草稿存储在 `program_drafts` key
- 支持编辑和删除草稿

#### 10. 设备分组
- `pages/index/devices.uvue` - 设备列表页面
- 支持按设备类型筛选（显示屏/拼接墙/其他）
- 与状态筛选组合使用

#### 11. 节目模板
- `pages/programs/index.uvue` - 节目创建弹窗
- 支持选择模板（空白/视频/图片/混合）
- 模板决定初始页面结构

#### 12. 画布缩放
- `pages/programs/editor.uvue` - 编辑器页面
- 工具栏缩放控制按钮 (+/-/重置)
- 支持 50% - 200% 缩放
- 实时显示当前缩放比例

#### 13. 键盘快捷键
- `pages/programs/editor.uvue` - 编辑器页面
- Ctrl+Z: 撤销
- Ctrl+Y/Ctrl+Shift+Z: 重做
- Ctrl+C: 复制
- Ctrl+V: 粘贴
- Ctrl+S: 保存
- ↑/↓: 上移/下移组件
- ESC: 取消选择

#### 14. 深色模式
- `theme.json` - 主题配置文件
- `utils/theme/index.uts` - 主题管理器
- `pages/setting/index.uvue` - 设置页面
- 支持亮色/深色模式切换
- 主题颜色自动应用到全局

### 目录结构

```
/
├── api/                      # API 层
│   ├── config.uts           # 端点定义
│   ├── index.uts            # API 导出
│   ├── types.uts            # API 类型定义
│   └── modules/             # 业务模块
│       ├── user.uts         # 用户 API
│       ├── device.uts       # 设备 API
│       └── program.uts      # 节目 API
├── common/                   # 公共工具
│   ├── router.uts           # 路由封装
│   └── constants.uts        # 常量定义
├── components/              # 组件库
│   ├── base/                # 基础组件
│   ├── business/            # 业务组件
│   └── layout/              # 布局组件
├── locale/                   # 国际化
├── pages/                   # 页面
│   ├── programs/           # 节目模块
│   │   └── shared/         # 共享代码
│   │       ├── media-config/
│   │       ├── file-manager/
│   │       ├── draggable-rect/
│   │       └── form-utils/
│   ├── devices/            # 设备模块
│   │   └── shared/         # 共享代码
│   ├── index/              # 首页模块
│   ├── user/               # 用户模块
│   └── setting/            # 设置模块
├── store/                   # 状态管理
├── uni_modules/             # 插件
└── utils/                   # 工具函数
    ├── http/               # HTTP 请求
    ├── error/              # 错误处理
    ├── validator/          # 表单验证
    ├── performance/        # 性能监控
    ├── logger/             # 日志工具
    └── index.uts           # 通用工具
```

---

## 组件库架构

### 1. 基础组件 (`components/base/`)

| 组件 | 说明 | 用途 |
|------|------|------|
| `BaseButton` | 基础按钮 | 支持 primary/secondary/danger 类型 |
| `BaseInput` | 基础输入框 | 标签 + 输入框组合 |
| `BaseCard` | 基础卡片 | 带标题和内容的卡片容器 |

### 2. 业务组件 (`components/business/`)

| 组件 | 说明 | 用途 |
|------|------|------|
| `DeviceCard` | 设备卡片 | 显示设备信息、状态、SN码 |
| `ProgramCard` | 节目卡片 | 显示节目预览、分辨率、更新时间 |
| `StatusBadge` | 状态徽章 | 在线/离线/激活/未激活等状态 |

### 3. 布局组件 (`components/layout/`)

| 组件 | 说明 | 用途 |
|------|------|------|
| `PageHeader` | 页面头部 | 标题 + 返回按钮 + 右侧插槽 |
| `EmptyState` | 空状态 | 无数据展示 + 操作按钮 |
| `LoadingOverlay` | 加载遮罩 | 全屏加载指示器 |

---

## 工具函数库

### 1. 性能监控 (`utils/performance/`)

```typescript
import { perfMonitor, measureFunction, measureAsyncFunction } from '@/utils/performance/index.uts';

// 启动监控
perfMonitor.start();

// 观察性能指标
const unsubscribe = perfMonitor.observe((metrics) => {
    console.log('FPS:', metrics.fps);
    console.log('Memory:', metrics.memory);
});

// 停止监控
perfMonitor.stop();

// 测量同步函数
const result = measureFunction(someFunction, 'myFunction');

// 测量异步函数
const data = await measureAsyncFunction(fetchData, 'fetchData');
```

### 2. 日志工具 (`utils/logger/`)

```typescript
import { logger } from '@/utils/logger/index.uts';

// 不同级别日志
logger.debug('Debug message');
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message', { error: err });

// 获取日志
const logs = logger.getLogs('error');
logger.clearLogs();
```

---

## API 层架构

### 模块化 API

```typescript
import { userApi, deviceApi, programApi } from '@/api/index.uts';

// 用户相关
await userApi.login({ account: 'xxx', password: 'xxx' });
await userApi.getUserInfo('123');
await userApi.getAllUsers();

// 设备相关
await deviceApi.getAllDevices();
await deviceApi.sendCMD({ cmd: 'play', value: 1, deviceIds: ['xxx'] });

// 节目相关
await programApi.getAllMedia();
await programApi.uploadProgramZip(formData);
```

---

## 状态管理架构

### Hooks 模式

```typescript
import { useAuth, useDevice, useProgram } from '@/store/index.uts';

// 认证状态
const { token, isLoggedIn, logout } = useAuth();

// 设备状态
const { activeDevice, setActiveDevice } = useDevice();

// 节目状态
const { program, setProgram } = useProgram();
```

---

## 路由架构

### 常量 + 便捷函数

```typescript
import { ROUTES, goHome, goDevices, goPrograms, routeGoto } from '@/common/router.uts';

// 使用便捷函数
goHome();
goDevices();
goPrograms();

// 使用路由常量
routeGoto(ROUTES.DEVICE_EDIT, { id: '123' });

// 公开路由（无需登录）
import { publicRoutes } from '@/common/router.uts';
```

---

## Programs 模块架构

```
pages/programs/
├── shared/               # 共享代码
│   ├── media-config/     # 媒体配置类
│   ├── file-manager/     # 文件管理类
│   ├── draggable-rect/  # 拖拽组件
│   └── form-utils/       # 表单工具函数
├── index.uvue            # 节目列表
├── edit.uvue             # 编辑入口
├── review.uvue           # 预览
├── editor.uvue            # 主编辑器
└── *.uvue                # 各类型表单组件
```

---

## 代码规范

### 组件使用规范

```typescript
// 基础组件
import { BaseButton, BaseInput, BaseCard } from '@/components/base/index.uts';

// 业务组件
import { DeviceCard, ProgramCard, StatusBadge } from '@/components/business/index.uts';

// 布局组件
import { PageHeader, EmptyState, LoadingOverlay } from '@/components/layout/index.uts';
```

### 性能规范

```typescript
// ✅ 正确 - 使用性能测量工具
const data = await measureAsyncFunction(fetchData, 'fetchData');

// ❌ 错误 - 直接使用可能慢的函数
const data = await fetchData();
```

---

## 更新日志

### v4.5 (2024-05-10)
- ✅ 深色模式支持

### v4.4 (2024-05-10)
- ✅ 画布缩放控制
- ✅ 键盘快捷键

### v4.3 (2024-05-10)
- ✅ 设备分组筛选
- ✅ 节目模板选择

### v4.2 (2024-05-10)
- ✅ 自动保存草稿
- ✅ 下拉刷新
- ✅ 节目导入/导出

### v4.0 (2024-05-10)
- ✅ 编辑器撤销/重做功能 (history.uts)
- ✅ 设备列表搜索和筛选
- ✅ 设备批量操作
- ✅ 组件复制/粘贴

### v3.5 (2024-05-10)
- ✅ popup-edit 组件导出统一

### v3.4 (2024-05-10)
- ✅ 组件导出统一 (popup-default, picker-date, picker-time, timer-controls)
- ✅ 国际化翻译完善

### v3.3 (2024-05-10)
- ✅ 常量定义文件 (common/constants.uts)
- ✅ 表单验证工具 (utils/validator/)
- ✅ 国际化覆盖完善 (en.uts)

### v3.2 (2024-05-10)
- ✅ Programs 目录残留旧文件清理
- ✅ editor.uvue 导入路径统一
- ✅ API 类型定义完善

### v3.1 (2024-05-10)
- ✅ Devices 模块结构化 (shared/types.uts, shared/device.uts)
- ✅ 全局错误处理 (utils/error/)
- ✅ 国际化覆盖完善

### v3.0 (2024-05-10)
- ✅ 业务组件库扩展 (DeviceCard, ProgramCard, StatusBadge)
- ✅ 布局组件 (PageHeader, EmptyState, LoadingOverlay)
- ✅ 性能监控工具
- ✅ 日志工具

### v2.1 (2024-05-10)
- ✅ Programs 模块结构化重构
- ✅ 基础组件库建立

### v2.0 (2024-05-10)
- ✅ API 层模块化重构
- ✅ 状态管理 Hook 化
- ✅ 路由常量统一管理
