# 12 Week Year App 技術棧文件

> 最後更新：2026-01-28

## 目錄

1. [技術架構總覽](#技術架構總覽)
2. [Frontend 技術棧](./frontend.md)
3. [Backend 技術棧](./backend.md)
4. [CI/CD Pipeline](./cicd.md)

---

## 技術架構總覽

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer                             │
├─────────────────────────────────────────────────────────────────┤
│  Mobile (React Native)        │  Web (Next.js 15)               │
│  - Expo SDK 52                │  - React 19                     │
│  - iOS 15.0+ / Android 12.0+  │  - TailwindCSS                  │
│  - React Native Paper         │  - Zustand + TanStack Query     │
│  - 共用業務邏輯與狀態管理     │                                 │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                     API Gateway Layer                           │
├─────────────────────────────────────────────────────────────────┤
│  Cloudflare Workers                                             │
│  - Hono Framework                                               │
│  - JWT Authentication                                           │
│  - Rate Limiting                                                │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Data Layer                                 │
├─────────────────────────────────────────────────────────────────┤
│  D1 (SQLite)    │  R2 (Object Storage)  │  KV (Key-Value Cache) │
│  - 主資料庫     │  - 使用者資料備份     │  - 快取               │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Third-Party Services                         │
├─────────────────────────────────────────────────────────────────┤
│  Google Calendar API  │  Apple Calendar   │  Push Notifications │
│  - 行事曆同步         │  - EventKit       │  - FCM / APNs       │
└─────────────────────────────────────────────────────────────────┘
```

## 技術選型原則

1. **Cross-Platform First**: 使用 React Native + Expo 實現 iOS/Android 共用程式碼
2. **Edge-First**: 使用 Cloudflare 全球邊緣網路，降低延遲
3. **Type-Safe**: 全面使用 TypeScript，前後端共享型別
4. **Offline-First**: 支援離線模式，自動同步
5. **DX (Developer Experience)**: 優化開發者體驗，快速迭代

## 版本資訊

| 類別 | 技術 | 版本 |
|------|------|------|
| **Runtime** | Node.js | 20.x |
| **Package Manager** | pnpm | 9.x |
| **Mobile Framework** | React Native | 0.76.x |
| **Mobile Toolchain** | Expo SDK | 52.x |
| **Web Framework** | Next.js | 15.x |
| **React** | React | 19.x |
| **Backend Framework** | Hono | 4.x |
| **Language** | TypeScript | 5.x |
| **Styling (Web)** | TailwindCSS | 3.4.x |
| **Styling (Mobile)** | React Native Paper | 5.x |
| **State Management** | Zustand | 5.x |
| **Server State** | TanStack Query | 5.x |

## Monorepo 結構

```
week12/
├── apps/
│   ├── mobile/              # React Native (Expo) App
│   └── web/                 # Next.js Web App
├── packages/
│   ├── shared/              # 共用業務邏輯
│   │   ├── types/           # TypeScript 型別定義
│   │   ├── hooks/           # 共用 Hooks
│   │   ├── stores/          # Zustand Stores
│   │   └── utils/           # 工具函式
│   └── api-client/          # API 客戶端
├── backend/                 # Cloudflare Workers API
└── docs/                    # 文件
```
