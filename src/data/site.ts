/**
 * 站点级配置 —— 导航、路由顺序、社交、GitHub 账号等。
 * 改这里即可同步 TopNav / Footer / App 转场方向 / 热力图 login。
 */

export const SITE_NAME = 'Lunesnow'
/** 导航 / 页脚品牌展示名 */
export const SITE_BRAND = 'Lunesnow-blog'
export const GITHUB_LOGIN = 'JAYTDD'
export const GITHUB_URL = `https://github.com/${GITHUB_LOGIN}`
export const JOB_TITLE = '全栈工程师和前端开发'

export interface NavItem {
  name: string
  path: string
}

/** 主导航（TopNav / Footer 共用） */
export const NAV_ITEMS: NavItem[] = [
  { name: '首页', path: '/' },
  { name: '简历', path: '/resume' },
  { name: '经历', path: '/experience' },
  { name: '关于', path: '/about' },
]

/** 路由 path → 顺序，用于方向感知页面转场 */
export const ROUTE_ORDER: Record<string, number> = Object.fromEntries(
  NAV_ITEMS.map((item, index) => [item.path, index]),
)

export interface SocialLink {
  name: string
  title: string
  href: string
  icon: string
  color?: string
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: 'GitHub',
    title: 'GitHub',
    href: GITHUB_URL,
    icon: 'simple-icons:github',
    color: '#FAFAFA',
  },
  {
    name: '掘金',
    title: '掘金',
    href: 'https://juejin.cn/user/2385290407448745',
    icon: 'simple-icons:juejin',
    color: '#1E80FF',
  },
]
