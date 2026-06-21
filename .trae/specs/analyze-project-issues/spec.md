# Lunesnow-blog 项目问题分析 Spec

## Why
项目经过多轮迭代后积累了若干一致性问题、死代码、数据不同步和安全风险，需要系统性梳理并修复，以保障代码质量和部署安全。

## What Changes
- 修复品牌名残留（Footer 仍为 "Resin"）
- 修复路由死链接（HomePage 链接到不存在的 `/projects` 路由）
- 移除不可达页面（ArchivePage、PlanningPage 未注册路由）
- 修复 AboutPage 旧域名引用（coderesin.xyz）
- 修复 AboutPage 与 ResumePage 技术栈数据不同步
- 修复 GitHubContributions 暗色模式不响应主题切换
- 修复 AboutPage 社交页脚年份硬编码
- 修复 AboutPage 头像使用 ico 文件
- 修复 ResumePage "下载简历"按钮行为与文案不符
- 添加 `.env.example` 并将 `.env` 加入 `.gitignore`
- 统一各页面重复的 CSS 变量定义

## Impact
- Affected code: Footer.vue, HomePage.vue, AboutPage.vue, ResumePage.vue, GitHubContributions.vue, router/index.ts, App.vue, .gitignore, .env.example
- Affected capabilities: 品牌一致性、路由导航、主题切换响应、数据一致性、部署安全

## ADDED Requirements

### Requirement: 品牌名统一
系统 SHALL 在所有用户可见位置使用 "Lunesnow" 品牌名，不得残留 "Resin" 或其他旧名。

#### Scenario: Footer 品牌名
- **WHEN** 用户查看页脚
- **THEN** 版权信息显示 "Lunesnow" 而非 "Resin"

### Requirement: 路由完整性
系统 SHALL 确保所有导航链接指向已注册的路由，所有已注册路由均有对应导航入口。

#### Scenario: 首页项目链接
- **WHEN** 用户点击首页"查看全部项目"链接
- **THEN** 导航到已注册的路由页面，而非 404

#### Scenario: 不可达页面
- **WHEN** ArchivePage 和 PlanningPage 存在但未注册路由
- **THEN** 要么注册路由并添加导航入口，要么移除这些文件

### Requirement: 数据一致性
系统 SHALL 在 AboutPage 和 ResumePage 的技术栈数据保持一致。

#### Scenario: 技术栈标签
- **WHEN** 用户查看 AboutPage 技能标签和 ResumePage 技术栈标签
- **THEN** 两处展示的技术列表应一致（或 AboutPage 作为更详细的展示包含 ResumePage 的所有技术）

### Requirement: 主题切换响应
系统 SHALL 在用户切换亮/暗主题时，GitHub 贡献热力图颜色实时更新。

#### Scenario: 切换主题
- **WHEN** 用户从暗色模式切换到亮色模式
- **THEN** 热力图单元格颜色从暗色色阶切换到亮色色阶

### Requirement: 环境变量安全
系统 SHALL 不将含真实密钥的 `.env` 文件提交到版本控制，并提供 `.env.example` 模板。

#### Scenario: 新开发者克隆项目
- **WHEN** 新开发者克隆仓库
- **THEN** 可通过 `.env.example` 了解所需环境变量，且仓库中不含真实密钥

## MODIFIED Requirements

### Requirement: AboutPage 头像图片
AboutPage 的头像 SHALL 使用合适的头像图片，而非 favicon ico 文件。当前 `src="../../public/Lunesnow.ico"` 是网站图标，不适合作为头像展示。

### Requirement: ResumePage 下载按钮
ResumePage 的"下载简历"按钮 SHALL 明确其行为。当前按钮调用 `window.print()`，但文案为"下载简历"，存在误导。应改为"打印简历"或实现真正的 PDF 下载。

## REMOVED Requirements

### Requirement: 旧域名引用
**Reason**: 项目已从 coderesin.xyz 迁移，AboutPage 中的 `https://www.coderesin.xyz` 链接应更新。
**Migration**: 更新为当前有效域名或移除。

---

## 问题清单（按严重程度排序）

### P0 - 安全/阻断
1. **`.env` 含真实 GitHub Token 可能已泄露** - `.gitignore` 中未排除 `.env`，Token 已提交到仓库

### P1 - 功能缺陷
2. **Footer 品牌名残留 "Resin"** - [Footer.vue:106](file:///d:/ProjectSave/Personal/src/components/Footer.vue#L106)
3. **首页链接到不存在的 `/projects` 路由** - [HomePage.vue:147](file:///d:/ProjectSave/Personal/src/views/HomePage.vue#L147)
4. **GitHubContributions 暗色模式不响应主题切换** - [GitHubContributions.vue:146](file:///d:/ProjectSave/Personal/src/components/GitHubContributions.vue#L146) 仅在 onMounted 时读取一次 isDark
5. **AboutPage 旧域名引用** - [AboutPage.vue:503](file:///d:/ProjectSave/Personal/src/views/AboutPage.vue#L503) `https://www.coderesin.xyz`

### P2 - 数据不一致
6. **AboutPage 与 ResumePage 技术栈不同步** - AboutPage 仍有 Flutter/Node.js/Ajax，ResumePage 已替换为 Vite/Pinia/Vue Router 等
7. **AboutPage 社交页脚年份硬编码 "2025"** - [AboutPage.vue:625](file:///d:/ProjectSave/Personal/src/views/AboutPage.vue#L625)

### P3 - 体验/代码质量
8. **AboutPage 头像使用 ico 文件** - [AboutPage.vue:443](file:///d:/ProjectSave/Personal/src/views/AboutPage.vue#L443)
9. **ResumePage "下载简历"按钮实际调用 print()** - [ResumePage.vue:9-11](file:///d:/ProjectSave/Personal/src/views/ResumePage.vue#L9-L11)
10. **ArchivePage 和 PlanningPage 不可达** - 文件存在但未注册路由
11. **CSS 变量重复定义** - AboutPage/ResumePage/ExperiencePage 各自定义相同的主题变量
12. **App.vue routeOrder 缺少 archive/planning** - [App.vue:14-19](file:///d:/ProjectSave/Personal/src/App.vue#L14-L19)
