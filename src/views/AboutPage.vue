<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'

// ========== Typewriter Signature ==========
const signatureLines = ['青春属于表白 阳光属于窗台', '而我想我属于一个拥有你的未来']
const signatureLine1 = ref('')
const signatureLine2 = ref('')

// ========== 3D Avatar Tilt ==========
const avatarStyle = ref({
  transform: 'rotateX(0deg) rotateY(0deg)',
  transition: 'transform 0.1s ease-out',
})

const handleAvatarMove = (e: MouseEvent) => {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const cx = rect.width / 2
  const cy = rect.height / 2
  const rx = ((y - cy) / cy) * -15
  const ry = ((x - cx) / cx) * 15
  avatarStyle.value = {
    transform: `rotateX(${rx}deg) rotateY(${ry}deg)`,
    transition: 'transform 0.1s ease-out',
  }
}

const handleAvatarLeave = () => {
  avatarStyle.value = {
    transform: 'rotateX(0deg) rotateY(0deg)',
    transition: 'transform 0.5s ease',
  }
}

// ========== Spotlight Tag ==========
const handleTagMouseMove = (e: MouseEvent) => {
  const el = e.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  el.style.setProperty('--spotlight-x', `${x}px`)
  el.style.setProperty('--spotlight-y', `${y}px`)
}

// ========== Magnetic Contact ==========
const handleMagneticMove = (e: MouseEvent) => {
  const el = e.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()
  const x = e.clientX - rect.left - rect.width / 2
  const y = e.clientY - rect.top - rect.height / 2
  el.style.transition = 'none'
  el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`
}

const handleMagneticLeave = (e: MouseEvent) => {
  const el = e.currentTarget as HTMLElement
  el.style.transition = 'transform 0.4s cubic-bezier(0.32, 0.72, 0, 1)'
  requestAnimationFrame(() => {
    el.style.transform = 'translate(0px, 0px)'
  })
}

// ========== Contact Glow ==========
const handleContactGlow = (e: MouseEvent) => {
  const el = e.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  el.style.setProperty('--glow-x', `${x}px`)
  el.style.setProperty('--glow-y', `${y}px`)
}

// ========== Particle Burst ==========
const particleContainer = ref<HTMLElement | null>(null)
const showParticles = (e: MouseEvent) => {
  const container = particleContainer.value
  if (!container) return
  const rect = container.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  for (let i = 0; i < 8; i++) {
    const particle = document.createElement('span')
    particle.className = 'particle'
    const angle = (Math.PI * 2 * i) / 8
    const distance = 30 + Math.random() * 20
    const tx = Math.cos(angle) * distance
    const ty = Math.sin(angle) * distance
    particle.style.left = `${x}px`
    particle.style.top = `${y}px`
    particle.style.setProperty('--tx', `${tx}px`)
    particle.style.setProperty('--ty', `${ty}px`)
    particle.style.background = `var(--accent)`
    container.appendChild(particle)
    setTimeout(() => particle.remove(), 600)
  }
}

// ========== Location & Weather ==========
const location = ref('获取中...')
const weather = ref({ temp: '--', desc: '--', icon: 'lucide:cloud' })
const weatherUpdatedAt = ref('')
let weatherTimer: ReturnType<typeof setInterval> | null = null

const SHENZHEN_LAT = 22.5431
const SHENZHEN_LON = 114.0579

const getLocationAndWeather = async () => {
  try {
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${SHENZHEN_LAT}&longitude=${SHENZHEN_LON}&current=temperature_2m,weather_code&timezone=auto`,
    )
    const weatherData = await weatherRes.json()
    location.value = '广东 · 深圳'
    weather.value = {
      temp: String(Math.round(weatherData.current.temperature_2m)),
      desc: getWeatherDesc(weatherData.current.weather_code),
      icon: getWeatherIcon(weatherData.current.weather_code),
    }
    weatherUpdatedAt.value = formatTime(new Date())
  } catch {
    location.value = '广东 · 深圳'
    weather.value = { temp: '26', desc: '晴朗', icon: 'lucide:sun' }
    weatherUpdatedAt.value = formatTime(new Date())
  }
}

