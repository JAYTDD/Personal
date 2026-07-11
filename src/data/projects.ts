/**
 * 项目统一数据源 —— 首页项目卡片 & 简历项目经历共用。
 *
 * 改这里即可同步两处展示；字段兼顾 GitHub 仓库信息与简历详情。
 * 数据对齐自简历（2026-07）。
 */

export interface ProjectItem {
  /** GitHub 仓库名 */
  name: string
  /** 展示标题（中文名） */
  title: string
  /** 一句话描述（首页卡片 / 简历简介） */
  description: string
  /** GitHub 地址 */
  html_url: string
  /** 主语言（决定卡片渐变色） */
  language: string | null
  stargazers_count: number
  /** 标签 */
  topics: string[]
  /** ISO 时间，用于首页排序 */
  updated_at: string
  fork: boolean
  /** 简历：项目周期 */
  period: string
  /** 简历：角色标签（全栈 / 前端） */
  role?: string
  /** 简历：技术栈文案 */
  stack: string
  /** 简历：亮点列表 */
  highlights: string[]
  /** 是否在简历「项目经历」中展示 */
  showOnResume: boolean
}

export const PROJECTS: ProjectItem[] = [
  {
    name: 'lunesnow-Intelligent-BI',
    title: 'AI 驱动的数据分析平台',
    // 以下 description / stack / highlights 对齐自《简历.pdf》
    description:
      '上传 Excel 数据文件，AI 自动生成 ECharts 可视化图表与数据分析结论，支持实时状态推送、图表安全渲染、数据筛选与导出、自由拖拽仪表盘的智能 BI 平台',
    html_url: 'https://github.com/JAYTDD/lunesnow-Intelligent-BI',
    language: 'Java',
    stargazers_count: 0,
    topics: ['vue3', 'typescript', 'echarts', 'spring-boot', 'bi', 'ai'],
    updated_at: '2026-07-10T15:13:08Z',
    fork: false,
    period: '2026.06 - 2026.07',
    /** 简历侧展示角色标签：全栈 */
    role: '全栈',
    stack: 'Vue3 + ElementPlus + SpringBoot 3 + RabbitMQ',
    highlights: [
      '解决 AI 配置格式混乱且含危险字段导致白屏的问题：采用三重容错解析 + 危险字段过滤 + onErrorCaptured 兜底，实现渲染零崩溃',
      '解决多任务频繁轮询、后台仍持续请求造成的无效流量问题：采用指数退避 + Page Visibility 自动暂停，无效请求减少约 60%',
      '解决仪表盘自由布局时传统拖拽频繁卡顿的问题：采用 transform:translate 位移替代 top/left，保持拖拽流畅，避免触发页面重排',
      '基于图表 ID 水平动态分表实现用户级数据隔离与单表查询提效，并结合 Redisson 令牌桶 + Redis 计数构建接口 QPS 与用户并发任务的双层限流，保障高并发稳定',
    ],
    showOnResume: true,
  },
  {
    name: 'lunesnow-pictrue',
    title: '雪屿协作云图库',
    // 以下 description / stack / highlights 对齐自《简历.pdf》
    description:
      '为个人和团队打造的智能协同云图库，支持图片管理、空间权限控制、AI 图像处理、WebSocket 多人实时协作与 ECharts 数据可视化分析',
    html_url: 'https://github.com/JAYTDD/lunesnow-pictrue',
    language: 'Java',
    stargazers_count: 0,
    topics: ['vue3', 'websocket', 'collaboration', 'cloud-gallery', 'java'],
    updated_at: '2026-07-10T16:34:04Z',
    fork: false,
    period: '2026.05 - 2026.06',
    /** 简历侧展示角色标签：前端 */
    role: '前端',
    stack: 'Vue3 + Ant Design + WebSocket + VueCropper',
    highlights: [
      '采用节流 + 操作聚合策略，带宽降低 89%+；结合单图互斥锁 + 三态权限控制解决多人编辑冲突；通过心跳保活 + 指数退避重连 + 断线消息队列实现稳定长连接',
      '基于 vue-virtual 实现虚拟滚动，仅渲染可视区域 DOM，渲染耗时优化至 50ms 以内；骨架屏占位消除白屏感知；IntersectionObserver 驱动无限滚动加载，含冷却保护机制',
      '解决批量上传并发失控与流量浪费问题：基于 Promise 信号量的 3 路并发控制器，可暂停/继续/取消；集成 compressorjs 客户端压缩，上传体积减少 70%+',
      '通过路由级懒加载 + Vite 分包策略，实现首屏只加载必需代码，大依赖拆成独立 chunk 按需加载；前端响应式权限工厂控制按钮显隐，解决前端权限散乱易漏判的问题',
    ],
    showOnResume: true,
  },
  {
    name: 'Personal',
    title: '个人博客站点',
    description:
      '个人博客站点（Vue 3 + Vite + Tailwind 4），含樱花动效、GitHub 贡献热力图与项目展示',
    html_url: 'https://github.com/JAYTDD/Personal',
    language: 'Vue',
    stargazers_count: 0,
    topics: ['vue', 'typescript', 'vite', 'tailwindcss', 'portfolio'],
    updated_at: '2026-06-22T06:28:50Z',
    fork: false,
    period: '2026.05 - 至今',
    stack: 'Vue3、TypeScript、Vite、Tailwind CSS 4',
    highlights: [],
    showOnResume: false,
  },
  {
    name: 'wallPaper',
    title: '壁纸浏览应用',
    description: '壁纸浏览与收藏应用，基于 Vue 3 实现沉浸式图片展示与分类筛选',
    html_url: 'https://github.com/JAYTDD/wallPaper',
    language: 'Vue',
    stargazers_count: 0,
    topics: ['vue', 'wallpaper', 'frontend'],
    updated_at: '2026-05-20T01:16:03Z',
    fork: false,
    period: '2026.05',
    stack: 'Vue3',
    highlights: [],
    showOnResume: false,
  },
  {
    name: 'vibe-coding-TodoList',
    title: 'Vibe Coding TodoList',
    description: 'Vibe Coding 实践的 TodoList 应用，TypeScript 全栈实现，支持任务管理与状态持久化',
    html_url: 'https://github.com/JAYTDD/vibe-coding-TodoList',
    language: 'TypeScript',
    stargazers_count: 0,
    topics: ['typescript', 'todolist', 'vibe-coding'],
    updated_at: '2026-05-14T09:11:00Z',
    fork: false,
    period: '2026.02 - 2026.05',
    stack: 'TypeScript',
    highlights: [],
    showOnResume: false,
  },
  {
    name: 'Vue3-smallrabbit-project',
    title: '小兔鲜电商实战',
    description:
      '小兔鲜电商实战 —— 基于 Vue3 的电商项目，实现商品展示、购物车、订单管理等核心功能',
    html_url: 'https://github.com/JAYTDD/Vue3-smallrabbit-project',
    language: 'Vue',
    stargazers_count: 0,
    topics: ['vue3', 'ecommerce', 'shopping-cart', 'frontend'],
    updated_at: '2026-03-07T07:39:46Z',
    fork: false,
    period: '2026.02 - 2026.03',
    stack: 'Vue3',
    highlights: [],
    showOnResume: false,
  },
]

/** 简历页项目列表（按 period 倒序：先 BI 后云图库） */
export const RESUME_PROJECTS = PROJECTS.filter((p) => p.showOnResume).sort((a, b) =>
  b.period.localeCompare(a.period),
)
