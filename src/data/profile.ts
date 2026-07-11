/**
 * 个人资料 —— 姓名、求职意向、教育、联系方式、技能列表。
 * 简历 / 关于 页共用，避免多处硬编码漂移。
 */

import { GITHUB_URL, JOB_TITLE, SITE_NAME } from './site'

export const PROFILE = {
  name: '黄晓伟',
  displayName: SITE_NAME,
  jobTitle: JOB_TITLE,
  email: '363807870@qq.com',
  phone: '13410972606',
  wechat: '13410972606',
  qq: '363807870',
  githubUrl: GITHUB_URL,
  githubLabel: 'github.com/JAYTDD',
  location: '广东 · 深圳',
  education: {
    school: '佛山大学',
    major: '计算机科学与技术 · 本科',
    period: '2024.09 - 2028.06',
  },
  aboutBlurb:
    'Lunesnow 的前端作品集与简历站，基于 Vue + Vite + TypeScript 构建。记录前端工程实践、工具链，以及日常学习中的思考与总结。',
  signatureLines: ['青春属于表白 阳光属于窗台', '而我想我属于一个拥有你的未来'] as const,
} as const

/** 简历侧栏锚点 */
export const RESUME_NAV = [
  { id: 'education', label: '教育' },
  { id: 'skills', label: '技能' },
  { id: 'projects', label: '项目' },
] as const

/** 简历「专业技能」条目 */
export const RESUME_SKILL_BULLETS = [
  '熟悉 HTML/CSS/JavaScript/TypeScript，熟悉 ES6+ 语法新特性，掌握 Flex、Grid 等布局方式',
  '能够使用 Ant Design、ECharts、ElementPlus，具备快速查阅官方文档解决问题的能力',
  '熟悉 Vue3 生态系统，包括 Vite、Vue Router、Pinia，了解组合式 API 和生命周期管理',
  '熟悉前端工程化与代码规范，能够使用 ESLint + Prettier 保障项目代码质量，熟悉 Git 协作',
  '能够使用 Claude Code、Cursor、OpenCode 等工具高效开发前端项目',
  '了解 UniApp 跨平台开发',
  '了解 Java 基础、MySQL 数据库以及 Spring Boot、MyBatis 框架，具备 Java 后端开发经验',
] as const

/** 简历底部技术栈标签 */
export const RESUME_TECH_TAGS = [
  'Vue3',
  'TypeScript',
  'JavaScript',
  'HTML/CSS',
  'Vite',
  'Pinia',
  'Vue Router',
  'Ant Design Vue',
  'ElementPlus',
  'ECharts',
  'WebSocket',
  'VueCropper',
  'compressorjs',
  'UniApp',
  'ESLint',
  'Prettier',
  'Git',
  'Java',
  'Spring Boot 3',
  'MyBatis',
  'MySQL',
  'Redis',
  'Redisson',
  'RabbitMQ',
] as const

export interface SkillTag {
  name: string
  icon: string
  color: string
  level: number
}

/** 关于页技能网格 */
export const ABOUT_TECH_STACK: SkillTag[] = [
  { name: 'HTML', icon: 'simple-icons:html5', color: '#E34F26', level: 90 },
  { name: 'CSS', icon: 'simple-icons:css3', color: '#1572B6', level: 85 },
  { name: 'JavaScript', icon: 'simple-icons:javascript', color: '#F7DF1E', level: 85 },
  { name: 'TypeScript', icon: 'simple-icons:typescript', color: '#3178C6', level: 75 },
  { name: 'Vue', icon: 'simple-icons:vuedotjs', color: '#4FC08D', level: 88 },
  { name: 'Vite', icon: 'simple-icons:vite', color: '#8B8FFF', level: 80 },
  { name: 'Pinia', icon: 'lucide:database', color: '#FFD859', level: 78 },
  { name: 'Vue Router', icon: 'simple-icons:vuedotjs', color: '#4FC08D', level: 76 },
  { name: 'ElementPlus', icon: 'lucide:layout-grid', color: '#409EFF', level: 72 },
  { name: 'Ant Design', icon: 'lucide:palette', color: '#0170FE', level: 70 },
  { name: 'ECharts', icon: 'lucide:bar-chart-3', color: '#AA344D', level: 68 },
  { name: 'ESLint', icon: 'lucide:circle-check', color: '#4B32C3', level: 75 },
  { name: 'Prettier', icon: 'lucide:align-left', color: '#F7B93E', level: 74 },
  { name: 'Git', icon: 'simple-icons:git', color: '#F05032', level: 82 },
  { name: 'MySQL', icon: 'simple-icons:mysql', color: '#4479A1', level: 70 },
  { name: 'Java', icon: 'lucide:coffee', color: '#007396', level: 65 },
  { name: 'Spring Boot', icon: 'simple-icons:springboot', color: '#8FD460', level: 60 },
  { name: 'MyBatis', icon: 'lucide:layers', color: '#E8487A', level: 58 },
  { name: 'UniApp', icon: 'lucide:smartphone', color: '#2B9939', level: 72 },
  { name: 'WebSocket', icon: 'lucide:cable', color: '#6B7280', level: 65 },
]

export const HOBBIES = [
  { name: '无畏契约', icon: 'lucide:target' },
  { name: '三角洲', icon: 'lucide:crosshair' },
  { name: '听音乐', icon: 'lucide:music' },
  { name: 'JayChou', icon: 'lucide:mic' },
  { name: '羽毛球', icon: 'lucide:volleyball' },
  { name: '画画', icon: 'lucide:palette' },
  { name: '追剧', icon: 'lucide:tv' },
] as const

export const CONTACTS = [
  { label: '微信', value: PROFILE.wechat, icon: 'lucide:message-circle', color: '#07C160' },
  { label: 'QQ', value: PROFILE.qq, icon: 'lucide:at-sign', color: '#12B7F5' },
  { label: '电话', value: PROFILE.phone, icon: 'lucide:phone', color: '#F97316' },
  { label: '邮箱', value: PROFILE.email, icon: 'lucide:mail', color: '#EA4335' },
] as const
