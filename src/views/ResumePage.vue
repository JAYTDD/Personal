<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'

const typeText = ref('')
const fullText = '全栈工程师和前端开发'
const showContent = ref(false)

function handlePrint() {
  window.print()
}

onMounted(async () => {
  // Typewriter effect
  let i = 0
  const timer = setInterval(() => {
    if (i < fullText.length) {
      typeText.value += fullText.charAt(i)
      i++
    } else {
      clearInterval(timer)
      setTimeout(() => {
        showContent.value = true
      }, 200)
    }
  }, 80)

  await nextTick()

  // Scroll reveal — immediately reveal visible, then observe for scroll
  const revealElements = document.querySelectorAll<HTMLElement>('.reveal')
  const revealNow = () => {
    revealElements.forEach((el) => {
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight * 0.95) {
        el.classList.add('revealed')
      }
    })
  }

  revealNow()

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
        }
      })
    },
    { threshold: 0.08, rootMargin: '120px 0px -10% 0px' },
  )

  revealElements.forEach((el) => {
    if (!el.classList.contains('revealed')) {
      observer.observe(el)
    }
  })

  window.addEventListener('resize', revealNow, { passive: true })
})

const navItems = [
  { id: 'intro', label: '简介' },
  { id: 'education', label: '教育' },
  { id: 'internship', label: '实习' },
  { id: 'projects', label: '项目' },
  { id: 'skills', label: '技能' },
]

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

const techStack = [
  'HTML',
  'CSS',
  'JavaScript',
  'TypeScript',
  'Vue',
  'MySQL',
  'Java',
  'Spring Boot',
  'UniApp',
  'Flutter',
  'Node.js',
  'Ajax',
]
</script>

<template>
  <div class="resume-page">
    <!-- Left Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-inner">
        <!-- Name -->
        <div class="name-section">
          <h1 class="name">黄晓伟</h1>
          <p class="subtitle">Lunesnow</p>
        </div>

        <!-- Contact -->
        <div class="contact-section">
          <a href="mailto:363807870@qq.com" class="contact-item">
            <Icon icon="lucide:mail" width="16" height="16" />
            <span>363807870@qq.com</span>
          </a>
          <div class="contact-item">
            <Icon icon="lucide:phone" width="16" height="16" />
            <span>13410972606</span>
          </div>
          <a href="https://github.com/JAYTDD" target="_blank" class="contact-item">
            <Icon icon="simple-icons:github" width="16" height="16" />
            <span>github.com/JAYTDD</span>
          </a>
        </div>

        <!-- Nav -->
        <nav class="nav-section">
          <button
            v-for="item in navItems"
            :key="item.id"
            class="nav-link"
            @click="scrollTo(item.id)"
          >
            {{ item.label }}
          </button>
        </nav>

        <!-- CTA -->
        <div class="cta-section">
          <button class="btn-primary" @click="handlePrint">
            <Icon icon="lucide:download" width="16" height="16" />
            下载简历
          </button>
          <a href="mailto:363807870@qq.com" class="btn-secondary">
            <Icon icon="lucide:send" width="16" height="16" />
            联系我
          </a>
        </div>
      </div>
    </aside>

    <!-- Right Content -->
    <main class="main-content">
      <!-- Intro -->
      <section id="intro" class="section">
        <div class="typewriter">
          <span class="type-text">{{ typeText }}</span>
          <span class="cursor" />
        </div>
        <p class="intro-desc" :class="{ show: showContent }">
          热爱技术，专注于前端工程化与 AI
          应用开发。善于利用现代工具链提升开发效率，追求代码质量与用户体验的完美平衡。
        </p>
      </section>

      <!-- Education -->
      <section id="education" class="section reveal">
        <h2 class="section-title">教育经历</h2>
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">佛山大学</h3>
            <span class="card-badge">2024 - 2028</span>
          </div>
          <p class="card-subtitle">计算机科学与技术 · 本科</p>
        </div>
      </section>

      <!-- Skills -->
      <section id="skills" class="section reveal">
        <h2 class="section-title">专业技能</h2>
        <div class="skills-grid skills-grid--six">
          <div class="card skill-card">
            <h4 class="skill-category">前端基础</h4>
            <p class="skill-detail">HTML5 语义化、CSS3 布局动画与响应式、JavaScript ES6+ 与 DOM / BOM。</p>
          </div>
          <div class="card skill-card">
            <h4 class="skill-category">Vue 生态</h4>
            <p class="skill-detail">Vue 3 组合式 API、Pinia 状态管理、Vue Router 路由与守卫。</p>
          </div>
          <div class="card skill-card">
            <h4 class="skill-category">工程化</h4>
            <p class="skill-detail">Vite 构建与配置、组件封装与模块化开发、Git 协作与版本管理。</p>
          </div>
          <div class="card skill-card">
            <h4 class="skill-category">Java 后端</h4>
            <p class="skill-detail">Java SE 基础语法、Spring Boot / MyBatis-Plus、MySQL 设计与优化。</p>
          </div>
          <div class="card skill-card">
            <h4 class="skill-category">跨端开发</h4>
            <p class="skill-detail">UniApp 跨平台开发、Flutter 移动端基础、多端适配与发布。</p>
          </div>
          <div class="card skill-card">
            <h4 class="skill-category">协作与工具</h4>
            <p class="skill-detail">Ajax / Axios 数据交互、Node.js 基础与脚本工具、接口联调与问题排查。</p>
          </div>
        </div>
      </section>

      <!-- Internship -->
      <section id="internship" class="section reveal">
        <h2 class="section-title">实习经历</h2>
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">准备暑假实习中</h3>
            <span class="card-badge">待开始</span>
          </div>
          <p class="card-desc">正在积极准备暑期实习，已系统学习前端和 Java 全栈技术，正在完成企业级项目实战。</p>
        </div>
      </section>

      <!-- Projects -->
      <section id="projects" class="section reveal">
        <h2 class="section-title">项目经历</h2>
        <div class="bento-grid">
          <div class="card bento-card">
            <div class="card-header">
              <h3 class="card-title">智能协同云图库</h3>
              <span class="card-badge">全栈</span>
            </div>
            <p class="card-desc">
              基于 Vue 3 + Spring Boot + COS + WebSocket 的企业级智能协同云图库平台，支持图片存管、内容检索、权限控制、实时协同等企业主流业务场景
            </p>
            <ul class="project-list">
              <li>Vue 3 + Vite + Ant Design Vue 搭建前端，Pinia 状态管理</li>
              <li>Spring Boot + MySQL + Redis + Caffeine 构建高性能后端</li>
              <li>实现图片上传、审核、搜索、分享、批量管理等核心功能</li>
              <li>支持私有空间、团队空间、实时协同编辑等企业级功能</li>
            </ul>
          </div>
          <div class="card bento-card">
            <div class="card-header">
              <h3 class="card-title">Vue3 小兔鲜电商项目</h3>
              <span class="card-badge">前端</span>
            </div>
            <p class="card-desc">基于 Vue3 开发的电商类型项目，实现商品展示、购物车、订单管理等核心功能</p>
            <ul class="project-list">
              <li>Vue 3 + Vite + ElementPlus 构建用户端界面</li>
              <li>实现商品列表、商品详情、购物车、订单流程</li>
              <li>封装通用组件，实现路由守卫和权限控制</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Tech Stack -->
      <section class="section reveal">
        <h2 class="section-title">技术栈</h2>
        <div class="tech-tags">
          <span v-for="tech in techStack" :key="tech" class="tech-tag">
            {{ tech }}
          </span>
        </div>
      </section>
    </main>
  </div>
