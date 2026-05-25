<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'

const typeText = ref('')
const fullText = '专攻前端，往 Agent 全栈转型'
const showContent = ref(false)

onMounted(() => {
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

  // Scroll reveal animation
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
        }
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' },
  )

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
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
  'TypeScript',
  'JavaScript',
  'React',
  'Next.js',
  'Vue',
  'uniapp',
  '微信小程序',
  'Node.js',
  'Express',
  'Nest',
  'Prisma',
  'PostgreSQL',
  'Docker',
  'Webpack',
  'Vite',
  'LangChain',
  'Tailwind CSS',
  'Git',
  'Cursor',
  'Claude Code',
]
</script>

<template>
  <div class="resume-page">
    <!-- Left Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-inner">
        <!-- Name -->
        <div class="name-section">
          <h1 class="name">曾维杰</h1>
          <p class="subtitle">Resin</p>
        </div>

        <!-- Contact -->
        <div class="contact-section">
          <a href="mailto:2970768980@qq.com" class="contact-item">
            <Icon icon="lucide:mail" width="16" height="16" />
            <span>2970768980@qq.com</span>
          </a>
          <div class="contact-item">
            <Icon icon="lucide:phone" width="16" height="16" />
            <span>18079639035</span>
          </div>
          <a href="https://github.com/resinya" target="_blank" class="contact-item">
            <Icon icon="simple-icons:github" width="16" height="16" />
            <span>github.com/resinya</span>
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
          <button class="btn-primary" onclick="window.print()">
            <Icon icon="lucide:download" width="16" height="16" />
            下载简历
          </button>
          <a href="mailto:2970768980@qq.com" class="btn-secondary">
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
            <h3 class="card-title">赣南医科大学</h3>
            <span class="card-badge">2024 - 2028</span>
          </div>
          <p class="card-subtitle">物联网工程 · 本科</p>
        </div>
      </section>

      <!-- Internship -->
      <section id="internship" class="section reveal">
        <h2 class="section-title">实习经历</h2>
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">江西四角龙科技有限公司</h3>
            <span class="card-badge">实习</span>
          </div>
          <p class="card-desc">在导师的带领下优化住宿系统，取得以下成果：</p>
          <ul class="achievement-list">
            <li class="achievement-item">
              <span class="achievement-dot" />
              <div>
                <strong>Webpack 打包优化</strong>
                <span class="achievement-metric">8.5MB → 1.2MB</span>
                <span class="achievement-metric">4.2s → 1.1s</span>
              </div>
            </li>
            <li class="achievement-item">
              <span class="achievement-dot" />
              <div>
                <strong>稳定性优化</strong>
                <span class="achievement-metric">加载成功率 85% → 98%</span>
              </div>
            </li>
            <li class="achievement-item">
              <span class="achievement-dot" />
              <div>
                <strong>列表数据优化</strong>
                <span>虚拟滚动、分页加载、图片懒加载</span>
              </div>
            </li>
            <li class="achievement-item">
              <span class="achievement-dot" />
              <div>
                <strong>AI 提效实践</strong>
                <span>封装 Prompt Template，沉淀 Skills 模块</span>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <!-- Projects -->
      <section id="projects" class="section reveal">
        <h2 class="section-title">项目经历</h2>
        <div class="bento-grid">
          <div class="card bento-card">
            <div class="card-header">
              <h3 class="card-title">购物 AI 智能客服系统</h3>
              <span class="card-badge">全栈</span>
            </div>
            <p class="card-desc">
              电商 AI 客服系统，包含基础对话、订单查询 Agent、知识库问答三个核心模块
            </p>
            <ul class="project-list">
              <li>Express + LangChain.js 搭建 AI 服务层，支持流式 SSE 输出</li>
              <li>实现 ReAct Agent，定义订单查询、物流跟踪等 Tool</li>
              <li>RAG 知识库问答系统，通过 pgvector 实现语义检索</li>
            </ul>
          </div>
          <div class="card bento-card">
            <div class="card-header">
              <h3 class="card-title">Mini-Markdown 编辑器</h3>
              <span class="card-badge">开源</span>
            </div>
            <p class="card-desc">pnpm + Monorepo 架构，自定义 AST 解析器与可扩展编辑器</p>
            <ul class="project-list">
              <li>基于 CodeMirror 完成模块化扩展架构</li>
              <li>基于 Rollup 完成高性能自定义 AST 解析器</li>
              <li>基于事件驱动机制完成动态工具栏系统</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Skills -->
      <section id="skills" class="section reveal">
        <h2 class="section-title">专业技能</h2>
        <div class="skills-grid">
          <div class="card skill-card">
            <h4 class="skill-category">JavaScript & 浏览器</h4>
            <p class="skill-detail">熟练掌握 ES6+，深入理解 Event Loop、原型链及闭包</p>
          </div>
          <div class="card skill-card">
            <h4 class="skill-category">前端框架</h4>
            <p class="skill-detail">熟悉 React、SSR 服务端渲染、Redux、Zustand 状态管理</p>
          </div>
          <div class="card skill-card">
            <h4 class="skill-category">工程化体系</h4>
            <p class="skill-detail">熟练掌握 Webpack、Vite，路由懒加载、代码分割</p>
          </div>
          <div class="card skill-card">
            <h4 class="skill-category">后端扩展</h4>
            <p class="skill-detail">熟悉 Node.js、Express、Nest、Docker 部署、CI/CD</p>
          </div>
          <div class="card skill-card">
            <h4 class="skill-category">Vibe Coding</h4>
            <p class="skill-detail">熟练使用 Cursor、Trae、Claude Code，AI 驱动工作流</p>
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
  --bg-primary: #fafafa;
  --bg-card: #ffffff;
  --text-primary: #1a1a1a;
  --text-secondary: #6b7280;
  --text-muted: #9ca3af;
  --border-light: #f0f0f0;
  --border-medium: #e5e5e5;
  --bg-hover: #f5f5f5;
  --shadow-color: rgba(0, 0, 0, 0.04);
  --metric-bg: #f5f5f5;
}

