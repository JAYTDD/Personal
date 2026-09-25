<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { RESUME_PROJECTS } from '@/data/projects'
import { PROFILE, RESUME_NAV, RESUME_SKILL_BULLETS, RESUME_TECH_TAGS } from '@/data/profile'
import { useTypewriter } from '@/composables/useTypewriter'
import { useScrollReveal } from '@/composables/useScrollReveal'
import ResumeExportModal from '@/components/ResumeExportModal.vue'
import CopyToast from '@/components/CopyToast.vue'
import { copyText } from '@/utils/clipboard'
import { useMagnetic } from '@/composables/useMagnetic'

const showContent = ref(false)
let showContentTimer: ReturnType<typeof setTimeout> | null = null

const { lines: typeText, start: startTyping } = useTypewriter([PROFILE.jobTitle], {
  speed: 80,
  onAllDone: () => {
    showContentTimer = setTimeout(() => {
      showContent.value = true
    }, 200)
  },
})

useScrollReveal({
  selector: '.reveal',
  classToAdd: 'revealed',
  threshold: 0.08,
  rootMargin: '120px 0px -10% 0px',
  staggerDelay: 100,
  firstScreenFactor: 0.95,
  refitOnResize: true,
})

const printOpen = ref(false)

function handlePrint() {
  printOpen.value = true
}

// ===== Copy contact =====
const toastVisible = ref(false)
const toastMessage = ref('')
let toastTimer: ReturnType<typeof setTimeout> | null = null

function showToast(message: string) {
  toastMessage.value = message
  toastVisible.value = true
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastVisible.value = false
  }, 2000)
}

function copyContact() {
  copyText(PROFILE.phone).then(() => showToast(`已复制联系电话：${PROFILE.phone}`))
}

// magnetic circular badge
const contactBadge = ref<HTMLElement | null>(null)
useMagnetic(contactBadge)

onMounted(() => {
  startTyping()
})

onUnmounted(() => {
  if (showContentTimer) clearTimeout(showContentTimer)
  if (toastTimer) clearTimeout(toastTimer)
})

const navItems = RESUME_NAV

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

const techStack = RESUME_TECH_TAGS
const skillBullets = RESUME_SKILL_BULLETS

const projects = RESUME_PROJECTS.map((p) => ({
  name: p.title,
  period: p.period,
  role: p.role,
  stack: p.stack,
  description: p.description,
  highlights: p.highlights,
  github: p.html_url,
}))
</script>

