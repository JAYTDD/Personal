# 首页 GitHub 项目展示 + 简历黑色背景优化方案

## 任务概述

1. **首页项目展示优化**：将 GitHub 仓库 (`resinya`) 的项目动态展示在首页项目区域，替换/增强现有展示逻辑
2. **简历页面黑色背景优化**：修复深色模式下 ResumePage 的显示效果，确保所有元素在黑色背景下清晰可见

---

## 任务一：首页 GitHub 项目展示优化

### 现状分析

- [HomePage.vue](file:///d:/ProjectSave/Personal/src/views/HomePage.vue) 已集成 `useGithubRepos` composable，从 GitHub API 获取 `JAYTDD` 用户的仓库
- 项目卡片使用渐变色背景展示，支持语言标识、star 数、topics 标签
- 当前用户名配置为 `JAYTDD`，需确认是否改为 `resinya`

### 修改内容

#### 1.1 修改 GitHub 用户名配置

**文件**: [useGithubRepos.ts](file:///d:/ProjectSave/Personal/src/composables/useGithubRepos.ts#L44)

将默认用户名从 `JAYTDD` 改为 `resinya`：

```typescript
// 修改前
const { username = 'JAYTDD', autoFetch = true } = options

// 修改后
const { username = 'resinya', autoFetch = true } = options
```

#### 1.2 优化项目卡片展示（可选增强）

**文件**: [HomePage.vue](file:///d:/ProjectSave/Personal/src/views/HomePage.vue)

现有卡片展示已较为完善，可考虑以下增强：

- 增加项目更新时间显示（`updated_at` 字段已获取但未使用）
- 增加 fork 数展示（如有需要）
- 优化空状态/无项目时的展示

---

## 任务二：简历页面深色模式优化

### 现状分析

- [ResumePage.vue](file:///d:/ProjectSave/Personal/src/views/ResumePage.vue) 已定义深色模式 CSS 变量（第 285-296 行）
- 但存在以下问题：
  1. **侧边栏导航按钮在深色模式下对比度不足**：`.nav-link` 使用 `--text-muted` (#71717a)，在深色背景上可能不够清晰
  2. **卡片悬停效果在深色模式下不明显**：阴影颜色 `--shadow-color` 为 `rgba(0,0,0,0.5)`，在黑色背景上几乎不可见
  3. **技能标签背景色过深**：`.tech-tag` 使用 `--bg-hover` (#27272a)，与卡片背景 (#1c1c1e) 过于接近
  4. **成就指标背景色对比度不足**：`.achievement-metric` 使用 `--metric-bg` (#27272a)，在深色卡片上不够突出
  5. **打印样式未覆盖深色模式**：打印时可能仍带有深色背景

### 修改内容

#### 2.1 优化深色模式 CSS 变量

**文件**: [ResumePage.vue](file:///d:/ProjectSave/Personal/src/views/ResumePage.vue#L285-L296)

```css
html.dark .resume-page {
  --bg-primary: #0a0a0a;
  --bg-card: #1c1c1e;
  --text-primary: #f5f5f5;        /* 提高亮度，从 #ffffff 改为稍柔和的白 */
  --text-secondary: #b0b0b5;      /* 提高亮度，从 #a1a1aa */
  --text-muted: #8e8e93;          /* 提高亮度，从 #71717a */
  --border-light: #2c2c2e;        /* 加亮边框 */
  --border-medium: #3a3a3c;       /* 加亮中等边框 */
  --bg-hover: #323234;            /* 加亮悬停背景 */
  --shadow-color: rgba(255, 255, 255, 0.06);  /* 改用白色微光阴影 */
  --metric-bg: #2c2c30;           /* 加亮指标背景 */
}
```

#### 2.2 优化卡片悬停效果

**文件**: [ResumePage.vue](file:///d:/ProjectSave/Personal/src/views/ResumePage.vue#L519-L532)

为深色模式添加更明显的悬停效果：

```css
/* 在现有 .card:hover 基础上，为深色模式增强 */
html.dark .card:hover {
  border-color: #4a4a4c;
  box-shadow: 0 4px 24px rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
}
```

#### 2.3 优化导航链接对比度

**文件**: [ResumePage.vue](file:///d:/ProjectSave/Personal/src/views/ResumePage.vue#L374-L390)

```css
html.dark .nav-link {
  color: #9e9ea4;  /* 比 --text-muted 更亮 */
}

html.dark .nav-link:hover {
  color: #f5f5f5;
  background: #2c2c2e;
}
```

#### 2.4 优化技能标签

**文件**: [ResumePage.vue](file:///d:/ProjectSave/Personal/src/views/ResumePage.vue#L682-L697)

```css
html.dark .tech-tag {
  background: #2c2c2e;
  border-color: #3a3a3c;
  color: #b0b0b5;
}

html.dark .tech-tag:hover {
  color: #f5f5f5;
  border-color: #4a4a4c;
  background: #323234;
}
```

#### 2.5 优化成就指标标签

**文件**: [ResumePage.vue](file:///d:/ProjectSave/Personal/src/views/ResumePage.vue#L602-L612)

```css
html.dark .achievement-metric {
  background: #323234;
  color: #e5e5ea;
}
```

#### 2.6 优化按钮样式

**文件**: [ResumePage.vue](file:///d:/ProjectSave/Personal/src/views/ResumePage.vue#L414-L433)

```css
html.dark .btn-primary {
  background: #f5f5f5;
  color: #0a0a0a;
}

html.dark .btn-primary:hover {
  background: #ffffff;
  opacity: 1;
}

html.dark .btn-secondary {
  color: #f5f5f5;
  border-color: #3a3a3c;
}

html.dark .btn-secondary:hover {
  border-color: #f5f5f5;
}
```

#### 2.7 添加深色模式滚动条样式

在 [App.vue](file:///d:/ProjectSave/Personal/src/App.vue) 的现有滚动条样式基础上确认已覆盖深色模式：

现有代码第 53-59 行已包含深色模式滚动条样式，无需修改。

---

## 实施步骤

### Phase 1: GitHub 用户名修正
1. 修改 `useGithubRepos.ts` 中的默认用户名

### Phase 2: 简历深色模式优化
1. 更新深色模式 CSS 变量（提高整体亮度对比度）
2. 添加/优化深色模式下的组件样式
3. 验证所有交互状态（hover、focus）在深色模式下的可见性

### Phase 3: 测试验证
1. 切换深色/浅色模式，检查简历页面所有元素
2. 验证首页 GitHub 项目是否正确加载 `resinya` 的仓库
3. 检查响应式布局在深色模式下是否正常

---

## 文件变更清单

| 文件 | 变更类型 | 说明 |
|------|---------|------|
| [src/composables/useGithubRepos.ts](file:///d:/ProjectSave/Personal/src/composables/useGithubRepos.ts) | 修改 | 更改默认 GitHub 用户名 |
| [src/views/ResumePage.vue](file:///d:/ProjectSave/Personal/src/views/ResumePage.vue) | 修改 | 优化深色模式样式变量和组件样式 |
