/**
 * 学习 / 项目时间线 —— Experience 页完整展示；About 页用精简派生。
 */

export interface ExperienceItem {
  date: string
  label: string
  title: string
  subtitle: string
  type: string
  description: string
  details: string[]
  metrics?: { label: string; value: string }[]
  icon: string
  /** About 页精简描述；缺省则截取 description */
  aboutDesc?: string
  /** About 时间线条颜色 */
  color?: string
}

export const EXPERIENCES: ExperienceItem[] = [
  {
    date: '2025.10',
    label: '开始',
    title: '前端三件套',
    subtitle: 'HTML / CSS / JavaScript',
    type: '前端',
    description:
      '系统学习前端基础知识，完成 MDN 完整教程，独立完成 50+ 练习 Demo，搭建第一个静态个人博客。',
    details: ['HTML5 语义化标签', 'CSS3 动画与响应式', 'ES6+ 新特性', 'DOM 操作与事件'],
    metrics: [{ label: '学习时长', value: '92天' }],
    icon: 'lucide:code',
    aboutDesc: '系统学习 HTML / CSS / JavaScript，搭建第一个静态个人博客',
    color: '#EC4899',
  },
  {
    date: '2026.01',
    label: '进阶',
    title: 'Vue3 框架',
    subtitle: 'Vue3 + 组合式 API',
    type: '前端',
    description: '深入学习 Vue3 组合式 API，掌握响应式原理、组件化开发与状态管理。',
    details: ['Composition API', 'Pinia 状态管理', 'Vue Router', '组件封装'],
    metrics: [{ label: '学习时长', value: '22天' }],
    icon: 'simple-icons:vuedotjs',
    aboutDesc: '深入学习 Vue3 组合式 API，掌握响应式原理与组件化开发',
    color: '#EC4899',
  },
  {
    date: '2026.02',
    label: '后端',
    title: 'Java 基础',
    subtitle: 'Java SE 核心语法',
    type: 'Java',
    description: '系统学习 Java 基础语法，掌握面向对象编程、集合框架与异常处理。',
    details: ['面向对象', '集合框架', 'IO 流', '多线程基础'],
    metrics: [{ label: '学习时长', value: '8天' }],
    icon: 'lucide:coffee',
    aboutDesc: '系统学习 Java 基础语法，掌握面向对象编程与集合框架',
    color: '#F97316',
  },
  {
    date: '2026.02',
    label: '项目',
    title: 'Vue3 小兔鲜项目',
    subtitle: '电商实战项目',
    type: '前端',
    description: '基于 Vue3 开发电商类型项目，实现商品展示、购物车、订单管理等核心功能。',
    details: ['商品列表与详情', '购物车逻辑', '支付流程', '接口对接'],
    metrics: [{ label: '项目周期', value: '24天' }],
    icon: 'lucide:shopping-cart',
    aboutDesc: '基于 Vue3 的电商实战项目，实现商品展示、购物车等核心功能',
    color: '#EC4899',
  },
  {
    date: '2026.03',
    label: '数据库',
    title: 'MySQL',
    subtitle: '关系型数据库',
    type: 'Java',
    description: '学习 MySQL 数据库，掌握 SQL 语句、索引优化与事务管理。',
    details: ['CRUD 操作', '索引优化', '事务与锁', '存储过程'],
    metrics: [{ label: '学习时长', value: '11天' }],
    icon: 'simple-icons:mysql',
    aboutDesc: '学习关系型数据库，掌握 SQL 语句、索引优化与事务管理',
    color: '#F97316',
  },
  {
    date: '2026.03',
    label: 'Web',
    title: 'Java Web',
    subtitle: 'Servlet / JSP / JDBC',
    type: 'Java',
    description: '学习 Java Web 开发基础，理解 Servlet 生命周期、JSP 页面与 JDBC 数据库连接。',
    details: ['Servlet 生命周期', 'JSP 内置对象', 'JDBC 连接池', 'MVC 模式'],
    metrics: [{ label: '学习时长', value: '36天' }],
    icon: 'lucide:globe',
    aboutDesc: '学习 Servlet / JSP / JDBC，理解 Web 开发基础与 MVC 模式',
    color: '#F97316',
  },
  {
    date: '2026.03',
    label: '组件库',
    title: 'ElementPlus',
    subtitle: 'UI 组件库实践',
    type: '前端',
    description: '学习并实践 ElementPlus 组件库，快速搭建后台管理系统界面。',
    details: ['表单组件', '表格与分页', '弹窗与消息', '主题定制'],
    metrics: [{ label: '学习时长', value: '4小时' }],
    icon: 'lucide:layout-grid',
    aboutDesc: '学习并实践 ElementPlus 组件库，快速搭建后台管理系统',
    color: '#EC4899',
  },
  {
    date: '2026.04',
    label: '项目',
    title: '苍穹外卖',
    subtitle: '外卖平台项目',
    type: 'Java',
    description: '完成苍穹外卖项目，实现用户端、商家端与骑手端的完整外卖平台功能。',
    details: ['用户注册登录', '商品管理', '订单系统', '支付对接'],
    metrics: [{ label: '项目周期', value: '14天' }],
    icon: 'lucide:utensils',
    aboutDesc: '完成外卖平台项目，实现用户端、商家端与骑手端完整功能',
    color: '#F97316',
  },
  {
    date: '2026.05',
    label: '跨端',
    title: 'uniapp',
    subtitle: '跨平台应用开发',
    type: '前端',
    description: '学习 uniapp 跨平台开发框架，实现一套代码多端运行。',
    details: ['页面路由', '条件编译', '原生插件', '打包发布'],
    metrics: [{ label: '学习时长', value: '9天' }],
    icon: 'lucide:smartphone',
    aboutDesc: '学习跨平台开发框架，实现一套代码多端运行',
    color: '#EC4899',
  },
  {
    date: '2026.05 - 2026.06',
    label: '项目',
    title: '雪屿协作云图库',
    subtitle: '企业级智能协同云图库',
    type: '前端',
    description:
      '基于 Vue3 + Ant Design + WebSocket + VueCropper 的企业级智能协同云图库平台，支持多人实时编辑、图片压缩上传与权限控制。',
    details: ['图片上传与管理', '团队协作', '权限控制', '云存储对接'],
    metrics: [{ label: '项目周期', value: '2026.05-06' }],
    icon: 'lucide:cloud',
    aboutDesc: 'Vue3 + WebSocket 企业级协同云图库，带宽降低 89%+，支持多人实时编辑',
    color: '#EC4899',
  },
  {
    date: '2026.06 - 2026.07',
    label: '项目',
    title: 'AI 驱动的数据分析平台',
    subtitle: '智能 BI 数据分析平台',
    type: '全栈',
    description:
      '上传 Excel 数据文件，AI 自动生成 ECharts 可视化图表与数据分析结论，支持实时状态推送、图表编辑导出、可拖拽仪表盘布局。',
    details: ['ECharts 可视化', 'AI 图表生成', '实时状态推送', '可拖拽仪表盘'],
    metrics: [{ label: '项目周期', value: '2026.06-07' }],
    icon: 'lucide:chart-column',
    aboutDesc: '智能 BI 平台，AI 自动生成 ECharts 图表与分析结论，图表渲染零崩溃',
    color: '#8B5CF6',
  },
]

export const EXPERIENCE_TYPE_COLORS: Record<string, string> = {
  前端: 'tag-pink',
  全栈: 'tag-violet',
  Java: 'tag-coral',
}

/** About 页精简时间线 */
export const ABOUT_TIMELINE = EXPERIENCES.map((item) => ({
  year: item.date.slice(0, 4),
  title: item.title.replace(/^Vue3 /, '').replace(/项目$/, '') || item.title,
  desc: item.aboutDesc ?? item.description,
  icon: item.icon,
  color: item.color ?? '#EC4899',
}))