<template>
  <div class="resume-page">
    <!-- Left Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-inner">
        <!-- Name -->
        <div class="name-section">
          <h1 class="name">{{ PROFILE.name }}</h1>
          <p class="subtitle">{{ PROFILE.displayName }}</p>
        </div>

        <!-- Contact -->
        <div class="contact-section">
          <a :href="`mailto:${PROFILE.email}`" class="contact-item">
            <Icon icon="lucide:mail" width="16" height="16" />
            <span>{{ PROFILE.email }}</span>
          </a>
          <div class="contact-item">
            <Icon icon="lucide:phone" width="16" height="16" />
            <span>{{ PROFILE.phone }}</span>
          </div>
          <a
            :href="PROFILE.githubUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="contact-item"
          >
            <Icon icon="simple-icons:github" width="16" height="16" />
            <span>{{ PROFILE.githubLabel }}</span>
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
          <button
            ref="contactBadge"
            type="button"
            class="contact-badge"
            aria-label="点击复制联系电话"
            @click="copyContact"
          >
            <svg class="badge-ring" viewBox="0 0 100 100" aria-hidden="true">
              <defs>
                <path
                  id="contact-badge-circle"
                  d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                />
              </defs>
              <text>
                <textPath href="#contact-badge-circle">
                  复制电话 · CONTACT ME · 复制电话 · CONTACT ME ·
                </textPath>
              </text>
            </svg>
            <Icon icon="lucide:copy" width="22" height="22" />
          </button>
        </div>
      </div>
    </aside>

    <!-- Right Content -->
    <main class="main-content">
      <!-- Intro -->
      <section id="intro" class="section">
        <div class="typewriter">
          <span class="type-text">{{ typeText[0] }}</span>
          <span class="cursor" />
        </div>
        <p class="intro-desc" :class="{ show: showContent }">
          {{ PROFILE.skills }}
        </p>
      </section>

      <!-- Education -->
      <section id="education" class="section reveal">
        <h2 class="section-title">教育经历</h2>
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">{{ PROFILE.education.school }}</h3>
            <span class="card-badge">{{ PROFILE.education.period }}</span>
          </div>
          <p class="card-subtitle">{{ PROFILE.education.major }}</p>
        </div>
      </section>

      <!-- Skills -->
      <section id="skills" class="section reveal">
        <h2 class="section-title">专业技能</h2>
        <ul class="skill-list">
          <li v-for="(item, i) in skillBullets" :key="i">{{ item }}</li>
        </ul>
      </section>

      <!-- Projects —— 内容对齐自《简历.pdf》 -->
      <section id="projects" class="section reveal">
        <h2 class="section-title">项目经历</h2>
        <div class="project-list-wrap">
          <div v-for="project in projects" :key="project.name" class="card project-card">
            <div class="card-header">
              <div class="card-title-row">
                <h3 class="card-title">{{ project.name }}</h3>
                <span v-if="project.role" class="card-role">{{ project.role }}</span>
              </div>
              <span class="card-badge">{{ project.period }}</span>
            </div>
            <p class="card-stack">
              <span class="card-stack-label">技术栈：</span>{{ project.stack }}
            </p>
            <p class="card-desc">
              <span class="card-desc-label">项目简介：</span>{{ project.description }}
            </p>
            <ul class="project-list">
              <li v-for="(item, i) in project.highlights" :key="i">{{ item }}</li>
            </ul>
            <a
              v-if="project.github"
              :href="project.github"
              target="_blank"
              rel="noopener noreferrer"
              class="project-link"
            >
              <Icon icon="simple-icons:github" width="14" height="14" />
              {{ project.github.replace(/^https?:\/\//, '') }}
            </a>
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

    <ResumeExportModal :open="printOpen" @close="printOpen = false" />
    <CopyToast :show="toastVisible" :message="toastMessage" />
  </div>
</template>

<style lang="scss">
@use '../styles/animations' as anim;

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
  --accent: var(--color-brand-pink-light);
}

/* ===== Page Layout ===== */
.resume-page {
  display: flex;
  max-width: 72rem; /* max-w-6xl，与首页版心一致 */
  margin: 0 auto;
  padding: 48px 32px 120px;
  min-height: 100vh;
  background: var(--bg-primary);
  gap: 40px;
}

/* ===== Sidebar ===== */
.sidebar {
  position: sticky;
  top: 88px;
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
  transition:
    color 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease,
    opacity 0.2s ease,
    box-shadow 0.2s ease;
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
  transition:
    color 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease,
    opacity 0.2s ease,
    box-shadow 0.2s ease;
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

/* ===== Magnetic circular contact badge ===== */
.contact-badge {
  position: relative;
  align-self: center;
  width: 96px;
  height: 96px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  color: var(--text-secondary);
  cursor: pointer;
  transition:
    color 0.2s ease,
    box-shadow 0.25s ease;

  &:hover {
    color: var(--accent);
    box-shadow:
      0 8px 24px var(--shadow-hover),
      0 0 0 1px color-mix(in srgb, var(--accent) 25%, transparent);
  }

  .badge-ring {
    position: absolute;
    inset: 5px;
    width: calc(100% - 10px);
    height: calc(100% - 10px);
    animation: badge-rotate 14s linear infinite;

    text {
      font-size: 8px;
      font-weight: 600;
      letter-spacing: 0.22em;
      fill: var(--text-muted);
      text-transform: uppercase;
    }
  }

  &:hover .badge-ring text {
    fill: var(--accent);
  }
}

@keyframes badge-rotate {
  to {
    transform: rotate(360deg);
  }
}

/* ===== Main Content ===== */
.main-content {
  display: flex;
  flex-direction: column;
  gap: 44px;
  padding-bottom: 48px;
}

.section {
  scroll-margin-top: 96px;
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

/* One-shot shine sweep across section titles when their section reveals
   (triggered by the `revealed` class from useScrollReveal).
   The 400%-wide gradient keeps the element fully covered at the 72%→28%
   keyframe range, so no glyph ever loses its background under
   background-clip: text; the ~1/3-wide soft gleam sweeps left→right. */
.revealed .section-title {
  background-image: linear-gradient(
    115deg,
    var(--text-muted) 0%,
    var(--text-muted) 46%,
    var(--accent) 50%,
    var(--text-muted) 54%,
    var(--text-muted) 100%
  );
  background-size: 400% 100%;
  background-repeat: no-repeat;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: resume-title-shine 2s ease-in-out 0.5s both;
}

@keyframes resume-title-shine {
  from {
    background-position: 72% 0;
  }
  to {
    background-position: 28% 0;
  }
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

.intro-desc {
  font-size: 16px;
  line-height: 1.7;
  color: var(--text-secondary);
  max-width: 560px;
  opacity: 0;
  transform: translateY(12px);
  transition:
    opacity 0.6s ease,
    transform 0.6s ease;
}

.intro-desc.show {
  opacity: 1;
  transform: translateY(0);
}

/* ===== Scroll Reveal Animation ===== */
.reveal {
  @include anim.reveal(18px);
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

.card-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  min-width: 0;
}

.card-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.card-role {
  font-size: 11px;
  font-weight: 600;
  color: var(--accent);
  background: color-mix(in srgb, var(--accent) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--accent) 28%, transparent);
  padding: 2px 8px;
  border-radius: 999px;
  letter-spacing: 0.04em;
  line-height: 1.4;
  white-space: nowrap;
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

.card-stack {
  margin-top: 8px;
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-secondary);
  transition: color 0.3s ease;
}

.card-stack-label,
.card-desc-label {
  font-weight: 600;
  color: var(--text-primary);
  margin-right: 2px;
}

/* Project Cards */
/* content-visibility on the long list, not the page root */
.project-list-wrap {
  display: flex;
  flex-direction: column;
  gap: 16px;
  content-visibility: auto;
  contain-intrinsic-size: auto 480px;
}

.project-card {
  width: 100%;
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
  transition:
    color 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease,
    opacity 0.2s ease,
    box-shadow 0.2s ease;
}

.tech-tag:hover {
  color: var(--accent);
  border-color: var(--accent);
  background: var(--bg-card);
}

/* ===== Print Styles ===== */
/* Shared paper look for both the system print dialog and the export modal's
   html2canvas capture (html.exporting). */
@mixin paper-styles {
  .resume-page {
    display: block;
    padding: 40px;
    background: #ffffff !important;
    color: #1a1a1a !important;

    /* Force the light palette so a dark-mode site still exports/prints as
       white paper (!important beats the html.dark variable overrides) */
    --bg-primary: var(--color-bg-primary) !important;
    --bg-card: var(--color-text-inverse) !important;
    --text-primary: var(--color-text-primary) !important;
    --text-secondary: var(--color-text-secondary) !important;
    --text-muted: var(--color-text-tertiary) !important;
    --border-light: var(--color-border-default) !important;
    --border-medium: var(--color-border-hover) !important;
    --bg-hover: var(--color-bg-secondary) !important;
    --accent: var(--color-brand-pink) !important;
  }

  .nav-section,
  .cta-section {
    display: none !important;
  }

  .sidebar {
    position: static;
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

  .section-title {
    animation: none;
    background: none;
    -webkit-text-fill-color: currentColor;
  }

  .reveal {
    opacity: 1 !important;
    transform: none !important;
  }

  .intro-desc {
    opacity: 1;
    transform: none;
  }

  .cursor {
    display: none;
  }

  .tech-tag {
    border: 1px solid #e5e5e5;
    background: #f5f5f5;
  }
}

@media print {
  @include paper-styles;
}

/* Paper scope for the export modal's html2canvas capture: applied to an
   off-screen CLONE of the resume (never the live page, which would visibly
   flash through the modal's blurred backdrop) */
html.exporting,
.exporting-scope {
  @include paper-styles;

  & * {
    transition: none !important;
    animation: none !important;
    /* The off-screen clone would otherwise be skipped by content-visibility
       and laid out with estimated intrinsic heights → overlapping output */
    content-visibility: visible !important;
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

/* ===== Reduced Motion ===== */
@include anim.reduced-motion {
  .reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }

  .intro-desc {
    opacity: 1;
    transform: none;
    transition: none;
  }

  .cursor {
    animation: none;
  }

  .contact-badge .badge-ring {
    animation: none;
  }
}
</style>
