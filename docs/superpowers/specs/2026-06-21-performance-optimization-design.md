# Lunesnow-blog 性能优化设计 (2026-06-21)

## Why
部署上线后首跳页面近 2s 等待 + 图标加载跟不上，严重影响首屏体验和感知性能。需要从图标系统、构建配置、路由预加载、动画渲染、CSS 资源五个维度做一次集中优化。

## What Changes
- 图标系统：本地打包 iconify JSON 数据，消除 29 次远程 API 请求
- Vite 构建：拆 vendor/icons chunk、target es2020、assetsInlineLimit 调高
- 路由：requestIdleCallback 批量预取所有 view chunk
- 动画：SakuraCanvas 空闲启动、阴影瘦身、`content-visibility: auto`、`will-change` 收紧
- 资源：字体自托管、CSS 变量下沉去重、SCSS 体积优化

## Impact
- Affected code: `vite.config.ts`, `main.ts`, `App.vue`, `index.html`, `tailwind.css`, `src/styles/_variables.scss`, `src/views/{AboutPage,ExperiencePage,ResumePage,HomePage,NotFound}.vue`, `src/components/{TopNavBar,Footer,ScrollToTop,SakuraCanvas}.vue`
- Affected capabilities: 首屏加载、路由切换、图标渲染、动画 fps、字体加载

---

## §1 基础设施层：图标 + 构建配置 + 字体

### 1.1 图标本地打包

**依赖**：
```
+ @iconify-json/lucide       (~150KB raw, ~30KB gzip, 完整 lucide 集)
+ @iconify-json/simple-icons  (subset: github, 几 KB)
```

**改造点**：
- `main.ts`：启动时 `addCollection(lucideIcons, simpleIconsIcons)` 注册到 `@iconify/vue` 运行时
- `optimizeDeps.include: ['@iconify/vue']` 让 Vite 预打包图标运行时

**Top 5 高频图标改内联 SVG**（出现在每个页面）：
- `lucide:sun` (TopNavBar)
- `lucide:moon` (TopNavBar)
- `lucide:arrow-up` (ScrollToTop)
- `lucide:arrow-up-right` (Footer)
- `simple-icons:github` (Footer/ResumePage/GitHubContributions)

实现方式：新建 `src/components/icons/AppIcon.vue` 组件，内部按 name 渲染对应 SVG path。Top 5 用本地常量 path，剩余 fallback 到 `@iconify/vue` 的 `Icon` 组件（已走本地数据）。

### 1.2 Vite 构建配置

`vite.config.ts` 新增：

```ts
build: {
  target: 'es2020',
  assetsInlineLimit: 4096,
  cssCodeSplit: true,
  modulePreload: { polyfill: true },
  chunkSizeWarningLimit: 800,
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['vue', 'vue-router', 'pinia'],
        icons: ['@iconify/vue'],
      },
    },
  },
},
optimizeDeps: {
  include: ['@iconify/vue'],
},
```

**chunk 拆分效果**：
- `vendor-*.js`：vue 全家桶，跨版本稳定缓存
- `icons-*.js`：图标运行时 + 数据，更新频率低
- 各 view chunk：业务代码，热更新友好

### 1.3 字体自托管

**依赖**：
```
+ @fontsource/geist-sans  (400/500/600/700)
+ @fontsource/geist-mono  (400/500)
```

**改造点**：
- 移除 `index.html` 中 `fonts.googleapis.com` 的 `<link>` 标签
- `src/assets/tailwind.css` 顶部加：
  ```css
  @import '@fontsource/geist-sans/400.css';
  @import '@fontsource/geist-sans/500.css';
  @import '@fontsource/geist-sans/600.css';
  @import '@fontsource/geist-sans/700.css';
  @import '@fontsource/geist-mono/400.css';
  @import '@fontsource/geist-mono/500.css';
  ```
- `index.html` 加 `<link rel="preload" as="font" type="font/woff2" crossorigin>` 给 400 字重

---

## §2 体验层：路由预加载 + 动画性能

### 2.1 路由空闲预取

`App.vue` 新增：

```ts
const prefetchRoutes = () => {
  // 触发 Vite 预打包 + 浏览器缓存
  import('@/views/HomePage.vue')
  import('@/views/ResumePage.vue')
  import('@/views/ExperiencePage.vue')
  import('@/views/AboutPage.vue')
  import('@/views/NotFound.vue')
}

onMounted(() => {
  themeStore.init()
  if ('requestIdleCallback' in window) {
    requestIdleCallback(prefetchRoutes, { timeout: 2000 })
  } else {
    setTimeout(prefetchRoutes, 200)
  }
})
```

**预期**：首屏 idle 后 ~500ms 内 5 个 view chunk 全下载完、解析完、缓存好。后续导航 0 等待。

