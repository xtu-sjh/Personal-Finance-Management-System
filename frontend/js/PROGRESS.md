# 前端开发进度报告

> 生成时间：2026-05-10
> 范围：`frontend/` 目录内所有文件

---

## 总览

| 指标 | 状态 |
|------|------|
| 整体完成度 | **~75%** |
| 页面总数 | 6 个 HTML 页面 |
| JS 文件 | 4 个独立文件 + 2 个内联脚本 |
| CSS 文件 | 1 个（885 行，含未使用组件） |
| 设计一致性 | ⚠️ 两代设计并存 |

---

## 页面完成度

### ✅ 已完成（新设计）

| 页面 | 完成度 | 说明 |
|------|--------|------|
| `index.html`（登录） | 95% | 表单验证、按钮状态、错误提示、跳转均正常 |
| `dashboard.html`（仪表盘） | 90% | 摘要卡片、饼图、近期账单、预算进度、优雅降级 |
| `statistics.html`（统计分析） | 95% | 饼图、分类排行、趋势折线图、双回退路径 |

### ⚠️ 部分完成（旧设计）

| 页面 | 完成度 | 关键缺失 |
|------|--------|----------|
| `register.html`（注册） | 85% | 布局与登录页不一致（无 auth-page 容器） |
| `records.html`（记账） | 50% | 缺编辑、分页、筛选、备注字段；旧 UI |
| `budget.html`（预算） | 40% | 仅总预算、无分类级、无月份选择、静默失败 |

---

## 已完成功能清单

### 用户模块
- [x] 登录表单 + 验证 + 跳转
- [x] 注册表单 + 密码匹配/长度验证
- [x] sessionStorage 会话管理
- [x] 登出功能（清除会话 + 跳转）
- [x] 未登录自动跳转（`requireCurrentUser`）

### 仪表盘模块
- [x] 月份选择器（默认当月）
- [x] 收入/支出/结余摘要卡片
- [x] 支出分类饼图（ECharts 甜甜圈）
- [x] 预算进度概览（分类级进度条 + 颜色编码）
- [x] 近期账单表格（最近 5 条）
- [x] 空状态提示
- [x] API 不可用时的优雅降级（回退到本地计算）
- [x] 警告横幅提示

### 统计分析模块
- [x] 月份选择器 + 趋势周期选择器（3/6/12 月）
- [x] 月度收支汇总卡片
- [x] 支出分类饼图（垂直图例）
- [x] 分类排行榜（Top 6 + 进度条）
- [x] 收支趋势折线图（平滑曲线 + 填充区域）
- [x] 双端点优雅降级

### 记账模块
- [x] 新增记录（类型、分类、金额、日期）
- [x] 记录列表展示
- [x] 删除记录（带确认）

### 预算模块
- [x] 设置月度总预算
- [x] 预算进度展示（总额/已用/剩余/进度条）
- [x] 进度条颜色编码（90%+ 红、70%+ 橙、正常蓝）

### 基础设施
- [x] Axios 实例配置（baseURL、credentials、headers）
- [x] 响应拦截器（解包 `{code, message, data}`）
- [x] 401 自动跳转登录
- [x] `window.financeApp` 全局工具命名空间
- [x] 格式化工具（货币、日期、HTML 转义）
- [x] 响应式 CSS（768px 断点）
- [x] 完整的设计系统（卡片、按钮、表格、进度条、排名、图表容器）

---

## 未完成功能清单

### 🔴 高优先级

| 功能 | 所在页面 | 说明 |
|------|----------|------|
| **导航链接缺失** | dashboard、statistics | 新设计页面无法到达 records 和 budget 页面 |
| **记录编辑功能** | records.html | TASKS.md 列出"编辑/删除"，但无 PUT 调用、无编辑 UI |
| **记录分页功能** | records.html | API 支持分页，CSS 已有 `.pagination` 样式，但未实现 |
| **分类级预算** | budget.html | dashboard.js 期望分类级数据，budget.html 只设总预算 |
| **预算月份选择** | budget.html | `GET /api/budget` 未传 `month` 参数 |

### 🟡 中优先级

| 功能 | 所在页面 | 说明 |
|------|----------|------|
| **records.html 设计现代化** | records.html | 旧导航栏、内联脚本、原生 `alert()` |
| **budget.html 设计现代化** | budget.html | 同上 |
| **register.html 布局统一** | register.html | 使用 `.container > .card` 而非 `.auth-page > .auth-container > .auth-card` |
| **记录月份筛选** | records.html | 无月份选择器，加载全部记录 |
| **记录分类筛选** | records.html | API 支持 `?category=` 但 UI 未实现 |
| **记录备注字段** | records.html | 表单无备注输入，API 可能支持 |
| **预算错误反馈** | budget.html | `catch` 块仅 `console.log`，用户无感知 |

