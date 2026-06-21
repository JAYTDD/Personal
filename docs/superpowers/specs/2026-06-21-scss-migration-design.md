# SCSS 语法转换 + 公共样式去重设计文档

> 日期: 2026-06-21
> 状态: 已批准

## 背景

项目 3 个页面组件（AboutPage、ResumePage、ExperiencePage）承载了约 2450 行纯 CSS，存在以下问题：

1. **无 SCSS**：纯原生 CSS，无嵌套、无 mixin、无变量复用
2. **无 scoped**：所有 `<style>` 均为全局，类名冲突风险高
3. **大量重复**：暗色模式变量、reveal 动画、卡片样式、标签样式等在多个文件中重复定义
4. **变量命名不统一**：同一语义在不同组件用了不同名字（如 `--bg-canvas` / `--bg-primary` / `--canvas-bg`）
5. **reduced-motion 不一致**：分散在各处且实现不一致

## 方案

**方案 A：最小改动 + 去重** — 仅页面组件转 SCSS + scoped，抽取公共样式文件消除冗余。

### 不改动的部分

- 7 个组件级文件（TopNavBar、Footer、ProjectCard 等）保持 Tailwind 工具类不变
- `tailwind.css` 设计令牌和 `@layer components` 不动
- 模板 HTML 结构和 class 名不变

## 实施步骤

### Step 1: 安装 sass 依赖

```bash
npm install -D sass
```

Vite 原生支持 SCSS，安装后无需额外配置。

### Step 2: 新建公共 SCSS 文件

```
src/styles/
├── _variables.scss    — 统一页面级 CSS 变量 + 暗色模式覆盖
├── _animations.scss   — reveal 滚动动画、cursor blink、lamp 效果
└── _mixins.scss       — 卡片、标签、响应式断点等可复用 mixin
```

#### `_variables.scss`

- 统一 3 个页面重复的变量声明，消除命名不一致
- 统一暗色模式变量覆盖块（3 处 → 1 处）
- 各页面通过 `@use` 引入后，仅声明页面特有变量

统一变量命名：

| 语义 | 旧名（不一致） | 新名（统一） |
|---|---|---|
| 主背景 | `--bg-canvas` / `--bg-primary` / `--canvas-bg` | `--page-bg` |
| 卡片背景 | `--bg-card` / `--pure-surface` | `--card-bg` |
| 主文字 | `--text-primary` / `--charcoal-ink` | `--text-primary` |
| 次文字 | `--text-secondary` / `--warm-gray` | `--text-secondary` |
| 弱文字 | `--text-muted` / `--muted-sage` | `--text-muted` |
| 边框 | `--border-light` / `--hairline` | `--border-light` |
| 阴影 | `--shadow-soft` / `--shadow-color` | `--shadow-soft` |

#### `_animations.scss`

- `.reveal` / `.revealed` 滚动动画（参数化位移值）
- `.cursor` / `@keyframes blink` 打字光标
- `.lamp` section-title 装饰效果
- `prefers-reduced-motion` 统一处理

#### `_mixins.scss`

- `@mixin card` — 卡片样式（背景、圆角、边框、阴影、hover 上浮）
- `@mixin tag($color)` — 标签样式（小圆角、边框、hover 变色）
- `@mixin respond-to($breakpoint)` — 响应式断点（统一断点值）
- `@mixin section-title` — 区块标题样式

### Step 3: 改造页面组件

| 文件 | 改动 |
|---|---|
| `AboutPage.vue` | `<style>` → `<style lang="scss" scoped>`，删除重复变量/动画，`@use` 引入公共文件，SCSS 嵌套改写 |
| `ResumePage.vue` | 同上 |
| `ExperiencePage.vue` | 同上 |
| `App.vue` | `<style>` → `<style lang="scss">`（保持全局，不加 scoped），SCSS 嵌套改写 |

### Step 4: 冗余消除

| 冗余类型 | 当前状态 | 改造后 |
|---|---|---|
| 暗色模式变量 | 3 处重复（~37 行） | 1 处公共文件 |
| reveal 动画 | 3 处重复（~40 行） | 1 处公共文件 |
| cursor blink | 2 处重复（~40 行） | 1 处公共文件 |
| 卡片样式 | 3 处类似实现（~80 行） | 1 个 mixin |
| 标签样式 | 3 处类似实现（~90 行） | 1 个 mixin |
| 变量命名不一致 | 3 套命名 | 1 套统一命名 |
| reduced-motion | 分散且不一致 | 1 处统一处理 |
| 响应式断点 | 3 处硬编码 | 1 套 mixin |

## 预期效果

- 样式总行数从 ~2450 行降至 ~1500-1700 行（减少 30-35%）
- 所有页面组件 scoped，消除样式泄漏风险
- SCSS 嵌套让代码层级更清晰
- 公共样式统一维护，改一处全局生效