const formatTime = (date: Date): string => {
  const h = String(date.getHours()).padStart(2, '0')
  const m = String(date.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}

const startWeatherRefresh = () => {
  getLocationAndWeather()
  weatherTimer = setInterval(
    () => {
      getLocationAndWeather()
    },
    10 * 60 * 1000,
  )
}

const stopWeatherRefresh = () => {
  if (weatherTimer) {
    clearInterval(weatherTimer)
    weatherTimer = null
  }
}

const getWeatherDesc = (code: number): string => {
  const codes: Record<number, string> = {
    0: '晴朗',
    1: '多云',
    2: '多云',
    3: '阴天',
    45: '雾',
    48: '雾凇',
    51: '毛毛雨',
    53: '小雨',
    55: '中雨',
    61: '小雨',
    63: '中雨',
    65: '大雨',
    71: '小雪',
    73: '中雪',
    75: '大雪',
    95: '雷雨',
    96: '雷雨',
    99: '雷雨',
  }
  return codes[code] || '多云'
}

const getWeatherIcon = (code: number): string => {
  if (code === 0) return 'lucide:sun'
  if (code <= 3) return 'lucide:cloud-sun'
  if (code <= 48) return 'lucide:cloud'
  if (code <= 67) return 'lucide:cloud-rain'
  if (code <= 77) return 'lucide:snowflake'
  if (code <= 99) return 'lucide:cloud-lightning'
  return 'lucide:cloud'
}

// ========== Now Playing ==========
const nowPlaying = {
  song: '晴天',
  artist: '周杰伦',
}

// ========== Copy ==========
const copied = ref('')

const copyToClipboard = (text: string, label: string, e: MouseEvent) => {
  navigator.clipboard.writeText(text).then(() => {
    copied.value = label
    showParticles(e)
    setTimeout(() => {
      copied.value = ''
    }, 2000)
  })
}

const copyEmail = (e: MouseEvent) => {
  copyToClipboard('363807870@qq.com', '邮箱', e)
}

// ========== Data ==========
const techStack = [
  { name: 'HTML', icon: 'simple-icons:html5', color: '#E34F26', level: 90 },
  { name: 'CSS', icon: 'simple-icons:css3', color: '#1572B6', level: 85 },
  { name: 'JavaScript', icon: 'simple-icons:javascript', color: '#F7DF1E', level: 85 },
  { name: 'TypeScript', icon: 'simple-icons:typescript', color: '#3178C6', level: 75 },
  { name: 'Vue', icon: 'simple-icons:vuedotjs', color: '#4FC08D', level: 88 },
  { name: 'MySQL', icon: 'simple-icons:mysql', color: '#4479A1', level: 70 },
  { name: 'Java', icon: 'devicon-plain:java', color: '#007396', level: 65 },
  { name: 'Spring Boot', icon: 'simple-icons:springboot', color: '#6DB33F', level: 60 },
  { name: 'UniApp', icon: 'lucide:smartphone', color: '#2B9939', level: 72 },
  { name: 'Flutter', icon: 'simple-icons:flutter', color: '#02569B', level: 55 },
  { name: 'Node.js', icon: 'simple-icons:nodedotjs', color: '#339933', level: 68 },
  { name: 'Ajax', icon: 'lucide:loader-2', color: '#F97316', level: 80 },
]

const hobbies = [
  { name: '无畏契约', icon: 'lucide:target' },
  { name: '三角洲', icon: 'lucide:crosshair' },
  { name: '听音乐', icon: 'lucide:music' },
  { name: 'JayChou', icon: 'lucide:mic' },
  { name: '羽毛球', icon: 'lucide:volleyball' },
  { name: '画画', icon: 'lucide:palette' },
  { name: '追剧', icon: 'lucide:tv' },
]

const timeline = [
  {
    year: '2025',
    title: '前端三件套',
    desc: '系统学习 HTML / CSS / JavaScript，搭建第一个静态个人博客',
    icon: 'lucide:code-2',
    color: '#EC4899',
  },
  {
    year: '2026',
    title: 'Vue3 框架',
    desc: '深入学习 Vue3 组合式 API，掌握响应式原理与组件化开发',
    icon: 'simple-icons:vuedotjs',
    color: '#EC4899',
  },
  {
    year: '2026',
    title: 'Java 基础',
    desc: '系统学习 Java 基础语法，掌握面向对象编程与集合框架',
    icon: 'devicon-plain:java',
    color: '#F97316',
  },
  {
    year: '2026',
    title: '小兔鲜项目',
    desc: '基于 Vue3 的电商实战项目，实现商品展示、购物车等核心功能',
    icon: 'lucide:shopping-cart',
    color: '#EC4899',
  },
  {
    year: '2026',
    title: 'MySQL',
    desc: '学习关系型数据库，掌握 SQL 语句、索引优化与事务管理',
    icon: 'simple-icons:mysql',
    color: '#F97316',
  },
  {
    year: '2026',
    title: 'Java Web',
    desc: '学习 Servlet / JSP / JDBC，理解 Web 开发基础与 MVC 模式',
    icon: 'lucide:globe',
    color: '#F97316',
  },
  {
    year: '2026',
    title: 'ElementPlus',
    desc: '学习并实践 ElementPlus 组件库，快速搭建后台管理系统',
    icon: 'lucide:layout',
    color: '#EC4899',
  },
  {
    year: '2026',
    title: '苍穹外卖',
    desc: '完成外卖平台项目，实现用户端、商家端与骑手端完整功能',
    icon: 'lucide:utensils',
    color: '#F97316',
  },
  {
    year: '2026',
    title: 'uniapp',
    desc: '学习跨平台开发框架，实现一套代码多端运行',
    icon: 'lucide:smartphone',
    color: '#EC4899',
  },
  {
    year: '2026',
    title: '智能协同云图库',
    desc: '企业级项目实战，实现图片管理、团队协作等核心功能',
    icon: 'lucide:cloud',
    color: '#EC4899',
  },
]

const contacts = [
  { label: '微信', value: '13410972606', icon: 'lucide:message-circle', color: '#07C160' },
  { label: 'QQ', value: '363807870', icon: 'lucide:at-sign', color: '#12B7F5' },
  { label: '电话', value: '13410972606', icon: 'lucide:phone', color: '#F97316' },
  { label: '邮箱', value: '363807870@qq.com', icon: 'lucide:mail', color: '#EA4335' },
]

const socials = [
  {
    name: 'GitHub',
    url: 'https://github.com/JAYTDD',
    icon: 'simple-icons:github',
    color: '#181717',
  },
  {
    name: '掘金',
    url: 'https://juejin.cn/user/2385290407448745',
    icon: 'simple-icons:juejin',
    color: '#1E80FF',
  },
]

// ========== Lifecycle ==========
onMounted(() => {
  // Typewriter
  const typeLine = (line: string, target: typeof signatureLine1, delay: number) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        let i = 0
        const timer = setInterval(() => {
          if (i < line.length) {
            target.value += line.charAt(i)
            i++
          } else {
            clearInterval(timer)
            resolve()
          }
        }, 80)
      }, delay)
    })
  }
  typeLine(signatureLines[0]!, signatureLine1, 0).then(() => {
    typeLine(signatureLines[1]!, signatureLine2, 400)
  })

  // Weather
  startWeatherRefresh()

  // Scroll reveal — immediately reveal visible, then observe for scroll
  const revealElements = document.querySelectorAll('.reveal')

  revealElements.forEach((el) => {
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight) {
      ;(el as HTMLElement).classList.add('revealed')
    }
  })

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
        }
      })
    },
    { threshold: 0.1 },
  )
  revealElements.forEach((el) => {
    if (!(el as HTMLElement).classList.contains('revealed')) {
      observer.observe(el)
    }
  })

  // Text generate effect
  const textElements = document.querySelectorAll('.text-generate')
  textElements.forEach((el) => {
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight) {
      el.classList.add('revealed-text')
    }
  })
  const textObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed-text')
        }
      })
    },
    { threshold: 0.3 },
  )
  textElements.forEach((el) => {
    if (!(el as HTMLElement).classList.contains('revealed-text')) {
      textObserver.observe(el)
    }
  })

  // Section title lamp effect
  const lampElements = document.querySelectorAll('.section-title')
  const lampObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('lamp-on')
        } else {
          entry.target.classList.remove('lamp-on')
        }
      })
    },
    { threshold: 0.5 },
  )
  lampElements.forEach((el) => lampObserver.observe(el))
})

