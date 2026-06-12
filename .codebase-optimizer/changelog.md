# Codebase Optimizer - 变更日志

## Round 2

### 2026-06-12
- [R2-T1] 修复 | `pages/index/index.uvue` | 模板 JSON.stringify 改计算属性
- [R2-T2] 修复 | `pages/programs/shared/history.uts` | 历史深克隆改结构化浅拷贝
- [R2-T3] 修复 | `pages/programs/editor.uvue` | 6 表单改 v-if 按需挂载
- [R2-T4] 修复 | `pages/index/devices.uvue` | 设备过滤器合并为单次遍历
- [R2-T5] 修复 | `pages/programs/editor.uvue` | TouchMove 属性写入节流
- [R2-T6] 修复 | `api/config.uts`, `utils/http/index.uts` | BASE_URL 去重，导入统一配置
- [R2-T7] 修复 | 6 处 | 不安全 URL 拼接加 encodeURIComponent
- [R2-T8] 修复 | 4 处 | API {id} 路径数字校验
- [R2-T9] 修复 | 5 处 | 表单输入前端验证
- [R2-T10] 修复 | `file-manager/index.uts`, `wordForm.uvue` | 文件系统路径遍历防护
- [R2-T13] 修复 | `README.md` | 补充项目描述文档

## Round 1

### 2026-06-12
- [R1-T1] 修复 | `pages/user/index.uvue:107-108` | 移除硬编码默认管理员凭证
- [R1-T2] 修复 | `pages/devices/edit.uvue:138` | 修复设备过期逻辑 Bug
- [R1-T3] 修复 | `pages/programs/editor.uvue:19` | 修复 Canvas 缩放未生效
- [R1-T4] 修复 | `pages/user/index.uvue:182-184` | 补充空网络失败处理器
- [R1-T5] i18n | 多处 | 提取 10+ 处硬编码中文到国际化
- [R1-T6] 清理 | 多处 | 移除未使用的变量和死代码
- [R1-T7] 修复 | `pages/programs/editor.uvue:533-538` | 修复弱 Draw Throttle
- [R1-T8] 修复 | 多处 | 修正 CSS 命名错误和重复属性
- [R1-T9] 修复 | `pages/index/index.uvue` | 替换 JSON.stringify 空对象检查
- [R1-T10] 修复 | 7 处 catch 块 | 修复静默 Catch 块，添加用户提示
- [R1-T11] 工程化 | `.gitignore` | 补充忽略规则
- [R1-T12] 修复 | 6 处 | 修正非标准语言代码 kr→ko, jp→ja