html.dark .resume-page {
  --bg-primary: #0a0a0a;
  --bg-card: #141414;
  --text-primary: #f5f5f5;
  --text-secondary: #b0b0b5;
  --text-muted: #8e8e93;
  --border-light: #2c2c2e;
  --border-medium: #3a3a3c;
  --bg-hover: #1f1f1f;
  --shadow-color: rgba(255, 255, 255, 0.06);
  --metric-bg: #1f1f1f;
}

/* ===== Page Layout ===== */
.resume-page {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 80px;
  max-width: 1100px;
  margin: 0 auto;
  padding: 64px 32px;
  min-height: 100vh;
  background: var(--bg-primary);
  transition: background 0.3s ease;
}

/* ===== Sidebar ===== */
.sidebar {
  position: relative;
}

.sidebar-inner {
  position: sticky;
  top: 100px;
  display: flex;
  flex-direction: column;
  gap: 32px;
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

html.dark .name {
  color: #ffffff;
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
  color: var(--text-primary);
}

html.dark .contact-item {
  color: #b0b0b5;
}

html.dark .contact-item:hover {
  color: #ffffff;
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

html.dark .nav-link {
  color: #b0b0b5;
}

html.dark .nav-link:hover {
  color: #ffffff;
  background: #2c2c2e;
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
  background: var(--text-primary);
  color: var(--bg-primary);
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
  border-color: var(--text-primary);
}

html.dark .btn-primary {
  background: #f5f5f5;
  color: #0a0a0a;
}

html.dark .btn-primary:hover {
  background: #ffffff;
  opacity: 1;
}

html.dark .btn-secondary {
  color: #f5f5f5;
  border-color: #3a3a3c;
}

html.dark .btn-secondary:hover {
  border-color: #f5f5f5;
}

/* ===== Main Content ===== */
.main-content {
  display: flex;
  flex-direction: column;
  gap: 80px;
  padding-bottom: 64px;
}

.section {
  scroll-margin-top: 100px;
}

.section-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin-bottom: 20px;
  transition: color 0.3s ease;
}

html.dark .section-title {
  color: #a0a0a5;
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

html.dark .typewriter {
  color: #ffffff;
}

.cursor {
  display: inline-block;
  width: 2px;
  height: 28px;
  background: var(--text-primary);
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

html.dark .intro-desc {
  color: #c0c0c5;
}

.intro-desc.show {
  opacity: 1;
  transform: translateY(0);
}

/* ===== Scroll Reveal Animation ===== */
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity 0.6s ease,
    transform 0.6s ease;
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
  transition: all 0.3s ease;
}

.card:hover {
  border-color: var(--border-medium);
  box-shadow: 0 4px 20px var(--shadow-color);
  transform: translateY(-2px);
}

html.dark .card {
  background: #1a1a1c;
  border-color: #2a2a2c;
}

html.dark .card:hover {
  border-color: #4a4a4c;
  box-shadow: 0 4px 24px rgba(255, 255, 255, 0.08);
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

html.dark .card-title {
  color: #ffffff;
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
  transition: all 0.3s ease;
}

html.dark .card-badge {
  color: #a0a0a5;
  background: #2a2a2c;
}

.card-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 4px;
  transition: color 0.3s ease;
}

html.dark .card-subtitle {
  color: #c0c0c5;
}

.card-desc {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-top: 12px;
  transition: color 0.3s ease;
}

html.dark .card-desc {
  color: #c0c0c5;
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

html.dark .achievement-item {
  color: #c0c0c5;
}

.achievement-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--text-primary);
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

html.dark .achievement-metric {
  background: #323234;
  color: #e5e5ea;
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

html.dark .project-list li {
  color: #c0c0c5;
}

.project-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 9px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--text-muted);
  transition: background 0.3s ease;
}

html.dark .project-list li::before {
  background: #8e8e93;
}

/* Skills Grid */
.skills-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.skill-card {
  padding: 20px 24px;
}

.skill-category {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
  transition: color 0.3s ease;
}

html.dark .skill-category {
  color: #ffffff;
}

.skill-detail {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
  transition: color 0.3s ease;
}

html.dark .skill-detail {
  color: #c0c0c5;
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
  color: var(--text-primary);
  border-color: var(--border-medium);
  background: var(--bg-card);
}

html.dark .tech-tag {
  background: #2c2c2e;
  border-color: #3a3a3c;
  color: #b0b0b5;
}

html.dark .tech-tag:hover {
  color: #f5f5f5;
  border-color: #4a4a4c;
  background: #323234;
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
    gap: 32px;
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
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 32px 20px;
  }

  .sidebar-inner {
    position: static;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: 16px;
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
