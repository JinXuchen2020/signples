# Sign Plex - 代码百科文档

## 项目概述

**Sign Plex** 是一款基于 `uni-app x` 框架开发的数字标牌（电子广告屏）管理应用程序，主要用于管理和控制联网的广告显示屏设备，支持节目的创建、编辑、发布以及设备的实时控制。

### 技术栈

| 技术 | 说明 |
|------|------|
| **uni-app x** | 跨平台应用框架 |
| **UVue** | uni-app x 的视图层技术 |
| **TypeScript/UTS** | 开发语言 |
| **SCSS** | 样式预处理 |
| **u-canvas** | 画布组件，用于节目编辑器 |
| **lime-i18n** | 国际化和本地化 |
| **ns-unzip** | ZIP 解压模块 |
| **wrs-uts-udp** | UDP 通信模块 |

---

## 项目架构

```
f:\Local\signples/
├── api/                      # API 配置模块
│   └── config.uts            # 后端 API 端点定义
├── common/                    # 公共模块
│   ├── router.uts            # 路由导航工具
│   └── uni.css              # 全局样式
├── components/               # 公共组件
│   ├── picker-date/          # 日期选择器
│   ├── picker-time/          # 时间选择器
│   ├── popup-default/        # 通用弹窗
│   ├── popup-edit/           # 编辑弹窗
│   └── timer-controls/       # 定时器控件
├── locale/                    # 国际化
│   ├── index.ts             # i18n 配置
│   └── lang/                # 多语言文件
│       ├── zh.uts           # 中文
│       ├── en.uts           # 英文
│       ├── kr.uts           # 韩文
│       └── jp.uts           # 日文
├── pages/                     # 页面
│   ├── devices/              # 设备管理相关页面
│   ├── index/               # 首页和用户选择页面
│   ├── player/               # 实时播控页面
│   ├── programs/             # 节目管理相关页面
│   ├── setting/             # 屏体设置页面
│   └── user/                # 用户中心页面
├── static/                    # 静态资源
│   ├── icon/                # 图标
│   ├── image/               # 图片
│   ├── svg/                 # SVG 图标
│   └── tabbar/              # TabBar 图标
├── store/                     # 状态管理
│   └── index.uts            # 全局状态 (Pinia)
├── uni_modules/               # uni-app 插件
│   ├── image-editing/        # 图片编辑
│   ├── lime-i18n/            # 国际化
│   ├── ns-unzip/             # ZIP 解压
│   ├── u-canvas/             # 画布组件
│   ├── wrs-uts-udp/          # UDP 通信
│   ├── yu-img-editor/        # 图片编辑器
│   └── zip-util/              # ZIP 工具
├── utils/                     # 工具函数
│   ├── http/                 # HTTP 请求封装
│   └── index.uts             # 通用工具
├── App.uvue                   # 应用入口
├── main.uts                   # 主入口
├── manifest.json              # 应用配置
├── pages.json                 # 页面路由配置
├── theme.json                 # 主题配置
└── uni.scss                   # 全局样式变量
```

---

## 核心模块详解

### 1. 状态管理 (store/index.uts)

全局状态管理，使用响应式 API 管理应用状态。

**State 类型定义：**
```typescript
export type State = {
    token: string,              // 认证令牌
    loginUser: UTSJSONObject,   // 当前登录用户
    program: UTSJSONObject,     // 当前节目配置
    programFolder: string,      // 节目存储目录
    activeDevice: UTSJSONObject, // 当前选中设备
    activeUser: UTSJSONObject   // 当前操作用户
}
```

**核心函数：**
| 函数 | 说明 |
|------|------|
| `setToken(token)` | 设置认证令牌并持久化 |
| `setLoginUser(userInfo)` | 设置登录用户信息 |
| `setActiveDevice(device)` | 设置当前激活设备 |
| `setActiveUser(userInfo)` | 设置当前操作用户 |
| `setProgram(program)` | 设置当前节目 |
| `loadStateFromStorage()` | 从存储加载状态 |

**使用示例：**
```typescript
import { useState } from '@/store/index.uts'

const { state, setToken, setActiveDevice } = useState();
// 读取状态
console.log(state.token);
// 修改状态
setToken('new-token');
setActiveDevice({ id: 1, name: 'Display-01' });
```