onUnmounted(() => {
  stopWeatherRefresh()
})
</script>

<template>
  <div ref="particleContainer" class="about-layout">
    <main class="about-main-content">
      <!-- Hero Section with Double-Bezel Card -->
      <section class="hero-section reveal">
        <div class="hero-card-outer">
          <div class="hero-card-inner">
            <!-- 3D Tilt Avatar -->
            <div
              class="avatar-wrapper"
              @mousemove="handleAvatarMove"
              @mouseleave="handleAvatarLeave"
            >
              <img
                src="../../public/Lunesnow.ico"
                alt="avatar"
                class="avatar"
                :style="avatarStyle"
              />
            </div>
            <h1 class="name">Lunesnow</h1>
            <p class="title">全栈工程师</p>

            <!-- Signature -->
            <div class="signature">
              <div class="signature-line">
                <span class="signature-text">{{ signatureLine1 }}</span>
                <span v-if="!signatureLine2" class="cursor" />
              </div>
              <div class="signature-line">
                <span class="signature-text">{{ signatureLine2 }}</span>
                <span
                  v-if="signatureLine2 && signatureLine2.length < (signatureLines[1]?.length ?? 0)"
                  class="cursor"
                />
                <span
                  v-if="
                    signatureLine2 && signatureLine2.length === (signatureLines[1]?.length ?? 0)
                  "
                  class="cursor blink"
                />
              </div>
            </div>

            <!-- Status Bar -->
            <div class="status-bar">
              <div class="status-item">
                <span class="status-dot" />
                <Icon icon="lucide:map-pin" width="12" height="12" />
                <span>{{ location }}</span>
              </div>
              <div class="status-item">
                <span class="weather-icon-wrap">
                  <Icon :icon="weather.icon" width="12" height="12" />
                </span>
                <span>{{ weather.temp }}°C {{ weather.desc }}</span>
                <span v-if="weatherUpdatedAt" class="update-time"
                  >· {{ weatherUpdatedAt }}更新</span
                >
              </div>
              <div class="status-item">
                <span class="music-icon-wrap">
                  <Icon icon="lucide:music" width="12" height="12" />
                </span>
                <span>正在听：{{ nowPlaying.artist }} - {{ nowPlaying.song }}</span>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="quick-actions">
              <button class="action-btn" @click="copyEmail">
                <Icon icon="lucide:copy" width="12" height="12" />
                <span>复制邮箱</span>
              </button>
              <a href="https://www.coderesin.xyz" target="_blank" class="action-btn">
                <Icon icon="lucide:external-link" width="12" height="12" />
                <span>访问博客</span>
              </a>
              <a href="https://github.com/JAYTDD" target="_blank" class="action-btn">
                <Icon icon="simple-icons:github" width="12" height="12" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- About Blog -->
      <section class="section reveal">
        <h2 class="section-title">关于</h2>
        <p class="about-text text-generate">
          Lunesnow 的个人技术博客，基于 Vue + Vite + TypeScript
          构建。记录全栈开发、工具链、以及日常学习中的思考与总结。
        </p>
      </section>

      <!-- Skills & Interests -->
      <section class="section reveal">
        <h2 class="section-title">技能与兴趣</h2>
        <div class="skills-grid">
          <span
            v-for="(tech, i) in techStack"
            :key="tech.name"
            class="skill-tag spotlight-tag"
            :style="{
              '--tag-color': tech.color,
              '--tag-level': tech.level + '%',
            }"
            @mousemove="handleTagMouseMove"
          >
            <Icon :icon="tech.icon" width="14" height="14" />
            <span>{{ tech.name }}</span>
            <span class="skill-level-bar" />
          </span>
        </div>
        <div class="hobbies-row">
          <span
            v-for="hobby in hobbies"
            :key="hobby.name"
            class="hobby-tag"
          >
            <span class="hobby-icon-bg">
              <Icon :icon="hobby.icon" width="12" height="12" />
            </span>
            <span>{{ hobby.name }}</span>
          </span>
        </div>
      </section>

      <!-- Learning Timeline -->
      <section class="section reveal">
        <h2 class="section-title">成长时间线</h2>
        <div class="about-timeline">
          <div
            v-for="item in timeline"
            :key="item.title"
            class="about-timeline-card"
            :style="{ '--tl-color': item.color }"
          >
            <div class="about-timeline-card-icon">
              <Icon :icon="item.icon" width="14" height="14" />
            </div>
            <div class="about-timeline-card-info">
              <span class="about-timeline-card-year">{{ item.year }}</span>
              <span class="about-timeline-card-title">{{ item.title }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact Grid -->
      <section class="section reveal">
        <h2 class="section-title">找到我</h2>
        <div class="contact-grid">
          <div
            v-for="contact in contacts"
            :key="contact.label"
            class="contact-card magnetic-contact"
            :style="{ '--contact-color': contact.color }"
            @mousemove="(e) => { handleMagneticMove(e); handleContactGlow(e) }"
            @mouseleave="handleMagneticLeave"
            @click="(e) => copyToClipboard(contact.value, contact.label, e)"
          >
            <div class="contact-card-icon" :style="{ color: contact.color }">
              <Icon :icon="contact.icon" width="20" height="20" />
            </div>
            <div class="contact-card-info">
              <span class="contact-card-label">{{ contact.label }}</span>
              <span class="contact-card-value">{{ contact.value }}</span>
            </div>
            <div class="copy-hint" :class="{ show: copied === contact.label }">
              <Icon icon="lucide:check" width="12" height="12" />
            </div>
          </div>
        </div>
      </section>

      <!-- Social Links -->
      <section class="section reveal">
        <h2 class="section-title">社交</h2>
        <p class="social-subtitle">在以下平台找到我</p>
        <div class="social-row">
          <a
            v-for="social in socials"
            :key="social.name"
            :href="social.url"
            target="_blank"
            class="social-circle"
            :style="{ '--social-color': social.color }"
            :title="social.name"
          >
            <span class="social-icon-inner">
              <Icon :icon="social.icon" width="18" height="18" :style="{ color: social.color }" />
            </span>
          </a>
        </div>
        <p class="social-footer">2025 &mdash; Lunesnow-blog</p>
      </section>
    </main>
  </div>
</template>

<style>
/* ===== CSS Variables ===== */
.about-layout {
  --bg-canvas: var(--color-bg-primary);
  --bg-card: var(--color-text-inverse);
  --text-primary: var(--color-text-primary);
  --text-secondary: var(--color-text-secondary);
  --text-muted: var(--color-text-tertiary);
  --border-light: rgba(24, 24, 27, 0.06);
  --border-hover: rgba(24, 24, 27, 0.12);
  --accent: var(--color-brand-pink);
  --shadow-soft: rgba(24, 24, 27, 0.04);
  --shadow-hover: rgba(24, 24, 27, 0.08);
}

html.dark .about-layout {
  --bg-canvas: var(--color-bg-dark-primary);
  --bg-card: var(--color-bg-dark-secondary);
  --text-primary: var(--color-text-dark-primary);
  --text-secondary: var(--color-text-dark-secondary);
  --text-muted: var(--color-text-dark-tertiary);
  --border-light: rgba(250, 250, 248, 0.06);
  --border-hover: rgba(250, 250, 248, 0.12);
  --accent: var(--color-brand-pink-light);
  --shadow-soft: rgba(0, 0, 0, 0.3);
  --shadow-hover: rgba(0, 0, 0, 0.4);
}

/* ===== Layout ===== */
.about-layout {
  max-width: 960px;
  margin: 0 auto;
  padding: 16px 24px 24px;
  min-height: 100vh;
  position: relative;
}

/* ===== Main Content ===== */
.about-main-content {
  width: 100%;
}

/* ===== Hero Section ===== */
.hero-section {
  margin-bottom: 16px;
}

/* Double-Bezel Hero Card */
.hero-card-outer {
  background: rgba(24, 24, 27, 0.02);
  border: 1px solid var(--border-light);
  border-radius: 24px;
  padding: 2px;
  box-shadow: 0 24px 64px rgba(24, 24, 27, 0.06);
  position: relative;
}

/* Rotating glow border (dark mode only) */
html.dark .hero-card-outer {
  background: rgba(250, 250, 248, 0.03);
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.3);
}

