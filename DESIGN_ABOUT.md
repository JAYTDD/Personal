# Design System: AboutPage 组件设计样式方案

## 1. Visual Theme & Atmosphere

一个温暖、克制且富有个人气质的个人介绍页面。整体氛围偏向「数字名片」—— 干净、有层次、不喧嚣。通过打字机动效、实时天气状态条和细腻的卡片悬浮反馈，传递出一种"正在生活、正在编码"的生动感。密度适中（Density 4），布局以居中对称为主，但在动效和交互上保持微妙的非对称趣味。

## 2. Color Palette & Roles

| Token | Hex | Role |
|-------|-----|------|
| **Canvas White** | `#FFFFFF` | 浅色模式页面背景 |
| **Charcoal Ink** | `#1A1A1A` | 浅色模式主文字 |
| **Muted Steel** | `#6B7280` | 次要文字、描述、标签 |
| **Whisper Gray** | `#9CA3AF` | 辅助信息、更新时间、分隔点 |
| **Border Light** | `rgba(0, 0, 0, 0.08)` | 卡片边框、分割线 |
| **Accent Brown** | `#4A3728` | 主强调色：光标、复制提示、hover边框 |
| **Card Surface** | `#FFFFFF` | 浅色模式卡片背景 |
| **Shadow Soft** | `rgba(0, 0, 0, 0.04)` | 卡片阴影、头像光晕 |

**深色模式覆盖：**

| Token | Hex | Role |
|-------|-----|------|
| **Dark Canvas** | `#1C1C1E` | 深色模式卡片背景 |
| **Dark Ink** | `#FFFFFF` | 深色模式主文字 |
| **Dark Steel** | `#A1A1AA` | 深色模式次要文字 |
| **Dark Muted** | `#71717A` | 深色模式辅助信息 |
| **Dark Border** | `rgba(255, 255, 255, 0.1)` | 深色模式边框 |
| **Dark Accent** | `#C4A882` | 深色模式强调色（暖金） |
| **Dark Shadow** | `rgba(0, 0, 0, 0.3)` | 深色模式阴影 |

**色彩约束：**
- 仅使用 1 个强调色（棕色系），饱和度低于 80%
- 禁止纯黑 `#000000`
- 禁止霓虹/发光阴影
- 禁止渐变色文字

## 3. Typography Rules

- **Display / Name**: 系统默认无衬线字体 — 28px, weight 700, letter-spacing -0.02em
- **Body / 描述**: 系统默认无衬线字体 — 14px, weight 400, line-height 1.7
- **Section Title**: 系统默认无衬线字体 — 12px, weight 600, letter-spacing 0.15em, uppercase
- **Signature**: 系统默认无衬线字体 — 16px, italic, 打字机逐字显示
- **Status Bar**: 系统默认无衬线字体 — 13px, 图标+文字混排
- **Banned**: 禁止使用 Inter 作为展示字体；禁止在 UI 中使用衬线字体

## 4. Component Stylings

### 4.1 HeroSection（首屏区域）

**结构：** 垂直居中堆叠
- Avatar（头像）→ Name（名字）→ Title（职位）→ Signature（签名打字机）→ StatusBar（状态条）

**Avatar：**
- 尺寸：100×100px（移动端 80×80px）
- 形状：正圆 `border-radius: 50%`
- 边框：2px solid `var(--border-light)`
- 阴影：`0 8px 32px var(--shadow-soft)`
- Hover：`transform: scale(1.05)` + 阴影加深，过渡 `0.4s cubic-bezier(0.32, 0.72, 0, 1)`

**Signature（打字机签名）：**
- 两行独立 `<div>`，每行 `min-height: 24px`
- 字体：16px, italic, `var(--text-secondary)`
- 光标：2px 宽竖线，高度 16px，`var(--accent)` 色
- 第一行打完后，光标消失；第二行开始打字；全部完成后光标进入 `blink` 动画（1s step-end infinite）
- 打字速度：80ms/字；行间延迟：400ms

**StatusBar（状态条）：**
- 布局：`display: flex`, `justify-content: center`, `gap: 16px`, `flex-wrap: wrap`
- 每个状态项：`display: flex`, `align-items: center`, `gap: 6px`
- 分隔符：4×4px 圆点，`var(--text-muted)`, opacity 0.5
- 移动端：分隔符隐藏，gap 缩小为 12px
- 内容：地理位置 | 天气（温度+描述+更新时间）| 正在听（音乐）

### 4.2 Section（内容区块）

**通用结构：**
- `margin-bottom: 40px`
- 标题：`.section-title` — 12px, uppercase, letter-spacing 0.15em, `var(--text-muted)`

### 4.3 BlogCard（博客介绍卡片）

- 背景：`var(--bg-card)`
- 边框：1px solid `var(--border-light)`
- 圆角：12px
- 内边距：20px
- Hover：`box-shadow: 0 4px 20px var(--shadow-soft)` + `transform: translateY(-2px)`，过渡 0.3s ease
- 文字：14px, `var(--text-secondary)`, line-height 1.7

### 4.4 TagGrid（标签网格）

**布局：** `display: flex`, `flex-wrap: wrap`, `gap: 8px`

