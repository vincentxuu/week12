# 後端任務清單 (Backend Tasks)

> 基於 12 Week Year App PRD 與技術棧文件規劃

## 目錄
- [Phase 1: 專案基礎建設](#phase-1-專案基礎建設)
- [Phase 2: 核心 API 開發](#phase-2-核心-api-開發)
- [Phase 3: 進階功能與整合](#phase-3-進階功能與整合)
- [Phase 4: 優化與部署](#phase-4-優化與部署)

---

## Phase 1: 專案基礎建設

### 1.1 專案初始化
- [ ] 建立 `backend/` 目錄結構
- [ ] 初始化 Hono 4.x 專案
- [ ] 配置 TypeScript 5.x
- [ ] 設定 Wrangler CLI (Cloudflare Workers)
- [ ] 配置 wrangler.toml
- [ ] 設定環境變數 (dev/staging/prod)
- [ ] ESLint + Prettier 規則

### 1.2 資料庫設計與建置 (Cloudflare D1)

#### Schema 設計
- [ ] 設計 `users` 表結構
- [ ] 設計 `visions` 表結構
- [ ] 設計 `goals` 表結構
- [ ] 設計 `tactics` 表結構
- [ ] 設計 `weekly_tasks` 表結構
- [ ] 設計 `scorecards` 表結構
- [ ] 設計 `cycles` 表結構 (12週週期)
- [ ] 設計 `accountability_partners` 表結構
- [ ] 設計 `accountability_meetings` 表結構
- [ ] 設計 `device_tokens` 表結構
- [ ] 設計 `notification_settings` 表結構
- [ ] 設計索引策略

#### Migration 系統
- [ ] 建立 migration 工具/腳本
- [ ] 撰寫初始 migration (001_init.sql)
- [ ] 建立 seed 資料腳本 (開發用)
- [ ] 測試 D1 本地模擬

### 1.3 核心架構

#### 中介軟體 (Middleware)
- [ ] CORS 設定
- [ ] 請求日誌記錄
- [ ] 錯誤處理中介軟體
- [ ] JWT 認證中介軟體
- [ ] Rate Limiting 中介軟體
- [ ] 請求驗證中介軟體 (Zod)

#### 共用工具
- [ ] 回應格式標準化 (success/error)
- [ ] 分頁處理工具
- [ ] 日期處理工具 (date-fns)
- [ ] ID 生成工具 (nanoid)
- [ ] 密碼雜湊工具 (bcrypt)

### 1.4 儲存服務設定

#### Cloudflare R2 (物件儲存)
- [ ] R2 Bucket 建立
- [ ] 檔案上傳工具
- [ ] 簽名 URL 生成
- [ ] 備份策略規劃

#### Cloudflare KV (快取)
- [ ] KV Namespace 建立
- [ ] 快取策略設計
- [ ] Session 儲存設定
- [ ] Rate Limit 計數器

---

## Phase 2: 核心 API 開發

### 2.1 認證模組 (`/api/v1/auth`)

#### 端點開發
- [ ] `POST /auth/register` - 用戶註冊
- [ ] `POST /auth/login` - Email/Password 登入
- [ ] `POST /auth/logout` - 登出
- [ ] `POST /auth/refresh` - Token 刷新
- [ ] `POST /auth/forgot-password` - 忘記密碼
- [ ] `POST /auth/reset-password` - 重設密碼
- [ ] `POST /auth/verify-email` - 信箱驗證

#### OAuth 整合
- [ ] `POST /auth/google` - Google OAuth
- [ ] `POST /auth/apple` - Apple Sign-In
- [ ] OAuth 回調處理
- [ ] 帳號連結邏輯

#### 安全性
- [ ] JWT Token 生成 (jose 5.x)
- [ ] Refresh Token 機制
- [ ] Token 黑名單 (登出)
- [ ] 密碼強度驗證
- [ ] 登入嘗試限制

### 2.2 用戶模組 (`/api/v1/users`)

- [ ] `GET /users/me` - 取得當前用戶資料
- [ ] `PUT /users/me` - 更新個人資料
- [ ] `PUT /users/me/password` - 更改密碼
- [ ] `DELETE /users/me` - 刪除帳號
- [ ] `PUT /users/me/preferences` - 偏好設定

### 2.3 願景模組 (`/api/v1/vision`)

- [ ] `POST /vision` - 建立願景
- [ ] `GET /vision` - 取得用戶願景
- [ ] `PUT /vision/:id` - 更新願景
- [ ] `DELETE /vision/:id` - 刪除願景
- [ ] 願景與目標關聯邏輯

### 2.4 目標模組 (`/api/v1/goals`)

- [ ] `POST /goals` - 建立目標
- [ ] `GET /goals` - 取得目標列表
- [ ] `GET /goals/:id` - 取得單一目標
- [ ] `PUT /goals/:id` - 更新目標
- [ ] `DELETE /goals/:id` - 刪除目標
- [ ] `PUT /goals/:id/order` - 調整順序
- [ ] 目標數量限制 (1-3 個)
- [ ] 目標進度計算

### 2.5 戰術模組 (`/api/v1/tactics`)

- [ ] `POST /tactics` - 建立戰術
- [ ] `GET /tactics` - 取得戰術列表 (可依目標篩選)
- [ ] `GET /tactics/:id` - 取得單一戰術
- [ ] `PUT /tactics/:id` - 更新戰術
- [ ] `DELETE /tactics/:id` - 刪除戰術
- [ ] `PUT /tactics/:id/order` - 調整順序
- [ ] 執行頻率處理邏輯

### 2.6 每週計劃模組 (`/api/v1/weekly`)

- [ ] `POST /weekly/generate` - 自動生成週任務
- [ ] `GET /weekly` - 取得本週計劃
- [ ] `GET /weekly/:weekNumber` - 取得指定週計劃
- [ ] `PUT /weekly/tasks/:id` - 更新任務狀態
- [ ] `PUT /weekly/tasks/:id/complete` - 標記完成
- [ ] `PUT /weekly/tasks/:id/schedule` - 設定時間區塊
- [ ] 任務自動生成邏輯 (基於戰術頻率)

### 2.7 計分卡模組 (`/api/v1/scorecard`)

- [ ] `GET /scorecard` - 取得計分卡總覽
- [ ] `GET /scorecard/week/:weekNumber` - 單週分數
- [ ] `GET /scorecard/trend` - 趨勢資料
- [ ] `GET /scorecard/cycle/:cycleId` - 週期統計
- [ ] 分數計算邏輯: (完成 / 計劃) × 100%
- [ ] 自動分數更新 (任務完成時)

### 2.8 週期模組 (`/api/v1/cycles`)

- [ ] `POST /cycles` - 開始新週期
- [ ] `GET /cycles` - 取得週期列表
- [ ] `GET /cycles/current` - 取得當前週期
- [ ] `GET /cycles/:id` - 取得週期詳情
- [ ] `PUT /cycles/:id/complete` - 完成週期
- [ ] 第 13 週邏輯處理
- [ ] 週期統計報告生成

---

## Phase 3: 進階功能與整合

### 3.1 問責模組 (`/api/v1/accountability`)

#### 夥伴管理
- [ ] `POST /accountability/invite` - 發送邀請
- [ ] `GET /accountability/invites` - 取得邀請列表
- [ ] `PUT /accountability/invites/:id/accept` - 接受邀請
- [ ] `PUT /accountability/invites/:id/decline` - 拒絕邀請
- [ ] `GET /accountability/partners` - 取得夥伴列表
- [ ] `DELETE /accountability/partners/:id` - 移除夥伴

#### 會議管理
- [ ] `POST /accountability/meetings` - 建立會議
- [ ] `GET /accountability/meetings` - 取得會議列表
- [ ] `GET /accountability/meetings/:id` - 會議詳情
- [ ] `PUT /accountability/meetings/:id` - 更新會議記錄
- [ ] `DELETE /accountability/meetings/:id` - 取消會議
- [ ] 會議提醒排程

### 3.2 行事曆整合 (`/api/v1/calendar`)

- [ ] `POST /calendar/connect/google` - 連結 Google Calendar
- [ ] `POST /calendar/connect/apple` - 連結 Apple Calendar
- [ ] `GET /calendar/connections` - 取得連結狀態
- [ ] `DELETE /calendar/disconnect/:provider` - 中斷連結
- [ ] `POST /calendar/sync` - 手動同步
- [ ] `GET /calendar/events` - 取得行事曆事件
- [ ] Google Calendar API 整合
- [ ] 雙向同步邏輯

### 3.3 推播通知 (`/api/v1/notifications`)

#### 設定管理
- [ ] `GET /notifications/settings` - 取得通知設定
- [ ] `PUT /notifications/settings` - 更新通知設定
- [ ] `POST /notifications/devices` - 註冊裝置
- [ ] `DELETE /notifications/devices/:token` - 移除裝置

#### 推播服務
- [ ] Firebase Admin SDK 整合 (FCM)
- [ ] APNs 整合 (iOS)
- [ ] 推播排程系統 (Cron Triggers)
- [ ] 通知類型定義
  - 每日任務提醒
  - 週分數報告
  - 問責會議提醒
  - 目標截止提醒

### 3.4 匯出功能 (`/api/v1/export`)

- [ ] `POST /export/pdf` - 生成 PDF 報告
- [ ] `POST /export/csv` - 生成 CSV 資料
- [ ] `GET /export/:id` - 下載匯出檔案
- [ ] PDF 模板設計
- [ ] R2 暫存檔案管理
- [ ] 匯出任務佇列

---

## Phase 4: 優化與部署

### 4.1 效能優化

- [ ] 查詢優化與索引調整
- [ ] N+1 查詢問題處理
- [ ] KV 快取策略實作
- [ ] 回應壓縮
- [ ] 冷啟動優化

### 4.2 安全性強化

- [ ] SQL Injection 防護確認
- [ ] XSS 防護
- [ ] CSRF Token (如需要)
- [ ] 敏感資料加密
- [ ] API Rate Limiting 調校
- [ ] 安全標頭設定

### 4.3 監控與日誌

- [ ] 錯誤追蹤 (Sentry)
- [ ] 請求日誌
- [ ] 效能監控
- [ ] 告警設定
- [ ] D1 查詢分析

### 4.4 測試

- [ ] 單元測試 (Vitest)
- [ ] API 整合測試
- [ ] 測試覆蓋率 > 80%
- [ ] 負載測試
- [ ] 安全性測試

### 4.5 部署與 CI/CD

- [ ] GitHub Actions 設定 (deploy-api.yml)
- [ ] 環境變數管理 (Secrets)
- [ ] D1 Migration 自動化
- [ ] Preview 環境 (develop branch)
- [ ] Production 環境 (main branch)
- [ ] 藍綠部署策略
- [ ] 回滾機制

### 4.6 健康檢查與維運

- [ ] `GET /api/v1/health` - 健康檢查端點
- [ ] `GET /api/v1/health/db` - 資料庫連線檢查
- [ ] Keep-alive Cron Job
- [ ] 備份策略實作
- [ ] 災難復原計劃

---

## API 路由總覽

```
/api/v1
├── /auth
│   ├── POST /register
│   ├── POST /login
│   ├── POST /logout
│   ├── POST /refresh
│   ├── POST /forgot-password
│   ├── POST /reset-password
│   ├── POST /verify-email
│   ├── POST /google
│   └── POST /apple
│
├── /users
│   ├── GET /me
│   ├── PUT /me
│   ├── PUT /me/password
│   ├── PUT /me/preferences
│   └── DELETE /me
│
├── /vision
│   ├── POST /
│   ├── GET /
│   ├── PUT /:id
│   └── DELETE /:id
│
├── /goals
│   ├── POST /
│   ├── GET /
│   ├── GET /:id
│   ├── PUT /:id
│   ├── PUT /:id/order
│   └── DELETE /:id
│
├── /tactics
│   ├── POST /
│   ├── GET /
│   ├── GET /:id
│   ├── PUT /:id
│   ├── PUT /:id/order
│   └── DELETE /:id
│
├── /weekly
│   ├── POST /generate
│   ├── GET /
│   ├── GET /:weekNumber
│   ├── PUT /tasks/:id
│   ├── PUT /tasks/:id/complete
│   └── PUT /tasks/:id/schedule
│
├── /scorecard
│   ├── GET /
│   ├── GET /week/:weekNumber
│   ├── GET /trend
│   └── GET /cycle/:cycleId
│
├── /cycles
│   ├── POST /
│   ├── GET /
│   ├── GET /current
│   ├── GET /:id
│   └── PUT /:id/complete
│
├── /accountability
│   ├── POST /invite
│   ├── GET /invites
│   ├── PUT /invites/:id/accept
│   ├── PUT /invites/:id/decline
│   ├── GET /partners
│   ├── DELETE /partners/:id
│   ├── POST /meetings
│   ├── GET /meetings
│   ├── GET /meetings/:id
│   ├── PUT /meetings/:id
│   └── DELETE /meetings/:id
│
├── /calendar
│   ├── POST /connect/google
│   ├── POST /connect/apple
│   ├── GET /connections
│   ├── DELETE /disconnect/:provider
│   ├── POST /sync
│   └── GET /events
│
├── /notifications
│   ├── GET /settings
│   ├── PUT /settings
│   ├── POST /devices
│   └── DELETE /devices/:token
│
├── /export
│   ├── POST /pdf
│   ├── POST /csv
│   └── GET /:id
│
└── /health
    ├── GET /
    └── GET /db
```

---

## 資料庫 Schema 設計

### users
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  name TEXT,
  avatar_url TEXT,
  provider TEXT,  -- 'email', 'google', 'apple'
  provider_id TEXT,
  email_verified INTEGER DEFAULT 0,
  timezone TEXT DEFAULT 'Asia/Taipei',
  language TEXT DEFAULT 'zh-TW',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### visions
```sql
CREATE TABLE visions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  type TEXT NOT NULL,  -- '3year', '10year'
  content TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### cycles
```sql
CREATE TABLE cycles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  status TEXT DEFAULT 'active',  -- 'active', 'completed'
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### goals
```sql
CREATE TABLE goals (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  cycle_id TEXT NOT NULL REFERENCES cycles(id),
  vision_id TEXT REFERENCES visions(id),
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### tactics
```sql
CREATE TABLE tactics (
  id TEXT PRIMARY KEY,
  goal_id TEXT NOT NULL REFERENCES goals(id),
  title TEXT NOT NULL,
  frequency_type TEXT NOT NULL,  -- 'daily', 'weekly', 'specific_days'
  frequency_days TEXT,  -- JSON array: [1,3,5] for Mon/Wed/Fri
  order_index INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### weekly_tasks
```sql
CREATE TABLE weekly_tasks (
  id TEXT PRIMARY KEY,
  tactic_id TEXT NOT NULL REFERENCES tactics(id),
  cycle_id TEXT NOT NULL REFERENCES cycles(id),
  week_number INTEGER NOT NULL,
  scheduled_date TEXT,
  scheduled_time_start TEXT,
  scheduled_time_end TEXT,
  status TEXT DEFAULT 'pending',  -- 'pending', 'completed', 'skipped'
  completed_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### scorecards
```sql
CREATE TABLE scorecards (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  cycle_id TEXT NOT NULL REFERENCES cycles(id),
  week_number INTEGER NOT NULL,
  planned_count INTEGER DEFAULT 0,
  completed_count INTEGER DEFAULT 0,
  score REAL DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, cycle_id, week_number)
);
```

---

## 優先級說明

| 優先級 | 說明 | 對應階段 |
|--------|------|----------|
| P0 | 必須完成 - MVP 核心 API | Phase 1-2 |
| P1 | 重要功能 - Beta 版本 | Phase 3 前半 |
| P2 | 加分功能 - 正式版本 | Phase 3 後半 |
| P3 | 未來迭代 | Phase 4 |

---

## 預估時程

| Phase | 預估週數 | 重點 |
|-------|----------|------|
| Phase 1 | 2 週 | 基礎架構、資料庫、認證 |
| Phase 2 | 5 週 | 核心 CRUD API |
| Phase 3 | 3 週 | 進階功能、第三方整合 |
| Phase 4 | 2 週 | 測試、優化、部署 |

**總計：12 週**
