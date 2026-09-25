<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import {
  ABOUT_TECH_STACK,
  CONTACTS,
  HOBBIES,
  PROFILE,
} from '@/data/profile'
import { ABOUT_TIMELINE } from '@/data/experience'
import { SITE_BRAND, SOCIAL_LINKS } from '@/data/site'
import { useTypewriter } from '@/composables/useTypewriter'
import { useScrollReveal } from '@/composables/useScrollReveal'
import CopyToast from '@/components/CopyToast.vue'
import SkillBallpit from '@/components/SkillBallpit.vue'
import type { PitItem } from '@/components/SkillBallpit.vue'
import { copyText } from '@/utils/clipboard'

// ========== Typewriter Signature ==========
const signatureLines = PROFILE.signatureLines
const { lines: typedSignature, start: startTyping } = useTypewriter(signatureLines, {
  speed: 80,
  lineDelay: 400,
})

// ========== Scroll Reveal ==========
useScrollReveal({ selector: '.reveal', classToAdd: 'revealed', staggerDelay: 90 })
useScrollReveal({ selector: '.text-generate', classToAdd: 'revealed-text', threshold: 0.3 })
// Lamp: re-check both directions, so the glow follows the section in/out of view
useScrollReveal({
  selector: '.section-title',
  classToAdd: 'lamp-on',
  removeOnExit: true,
  threshold: 0.5,
})
// Aurora name + icon cloud spin only run while on screen (play-state gating)
useScrollReveal({
  selector: '.name-aurora',
  classToAdd: 'motion-on',
  removeOnExit: true,
  threshold: 0.1,
})

// ========== Pointer helpers (rAF + cached rect) ==========
type RectCache = { left: number; top: number; width: number; height: number }
const rectCache = new WeakMap<HTMLElement, RectCache>()
type PointerKind = 'avatar' | 'spotlight' | 'contact'
const pendingPointer = new WeakMap<HTMLElement, { x: number; y: number; kind: PointerKind }>()
const pointerRaf = new WeakMap<HTMLElement, number>()

function cacheRect(el: HTMLElement) {
  const r = el.getBoundingClientRect()
  const cached = { left: r.left, top: r.top, width: r.width, height: r.height }
  rectCache.set(el, cached)
  return cached
}

function getRect(el: HTMLElement) {
  return rectCache.get(el) ?? cacheRect(el)
}

function schedulePointer(el: HTMLElement, kind: PointerKind, clientX: number, clientY: number) {
  pendingPointer.set(el, { x: clientX, y: clientY, kind })
  if (pointerRaf.has(el)) return
  const id = requestAnimationFrame(() => {
    pointerRaf.delete(el)
    const pending = pendingPointer.get(el)
    if (!pending) return
    pendingPointer.delete(el)
    const rect = getRect(el)
    const x = pending.x - rect.left
    const y = pending.y - rect.top

    if (pending.kind === 'avatar') {
      const cx = rect.width / 2
      const cy = rect.height / 2
      const rx = ((y - cy) / cy) * -15
      const ry = ((x - cx) / cx) * 15
      avatarStyle.value = {
        transform: `rotateX(${rx}deg) rotateY(${ry}deg)`,
        transition: 'transform 0.1s ease-out',
      }
      return
    }
    if (pending.kind === 'spotlight') {
      el.style.setProperty('--spotlight-x', `${x}px`)
      el.style.setProperty('--spotlight-y', `${y}px`)
      return
    }
    // contact = magnetic translate + glow vars in one frame
    const mx = x - rect.width / 2
    const my = y - rect.height / 2
    el.style.transition = 'none'
    el.style.transform = `translate(${mx * 0.15}px, ${my * 0.15}px)`
    el.style.setProperty('--glow-x', `${x}px`)
    el.style.setProperty('--glow-y', `${y}px`)
  })
  pointerRaf.set(el, id)
}

function cancelPointer(el: HTMLElement) {
  const id = pointerRaf.get(el)
  if (id !== undefined) {
    cancelAnimationFrame(id)
    pointerRaf.delete(el)
  }
  pendingPointer.delete(el)
}

// ========== 3D Avatar Tilt ==========
const avatarStyle = ref({
  transform: 'rotateX(0deg) rotateY(0deg)',
  transition: 'transform 0.1s ease-out',
})

const handleAvatarEnter = (e: MouseEvent) => {
  cacheRect(e.currentTarget as HTMLElement)
}

const handleAvatarMove = (e: MouseEvent) => {
  schedulePointer(e.currentTarget as HTMLElement, 'avatar', e.clientX, e.clientY)
}

const handleAvatarLeave = (e: MouseEvent) => {
  cancelPointer(e.currentTarget as HTMLElement)
  rectCache.delete(e.currentTarget as HTMLElement)
  avatarStyle.value = {
    transform: 'rotateX(0deg) rotateY(0deg)',
    transition: 'transform 0.5s ease',
  }
}

