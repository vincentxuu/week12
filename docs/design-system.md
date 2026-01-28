# 設計系統 (Design System)

> 12 Week Year App UI/UX 設計規範

## 目錄
- [技術棧](#技術棧)
- [顏色系統](#顏色系統)
- [排版系統](#排版系統)
- [動畫系統](#動畫系統)
- [元件規範](#元件規範)
- [響應式設計](#響應式設計)

---

## 技術棧

| 項目 | 技術 |
|------|------|
| CSS 框架 | TailwindCSS 4.x |
| 動畫庫 | tw-animate-css |
| 排版插件 | @tailwindcss/typography |
| 字體 | Noto Sans TC, Anonymous Pro (monospace) |

---

## 顏色系統

### Primary 主色調

品牌主色系，用於重要按鈕、連結、強調元素。

| Token | OKLCH 值 | 用途 |
|-------|----------|------|
| `--primary-palest` | `oklch(0.984 0.009 197)` | 最淺背景 |
| `--primary-pale` | `oklch(0.974 0.012 197)` | 淺色背景 |
| `--primary-lightest` | `oklch(0.953 0.024 196.8)` | 輕背景 |
| `--primary-lighter` | `oklch(0.836 0.08 192.7)` | 淺色 |
| `--primary-base` | `oklch(0.711 0.12 190.6)` | **主色** |
| `--primary-darker` | `oklch(0.445 0.056 192)` | 深色 |

```css
/* 使用範例 */
.button-primary {
  background-color: var(--primary-base);
  color: white;
}
.button-primary:hover {
  background-color: var(--primary-darker);
}
```

### Basic 基礎色

用於文字、邊框、背景等基礎元素。

| Token | OKLCH 值 | 用途 |
|-------|----------|------|
| `--basic-white` | `oklch(1 0 89.9)` | 純白 |
| `--basic-100` | `oklch(0.964 0 89.9)` | 最淺灰 |
| `--basic-200` | `oklch(0.891 0 89.9)` | 淺灰 |
| `--basic-300` | `oklch(0.675 0.008 219.6)` | 中灰 |
| `--basic-400` | `oklch(0.483 0.019 221.3)` | 深灰 |
| `--basic-500` | `oklch(0.335 0.023 209.6)` | 更深灰 |
| `--basic-600` | `oklch(0.287 0.041 210.8)` | 暗灰 |
| `--basic-black` | `oklch(0.175 0.028 203.4)` | 純黑 |

### Semantic 語意色

| Token | OKLCH 值 | 用途 |
|-------|----------|------|
| `--success` | `oklch(0.763 0.172 132.6)` | 成功、完成 |
| `--tips` | `oklch(0.766 0.169 60)` | 提示、警告 |
| `--destructive` | `oklch(0.577 0.245 27.325)` | 錯誤、刪除 |
| `--red` | `oklch(0.706 0.197 45.6)` | 警示紅 |

### Mascot 吉祥物色

| Token | OKLCH 值 |
|-------|----------|
| `--mascot-aqua` | `oklch(0.896 0.085 213.8)` |
| `--mascot-bright-blue` | `oklch(0.86 0.131 209.2)` |

### Logo 品牌色

| Token | OKLCH 值 |
|-------|----------|
| `--logo-cyan` | `oklch(0.711 0.12 190.6)` |
| `--logo-orange` | `oklch(0.786 0.17 68.2)` |
| `--logo-yellow` | `oklch(0.908 0.186 102.5)` |
| `--logo-gray` | `oklch(0.483 0.019 221.3)` |

### 背景色

| Token | OKLCH 值 | 用途 |
|-------|----------|------|
| `--bg-dark` | `oklch(0.287 0.041 210.8)` | 深色背景 |
| `--bg-gray` | `oklch(0.932 0.007 185.3)` | 灰色背景 |
| `--very-light-gray` | `oklch(0.972 0.0021 197.1)` | 極淺灰 |
| `--very-light-blue` | `oklch(0.992 0.011 182.9)` | 極淺藍 |

---

## 排版系統

### 字體家族

```css
--font-sans: "Noto Sans TC", ui-sans-serif, system-ui, sans-serif;
```

Monospace 字體（用於程式碼、數字）：
```css
.anonymous-pro {
  font-family: "Anonymous Pro", monospace;
}
```

### Heading 標題

| Class | 字級 | 行高 | 字重 |
|-------|------|------|------|
| `.heading-xl` | 2.25rem (36px) | 140% | Bold |
| `.heading-lg` | 1.75rem (28px) | 140% | Bold |
| `.heading-md` | 1.375rem (22px) | 140% | Bold |
| `.heading-sm` | 1.125rem (18px) | 140% | Bold |

### Body 內文

| Class | 字級 | 行高 | 字重 |
|-------|------|------|------|
| `.body-lg` | 1.125rem (18px) | 140% | Regular |
| `.body-md` | 1rem (16px) | 140% | Regular |
| `.body-sm` | 0.875rem (14px) | 140% | Regular |

### 使用範例

```html
<h1 class="heading-xl">12 Week Year</h1>
<h2 class="heading-lg">你的願景</h2>
<p class="body-md">設定你的 12 週目標...</p>
<span class="body-sm text-muted-foreground">上次更新：2 小時前</span>
```

---

## 動畫系統

### 動畫時長

| Token | 時長 |
|-------|------|
| `--animate-duration-200` | 200ms |
| `--animate-duration-300` | 300ms |
| `--animate-duration-500` | 500ms |
| `--animate-duration-700` | 700ms |
| `--animate-duration-1100` | 1.1s |
| `--animate-duration-1300` | 1.3s |

### 動畫延遲

| Token | 延遲 |
|-------|------|
| `--animate-delay-200` | 200ms |
| `--animate-delay-500` | 500ms |
| `--animate-delay-1000` | 1s |
| `--animate-delay-2000` | 2s |

### 內建動畫

#### Fade 淡入淡出

```html
<!-- 淡入 -->
<div class="animate-fade-in animate-duration-300">內容</div>

<!-- 淡出 -->
<div class="animate-fade-out animate-duration-200">內容</div>
```

#### Slide 滑動

```html
<!-- Y 軸滑入 (由下往上) -->
<div class="animate-slide-y-in animate-duration-500">內容</div>

<!-- X 軸滑入 (由右往左) -->
<div class="animate-slide-x-in animate-duration-300">內容</div>
```

#### Float 漂浮

用於裝飾性元素的持續漂浮動畫。

```html
<div class="animate-float animate-duration-20000">🎈</div>
```

#### Oscillate 擺動

用於輕微上下擺動的動畫。

```html
<div class="animate-oscillate">↑</div>
```

#### Jelly 果凍彈跳

```html
<button class="animate-jelly">點我</button>
```

#### Stamp 蓋印章

完成任務時的蓋章特效。

```html
<div class="animate-stamp">✓ 完成</div>
```

#### Spin 旋轉

```html
<!-- 順時針旋轉 -->
<div class="animate-spin">⟳</div>

<!-- 逆時針旋轉 -->
<div class="animate-spin-reverse">⟲</div>

<!-- 慢速旋轉 (8秒一圈) -->
<div class="animate-spin-slow">🌀</div>
```

#### Marquee 跑馬燈

```html
<div class="animate-marquee">滾動文字...</div>
<div class="animate-marquee-reverse">反向滾動...</div>
```

#### Collapsible 折疊

```html
<!-- 搭配 Radix UI Collapsible 使用 -->
<div class="animate-collapsible-down">展開內容</div>
<div class="animate-collapsible-up">收起內容</div>
```

#### Accordion 手風琴

```html
<!-- 搭配 Radix UI Accordion 使用 -->
<div class="animate-accordion-down">展開</div>
<div class="animate-accordion-up">收起</div>
```

#### Button Ripple 按鈕漣漪

```html
<button class="relative overflow-hidden">
  <span class="animate-button-ripple absolute rounded-full bg-white/30"></span>
  按鈕
</button>
```

---

## 元件規範

### 圓角 (Border Radius)

| Token | 值 |
|-------|------|
| `--radius` | 0.625rem (10px) |
| `--radius-sm` | 0.375rem (6px) |
| `--radius-md` | 0.5rem (8px) |
| `--radius-lg` | 0.625rem (10px) |
| `--radius-xl` | 1.025rem (14px) |

### Lucide Icons

圖標統一使用 1.5px 線寬：

```css
.lucide {
  stroke-width: 1.5px;
}
```

### 工具類

#### 隱藏捲軸

```html
<div class="scrollbar-hide overflow-auto">
  <!-- 可捲動但不顯示捲軸 -->
</div>
```

#### 垂直分隔線

```html
<span class="vertical-separator-left">項目</span>
```

#### 漸變遮罩

```html
<!-- 跑馬燈兩側漸層遮罩 -->
<div class="mask-marquee">跑馬燈內容</div>
```

---

## 響應式設計

### Container

```css
.container {
  margin-inline: auto;
  padding-inline: 1rem;
  width: 100%;
  max-width: 100%;
}

/* sm (640px+) */
@media (min-width: 640px) {
  .container {
    max-width: 640px;
    padding-inline: 1.5rem;
  }
}

/* md (768px+) */
@media (min-width: 768px) {
  .container {
    max-width: 768px;
    padding-inline: 2rem;
  }
}

/* lg (1024px+) */
@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
    padding-inline: 2.5rem;
  }
}

/* xl (1280px+) */
@media (min-width: 1280px) {
  .container {
    max-width: 1200px;
    padding-inline: 3rem;
  }
}
```

### 斷點

| 斷點 | 最小寬度 | 用途 |
|------|----------|------|
| `sm` | 640px | 手機橫向 |
| `md` | 768px | 平板 |
| `lg` | 1024px | 小筆電 |
| `xl` | 1280px | 桌機 |

---

## 深色模式

使用 `.dark` class 啟用深色模式：

```html
<html class="dark">
  <!-- 深色模式內容 -->
</html>
```

深色模式會自動切換以下變數：

| Token | Light | Dark |
|-------|-------|------|
| `--background` | `oklch(1 0 0)` | `oklch(0.145 0 0)` |
| `--foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` |
| `--primary` | `oklch(0.205 0 0)` | `oklch(0.985 0 0)` |
| `--muted` | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` |
| `--border` | `oklch(0.922 0 0)` | `oklch(0.269 0 0)` |

---

## 漸層背景

### Primary Palest 漸層

```css
.bg-gradient-primary-palest {
  background:
    linear-gradient(270deg, oklch(0.984 0.009 197 / 0) 20%, oklch(0.984 0.009 197) 88%),
    oklch(0.711 0.12 190.6 / 0.3);
}
```

---

## Tailwind 自訂配色使用

在 Tailwind 中使用自訂顏色：

```html
<!-- 背景色 -->
<div class="bg-primary-base">主色背景</div>
<div class="bg-primary-lighter">淺色背景</div>

<!-- 文字色 -->
<p class="text-primary-darker">深色文字</p>
<p class="text-basic-400">灰色文字</p>

<!-- 邊框色 -->
<div class="border border-basic-200">邊框</div>

<!-- 語意色 -->
<span class="text-success">成功</span>
<span class="text-destructive">錯誤</span>
<span class="text-tips">提示</span>
```

---

## 相關文件

- [前端任務清單](./tasks/frontend-tasks.md)
- [前端技術棧](./techstack/frontend.md)