---

### 2. API 配置 (api/config.uts)

后端 API 端点定义和请求封装。

**API 端点列表：**

| 端点 | 方法 | 说明 |
|------|------|------|
| `/simpleLogin` | POST | 用户登录 |
| `/user/all` | GET | 获取所有用户 |
| `/user/{id}` | GET | 获取用户详情 |
| `/user/save` | POST | 保存用户 |
| `/monitor/all` | GET | 获取设备列表 |
| `/monitor/{id}` | GET | 获取设备详情 |
| `/monitor` | POST/PUT | 创建/更新设备 |
| `/monitor/sendMobileCmd` | POST | 发送设备命令 |
| `/media/all` | GET | 获取媒体列表 |
| `/media/download` | GET | 下载媒体文件 |
| `/programme/upload` | POST | 上传节目包 |
| `/playbackRecord/*` | GET/POST | 播放记录 |

**请求封装函数：**

```typescript
// POST 请求
export async function postApi(apiUrl: string, data: UTSJSONObject)

// GET 请求
export async function getApi<T>(apiUrl: string)
```

---

### 3. HTTP 模块 (utils/http/index.uts)

统一 HTTP 请求封装，带 token 认证和错误处理。

**核心函数：**
```typescript
export function request(method: RequestMethod, url: string, option: UTSJSONObject): Promise<any|null|undefined>
```

**特性：**
- 自动携带 Bearer Token
- 统一的错误处理
- 401 未授权自动跳转登录页
- Promise 封装

**使用示例：**
```typescript
import { request } from '@/utils/http/index'
import { APIS } from '@/api/config.uts'

// GET 请求
const result = await request('GET', APIS.deviceListPage as string + param, {});

// POST 请求
const result = await request('POST', APIS.sendCMD as string, dataObj);
```

---

### 4. 路由导航 (common/router.uts)

路由跳转封装，带登录状态校验。

**核心函数：**
```typescript
export function routeGoto(route: string): void
```

**特性：**
- 自动检查登录状态
- 未登录时弹出登录提示并跳转用户中心
- 支持绝对路径和相对路径

**使用示例：**
```typescript
import { routeGoto } from '@/common/router.uts'

routeGoto('/pages/devices/edit?device_id=123');
routeGoto('/pages/programs/editor?name=MyProgram');
```

---

### 5. 国际化 (locale/)

多语言支持框架，使用 `lime-i18n` 插件。

**支持语言：**
- `zh-CN` - 简体中文
- `en` - 英文
- `kr` - 韩文
- `jp` - 日文

**核心配置 (locale/index.ts)：**
```typescript
const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: defaultLang,
    fallbackLocale: 'zh-CN',
    messages: { 'zh-CN': zhCN, 'en': en, 'kr': kr, 'jp': jp },
    tabBars: tabBars
})
```

**切换语言：**
```typescript
import { changeLanguage } from '@/locale'

changeLanguage('en'); // 切换到英文
```

**页面中使用：**
```vue
<text>{{ $t('pages.home') }}</text>
<text>{{ $t('index.DeviceManagement') }}</text>
```

---

## 页面模块详解

### 1. 首页 (pages/index/index.uvue)

应用主页面，展示设备状态和快捷入口。

**功能：**
- 显示当前选中设备信息
- 快速选择设备
- 快速创建节目
- 跳转节目管理
- 跳转设备控制

**核心逻辑：**
```typescript
onShow() {
    const { state } = useState();
    if (state.token != '' && state.loginUser['id'] != null) {
        this.userInfo = state.loginUser;
        this.activeUser = state.activeUser;
        this.activeDevice = state.activeDevice;
    }
}
```

---

### 2. 用户中心 (pages/user/index.uvue)

用户登录和账户管理。

**功能：**
- 用户登录/登出
- 角色显示 (管理员/代理商/普通用户)
- 语言切换入口
- 帮助入口

**登录流程：**
1. 调用 `/simpleLogin` 接口
2. 获取 token 和 userId
3. 调用 `/user/{id}` 获取用户详情
4. 保存到全局状态

