# signples

智能标识管理与发布平台 — 基于 uni-app-x 的跨端应用。

## 项目简介

signples 是一个面向商业标识设备的统一管理平台，提供设备管理、节目编排、定时发布等功能。支持 Android、iOS 等多端部署。

## 技术栈

- **框架**: uni-app-x (Vue 3 + UTS)
- **语言**: UTS (uni-app TypeScript), SCSS
- **国际化**: lime-i18n (支持中/英/韩/日)
- **UI**: 原生 uni-app 组件

## 项目结构

```
├── api/            # API 配置与类型定义
├── common/         # 路由、常量等公共模块
├── components/     # 通用组件
├── locale/         # 国际化语言包
│   └── lang/       # zh, en, ko, ja
├── pages/          # 页面
│   ├── devices/    # 设备管理
│   ├── index/      # 首页
│   ├── programs/   # 节目编排
│   └── user/       # 用户中心
├── store/          # 全局状态管理
├── uni_modules/    # 第三方插件
└── utils/          # 工具函数
```

## 快速开始

1. 使用 HBuilderX 打开项目
2. 在 `api/config.uts` 中配置后端 API 地址
3. 运行到目标平台（Android/iOS/浏览器）

## 构建

通过 HBuilderX 打包发布，支持：
- Android APK
- iOS IPA
- Web 端

## 文档

详见 `ARCHITECTURE.md` 和 `CODE_WIKI.md`（中文）。