html.dark .hero-card-outer::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: 25px;
  padding: 1px;
  background: conic-gradient(
    from var(--hero-glow-angle, 0deg),
    transparent 0%,
    rgba(236, 72, 153, 0.3) 10%,
    transparent 20%,
    rgba(139, 92, 246, 0.2) 35%,
    transparent 50%,
    rgba(249, 115, 22, 0.2) 65%,
    transparent 80%
  );
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  animation: hero-glow-spin 8s linear infinite;
  pointer-events: none;
}

@keyframes hero-glow-spin {
  to {
    --hero-glow-angle: 360deg;
  }
}

@property --hero-glow-angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

.hero-card-inner {
  background: var(--bg-card);
  border-radius: 22px;
  padding: 24px 20px;
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.5);
  text-align: center;
}

html.dark .hero-card-inner {
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.05);
}

/* 3D Tilt Avatar */
.avatar-wrapper {
  display: inline-block;
  margin-bottom: 16px;
  perspective: 1000px;
  cursor: pointer;
}

.avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  border: 2px solid var(--border-light);
  box-shadow: 0 8px 32px var(--shadow-soft);
  object-fit: cover;
  transform-style: preserve-3d;
  will-change: transform;
}

.avatar-wrapper:hover .avatar {
  box-shadow: 0 20px 60px var(--shadow-soft);
}

