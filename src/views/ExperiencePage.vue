<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'

const activeIndex = ref(0)

const experiences = [
  {
    date: '2024.09',
    label: '入学',
    title: '赣南医科大学',
    subtitle: '物联网工程 · 本科',
    type: '教育',
    description: '大一入学，开始系统学习计算机基础知识。',
    details: ['C语言程序设计', '数据结构', '单片机原理', '计算机网络'],
    icon: 'lucide:graduation-cap',
  },
  {
    date: '2025.01',
    label: '寒假',
    title: '前端基础自学',
    subtitle: 'HTML / CSS / JavaScript',
    type: '学习',
    description: '利用寒假时间系统学习前端三件套，打下坚实基础。',
    details: ['完成 MDN 完整教程', '独立完成 50+ 练习 Demo', '搭建第一个静态个人博客'],
    icon: 'lucide:book-open',
  },
  {
    date: '2025.06',
    label: '暑假',
    title: '框架与工程化',
    subtitle: 'React / Vue / TypeScript',
    type: '学习',
    description: '深入学习现代前端技术栈，掌握工程化工具。',
    details: ['React hooks 与组件化思维', 'Vue 3 组合式 API', 'TypeScript 类型系统', 'Webpack / Vite 配置优化'],
    icon: 'lucide:code-2',
  },
  {
    date: '2025.10',
    label: '秋季',
    title: '项目实战',
    subtitle: '全栈项目开发',
    type: '项目',
    description: '将所学知识应用于实际项目，积累工程经验。',
    details: ['购物 AI 智能客服系统', 'Mini-Markdown 编辑器', 'Monorepo 架构实践', 'LangChain AI 应用开发'],
    icon: 'lucide:rocket',
  },
  {
    date: '2026.05',
    label: '现在',
    title: '前端实习',
    subtitle: '江西四角龙科技有限公司',
    type: '实习',
    description: '在导师带领下优化企业级住宿系统，取得显著成果。',
    details: ['Webpack 打包优化 8.5MB → 1.2MB', '首屏加载 4.2s → 1.1s', '加载成功率 85% → 98%', 'AI 提效：封装 Prompt Template'],
    metrics: [
      { label: '体积压缩', value: '86%' },
      { label: '速度提升', value: '3.8x' },
      { label: '成功率', value: '98%' },
    ],
    icon: 'lucide:briefcase',
  },
]

const typeColors: Record<string, string> = {
  '教育': 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800/30',
  '学习': 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800/30',
  '项目': 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/30 dark:text-violet-300 dark:border-violet-800/30',
  '实习': 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800/30',
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

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute('data-index') || '0')
          activeIndex.value = index
        }
      })
    },
    { threshold: 0, rootMargin: '-120px 0px -60% 0px' }
  )

  document.querySelectorAll('.timeline-item').forEach((el) => observer.observe(el))
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
          :key="exp.date"
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
        <p class="page-subtitle">从物联网到前端工程师的成长轨迹</p>
      </header>

      <!-- Timeline -->
      <div class="timeline">
        <div
          v-for="(exp, index) in experiences"
          :id="`exp-${index}`"
          :key="exp.date"
          :data-index="index"
          class="timeline-item"
          :style="{ animationDelay: `${index * 0.12}s` }"
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

                <!-- Metrics (for internship) -->
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

<style>
/* ===== CSS Variables ===== */
.experience-page {
  --canvas-bg: transparent;
  --pure-surface: #FFFFFF;
  --charcoal-ink: #1A1A1A;
  --warm-gray: #6B6B6B;
  --muted-sage: #9CA3AF;
  --hairline: rgba(0, 0, 0, 0.08);
  --accent-espresso: #4A3728;
  --shadow-soft: rgba(0, 0, 0, 0.04);
  --shadow-hover: rgba(0, 0, 0, 0.08);
}

html.dark .experience-page {
  --canvas-bg: transparent;
  --pure-surface: #1C1C1E;
  --charcoal-ink: #FFFFFF;
  --warm-gray: #A1A1AA;
  --muted-sage: #71717A;
  --hairline: rgba(255, 255, 255, 0.1);
  --accent-espresso: #C4A882;
  --shadow-soft: rgba(0, 0, 0, 0.4);
  --shadow-hover: rgba(0, 0, 0, 0.5);
}