// ========== Spotlight Tag ==========
const handleTagEnter = (e: MouseEvent) => {
  cacheRect(e.currentTarget as HTMLElement)
}

const handleTagMouseMove = (e: MouseEvent) => {
  schedulePointer(e.currentTarget as HTMLElement, 'spotlight', e.clientX, e.clientY)
}

const handleTagLeave = (e: MouseEvent) => {
  const el = e.currentTarget as HTMLElement
  cancelPointer(el)
  rectCache.delete(el)
}

// ========== Magnetic Contact + Glow (same rAF) ==========
const handleContactEnter = (e: MouseEvent) => {
  cacheRect(e.currentTarget as HTMLElement)
}

const handleContactMove = (e: MouseEvent) => {
  schedulePointer(e.currentTarget as HTMLElement, 'contact', e.clientX, e.clientY)
}

const handleMagneticLeave = (e: MouseEvent) => {
  const el = e.currentTarget as HTMLElement
  cancelPointer(el)
  rectCache.delete(el)
  el.style.transition = 'transform 0.4s cubic-bezier(0.32, 0.72, 0, 1)'
  requestAnimationFrame(() => {
    el.style.transform = 'translate(0px, 0px)'
  })
}

// ========== Confetti burst (copy feedback, WAAPI — compositor friendly) ==========
const particleContainer = ref<HTMLElement | null>(null)
const CONFETTI_COLORS = ['#EC4899', '#F472B6', '#8B5CF6', '#A78BFA', '#F97316', '#FBBF24', '#22D3EE']

