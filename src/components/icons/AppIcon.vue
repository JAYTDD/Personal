<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { Icon } from '@iconify/vue'

// Top 5 most-frequently-used icons inlined as SVG paths to skip iconify lookup.
// All other icons fall through to @iconify/vue (now backed by local data).
type InlineName = 'sun' | 'moon' | 'arrow-up' | 'arrow-up-right' | 'github'

const props = withDefaults(
  defineProps<{
    name: string
    width?: string | number
    height?: string | number
  }>(),
  {
    width: '1em',
    height: '1em',
  },
)

// Multi-root template (v-if/v-else) breaks Vue's automatic class/style
// fallthrough, so consumers' Tailwind size/position classes (h-5, w-4,
// absolute, etc.) were silently dropped — the SVG kept its intrinsic
// 1em × 1em size and clipped the 24×24 viewBox content. Merge manually.
const attrs = useAttrs()
const mergedClass = computed<string>(() => {
  const incoming = attrs.class
  const extra = Array.isArray(incoming)
    ? incoming.filter(Boolean).join(' ')
    : (incoming as string | undefined) ?? ''
  return extra ? `icon-root ${extra}` : 'icon-root'
})

const inlineIcons: Record<InlineName, string> = {
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  'arrow-up': '<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>',
  'arrow-up-right': '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
  github: '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>',
}

const inlineName = computed<InlineName | null>(() => {
  if (props.name in inlineIcons) return props.name as InlineName
  return null
})
</script>

<template>
  <svg
    v-if="inlineName"
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    :class="mergedClass"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    v-html="inlineIcons[inlineName]"
  />
  <Icon
    v-else
    :icon="name"
    :width="width"
    :height="height"
    :class="mergedClass"
    aria-hidden="true"
  />
</template>