.name {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4px;
  letter-spacing: -0.03em;
  line-height: 1.1;
}

.title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

/* Signature */
.signature {
  font-size: 16px;
  color: var(--text-secondary);
  margin-bottom: 10px;
  min-height: 48px;
  line-height: 1.5;
}

.signature-line {
  min-height: 24px;
}

.signature-text {
  font-weight: 400;
}

.cursor {
  display: inline-block;
  width: 2px;
  height: 16px;
  background: var(--accent);
  margin-left: 2px;
  vertical-align: middle;
}

.cursor.blink {
  animation: blink 1s step-end infinite;
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

/* Status Bar */
.status-bar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  padding: 6px 16px;
  background: var(--bg-canvas);
  border-radius: 100px;
  font-size: 13px;
  color: var(--text-muted);
}

.status-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

/* Breathing Status Dot */
.status-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--color-status-success);
  position: relative;
  flex-shrink: 0;
}

.status-dot::after {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 50%;
  background: var(--color-status-success);
  opacity: 0.4;
  animation: breathe 2s ease-in-out infinite;
}

@keyframes breathe {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.4;
  }
  50% {
    transform: scale(2);
    opacity: 0;
  }
}

/* Weather Icon Animation */
.weather-icon-wrap {
  display: inline-flex;
  animation: weather-pulse 3s ease-in-out infinite;
}

