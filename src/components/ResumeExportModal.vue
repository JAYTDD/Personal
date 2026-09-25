<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import AppIcon from '@/components/icons/AppIcon.vue'

/**
 * 自定义简历导出弹窗：左侧实时预览，右侧选项（PDF / PNG + 清晰度）。
 * 渲染管线：html.exporting 强制纸张外观 → html2canvas-pro 截图 →
 * PDF 用 jsPDF 按 A4 分页 / PNG 直接下载。两个库均为按需动态加载。
 */
const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

type Format = 'pdf' | 'png'
const format = ref<Format>('pdf')
const hiRes = ref(true)
const previewing = ref(false)
const exporting = ref(false)
const statusText = ref('')
const previewSrc = ref('')

const FILE_NAME = '黄晓伟-前端开发-简历'

// public/ asset — runtime string so Vite does not try to bundle it
const avatarSrc = `${import.meta.env.BASE_URL}avatar.jpg`

// ===== Preview zoom =====
const MIN_ZOOM = 0.5
const MAX_ZOOM = 2
const zoom = ref(1)

function setZoom(value: number) {
  zoom.value = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(value * 100) / 100))
}

function zoomBy(delta: number) {
  setZoom(zoom.value + delta)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.open) emit('close')
}

watch(
  () => props.open,
  (open) => {
    if (open) {
      document.addEventListener('keydown', onKeydown)
      document.body.style.overflow = 'hidden'
      void makePreview()
    } else {
      document.removeEventListener('keydown', onKeydown)
      document.body.style.overflow = ''
    }
  },
)

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})

/** Rasterize an off-screen paper-mode clone of the resume. The live page is
 *  never touched, so nothing flashes behind the modal's blurred backdrop. */
async function capture(scale: number): Promise<HTMLCanvasElement> {
  const el = document.querySelector<HTMLElement>('.resume-page')
  if (!el) throw new Error('未找到简历内容')

  const scope = document.createElement('div')
  scope.className = 'exporting-scope'
  scope.style.cssText = 'position:fixed;left:-99999px;top:0;width:1152px;'
  scope.appendChild(el.cloneNode(true))
  document.body.appendChild(scope)
  try {
    const html2canvas = (await import('html2canvas-pro')).default
    return await html2canvas(scope.firstElementChild as HTMLElement, {
      scale,
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
    })
  } finally {
    scope.remove()
  }
}

async function makePreview() {
  previewing.value = true
  try {
    const canvas = await capture(1)
    previewSrc.value = canvas.toDataURL('image/jpeg', 0.85)
  } catch {
    previewSrc.value = '' // preview is best-effort; downloads have their own errors
  } finally {
    previewing.value = false
  }
}

