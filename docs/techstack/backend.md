# Backend 技術棧

## 核心框架

| 技術 | 版本 | 用途 |
|------|------|------|
| **Hono** | 4.x | 輕量級 Web 框架 |
| **TypeScript** | 5.x | 型別安全 |
| **Cloudflare Workers** | - | Serverless Runtime |

## 資料庫與儲存

| 技術 | 用途 | 說明 |
|------|------|------|
| **Cloudflare D1** | 主資料庫 | SQLite 相容，邊緣分佈式 |
| **Cloudflare R2** | 物件儲存 | S3 相容，用於備份/匯出 |
| **Cloudflare KV** | 快取 | Key-Value 儲存 |

## 認證與安全

| 技術 | 版本 | 用途 |
|------|------|------|
| **jose** | 5.x | JWT 簽發與驗證 |
| **Zod** | 3.x | 請求驗證 |
| **@hono/zod-validator** | 0.x | Hono Zod 整合 |

## 第三方整合

| 技術 | 用途 |
|------|------|
| **Google Calendar API** | 行事曆同步 |
| **Firebase Admin SDK** | 推播通知 (FCM) |
| **APNs** | iOS 推播通知 |

## 工具函式庫

| 技術 | 版本 | 用途 |
|------|------|------|
| **date-fns** | 3.x | 日期處理 |
| **nanoid** | 5.x | 唯一 ID 生成 |

## 開發工具

| 技術 | 版本 | 用途 |
|------|------|------|
| **Wrangler** | 4.x | Cloudflare CLI |
| **@cloudflare/workers-types** | 4.x | TypeScript 型別 |
| **Vitest** | 3.x | 測試框架 |

## 專案結構

```
backend/
├── src/
│   ├── index.ts            # 主入口點與路由
│   ├── types.ts            # TypeScript 型別定義
│   ├── db/                 # 資料庫 Schema
│   │   └── schema.sql
│   ├── middleware/         # 中介軟體
│   │   ├── auth.ts         # JWT 認證
│   │   ├── rateLimit.ts    # 請求限流
│   │   └── cors.ts         # CORS 配置
│   ├── routes/             # API 路由處理器
│   │   ├── auth.ts         # 認證相關
│   │   ├── goals.ts        # 目標 CRUD
│   │   ├── tactics.ts      # 戰術 CRUD
│   │   ├── weekly.ts       # 每週計劃
│   │   ├── scorecard.ts    # 計分卡
│   │   ├── vision.ts       # 願景
│   │   ├── accountability.ts # 問責夥伴
│   │   ├── calendar.ts     # 行事曆整合
│   │   └── notifications.ts # 推播通知
│   └── utils/              # 工具函式
│       ├── scoreCalculation.ts # 執行分數計算
│       └── dateUtils.ts    # 12 週日期計算
├── migrations/             # D1 資料庫遷移
├── wrangler.toml           # Cloudflare Workers 配置
└── vitest.config.ts        # 測試配置
```

## API 路由結構