/* ===== Page Layout ===== */
.experience-page {
  display: flex;
  max-width: 1100px;
  margin: 0 auto;
  padding: 16px 32px 80px;
  min-height: 100vh;
  gap: 48px;
  background: var(--canvas-bg);
  position: relative;
}

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
  color: var(--muted-sage);
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
}

.toc-item:hover {
  background: rgba(0, 0, 0, 0.02);
}

html.dark .toc-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.toc-item.active {
  background: rgba(0, 0, 0, 0.03);
}

html.dark .toc-item.active {
  background: rgba(255, 255, 255, 0.08);
}

.toc-item.active .toc-indicator {
  transform: scaleY(1);
  opacity: 1;
}

.toc-item.active .toc-title {
  color: var(--charcoal-ink);
  font-weight: 600;
}

.toc-indicator {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%) scaleY(0);
  width: 3px;
  height: 20px;
  background: var(--accent-espresso);
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
  color: var(--muted-sage);
  font-weight: 500;
  letter-spacing: 0.02em;
}

.toc-title {
  font-size: 13px;
  color: var(--warm-gray);
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
  color: var(--charcoal-ink);
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin-bottom: 4px;
  font-family: 'Playfair Display', 'Noto Serif SC', Georgia, serif;
}

.page-subtitle {
  font-size: 15px;
  color: var(--warm-gray);
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
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 0.8s cubic-bezier(0.32, 0.72, 0, 1) forwards;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
  color: var(--charcoal-ink);
  font-family: 'Geist Mono', 'SF Mono', monospace;
  letter-spacing: -0.01em;
}

.date-label {
  display: block;
  font-size: 11px;
  color: var(--muted-sage);
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
  background: var(--pure-surface);
  border: 2px solid var(--muted-sage);
  transition: all 0.4s cubic-bezier(0.32, 0.72, 0, 1);
}

html.dark .timeline-dot {
  background: #0A0A0A;
}

.timeline-dot.active {
  border-color: var(--accent-espresso);
  background: var(--accent-espresso);
  transform: scale(1.3);
  box-shadow: 0 0 0 4px rgba(74, 55, 40, 0.1);
}

html.dark .timeline-dot.active {
  box-shadow: 0 0 0 4px rgba(196, 168, 130, 0.2);
}

.timeline-line {
  position: absolute;
  top: 44px;
  bottom: -20px;
  width: 1px;
  background: repeating-linear-gradient(
    to bottom,
    var(--hairline) 0px,
    var(--hairline) 4px,
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
}

.timeline-card-wrapper:hover {
  background: linear-gradient(135deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.02) 100%);
  transform: translateY(-4px);
}

.timeline-card {
  background: var(--pure-surface);
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

.timeline-card-wrapper:hover .timeline-card {
  box-shadow:
    0 2px 4px var(--shadow-hover),
    0 8px 24px var(--shadow-hover);
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
  background: var(--bg-hover, #F5F5F5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--warm-gray);
  border: 1px solid var(--hairline);
}

html.dark .card-icon {
  background: rgba(255, 255, 255, 0.05);
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
  color: var(--charcoal-ink);
  margin-bottom: 4px;
  letter-spacing: -0.01em;
}

.card-subtitle {
  font-size: 13px;
  color: var(--warm-gray);
  margin-bottom: 12px;
  font-weight: 500;
}

.card-desc {
  font-size: 14px;
  color: var(--warm-gray);
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
  color: var(--warm-gray);
  background: var(--bg-hover, #F5F5F5);
  padding: 5px 12px;
  border-radius: 8px;
  border: 1px solid var(--hairline);
  transition: all 0.2s ease;
}

html.dark .detail-tag {
  background: rgba(255, 255, 255, 0.05);
}

.detail-tag:hover {
  border-color: var(--muted-sage);
  transform: translateY(-1px);
}

html.dark .detail-tag:hover {
  background: rgba(255, 255, 255, 0.08);
}

/* Metrics */
.metrics {
  display: flex;
  gap: 32px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--hairline);
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
  color: var(--charcoal-ink);
  font-family: 'Geist Mono', 'SF Mono', monospace;
  letter-spacing: -0.02em;
}

.metric-label {
  font-size: 11px;
  color: var(--muted-sage);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 500;
}

/* ===== Responsive ===== */
@media (max-width: 768px) {
  .experience-page {
    flex-direction: column;
    padding: 32px 20px 60px;
    gap: 32px;
  }

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
    border: 1px solid var(--hairline);
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
</style>