@keyframes weather-pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
}

/* Music Icon Wave Animation */
.music-icon-wrap {
  display: inline-flex;
  position: relative;
}

.music-icon-wrap::before,
.music-icon-wrap::after {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 1.5px solid var(--accent);
  opacity: 0;
  animation: music-wave 2s ease-out infinite;
}

.music-icon-wrap::after {
  animation-delay: 0.6s;
}

@keyframes music-wave {
  0% {
    transform: scale(0.8);
    opacity: 0.6;
  }
  100% {
    transform: scale(1.8);
    opacity: 0;
  }
}

.update-time {
  font-size: 10px;
  opacity: 0.6;
}

/* Quick Actions */
.quick-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 14px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s ease;
}

.action-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px var(--shadow-soft);
}

html.dark .action-btn {
  background: var(--bg-card);
}

/* ===== Sections ===== */
.section {
  margin-bottom: 14px;
}

.section::before {
  content: '';
  display: block;
  height: 1px;
  background: var(--border-light);
  margin-bottom: 10px;
}

.section:first-child::before {
  display: none;
}

.section-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin-bottom: 8px;
}

/* About Text */
.about-text {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.7;
  max-width: 65ch;
}

/* Text Generate Effect (Aceternity style) */
.text-generate {
  opacity: 0;
  filter: blur(8px);
  transform: translateY(8px);
  transition: all 0.8s cubic-bezier(0.32, 0.72, 0, 1);
}

.text-generate.revealed-text {
  opacity: 1;
  filter: blur(0);
  transform: translateY(0);
}

/* Section Title Lamp Effect */
.section-title {
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  left: 50%;
  top: -8px;
  transform: translateX(-50%);
  width: 120px;
  height: 40px;
  background: radial-gradient(ellipse at center, var(--accent), transparent 70%);
  opacity: 0;
  filter: blur(16px);
  transition: opacity 0.8s ease;
  pointer-events: none;
}

.section-title.lamp-on::after {
  opacity: 0.15;
}

/* Skills Grid */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
}

.skill-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 13px;
  border: 1px solid var(--border-light);
  background: var(--bg-card);
  color: var(--text-secondary);
  overflow: hidden;
  position: relative;
  cursor: default;
  transition:
    transform 0.16s cubic-bezier(0.32, 0.72, 0, 1),
    box-shadow 0.16s cubic-bezier(0.32, 0.72, 0, 1),
    border-color 0.16s cubic-bezier(0.32, 0.72, 0, 1),
    color 0.08s linear;
  opacity: 1;
  transform: translateY(0) rotate(0deg);
}

.revealed .skill-tag {
  opacity: 1;
  transform: translateY(0) rotate(0deg);
}