```
/api/v1
├── /auth                       # 認證相關
│   ├── POST /login             # 登入
│   ├── POST /register          # 註冊
│   ├── POST /google            # Google OAuth
│   ├── POST /apple             # Apple Sign In
│   ├── POST /refresh           # Token 刷新
│   └── POST /logout            # 登出
│
├── /users                      # 使用者管理
│   ├── GET /me                 # 取得當前使用者
│   ├── PATCH /me               # 更新個人資料
│   └── DELETE /me              # 刪除帳號
│
├── /vision                     # 願景
│   ├── GET /                   # 取得願景
│   └── PUT /                   # 更新願景
│
├── /goals                      # 12 週目標
│   ├── GET /                   # 目標列表
│   ├── POST /                  # 建立目標
│   ├── GET /:id                # 取得單一目標
│   ├── PUT /:id                # 更新目標
│   └── DELETE /:id             # 刪除目標
│
├── /tactics                    # 戰術
│   ├── GET /                   # 戰術列表 (依目標篩選)
│   ├── POST /                  # 建立戰術
│   ├── GET /:id                # 取得單一戰術
│   ├── PUT /:id                # 更新戰術
│   ├── DELETE /:id             # 刪除戰術
│   └── PATCH /:id/complete     # 標記完成
│
├── /weekly                     # 每週計劃
│   ├── GET /current            # 取得當週計劃
│   ├── GET /:weekNumber        # 取得指定週計劃
│   ├── POST /tasks             # 建立任務
│   ├── PATCH /tasks/:id        # 更新任務狀態
│   └── GET /tasks              # 任務列表
│
├── /scorecard                  # 計分卡
│   ├── GET /current            # 當週計分卡
│   ├── GET /history            # 歷史計分卡
│   ├── GET /trend              # 趨勢數據
│   └── POST /calculate         # 手動計算分數
│
├── /accountability             # 問責夥伴
│   ├── GET /partners           # 夥伴列表
│   ├── POST /invite            # 邀請夥伴
│   ├── POST /accept/:id        # 接受邀請
│   ├── DELETE /partners/:id    # 移除夥伴
│   ├── GET /meetings           # 會議記錄
│   └── POST /meetings          # 建立會議記錄
│
├── /calendar                   # 行事曆
│   ├── POST /connect/google    # 連結 Google Calendar
│   ├── POST /connect/apple     # 連結 Apple Calendar
│   ├── GET /events             # 取得事件
│   ├── POST /sync              # 同步任務到行事曆
│   └── DELETE /disconnect      # 斷開連結
│
├── /notifications              # 通知
│   ├── POST /register-device   # 註冊裝置 Token
│   ├── GET /settings           # 通知設定
│   └── PUT /settings           # 更新通知設定
│
├── /export                     # 資料匯出
│   ├── GET /pdf                # 匯出 PDF 報告
│   └── GET /csv                # 匯出 CSV 資料
│
└── /health                     # 健康檢查
```

## 資料庫 Schema 設計

```sql
-- 使用者
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    avatar_url TEXT,
    auth_provider TEXT NOT NULL,       -- 'google', 'apple', 'email'
    password_hash TEXT,
    timezone TEXT DEFAULT 'Asia/Taipei',
    notification_enabled BOOLEAN DEFAULT true,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 願景
CREATE TABLE visions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    long_term_vision TEXT,             -- 長期願景 (10年)
    mid_term_vision TEXT,              -- 中期願景 (3年)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 12週目標
CREATE TABLE goals (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    cycle_id TEXT NOT NULL,            -- 12週週期 ID
    title TEXT NOT NULL,
    description TEXT,
    target_metric TEXT,                -- 目標指標描述
    target_value REAL,                 -- 目標數值
    current_value REAL DEFAULT 0,
    status TEXT DEFAULT 'active',      -- 'active', 'completed', 'abandoned'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 戰術 (達成目標的具體行動)
CREATE TABLE tactics (
    id TEXT PRIMARY KEY,
    goal_id TEXT NOT NULL REFERENCES goals(id),
    title TEXT NOT NULL,
    description TEXT,
    frequency TEXT NOT NULL,           -- 'daily', 'weekly', 'specific'
    frequency_count INTEGER DEFAULT 1, -- 每週/每日次數
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 每週任務
CREATE TABLE weekly_tasks (
    id TEXT PRIMARY KEY,
    tactic_id TEXT NOT NULL REFERENCES tactics(id),
    user_id TEXT NOT NULL REFERENCES users(id),
    week_number INTEGER NOT NULL,      -- 1-12
    cycle_id TEXT NOT NULL,
    status TEXT DEFAULT 'pending',     -- 'pending', 'completed', 'skipped'
    completed_at DATETIME,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 計分卡
CREATE TABLE scorecards (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    cycle_id TEXT NOT NULL,
    week_number INTEGER NOT NULL,
    planned_tasks INTEGER NOT NULL,
    completed_tasks INTEGER NOT NULL,
    execution_score REAL NOT NULL,     -- (completed / planned) * 100
    reflection TEXT,                   -- 每週反思
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 12週週期
CREATE TABLE cycles (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT DEFAULT 'active',      -- 'active', 'completed'
    final_score REAL,                  -- 12週平均執行分數
    review_notes TEXT,                 -- 第13週回顧
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 問責夥伴
CREATE TABLE accountability_partners (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    partner_id TEXT NOT NULL REFERENCES users(id),
    status TEXT DEFAULT 'pending',     -- 'pending', 'accepted', 'rejected'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 問責會議記錄
CREATE TABLE accountability_meetings (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    partner_id TEXT REFERENCES users(id),
    cycle_id TEXT NOT NULL,
    week_number INTEGER NOT NULL,
    meeting_date DATETIME,
    commitments TEXT,                  -- 本週承諾 (JSON)
    review_notes TEXT,                 -- 上週回顧
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 裝置 Token (推播通知)
CREATE TABLE device_tokens (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    token TEXT NOT NULL,
    platform TEXT NOT NULL,            -- 'ios', 'android', 'web'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 通知設定
CREATE TABLE notification_settings (
    user_id TEXT PRIMARY KEY REFERENCES users(id),
    daily_reminder BOOLEAN DEFAULT true,
    daily_reminder_time TIME DEFAULT '09:00',
    weekly_review BOOLEAN DEFAULT true,
    weekly_review_day INTEGER DEFAULT 0,  -- 0 = Sunday
    partner_activity BOOLEAN DEFAULT true
);

-- 索引
CREATE INDEX idx_goals_user_cycle ON goals(user_id, cycle_id);
CREATE INDEX idx_tactics_goal ON tactics(goal_id);
CREATE INDEX idx_weekly_tasks_user_week ON weekly_tasks(user_id, cycle_id, week_number);
CREATE INDEX idx_scorecards_user_cycle ON scorecards(user_id, cycle_id);
```