const showConfetti = (e: MouseEvent) => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const container = particleContainer.value
  if (!container) return
  const rect = container.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  for (let i = 0; i < 24; i++) {
    const piece = document.createElement('span')
    piece.className = 'confetti-piece'
    const w = 4 + Math.random() * 4
    piece.style.left = `${x}px`
    piece.style.top = `${y}px`
    piece.style.width = `${w}px`
    piece.style.height = `${w * (1 + Math.random() * 0.8)}px`
    piece.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length]!
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '1px'
    container.appendChild(piece)

    const angle = Math.random() * Math.PI * 2
    const distance = 45 + Math.random() * 70
    const dx = Math.cos(angle) * distance
    const dy = Math.sin(angle) * distance - 30 // upward bias, then falls
    const rotation = (Math.random() - 0.5) * 540
    piece
      .animate(
        [
          { transform: 'translate(-50%, -50%) rotate(0deg)', opacity: 1 },
          {
            transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy + 50}px)) rotate(${rotation}deg)`,
            opacity: 0,
          },
        ],
        {
          duration: 650 + Math.random() * 450,
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
          fill: 'forwards',
        },
      )
      .addEventListener('finish', () => piece.remove())
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
    location.value = PROFILE.location
    weather.value = {
      temp: String(Math.round(weatherData.current.temperature_2m)),
      desc: getWeatherDesc(weatherData.current.weather_code),
      icon: getWeatherIcon(weatherData.current.weather_code),
    }
    weatherUpdatedAt.value = formatTime(new Date())
  } catch {
    location.value = PROFILE.location
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
const toastVisible = ref(false)
const toastMessage = ref('')
let toastTimer: ReturnType<typeof setTimeout> | null = null

const copyToClipboard = (text: string, label: string, e: MouseEvent) => {
  copyText(text).then(() => {
    copied.value = label
    showConfetti(e)
    toastMessage.value = `已复制${label}：${text}`
    toastVisible.value = true
    if (toastTimer) clearTimeout(toastTimer)
    toastTimer = setTimeout(() => {
      copied.value = ''
      toastVisible.value = false
    }, 2000)
  })
}

// ========== Data (from shared modules) ==========
const currentYear = new Date().getFullYear()
const techStack = ABOUT_TECH_STACK
const hobbies = HOBBIES
const timeline = ABOUT_TIMELINE
const contacts = CONTACTS
const socials = SOCIAL_LINKS.map((s) => ({
  name: s.name,
  url: s.href,
  icon: s.icon,
  color: s.color ?? '#FAFAFA',
}))
// public/ asset — must be a runtime string so Vite/Rolldown does not try to bundle it
const avatarSrc = `${import.meta.env.BASE_URL}avatar.jpg`

// ========== 3D Icon Cloud (JS-driven billboard orbit: drag + inertia + hover) ==========
const HOBBY_COLORS = ['#F472B6', '#A78BFA', '#FB923C', '#FBBF24', '#22D3EE', '#4ADE80', '#60A5FA']
const CLOUD_ICONS = [
  ...ABOUT_TECH_STACK.map((t) => ({ name: t.name, icon: t.icon, color: t.color })),
  ...HOBBIES.map((h, i) => ({ name: h.name, icon: h.icon, color: HOBBY_COLORS[i % HOBBY_COLORS.length] })),
]
const GOLDEN_ANGLE = 2.399963229

// Unit-sphere Fibonacci distribution. Pixel radii are derived from the
// container size every frame, so the ellipse is responsive without
// breakpoints. The item plane NEVER rotates (billboard): positions are
// recomputed per frame in the rAF loop, so chips always face the viewer.
const cloudIcons = CLOUD_ICONS.map((item, i, arr) => {
  const N = arr.length
  // Half-step offset keeps ny strictly inside (-1, 1) — the first/last
  // samples would otherwise land exactly on the rotation poles (r = 0)
  // and never orbit.
  const ny = 1 - ((i + 0.5) / N) * 2
  const r = Math.sqrt(Math.max(0, 1 - ny * ny))
  const theta = i * GOLDEN_ANGLE
  return {
    ...item,
    nx: Math.cos(theta) * r,
    ny,
    nz: Math.sin(theta) * r,
  }
})

// Pit items for the hobby playground
const pitItems: PitItem[] = HOBBIES.map((h, i) => ({
  name: h.name,
  icon: h.icon,
  color: HOBBY_COLORS[i % HOBBY_COLORS.length] ?? '#EC4899',
}))

const cloudEl = ref<HTMLElement | null>(null)
const dragging = ref(false)
const hoveredIndex = ref<number | null>(null)
const itemEls: Array<HTMLElement | null> = []
const setItemRef = (i: number, el: unknown) => {
  itemEls[i] = el instanceof HTMLElement ? el : null
}

// Orbit state — angle in degrees, velocity in deg/s
const CRUISE = 10 // auto-spin speed
const HOVER_FACTOR = 0.12 // rotation slowdown while a chip is hovered
const DAMP = 2.2 // 1/s approach rate toward the target velocity
const HOVER_RADIUS = 26 // px around each projected center, occlusion-free
const HOVER_RADIUS_SQ = HOVER_RADIUS * HOVER_RADIUS
// Static tilt of the orbit plane around the screen Z axis — a leaning ring
// reads far more volumetric than a flat horizontal one
const TILT = (-16 * Math.PI) / 180
const TILT_C = Math.cos(TILT)
const TILT_S = Math.sin(TILT)
let angle = 0
let velocity = 0
let dragVelocity = 0
let lastPointerX = 0
let lastPointerT = 0
let pointerX = 0 // client coords, relative to the container box
let pointerY = 0
let pointerInside = false
let inView = false
let rafId = 0
let prevT = 0
let cloudWidth = 0
let cloudHeight = 0
let cloudObserver: IntersectionObserver | null = null
const reducedQuery =
  typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null

// Per-frame projected positions (reused buffers, no per-frame allocations)
const posTX: number[] = []
const posTY: number[] = []
const posZ: number[] = []
const posD: number[] = []

function onCloudResize() {
  if (!cloudEl.value) return
  cloudWidth = cloudEl.value.clientWidth
  cloudHeight = cloudEl.value.clientHeight
}

function onPointerDown(e: PointerEvent) {
  dragging.value = true
  hoveredIndex.value = null
  dragVelocity = 0
  lastPointerX = e.clientX
  lastPointerT = performance.now()
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
}

function onPointerMove(e: PointerEvent) {
  const rect = cloudEl.value?.getBoundingClientRect()
  if (rect) {
    pointerX = e.clientX - rect.left
    pointerY = e.clientY - rect.top
    pointerInside = true
  }
  if (!dragging.value) return
  const now = performance.now()
  const dt = Math.max(now - lastPointerT, 1)
  const dx = e.clientX - lastPointerX
  lastPointerX = e.clientX
  lastPointerT = now
  const dAngle = (dx / Math.max(cloudWidth, 1)) * 360
  angle += dAngle
  dragVelocity = dragVelocity * 0.6 + (dAngle / dt) * 1000 * 0.4
}

function onPointerLeave() {
  pointerInside = false
  hoveredIndex.value = null
}

function onPointerUp() {
  if (!dragging.value) return
  dragging.value = false
  // hand the last drag velocity to the inertia loop (clamped)
  velocity = Math.max(-900, Math.min(900, dragVelocity))
}

function tick(now: number) {
  rafId = requestAnimationFrame(tick)
  const dt = Math.min((now - prevT) / 1000, 0.05)
  prevT = now
  if (!inView || !cloudWidth) return

  if (!dragging.value) {
    const target = reducedQuery?.matches
      ? 0
      : CRUISE * (hoveredIndex.value !== null ? HOVER_FACTOR : 1)
    velocity += (target - velocity) * (1 - Math.exp(-DAMP * dt))
    angle += velocity * dt
  }

  const rx = Math.max(140, Math.min(cloudWidth / 2 - 30, 520))
  const ry = cloudHeight * 0.28
  const rz = Math.min(cloudWidth * 0.16, 190)
  const rad = (angle * Math.PI) / 180
  const cos = Math.cos(rad)
  const sin = Math.sin(rad)

  // Pass 1: project every icon onto the tilted orbit plane
  for (let i = 0; i < cloudIcons.length; i++) {
    const p = cloudIcons[i]
    if (!p) continue
    const x0 = (p.nx * cos + p.nz * sin) * rx
    const z = (-p.nx * sin + p.nz * cos) * rz
    const y0 = p.ny * ry
    posTX[i] = x0 * TILT_C - y0 * TILT_S
    posTY[i] = x0 * TILT_S + y0 * TILT_C
    posZ[i] = z
    posD[i] = (z / rz + 1) / 2 // 0 = far back, 1 = closest
  }

  // Pass 2: hover by distance to the projected centers — independent of
  // z-order occlusion and of DOM hit-testing, so back icons respond just
  // as instantly as front ones
  let newHovered: number | null = null
  if (pointerInside && !dragging.value) {
    const px = pointerX - cloudWidth / 2
    const py = pointerY - cloudHeight / 2
    let best = HOVER_RADIUS_SQ
    for (let i = 0; i < cloudIcons.length; i++) {
      const dx = posTX[i]! - px
      const dy = posTY[i]! - py
      const dist = dx * dx + dy * dy
      if (dist <= best) {
        best = dist
        newHovered = i
      }
    }
  }
  hoveredIndex.value = newHovered

  // Pass 3: write styles
  for (let i = 0; i < cloudIcons.length; i++) {
    const el = itemEls[i]
    if (!el) continue
    const d = posD[i]!
    const hovered = newHovered === i
    const scale = 0.7 + 0.4 * d
    const opacity = hovered ? 1 : Math.round((0.3 + 0.7 * d) * 20) / 20
    const blur = hovered ? 0 : Math.round((1 - d) * 3)
    el.style.transform = `translate(-50%, -50%) translate3d(${posTX[i]!.toFixed(1)}px, ${posTY[i]!.toFixed(1)}px, ${posZ[i]!.toFixed(1)}px) scale(${scale.toFixed(3)})`
    el.style.opacity = String(opacity)
    el.style.filter = blur > 0 ? `blur(${blur}px)` : 'none'
    el.style.zIndex = hovered ? '3000' : String(Math.round(1000 + posZ[i]!))
  }
}

// ========== Lifecycle ==========
onMounted(() => {
  startTyping()

  // Weather
  startWeatherRefresh()

  // Icon cloud orbit loop
  onCloudResize()
  prevT = performance.now()
  rafId = requestAnimationFrame(tick)
  window.addEventListener('resize', onCloudResize, { passive: true })
  if (cloudEl.value) {
    cloudObserver = new IntersectionObserver(
      ([entry]) => {
        inView = entry?.isIntersecting ?? false
      },
      { threshold: 0.05 },
    )
    cloudObserver.observe(cloudEl.value)
  }
})

onUnmounted(() => {
  stopWeatherRefresh()
  if (toastTimer) clearTimeout(toastTimer)
  cancelAnimationFrame(rafId)
  window.removeEventListener('resize', onCloudResize)
  cloudObserver?.disconnect()
  cloudObserver = null
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
              @mouseenter="handleAvatarEnter"
              @mousemove="handleAvatarMove"
              @mouseleave="handleAvatarLeave"
            >
              <img
                :src="avatarSrc"
                alt="avatar"
                class="avatar"
                :style="avatarStyle"
              />
            </div>
            <h1 class="name name-aurora">{{ PROFILE.displayName }}</h1>
            <p class="title">{{ PROFILE.jobTitle }}</p>

            <!-- Signature -->
            <div class="signature">
              <div class="signature-line">
                <span class="signature-text">{{ typedSignature[0] }}</span>
                <span v-if="!typedSignature[1]" class="cursor" />
              </div>
              <div class="signature-line">
                <span class="signature-text">{{ typedSignature[1] }}</span>
                <span
                  v-if="typedSignature[1] && typedSignature[1].length < (signatureLines[1]?.length ?? 0)"
                  class="cursor"
                />
                <span
                  v-if="
                    typedSignature[1] && typedSignature[1].length === (signatureLines[1]?.length ?? 0)
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
          </div>
        </div>
      </section>

      <!-- About Blog -->
      <section class="section reveal">
        <h2 class="section-title">关于</h2>
        <p class="about-text text-generate">
          {{ PROFILE.aboutBlurb }}
        </p>
      </section>

      <!-- Skills & Interests -->
      <section class="section reveal">
        <h2 class="section-title">技能与兴趣</h2>
        <div class="skills-grid">
          <span
            v-for="tech in techStack"
            :key="tech.name"
            class="skill-tag spotlight-tag"
            :style="{
              '--tag-color': tech.color,
              '--tag-level': tech.level + '%',
            }"
            @mouseenter="handleTagEnter"
            @mousemove="handleTagMouseMove"
            @mouseleave="handleTagLeave"
          >
            <Icon :icon="tech.icon" width="14" height="14" />
            <span>{{ tech.name }}</span>
            <span class="skill-level-bar" />
          </span>
        </div>
        <div class="hobbies-row">
          <span v-for="hobby in hobbies" :key="hobby.name" class="hobby-tag">
            <span class="hobby-icon-bg">
              <Icon :icon="hobby.icon" width="12" height="12" />
            </span>
            <span>{{ hobby.name }}</span>
          </span>
        </div>
      </section>

      <!-- Skill Constellation: 3D icon cloud (skills + hobbies on a sphere) -->
      <section class="section reveal">
        <h2 class="section-title">技能全景</h2>        <div class="icon-cloud-wrap">
          <div
            ref="cloudEl"
            class="icon-cloud"
            :class="{ dragging }"
            @pointerdown="onPointerDown"
            @pointermove="onPointerMove"
            @pointerup="onPointerUp"
            @pointercancel="onPointerUp"
            @pointerleave="onPointerLeave"
          >
            <div class="icon-cloud-sphere">
              <span
                v-for="(item, i) in cloudIcons"
                :key="item.name"
                :ref="(el) => setItemRef(i, el)"
                class="icon-cloud-item"
                :style="{ transform: 'translate(-50%, -50%)' }"
              >
                <span
                  class="icon-cloud-chip"
                  :style="{ '--item-color': item.color }"
                  :class="{ 'is-hover': hoveredIndex === i }"
                >
                  <Icon :icon="item.icon" width="16" height="16" :style="{ color: item.color }" />
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Hobby Playground: physics ball pit -->
      <section class="section reveal">
        <h2 class="section-title">兴趣游乐场</h2>
        <p class="ballpit-hint">抓起一颗球甩出去试试</p>
        <SkillBallpit :items="pitItems" />
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
          <button
            v-for="contact in contacts"
            :key="contact.label"
            type="button"
            class="contact-card magnetic-contact"
            :style="{ '--contact-color': contact.color }"
            :aria-label="`复制${contact.label}：${contact.value}`"
            @mouseenter="handleContactEnter"
            @mousemove="handleContactMove"
            @mouseleave="handleMagneticLeave"
            @click="(e) => copyToClipboard(contact.value, contact.label, e)"          >
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
          </button>
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
            rel="noopener noreferrer"
            class="social-circle"
            :style="{ '--social-color': social.color }"
            :title="social.name"
          >
            <span class="social-icon-inner">
              <Icon :icon="social.icon" width="18" height="18" :style="{ color: social.color }" />
            </span>
          </a>
        </div>
        <p class="social-footer">{{ currentYear }} &mdash; {{ SITE_BRAND }}</p>
      </section>
    </main>

    <CopyToast :show="toastVisible" :message="toastMessage" />
  </div>
</template>

<style lang="scss" scoped>
@use '../styles/animations' as anim;
@use '../styles/mixins' as mix;

/* ===== CSS Houdini ===== */
/* ===== Page-specific Keyframes ===== */
@keyframes hero-glow-spin {
  to {
    --hero-glow-angle: 360deg;
  }
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

@keyframes weather-pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
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

@keyframes glow-rotate {
  0% {
    filter: hue-rotate(0deg);
  }
  100% {
    filter: hue-rotate(360deg);
  }
}

/* ===== Layout ===== */
.about-layout {
  max-width: 72rem; /* max-w-6xl，与首页版心一致 */
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
  @include anim.off-screen-skip(900px);
}

/* Double-Bezel Hero Card */
.hero-card-outer {
  background: rgba(24, 24, 27, 0.02);
  border: 1px solid var(--border-light);
  border-radius: 24px;
  padding: 2px;
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.04),
    0 8px 24px rgba(0, 0, 0, 0.06);
  position: relative;

  html.dark & {
    background: rgba(250, 250, 248, 0.03);
    box-shadow:
      0 1px 2px rgba(0, 0, 0, 0.2),
      0 8px 24px rgba(0, 0, 0, 0.3);
  }

  html.dark &::before {
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
}

.hero-card-inner {
  background: var(--card-bg);
  border-radius: 22px;
  padding: 24px 20px;
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.5);
  text-align: center;

  html.dark & {
    box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.05);
  }
}

/* 3D Tilt Avatar */
.avatar-wrapper {
  display: inline-block;
  margin-bottom: 16px;
  perspective: 1000px;
  cursor: pointer;

  .avatar {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    border: 2px solid var(--border-light);
    box-shadow:
      0 1px 2px var(--shadow-soft),
      0 8px 24px var(--shadow-soft);
    object-fit: cover;
    transform-style: preserve-3d;
    will-change: transform;
  }

  &:hover .avatar {
    box-shadow:
      0 1px 2px var(--shadow-soft),
      0 8px 24px var(--shadow-soft);
  }
}

.name {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4px;
  letter-spacing: -0.03em;
  line-height: 1.1;
}

/* Aurora name: brand gradient flowing through the glyphs. The animation
   runs only while on screen (play-state gated by the `motion-on` class). */
.name-aurora {
  background-image: linear-gradient(90deg, #ec4899, #8b5cf6, #f97316, #ec4899);
  background-size: 300% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: aurora-shift 9s linear infinite;
  animation-play-state: paused;
}

.name-aurora.motion-on {
  animation-play-state: running;
}

@keyframes aurora-shift {
  to {
    background-position: 300% 0;
  }
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

  .signature-line {
    min-height: 24px;
  }

  .signature-text {
    font-weight: 400;
  }

  .cursor {
    @include anim.cursor(16px);
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
  background: var(--page-bg);
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

  &::after {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 50%;
    background: var(--color-status-success);
    opacity: 0.4;
    animation: breathe 2s ease-in-out infinite;
  }
}

/* Weather Icon Animation */
.weather-icon-wrap {
  display: inline-flex;
  animation: weather-pulse 3s ease-in-out infinite;
}

/* Music Icon Wave Animation */
.music-icon-wrap {
  display: inline-flex;
  position: relative;

  &::before,
  &::after {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    border: 1.5px solid var(--accent);
    opacity: 0;
    animation: music-wave 2s ease-out infinite;
  }

  &::after {
    animation-delay: 0.6s;
  }
}

.update-time {
  font-size: 10px;
  opacity: 0.6;
}

/* ===== Sections ===== */
.section {
  margin-bottom: 14px;
  @include anim.off-screen-skip(700px);

  &::before {
    content: '';
    display: block;
    height: 1px;
    background: var(--border-light);
    margin-bottom: 10px;
  }

  &:first-child::before {
    display: none;
  }
}

.section-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin-bottom: 8px;

  @include anim.section-title-lamp;
}

/* About Text */
.about-text {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.7;
  max-width: 100%;
}

/* Text Generate Effect — opacity/transform only (no blur for lower GPU cost) */
.text-generate {
  opacity: 0;
  transform: translateY(8px);
  transition:
    opacity 0.8s cubic-bezier(0.32, 0.72, 0, 1),
    transform 0.8s cubic-bezier(0.32, 0.72, 0, 1);

  &.revealed-text {
    opacity: 1;
    transform: translateY(0);
  }
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
  border: 1px solid rgba(24, 24, 27, 0.12);
  box-shadow: inset 0 0 0 0.5px rgba(24, 24, 27, 0.04);
  background: transparent;
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

  html.dark & {
    border-color: rgba(250, 250, 248, 0.14);
    box-shadow: inset 0 0 0 0.5px rgba(250, 250, 248, 0.05);
  }

  &:hover {
    border-color: var(--tag-color, var(--accent));
    color: var(--tag-color, var(--accent));
    box-shadow:
      0 2px 10px var(--shadow-soft),
      0 0 12px -3px var(--tag-color, var(--accent));
    transform: scale(1.05) translateY(-2px);
  }

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

  &:hover .skill-level-bar {
    transform: scaleX(1);
  }
}

.revealed .skill-tag {
  opacity: 1;
  transform: translateY(0) rotate(0deg);
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
  border: 1px solid rgba(24, 24, 27, 0.12);
  box-shadow: inset 0 0 0 0.5px rgba(24, 24, 27, 0.04);
  background: transparent;
  color: var(--text-muted);
  cursor: default;
  position: relative;
  overflow: hidden;
  transition:
    transform 0.28s cubic-bezier(0.32, 0.72, 0, 1),
    box-shadow 0.28s cubic-bezier(0.32, 0.72, 0, 1),
    border-color 0.22s ease,
    color 0.18s ease,
    background-color 0.22s ease;
  opacity: 0;
  transform: translateY(8px) rotate(1deg);

  html.dark & {
    border-color: rgba(250, 250, 248, 0.14);
    box-shadow: inset 0 0 0 0.5px rgba(250, 250, 248, 0.05);
  }

  /* soft accent wash on hover */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      color-mix(in srgb, var(--accent) 14%, transparent),
      color-mix(in srgb, var(--accent) 4%, transparent)
    );
    opacity: 0;
    transition: opacity 0.28s ease;
    pointer-events: none;
  }

  &:hover {
    border-color: color-mix(in srgb, var(--accent) 55%, transparent);
    color: var(--accent);
    background: transparent;
    transform: translateY(-3px) scale(1.06);
    box-shadow:
      0 6px 16px -6px color-mix(in srgb, var(--accent) 35%, transparent),
      0 0 0 1px color-mix(in srgb, var(--accent) 12%, transparent);

    &::after {
      opacity: 1;
    }

    .hobby-icon-bg {
      background: var(--accent);
      color: #fff;
      transform: scale(1.12) rotate(-6deg);
      border-color: transparent;
      box-shadow: 0 2px 8px color-mix(in srgb, var(--accent) 40%, transparent);
    }
  }

  .hobby-icon-bg {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    background: transparent;
    border: 1px solid rgba(24, 24, 27, 0.08);
    color: var(--text-muted);
    transition:
      transform 0.28s cubic-bezier(0.32, 0.72, 0, 1),
      background-color 0.28s cubic-bezier(0.32, 0.72, 0, 1),
      border-color 0.28s cubic-bezier(0.32, 0.72, 0, 1),
      color 0.28s cubic-bezier(0.32, 0.72, 0, 1),
      box-shadow 0.28s cubic-bezier(0.32, 0.72, 0, 1);
    flex-shrink: 0;
    position: relative;
    z-index: 1;

    html.dark & {
      border-color: rgba(250, 250, 248, 0.1);
    }
  }

  > span:not(.hobby-icon-bg) {
    position: relative;
    z-index: 1;
  }
}

.revealed .hobby-tag {
  opacity: 1;
  transform: translateY(0) rotate(0deg);
}

/* Spotlight Effect */
.spotlight-tag {
  &::before {
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

  &:hover::before {
    opacity: 1;
  }

  html.dark &::before {
    background: radial-gradient(
      200px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%),
      rgba(244, 114, 182, 0.08),
      transparent 40%
    );
  }
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
  width: 100%;
  padding: 16px;
  background: transparent;
  border: 1px solid rgba(24, 24, 27, 0.12);
  box-shadow: inset 0 0 0 0.5px rgba(24, 24, 27, 0.04);
  border-radius: 12px;
  cursor: pointer;
  text-align: left;
  font: inherit;
  color: inherit;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
  position: relative;
  overflow: hidden;

  &:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  html.dark & {
    border-color: rgba(250, 250, 248, 0.14);
    box-shadow: inset 0 0 0 0.5px rgba(250, 250, 248, 0.05);
  }

  &::before {
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

  &:hover::before {
    opacity: 0.7;
  }

  &:hover {
    border-color: color-mix(in srgb, var(--contact-color, var(--accent)) 45%, transparent);
    box-shadow:
      0 4px 16px var(--shadow-soft),
      0 0 0 1px color-mix(in srgb, var(--contact-color, var(--accent)) 12%, transparent);

    .contact-card-icon {
      transform: scale(1.1);
      border-color: color-mix(in srgb, var(--contact-color, var(--accent)) 30%, transparent);
    }
  }

  .contact-card-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: transparent;
    border: 1px solid rgba(24, 24, 27, 0.08);
    transition:
      transform 0.2s ease,
      border-color 0.2s ease;

    html.dark & {
      border-color: rgba(250, 250, 248, 0.1);
    }
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
    transition:
      transform 0.2s ease,
      background-color 0.2s ease,
      border-color 0.2s ease,
      color 0.2s ease,
      box-shadow 0.2s ease;

    &.show {
      opacity: 1;
      transform: translateX(0);
    }
  }
}

/* Confetti Burst (WAAPI drives the per-piece transforms) */
.confetti-piece {
  position: absolute;
  pointer-events: none;
  z-index: 100;
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
  background: transparent;
  border: 1px solid rgba(24, 24, 27, 0.12);
  box-shadow: inset 0 0 0 0.5px rgba(24, 24, 27, 0.04);
  border-radius: 10px;
  cursor: default;
  opacity: 0;
  transform: translateY(8px);
  transition:
    transform 0.16s cubic-bezier(0.32, 0.72, 0, 1),
    box-shadow 0.16s cubic-bezier(0.32, 0.72, 0, 1),
    border-color 0.16s cubic-bezier(0.32, 0.72, 0, 1),
    color 0.08s linear;

  html.dark & {
    border-color: rgba(250, 250, 248, 0.14);
    box-shadow: inset 0 0 0 0.5px rgba(250, 250, 248, 0.05);
  }

  &:hover {
    border-color: var(--tl-color, var(--accent));
    box-shadow:
      0 2px 8px var(--shadow-soft),
      0 0 14px -5px var(--tl-color, var(--accent));
    transform: translateY(-2px) scale(1.03);

    .about-timeline-card-icon {
      background: var(--tl-color, var(--accent));
      color: var(--color-text-inverse);
      border-color: transparent;
    }
  }

  .about-timeline-card-icon {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: transparent;
    border: 1px solid rgba(24, 24, 27, 0.08);
    color: var(--tl-color, var(--accent));
    transition:
      transform 0.25s ease,
      background-color 0.25s ease,
      border-color 0.25s ease,
      color 0.25s ease,
      box-shadow 0.25s ease;

    html.dark & {
      border-color: rgba(250, 250, 248, 0.1);
    }
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
}

.revealed .about-timeline-card {
  opacity: 1;
  transform: translateY(0);
}

/* ===== 3D Icon Cloud (wide ellipsoid) ===== */
.icon-cloud-wrap {
  display: flex;
  justify-content: center;
  padding: 16px 0 8px;
}

/* ===== 3D Icon Cloud — JS-driven billboard orbit (drag + inertia + hover) ===== */
.icon-cloud-wrap {
  display: flex;
  justify-content: center;
  padding: 16px 0 8px;
}

.icon-cloud {
  position: relative;
  width: 100%;
  max-width: 1040px;
  height: 440px;
  perspective: 1600px;
  cursor: grab;
  touch-action: pan-y;
  user-select: none;

  &.dragging {
    cursor: grabbing;
  }
}

/* Static wrapper — the orbit angle is applied per-frame from JS */
.icon-cloud-sphere {
  position: absolute;
  inset: 0;
}

/* Billboard anchor: the rAF loop writes transform (translate3d only — the
   item plane never rotates, so chips always face the viewer) and z-index.
   Hover is resolved by distance in the loop, so hit-testing/occlusion
   plays no role — pointer-events are off entirely. */
.icon-cloud-item {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 38px;
  height: 38px;
  pointer-events: none;
}

.icon-cloud-chip {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  border: 1px solid color-mix(in srgb, var(--item-color, var(--accent)) 45%, transparent);
  background: color-mix(in srgb, var(--item-color, var(--accent)) 8%, transparent);
  transition:
    transform 0.25s cubic-bezier(0.32, 0.72, 0, 1),
    box-shadow 0.25s ease,
    border-color 0.25s ease,
    background-color 0.25s ease;

  &.is-hover {
    transform: scale(1.18) translateY(-3px);
    border-color: var(--item-color, var(--accent));
    background: color-mix(in srgb, var(--item-color, var(--accent)) 18%, transparent);
    box-shadow:
      0 6px 18px color-mix(in srgb, var(--item-color, var(--accent)) 35%, transparent),
      0 0 14px -2px var(--item-color, var(--accent));
    animation: chip-float 1.6s ease-in-out infinite;
  }
}

@keyframes chip-float {
  0%,
  100% {
    translate: 0 0;
  }
  50% {
    translate: 0 -3px;
  }
}

/* ===== Hobby Playground ballpit ===== */
.ballpit-hint {
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 8px;
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
  background: transparent;
  border: 1px solid var(--border-light);
  text-decoration: none;
  transition:
    transform 0.3s cubic-bezier(0.32, 0.72, 0, 1),
    background-color 0.3s cubic-bezier(0.32, 0.72, 0, 1),
    border-color 0.3s cubic-bezier(0.32, 0.72, 0, 1),
    color 0.3s cubic-bezier(0.32, 0.72, 0, 1),
    box-shadow 0.3s cubic-bezier(0.32, 0.72, 0, 1);
  overflow: hidden;

  &::before {
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

  &:hover::before {
    opacity: 1;
    animation: glow-rotate 2s linear infinite;
  }

  &:hover {
    box-shadow: 0 2px 14px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px) scale(1.08);

    .social-icon-inner {
      animation: social-bounce 0.4s cubic-bezier(0.32, 0.72, 0, 1);
    }
  }

  html.dark &:hover {
    box-shadow: 0 2px 14px rgba(0, 0, 0, 0.3);
  }

  html.dark & {
    background: transparent;
  }

  .social-icon-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
  }
}

/* ===== Scroll Reveal with Stagger ===== */
.reveal {
  @include anim.reveal(20px);
}

/* ===== Reduced Motion ===== */
@include anim.reduced-motion {
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
    transform: none;
    transition: none;
  }

  .section-title::after {
    display: none;
  }

  .hero-card-outer {
    html.dark &::before {
      animation: none;
    }
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

  .music-icon-wrap {
    &::before,
    &::after {
      animation: none;
    }
  }

  .social-circle:hover .social-icon-inner {
    animation: none;
  }

  /* Static fallbacks for the perpetual animations */
  .name-aurora {
    animation: none;
  }

  .icon-cloud-chip.is-hover {
    animation: none;
  }
}

/* ===== Responsive ===== */
@include mix.respond-to('md') {
  .about-layout {
    padding: 14px 16px 20px;
  }

  .hero-card-inner {
    padding: 20px 16px;
  }

  .avatar-wrapper .avatar {
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

  .icon-cloud {
    height: 400px;
  }

  .contact-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .social-row {
    gap: 10px;
  }
}

@include mix.respond-to('sm') {
  .about-layout {
    padding: 12px 14px 18px;
  }

  .hero-card-inner {
    padding: 16px 12px;
  }

  .avatar-wrapper {
    margin-bottom: 12px;

    .avatar {
      width: 72px;
      height: 72px;
    }
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

  .icon-cloud {
    height: 280px;
  }

  .icon-cloud-item {
    width: 32px;
    height: 32px;
  }

  .contact-grid {
    grid-template-columns: 1fr;
  }

  .status-bar {
    flex-direction: column;
    gap: 6px;
    padding: 10px 16px;
  }

  .skill-tag,
  .hobby-tag {
    transition-delay: 0ms !important;
  }
}

@include mix.respond-to('xs') {
  .skills-grid {
    grid-template-columns: 1fr;
  }

  .social-row {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
