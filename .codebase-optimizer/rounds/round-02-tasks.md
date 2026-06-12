# Round 2: 任务清单

**生成时间**: 2026-06-12
**当前阶段**: 阶段2

## 待办任务

### [ ] R2-T1 [P1] 模板中 JSON.stringify 改为计算属性
- **文件**: `pages/index/index.uvue:8,15,20,24`
- **方案**: 4 处改为 `Object.keys(obj).length > 0`
- **工作量**: 小

### [ ] R2-T2 [P1] 历史深克隆改为浅拷贝
- **文件**: `pages/programs/shared/history.uts:86`
- **方案**: 仅复制必要字段，减少 JSON.parse/stringify
- **工作量**: 中

### [ ] R2-T3 [P1] 6 个表单组件改为 v-if 按需挂载
- **文件**: `pages/programs/editor.uvue:93-102`
- **方案**: 改为 `v-if="activeComponent?.type === 'Video'"` 等
- **工作量**: 中

### [ ] R2-T4 [P1] 设备过滤器合并为单次遍历 + 防抖
- **文件**: `pages/index/devices.uvue:143-178`
- **方案**: reduce 合并三次 filter，搜索加防抖
- **工作量**: 小

### [ ] R2-T5 [P1] TouchMove 属性写入节流
- **文件**: `pages/programs/editor.uvue:633-678`
- **方案**: rAF 合并坐标更新
- **工作量**: 小

### [ ] R2-T6 [P1] 硬编码 IP 改为 HTTPS + 环境配置
- **文件**: `api/config.uts:1`, `utils/http/index.uts:1`
- **方案**: BASE_URL 改为 https，支持环境切换
- **工作量**: 中

### [ ] R2-T7 [P1] 不安全 URL 拼接（6 处）
- **文件**: 6 个文件
- **方案**: 使用 encodeURIComponent 或 URLSearchParams
- **工作量**: 中

### [ ] R2-T8 [P1] API 路径 {id} 替换风险
- **文件**: `api/config.uts` + 4 处调用
- **方案**: 校验 id 为数字
- **工作量**: 小

### [ ] R2-T9 [P1] 表单输入前端验证（5 处）
- **文件**: 5 个文件
- **方案**: 补充非空/格式/长度校验
- **工作量**: 中

### [ ] R2-T10 [P1] 文件系统路径遍历防护
- **文件**: file-manager/index.uts, media-config/index.uts, wordForm.uvue
- **方案**: 路径组件白名单校验，禁止 ../ 和空字符
- **工作量**: 中

### [-] R2-T11 [P1] 补充根 package.json 和脚本 — **跳过**
- **原因**: uni-app-X 由 HBuilderX 构建，CLI 工具链有限，根 package.json 需配合平台 CLI 方案
- **工作量**: 大（需调研）

### [-] R2-T12 [P1] 添加 ESLint/Prettier — **跳过**
- **原因**: 需先确认 uni-app-X 的 UTS 语法 lint 插件是否可用，现阶段可暂缓
- **工作量**: 大（需调研）

### [ ] R2-T13 [P1] 补充 README.md
- **文件**: `README.md`
- **方案**: 基础项目描述、安装、运行等
- **工作量**: 小

### [-] R2-T14 [P1] 替换 141+ 处 any 类型 — **跳过**
- **原因**: 影响 20+ 文件，需逐文件定义类型，当前轮次不现实
- **工作量**: 极大

### [-] R2-T15 [P1] 添加应用层测试 — **跳过**
- **原因**: 需引入测试框架、编写大量测试，当前轮次不可行
- **工作量**: 极大

### [-] R2-T16 [P2] 补充 tsconfig/editorconfig/CI/Docker/.env — **跳过**
- **原因**: 非功能性，工程化渐进改进项
- **工作量**: 中

---
**统计**: 总计 16 个 | 待修 10 个 | 跳过 6 个