## 環境配置

### Cloudflare Bindings

```toml
# wrangler.toml
[vars]
ENVIRONMENT = "production"

[[d1_databases]]
binding = "DB"
database_name = "week12-db"

[[r2_buckets]]
binding = "STORAGE"
bucket_name = "week12-storage"

[[kv_namespaces]]
binding = "CACHE"
```

### 環境變數 (Secrets)

| 變數名稱 | 說明 |
|----------|------|
| `JWT_SECRET` | JWT 簽名密鑰 |
| `JWT_REFRESH_SECRET` | Refresh Token 密鑰 |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret |
| `APPLE_CLIENT_ID` | Apple Sign In Client ID |
| `APPLE_TEAM_ID` | Apple Team ID |
| `APPLE_KEY_ID` | Apple Key ID |
| `APPLE_PRIVATE_KEY` | Apple Sign In Private Key |
| `FIREBASE_SERVICE_ACCOUNT` | Firebase Admin SDK 憑證 (JSON) |

## 部署環境

| 環境 | Worker 名稱 | Domain | D1 Database |
|------|-------------|--------|-------------|
| **Production** | week12-api-production | api.week12.app | week12-db |
| **Preview** | week12-api-preview | api-preview.week12.app | week12-db-preview |

## 常用指令

```bash
cd backend

pnpm dev                           # 啟動本地開發伺服器
pnpm deploy:preview                # 部署到 Preview 環境
pnpm deploy:production             # 部署到 Production 環境

# 資料庫操作
pnpm db:migrate                    # 執行本地遷移
pnpm db:migrate:remote             # 執行遠端遷移
wrangler d1 migrations create week12-db <migration_name>  # 建立新遷移
```

## 效能最佳化

1. **Edge Computing**: Cloudflare 全球 300+ 邊緣節點，低延遲
2. **D1 Read Replicas**: 讀取自動複製到最近節點
3. **KV Cache**: 熱門資料快取 (如：計分卡歷史)
4. **批次操作**: 支援批次任務完成，減少 API 呼叫

## 執行分數計算邏輯

```typescript
// utils/scoreCalculation.ts
export function calculateExecutionScore(
  completedTasks: number,
  plannedTasks: number
): number {
  if (plannedTasks === 0) return 0;
  return Math.round((completedTasks / plannedTasks) * 100);
}

export function calculate12WeekAverage(
  weeklyScores: number[]
): number {
  if (weeklyScores.length === 0) return 0;
  const sum = weeklyScores.reduce((a, b) => a + b, 0);
  return Math.round(sum / weeklyScores.length);
}

// 執行分數等級
// 85%+ = 優秀 (綠色)
// 70-84% = 良好 (藍色)
// 60-69% = 待改進 (黃色)
// <60% = 需要調整 (紅色)
```
