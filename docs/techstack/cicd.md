# CI/CD Pipeline

## 概覽

12 Week Year App 使用 GitHub Actions 實現自動化部署，包含 Mobile、Web 和 Backend 三個主要 Workflow：

```
┌─────────────────────────────────────────────────────────────────┐
│                    GitHub Actions Workflows                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │  deploy-web.yml │  │  deploy-api.yml │  │ deploy-mobile.  │ │
│  │                 │  │                 │  │      yml        │ │
│  │  Web 部署       │  │  Backend 部署   │  │  Mobile 部署    │ │
│  │  (Next.js)      │  │  (Hono API)     │  │  (Expo EAS)     │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐                      │
│  │    ci.yml       │  │  keep-alive.yml │                      │
│  │                 │  │                 │                      │
│  │  PR 檢查        │  │  Worker 保活    │                      │
│  │  (Lint/Test)    │  │  (每 5 分鐘)    │                      │
│  └─────────────────┘  └─────────────────┘                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. CI 檢查 (ci.yml)

### 觸發條件

```yaml
on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main, develop]
```

### 檢查流程

```
Pull Request / Push
        │
        ▼
┌───────────────────────────────────────┐
│           Job: lint-and-test          │
├───────────────────────────────────────┤
│  1. Checkout Code                     │
│  2. Setup pnpm 9 + Node.js 20         │
│  3. pnpm install --frozen-lockfile    │
│  4. pnpm lint (ESLint)                │
│  5. pnpm typecheck (tsc --noEmit)     │
│  6. pnpm test (Vitest)                │
└───────────────────────────────────────┘
```

---

## 2. Web 部署 (deploy-web.yml)

### 觸發條件

```yaml
on:
  push:
    branches: [main, develop]
    paths:
      - 'apps/web/**'
      - 'packages/**'
      - '.github/workflows/deploy-web.yml'
  workflow_dispatch:
```

### 部署流程

```
Push to apps/web/** or packages/**
        │
        ▼
┌───────────────────┐
│  Checkout Code    │
└───────────────────┘
        │
        ▼
┌───────────────────┐
│  Setup pnpm 9     │
│  Setup Node.js 20 │
└───────────────────┘
        │
        ▼
┌───────────────────┐
│  pnpm install     │
│  --frozen-lockfile│
└───────────────────┘
        │
        ▼
┌───────────────────┐
│  pnpm build:cf    │
│  (apps/web)       │
└───────────────────┘
        │
        ▼
┌───────────────────┐
│  Wrangler Deploy  │
│  to Cloudflare    │
└───────────────────┘
        │
        ▼ (main branch only)
┌───────────────────┐
│  Purge Cloudflare │
│  Cache            │
└───────────────────┘
```

### 環境變數配置

| 變數 | main 分支 | 其他分支 |
|------|-----------|----------|
| `NEXT_PUBLIC_API_URL` | `https://api.week12.app/api/v1` | `https://api-preview.week12.app/api/v1` |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | `true` | `false` |

---

## 3. Backend API 部署 (deploy-api.yml)

### 觸發條件

```yaml
on:
  push:
    branches: [main, develop]
    paths:
      - 'backend/**'
      - '.github/workflows/deploy-api.yml'
  workflow_dispatch:
    inputs:
      environment:
        type: choice
        options: [preview, production]
```

### 部署流程

```
Push to backend/**
        │
        ▼
┌─────────────────────────────────────────┐
│           Job: lint-and-typecheck       │
├─────────────────────────────────────────┤
│  1. Checkout                            │
│  2. Setup pnpm 9 + Node.js 20           │
│  3. pnpm install --frozen-lockfile      │
│  4. tsc --noEmit (Type Check)           │
└─────────────────────────────────────────┘
        │
        ▼ (on push/workflow_dispatch only)
┌─────────────────────────────────────────┐
│              Job: deploy                │
├─────────────────────────────────────────┤
│  1. Determine Environment               │
│     - main → production                 │
│     - develop → preview                 │
│                                         │
│  2. Wrangler Deploy                     │
│                                         │
│  3. Upload Secrets to Workers           │
│                                         │
│  4. Apply D1 Migrations                 │
│     - 最多重試 3 次                     │
│     - 重試間隔 10 秒                    │
└─────────────────────────────────────────┘
```

---

## 4. Mobile 部署 (deploy-mobile.yml)

### 觸發條件

```yaml
on:
  push:
    branches: [main]
    paths:
      - 'apps/mobile/**'
      - 'packages/**'
  workflow_dispatch:
    inputs:
      platform:
        type: choice
        options: [all, ios, android]
      profile:
        type: choice
        options: [preview, production]
```

### 部署流程

```
Push to apps/mobile/** or packages/**
        │
        ▼
┌─────────────────────────────────────────┐
│              Job: build                 │
├─────────────────────────────────────────┤
│  1. Checkout                            │
│  2. Setup pnpm 9 + Node.js 20           │
│  3. Setup Expo CLI                      │
│  4. pnpm install --frozen-lockfile      │
│  5. eas build --platform <platform>     │
│     --profile <profile> --non-interactive│
└─────────────────────────────────────────┘
        │
        ▼ (production profile + main branch)
┌─────────────────────────────────────────┐
│              Job: submit                │
├─────────────────────────────────────────┤
│  1. eas submit --platform ios           │
│     --latest --non-interactive          │
│  2. eas submit --platform android       │
│     --latest --non-interactive          │
└─────────────────────────────────────────┘
```

### EAS Build 配置

```json
// apps/mobile/eas.json
{
  "cli": {
    "version": ">= 13.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      }
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@email.com",
        "ascAppId": "123456789"
      },
      "android": {
        "serviceAccountKeyPath": "./google-play-key.json",
        "track": "internal"
      }
    }
  }
}
```

---

## 5. Worker Keep-Alive (keep-alive.yml)

### 用途

定期 ping Cloudflare Workers，保持 Worker 溫暖，減少冷啟動延遲。

### 觸發條件

```yaml
on:
  schedule:
    - cron: '*/5 * * * *'  # 每 5 分鐘
  workflow_dispatch:        # 手動觸發