---

### 3. 设备管理 (pages/index/devices.uvue)

设备列表展示和管理。

**功能：**
- 按用户筛选设备
- 显示设备连接状态
- 显示设备有效期
- 选择设备
- 编辑/管理设备

**核心 API：**
```typescript
GET /monitor/all?userAccount={account}  // 获取设备列表
DELETE /monitor/{id}                    // 删除设备
```

---

### 4. 设备编辑 (pages/devices/edit.uvue)

单个设备的详细管理和控制。

**功能：**
- 显示设备详情 (名称、SN码、分辨率、状态)
- 亮度调节
- 音量调节
- 时间同步配置
- 重启设备
- 开关机控制
- 设备激活/停用

**控制功能路由：**
| 功能 | 页面路径 |
|------|----------|
| 亮度调节 | `/pages/devices/editbrightness` |
| 音量调节 | `/pages/devices/volume` |
| 时间配置 | `/pages/devices/edittime` |
| 重启 | `/pages/devices/restart` |
| 开关机 | `/pages/devices/poweroffon` |
| 定时控制 | `/pages/devices/timercontrol` |

---

### 5. 节目管理 (pages/programs/index.uvue)

节目列表展示和管理。

**功能：**
- 显示本地节目列表
- 创建新节目
- 编辑已有节目
- 发布节目到设备
- 删除节目

**节目数据结构：**
```typescript
{
    name: string,           // 节目名称
    path: string,          // 存储路径
}
```

**核心操作：**
```typescript
// 获取节目列表
this.programList = await that.fileManager.getProgramList();

// 创建节目
routeGoto('/pages/programs/editor?name=' + name + '&width=' + width + '&height=' + height);

// 发布节目
await this.fileManager.pushProgram(programData, this.preDevice);
```

---

### 6. 节目编辑器 (pages/programs/editor.uvue)

可视化节目编辑器，支持拖拽、缩放组件。

**支持组件类型：**
| 类型 | 说明 | 是否有文件 |
|------|------|------------|
| Video | 视频组件 | 是 |
| Image | 图片组件 | 是 |
| Text | 文字组件 | 否 |
| Web | 网页组件 | 否 |
| Word | 文档组件 | 是 |

**核心功能：**
- Canvas 画布渲染
- 组件拖拽定位
- 组件缩放调整
- 页面管理 (最多5页)
- 组件属性编辑
- 节目保存和发布

**触摸交互：**
```typescript
handleTouchStart()   // 检测点击的组件
handleTouchMove()    // 拖拽/缩放移动
handleTouchEnd()     // 结束操作，更新组件数据
```

---

### 7. 文件管理 (pages/programs/FileManager.uts)

节目文件的本地存储和管理。

**核心类：FileManager**

**核心方法：**

| 方法 | 说明 |
|------|------|
| `getProgramList()` | 获取本地节目列表 |
| `getProgramConfig(name, width, height)` | 获取节目配置，不存在则创建 |
| `saveProgram(name, data)` | 保存节目配置 |
| `zipProgram(name)` | 打包节目为 ZIP |
| `uploadProgram(name)` | 上传节目包到服务器 |
| `pushProgram(data, snCodes)` | 发布节目到设备 |
| `capture(programName, pageName, canvas)` | 截取页面缩略图 |
| `deleteProgram(name)` | 删除节目 |

**存储路径：**
```typescript
const MediaStoreFolder = `${uni.env.USER_DATA_PATH}/temp/program/mediaStore`;
// 用户节目目录
const programFolder = `${uni.env.USER_DATA_PATH}/temp/program/${userAccount}`;
```

---

### 8. 媒体配置 (pages/programs/mediaConfig.uts)

节目数据结构定义和序列化。

