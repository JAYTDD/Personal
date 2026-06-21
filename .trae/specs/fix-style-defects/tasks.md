# Tasks

- [x] Task 1: 修复暗色模式打印文本不可见（P0）
  - [x] SubTask 1.1: 在 ResumePage.vue 的 `@media print` 中通过 `@include vars.page-variables` 重置 CSS 变量为亮色模式值
  - [x] SubTask 1.2: 删除打印样式中不存在的 `.theme-toggle` 死代码选择器

- [x] Task 2: 修复暗色模式视觉效果丢失（P1）
  - [x] SubTask 2.1: ExperiencePage.vue — 为 `.timeline-card-wrapper` 添加暗色模式渐变覆盖（`rgba(255,255,255,0.05)` 替代 `rgba(0,0,0,0.03)`）
  - [x] SubTask 2.2: AboutPage.vue — 为暗色模式下的技能标签 hover 颜色提供更亮的替代色（Vite `#646CFF` → `#8B8FFF`、MyBatis `#C7254E` → `#E8487A`、Spring Boot `#6DB33F` → `#8FD460`）
  - [x] SubTask 2.3: AboutPage.vue — 为暗色模式下联系卡片 glow 中 GitHub 深色图标提供更亮替代色（`#181717` → `#FAFAFA`）

- [x] Task 3: 补充 prefers-reduced-motion 处理（P1）
  - [x] SubTask 3.1: ResumePage.vue — 添加 `@include anim.reduced-motion` 块，禁用 cursor blink、intro-desc 过渡、reveal 动画
  - [x] SubTask 3.2: HeroSection.vue — 在 onMounted 中检测 `prefers-reduced-motion`，若用户偏好减少动画则跳过打字机效果直接显示完整文本

- [x] Task 4: 修复 z-index 层级和定位问题（P2）
  - [x] SubTask 4.1: ScrollToTop.vue — 将 `z-50` 改为 `z-[110]`，确保按钮在樱花花瓣（z-100）之上
  - [x] SubTask 4.2: ResumePage.vue — 将侧边栏 `top: 100px` 改为 `top: 80px`

- [x] Task 5: 替换硬编码颜色为 CSS 变量（P2）
  - [x] SubTask 5.1: ExperiencePage.vue — 将 `.timeline-dot` 暗色模式 `background: #0F0F10` 改为 `background: var(--color-bg-dark-primary)`
  - [x] SubTask 5.2: AboutPage.vue — 将 `.about-timeline-card-icon` hover `color: #fff` 改为 `color: var(--color-text-inverse)`

- [x] Task 6: 补充 GitHubContributions prefers-reduced-motion（P2）
  - [x] SubTask 6.1: GitHubContributions.vue — 添加 `prefers-reduced-motion` 检测，减少动画模式下直接显示并移除过渡

- [x] Task 7: 删除 SakuraCanvas 死代码（P2）
  - [x] SubTask 7.1: 删除 `document.removeEventListener('classchange', handleThemeChange)` 行

- [x] Task 8: SCSS 架构优化（P3）
  - [x] SubTask 8.1: 将 `_animations.scss` 顶层 `@keyframes blink` 保留原位（经分析，scoped 样式中 Vue 自动添加 scope 后缀，不会冲突）
  - [x] SubTask 8.2: 将 AboutPage.vue 中 `@property --hero-glow-angle` 移至 `tailwind.css` 全局样式
  - [x] SubTask 8.3: 在 `_mixins.scss` 中增加 `xs: 360px` 断点，AboutPage.vue 中 `@media (max-width: 360px)` 改用 `@include mix.respond-to('xs')`
  - [x] SubTask 8.4: 清理 App.vue 滚动条样式中冗余的 fallback 颜色值

- [x] Task 9: 构建验证
  - [x] SubTask 9.1: 运行 `npm run build` 确认零错误零警告

# Task Dependencies
- Task 1 优先级最高（P0），应首先完成
- ~~Task 8.1（@keyframes 移入 mixin）需在 Task 3.1 之前完成~~ → 经分析保留原位，无需修改
- Task 9 依赖所有其他 Task 完成
