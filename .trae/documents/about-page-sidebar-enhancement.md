# 关于页面两侧边栏扩展计划

## 1. 当前问题分析

从截图可见，关于页面采用居中 680px 窄容器布局，两侧有大量空白。用户希望：
- 两侧不要空着，增加有功能/装饰性的侧边内容
- 保持整体视觉平衡

---

## 2. 设计方案：左右浮动信息面板

### 2.1 布局架构

采用 **三栏非对称布局**：
- **左侧面板 (Left Sidebar)**：固定宽度 200px，展示动态/装饰内容
- **中间主内容 (Main Content)**：保持现有 680px，关于页面主体
- **右侧面板 (Right Sidebar)**：固定宽度 200px，展示工具/信息内容

```
┌─────────────────────────────────────────────────────────────┐
│  [Left Sidebar]      [Main Content 680px]      [Right Sidebar] │
│  200px wide          centered                  200px wide     │
│                     ┌──────────────────┐                      │
│  ┌──────────────┐   │  Hero Profile    │   ┌──────────────┐  │
│  │  时间轴       │   │  Card            │   │  工具箱       │  │
│  │  · 2024      │   │                  │   │  · 调色板     │  │
│  │  · 2023      │   │  头像/名字/签名   │   │  · 计算器     │  │
│  │  · 2022      │   │  状态条/操作按钮  │   │  · 翻译       │  │
│  └──────────────┘   │                  │   └──────────────┘  │
│                     │  关于博客         │                      │
│  ┌──────────────┐   │  技术栈/爱好      │   ┌──────────────┐  │
│  │  动态装饰     │   │  联系方式/社交    │   │  数据统计     │  │
│  │  · 旋转几何   │   │                  │   │  · 访问数     │  │
│  │  · 浮动粒子   │   └──────────────────┘   │  · Stars      │  │
│  └──────────────┘                            │  · 文章数     │  │
│                                              └──────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 左侧面板内容

#### A. 时间轴速览 (Timeline Snapshot)
- 展示最近 3-5 年的关键节点
- 样式：垂直时间线，左侧细线 + 右侧文字
- 内容：
  - 2024: 开始写博客
  - 2023: 入职某公司
  - 2022: 毕业/转行
  - 2021: 开始学习前端

#### B. 动态装饰元素
- **旋转几何图形**：一个缓慢旋转的 SVG 几何图形（如六边形、星形）
- **浮动粒子**：几个小圆点缓慢上下浮动
- **当前时间**：实时显示当前时间（带秒）

#### C. 座右铭/名言
- 静态展示一句喜欢的名言
- 小字号，斜体

### 2.3 右侧面板内容

#### A. 迷你工具箱 (Mini Toolbox)
- **调色板生成器**：点击生成随机配色方案
- **Base64 转换器**：简单的文本/Base64 互转
- **JSON 格式化**：简单的 JSON 美化输入框
- **密码生成器**：一键生成随机密码

#### B. 数据统计卡片
- **今日访问**：模拟或真实数据
- **GitHub Stars**：从 API 获取
- **博客文章数**：静态或 API
- **运行天数**：博客上线至今的天数

#### C. 快捷链接
- 收藏的工具网站
- 常用文档链接

### 2.4 响应式策略

- **Desktop (>= 1200px)**：三栏布局，两侧面板显示
- **Tablet (768px - 1199px)**：隐藏两侧面板，主内容居中
- **Mobile (< 768px)**：单栏布局，部分侧边内容移至底部

---

## 3. 视觉风格

### 3.1 侧边面板样式

- **背景**：与主内容区相同或略深/略浅
- **边框**：1px solid `var(--border-light)`
- **圆角**：16px
- **内边距**：16px
- **阴影**：极淡的扩散阴影

### 3.2 与主内容的协调

- 侧边面板使用更小的字号（12-13px）
- 颜色更 muted，不抢夺主内容注意力
- 交互元素（工具）hover 时有轻微反馈

---

## 4. 实施步骤

### Step 1: 创建三栏布局容器
- 外层容器使用 CSS Grid：`grid-template-columns: 200px 1fr 200px`
- 中间列限制最大宽度 680px
- 两侧列固定宽度 200px

### Step 2: 实现左侧面板
- 时间轴组件
- 动态装饰组件（旋转图形、浮动粒子）
- 实时时钟组件

### Step 3: 实现右侧面板
- 迷你工具箱组件
- 数据统计卡片组件
- 快捷链接组件

### Step 4: 响应式适配
- 媒体查询控制三栏/单栏切换
- 移动端隐藏或重组侧边内容

### Step 5: 交互功能实现
- 工具箱功能（调色板、Base64、JSON、密码）
- 数据统计 API 接入（GitHub Stars 等）

---

## 5. 代码草案

```vue
<!-- AboutPage.vue 三栏布局 -->
<template>
  <div class="about-layout">
    <!-- Left Sidebar -->
    <aside class="sidebar left">
      <TimelineWidget />
      <DecorativeWidget />
      <ClockWidget />
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <!-- 现有关于页面内容 -->
    </main>

    <!-- Right Sidebar -->
    <aside class="sidebar right">
      <ToolboxWidget />
      <StatsWidget />
      <QuickLinksWidget />
    </aside>
  </div>
</template>

<style>
.about-layout {
  display: grid;
  grid-template-columns: 200px minmax(auto, 680px) 200px;
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sidebar-widget {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 16px;
  padding: 16px;
}

/* 响应式 */
@media (max-width: 1199px) {
  .about-layout {
    grid-template-columns: 1fr;
    max-width: 680px;
  }
  .sidebar {
    display: none;
  }
}
</style>
```

---

## 6. 预期效果

- 页面从窄居中布局扩展为宽屏三栏布局
- 两侧空白被有意义的内容填充
- 时间轴增加个人故事感
- 工具箱提供实用价值
- 数据统计增加可信度
- 动态装饰增加视觉趣味
- 整体从"博客页面"升级为"个人数字空间"