**核心类层次：**
```
MediaConfig
├── left: number
├── top: number
├── ratio: number
├── program: Program
└── pages: MediaPage[]

Program
├── name, mediaType, resolution
├── size, monitorCount
├── status, createdSource
├── validity (isHasValidity, validStartDate, validEndDate)
└── userAccount, id

MediaPage
├── id, name, type, order
├── thumbnailFilePath
├── validity
├── playCount, playGap, adPlayMode
├── schedulers: Scheduler[]
└── components: BaseComponent[]

BaseComponent (抽象类)
├── id, name, zIndex
├── position: left, top, width, height
├── source, timeLine
├── playCount, playDuration
└── element: DraggableImage

├── VideoComponent
├── ImageComponent
├── TextComponent
├── WebComponent
└── WordComponent
```

---

### 9. 拖拽矩形 (pages/programs/DraggableRect.uts)

组件的可视化表示，支持拖拽和缩放。

**核心方法：**
```typescript
isHit(touchX, touchY)           // 检测是否点击组件
isHitResizeHandle(touchX, touchY) // 检测是否点击缩放句柄
draw(canvas)                     // 绘制组件和选中边框
drawText(canvas, textStyle)      // 绘制文本组件
```

---

### 10. 用户选择 (pages/index/users.uvue)

管理员/代理商选择子用户。

**功能：**
- 显示下级用户列表
- 按角色筛选 (代理商显示其子用户)
- 选择用户并跳转设备列表

---

### 11. 屏体设置 (pages/setting/index.uvue)

设备高级设置入口（预留）。

**功能列表：**
- 亮度/音量 (预留)
- 时间/网络设置 (预留)
- 同步播放/单机播放 (预留)
- 屏幕旋转/软拼接 (预留)
- 重启/开关机/还原 (预留)
- 绑定上云/设备密码 (预留)
- 监控信息/设备信息 (预留)

---

### 12. 实时播控 (pages/player/index.uvue)

节目播放状态展示（预留）。

**功能：**
- 显示当前设备
- 显示播放中/等待播放的节目列表

---

## 组件库

### 1. popup-default (components/popup-default/index.uvue)

通用弹窗组件。

**属性：**
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| visible | Boolean | false | 显示/隐藏 |
| title | String | '' | 标题 |
| cancelText | String | '取消' | 取消按钮文本 |
| confirmText | String | '确定' | 确认按钮文本 |

**事件：**
| 事件 | 说明 |
|------|------|
| update:visible | 隐藏弹窗 |
| cancel | 点击取消 |
| confirm | 点击确认 |

**使用示例：**
```vue
<popup-default
    v-model:visible="createPopup"
    title="创建新节目"
    :show-icon="false"
    @confirm="handleCreate"
>
    <!-- 自定义内容 -->
    <view>弹窗内容</view>
</popup-default>
```

---

### 2. picker-date (components/picker-date/picker-date.uvue)

日期选择器组件。

---

### 3. picker-time (components/picker-time/picker-time.uvue)

时间选择器组件。

---

### 4. timer-controls (components/timer-controls/timer-controls.uvue)

定时器控制组件。

---

## 依赖模块

### uni_modules

| 插件 | 说明 | 用途 |
|------|------|------|
| `u-canvas` | Canvas 画布 | 节目编辑器渲染 |
| `lime-i18n` | 国际化 | 多语言支持 |
| `ns-unzip` | ZIP 解压 | 解压下载的节目包 |
| `zip-util` | ZIP 压缩 | 打包节目文件 |
| `wrs-uts-udp` | UDP 通信 | 设备通信 (预留) |
| `yu-img-editor` | 图片编辑 | 图片编辑功能 (预留) |
| `image-editing` | 图片处理 | 图片效果处理 (预留) |

---

## 页面路由

