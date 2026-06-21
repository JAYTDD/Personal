<script setup lang="ts">
import { nextTick, ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'

const activeIndex = ref(0)

interface ExperienceItem {
  date: string
  label: string
  title: string
  subtitle: string
  type: string
  description: string
  details: string[]
  metrics?: { label: string; value: string }[]
  icon: string
}

const experiences: ExperienceItem[] = [
  {
    date: '2025.10',
    label: '开始',
    title: '前端三件套',
    subtitle: 'HTML / CSS / JavaScript',
    type: '前端',
    description: '系统学习前端基础知识，完成 MDN 完整教程，独立完成 50+ 练习 Demo，搭建第一个静态个人博客。',
    details: ['HTML5 语义化标签', 'CSS3 动画与响应式', 'ES6+ 新特性', 'DOM 操作与事件'],
    metrics: [
      { label: '学习时长', value: '92天' },
    ],
    icon: 'lucide:code',
  },
  {
    date: '2026.01',
    label: '进阶',
    title: 'Vue3 框架',
    subtitle: 'Vue3 + 组合式 API',
    type: '前端',
    description: '深入学习 Vue3 组合式 API，掌握响应式原理、组件化开发与状态管理。',
    details: ['Composition API', 'Pinia 状态管理', 'Vue Router', '组件封装'],
    metrics: [
      { label: '学习时长', value: '22天' },
    ],
    icon: 'simple-icons:vuedotjs',
  },
  {
    date: '2026.02',
    label: '后端',
    title: 'Java 基础',
    subtitle: 'Java SE 核心语法',
    type: 'Java',
    description: '系统学习 Java 基础语法，掌握面向对象编程、集合框架与异常处理。',
    details: ['面向对象', '集合框架', 'IO 流', '多线程基础'],
    metrics: [
      { label: '学习时长', value: '8天' },
    ],
    icon: 'devicon-plain:java',
  },
  {
    date: '2026.02',
    label: '项目',
    title: 'Vue3 小兔鲜项目',
    subtitle: '电商实战项目',
    type: '前端',
    description: '基于 Vue3 开发电商类型项目，实现商品展示、购物车、订单管理等核心功能。',
    details: ['商品列表与详情', '购物车逻辑', '支付流程', '接口对接'],
    metrics: [
      { label: '项目周期', value: '24天' },
    ],
    icon: 'lucide:shopping-cart',
  },
  {
    date: '2026.03',
    label: '数据库',
    title: 'MySQL',
    subtitle: '关系型数据库',
    type: 'Java',
    description: '学习 MySQL 数据库，掌握 SQL 语句、索引优化与事务管理。',
    details: ['CRUD 操作', '索引优化', '事务与锁', '存储过程'],
    metrics: [
      { label: '学习时长', value: '11天' },
    ],
    icon: 'simple-icons:mysql',
  },
  {
    date: '2026.03',
    label: 'Web',
    title: 'Java Web',
    subtitle: 'Servlet / JSP / JDBC',
    type: 'Java',
    description: '学习 Java Web 开发基础，理解 Servlet 生命周期、JSP 页面与 JDBC 数据库连接。',
    details: ['Servlet 生命周期', 'JSP 内置对象', 'JDBC 连接池', 'MVC 模式'],
    metrics: [
      { label: '学习时长', value: '36天' },
    ],
    icon: 'lucide:globe',
  },
  {
    date: '2026.03',
    label: '组件库',
    title: 'ElementPlus',
    subtitle: 'UI 组件库实践',
    type: '前端',
    description: '学习并实践 ElementPlus 组件库，快速搭建后台管理系统界面。',
    details: ['表单组件', '表格与分页', '弹窗与消息', '主题定制'],
    metrics: [
      { label: '学习时长', value: '4小时' },
    ],
    icon: 'lucide:layout-grid',
  },
  {
    date: '2026.04',
    label: '项目',
    title: '苍穹外卖',
    subtitle: '外卖平台项目',
    type: 'Java',
    description: '完成苍穹外卖项目，实现用户端、商家端与骑手端的完整外卖平台功能。',
    details: ['用户注册登录', '商品管理', '订单系统', '支付对接'],
    metrics: [
      { label: '项目周期', value: '14天' },
    ],
    icon: 'lucide:utensils',
  },
  {
    date: '2026.05',
    label: '跨端',
    title: 'uniapp',
    subtitle: '跨平台应用开发',
    type: '前端',
    description: '学习 uniapp 跨平台开发框架，实现一套代码多端运行。',
    details: ['页面路由', '条件编译', '原生插件', '打包发布'],
    metrics: [
      { label: '学习时长', value: '9天' },
    ],
    icon: 'lucide:smartphone',
  },
  {
    date: '2026.05',
    label: '进行中',
    title: '智能协同云图库',
    subtitle: '企业级项目实战',
    type: '前端',
    description: '正在进行的智能协同云图库项目，实现图片管理、团队协作等核心功能。',
    details: ['图片上传与管理', '团队协作', '权限控制', '云存储对接'],
    icon: 'lucide:cloud',
  },
]

const typeColors: Record<string, string> = {
  '前端': 'tag-pink',
  'Java': 'tag-coral',
  '学习': 'tag-violet',
  '项目': 'tag-pink',
}

const scrollTo = (index: number) => {
  activeIndex.value = index
  const el = document.getElementById(`exp-${index}`)
  if (el) {
    const offset = 120
    const top = el.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top, behavior: 'smooth' })
  }
}

