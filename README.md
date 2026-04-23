# Personal-Finance-Management（个人理财管理系统）

轻量级个人理财管理系统，基于 Spring Boot + MySQL 构建，实现收入/支出记录、预算管理、数据统计分析等功能，帮助用户高效管理个人财务。适合课程设计、毕业设计、学习演示。

---

## 项目简介

本项目是一套完整的个人理财管理系统，采用 **B/S 架构**设计。

**前端**使用 HTML5 + CSS3 + JavaScript + ECharts 实现页面展示与数据可视化；
**后端**使用 Spring Boot + MyBatis-Plus 快速构建 RESTful API；
**数据库**使用 MySQL 实现数据持久化存储。

系统界面简洁、功能完整，涵盖日常记账、收支统计、预算预警、报表分析等核心理财功能。

---

## 技术栈

### 前端
| 技术 | 用途 |
|------|------|
| HTML5 | 页面结构 |
| CSS3 | 样式美化 |
| JavaScript | 业务逻辑 |
| ECharts | 数据可视化（收支趋势图）|
| Axios | 异步请求 |

### 后端
| 技术 | 用途 |
|------|------|
| Spring Boot 2.x / 3.x | 基础框架 |
| Spring Web | RESTful 接口 |
| MyBatis-Plus | ORM 框架 |
| MySQL 8.0 / 5.7 | 数据存储 |
| BCrypt | 密码加密 |
| Lombok | 简化代码 |

---

## 项目结构

```
Personal-Finance-Management/
│
├── frontend/                          # 前端静态文件
│   ├── index.html                     # 登录页
│   ├── register.html                  # 注册页
│   ├── dashboard.html                 # 仪表盘主页
│   ├── records.html                   # 记账页面
│   ├── statistics.html                # 统计分析页
│   ├── budget.html                    # 预算管理页
│   ├── css/
│   │   └── style.css                  # 全局样式
│   ├── js/
│   │   ├── login.js                   # 登录逻辑
│   │   ├── register.js                # 注册逻辑
│   │   ├── records.js                 # 记账逻辑
│   │   ├── statistics.js              # 统计图表
│   │   ├── budget.js                  # 预算逻辑
│   │   └── axios-config.js            # Axios统一配置
│   └── assets/                        # 图片/图标资源
│
├── backend/                           # Spring Boot后端
│   ├── pom.xml                        # Maven配置文件
│   └── src/
│       └── main/
│           ├── java/
│           │   └── com/
│           │       └── example/
│           │           └── finance/
│           │               ├── FinanceApplication.java      # 启动类
│           │               ├── controller/
│           │               │   ├── UserController.java
│           │               │   ├── RecordController.java
│           │               │   └── BudgetController.java
│           │               ├── service/
│           │               │   ├── UserService.java
│           │               │   ├── RecordService.java
│           │               │   └── BudgetService.java
│           │               ├── mapper/
│           │               │   ├── UserMapper.java
│           │               │   ├── RecordMapper.java
│           │               │   └── BudgetMapper.java
│           │               ├── entity/
│           │               │   ├── User.java
│           │               │   ├── Record.java
│           │               │   └── Budget.java
│           │               └── config/
│           │                   ├── CorsConfig.java
│           │                   └── PasswordEncoderConfig.java
│           └── resources/
│               ├── application.yml
│               └── db/
│                   └── schema.sql
│
├── LICENSE
└── README.md
```
## 数据库设计

### 表结构

**表名：`user`**

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | bigint | 主键，自增 |
| username | varchar(50) | 用户名，唯一 |
| password | varchar(255) | BCrypt 加密密码 |
| email | varchar(100) | 邮箱 |
| create_time | datetime | 注册时间 |
| update_time | datetime | 更新时间 |

**表名：`record`**

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | bigint | 主键，自增 |
| user_id | bigint | 外键，关联用户 |
| type | varchar(10) | 类型：income（收入）/ expense（支出）|
| amount | decimal(10,2) | 金额 |
| category | varchar(50) | 分类（餐饮、购物、工资等）|
| remark | varchar(255) | 备注 |
| record_date | date | 记账日期 |
| create_time | datetime | 创建时间 |

**表名：`budget`**

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | bigint | 主键，自增 |
| user_id | bigint | 外键，关联用户 |
| category | varchar(50) | 预算分类 |
| amount | decimal(10,2) | 预算金额 |
| month | varchar(7) | 预算月份（YYYY-MM）|
| create_time | datetime | 创建时间 |
| update_time | datetime | 更新时间 |

**表名：`category`**

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | int | 主键，自增 |
| name | varchar(50) | 分类名称 |
| type | varchar(10) | 所属类型（income/expense）|

---

## 功能模块

### 1. 用户模块
- 用户注册（用户名、密码、邮箱）
- 用户登录（BCrypt 密码校验）
- 登录状态保持（Session / Token）

### 2. 记账模块
- 添加收入/支出记录
- 编辑/删除记录
- 按时间范围查询记录
- 按分类筛选记录

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

## 接口设计（RESTful API）

| 接口路径 | 方法 | 请求示例 | 说明 |
|----------|------|----------|------|
| `/api/user/register` | POST | `{"username":"test","password":"123","email":"test@qq.com"}` | 用户注册 |
| `/api/user/login` | POST | `{"username":"test","password":"123"}` | 用户登录 |
| `/api/user/info` | GET | 无 | 获取当前用户信息 |
| `/api/records` | POST | `{"type":"expense","amount":50,"category":"餐饮","recordDate":"2026-04-19"}` | 添加记录 |
| `/api/records` | GET | `?page=1&size=10&month=2026-04` | 分页查询记录 |
| `/api/records/{id}` | PUT | `{"amount":60}` | 修改记录 |
| `/api/records/{id}` | DELETE | 无 | 删除记录 |
| `/api/statistics/summary` | GET | `?month=2026-04` | 月度收支汇总 |
| `/api/statistics/trend` | GET | `?months=6` | 收支趋势数据 |
| `/api/budget` | POST | `{"category":"餐饮","amount":2000,"month":"2026-04"}` | 设置预算 |
| `/api/budget` | GET | `?month=2026-04` | 查询本月预算 |

---

## 快速启动

### 环境要求
- JDK 17+
- MySQL 8.0 / 5.7
- Maven 3.6+
- 现代浏览器（Chrome / Edge / Firefox）

### 启动步骤

**1. 创建数据库**
```sql
CREATE DATABASE personal_finance;