| 路径 | 页面标题 | 说明 |
|------|----------|------|
| `pages/index/index` | 首页 | 主页面 |
| `pages/user/index` | 我的 | 用户中心 |
| `pages/index/devices` | 设备管理 | 设备列表 |
| `pages/index/users` | 用户管理 | 用户选择 |
| `pages/programs/index` | 节目管理 | 节目列表 |
| `pages/programs/edit` | 节目编辑 | 节目编辑 |
| `pages/programs/editor` | 节目编辑器 | 可视化编辑 |
| `pages/programs/review` | 节目预览 | 预览效果 |
| `pages/devices/create` | 添加设备 | 创建设备 |
| `pages/devices/edit` | 设备管理 | 设备详情/控制 |
| `pages/devices/editbrightness` | 亮度调节 | 亮度控制 |
| `pages/devices/volume` | 音量调节 | 音量控制 |
| `pages/devices/edittime` | 时间配置 | 时间同步 |
| `pages/devices/restart` | 重启 | 重启设备 |
| `pages/devices/poweroffon` | 开关机 | 电源控制 |
| `pages/devices/timercontrol` | 定时控制 | 定时任务 |
| `pages/setting/index` | 屏体管理 | 高级设置 |
| `pages/player/index` | 实时播控 | 播放控制 |
| `pages/user/software` | 固件管理 | 固件升级 |
| `pages/user/language` | 语言切换 | 切换语言 |
| `pages/user/edit` | 用户编辑 | 编辑用户 |

---

## 数据流

### 用户登录流程
```
用户输入账号密码
    ↓
POST /simpleLogin
    ↓
获取 token 和 userId
    ↓
GET /user/{id}
    ↓
保存用户信息到 store
    ↓
跳转到首页
```

### 设备控制流程
```
选择设备 → 保存到 store
    ↓
进入设备控制页
    ↓
选择控制项 (亮度/音量/重启...)
    ↓
POST /monitor/sendMobileCmd
    ↓
发送命令到设备
```

### 节目发布流程
```
创建/编辑节目
    ↓
添加组件 (视频/图片/文字/网页/文档)
    ↓
拖拽定位和缩放
    ↓
保存配置 (FileManager.saveProgram)
    ↓
打包 ZIP (FileManager.zipProgram)
    ↓
上传到服务器 (FileManager.uploadProgram)
    ↓
发布到设备 (FileManager.pushProgram)
    ↓
设备接收并播放
```

---

## 配置说明

### manifest.json
```json
{
    "name": "Sign Plex",
    "appid": "__UNI__E218110",
    "versionName": "1.0.0",
    "versionCode": "100",
    "app-android": {
        "minSdkVersion": "28",
        "permissions": [
            "READ_EXTERNAL_STORAGE",
            "WRITE_EXTERNAL_STORAGE",
            "MANAGE_EXTERNAL_STORAGE"
        ]
    }
}
```

### pages.json
- 定义页面路由
- 配置 TabBar (首页、用户中心)
- 设置页面样式
- 配置国际化标题

### theme.json
- 定义亮色/暗色主题
- 配置导航栏、TabBar 颜色

---

## 运行方式

### 开发环境
```bash
# 使用 HBuilderX
# 1. 打开项目目录
# 2. 选择运行 → 运行到浏览器/手机/模拟器
```

### 打包发布
```bash
# 使用 HBuilderX
# 1. 选择发行 → 原生App-云打包
# 2. 选择 Android 应用证书
# 3. 等待打包完成
```

### API 服务器
项目默认连接：`http://1.255.226.145:12106`

如需修改，编辑 `api/config.uts` 和 `utils/http/index.uts` 中的 `BASE_URL`。

---

## 注意事项

1. **权限要求**：Android 需要存储权限才能进行文件操作
2. **登录状态**：除用户中心外，大部分功能需要登录后才能使用
3. **设备连接**：部分设备控制功能需要设备在线才能执行
4. **多语言**：新增页面需在 `locale/lang/*.uts` 中添加对应翻译
5. **组件限制**：每个页面最多 5 个组件，整个节目最多 5 页
6. **存储路径**：使用 `uni.env.USER_DATA_PATH` 作为应用私有目录

---

## 常见问题

**Q: 如何添加新的页面？**
A: 在 `pages.json` 的 `pages` 数组中添加新页面配置，并在 `pages/` 目录下创建对应的 `.uvue` 文件。

**Q: 如何添加新的 API 端点？**
A: 在 `api/config.uts` 的 `APIS` 对象中添加新的端点定义。

**Q: 如何添加新的语言？**
A: 在 `locale/lang/` 目录下创建新的语言文件，并在 `locale/index.ts` 的 `messages` 中注册。

**Q: 节目发布失败怎么办？**
A: 检查：
1. 设备是否在线
2. 网络连接是否正常
3. 节目是否已正确打包
4. API 服务是否可用