onMounted(async () => {
  await nextTick()

  // Keep the active item in sync with direct navigation or refresh
  const current = document.querySelector('.timeline-item.revealed') as HTMLElement | null
  if (!current) {
    const firstItem = document.querySelector('.timeline-item') as HTMLElement | null
    if (firstItem) {
      firstItem.classList.add('revealed')
      activeIndex.value = Number(firstItem.dataset.index || 0)
    }
  }

  // Stagger-reveal first-screen items, observe the rest
  const items = document.querySelectorAll('.timeline-item')
  let firstScreenIndex = 0
  items.forEach((el) => {
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight) {
      ;(el as HTMLElement).style.setProperty(
        '--reveal-delay',
        `${firstScreenIndex * 120}ms`,
      )
      el.classList.add('revealed')
      firstScreenIndex++
    }
  })

  // Observe remaining items for scroll-reveal
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute('data-index') || '0')
          activeIndex.value = index
          entry.target.classList.add('revealed')
        }
      })
    },
    { threshold: 0.1, rootMargin: '-80px 0px -40% 0px' },
  )
  items.forEach((el) => {
    if (!el.classList.contains('revealed')) {
      observer.observe(el)
    }
  })
})
</script>

<template>
  <div class="experience-page">
    <!-- Fixed TOC Sidebar -->
    <nav class="toc-sidebar">
      <div class="toc-header">目录</div>
      <div class="toc-list">
        <button
          v-for="(exp, index) in experiences"
          :key="exp.date + exp.title"
          class="toc-item"
          :class="{ active: activeIndex === index }"
          @click="scrollTo(index)"
        >
          <span class="toc-indicator" />
          <div class="toc-info">
            <span class="toc-label">{{ exp.label }}</span>
            <span class="toc-title">{{ exp.title }}</span>
          </div>
        </button>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Header -->
      <header class="page-header">
        <h1 class="page-title">我的学习之路</h1>
        <p class="page-subtitle">从前端基础到 Java 全栈的成长轨迹</p>
      </header>

      <!-- Timeline -->
      <div class="timeline">
        <div
          v-for="(exp, index) in experiences"
          :id="`exp-${index}`"
          :key="exp.date + exp.title"
          :data-index="index"
          class="timeline-item"
        >
          <!-- Left: Date -->
          <div class="timeline-left">
            <div class="timeline-date">
              <span class="date-text">{{ exp.date }}</span>
              <span class="date-label">{{ exp.label }}</span>
            </div>
            <div class="timeline-node">
              <div class="timeline-dot" :class="{ active: activeIndex === index }" />
            </div>
            <div v-if="index < experiences.length - 1" class="timeline-line" />
          </div>

          <!-- Right: Card with Double-Bezel -->
          <div class="timeline-card-wrapper">
            <div class="timeline-card">
              <div class="card-main">
                <!-- Icon + Type -->
                <div class="card-badge-row">
                  <div class="card-icon">
                    <Icon :icon="exp.icon" width="16" height="16" />
                  </div>
                  <span class="card-type" :class="typeColors[exp.type]">{{ exp.type }}</span>
                </div>

                <!-- Title + Subtitle -->
                <h3 class="card-title">{{ exp.title }}</h3>
                <p class="card-subtitle">{{ exp.subtitle }}</p>

                <!-- Description -->
                <p class="card-desc">{{ exp.description }}</p>

                <!-- Details -->
                <div class="detail-tags">
                  <span v-for="detail in exp.details" :key="detail" class="detail-tag">
                    {{ detail }}
                  </span>
                </div>

                <!-- Metrics -->
                <div v-if="exp.metrics" class="metrics">
                  <div v-for="m in exp.metrics" :key="m.label" class="metric-item">
                    <span class="metric-value">{{ m.value }}</span>
                    <span class="metric-label">{{ m.label }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../styles/variables' as vars;
@use '../styles/animations' as anim;
@use '../styles/mixins' as mix;

.experience-page {
  @include vars.page-variables;

  html.dark & {
    @include vars.page-variables-dark;
  }

  /* ===== Page Layout ===== */
  display: flex;
  max-width: 1100px;
  margin: 0 auto;
  padding: 16px 32px 80px;
  min-height: 100vh;
  gap: 48px;
  background: var(--page-bg);
  position: relative;

  /* ===== Fixed TOC Sidebar ===== */
  .toc-sidebar {
    position: sticky;
    top: 100px;
    width: 200px;
    height: fit-content;
    flex-shrink: 0;
    z-index: 1;
  }

  .toc-header {
    font-size: 11px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.2em;
    margin-bottom: 20px;
    padding-left: 12px;
  }

  .toc-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .toc-item {
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 10px;
    border: none;
    background: none;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.32, 0.72, 0, 1);
    width: 100%;
    text-align: left;

    &:hover {
      background: rgba(0, 0, 0, 0.02);

      html.dark & {
        background: rgba(255, 255, 255, 0.05);
      }
    }

    &.active {
      background: rgba(0, 0, 0, 0.03);

      html.dark & {
        background: rgba(255, 255, 255, 0.08);
      }

      .toc-indicator {
        transform: scaleY(1);
        opacity: 1;
      }

      .toc-title {
        color: var(--text-primary);
        font-weight: 600;
      }
    }
  }

  .toc-indicator {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%) scaleY(0);
    width: 3px;
    height: 20px;
    background: var(--accent);
    border-radius: 0 2px 2px 0;
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.32, 0.72, 0, 1);
  }

  .toc-info {
    display: flex;
    flex-direction: column;
    gap: 3px;
    margin-left: 8px;
  }

  .toc-label {
    font-size: 11px;
    color: var(--text-muted);
    font-weight: 500;
    letter-spacing: 0.02em;
  }

  .toc-title {
    font-size: 13px;
    color: var(--text-secondary);
    line-height: 1.3;
    transition: all 0.3s ease;
  }

  /* ===== Main Content ===== */
  .main-content {
    flex: 1;
    min-width: 0;
    z-index: 1;
  }

  /* Header */
  .page-header {
    margin-bottom: 8px;
  }

  .page-title {
    font-size: 42px;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.03em;
    line-height: 1.1;
    margin-bottom: 4px;
    font-family: 'Geist', ui-sans-serif, system-ui, sans-serif;
  }

  .page-subtitle {
    font-size: 15px;
    color: var(--text-secondary);
    font-weight: 400;
    letter-spacing: 0.01em;
  }

  /* ===== Timeline ===== */
  .timeline {
    display: flex;
    flex-direction: column;
  }

  .timeline-item {
    display: flex;
    gap: 28px;
    @include anim.reveal(30px);
  }

  /* Left: Date & Node */
  .timeline-left {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 80px;
    flex-shrink: 0;
    padding-top: 0;
  }

  .timeline-date {
    text-align: center;
    margin-bottom: 10px;
  }

  .date-text {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
    font-family: 'Geist Mono', 'SF Mono', monospace;
    letter-spacing: -0.01em;
  }

  .date-label {
    display: block;
    font-size: 11px;
    color: var(--text-muted);
    margin-top: 2px;
  }

  .timeline-node {
    position: relative;
    z-index: 2;
  }

  .timeline-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--card-bg);
    border: 2px solid var(--text-muted);
    transition: all 0.4s cubic-bezier(0.32, 0.72, 0, 1);

    html.dark & {
      background: var(--color-bg-dark-primary);
    }

    &.active {
      border-color: var(--accent);
      background: var(--accent);
      transform: scale(1.3);
      box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.1);

      html.dark & {
        box-shadow: 0 0 0 4px rgba(244, 114, 182, 0.2);
      }
    }
  }

  .timeline-line {
    position: absolute;
    top: 44px;
    bottom: -20px;
    width: 1px;
    background: repeating-linear-gradient(
      to bottom,
      var(--border-light) 0px,
      var(--border-light) 4px,
      transparent 4px,
      transparent 8px
    );
    z-index: 1;
  }

  /* Right: Fixed Size Card with Double-Bezel */
  .timeline-card-wrapper {
    flex: 1;
    padding: 1px;
    border-radius: 16px;
    background: linear-gradient(135deg, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0.01) 100%);
    margin-bottom: 12px;
    transition: all 0.5s cubic-bezier(0.32, 0.72, 0, 1);
    max-width: 520px;
    min-height: 180px;

    &:hover {
      background: linear-gradient(135deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.02) 100%);
      transform: translateY(-4px);

      .timeline-card {
        box-shadow:
          0 2px 4px var(--shadow-hover),
          0 8px 24px var(--shadow-hover);
      }
    }

    html.dark & {
      background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);

      &:hover {
        background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%);
      }
    }
  }

  .timeline-card {
    background: var(--card-bg);
    border-radius: 15px;
    padding: 24px;
    box-shadow:
      0 1px 2px var(--shadow-soft),
      0 4px 12px var(--shadow-soft);
    transition: all 0.5s cubic-bezier(0.32, 0.72, 0, 1);
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  /* Card rotation for Z-axis cascade */
  .timeline-item:nth-child(odd) .timeline-card-wrapper {
    transform: rotate(-0.3deg);
  }

  .timeline-item:nth-child(even) .timeline-card-wrapper {
    transform: rotate(0.3deg);
  }

  .timeline-item:nth-child(odd) .timeline-card-wrapper:hover,
  .timeline-item:nth-child(even) .timeline-card-wrapper:hover {
    transform: rotate(0deg) translateY(-4px);
  }

  .card-badge-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 14px;
  }

  .card-icon {
    width: 32px;
    height: 32px;
    border-radius: 10px;
    background: var(--bg-hover);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
    border: 1px solid var(--border-light);

    html.dark & {
      background: rgba(255, 255, 255, 0.05);
    }
  }

  .card-type {
    font-size: 10px;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 20px;
    border: 1px solid;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .card-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 4px;
    letter-spacing: -0.01em;
  }

  .card-subtitle {
    font-size: 13px;
    color: var(--text-secondary);
    margin-bottom: 12px;
    font-weight: 500;
  }

  .card-desc {
    font-size: 14px;
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: 16px;
  }

  /* Detail Tags */
  .detail-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .detail-tag {
    font-size: 12px;
    color: var(--text-secondary);
    background: var(--bg-hover);
    padding: 5px 12px;
    border-radius: 8px;
    border: 1px solid var(--border-light);
    transition: all 0.2s ease;

    html.dark & {
      background: rgba(255, 255, 255, 0.05);
    }

    &:hover {
      border-color: var(--accent);
      color: var(--accent);
      transform: translateY(-1px);
    }
  }

  /* Metrics */
  .metrics {
    display: flex;
    gap: 32px;
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px solid var(--border-light);
  }

  .metric-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .metric-value {
    font-size: 24px;
    font-weight: 700;
    color: var(--text-primary);
    font-family: 'Geist Mono', 'SF Mono', monospace;
    letter-spacing: -0.02em;
  }

  .metric-label {
    font-size: 11px;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 500;
  }

  /* ===== Responsive ===== */
  @include mix.respond-to('lg') {
    flex-direction: column;
    padding: 32px 20px 60px;
    gap: 32px;

    .toc-sidebar {
      position: static;
      width: 100%;
    }

    .toc-list {
      flex-direction: row;
      gap: 8px;
      overflow-x: auto;
      padding-bottom: 4px;
    }

    .toc-header {
      display: none;
    }

    .toc-item {
      flex-shrink: 0;
      padding: 8px 16px;
      border: 1px solid var(--border-light);
      border-radius: 20px;
    }

    .toc-indicator {
      display: none;
    }

    .toc-info {
      flex-direction: row;
      align-items: center;
      gap: 6px;
      margin-left: 0;
    }

    .page-title {
      font-size: 32px;
    }

    .page-header {
      margin-bottom: 32px;
    }

    .timeline-left {
      width: 65px;
    }

    .timeline-card-wrapper {
      margin-bottom: 16px;
    }

    .timeline-card {
      padding: 18px;
    }

    .metrics {
      gap: 24px;
    }

    .metric-value {
      font-size: 20px;
    }
  }

  /* Reduced motion */
  @include anim.reduced-motion {
    .timeline-item {
      opacity: 1;
      transform: none;
      transition: none;
    }
  }
}
</style>
