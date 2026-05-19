# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal finance management system (个人理财管理系统) with Spring Boot backend and vanilla HTML/CSS/JS frontend. Tracks income/expenses, budgets, and provides statistical analysis.

## Tech Stack

- **Backend**: Spring Boot 3.2.5, MyBatis-Plus 3.5.5, MySQL, Lombok, BCrypt (spring-security-crypto)
- **Frontend**: HTML5, CSS3, JavaScript (vanilla), Axios, ECharts
- **Build**: Maven (backend), Node.js static server (frontend)

## Commands

### Backend
```bash
cd backend/finance
mvn clean compile          # Compile
mvn spring-boot:run        # Run (requires MySQL on localhost:3306)
mvn test                   # Run tests
mvn package                # Build JAR
```

### Frontend
```bash
cd frontend
node server.js             # Start static server on port 5500
```

## Architecture

### Backend (`backend/finance/`)
Standard Spring Boot layered architecture:
- `controller/` - REST endpoints under `/api/`
- `service/` + `service/impl/` - Business logic (interface + implementation pattern)
- `mapper/` - MyBatis-Plus mapper interfaces
- `entity/` - Database entities with Lombok annotations
- `common/` - Shared classes (`Result<T>` response wrapper, `GlobalExceptionHandler`)
- `config/` - CORS, MyBatis-Plus, password encoder configuration

### Frontend (`frontend/`)
Static HTML pages with JS modules:
- `js/axios-config.js` - Centralized Axios instance (baseURL: `http://localhost:8080`), user session management, utility functions
- Each page has a corresponding JS file (e.g., `dashboard.html` → `js/dashboard.js`)

### API Response Format
All endpoints return `Result<T>`:
```json
{"code": 200, "message": "操作成功", "data": {...}}
```
Error codes: 400 (validation), 404 (not found), 500 (server error)

### Key Patterns
- Controllers accept `Map<String, String>` for request bodies, not DTOs
- Services throw `IllegalArgumentException` for business validation errors
- MyBatis-Plus `LambdaQueryWrapper` for database queries
- User authentication via userId passed in request params (no session/token framework)
- Jackson configured with `SNAKE_CASE` property naming strategy

## Database

MySQL database `personal_finance` with tables: `user`, `record`, `budget`, `category`

Initialize with: `backend/finance/src/main/resources/db/schema.sql`

Default credentials in `application.yml`: root/123456 on localhost:3306