</template>

<style>
/* ===== CSS Variables for Theme ===== */
.resume-page {
  --bg-primary: var(--color-bg-primary);
  --bg-card: var(--color-text-inverse);
  --text-primary: var(--color-text-primary);
  --text-secondary: var(--color-text-secondary);
  --text-muted: var(--color-text-tertiary);
  --border-light: var(--color-border-default);
  --border-medium: var(--color-border-hover);
  --bg-hover: var(--color-bg-secondary);
  --shadow-color: rgba(0, 0, 0, 0.04);
  --metric-bg: var(--color-bg-secondary);
  --accent: var(--color-brand-pink);
}

html.dark .resume-page {
  --bg-primary: var(--color-bg-dark-primary);
  --bg-card: var(--color-bg-dark-secondary);
  --text-primary: var(--color-text-dark-primary);
  --text-secondary: var(--color-text-dark-secondary);
  --text-muted: var(--color-text-dark-tertiary);
  --border-light: var(--color-border-dark);
  --border-medium: var(--color-border-dark-hover);
  --bg-hover: var(--color-bg-dark-tertiary);
  --shadow-color: rgba(255, 255, 255, 0.06);
  --metric-bg: var(--color-bg-dark-tertiary);
  --accent: var(--color-brand-pink-light);
}

/* ===== Page Layout ===== */
.resume-page {
  display: flex;
  max-width: 1100px;
  margin: 0 auto;
  padding: 48px 32px 120px;
  min-height: 100vh;
  background: var(--bg-primary);
  transition: background 0.3s ease;
  gap: 40px;
}

/* ===== Sidebar ===== */
.sidebar {
  position: sticky;
  top: 100px;
  width: 280px;
  flex-shrink: 0;
  z-index: 10;
  align-self: flex-start;
}