### 2.2 SakuraCanvas 性能

**改造点**：
- 组件挂载但 `paused = ref(true)`
- `onMounted` 里 `requestIdleCallback` 启动 rAF 循环
- `prefers-reduced-motion: reduce` 时不启动
- 切换 tab 不可见时 `document.visibilityState` 监听暂停

### 2.3 阴影瘦身

`box-shadow: 0 24px 64px rgba(...)` 类全部改为双层叠加：
```scss
box-shadow:
  0 1px 2px rgba(0, 0, 0, 0.04),
  0 8px 24px rgba(0, 0, 0, 0.06);
```

涉及文件：
- `AboutPage.vue`：hero-card-outer、section card、contact card、skill card
- `HomePage.vue`：project-card
- `ExperiencePage.vue`：timeline-item card
- `ResumePage.vue`：section card

### 2.4 content-visibility: auto

给长滚动 section 加：
```scss
.long-section {
  content-visibility: auto;
  contain-intrinsic-size: 800px; /* 占位避免滚动条跳 */
}
```

涉及：AboutPage 的 `<section class="hero-section">`、`<section class="section">`、ResumePage 的所有 section、ExperiencePage 的 timeline card 列表。

### 2.5 will-change 收紧

`_animations.scss` 的 `reveal` mixin 去掉 `will-change`（避免内存浪费），改为：
- IntersectionObserver 即将触发 reveal 时（`rootMargin: '200px'`）才加 `will-change: opacity, transform, filter`
- transition 结束后移除

`ScrollToTop` 的 scroll 监听加 `requestAnimationFrame` 节流。

---

## §3 收尾层：CSS 整合 + 资源体积

### 3.1 CSS 变量下沉

`src/styles/_variables.scss` 新增：

```scss
:root {
  --page-bg: var(--color-bg-primary);
  --card-bg: var(--color-text-inverse);
  --text-primary: var(--color-text-primary);
  --text-secondary: var(--color-text-secondary);
  --text-muted: var(--color-text-tertiary);
  --border-light: rgba(24, 24, 27, 0.06);
  --border-hover: rgba(24, 24, 27, 0.12);
  --accent: var(--color-brand-pink);
  --shadow-soft: rgba(24, 24, 27, 0.04);
  --shadow-hover: rgba(24, 24, 27, 0.08);
  --bg-hover: var(--color-bg-secondary);
}

html.dark {
  --page-bg: var(--color-bg-dark-primary);
  --card-bg: var(--color-bg-dark-secondary);
  --text-primary: var(--color-text-dark-primary);
  --text-secondary: var(--color-text-dark-secondary);
  --text-muted: var(--color-text-dark-tertiary);
  --border-light: #fafaf80f;
  --border-hover: #fafaf81f;
  --accent: var(--color-brand-pink-light);
  --shadow-soft: #0000004d;
  --shadow-hover: #0006;
  --bg-hover: var(--color-bg-dark-tertiary);
}
```

**删除**：
- `AboutPage.vue` / `ExperiencePage.vue` / `ResumePage.vue` 中重复的 `--page-bg` 等定义（~50 行/页面）
- 移除三个页面的 `:global(html.dark) &` 模式（§1 修复时已删，验证一遍）

### 3.2 SCSS 体积

- 验证 Tailwind 4 content 自动检测（构建产物无 dead class）
- `_variables.scss` 删除未使用的变量
- 大页面的 `@media` 嵌套块保留（运行时按需下发，但 SCSS 编译已经合并了）

---

## 包体积预期对比

| 资源 | 改前 | 改后 |
|---|---|---|
| 首屏 JS | ~200KB | ~250KB（iconify 数据，但 vendor/icons 分块） |
| 首屏 CSS | ~30KB | ~25KB（去重 + purge） |
| 字体 | 第三方 DNS + ~100KB | 本地 ~80KB（首次） |
| 图标请求 | 5-29 次 API | 0 次 |
| 首跳等待 | ~2s | <500ms |
| 次跳 | 完整 chunk 下载 | 0 等待（已 prefetch） |

## 风险与回滚

- **iconify 本地化**：增加 ~30KB gzip，但消除了外部网络请求和不确定性，整体更稳
- **路由预取**：idle 时多下载 ~150KB，但 100% 会被用到
- **CSS 变量下沉**：纯重构，不影响视觉
- **content-visibility**：极少数浏览器不支持，无回退（功能正常但可能多渲染一点）

## 验收指标

- Lighthouse Performance ≥ 90（之前未测）
- LCP < 1.5s
- CLS < 0.05
- 首跳路由切换 < 100ms（用户感知）
- 图标首次渲染与文字同时出现（无闪烁）