```

### 健康檢查端點

| 端點 | 說明 |
|------|------|
| `https://week12.app/api/health` | Web Worker |
| `https://api.week12.app/health` | API Worker |

---

## GitHub Secrets 完整清單

### Cloudflare

| Secret 名稱 | 用途 | 必要性 |
|-------------|------|--------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare 部署權限 | 必要 |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare 帳戶 ID | 必要 |
| `CLOUDFLARE_ZONE_ID` | 快取清除用 | Web 必要 |

### Backend

| Secret 名稱 | 用途 | 必要性 |
|-------------|------|--------|
| `JWT_SECRET` | JWT 簽名密鑰 | 必要 |
| `JWT_REFRESH_SECRET` | Refresh Token 密鑰 | 必要 |
| `GOOGLE_CLIENT_ID` | Google OAuth | 必要 |
| `GOOGLE_CLIENT_SECRET` | Google OAuth | 必要 |
| `APPLE_CLIENT_ID` | Apple Sign In | iOS 必要 |
| `APPLE_TEAM_ID` | Apple Sign In | iOS 必要 |
| `APPLE_KEY_ID` | Apple Sign In | iOS 必要 |
| `APPLE_PRIVATE_KEY` | Apple Sign In (Base64) | iOS 必要 |
| `FIREBASE_SERVICE_ACCOUNT` | 推播通知 (Base64 JSON) | 選填 |

### Mobile (Expo EAS)

| Secret 名稱 | 用途 | 必要性 |
|-------------|------|--------|
| `EXPO_TOKEN` | Expo CLI 認證 | 必要 |
| `APPLE_ID` | Apple Developer 帳號 | iOS 必要 |
| `APPLE_ID_PASSWORD` | App-specific password | iOS 必要 |
| `ASC_API_KEY_ID` | App Store Connect API | iOS 必要 |
| `ASC_API_KEY_ISSUER_ID` | App Store Connect API | iOS 必要 |
| `ASC_API_KEY` | App Store Connect API (Base64) | iOS 必要 |
| `GOOGLE_PLAY_SERVICE_ACCOUNT` | Google Play 上傳 (Base64 JSON) | Android 必要 |

### Analytics

| Secret 名稱 | 用途 | 必要性 |
|-------------|------|--------|
| `GA_ID` | Google Analytics | 選填 |
| `SENTRY_DSN` | Sentry 錯誤追蹤 | 選填 |
| `SENTRY_AUTH_TOKEN` | Sentry 認證 | 選填 |
| `POSTHOG_KEY` | PostHog Analytics | 選填 |

---

## 部署環境對應

### Web

| 分支 | Worker 名稱 | Domain |
|------|-------------|--------|
| `main` | week12-web-production | week12.app |
| `develop` | week12-web-preview | preview.week12.app |

### Backend

| 分支 | Worker 名稱 | Domain | D1 |
|------|-------------|--------|-----|
| `main` | week12-api-production | api.week12.app | week12-db |
| `develop` | week12-api-preview | api-preview.week12.app | week12-db-preview |

### Mobile

| Profile | 用途 | 發佈通道 |
|---------|------|----------|
| `development` | 開發測試 | Expo Dev Client |
| `preview` | 內部測試 | TestFlight / Internal Testing |
| `production` | 正式發佈 | App Store / Play Store |

---

## 手動部署指令

### Web

```bash
cd apps/web

pnpm build:cf
wrangler deploy --env production    # 或 --env preview
```

### Backend

```bash
cd backend

pnpm deploy:production              # 或 pnpm deploy:preview

# 資料庫遷移
wrangler d1 migrations apply week12-db --remote --env production
```

### Mobile

```bash
cd apps/mobile

# 建置
eas build --platform all --profile preview
eas build --platform all --profile production

# 提交到商店
eas submit --platform ios --latest
eas submit --platform android --latest
```

---

## 故障排除

### D1 Migration 失敗

Migration 會自動重試 3 次，間隔 10 秒。如仍失敗：

1. 檢查 migration 檔案語法
2. 手動執行：`wrangler d1 migrations apply week12-db --remote --env production`

### EAS Build 失敗

1. 檢查 `eas.json` 配置
2. 確認 Expo Token 是否有效
3. 查看 EAS Build logs：`eas build:list`

### iOS 提交失敗

1. 確認 Apple Developer 帳號有效
2. 檢查 App Store Connect API Key 是否正確
3. 確認 App 的 Bundle ID 已在 App Store Connect 建立

### Android 提交失敗

1. 確認 Google Play Console 服務帳號權限
2. 檢查 Service Account JSON 是否正確
3. 確認 App 已在 Google Play Console 建立

### Secrets 未設定

檢查 GitHub Repository Settings → Secrets and variables → Actions

### 快取問題

Production 部署後會自動清除 Cloudflare 快取。如需手動清除：

```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/ZONE_ID/purge_cache" \
  -H "Authorization: Bearer CF_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'
```
