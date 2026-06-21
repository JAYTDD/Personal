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
  'Vue 3',
  'Vite',
  'Pinia',
  'Vue Router',
  'ElementPlus',
  'Ant Design',
  'ECharts',
  'ESLint',
  'Prettier',
  'Git',
  'Java',
  'Spring Boot',
  'MyBatis',
  'MySQL',
  'UniApp',
  'WebSocket',
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
            <Icon icon="lucide:printer" width="16" height="16" />
            打印简历
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
          熟悉前端工程化与 Vue3 生态，善于利用 AI
          工具链提升开发效率，具备全栈开发经验，追求代码质量与用户体验的平衡。
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
        <ul class="skill-list">
          <li>
            熟悉 HTML/CSS/JavaScript/TypeScript，熟悉 ES6+ 语法新特性，掌握 Flex、Grid 等布局方式
          </li>
          <li>能够使用 Ant Design、ECharts、ElementPlus，具备快速查阅官方文档解决问题的能力</li>
          <li>熟悉 Vue3 生态系统，包括 Vite、Vue Router、Pinia，了解组合式 API 和生命周期管理</li>
          <li>
            熟悉前端工程化与代码规范，能够使用 ESLint + Prettier 保障项目代码质量，熟悉 Git 协作
          </li>
          <li>能够使用 Claude Code、Cursor、OpenCode 等工具高效开发前端项目</li>
          <li>了解 UniApp 跨平台开发</li>
          <li>
            了解 Java 基础、MySQL 数据库以及 Spring Boot、MyBatis 框架，具备 Java 后端开发经验
          </li>
        </ul>
      </section>

      <!-- Internship -->
      <section id="internship" class="section reveal">
        <h2 class="section-title">实习经历</h2>
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">准备暑假实习中</h3>
            <span class="card-badge">待开始</span>
          </div>
          <p class="card-desc">
            正在积极准备暑期实习，已系统学习前端和 Java 全栈技术，正在完成企业级项目实战。
          </p>
        </div>
      </section>

      <!-- Projects -->
      <section id="projects" class="section reveal">
        <h2 class="section-title">项目经历</h2>
        <div class="bento-grid">
          <div class="card bento-card">
            <div class="card-header">
              <h3 class="card-title">AI 驱动的数据分析平台</h3>
              <span class="card-badge">全栈</span>
            </div>
            <p class="card-desc">
              上传 Excel 数据文件，AI 自动生成 ECharts
              可视化图表与数据分析结论，支持实时状态推送、图表编辑导出、可拖拽仪表盘布局的智能 BI
              平台
            </p>
            <ul class="project-list">
              <li>
                ECharts 配置运行时校验机制，实现三重容错解析与危险字段过滤，结合 onErrorCaptured
                兜底，实现图表渲染零崩溃
              </li>
              <li>
                封装通用轮询 usePolling Hook，集成指数退避策略与 Page Visibility
                API，页面不可见时自动暂停轮询，减少约 60% 无效请求
              </li>
              <li>支持 AI 异步生成图表、实时状态推送与图表编辑导出</li>
            </ul>
            <a
              href="https://github.com/JAYTDD/lunesnow-Intelligent-BI"
              target="_blank"
              class="project-link"
            >
              <Icon icon="simple-icons:github" width="14" height="14" />
              github.com/JAYTDD/lunesnow-Intelligent-BI
            </a>
          </div>
          <div class="card bento-card">
            <div class="card-header">
              <h3 class="card-title">雪屿协作云图库</h3>
              <span class="card-badge">前端</span>
            </div>
            <p class="card-desc">
              基于 Vue3 + Ant Design + WebSocket + VueCropper 的企业级智能协同云图库平台
            </p>
            <ul class="project-list">
              <li>
                前端防抖 + 操作聚合策略，带宽降低 89%+；单图互斥锁 + 三态权限控制解决多人编辑冲突
              </li>
              <li>心跳保活与指数退避重连机制保障协同编辑连接稳定性</li>
              <li>
                集成 compressorjs 客户端压缩，上传体积减少 70%+；支持文件/URL
                双模式上传及图片裁剪，3 路并发上传
              </li>
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
  box-shadow:
    0 0 0 1px rgba(236, 72, 153, 0.35),
    0 0 18px rgba(236, 72, 153, 0.14);
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

/* Project Link */
.project-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 14px;
  font-size: 13px;
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.2s ease;
}

.project-link:hover {
  color: var(--accent);
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

/* Skill List */
.skill-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skill-list li {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.7;
  padding-left: 16px;
  position: relative;
  transition: color 0.3s ease;
}

.skill-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 10px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--accent);
  transition: background 0.3s ease;
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