.sidebar-inner {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* ===== Main Content ===== */
.main-content {
  flex: 1;
  min-width: 0;
}

.name-section {
  border-bottom: 1px solid var(--border-medium);
  padding-bottom: 24px;
}

.name {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
  line-height: 1.1;
  transition: color 0.3s ease;
}

.subtitle {
  font-size: 14px;
  color: var(--text-muted);
  margin-top: 4px;
  font-weight: 500;
  transition: color 0.3s ease;
}

/* Contact */
.contact-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.contact-item:hover {
  color: var(--accent);
}

/* Nav */
.nav-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-link {
  text-align: left;
  padding: 8px 12px;
  font-size: 14px;
  color: var(--text-muted);
  background: none;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.nav-link:hover {
  color: var(--text-primary);
  background: var(--bg-hover);
}

/* CTA */
.cta-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn-primary,
.btn-secondary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.btn-primary {
  background: var(--accent);
  color: var(--color-text-inverse);
  border: none;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-secondary {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-medium);
}

.btn-secondary:hover {
  border-color: var(--accent);
  color: var(--accent);
}

/* ===== Main Content ===== */
.main-content {
  display: flex;
  flex-direction: column;
  gap: 44px;
  padding-bottom: 48px;
}

.section {
  scroll-margin-top: 88px;
}

.section-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin-bottom: 14px;
  transition: color 0.3s ease;
}

/* Typewriter */
.typewriter {
  font-size: 28px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
  min-height: 40px;
  transition: color 0.3s ease;
}

.cursor {
  display: inline-block;
  width: 2px;
  height: 28px;
  background: var(--accent);
  margin-left: 2px;
  animation: blink 1s step-end infinite;
  vertical-align: text-bottom;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

.intro-desc {
  font-size: 16px;
  line-height: 1.7;
  color: var(--text-secondary);
  max-width: 560px;
  opacity: 0;
  transform: translateY(12px);
  transition: all 0.6s ease;
}

.intro-desc.show {
  opacity: 1;
  transform: translateY(0);
}

/* ===== Scroll Reveal Animation ===== */
.reveal {
  opacity: 0;
  transform: translateY(16px);
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;
  will-change: opacity, transform;
}

.reveal.revealed {
  opacity: 1;
  transform: translateY(0);
}
.reveal:first-child {
  scroll-margin-top: 0;
}

/* ===== Cards ===== */
.card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 16px;
  padding: 28px;
  transition:
    transform 0.12s ease,
    border-color 0.12s ease,
    box-shadow 0.12s ease,
    background-color 0.12s ease;
  will-change: transform, box-shadow, border-color;
}

.card:hover {
  border-color: var(--border-medium);
  box-shadow: 0 0 0 1px rgba(236, 72, 153, 0.35), 0 0 18px rgba(236, 72, 153, 0.14);
  transform: translateY(-2px) scale(1.006);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.card-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.card-badge {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  background: var(--bg-hover);
  padding: 4px 10px;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition:
    color 0.15s ease,
    background-color 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}

.card-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 4px;
  transition: color 0.3s ease;
}

.card-desc {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-top: 12px;
  transition: color 0.3s ease;
}

/* Achievement List */
.achievement-list {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.achievement-item {
  display: flex;
  gap: 12px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-secondary);
  transition: color 0.3s ease;
}

.achievement-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  margin-top: 8px;
  flex-shrink: 0;
  transition: background 0.3s ease;
}

.achievement-metric {
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
  background: var(--metric-bg);
  padding: 2px 8px;
  border-radius: 4px;
  margin-left: 8px;
  transition: all 0.3s ease;
}

/* Bento Grid */
.bento-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.project-list {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.project-list li {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
  padding-left: 16px;
  position: relative;
  transition: color 0.3s ease;
}

.project-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 9px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--accent);
  transition: background 0.3s ease;
}

/* Skills Grid */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.skills-grid--six {
  grid-template-columns: 1fr;
}

.skill-card {
  padding: 18px 20px;
}

.skill-category {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
  transition: color 0.15s ease;
}

.skill-detail {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
  transition: color 0.15s ease;
}

/* Tech Tags */
.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-tag {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  background: var(--bg-hover);
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid var(--border-light);
  transition: all 0.2s ease;
}

.tech-tag:hover {
  color: var(--accent);
  border-color: var(--accent);
  background: var(--bg-card);
}

/* ===== Print Styles ===== */
@media print {
  .resume-page {
    display: block;
    padding: 40px;
    background: #ffffff !important;
    color: #1a1a1a !important;
  }

  .theme-toggle,
  .nav-section,
  .cta-section {
    display: none !important;
  }

  .sidebar {
    margin-bottom: 32px;
  }

  .sidebar-inner {
    position: static;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }

  .name-section {
    border-bottom: 1px solid #e5e5e5;
    grid-column: 1 / -1;
  }

  .main-content {
    gap: 28px;
  }

  .section {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .card {
    border: 1px solid #e5e5e5;
    box-shadow: none !important;
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .card:hover {
    transform: none !important;
  }

  .reveal {
    opacity: 1 !important;
    transform: none !important;
  }

  .tech-tag {
    border: 1px solid #e5e5e5;
    background: #f5f5f5;
  }

  .achievement-metric {
    background: #f5f5f5;
  }
}

/* ===== Responsive ===== */
@media (max-width: 768px) {
  .resume-page {
    flex-direction: column;
    padding: 32px 20px;
    gap: 24px;
  }

  .sidebar {
    position: relative;
    top: auto;
    left: auto;
    width: auto;
  }

  .sidebar-inner {
    position: static;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: 16px;
  }

  .main-content {
    margin-left: 0;
  }

  .name-section {
    border-bottom: none;
    padding-bottom: 0;
  }

  .nav-section {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .cta-section {
    flex-direction: row;
  }

  .main-content {
    gap: 48px;
  }
}
</style>
