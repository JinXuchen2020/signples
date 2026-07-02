# Sign Plex

智能标识管理与发布平台 — 基于 uni-app-x 的数字标牌管理系统。

## 目录

- [Sign Plex](#sign-plex)
  - [目录](#目录)
  - [项目简介](#项目简介)
  - [核心功能](#核心功能)
    - [设备管理](#设备管理)
    - [节目编辑器](#节目编辑器)
    - [用户管理](#用户管理)
    - [系统能力](#系统能力)
  - [技术栈](#技术栈)
  - [项目结构](#项目结构)
  - [快速开始](#快速开始)
    - [环境要求](#环境要求)
    - [本地运行（快速示例）](#本地运行快速示例)
    - [打包](#打包)
  - [页面路由](#页面路由)
  - [API 端点](#api-端点)
    - [认证与用户](#认证与用户)
    - [设备管理](#设备管理-1)
    - [节目与媒体](#节目与媒体)
  - [组件库](#组件库)
  - [状态管理](#状态管理)
  - [工具函数](#工具函数)
  - [国际化](#国际化)
  - [配置说明](#配置说明)
  - [开发指南](#开发指南)
    - [添加新页面](#添加新页面)
    - [添加新 API](#添加新-api)
    - [添加新语言](#添加新语言)
  - [贡献](#贡献)
  - [维护者 \& 许可证](#维护者--许可证)

## 项目简介

Sign Plex 是一款面向商业显示屏设备的统一管理平台，支持设备管理、节目编排、远程控制和多语言切换，适用于广告屏、信息展示屏等场景。

## 核心功能

### 设备管理
- 设备列表展示、搜索（按名称/SN）、状态筛选（在线/离线）
- 按设备类型分组（显示屏/拼接墙/其他）、批量选择与删除
- 远程亮度/音量调节、时间同步、重启、开关机、定时任务控制

### 节目编辑器
- Canvas 可视化拖拽编辑，支持视频/图片/文字/网页/文档 5 种组件

示例缩略图：

![Sign Plex 缩略图](static/image/README-thumbnail.svg)

请替换为实际截图路径或 PNG 文件（例如 `static/image/README-screenshot-1.png`）。
- 多角色体系（管理员/代理商/普通用户）、下级用户切换
- 四语切换（中/英/韩/日）、亮色/暗色主题切换

## 技术栈

| 技术 | 说明 |
|------|------|
| **框架** | uni-app-x (Vue 3 + UTS) |
| **语言** | UTS (uni-app TypeScript)、SCSS |
| **国际化** | lime-i18n |
| **画布** | u-canvas |
| **压缩** | zip-util / ns-unzip |
| **通信** | wrs-uts-udp |

## 项目结构

```
├── api/                          # API 层：端点定义、类型、业务模块
│   ├── config.uts                # BASE_URL 与端点映射
│   ├── index.uts                 # 统一导出
│   ├── types.uts                 # 类型定义（UserInfo/Device/Program/Media）
│   └── modules/                  # 按业务拆分的 API 方法
│       ├── user.uts              # 登录/用户 CRUD
│       ├── device.uts            # 设备 CRUD + 远程控制命令
│       └── program.uts           # 媒体管理/节目上传/播放记录
├── common/                       # 公共模块
│   ├── router.uts                # 路由封装（含登录态校验）
│   ├── constants.uts             # 常量（设备状态/组件类型/画布参数等）
│   ├── config.uts                # 应用配置（超时/存储键/语言选项等）
│   └── uni.css                   # 全局样式
├── components/                   # 组件库
│   ├── base/                     # BaseButton / BaseInput / BaseCard
│   ├── business/                 # DeviceCard / ProgramCard / StatusBadge
│   ├── layout/                   # PageHeader / EmptyState / LoadingOverlay
│   ├── picker-date / picker-time # 日期/时间选择器
│   ├── popup-default / popup-edit# 通用弹窗 / 编辑弹窗
│   └── timer-controls/           # 定时器控件
├── locale/                       # 国际化
│   ├── index.uts                 # i18n 实例与切换方法
│   └── lang/                     # zh / en / ko / ja
├── pages/                        # 页面
│   ├── index/                    # 首页、设备列表、用户选择
│   ├── user/                     # 用户中心、语言切换、固件管理
│   ├── devices/                  # 设备详情、亮度/音量/时间/重启/开关机/定时
│   ├── programs/                 # 节目列表、编辑器、预览、各类表单
│   ├── setting/                  # 屏体设置
│   └── player/                   # 实时播控
├── store/                        # 状态管理（Hooks 模式）
├── uni_modules/                  # 第三方插件
├── utils/                        # 工具函数
│   ├── http/                     # HTTP 封装（自动携带 Token/错误处理）
│   ├── error/                    # 统一错误处理器（单例）
│   ├── validator/                # 表单验证（required/email/phone/pattern 等）
│   ├── performance/              # FPS 监控与函数耗时测量
│   ├── logger/                   # 分级日志（单例，开发环境输出 console）
│   ├── theme/                    # 主题管理（light/dark/system）
│   └── index.uts                 # 通用工具（formatDate/debounce/throttle/deepClone 等）
├── static/                       # 静态资源（图标/图片/SVG/TabBar）
├── manifest.json                 # 应用配置（AppID/版本/权限）
├── pages.json                    # 路由与 TabBar 配置
├── theme.json                    # 主题颜色配置
└── uni.scss                      # 全局样式变量
```

## 快速开始

### 环境要求

- HBuilderX 4.x+（推荐最新正式版）
- Android SDK API 28+
- 推荐：Node.js 16+（仅用于本地工具或脚本）

### 本地运行（快速示例）

1. 用 HBuilderX 打开项目根目录，或在命令行中切换到项目目录。

```powershell
# 可选：检查 Node 版本（Windows PowerShell）
node -v
```

2. 编辑 `api/config.uts` 中的 `BASE_URL` 为开发后端地址或本地 mock 地址。

3. 在 HBuilderX 中选择运行目标（浏览器/Android/iOS）并运行，或使用 HBuilderX 的命令行工具进行打包。

> 常见问题：如果启动后出现跨域（CORS）或接口不可达，请确认 `api/config.uts` 的地址与后端服务可达，并考虑启用后端的 CORS 或使用本地代理。

### 打包

在 HBuilderX 菜单中选择：发行 → 原生 App-云打包，选择证书并等待打包完成。

支持输出：Android APK（minSdkVersion 28）、iOS IPA、Web。

## 页面路由

| 路径 | 功能 |
|------|------|
| `pages/index/index` | 首页 — 设备概览与快捷入口 |
| `pages/index/devices` | 设备列表 — 搜索/筛选/批量操作 |
| `pages/index/users` | 用户管理 — 下级用户选择 |
| `pages/programs/index` | 节目管理 — 列表/草稿箱/模板 |
| `pages/programs/editor` | 节目编辑器 — 可视化拖拽编辑 |
| `pages/programs/review` | 节目预览 |
| `pages/devices/edit` | 设备详情与控制入口 |
| `pages/devices/editbrightness` | 亮度调节 |
| `pages/devices/volume` | 音量调节 |
| `pages/devices/edittime` | 时间同步 |
| `pages/devices/restart` | 远程重启 |
| `pages/devices/poweroffon` | 开关机 |
| `pages/devices/timercontrol` | 定时任务 |
| `pages/setting/index` | 屏体设置 |
| `pages/player/index` | 实时播控 |
| `pages/user/index` | 用户中心 — 登录/资料 |
| `pages/user/language` | 语言切换 |
| `pages/user/software` | 固件管理 |

## API 端点

### 认证与用户

| 端点 | 方法 | 说明 |
|------|------|------|
| `/simpleLogin` | POST | 登录 |
| `/user/all` | GET | 用户列表 |
| `/user/{id}` | GET | 用户详情 |
| `/user/save` | POST | 保存用户 |

### 设备管理

| 端点 | 方法 | 说明 |
|------|------|------|
| `/monitor/all` | GET | 设备列表 |
| `/monitor/{id}` | GET | 设备详情 |
| `/monitor` | POST/PUT | 创建/更新设备 |
| `/monitor/sendMobileCmd` | POST | 发送控制命令 |

### 节目与媒体

| 端点 | 方法 | 说明 |
|------|------|------|
| `/media/all` | GET | 媒体列表 |
| `/media/download` | GET | 下载媒体文件 |
| `/programme/upload` | POST | 上传节目包 |
| `/playbackRecord/*` | GET/POST | 播放记录 |

## 组件库

| 组件 | 分类 | 说明 |
|------|------|------|
| `BaseButton` | 基础 | 按钮，primary/secondary/danger 类型 |
| `BaseInput` | 基础 | 输入框，标签+输入组合 |
| `BaseCard` | 基础 | 卡片容器 |
| `DeviceCard` | 业务 | 设备信息卡片（名称/状态/SN） |
| `ProgramCard` | 业务 | 节目卡片（预览/分辨率/更新时间） |
| `StatusBadge` | 业务 | 状态徽章（在线/离线/激活等） |
| `PageHeader` | 布局 | 页面头部（标题+返回按钮） |
| `EmptyState` | 布局 | 空状态占位 |
| `LoadingOverlay` | 布局 | 全屏加载指示器 |

## 状态管理

采用 Hooks 模式，集中管理 token、用户信息、设备、节目等状态：

```typescript
import { useState } from '@/store/index.uts'
const { state, setToken, setActiveDevice } = useState()
```

## 工具函数

| 模块 | 功能 |
|------|------|
| `utils/http` | HTTP 封装，自动携带 Bearer Token，统一错误处理与 401 跳转 |
| `utils/error` | 单例错误处理器，支持回调注册与异步函数包裹 |
| `utils/validator` | 表单验证：required/minLength/maxLength/email/phone/pattern/range 等 |
| `utils/performance` | FPS 实时监控 + 函数耗时测量，超阈值告警 |
| `utils/logger` | 分级日志（debug/info/warn/error），开发环境输出 console |
| `utils/theme` | 主题管理，支持 light/dark/system 三种模式 |
| `utils/index` | 通用工具：formatDate/debounce/throttle/deepClone/isEmpty 等 |

## 国际化

支持 4 种语言，切换后持久化到本地存储：

| 代码 | 语言 |
|------|------|
| `zh-CN` | 简体中文 |
| `en` | English |
| `ko` | 한국어 |
| `ja` | 日本語 |

## 配置说明

- **`manifest.json`** — AppID、版本号、Android 权限（存储读写）
- **`pages.json`** — 页面路由与 TabBar，标题使用国际化占位符
- **`api/config.uts`** — 后端 `BASE_URL` 与端点定义，部署前需修改
- **`theme.json`** — 亮色/暗色主题颜色配置

## 开发指南

### 添加新页面

1. 在 `pages.json` 的 `pages` 数组中添加路由配置
2. 在 `pages/` 下创建对应的 `.uvue` 文件
3. 在 `locale/lang/*.uts` 中补充翻译

### 添加新 API

1. 在 `api/config.uts` 的 `APIS` 对象中添加端点
2. 在 `api/modules/` 对应文件中编写请求方法
3. 在 `api/types.uts` 中补充类型定义

### 添加新语言

1. 在 `locale/lang/` 下创建语言文件
2. 在 `locale/index.uts` 的 `messages` 中注册

## 贡献

欢迎提交 Issue 或 Pull Request。

## 维护者 & 许可证

- **维护者**: 若干维护者姓名或团队（请替换为实际联系人和邮箱/链接）
- **许可证**: 未指定。建议添加开源许可证，例如 MIT、Apache-2.0 等。

如果你希望我直接添加 `LICENSE` 文件（例如 MIT），我可以为你生成并提交。


