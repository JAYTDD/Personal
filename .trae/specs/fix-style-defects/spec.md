# 样式代码视觉呈现与功能缺陷修复 Spec

## Why
项目从纯 CSS 迁移到 SCSS + scoped 后，经审计发现存在暗色模式打印文本不可见、暗色模式下部分视觉效果丢失、对比度不足、缺少 reduced-motion 处理等功能缺陷和视觉问题，需要系统性修复。

## What Changes
- 修复暗色模式下打印简历文本不可见（P0）
- 修复 ExperiencePage 时间线卡片双边框暗色模式下不可见（P1）
- 修复 AboutPage 技能标签颜色暗色模式对比度不足（P1）
- 补充 ResumePage prefers-reduced-motion 处理（P1）
- 修复 ResumePage 侧边栏 sticky top 值偏大（P2）
- 修复 SakuraCanvas z-index 高于 ScrollToTop 导致花瓣遮挡按钮（P2）
- 替换 ExperiencePage 硬编码颜色为 CSS 变量（P2）
- 修复 AboutPage 联系卡片 glow 暗色模式部分颜色不可见（P2）
- 补充 HeroSection prefers-reduced-motion 处理（P2）
- 补充 GitHubContributions prefers-reduced-motion 处理（P2）
- 删除 SakuraCanvas 中不存在的 classchange 事件监听死代码（P2）
- 将 AboutPage @property 移至全局样式（P3）
- 补充 _mixins.scss xs 断点并统一 AboutPage 360px 媒体查询（P3）
- 替换硬编码颜色值为 CSS 变量（P3）
- 清理 App.vue 滚动条 fallback 颜色冗余（P3）
- 删除 ResumePage 打印样式中不存在的 .theme-toggle 选择器（P3）
- 将 _animations.scss 顶层 @keyframes blink 移入 cursor mixin（P3）

## Impact
- Affected code: ResumePage.vue, ExperiencePage.vue, AboutPage.vue, App.vue, HeroSection.vue, GitHubContributions.vue, SakuraCanvas.vue, ScrollToTop.vue, _animations.scss, _mixins.scss, tailwind.css
- Affected capabilities: 暗色模式视觉一致性、打印功能、无障碍访问（reduced-motion）、z-index 层级

## ADDED Requirements

### Requirement: 暗色模式打印支持
系统 SHALL 在暗色模式下打印简历时，确保所有文本在白色背景上清晰可见。

#### Scenario: 暗色模式打印简历
- **WHEN** 用户在暗色模式下点击"打印简历"按钮
- **THEN** 打印预览中所有文本应为深色，背景为白色，与亮色模式打印效果一致

### Requirement: 暗色模式视觉效果完整性
系统 SHALL 确保所有视觉效果在暗色模式下正确呈现，包括卡片边框、标签颜色、glow 效果等。

#### Scenario: ExperiencePage 时间线卡片双边框
- **WHEN** 用户在暗色模式下查看经历页面
- **THEN** 时间线卡片的双边框效果应可见（使用亮色半透明渐变替代暗色渐变）

#### Scenario: AboutPage 联系卡片 glow 边框
- **WHEN** 用户在暗色模式下 hover 联系卡片
- **THEN** glow 边框效果应可见，包括 GitHub 等深色图标的 glow

### Requirement: WCAG AA 颜色对比度
系统 SHALL 确保暗色模式下交互元素的文本颜色对比度不低于 4.5:1（WCAG AA 标准）。

#### Scenario: 技能标签 hover 颜色
- **WHEN** 用户在暗色模式下 hover 技能标签
- **THEN** 标签文本颜色对比度应达到 WCAG AA 标准

### Requirement: prefers-reduced-motion 支持
系统 SHALL 在所有包含动画的页面和组件中正确处理 `prefers-reduced-motion: reduce` 媒体查询。

#### Scenario: ResumePage 减少动画
- **WHEN** 用户系统设置了减少动画偏好并查看简历页面
- **THEN** 打字光标不闪烁、内容入场无过渡、reveal 动画直接显示

#### Scenario: HeroSection 减少动画
- **WHEN** 用户系统设置了减少动画偏好并查看首页
- **THEN** 打字机效果跳过，直接显示完整文本

### Requirement: z-index 层级规范
系统 SHALL 确保功能性 UI 元素（如回到顶部按钮）的 z-index 高于装饰性元素（如樱花画布）。

#### Scenario: 花瓣不遮挡回到顶部按钮
- **WHEN** 页面滚动后回到顶部按钮出现
- **THEN** 按钮应渲染在樱花花瓣之上，不被遮挡

## MODIFIED Requirements

### Requirement: ResumePage 侧边栏定位
ResumePage 侧边栏的 `position: sticky; top` 值 SHALL 与导航栏高度匹配，避免在短视口下侧边栏无法完全展示。将 `top: 100px` 改为 `top: 80px`。

## REMOVED Requirements

### Requirement: SakuraCanvas classchange 事件监听
**Reason**: `classchange` 不是标准 DOM 事件，且从未注册过此监听器，属于死代码。
**Migration**: 直接删除 `document.removeEventListener('classchange', handleThemeChange)` 行。
