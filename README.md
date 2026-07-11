# Lunesnow 个人站

Vue 3 + Vite 8 + Tailwind 4 的前端作品集 / 简历站。

- 站点：https://www.coderesin.xyz
- 求职意向：前端开发工程师

## 技术栈

- Vue 3.5（`script setup`）+ TypeScript + Vue Router + Pinia
- Vite 8 + Tailwind CSS 4 + SCSS
- Netlify SPA + Functions（GitHub 贡献热力图代理）
- Iconify 本地 subset（构建时裁剪）

## 本地开发

```sh
npm install
npm run dev          # 纯前端，端口 5200
```

热力图依赖 Netlify Function，需要本地带 Functions 启动：

```sh
# 1. 在 .env 写入（不要用 VITE_ 前缀）
# GITHUB_TOKEN=ghp_xxx

# 2. 启动
npm run dev:netlify
```

## 环境变量

| 变量 | 位置 | 说明 |
|---|---|---|
| `GITHUB_TOKEN` | Netlify / 本地 `.env` | **仅服务端** Function 使用，切勿加 `VITE_` 前缀 |
| `ALLOWED_GITHUB_LOGIN` | 可选 | Function 白名单，默认 `JAYTDD` |

参考 `.env.example`。

## 常用脚本

```sh
npm run dev            # Vite 开发
npm run dev:netlify    # Netlify Dev（含 Functions）
npm run build          # type-check + icons:build + vite build
npm run type-check
npm run lint
npm run icons:build    # 扫描源码生成 iconify subset
```

## CI

GitHub Actions（`.github/workflows/ci.yml`）在 push / PR 时运行：

`lint` → `type-check` → `build-only`

## 数据源（改内容从这里）

| 文件 | 职责 |
|---|---|
| `src/data/projects.ts` | 首页项目卡片 + 简历项目经历 |
| `src/data/experience.ts` | 学习时间线（Experience / About） |
| `src/data/profile.ts` | 姓名 / 联系 / 技能 / 教育 |
| `src/data/site.ts` | 导航 / 社交 / GitHub 账号 / 站点名 |

## 部署

Netlify：

- Build：`npm run build`
- Publish：`dist`
- Functions：`netlify/functions`
- 环境变量：配置 `GITHUB_TOKEN`（服务端）

`netlify.toml` 已配置：

- `/api/github/*` → Function 代理
- SPA fallback
- 安全响应头 + `/assets/*` 长期缓存

## 项目结构（简）

```
src/
  components/     # 壳层与首页模块
  views/          # 页面
  data/           # 统一静态数据
  composables/    # 工具函数（语言渐变等）
  styles/         # SCSS 变量 / 动画 / mixin
  assets/         # Tailwind + icon subset
netlify/functions/
  github-contributions.ts
```
