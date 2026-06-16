# Round 2: 任务清单

**生成时间**: 2026-06-12
**当前阶段**: 阶段1

## 待办任务

### [ ] R2-T1 [P1] 修复 login fail 回调空实现
- **文件**: `pages/user/index.uvue:182-184`
- **方案**: 添加 `uni.hideLoading()` 和 `uni.showToast` 错误提示

### [ ] R2-T2 [P1] 修复 programs/index 推送无 try/catch
- **文件**: `pages/programs/index.uvue:271-301`
- **方案**: 用 try/catch 包裹整个方法体

### [ ] R2-T3 [P1] 修复 devices DELETE 请求无 catch
- **文件**: `pages/index/devices.uvue:256-261`
- **方案**: 添加 `.catch()`

### [ ] R2-T4 [P1] 修复 HTTP 请求 token null 检查
- **文件**: `utils/http/index.uts:34`
- **方案**: `const token = state?.token ?? '';`

### [ ] R2-T5 [P2] 修复 handleLogin getAccountInfo 异步错误丢失
- **文件**: `pages/user/index.uvue`
- **方案**: 在 success 回调中添加 `.catch()`

### [ ] R2-T6 [P2] 修复 importProgram 用户取消后仍返回成功
- **文件**: `pages/programs/shared/file-manager/index.uts:391-421`
- **方案**: 用户取消时返回 null

## 本周任务统计
- **总计**: 6 个
- **已完成**: 0 个
- **待完成**: 6 个

---
**所有任务已完成**  ← 完成时替换此行