**TechTag / HobbyTag：**
- `display: inline-flex`, `align-items: center`, `gap: 6px`
- 内边距：6px 12px
- 圆角：8px
- 边框：1px solid `var(--border-light)`
- 背景：`var(--bg-card)`
- 文字：13px, `var(--text-secondary)`
- Hover：`border-color: var(--text-muted)` + `transform: translateY(-1px)`，过渡 0.2s ease

### 4.5 ContactList（联系方式列表）

**布局：** `display: flex`, `flex-direction: column`, `gap: 8px`

**ContactItem：**
- `display: flex`, `align-items: center`, `gap: 12px`
- 内边距：12px 16px
- 背景：`var(--bg-card)`
- 边框：1px solid `var(--border-light)`
- 圆角：10px
- Cursor：pointer
- Hover：`border-color: var(--text-muted)` + `transform: translateY(-1px)`

**ContactIcon：**
- 尺寸：32×32px
- 圆角：8px
- 背景：`#F5F5F5`（浅色）/ `rgba(255,255,255,0.05)`（深色）
- 图标居中，颜色 `var(--text-secondary)`

**ContactInfo：**
- 标签：11px, uppercase, `var(--text-muted)`, letter-spacing 0.05em
- 值：14px, `var(--text-primary)`, weight 500

**CopyHint（复制成功提示）：**
- 位置：右侧绝对定位
- 初始状态：`opacity: 0`, `transform: translateX(8px)`
- 显示状态：`opacity: 1`, `transform: translateX(0)`
- 颜色：`var(--accent)`
- 触发：点击联系方式后显示，2s 后自动消失

### 4.6 SocialGrid（社交链接网格）

**布局：** `display: flex`, `gap: 12px`, 移动端 `flex-wrap: wrap`

**SocialItem：**
- `display: flex`, `align-items: center`, `gap: 8px`
- 内边距：10px 16px
- 背景：`var(--bg-card)`
- 边框：1px solid `var(--border-light)`
- 圆角：10px
- 文字：13px, `var(--text-secondary)`, 无下划线
- Hover：`border-color: var(--text-muted)` + `color: var(--text-primary)` + `transform: translateY(-1px)`

## 5. Layout Principles

- **容器**：`max-width: 680px`, 水平居中, `margin: 0 auto`
- **页面内边距**：`padding: 48px 24px 80px`（移动端 `32px 20px 60px`）
- **最小高度**：`min-height: 100vh`
- **所有区块**：垂直堆叠，无多列布局
- **无重叠元素**：每个元素占据独立空间区域

## 6. Motion & Interaction

### 6.1 打字机签名动效
- 逐字显示，80ms/字符
- 第一行完成后，延迟 400ms 开始第二行
- 光标在第一行打字时显示，完成后隐藏；第二行打字时显示，全部完成后进入持续闪烁
- 使用 `setInterval` + `clearInterval` 实现，非 CSS 动画

### 6.2 Scroll Reveal（滚动渐入）
- 初始状态：`opacity: 0`, `transform: translateY(20px)`
- 进入视口后：`.revealed` 类添加
- 过渡：`all 0.6s cubic-bezier(0.32, 0.72, 0, 1)`
- 触发：`IntersectionObserver`, threshold 0.1

### 6.3 天气自动刷新
- 页面加载时立即获取
- 每 10 分钟自动刷新（`setInterval`, 10 * 60 * 1000ms）
- 组件卸载时清除定时器（`onUnmounted`）

### 6.4 Hover 反馈
- 所有卡片/标签/社交链接：统一使用 `transform: translateY(-1px)` + 边框色变化
- 头像：`scale(1.05)` + 阴影加深
- 过渡时间：0.2s ~ 0.4s ease

### 6.5 复制反馈
- 点击联系方式项 → 右侧显示「已复制」提示
- 2s 后自动消失
- 使用 `navigator.clipboard.writeText` API

## 7. Responsive Rules

**断点：640px**

| 元素 | Desktop (>=640px) | Mobile (<640px) |
|------|-------------------|-----------------|
| 页面内边距 | 48px 24px 80px | 32px 20px 60px |
| 头像尺寸 | 100×100px | 80×80px |
| 名字字号 | 28px | 24px |
| 状态条分隔符 | 显示 | 隐藏 |
| 社交网格 | 单行 | 自动换行 |
| 状态条间距 | 16px | 12px |

## 8. Dark Mode Strategy

- 使用 CSS 变量系统，通过 `html.dark` 选择器覆盖
- 深色模式强调色由棕色 `#4A3728` 变为暖金色 `#C4A882`
- 卡片背景由白色变为 `#1C1C1E`
- 所有文字、边框、阴影颜色同步反转
- 无渐变过渡，切换即时生效

## 9. Anti-Patterns (Banned)

- 禁止使用 emoji
- 禁止使用 Inter 字体作为展示字体
- 禁止使用纯黑 `#000000`
- 禁止霓虹/外发光阴影
- 禁止渐变色文字
- 禁止 3 列等宽卡片布局
- 禁止「Scroll to explore」等无意义引导文字
- 禁止重叠元素 — 每个元素必须有清晰的空间边界
- 禁止自定义鼠标指针
- 禁止假数据（99.99%、50% 等）
- 禁止 AI 文案陈词滥调（"Elevate"、"Seamless"、"Unleash"）
