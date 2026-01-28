# 前端任務清單 (Frontend Tasks)

> 基於 12 Week Year App PRD 與技術棧文件規劃

**設計規範參考**: [設計系統文件](../design-system.md)

## 目錄
- [Phase 1: 專案基礎建設](#phase-1-專案基礎建設)
- [Phase 2: 核心功能模組](#phase-2-核心功能模組)
- [Phase 3: 進階功能](#phase-3-進階功能)
- [Phase 4: 優化與上線](#phase-4-優化與上線)

---

## Phase 1: 專案基礎建設

### 1.1 Monorepo 專案初始化
- [ ] 建立 pnpm workspace 結構
- [ ] 設定 `apps/web` (Next.js 15)
- [ ] 設定 `apps/mobile` (Expo SDK 52)
- [ ] 建立 `packages/shared` 共用程式碼
- [ ] 設定 `packages/ui` 共用元件庫
- [ ] 配置 TypeScript 5.x 與路徑別名
- [ ] 設定 ESLint + Prettier 規則

### 1.2 Web 專案設置 (Next.js)
- [ ] 初始化 Next.js 15 + React 19
- [ ] 配置 TailwindCSS 4.x
- [ ] 整合 tw-animate-css 動畫庫
- [ ] 整合 Radix UI 元件庫
- [ ] 設定 Framer Motion 動畫
- [ ] 配置 @opennextjs/cloudflare 適配器
- [ ] 設定環境變數管理

### 1.2.1 設計系統整合 (Web)
- [ ] 配置 OKLCH 顏色變數 (參考 [設計系統](../design-system.md#顏色系統))
- [ ] 設定字體: Noto Sans TC + Anonymous Pro
- [ ] 建立排版樣式 (heading-xl/lg/md/sm, body-lg/md/sm)
- [ ] 配置動畫系統 (fade, slide, float, stamp 等)
- [ ] 設定深色模式切換
- [ ] 建立 Container 響應式佈局

### 1.3 Mobile 專案設置 (React Native + Expo)
- [ ] 初始化 Expo SDK 52 專案
- [ ] 配置 React Native Paper 5.x
- [ ] 設定 Expo Router 4.x 檔案式路由
- [ ] 整合 Reanimated 3.x 動畫庫
- [ ] 配置 Gesture Handler 2.x
- [ ] 設定 app.json / app.config.ts

### 1.4 狀態管理與資料獲取
- [ ] 設定 Zustand 5.x 全局狀態
- [ ] 配置 TanStack Query 5.x
- [ ] 建立 API Client (axios/fetch wrapper)
- [ ] 設定請求攔截器 (JWT token)
- [ ] 實作錯誤處理機制

### 1.5 本地儲存 (Mobile)
- [ ] 整合 MMKV 3.x 高效能儲存
- [ ] 實作 token 安全儲存
- [ ] 建立快取策略
- [ ] 評估 WatermelonDB 離線支援需求

### 1.6 共用層 (packages/shared)
- [ ] 建立 packages/shared 目錄結構
- [ ] 定義 API 回應型別 (ApiResponse, PaginatedResponse)
- [ ] 定義業務實體型別 (User, Vision, Goal, Tactic, Task, Scorecard)
- [ ] 建立共用 Zod Schema (驗證規則)
- [ ] 定義錯誤碼常數 (ErrorCode enum)
- [ ] 定義狀態碼常數 (TaskStatus, CycleStatus 等)
- [ ] 建立日期格式化工具
- [ ] 建立分數計算工具函式

### 1.7 API 契約與 Mock
- [ ] 定義 OpenAPI/Swagger 規格
- [ ] 設定 openapi-typescript 自動生成型別
- [ ] 整合 MSW (Mock Service Worker) 開發用
- [ ] 建立 API Mock 資料

### 1.8 通用 UI 元件
- [ ] Error Boundary 錯誤邊界元件
- [ ] Loading Spinner / Skeleton 元件
- [ ] Empty State 空狀態元件
- [ ] Toast / Snackbar 通知元件
- [ ] Confirmation Dialog 確認對話框
- [ ] Pull to Refresh 下拉刷新 (Mobile)

---

## Phase 2: 核心功能模組

### 2.1 Onboarding 新手引導

#### Web
- [ ] 歡迎頁面設計
- [ ] 12 Week Year 方法論介紹
- [ ] 功能導覽 (Product Tour)
- [ ] 首次願景設定引導

#### Mobile
- [ ] 歡迎畫面 (App Intro Slider)
- [ ] 方法論介紹輪播
- [ ] 權限請求說明 (通知、行事曆)
- [ ] 首次設定引導流程

### 2.2 認證模組 (Authentication)

#### Web
- [ ] 建立登入頁面 UI
- [ ] 建立註冊頁面 UI
- [ ] 實作 Email/Password 認證
- [ ] 整合 Google OAuth
- [ ] 整合 Apple Sign-In
- [ ] 實作忘記密碼流程
- [ ] JWT Token 管理
- [ ] 自動登出 (Token 過期)

#### Mobile
- [ ] 建立登入畫面 UI
- [ ] 建立註冊畫面 UI
- [ ] 整合 expo-auth-session (Google)
- [ ] 整合 expo-apple-authentication
- [ ] 實作生物辨識登入 (Face ID / Touch ID)
- [ ] Secure Store Token 管理

### 2.3 願景設定模組 (Vision)

#### 共用邏輯
- [ ] 定義 Vision 資料型別
- [ ] 建立 Vision API hooks
- [ ] 實作表單驗證 (Zod schema)

#### Web
- [ ] 願景設定頁面 UI
- [ ] 3 年願景輸入表單
- [ ] 10 年願景輸入表單
- [ ] 願景與目標關聯展示
- [ ] 願景編輯功能

#### Mobile
- [ ] 願景設定畫面 UI
- [ ] 引導式願景建立流程
- [ ] 願景卡片展示
- [ ] 願景編輯功能

### 2.4 12 週目標模組 (Goals)

#### 共用邏輯
- [ ] 定義 Goal 資料型別
- [ ] 建立 Goal CRUD hooks
- [ ] 目標進度計算邏輯

#### Web
- [ ] 目標列表頁面
- [ ] 新增目標表單 (1-3 個目標限制)
- [ ] 目標詳情頁面
- [ ] 目標進度視覺化
- [ ] 目標編輯/刪除功能
- [ ] 拖拉排序功能

#### Mobile
- [ ] 目標列表畫面
- [ ] 新增目標表單
- [ ] 目標詳情畫面
- [ ] 進度環形圖展示
- [ ] 滑動操作 (編輯/刪除)

### 2.5 戰術模組 (Tactics)

#### 共用邏輯
- [ ] 定義 Tactic 資料型別
- [ ] 建立 Tactic CRUD hooks
- [ ] 執行頻率邏輯 (每日/每週/特定日)

#### Web
- [ ] 戰術列表 (依目標分組)
- [ ] 新增戰術表單
- [ ] 執行頻率設定 UI
- [ ] 戰術拖拉排序

#### Mobile
- [ ] 戰術列表畫面
- [ ] 新增戰術表單
- [ ] 頻率選擇器元件
- [ ] 批次操作功能

### 2.6 每週計劃模組 (Weekly Plan)

#### 共用邏輯
- [ ] 定義 WeeklyTask 資料型別
- [ ] 自動任務生成邏輯 (基於戰術頻率)
- [ ] 任務完成狀態管理

#### Web
- [ ] 週計劃總覽頁面
- [ ] 任務清單 (可勾選)
- [ ] 時間區塊規劃視圖
- [ ] 任務拖拉至時段
- [ ] 本週/歷史週切換

#### Mobile
- [ ] 週計劃畫面
- [ ] 任務清單元件
- [ ] 快速完成 (Swipe to complete)
- [ ] 日/週視圖切換
- [ ] 時間區塊規劃

### 2.7 計分卡模組 (Scorecard)

#### 共用邏輯
- [ ] 計分公式實作: (完成任務 / 計劃任務) × 100%
- [ ] 週分數計算
- [ ] 趨勢資料處理

#### Web
- [ ] 計分卡總覽頁面
- [ ] 分數趨勢圖 (Recharts)
- [ ] 週分數詳情
- [ ] 歷史分數查看
- [ ] 分數目標設定

#### Mobile
- [ ] 計分卡畫面
- [ ] 分數圓形進度條
- [ ] 趨勢圖表元件
- [ ] 分數通知

---

## Phase 3: 進階功能

### 3.1 夥伴模組 (Partners)

#### Web
- [ ] 夥伴搜尋/邀請功能
- [ ] 夥伴列表管理
- [ ] WAM 會議排程
- [ ] 會議記錄表單
- [ ] 夥伴進度共享視圖

#### Mobile
- [ ] 夥伴邀請畫面
- [ ] 夥伴列表
- [ ] 會議提醒通知
- [ ] 會議筆記功能
- [ ] 深度連結邀請

### 3.2 行事曆整合 (Calendar Integration)

#### Web
- [ ] 整合 @fullcalendar/react 6.x
- [ ] Google Calendar OAuth 流程
- [ ] 日曆視圖元件
- [ ] 任務同步至 Google Calendar
- [ ] 雙向同步狀態

#### Mobile
- [ ] 整合 expo-calendar
- [ ] Google Calendar 連結 (@react-native-google-signin)
- [ ] Apple Calendar 連結
- [ ] 任務自動同步
- [ ] 日曆權限處理

### 3.3 推播通知 (Push Notifications)

#### Web
- [ ] Web Push API 整合
- [ ] 通知權限請求
- [ ] 通知偏好設定頁

#### Mobile
- [ ] 整合 expo-notifications
- [ ] Firebase Cloud Messaging 設定
- [ ] APNs 設定 (iOS)
- [ ] 通知偏好設定畫面
- [ ] 前台通知處理
- [ ] 通知點擊導航

### 3.4 第 13 週模組 (Week 13)

#### Web
- [ ] 12 週回顧報告頁面
- [ ] 成就視覺化展示
- [ ] 下週期規劃引導
- [ ] 慶祝動畫效果

#### Mobile
- [ ] 回顧報告畫面
- [ ] 成就分享功能
- [ ] 慶祝動畫 (Reanimated)
- [ ] 新週期啟動流程

### 3.5 匯出功能 (Export)

#### Web
- [ ] PDF 報告生成
- [ ] CSV 資料匯出
- [ ] 報告自訂選項
- [ ] 下載進度指示

#### Mobile
- [ ] PDF 報告生成
- [ ] 分享至其他 App
- [ ] 匯出格式選擇

---

## Phase 4: 優化與上線

### 4.1 UI/UX 優化

#### Web
- [ ] 響應式設計 (RWD)
- [ ] 深色模式實作
- [ ] 骨架屏 (Skeleton)
- [ ] 載入動畫優化
- [ ] 無障礙設計 (a11y)
- [ ] 離線狀態提示 Banner
- [ ] 網路恢復自動同步提示

#### Mobile
- [ ] 深色模式實作
- [ ] 載入狀態優化
- [ ] 手勢操作優化
- [ ] 動畫效能調校
- [ ] 各裝置尺寸適配
- [ ] 離線模式 UI 指示
- [ ] 離線資料暫存提示
- [ ] 同步衝突解決 UI

### 4.2 多語言支援 (i18n)

- [ ] 設定 i18n 框架 (react-i18next)
- [ ] 繁體中文語系
- [ ] 英文語系
- [ ] 語言切換功能
- [ ] 日期/數字格式化

### 4.3 效能優化

#### Web
- [ ] 程式碼分割 (Code Splitting)
- [ ] 圖片優化 (Next/Image)
- [ ] 靜態頁面生成 (SSG)
- [ ] Lighthouse 分數優化
- [ ] Bundle 大小分析

#### Mobile
- [ ] App 啟動時間優化
- [ ] 列表虛擬化 (FlashList)
- [ ] 圖片快取優化
- [ ] 記憶體使用監控
- [ ] Hermes 引擎確認

### 4.4 測試

#### Web
- [ ] 單元測試 (Vitest)
- [ ] 元件測試 (Testing Library)
- [ ] E2E 測試 (Playwright)
- [ ] 測試覆蓋率 > 80%

#### Mobile
- [ ] 單元測試 (Jest)
- [ ] 元件測試 (Testing Library)
- [ ] E2E 測試 (Detox)
- [ ] 測試覆蓋率目標

### 4.5 上線準備

#### Web
- [ ] Cloudflare Pages 部署設定
- [ ] 環境變數配置
- [ ] 錯誤監控 (Sentry)
- [ ] 分析追蹤 (Analytics)

#### Mobile
- [ ] EAS Build 設定
- [ ] App Store 資料準備
- [ ] Play Store 資料準備
- [ ] App Icon / Splash Screen
- [ ] 隱私政策 / 使用條款
- [ ] TestFlight / Internal Testing
- [ ] 正式版本提交

---

## 優先級說明

| 優先級 | 說明 | 對應階段 |
|--------|------|----------|
| P0 | 必須完成 - MVP 核心功能 | Phase 1-2 |
| P1 | 重要功能 - Beta 版本 | Phase 3 前半 |
| P2 | 加分功能 - 正式版本 | Phase 3 後半 |
| P3 | 未來迭代 | Phase 4 |

---

## 預估時程

| Phase | 預估週數 | 重點 |
|-------|----------|------|
| Phase 1 | 2 週 | 專案架構、基礎元件 |
| Phase 2 | 5 週 | 核心功能開發 |
| Phase 3 | 3 週 | 進階功能、整合 |
| Phase 4 | 2 週 | 測試、優化、多語言、部署 |

**總計：12 週 (符合 12 Week Year 精神)**
