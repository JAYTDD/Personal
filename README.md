<div align="center">

# Lunesnow · 个人站

**Vue 3 + Vite 8 + Tailwind CSS 4 的前端作品集 / 简历站**

[![CI](https://github.com/JAYTDD/Personal/actions/workflows/ci.yml/badge.svg)](https://github.com/JAYTDD/Personal/actions/workflows/ci.yml)
![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vuedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-8B8FFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)
![Netlify](https://img.shields.io/badge/Deploy-Netlify-00C7B7?logo=netlify&logoColor=white)

**[在线访问 →](https://www.coderesin.xyz)**

*这里几乎所有的动效都是手写的 —— 没有 GSAP，没有 Three.js，只有 CSS 与 rAF。*

</div>

---

## ✨ 特性

### 🎨 沉浸式展示

- **粒子文字 Morph** —— Hero 主标题由 ~2000 个 canvas 粒子组成，鼠标划过四散排斥，定时在 Lunesnow / VUE / TYPESCRIPT 间流动变形
- **Billboard 图标云** —— 30 个技能/爱好图标沿倾斜椭球轨道巡游，始终正面朝向观者；支持拖拽甩动、惯性阻尼、悬停减速，悬停判定基于距离而非 DOM 命中（后层图标零延迟响应）
- **兴趣游乐场** —— 弹力球物理沙盒：抓起爱好球甩出去，重力、碰撞、反弹一应俱全
- **樱花粒子 / 方向感知页面转场 / 打字机 / 滚动 reveal** 等十余项微动效

### 🧲 微交互

- **磁性圆形徽章** —— 简历页「联系我」徽章吸附光标，外圈环形文字旋转，点击复制联系电话
- **方向感知卡片流光** —— 首页项目卡 hover 时一道光从指针进入方向滑入，边框流光沿边缘环绕
- **滚动速度标题** —— 经历页大标题随滚动速度产生倾斜，停下回正
- **主题切换圆形扩散** —— View Transitions API 从点击位置扩散切换明暗
- 数字滚动、热力图波浪入场、导航 pill 滑动、简历标题一次性流光……

> 以上动效**全部带 `prefers-reduced-motion` 降级**，且不依赖任何动画库。

### 📄 简历导出

自定义导出弹窗：左侧实时预览，右侧多选项（PDF 多页 A4 / PNG 长图 × 标准 2x / 高清 3x），纯前端生成，不经过系统打印。`html2canvas-pro` 与 `jspdf` 仅在点击导出时按需加载，主包零增加。

### 🔥 性能

- 路由意图预取（hover 触发 + 相邻页 idle 预取）与方向感知转场
- `content-visibility` 屏外跳过渲染；樱花画布 rAF 离屏暂停
- Iconify 本地子集（构建时裁剪），运行时**零图标请求**
- 精细分包：vendor / icons / 按需 chunk

## 🛠 技术栈

| 层 | 技术 |
|---|---|
| 框架 | Vue 3.5（`script setup`）· TypeScript 6 · Vue Router · Pinia |
| 构建 | Vite 8 · Tailwind CSS 4 · SCSS |
| 后端 | Netlify Functions（GitHub 贡献热力图 GraphQL 代理） |
| 质量 | ESLint + oxlint 双 lint · vue-tsc · GitHub Actions CI |
| 图标 | Iconify 本地子集（`lucide` + `simple-icons`） |

## 🚀 快速开始

```sh
npm install
npm run dev
```

打开 `http://localhost:5200` —— 热力图由内置的 Vite 插件本地模拟 Netlify Function，开箱即用，无需 netlify-cli。

前提：在 `.env` 写入 GitHub Token（**不要加 `VITE_` 前缀**）：

```sh
GITHUB_TOKEN=你的真实token
```

## 📜 可用脚本

| 命令 | 说明 |
|---|---|
| `npm run dev` | Vite 开发（含本地 Function 模拟），端口 5200 |
| `npm run dev:netlify` | Netlify Dev（可选，行为与线上一致） |
| `npm run build` | type-check + 图标子集裁剪 + 产物构建 |
| `npm run type-check` | vue-tsc 全量类型检查 |
| `npm run lint` | oxlint + eslint 双重检查 |
| `npm run icons:build` | 扫描 `src/` 重新生成图标子集（新增图标引用后需要跑） |

## 📁 目录结构

```
├─ plugins/
│  └─ netlifyFunctionsDev.ts   # dev-only：本地模拟 /api/github/* Function
├─ netlify/functions/
│  └─ github-contributions.ts  # 热力图 GraphQL 代理（token 仅存服务端）
├─ scripts/
│  └─ build-icon-subset.mjs    # 全量扫描 src 生成图标子集
└─ src/
   ├─ components/  # 壳层组件与独立展示模块（含 ParticleText / SkillBallpit）
   ├─ composables/ # 打字机、滚动 reveal、磁性吸附、数字滚动等复用逻辑
   ├─ data/        # ★ 所有内容的唯一数据源，改内容只改这里
   ├─ utils/       # 剪贴板、语言渐变等工具
   └─ views/       # 四个页面
```

## ☁️ 部署（Netlify）

- Build：`npm run build` · Publish：`dist` · Functions：`netlify/functions`
- 环境变量：在 Netlify 后台配置 `GITHUB_TOKEN`（服务端专用）
- `netlify.toml` 已配置：`/api/github/*` → Function、SPA fallback、安全响应头、`/assets/*` 长期缓存

## 🔐 安全设计

- `GITHUB_TOKEN` 仅存在于服务端 Function，浏览器包中零痕迹；`.env` 已被 gitignore
- Function 带 login 白名单（防 PAT 滥用）、5s 超时硬上限、成功响应 5 分钟缓存

## 🧪 CI

GitHub Actions 在 push / PR 时依次执行 **lint → type-check → build-only**。

## 📄 内容维护

站点文案、项目、经历全部收敛在 `src/data/` 四个文件，改数据即改站点，无需触碰组件。

---

<div align="center">

Made with ❤️ and rAF by **Lunesnow**

</div>
