# Frontend 技術棧

## 概覽

12 Week Year App 採用 **React Native (Expo)** 開發行動端應用程式，並使用 **Next.js** 開發 Web 端。兩端共用核心業務邏輯、狀態管理與 API 客戶端。

---

## Mobile App (React Native + Expo)

### 核心框架

| 技術 | 版本 | 用途 |
|------|------|------|
| **React Native** | 0.76.x | 跨平台行動開發框架 |
| **Expo SDK** | 52.x | React Native 開發工具鏈 |
| **TypeScript** | 5.x | 型別安全 |

### UI 元件庫

| 技術 | 版本 | 用途 |
|------|------|------|
| **React Native Paper** | 5.x | Material Design 元件庫 |
| **React Native Reanimated** | 3.x | 高效能動畫 |
| **React Native Gesture Handler** | 2.x | 手勢處理 |
| **React Native SVG** | 15.x | SVG 支援 |
| **Lucide React Native** | 0.x | 圖示庫 |

### 導航

| 技術 | 版本 | 用途 |
|------|------|------|
| **Expo Router** | 4.x | 檔案式路由 (基於 React Navigation) |
| **React Navigation** | 7.x | 底層導航框架 |

### 狀態管理

| 技術 | 版本 | 用途 |
|------|------|------|
| **Zustand** | 5.x | 全域客戶端狀態 |
| **TanStack Query** | 5.x | 伺服器狀態管理與快取 |
| **MMKV** | 3.x | 高效能本地儲存 (取代 AsyncStorage) |

### 離線支援

| 技術 | 版本 | 用途 |
|------|------|------|
| **@tanstack/query-sync-storage-persister** | 5.x | 查詢快取持久化 |
| **WatermelonDB** | 0.27.x | 離線優先資料庫 (選用) |

### 行事曆整合

| 技術 | 版本 | 用途 |
|------|------|------|
| **expo-calendar** | ~13.x | 原生行事曆存取 |
| **@react-native-google-signin/google-signin** | 13.x | Google 登入 + Calendar API |

### 推播通知

| 技術 | 版本 | 用途 |
|------|------|------|
| **expo-notifications** | ~0.29.x | 推播通知 |
| **@react-native-firebase/messaging** | 21.x | Firebase Cloud Messaging |

### 認證

| 技術 | 版本 | 用途 |
|------|------|------|
| **expo-auth-session** | ~6.x | OAuth 2.0 流程 |
| **expo-apple-authentication** | ~7.x | Apple Sign In |
| **expo-secure-store** | ~14.x | 安全儲存 (JWT Token) |

### 效能監控

| 技術 | 版本 | 用途 |
|------|------|------|
| **Sentry React Native** | 6.x | 錯誤追蹤 |
| **expo-dev-client** | ~5.x | 開發工具 |

### Mobile 專案結構

```
apps/mobile/
├── app/                        # Expo Router 頁面
│   ├── (tabs)/                 # Tab 導航
│   │   ├── index.tsx           # 首頁儀表板
│   │   ├── plan.tsx            # 12週計劃
│   │   ├── weekly.tsx          # 每週計劃
│   │   ├── scorecard.tsx       # 計分卡
│   │   └── profile.tsx         # 個人設定
│   ├── (auth)/                 # 認證頁面
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── vision/                 # 願景頁面
│   ├── accountability/         # 問責夥伴
│   └── _layout.tsx             # 根 Layout
├── components/                 # React Native 元件
│   ├── ui/                     # 基礎 UI 元件
│   ├── goals/                  # 目標相關元件
│   ├── scorecard/              # 計分卡元件
│   └── shared/                 # 共用元件
├── constants/                  # 常數配置
├── assets/                     # 靜態資源
└── app.config.ts               # Expo 配置
```

---

## Web App (Next.js)

### 核心框架

| 技術 | 版本 | 用途 |
|------|------|------|
| **Next.js** | 15.x | React 全端框架，App Router |
| **React** | 19.x | UI 函式庫 |
| **TypeScript** | 5.x | 型別安全 |

### 樣式與 UI

| 技術 | 版本 | 用途 |
|------|------|------|
| **TailwindCSS** | 3.4.x | Utility-first CSS |
| **Radix UI** | 各元件獨立版本 | Headless UI 元件 |
| **Lucide React** | 0.x | 圖示庫 |
| **Framer Motion** | 12.x | 進階動畫 |
| **class-variance-authority** | 0.7.x | 元件變體管理 |
| **clsx** | 2.x | 條件式 className |
| **tailwind-merge** | 2.x | TailwindCSS class 合併 |

### 狀態管理 (與 Mobile 共用)