async function download() {
  if (exporting.value) return
  exporting.value = true
  statusText.value = format.value === 'pdf' ? '正在生成 PDF…' : '正在生成 PNG…'
  try {
    const canvas = await capture(hiRes.value ? 3 : 2)

    if (format.value === 'pdf') {
      const { jsPDF } = await import('jspdf')
      const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
      const imgW = 210 // A4 width, mm
      const imgH = (canvas.height / canvas.width) * imgW
      const jpeg = canvas.toDataURL('image/jpeg', 0.92)
      let rendered = 0
      let page = 0
      while (rendered < imgH - 0.5) {
        if (page > 0) pdf.addPage()
        pdf.addImage(jpeg, 'JPEG', 0, -rendered, imgW, imgH)
        rendered += 297 // A4 height, mm
        page++
      }
      pdf.save(`${FILE_NAME}.pdf`)
    } else {
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
      if (!blob) throw new Error('PNG 生成失败，请重试')
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${FILE_NAME}.png`
      a.click()
      URL.revokeObjectURL(url)
    }
    statusText.value = ''
  } catch (err) {
    statusText.value = err instanceof Error ? err.message : '生成失败，请重试'
  } finally {
    exporting.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="print-hide fixed inset-0 z-[200] flex items-center justify-center p-4"
      >
        <div
          class="absolute inset-0 bg-black/60 backdrop-blur-sm"
          @click="emit('close')"
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="导出简历"
          class="relative flex max-h-[86vh] w-full max-w-4xl flex-col rounded-2xl border border-border-default dark:border-border-dark bg-bg-primary dark:bg-bg-dark-secondary shadow-2xl modal-pop"
        >
          <!-- Header -->
          <div class="flex items-center justify-between border-b border-border-default dark:border-border-dark px-6 py-4">
            <div class="flex items-center gap-3">
              <img
                :src="avatarSrc"
                alt="头像"
                class="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-border-default dark:ring-border-dark"
              />
              <div>
                <h3 class="text-base font-semibold text-text-primary dark:text-text-dark-primary">
                  导出简历
                </h3>
                <p class="text-xs text-text-tertiary dark:text-text-dark-tertiary mt-0.5">
                  直接下载文件，不经过系统打印
                </p>
              </div>
            </div>
            <button
              type="button"
              aria-label="关闭"
              class="flex h-8 w-8 items-center justify-center rounded-full text-text-tertiary dark:text-text-dark-tertiary hover:bg-bg-secondary dark:hover:bg-bg-dark-tertiary hover:text-text-primary dark:hover:text-text-dark-primary transition-colors duration-200 cursor-pointer"
              @click="emit('close')"
            >
              <AppIcon name="lucide:x" class="h-4 w-4" />
            </button>
          </div>

          <!-- Body: preview + options (fixed height so the modal never
               resizes when the preview image loads) -->
          <div class="flex h-[440px] sm:h-[540px] min-h-0 flex-col sm:flex-row">
            <!-- Left: live preview (zoomable) -->
            <div class="flex h-full min-w-0 flex-1 flex-col">
              <!-- Zoom toolbar -->
              <div class="flex items-center justify-between gap-2 border-b border-border-default dark:border-border-dark px-3 py-1.5">
                <span class="text-xs text-text-tertiary dark:text-text-dark-tertiary">预览</span>
                <div class="flex items-center gap-1">
                  <button
                    type="button"
                    aria-label="缩小"
                    class="flex h-7 w-7 items-center justify-center rounded-md text-text-secondary dark:text-text-dark-secondary hover:bg-bg-secondary dark:hover:bg-bg-dark-tertiary hover:text-text-primary dark:hover:text-text-dark-primary transition-colors duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    :disabled="zoom <= MIN_ZOOM"
                    @click="zoomBy(-0.25)"
                  >
                    <AppIcon name="lucide:zoom-out" class="h-4 w-4" />
                  </button>
                  <span class="w-10 text-center text-xs tabular-nums text-text-secondary dark:text-text-dark-secondary">
                    {{ Math.round(zoom * 100) }}%
                  </span>
                  <button
                    type="button"
                    aria-label="放大"
                    class="flex h-7 w-7 items-center justify-center rounded-md text-text-secondary dark:text-text-dark-secondary hover:bg-bg-secondary dark:hover:bg-bg-dark-tertiary hover:text-text-primary dark:hover:text-text-dark-primary transition-colors duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    :disabled="zoom >= MAX_ZOOM"
                    @click="zoomBy(0.25)"
                  >
                    <AppIcon name="lucide:zoom-in" class="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="适应宽度"
                    title="适应宽度"
                    class="flex h-7 w-7 items-center justify-center rounded-md text-text-secondary dark:text-text-dark-secondary hover:bg-bg-secondary dark:hover:bg-bg-dark-tertiary hover:text-text-primary dark:hover:text-text-dark-primary transition-colors duration-150 cursor-pointer"
                    :class="{ 'text-brand-pink dark:text-brand-pink-light': zoom !== 1 }"
                    @click="setZoom(1)"
                  >
                    <AppIcon name="lucide:maximize" class="h-4 w-4" />
                  </button>
                </div>
              </div>

              <!-- Canvas -->
              <div class="flex-1 overflow-auto bg-bg-secondary dark:bg-bg-dark-tertiary p-4 sm:p-6">
                <div v-if="previewing" class="flex h-full min-h-[240px] flex-col items-center justify-center gap-3 text-text-tertiary dark:text-text-dark-tertiary">
                  <AppIcon name="lucide:loader-circle" class="h-6 w-6 animate-spin" />
                  <span class="text-sm">正在生成预览…</span>
                </div>
                <div
                  v-else-if="previewSrc"
                  class="mx-auto"
                  :style="{
                    width: `${zoom * 100}%`,
                    maxWidth: zoom === 1 ? '420px' : 'none',
                    transition: 'width 0.2s ease-out',
                  }"
                >
                  <img :src="previewSrc" alt="简历预览" class="block w-full rounded-md shadow-lg" />
                </div>
                <div v-if="!previewing && !previewSrc" class="flex h-full min-h-[240px] flex-col items-center justify-center gap-3 text-text-tertiary dark:text-text-dark-tertiary">
                  <AppIcon name="lucide:image-off" class="h-6 w-6" />
                  <span class="text-sm">预览生成失败，但不影响下载</span>
                </div>
              </div>
            </div>

            <!-- Right: options -->
            <div class="flex w-full shrink-0 flex-col gap-5 border-t border-border-default px-6 py-5 dark:border-border-dark sm:w-64 sm:border-l sm:border-t-0">
              <!-- Format -->
              <div>
                <p class="mb-2 text-xs font-semibold uppercase tracking-wider text-text-tertiary dark:text-text-dark-tertiary">
                  文件格式
                </p>
                <div class="flex flex-col gap-2">
                  <button
                    type="button"
                    class="flex items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-all duration-200 cursor-pointer"
                    :class="
                      format === 'pdf'
                        ? 'border-brand-pink/60 bg-[color-mix(in_srgb,var(--color-brand-pink)_8%,transparent)]'
                        : 'border-border-default dark:border-border-dark hover:border-border-hover dark:hover:border-border-dark-hover'
                    "
                    @click="format = 'pdf'"
                  >
                    <AppIcon name="lucide:file-text" class="h-5 w-5 shrink-0 text-brand-pink dark:text-brand-pink-light" />
                    <span class="flex-1">
                      <span class="block text-sm font-medium text-text-primary dark:text-text-dark-primary">
                        PDF 文档
                      </span>
                      <span class="block text-xs text-text-tertiary dark:text-text-dark-tertiary">
                        多页 A4 · 推荐投递使用
                      </span>
                    </span>
                    <AppIcon
                      v-if="format === 'pdf'"
                      name="lucide:circle-check"
                      class="h-4 w-4 text-brand-pink dark:text-brand-pink-light"
                    />
                  </button>
                  <button
                    type="button"
                    class="flex items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-all duration-200 cursor-pointer"
                    :class="
                      format === 'png'
                        ? 'border-brand-pink/60 bg-[color-mix(in_srgb,var(--color-brand-pink)_8%,transparent)]'
                        : 'border-border-default dark:border-border-dark hover:border-border-hover dark:hover:border-border-dark-hover'
                    "
                    @click="format = 'png'"
                  >
                    <AppIcon name="lucide:image" class="h-5 w-5 shrink-0 text-brand-pink dark:text-brand-pink-light" />
                    <span class="flex-1">
                      <span class="block text-sm font-medium text-text-primary dark:text-text-dark-primary">
                        PNG 长图
                      </span>
                      <span class="block text-xs text-text-tertiary dark:text-text-dark-tertiary">
                        单张完整长图 · 适合在线发送
                      </span>
                    </span>
                    <AppIcon
                      v-if="format === 'png'"
                      name="lucide:circle-check"
                      class="h-4 w-4 text-brand-pink dark:text-brand-pink-light"
                    />
                  </button>
                </div>
              </div>

              <!-- Quality -->
              <div>
                <p class="mb-2 text-xs font-semibold uppercase tracking-wider text-text-tertiary dark:text-text-dark-tertiary">
                  清晰度
                </p>
                <div class="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    class="rounded-lg border px-3 py-2 text-sm transition-all duration-200 cursor-pointer"
                    :class="
                      !hiRes
                        ? 'border-brand-pink/60 bg-[color-mix(in_srgb,var(--color-brand-pink)_8%,transparent)] text-text-primary dark:text-text-dark-primary font-medium'
                        : 'border-border-default dark:border-border-dark text-text-secondary dark:text-text-dark-secondary hover:border-border-hover dark:hover:border-border-dark-hover'
                    "
                    @click="hiRes = false"
                  >
                    标准 2x
                  </button>
                  <button
                    type="button"
                    class="rounded-lg border px-3 py-2 text-sm transition-all duration-200 cursor-pointer"
                    :class="
                      hiRes
                        ? 'border-brand-pink/60 bg-[color-mix(in_srgb,var(--color-brand-pink)_8%,transparent)] text-text-primary dark:text-text-dark-primary font-medium'
                        : 'border-border-default dark:border-border-dark text-text-secondary dark:text-text-dark-secondary hover:border-border-hover dark:hover:border-border-dark-hover'
                    "
                    @click="hiRes = true"
                  >
                    高清 3x
                  </button>
                </div>
              </div>

              <!-- Download -->
              <button
                type="button"
                class="mt-auto flex items-center justify-center gap-2 rounded-xl gradient-pink px-4 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:shadow-lg hover:opacity-90 active:scale-[0.98] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                :disabled="exporting"
                @click="download"
              >
                <AppIcon
                  :name="exporting ? 'lucide:loader-circle' : 'lucide:download'"
                  class="h-4 w-4"
                  :class="{ 'animate-spin': exporting }"
                />
                {{ exporting ? '生成中…' : format === 'pdf' ? '下载 PDF' : '下载 PNG' }}
              </button>
              <p
                v-if="statusText"
                class="text-xs text-center"
                :class="statusText.includes('…') ? 'text-text-tertiary dark:text-text-dark-tertiary' : 'text-status-error dark:text-status-error-dark'"
                aria-live="polite"
              >
                {{ statusText }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-pop {
  animation: modal-pop 0.25s cubic-bezier(0.32, 0.72, 0, 1);
}

@keyframes modal-pop {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .modal-pop {
    animation: none;
  }
}
</style>
