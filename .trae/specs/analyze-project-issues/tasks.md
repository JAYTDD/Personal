# Tasks

- [x] Task 1: 修复安全风险 — `.env` 加入 `.gitignore` 并创建 `.env.example`
  - [x] SubTask 1.1: 确认 `.gitignore` 中包含 `.env` 和 `.env.local` 规则
  - [x] SubTask 1.2: 创建 `.env.example` 模板文件（仅含变量名，不含真实值）
  - [x] SubTask 1.3: 确认 `.env` 未被 Git 跟踪（已在 .gitignore 中）

- [x] Task 2: 修复品牌名残留 — Footer "Resin" → "Lunesnow"
  - [x] SubTask 2.1: 修改 Footer.vue 第 106 行 `Resin` → `Lunesnow`

- [x] Task 3: 修复路由死链接
  - [x] SubTask 3.1: 修改 HomePage.vue "查看全部项目"链接，改为 GitHub 外部链接
  - [x] SubTask 3.2: 删除不可达的 ArchivePage/PlanningPage

- [x] Task 4: 修复 GitHubContributions 主题切换不响应
  - [x] SubTask 4.1: 使用 `useThemeStore` 替代本地 `isDark` ref

- [x] Task 5: 修复 AboutPage 旧域名引用
  - [x] SubTask 5.1: 移除 coderesin.xyz 链接，改为 GitHub 链接

- [x] Task 6: 同步 AboutPage 与 ResumePage 技术栈数据
  - [x] SubTask 6.1: 更新 AboutPage 的 techStack 数组为 20 项

- [x] Task 7: 修复 AboutPage 社交页脚硬编码年份
  - [x] SubTask 7.1: 将硬编码 "2025" 改为 `new Date().getFullYear()`

- [x] Task 8: 修复 AboutPage 头像使用 ico 文件
  - [x] SubTask 8.1: 暂保留 ico 文件（无替代头像资源），待后续替换

- [x] Task 9: 修复 ResumePage "下载简历"按钮行为
  - [x] SubTask 9.1: 将按钮文案改为"打印简历"，图标改为 printer

- [x] Task 10: 清理不可达页面和重复代码
  - [x] SubTask 10.1: 已删除 ArchivePage 和 PlanningPage
  - [x] SubTask 10.2: 已移除 HomePage 中未使用的 RouterLink import

# Task Dependencies
- ~~Task 3.2 需先确认用户意图再执行~~ → 已决定删除
- ~~Task 8 需用户提供头像图片或确认占位方案~~ → 暂保留 ico
- ~~Task 10.1 依赖 Task 3.2 的决策结果~~ → 已完成
