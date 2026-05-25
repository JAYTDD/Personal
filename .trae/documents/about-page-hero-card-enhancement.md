# 关于页面 Hero 区域卡片化 + 内容扩展计划

## 1. 当前问题分析

从截图可见，Hero 区域（头像 + 名字 + 签名 + 状态条）目前是一个松散堆叠的区块，缺乏视觉边界和层次感。用户希望：
- 给 Hero 区域加一个"好看的框框"（卡片化容器）
- 扩展更多可展示的内容

---

## 2. 设计方案：Hero Profile Card

### 2.1 视觉风格选择

基于已加载的三个设计技能（high-end-visual-design、stitch-design-taste、design-taste-frontend），选择以下风格：

- **Vibe Archetype:** Soft Structuralism — 银灰/纯白背景，大胆的 Grotesk 字体，轻盈悬浮组件
- **Layout Archetype:** Z-Axis Cascade — 元素像实体卡片一样堆叠，有微妙的深度差异
- **Card Architecture:** Double-Bezel（双层嵌套）— 外层壳 + 内层核心，模拟 machined hardware 质感

### 2.2 Hero Card 结构

```
┌─────────────────────────────────────────┐
│  [外层壳: 大圆角 + 极淡背景 + hairline边框]  │
│  ┌─────────────────────────────────────┐│
│  │ [内层核心: 白色背景 + 内阴影高光]      ││
│  │                                     ││
│  │    [3D Tilt Avatar]                 ││
│  │         Resin                       ││
│  │      前端开发者                      ││
│  │                                     ││
│  │  "青春属于表白 阳光属于窗台"          ││
│  │  "而我想我属于一个拥有你的未来"        ││
│  │                                     ││
│  │  ┌─────────────────────────────┐    ││
│  │  │ [Status Bar 卡片化]          │    ││
│  │  │  广东·深圳  29°C阴天  周杰伦-晴天 │    ││
│  │  └─────────────────────────────┘    ││
│  │                                     ││
│  │  [新增: 快速操作按钮行]               ││
│  │  [复制邮箱] [访问博客] [GitHub]       ││
│  │                                     ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

### 2.3 Double-Bezel 卡片样式

**外层壳 (Outer Shell):**
- 背景: `rgba(0,0,0,0.02)` (浅色) / `rgba(255,255,255,0.03)` (深色)
- 边框: 1px solid `rgba(0,0,0,0.06)` (浅色) / `rgba(255,255,255,0.08)` (深色)
- 圆角: `24px` (大圆角)
- 内边距: `4px`
- 阴影: `0 20px 60px rgba(0,0,0,0.06)`

**内层核心 (Inner Core):**
- 背景: `var(--bg-card)` (#FFFFFF / #1C1C1E)
- 圆角: `20px` (比外层小 4px，形成同心曲线)
- 内阴影: `inset 0 1px 2px rgba(255,255,255,0.5)` (浅色) / `inset 0 1px 1px rgba(255,255,255,0.05)` (深色)
- 内边距: `32px 24px`

### 2.4 Status Bar 卡片化

将状态条放入独立的子卡片中：
- 背景: `var(--bg-primary)` 或略深于内层核心
- 圆角: `12px`
- 边框: 1px solid `var(--border-light)`
- 内边距: `10px 16px`
- 与上方签名间距: `16px`

---

## 3. 可扩展内容清单

在 Hero Card 内层核心中，除了现有内容，还可以增加：

### 3.1 快速操作按钮行 (Quick Actions)

在状态条下方增加一行操作按钮：
- **复制邮箱**: 点击复制 `2970768980@qq.com`，带粒子爆发效果
- **访问博客**: 链接到 `https://www.coderesin.xyz`
- **GitHub**: 链接到 `https://github.com/resinya`

按钮样式:
- 圆角 pill (`border-radius: 9999px`)
- 背景: `var(--accent)` 或品牌色
- 文字: 白色
- Hover: `scale(0.98)` + 阴影加深
- 图标 + 文字布局

### 3.2 在线状态指示器增强

当前只有绿色呼吸点，可以扩展为：
- 绿色呼吸点 + "在线" 文字
- 或添加 "最后活跃: 刚刚" 等动态文字

### 3.3 个人数据微标 (Micro Badges)

在名字下方增加一行小徽章：
- 徽章 1: "开源贡献者" + 星星图标
- 徽章 2: "3年+ 经验" + 日历图标
- 徽章 3: "深圳" + 定位图标

样式:
- 极小字号 (10px)
- pill 形状
- 浅色背景 + 深色文字
- 图标 + 文字

### 3.4 一句话简介 (One-liner Bio)

在职位下方增加一行更具体的描述：
- "热爱前端工程化与用户体验设计"
- 或 "用代码构建属于自己的宇宙"

样式:
- 13px
- `var(--text-muted)`
- 居中

### 3.5 动态数据展示

- **今日访问数**: 从某个统计 API 获取（可选）
- **GitHub Stars 总数**: 从 GitHub API 获取（可选）
- **博客文章数**: 静态数据或 API 获取

---

## 4. 实施步骤

### Step 1: 重构 Hero Section 为 Double-Bezel Card
- 创建外层壳 div
- 创建内层核心 div
- 将现有内容移入内层核心
- 调整内边距和间距

### Step 2: Status Bar 子卡片化
- 将状态条包裹在独立卡片容器中
- 调整背景色和边框

### Step 3: 添加快速操作按钮行
- 创建按钮组件
- 实现复制邮箱功能（复用现有 copyToClipboard）
- 实现外部链接跳转

### Step 4: 添加微标行（可选）
- 创建徽章组件
- 定义徽章数据

### Step 5: 添加一句话简介（可选）
- 在职位下方插入简介文字

### Step 6: 响应式适配
- 移动端卡片内边距减小
- 按钮行换行或缩小

---

## 5. 样式代码草案

```css
/* Double-Bezel Hero Card */
.hero-card-outer {
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 24px;
  padding: 4px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.06);
}

html.dark .hero-card-outer {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.hero-card-inner {
  background: var(--bg-card);
  border-radius: 20px;
  padding: 32px 24px;
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.5);
  text-align: center;
}

html.dark .hero-card-inner {
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.05);
}

/* Status Bar Sub-card */
.status-bar-card {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  background: var(--bg-primary);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  margin-top: 16px;
}

/* Quick Action Buttons */
.quick-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 500;
  background: var(--accent);
  color: #fff;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  transform: scale(0.98);
  box-shadow: 0 4px 16px rgba(74, 55, 40, 0.3);
}

html.dark .action-btn:hover {
  box-shadow: 0 4px 16px rgba(196, 168, 130, 0.3);
}

/* Micro Badges */
.micro-badges {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 10px;
  flex-wrap: wrap;
}

.micro-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 10px;
  font-weight: 500;
  background: var(--bg-primary);
  color: var(--text-muted);
  border: 1px solid var(--border-light);
}
```

---

## 6. 预期效果

- Hero 区域从松散堆叠变为有边界的精致卡片
- Double-Bezel 结构增加层次感和质感
- 状态条卡片化后更聚焦
- 快速操作按钮提供即时交互入口
- 整体视觉从"列表式"升级为"名片式"