.skill-tag:hover {
  border-color: var(--tag-color, var(--accent));
  color: var(--tag-color, var(--accent));
  box-shadow:
    0 2px 10px var(--shadow-soft),
    0 0 12px -3px var(--tag-color, var(--accent));
  transform: scale(1.05) translateY(-2px);
}

/* Uiverse-style bottom progress bar */
.skill-level-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: var(--tag-level, 0%);
  background: var(--tag-color, var(--accent));
  border-radius: 0 0 8px 8px;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s cubic-bezier(0.32, 0.72, 0, 1);
}

.skill-tag:hover .skill-level-bar {
  transform: scaleX(1);
}

/* Hobbies Row */
.hobbies-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.hobby-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 12px;
  border: 1px solid var(--border-light);
  background: var(--bg-card);
  color: var(--text-muted);
  transition:
    transform 0.16s cubic-bezier(0.32, 0.72, 0, 1),
    box-shadow 0.16s cubic-bezier(0.32, 0.72, 0, 1),
    border-color 0.16s cubic-bezier(0.32, 0.72, 0, 1),
    color 0.08s linear;
  opacity: 0;
  transform: translateY(8px) rotate(1deg);
}

.revealed .hobby-tag {
  opacity: 1;
  transform: translateY(0) rotate(0deg);
}

.hobby-tag:hover {
  border-color: var(--accent);
  color: var(--accent);
  transform: scale(1.08) translateY(-1px);
  box-shadow: 0 2px 8px var(--shadow-soft);
}

.hobby-tag:hover .hobby-icon-bg {
  background: var(--accent);
  color: var(--bg-card);
  transform: scale(1.1);
}

/* Hobby Icon Background */
.hobby-icon-bg {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background: var(--bg-canvas);
  color: var(--text-muted);
  transition: all 0.25s ease;
  flex-shrink: 0;
}

/* Spotlight Effect */
.spotlight-tag::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    200px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%),
    rgba(236, 72, 153, 0.08),
    transparent 40%
  );
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.spotlight-tag:hover::before {
  opacity: 1;
}

html.dark .spotlight-tag::before {
  background: radial-gradient(
    200px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%),
    rgba(244, 114, 182, 0.08),
    transparent 40%
  );
}

/* Contact Grid */
.contact-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

/* Magnetic Contact Card */
.contact-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  cursor: pointer;
  will-change: transform;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
  position: relative;
  overflow: hidden;
}

/* Aceternity-style glow border */
.contact-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 12px;
  padding: 1px;
  background: radial-gradient(
    120px circle at var(--glow-x, 50%) var(--glow-y, 50%),
    var(--contact-color, var(--accent)),
    transparent 60%
  );
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.contact-card:hover::before {
  opacity: 0.7;
}

.contact-card:hover {
  border-color: transparent;
  box-shadow: 0 4px 16px var(--shadow-soft);
}

.contact-card-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: var(--bg-canvas);
  transition: transform 0.2s ease;
}

.contact-card:hover .contact-card-icon {
  transform: scale(1.1);
}

.contact-card-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}

.contact-card-label {
  font-size: 11px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.contact-card-value {
  font-size: 14px;
  color: var(--text-primary);
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.copy-hint {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  color: var(--accent);
  opacity: 0;
  transform: translateX(6px);
  transition: all 0.2s ease;
}

.copy-hint.show {
  opacity: 1;
  transform: translateX(0);
}

/* Particle Burst */
.particle {
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  pointer-events: none;
  animation: particle-burst 0.6s ease-out forwards;
  z-index: 100;
}

@keyframes particle-burst {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(0);
    opacity: 0;
  }
}

/* ===== Timeline ===== */
.about-timeline {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.about-timeline-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 10px;
  cursor: default;
  opacity: 0;
  transform: translateY(8px);
  transition:
    transform 0.16s cubic-bezier(0.32, 0.72, 0, 1),
    box-shadow 0.16s cubic-bezier(0.32, 0.72, 0, 1),
    border-color 0.16s cubic-bezier(0.32, 0.72, 0, 1),
    color 0.08s linear;
}

.revealed .about-timeline-card {
  opacity: 1;
  transform: translateY(0);
}

.about-timeline-card:hover {
  border-color: var(--tl-color, var(--accent));
  box-shadow: 0 2px 8px var(--shadow-soft), 0 0 14px -5px var(--tl-color, var(--accent));
  transform: translateY(-2px) scale(1.03);
}

.about-timeline-card-icon {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: var(--bg-canvas);
  color: var(--tl-color, var(--accent));
  transition: all 0.25s ease;
}

.about-timeline-card:hover .about-timeline-card-icon {
  background: var(--tl-color, var(--accent));
  color: #fff;
}

.about-timeline-card-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.about-timeline-card-year {
  font-size: 10px;
  font-weight: 600;
  color: var(--tl-color, var(--accent));
  letter-spacing: 0.02em;
}

.about-timeline-card-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
}