### 🟢 低优先级

| 功能 | 所在页面 | 说明 |
|------|----------|------|
| **登录"记住我"** | index.html | 无持久化选项 |
| **密码可见性切换** | index.html、register.html | 无显示/隐藏密码按钮 |
| **加载状态指示器** | dashboard、statistics | 刷新时图表区域短暂空白 |
| **导出功能** | statistics.html | 无数据导出 |
| **`js/records.js` 独立文件** | — | README 列出但不存在，逻辑内联 |
| **`js/budget.js` 独立文件** | — | 同上 |
| **`assets/` 目录** | — | TASKS.md 列出但不存在 |

---

## 未使用的 CSS 组件

以下 CSS 已实现但未被任何页面引用，可直接使用：

| 组件 | 选择器 | 用途 |
|------|--------|------|
| 分页 | `.pagination`、`.pagination button`、`.page-info` | 记录列表分页 |
| 模态框 | `.modal-overlay`、`.modal`、`.modal-header`、`.modal-body`、`.modal-footer` | 记录编辑弹窗 |
| 筛选栏 | `.filters` | 月份/分类筛选 |
| 按钮变体 | `.btn-outline`、`.btn-sm`、`.btn-warning` | 多种按钮样式 |
| 网格变体 | `.col-4`、`.col-8` | 布局选项 |
| 表单验证 | `.input-error`、`.error-text` | 字段级错误提示 |

---

## 文件清单与状态

```
frontend/
├── index.html              ✅ 完成（新设计）
├── register.html           ⚠️ 基本完成（布局不一致）
├── dashboard.html          ✅ 完成（新设计，导航缺口）
├── statistics.html         ✅ 完成（新设计，导航缺口）
├── records.html            🔴 旧设计，功能不完整
├── budget.html             🔴 旧设计，功能不完整
├── TASKS.md                📄 需求文档
├── PROGRESS.md             📄 本文件
├── css/
│   └── style.css           ✅ 完成（885 行，含未使用组件）
└── js/
    ├── axios-config.js     ✅ 完成
    ├── login.js            ✅ 完成
    ├── register.js         ✅ 完成
    ├── dashboard.js        ✅ 完成
    └── statistics.js       ✅ 完成
```

**缺失文件（TASKS.md 中列出但不存在）：**
- `js/records.js` — 逻辑内联在 `records.html`
- `js/budget.js` — 逻辑内联在 `budget.html`
- `assets/` — 图片/图标目录

---

## 设计一致性问题

### 两代设计对比

| 方面 | 新设计（dashboard/statistics/login） | 旧设计（records/budget） |
|------|--------------------------------------|--------------------------|
| 导航栏 | 粘性深色渐变、logo、链接列表、用户信息 | 内联 div、emoji 图标、无样式 |
| 用户信息 | ✅ 显示用户名 + 退出按钮 | ❌ 不显示 |
| JS 模式 | IIFE + `window.financeApp` 解构 | 内联 script、全局函数 |
| 通知方式 | 样式化 `.alert` 元素 | 浏览器原生 `alert()` |
| 英雄区域 | ✅ 渐变背景、标题、副标题 | ❌ 无 |
| 卡片样式 | card-header + card-title + soft-tag | 基础 .title |

### 导航连通性

```
index.html ←→ register.html
     ↓
dashboard.html ←→ statistics.html
     ✗                ✗
records.html ←→ budget.html
```

**问题：** 新设计页面（dashboard、statistics）的导航栏仅相互链接，无法到达 records 和 budget。

---

## 建议的开发优先级

### 第一批：导航与设计统一
1. 在 dashboard.html 和 statistics.html 的导航栏添加 records 和 budget 链接
2. 重写 records.html 使用新设计模式（粘性导航、英雄区域、IIFE、样式化 alert）
3. 重写 budget.html 使用新设计模式

### 第二批：功能补全
4. records.html 添加编辑模态框（CSS 已就绪）
5. records.html 添加分页控件（CSS 已就绪）
6. records.html 添加月份/分类筛选器
7. budget.html 改为分类级预算设置

### 第三批：细节完善
8. register.html 布局与 login 统一
9. 添加备注字段到记录表单
10. 预算页面添加月份选择器
11. 错误处理改进（替换原生 alert）

---

## 技术债务

| 项目 | 说明 |
|------|------|
| 内联脚本 | records.html 和 budget.html 的 JS 应提取到独立文件 |
| 函数重复 | `logout()` 在 records/budget 中重复定义，与 `window.financeApp.logout` 功能相同 |
| 原生 alert | 旧页面使用 `alert()` 而非样式化组件 |
| 未使用 CSS | ~20% 的 CSS 组件已实现但未使用（分页、模态框、筛选器） |
| 字段名不一致 | API 返回 `recordDate`/`amount`，前端部分用 `createTime`/`money` 作回退 |