| 技術 | 版本 | 用途 |
|------|------|------|
| **Zustand** | 5.x | 全域客戶端狀態 |
| **TanStack Query** | 5.x | 伺服器狀態管理與快取 |

### 表單處理

| 技術 | 版本 | 用途 |
|------|------|------|
| **React Hook Form** | 7.x | 表單狀態管理 |
| **Zod** | 3.x | Schema 驗證 |
| **@hookform/resolvers** | 3.x | Zod 與 RHF 整合 |

### 行事曆整合

| 技術 | 版本 | 用途 |
|------|------|------|
| **googleapis** | 140.x | Google Calendar API |
| **@fullcalendar/react** | 6.x | 行事曆 UI 元件 |

### 圖表

| 技術 | 版本 | 用途 |
|------|------|------|
| **Recharts** | 2.x | 圖表庫 (執行分數趨勢圖) |

### 測試

| 技術 | 版本 | 用途 |
|------|------|------|
| **Vitest** | 3.x | 測試框架 |
| **@testing-library/react** | 16.x | React 測試工具 |
| **Playwright** | 1.x | E2E 測試 |

### 開發工具

| 技術 | 版本 | 用途 |
|------|------|------|
| **ESLint** | 9.x | 程式碼檢查 |
| **Prettier** | 3.x | 程式碼格式化 |
| **Biome** | 1.x | 快速 Linter/Formatter (選用) |

### 部署

| 技術 | 版本 | 用途 |
|------|------|------|
| **@opennextjs/cloudflare** | 1.x | Cloudflare Workers 適配器 |
| **Wrangler** | 4.x | Cloudflare CLI |

### Web 專案結構

```
apps/web/
├── app/                        # Next.js App Router 頁面
│   ├── api/                    # API routes
│   ├── (auth)/                 # 認證頁面
│   ├── dashboard/              # 首頁儀表板
│   ├── vision/                 # 願景頁面
│   ├── plan/                   # 12週計劃
│   ├── weekly/                 # 每週計劃
│   ├── scorecard/              # 計分卡
│   ├── accountability/         # 問責夥伴
│   ├── settings/               # 設定頁
│   └── layout.tsx              # 根 Layout
├── components/                 # React 元件
│   ├── ui/                     # 基礎 UI 元件 (Radix 封裝)
│   └── features/               # 功能元件
├── lib/                        # 工具函式
└── styles/                     # 全域樣式
```

---

## 共用套件 (packages/)

### packages/shared

```
packages/shared/
├── types/
│   ├── goal.ts                 # 目標相關型別
│   ├── tactic.ts               # 戰術型別
│   ├── scorecard.ts            # 計分卡型別
│   ├── user.ts                 # 使用者型別
│   └── index.ts
├── stores/
│   ├── goalStore.ts            # 目標狀態
│   ├── weeklyStore.ts          # 每週計劃狀態
│   ├── scorecardStore.ts       # 計分卡狀態
│   └── authStore.ts            # 認證狀態
├── hooks/
│   ├── useGoals.ts             # 目標 CRUD hooks
│   ├── useWeeklyPlan.ts        # 每週計劃 hooks
│   ├── useScorecard.ts         # 計分卡 hooks
│   └── useAuth.ts              # 認證 hooks
└── utils/
    ├── scoreCalculation.ts     # 執行分數計算
    ├── dateUtils.ts            # 日期工具 (12週計算)
    └── validation.ts           # Zod schemas
```

### packages/api-client

```
packages/api-client/
├── client.ts                   # Axios 客戶端配置
├── endpoints/
│   ├── auth.ts                 # 認證 API
│   ├── goals.ts                # 目標 API
│   ├── tactics.ts              # 戰術 API
│   ├── scorecard.ts            # 計分卡 API
│   └── accountability.ts       # 問責夥伴 API
└── types.ts                    # API 回應型別
```

---

## 常用指令

### Mobile

```bash
cd apps/mobile

pnpm start                      # 啟動 Expo 開發伺服器
pnpm ios                        # 啟動 iOS 模擬器
pnpm android                    # 啟動 Android 模擬器
pnpm build:ios                  # 建置 iOS (EAS Build)
pnpm build:android              # 建置 Android (EAS Build)
```

### Web

```bash
cd apps/web

pnpm dev                        # 啟動開發伺服器 (localhost:3000)
pnpm build                      # 建置生產版本
pnpm build:cf                   # 建置 Cloudflare Workers 版本
pnpm lint                       # 執行 ESLint
pnpm test                       # 執行測試
```

### Monorepo

```bash
# 根目錄
pnpm install                    # 安裝所有依賴
pnpm build                      # 建置所有專案
pnpm lint                       # Lint 所有專案
pnpm test                       # 測試所有專案
```
