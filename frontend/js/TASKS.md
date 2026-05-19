# Personal Finance Management — Frontend Tasks

前端静态页面，基于 HTML5 + CSS3 + Vanilla JavaScript + ECharts + Axios 构建。

---

## 项目结构

```
frontend/
├── index.html              # 登录页
├── register.html           # 注册页
├── dashboard.html          # 仪表盘主页
├── records.html            # 记账页面
├── statistics.html         # 统计分析页
├── budget.html             # 预算管理页
├── css/
│   └── style.css           # 全局样式（全新设计）
├── js/
│   ├── axios-config.js     # Axios 统一配置
│   ├── login.js            # 登录逻辑
│   ├── register.js         # 注册逻辑
│   ├── dashboard.js        # 仪表盘逻辑
│   ├── records.js          # 记账逻辑
│   ├── statistics.js       # 统计图表
│   └── budget.js           # 预算逻辑
└── assets/                 # 图片/图标资源
```

---

## 页面清单与 API 依赖

| 页面 | 文件 | 依赖 API | 功能 |
|------|------|----------|------|
| 登录 | `index.html` | `POST /api/user/login` | 表单校验 → 跳转仪表盘 |
| 注册 | `register.html` | `POST /api/user/register` | 表单校验 → 跳转登录 |
| 仪表盘 | `dashboard.html` | `GET /api/statistics/summary`, `/api/records`, `/api/budget` | 月度汇总 + 近期账单 + 预算进度 |
| 记账 | `records.html` | CRUD `/api/records` | 添加/编辑/删除/分页查询收支记录 |
| 统计 | `statistics.html` | `GET /api/statistics/summary`, `/api/statistics/trend` | ECharts 饼图 + 折线图 |
| 预算 | `budget.html` | `POST/GET /api/budget` | 按分类设置月度预算 + 进度展示 |

---

## 功能模块

### 1. 用户模块
- 用户注册（用户名、密码、邮箱）
- 用户登录（BCrypt 密码校验）
- 登录状态保持（Session）

### 2. 记账模块
- 添加收入/支出记录
- 编辑/删除记录
- 按时间范围查询记录
- 按分类筛选记录
- 分页查询

### 3. 预算管理模块
- 设置月度分类预算
- 实时显示预算使用进度
- 超预算预警提示

### 4. 统计分析模块
- 月度收支汇总
- 支出分类占比饼图（ECharts）
- 近半年收支趋势折线图
- 结余计算

### 5. 仪表盘主页
- 展示当月总收入、总支出、结余
- 近期账单列表
- 预算进度概览

---

## RESTful API 接口

| 接口路径 | 方法 | 说明 |
|----------|------|------|
| `/api/user/register` | POST | 用户注册 |
| `/api/user/login` | POST | 用户登录 |
| `/api/user/info` | GET | 获取当前用户信息 |
| `/api/records` | POST | 添加记录 |
| `/api/records` | GET | 分页查询记录 |
| `/api/records/{id}` | PUT | 修改记录 |
| `/api/records/{id}` | DELETE | 删除记录 |
| `/api/statistics/summary` | GET | 月度收支汇总 |
| `/api/statistics/trend` | GET | 收支趋势数据 |
| `/api/budget` | POST | 设置预算 |
| `/api/budget` | GET | 查询本月预算 |

### 统一响应格式

```json
// 成功
{ "code": 200, "message": "操作成功", "data": ... }
// 失败
{ "code": 500, "message": "错误信息", "data": null }
```

Axios 拦截器解包后业务代码直接使用 `data` 字段。

---

## 开发说明

- 后端启动：`backend/finance/` 下执行 `mvn spring-boot:run`
- 前端直接浏览器打开 HTML 文件即可（或任意静态服务器）
- 后端运行在 `http://localhost:8080`，CORS 已由后端开启
- Axios 配置 `withCredentials: true`，登录态由后端 Session 管理
- 前端依赖 ECharts、Axios 均通过 CDN 引入

---

## 开发顺序

1. **基础设施**：`axios-config.js` + `style.css`
2. **用户模块**：`index.html` + `register.html`（含对应 JS）
3. **核心记账**：`records.html`
4. **仪表盘**：`dashboard.html`
5. **统计分析**：`statistics.html`
6. **预算管理**：`budget.html`

---

## 技术栈

| 技术 | 用途 |
|------|------|
| HTML5 | 页面结构 |
| CSS3 | 样式（全新设计） |
| JavaScript | 业务逻辑 + DOM 操作 |
| ECharts (CDN) | 数据可视化 |
| Axios (CDN) | HTTP 请求 |
| Session/Cookie | 登录态保持 |