/* Social Row */
.social-row {
  display: flex;
  gap: 10px;
}

.social-subtitle {
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 10px;
}

.social-footer {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 16px;
  opacity: 0.6;
}

/* Social Circle */
.social-circle {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.32, 0.72, 0, 1);
  overflow: hidden;
}

.social-icon-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}

.social-circle::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  padding: 1px;
  background: linear-gradient(90deg, transparent, var(--social-color, var(--accent)), transparent);
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.social-circle:hover::before {
  opacity: 1;
  animation: glow-rotate 2s linear infinite;
}

.social-circle:hover {
  box-shadow: 0 2px 14px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px) scale(1.08);
}

.social-circle:hover .social-icon-inner {
  animation: social-bounce 0.4s cubic-bezier(0.32, 0.72, 0, 1);
}

@keyframes social-bounce {
  0% {
    transform: scale(1);
  }
  40% {
    transform: scale(1.3);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1.1);
  }
}

html.dark .social-circle:hover {
  box-shadow: 0 2px 14px rgba(0, 0, 0, 0.3);
}

html.dark .social-circle {
  background: rgba(255, 255, 255, 0.1);
}

@keyframes glow-rotate {
  0% {
    filter: hue-rotate(0deg);
  }
  100% {
    filter: hue-rotate(360deg);
  }
}

/* ===== Scroll Reveal with Stagger ===== */
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s cubic-bezier(0.32, 0.72, 0, 1);
}

.reveal.revealed {
  opacity: 1;
  transform: translateY(0);
}

/* ===== Reduced Motion ===== */
@media (prefers-reduced-motion: reduce) {
  .reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }

  .skill-tag,
  .hobby-tag {
    opacity: 1;
    transform: none;
    transition: none;
  }

  .skill-level-bar {
    transform: scaleX(1);
    transition: none;
  }

  .about-timeline-card {
    opacity: 1;
    transform: none;
    transition: none;
  }

  .text-generate {
    opacity: 1;
    filter: none;
    transform: none;
    transition: none;
  }

  .section-title::after {
    display: none;
  }

  html.dark .hero-card-outer::before {
    animation: none;
  }

  .cursor {
    animation: none;
  }

  .status-dot::after {
    animation: none;
  }

  .weather-icon-wrap {
    animation: none;
  }

  .music-icon-wrap::before,
  .music-icon-wrap::after {
    animation: none;
  }

  .social-circle:hover .social-icon-inner {
    animation: none;
  }
}

/* ===== Responsive ===== */
@media (max-width: 640px) {
  .about-layout {
    padding: 14px 16px 20px;
  }

  .hero-card-inner {
    padding: 20px 16px;
  }

  .avatar {
    width: 80px;
    height: 80px;
  }

  .name {
    font-size: 28px;
  }

  .status-bar {
    gap: 10px;
    padding: 5px 12px;
  }

  .skills-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .contact-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .social-row {
    gap: 10px;
  }
}

@media (max-width: 480px) {
  .about-layout {
    padding: 12px 14px 18px;
  }

  .hero-card-inner {
    padding: 16px 12px;
  }

  .avatar {
    width: 72px;
    height: 72px;
  }

  .avatar-wrapper {
    margin-bottom: 12px;
  }

  .name {
    font-size: 26px;
  }

  .title {
    font-size: 13px;
    margin-bottom: 12px;
  }

  .signature {
    font-size: 14px;
    margin-bottom: 8px;
  }

  .section {
    margin-bottom: 12px;
  }

  .skills-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .contact-grid {
    grid-template-columns: 1fr;
  }

  .status-bar {
    flex-direction: column;
    gap: 6px;
    padding: 10px 16px;
  }

  .quick-actions {
    flex-direction: column;
    width: 100%;
  }

  .action-btn {
    width: 100%;
    justify-content: center;
  }

  .skill-tag,
  .hobby-tag {
    transition-delay: 0ms !important;
  }
}

@media (max-width: 360px) {
  .skills-grid {
    grid-template-columns: 1fr;
  }

  .social-row {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
