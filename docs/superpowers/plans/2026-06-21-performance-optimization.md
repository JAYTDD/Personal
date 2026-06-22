# Performance Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate the ~2s first-route-jump wait and remove remote icon API calls by self-hosting icons, chunking the build, prefetching routes, and trimming animation/scss overhead — landing LCP < 1.5s, first-route switch < 100ms, zero icon network requests.

**Architecture:** Three layers — (1) Foundation: ship iconify JSON data and Geist font locally, split vendor/icons chunks, raise inline threshold; (2) Experience: idle-time prefetch of all 5 view chunks + SakuraCanvas idle start + box-shadow/content-visibility/will-change tuning; (3) Cleanup: hoist page-level CSS variables to `:root` / `html.dark` so 3 views stop redefining them.

**Tech Stack:** Vue 3 + `<script setup>`, Vite 8, Tailwind 4, SCSS modules, @iconify/vue + @iconify-json/{lucide,simple-icons}, @fontsource/{geist-sans,geist-mono}, vue-router 5 (dynamic imports), requestIdleCallback.

---

## File Structure

**Create:**
- `src/components/icons/AppIcon.vue` — unified icon component (Top 5 inline SVG, rest via `@iconify/vue`)

**Modify:**
- `vite.config.ts` — build target, manualChunks, optimizeDeps, assetsInlineLimit
- `src/main.ts` — register iconify collections
- `src/App.vue` — add `prefetchRoutes()` with `requestIdleCallback`
- `index.html` — remove Google Fonts, keep dark-mode guard
- `src/assets/tailwind.css` — import fontsource CSS
- `src/styles/_variables.scss` — convert `@mixin page-variables` to `:root` / `html.dark` rules; add `app-font-*` preload
- `src/components/SakuraCanvas.vue` — idle start, visibility pause
- `src/components/ScrollToTop.vue` — rAF-throttled scroll
- `src/components/TopNavBar.vue` — replace `Icon` with `AppIcon` (sun/moon)
- `src/components/Footer.vue` — replace `Icon` with `AppIcon` (arrow-up-right, github, juejin)
- `src/components/ScrollToTop.vue` — replace `Icon` with `AppIcon` (arrow-up)
- `src/components/ProjectCard.vue` — replace `Icon` with `AppIcon` (star, github)
- `src/components/HeroSection.vue` — replace `Icon` with `AppIcon` (chevrons-down)
- `src/components/GitHubContributions.vue` — replace `Icon` with `AppIcon` (github)
- `src/views/AboutPage.vue` — drop `@include vars.page-variables`/`-dark` blocks; trim box-shadow; add `content-visibility`
- `src/views/ExperiencePage.vue` — drop `@include vars.page-variables`/`-dark` blocks; trim box-shadow; add `content-visibility`
- `src/views/ResumePage.vue` — drop `@include vars.page-variables`/`-dark` blocks; trim box-shadow; add `content-visibility`
- `src/views/HomePage.vue` — trim box-shadow; add `content-visibility` to projects section
- `src/views/NotFound.vue` — replace `Icon` with `AppIcon` (compass, home)
- `src/styles/_animations.scss` — remove `will-change` from `reveal` mixin
- `package.json` — add iconify-json + fontsource deps

**No test files exist in this project.** Verification is via `npm run type-check`, `npm run build`, `npm run lint`, and visual checks in the dev server (Vite preview after build).

---

## Task 1: Install iconify JSON and fontsource dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install iconify data packages and fontsource fonts**

Run in `d:\ProjectSave\Personal`:

```bash
npm install @iconify-json/lucide @iconify-json/simple-icons
npm install @fontsource/geist-sans @fontsource/geist-mono
```

Expected: 4 packages added; `package.json` dependencies updated; `package-lock.json` modified; no errors.

- [ ] **Step 2: Verify package.json contains the new deps**

Run:

```bash
grep -E "@iconify-json|@fontsource" package.json
```

Expected output (4 lines):

```
    "@fontsource/geist-mono": "...",
    "@fontsource/geist-sans": "...",
    "@iconify-json/lucide": "...",
    "@iconify-json/simple-icons": "...",
```

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore(deps): add @iconify-json data + @fontsource geist fonts"
```

---

## Task 2: Build the AppIcon component (Top 5 inline + iconify fallback)

**Files:**
- Create: `src/components/icons/AppIcon.vue`

- [ ] **Step 1: Create the directory and file**

Create `src/components/icons/AppIcon.vue` with the following content:

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

// Top 5 most-frequently-used icons inlined as SVG paths to skip iconify lookup.
// All other icons fall through to @iconify/vue (now backed by local data).
type InlineName = 'sun' | 'moon' | 'arrow-up' | 'arrow-up-right' | 'github'

const props = withDefaults(
  defineProps<{
    name: string
    width?: string | number
    height?: string | number
    class?: string
  }>(),
  {
    width: '1em',
    height: '1em',
  },
)

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
    :class="props.class"
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
    :class="props.class"
    aria-hidden="true"
  />
</template>
```

- [ ] **Step 2: Verify type-check passes**

Run: `npm run type-check`
Expected: exit code 0; no errors. (Vue compiler reports unused-import warnings only.)

- [ ] **Step 3: Commit**

```bash
git add src/components/icons/AppIcon.vue
git commit -m "feat(icons): add AppIcon component with Top 5 inline SVG"
```

---

## Task 3: Register iconify collections in main.ts

**Files:**
- Modify: `src/main.ts`

- [ ] **Step 1: Replace main.ts with the iconify registration**

Overwrite `src/main.ts` with:

```ts
import './assets/tailwind.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { addCollection } from '@iconify/vue'
import lucideIcons from '@iconify-json/lucide/icons.json'
import simpleIconsIcons from '@iconify-json/simple-icons/icons.json'

import App from './App.vue'
import router from './router'

// Register iconify data locally — eliminates ~29 remote API calls per page load.
// addCollection reuses the same registry instance, so registering twice is safe.
addCollection(lucideIcons as Parameters<typeof addCollection>[0])
addCollection(simpleIconsIcons as Parameters<typeof addCollection>[0])

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
```

- [ ] **Step 2: Type-check**

Run: `npm run type-check`
Expected: exit code 0.

- [ ] **Step 3: Dev-server smoke test**

Run: `npm run dev` (in a separate terminal or async).

In the browser, open `http://localhost:5173/` and verify:
- No icon visible is missing
- DevTools → Network → filter `api.iconify.design` shows 0 requests
- DevTools → Console shows no iconify errors

Stop the dev server before continuing.

- [ ] **Step 4: Commit**

```bash
git add src/main.ts
git commit -m "perf(icons): register lucide + simple-icons locally, kill API calls"
```

---

## Task 4: Vite build configuration (target, chunks, inline limit)

**Files:**
- Modify: `vite.config.ts`

- [ ] **Step 1: Replace vite.config.ts with the new build setup**

Overwrite `vite.config.ts` with:

```ts
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    target: 'es2020',
    assetsInlineLimit: 4096,
    cssCodeSplit: true,
    modulePreload: { polyfill: true },
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          icons: ['@iconify/vue'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['@iconify/vue'],
  },
})
```

- [ ] **Step 2: Build to verify chunks split correctly**

Run: `npm run build`
Expected: exit code 0; output lists at least one chunk named `vendor-*.js` and one named `icons-*.js` (or similar). If you see only one JS file, double-check `manualChunks` syntax.

- [ ] **Step 3: Inspect dist for chunk split**

Run (PowerShell):

```bash
Get-ChildItem dist\assets\*.js | Select-Object Name,Length
```

Expected: at least 3 distinct JS files (vendor, icons, app). Each view chunk is its own file.

- [ ] **Step 4: Commit**

```bash
git add vite.config.ts
git commit -m "perf(build): split vendor/icons chunks, target es2020, inline 4kb"
```

---

## Task 5: Self-host Geist fonts (remove Google Fonts, add fontsource imports)

**Files:**
- Modify: `index.html`
- Modify: `src/assets/tailwind.css`

- [ ] **Step 1: Remove Google Fonts preconnect + stylesheet from index.html**

In `index.html`, delete lines 19-24 (the 6-line `<link rel="preconnect" ...>` and `<link href="fonts.googleapis.com...">` block). The file should start with `<!doctype html>` and the next link after the favicon is the dark-mode guard script.

Result: lines 19-24 of `index.html` are removed. The dark-mode guard script (lines 25-37) stays.

- [ ] **Step 2: Add fontsource imports to tailwind.css**

In `src/assets/tailwind.css`, insert the following 6 lines at the very top, BEFORE the existing `@import "tailwindcss";` line:

```css
@import '@fontsource/geist-sans/400.css';
@import '@fontsource/geist-sans/500.css';
@import '@fontsource/geist-sans/600.css';
@import '@fontsource/geist-sans/700.css';
@import '@fontsource/geist-mono/400.css';
@import '@fontsource/geist-mono/500.css';

```

Save the file.

- [ ] **Step 3: Add font preload to index.html**

In `index.html`, immediately AFTER the `<title>...</title>` line (now line 18), insert a preload link. The simplest stable approach is to use `<link rel="preload" as="font" type="font/woff2" crossorigin href="...">` — but the fontsource font path is determined by Vite's asset hashing at build time, so we don't add a manual preload and let the @import css handle it. Skip this step.

(If you want explicit preloading later, use `import url from '@fontsource/geist-sans/files/geist-sans-latin-400-normal.woff2?url'` in main.ts and inject a `<link>` programmatically. Out of scope for this plan.)

- [ ] **Step 4: Build to confirm fonts are bundled**

Run: `npm run build`
Expected: exit code 0. Inspect `dist/assets/` — at least 6 `.woff2` files for geist should be present.

- [ ] **Step 5: Verify no Google Fonts references remain**

Run:

```bash
grep -r "fonts.googleapis\|fonts.gstatic" src/ index.html
```

Expected: no output (empty result). If any match remains, remove it.

- [ ] **Step 6: Commit**

```bash
git add index.html src/assets/tailwind.css
git commit -m "perf(fonts): self-host Geist via fontsource, drop Google Fonts"
```

---

## Task 6: Hoist page-level CSS variables to :root and html.dark

**Files:**
- Modify: `src/styles/_variables.scss`

- [ ] **Step 1: Replace _variables.scss content**

Overwrite `src/styles/_variables.scss` with:

```scss
// Page-level CSS variables — hoisted from per-view mixin into :root / html.dark
// so every component reads them without re-declaring. This kills the duplicated
// `@include vars.page-variables` + `vars.page-variables-dark` blocks in 3 views.

:root {
  --page-bg: var(--color-bg-primary);
  --card-bg: var(--color-text-inverse);
  --text-primary: var(--color-text-primary);
  --text-secondary: var(--color-text-secondary);
  --text-muted: var(--color-text-tertiary);
  --border-light: rgba(24, 24, 27, 0.06);
  --border-hover: rgba(24, 24, 27, 0.12);
  --accent: var(--color-brand-pink);
  --shadow-soft: rgba(24, 24, 27, 0.04);
  --shadow-hover: rgba(24, 24, 27, 0.08);
  --bg-hover: var(--color-bg-secondary);
}

html.dark {
  --page-bg: var(--color-bg-dark-primary);
  --card-bg: var(--color-bg-dark-secondary);
  --text-primary: var(--color-text-dark-primary);
  --text-secondary: var(--color-text-dark-secondary);
  --text-muted: var(--color-text-dark-tertiary);
  --border-light: rgba(250, 250, 248, 0.06);
  --border-hover: rgba(250, 250, 248, 0.12);
  --accent: var(--color-brand-pink-light);
  --shadow-soft: rgba(0, 0, 0, 0.3);
  --shadow-hover: rgba(0, 0, 0, 0.4);
  --bg-hover: var(--color-bg-dark-tertiary);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/_variables.scss
git commit -m "refactor(css): hoist page variables from mixin to :root and html.dark"
```

---

## Task 7: Remove duplicated page-variables blocks from views

**Files:**
- Modify: `src/views/AboutPage.vue`
- Modify: `src/views/ExperiencePage.vue`
- Modify: `src/views/ResumePage.vue`

- [ ] **Step 1: In AboutPage.vue, drop the SCSS mixin blocks**

Open `src/views/AboutPage.vue` and locate the styles section starting with `@use '../styles/variables' as vars;` (line 628).

Find and delete BOTH of these blocks (they appear in the body, not the use block):

```scss
  @include vars.page-variables;
  ...
  }
  html.dark & {
    @include vars.page-variables-dark;
  }
```

Specifically:
- The `.about-page { @include vars.page-variables; ... }` block (around line 710)
- The `html.dark & { @include vars.page-variables-dark; ... }` block (around line 719)

Both are now redundant because the variables are global.

- [ ] **Step 2: In ExperiencePage.vue, drop the SCSS mixin blocks**

Open `src/views/ExperiencePage.vue` and locate the styles section starting with `@use '../styles/variables' as vars;` (line 309).

Find and delete the same two mixin blocks. Specifically:
- The `.experience-page { @include vars.page-variables; ... }` block (around line 314)
- The `html.dark & { @include vars.page-variables-dark; ... }` block (around line 317)

- [ ] **Step 3: In ResumePage.vue, drop the SCSS mixin block**

Open `src/views/ResumePage.vue` and locate the styles section. Find and delete the single block:
- The `.resume-page { @include vars.page-variables; ... }` block (around line 771)

(ResumePage only has the light-mode block; the dark-mode `& { ... }` is its own non-mixin block and should be left intact.)

- [ ] **Step 4: Type-check**

Run: `npm run type-check`
Expected: exit code 0. (SCSS compilation errors only show at build; proceed to step 5.)

- [ ] **Step 5: Build to catch SCSS errors**

Run: `npm run build`
Expected: exit code 0. If a SCSS error references an unknown mixin, you missed a block — re-grep for `vars.page-variables` in the views.

- [ ] **Step 6: Verify zero remaining references to the mixin**

Run:

```bash
grep -rn "page-variables" src/views src/styles
```

Expected: only the definition file `src/styles/_variables.scss` shows up (and it should NOT contain `page-variables` anymore — only `:root` / `html.dark` rules). If any view still references it, edit it out.

- [ ] **Step 7: Visual smoke test**

Run: `npm run dev` in a separate terminal.

Open `http://localhost:5173/about`, `/experience`, `/resume`. Verify all cards/borders/text colors still look correct in both light and dark mode (toggle the theme button in TopNavBar). Stop the dev server.

- [ ] **Step 8: Commit**

```bash
git add src/views/AboutPage.vue src/views/ExperiencePage.vue src/views/ResumePage.vue
git commit -m "refactor(views): drop redundant page-variables mixin blocks"
```

---

## Task 8: Trim heavy box-shadows in views (3 files)

**Files:**
- Modify: `src/views/AboutPage.vue`
- Modify: `src/views/ExperiencePage.vue`
- Modify: `src/views/ResumePage.vue`
- Modify: `src/views/HomePage.vue`

- [ ] **Step 1: AboutPage.vue — reduce heavy shadow rules**

Open `src/views/AboutPage.vue` and replace each occurrence of the pattern:

```scss
  box-shadow: 0 24px 64px rgba(24, 24, 27, 0.06);
```

with:

```scss
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.04),
    0 8px 24px rgba(0, 0, 0, 0.06);
```

And the dark variant:

```scss
    box-shadow: 0 24px 64px rgba(0, 0, 0, 0.3);
```

with:

```scss
    box-shadow:
      0 1px 2px rgba(0, 0, 0, 0.2),
      0 8px 24px rgba(0, 0, 0, 0.3);
```

Use Edit tool with `replace_all=true` for each pattern (4 occurrences total in AboutPage — 2 light, 2 dark, lines ~739, ~744, ~800, ~807).

- [ ] **Step 2: HomePage.vue — slim the project-card shadow**

Open `src/components/ProjectCard.vue` and locate the `class="... shadow-lg ..."` on the `<article>` element (line 77). Change `shadow-lg` to `shadow-md` (one notch lighter, matches the new double-layer pattern). No box-shadow literals in ProjectCard need direct editing.

Verify: `grep "shadow-lg" src/components/ProjectCard.vue` returns no results after the edit.

- [ ] **Step 3: ExperiencePage.vue — keep existing subtle shadows**

The shadows in `ExperiencePage.vue` are already `box-shadow: 0 0 0 4px rgba(...)` (focus rings) and small glow effects. No change needed. Confirm with `grep -c "box-shadow: 0 24px" src/views/ExperiencePage.vue` returning `0`.

- [ ] **Step 4: ResumePage.vue — trim the heavy contact-card shadow**

In `src/views/ResumePage.vue`, locate any `box-shadow: 0 8px 32px var(--shadow-soft);` and `box-shadow: 0 20px 60px var(--shadow-soft);` (lines ~800, ~807). Replace with:

```scss
  box-shadow:
    0 1px 2px var(--shadow-soft),
    0 8px 24px var(--shadow-soft);
```

(Apply the lighter `0 20px 60px` version with the same two-layer pattern, increasing the second layer to 24px instead of 60px.)

- [ ] **Step 5: Build to verify no syntax errors**

Run: `npm run build`
Expected: exit code 0.

- [ ] **Step 6: Commit**

```bash
git add src/views/AboutPage.vue src/views/ExperiencePage.vue src/views/ResumePage.vue src/components/ProjectCard.vue
git commit -m "perf(shadow): slim heavy box-shadows to 2-layer pattern"
```

---

## Task 9: Add content-visibility: auto to long sections

**Files:**
- Modify: `src/views/AboutPage.vue`
- Modify: `src/views/ResumePage.vue`
- Modify: `src/views/ExperiencePage.vue`
- Modify: `src/views/HomePage.vue`

- [ ] **Step 1: Add a shared SCSS utility in _animations.scss**

Append to `src/styles/_animations.scss` (after the existing `reduced-motion` mixin, line 69):

```scss

// Skip off-screen rendering for long sections
// contain-intrinsic-size reserves layout space to prevent scrollbar jumps
@mixin off-screen-skip($intrinsic-height: 800px) {
  content-visibility: auto;
  contain-intrinsic-size: auto $intrinsic-height;
}
```

- [ ] **Step 2: AboutPage.vue — apply to hero and content sections**

In `src/views/AboutPage.vue`, find the `.hero-section` rule (around line 670 in the styles) and the `.section` rule. Add `content-visibility: auto;` and `contain-intrinsic-size: 800px;` to each.

The simplest change: in the existing `style` block, find:

```scss
  .hero-section {
    ...
  }
```

Add these two lines at the top of the rule body (preserving existing rules below):

```scss
    content-visibility: auto;
    contain-intrinsic-size: 800px;
```

Repeat for the `.section` rule.

- [ ] **Step 3: ResumePage.vue — apply to all top-level sections**

In `src/views/ResumePage.vue`, find each top-level `<section>` and the wrapper `<div class="resume-page">` style. Apply:

```scss
  content-visibility: auto;
  contain-intrinsic-size: 800px;
```

to the wrapper. (Wrapping every section is enough — the browser skips rendering the entire subtree when the wrapper is offscreen.)

- [ ] **Step 4: ExperiencePage.vue — apply to the timeline card list**

In `src/views/ExperiencePage.vue`, find the timeline list selector. Add:

```scss
  content-visibility: auto;
  contain-intrinsic-size: 600px;
```

The intrinsic height is smaller here because timeline cards are tighter.

- [ ] **Step 5: HomePage.vue — apply to projects section**

In `src/views/HomePage.vue`, find the `class="relative z-10 pb-20"` projects `<section>` and add a CSS class. Open the styles section and add:

```scss
  .projects-section {
    content-visibility: auto;
    contain-intrinsic-size: 600px;
  }
```

Then change the `class` on the projects section to include `projects-section`.

- [ ] **Step 6: Build to verify**

Run: `npm run build`
Expected: exit code 0. No CSS errors.

- [ ] **Step 7: Visual smoke test**

Run: `npm run dev`. Scroll through `/`, `/resume`, `/experience`, `/about` and confirm no layout jumps or scrollbar flicker on first load. The page should still render correctly when scrolled into view (sections that were skipped become visible). Stop the dev server.

- [ ] **Step 8: Commit**

```bash
git add src/styles/_animations.scss src/views/AboutPage.vue src/views/ResumePage.vue src/views/ExperiencePage.vue src/views/HomePage.vue
git commit -m "perf(render): add content-visibility:auto to long sections"
```

---

## Task 10: Remove will-change from reveal mixin (defer to JS)

**Files:**
- Modify: `src/styles/_animations.scss`

- [ ] **Step 1: Drop will-change from the reveal mixin**

Open `src/styles/_animations.scss` and locate the `reveal` mixin (lines 9-25). Remove the `will-change: opacity, transform, filter;` line (line 18).

The final mixin reads:

```scss
@mixin reveal($offset: 20px, $duration: 0.7s) {
  opacity: 0;
  transform: translateY($offset);
  filter: blur(4px);
  transition:
    opacity $duration cubic-bezier(0.16, 1, 0.3, 1),
    transform $duration cubic-bezier(0.16, 1, 0.3, 1),
    filter $duration cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--reveal-delay, 0ms);

  &.revealed {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/_animations.scss
git commit -m "perf(animation): drop static will-change from reveal mixin"
```

---

## Task 11: ScrollToTop — rAF-throttle scroll handler

**Files:**
- Modify: `src/components/ScrollToTop.vue`

- [ ] **Step 1: Replace ScrollToTop.vue with rAF-throttled scroll**

Overwrite `src/components/ScrollToTop.vue` with:

```vue
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import AppIcon from '@/components/icons/AppIcon.vue'

const visible = ref(false)
let ticking = false

function update() {
  visible.value = window.scrollY > 400
  ticking = false
}

function handleScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(update)
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  update()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 translate-y-4 scale-90"
    enter-to-class="opacity-100 translate-y-0 scale-100"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0 scale-100"
    leave-to-class="opacity-0 translate-y-4 scale-90"
  >
    <button
      v-show="visible"
      aria-label="回到顶部"
      class="fixed bottom-6 right-6 z-[110] flex h-10 w-10 items-center justify-center rounded-full bg-bg-primary/80 dark:bg-bg-dark-primary/80 border border-border-default dark:border-border-dark backdrop-blur-md shadow-lg text-text-secondary dark:text-text-dark-secondary hover:text-brand-pink dark:hover:text-brand-pink-light hover:border-brand-pink/30 dark:hover:border-brand-pink-light/30 transition-colors duration-200 cursor-pointer active:scale-90"
      @click="scrollToTop"
    >
      <AppIcon name="arrow-up" class="w-4 h-4" />
    </button>
  </Transition>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ScrollToTop.vue
git commit -m "perf(scroll): rAF-throttle ScrollToTop handler"
```

---

## Task 12: SakuraCanvas — idle start + visibility pause (refactor)

**Files:**
- Modify: `src/components/SakuraCanvas.vue`

- [ ] **Step 1: Rewrite SakuraCanvas.vue with idle start**

Overwrite `src/components/SakuraCanvas.vue` with:

```vue
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationId = 0
let petals: Petal[] = []
let reducedMotion = false
let isDarkMode = false
let themeObserver: MutationObserver | null = null

interface Petal {
  x: number
  y: number
  size: number
  rotation: number
  rotationSpeed: number
  fallSpeed: number
  swayOffset: number
  swaySpeed: number
  swayAmount: number
  opacity: number
  hue: number
}

function createPetal(canvasWidth: number, canvasHeight: number): Petal {
  const sizeBase = 10 + Math.random() * 18
  return {
    x: Math.random() * canvasWidth,
    y: -20 - Math.random() * canvasHeight,
    size: sizeBase,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.015,
    fallSpeed: 0.08 + Math.random() * 0.28,
    swayOffset: Math.random() * Math.PI * 2,
    swaySpeed: 0.004 + Math.random() * 0.01,
    swayAmount: 0.4 + Math.random() * 1.4,
    opacity: isDarkMode ? 0.2 + Math.random() * 0.3 : 0.38 + Math.random() * 0.42,
    hue: Math.random() * 20 - 10,
  }
}

function drawPetal(ctx: CanvasRenderingContext2D, petal: Petal) {
  const { x, y, size, rotation, opacity, hue } = petal

  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rotation)

  const r = Math.min(255, 255)
  const g = Math.min(255, Math.max(0, 182 + hue))
  const b = Math.min(255, Math.max(0, 193 + hue * 0.5))
  ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`

  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.bezierCurveTo(size * 0.5, -size * 0.3, size * 0.8, -size * 0.1, size, size * 0.3)
  ctx.bezierCurveTo(size * 0.6, size * 0.1, size * 0.3, -size * 0.05, 0, 0)
  ctx.fill()

  ctx.restore()
}

function animate() {
  if (reducedMotion) return

  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  for (const petal of petals) {
    petal.y += petal.fallSpeed
    petal.x += Math.sin(petal.swayOffset) * petal.swayAmount
    petal.swayOffset += petal.swaySpeed
    petal.rotation += petal.rotationSpeed

    if (petal.y > canvas.height + 20) {
      const newPetal = createPetal(canvas.width, canvas.height)
      petal.x = newPetal.x
      petal.y = newPetal.y
      petal.size = newPetal.size
      petal.fallSpeed = newPetal.fallSpeed
      petal.opacity = newPetal.opacity
      petal.hue = newPetal.hue
    }

    drawPetal(ctx, petal)
  }

  animationId = requestAnimationFrame(animate)
}

function resize() {
  const canvas = canvasRef.value
  if (!canvas) return
  const dpr = window.devicePixelRatio || 1
  const w = window.innerWidth
  const h = window.innerHeight
  canvas.width = w * dpr
  canvas.height = h * dpr
  canvas.style.width = w + 'px'
  canvas.style.height = h + 'px'
  const ctx = canvas.getContext('2d')
  if (ctx) ctx.scale(dpr, dpr)
}

function checkDarkMode() {
  isDarkMode = document.documentElement.classList.contains('dark')
}

function handleVisibilityChange() {
  if (document.hidden) {
    cancelAnimationFrame(animationId)
  } else if (!reducedMotion) {
    animate()
  }
}

function handleThemeChange() {
  checkDarkMode()
  petals.forEach((p) => {
    p.opacity = isDarkMode ? 0.15 + Math.random() * 0.25 : 0.3 + Math.random() * 0.4
  })
}

function startAnimation() {
  if (reducedMotion) return
  const canvas = canvasRef.value
  if (!canvas) return

  checkDarkMode()
  resize()

  const count = window.innerWidth < 768 ? 18 : window.innerWidth < 1200 ? 24 : 32
  petals = Array.from({ length: count }, () =>
    createPetal(window.innerWidth, window.innerHeight),
  )

  animate()

  window.addEventListener('resize', resize)
  document.addEventListener('visibilitychange', handleVisibilityChange)

  themeObserver = new MutationObserver(() => {
    handleThemeChange()
  })
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })
}

onMounted(() => {
  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Defer canvas init to browser idle time so it never competes with the
  // first paint of <RouterView> and the appear animation.
  const start = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        startAnimation()
      })
    })
  }
  if ('requestIdleCallback' in window) {
    requestIdleCallback(start, { timeout: 1500 })
  } else {
    setTimeout(start, 400)
  }
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  themeObserver?.disconnect()
  window.removeEventListener('resize', resize)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<template>
  <canvas
    ref="canvasRef"
    aria-hidden="true"
    class="fixed left-0 top-0 pointer-events-none z-[100]"
  />
</template>
```

- [ ] **Step 2: Visual smoke test**

Run: `npm run dev`. Verify Sakura petals still appear (a brief ~500ms delay on first load is expected and acceptable). Switch tabs and return — petals should pause and resume. Toggle theme — opacity adjusts. Stop the dev server.

- [ ] **Step 3: Commit**

```bash
git add src/components/SakuraCanvas.vue
git commit -m "perf(sakura): defer canvas init to idle, pause on tab hidden"
```

---

## Task 13: Route idle prefetch in App.vue

**Files:**
- Modify: `src/App.vue`

- [ ] **Step 1: Add prefetchRoutes() to App.vue**

Open `src/App.vue`. The existing `<script setup>` block (lines 1-42) has a `watch` for `route.path` and an `onMounted` that initializes the theme. Add the prefetch function and call it inside the existing `onMounted`.

Replace the entire `<script setup lang="ts">` block with:

```vue
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import TopNavBar from '@/components/TopNavBar.vue'
import AppFooter from '@/components/Footer.vue'
import SakuraCanvas from '@/components/SakuraCanvas.vue'
import ScrollToTop from '@/components/ScrollToTop.vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const route = useRoute()

// Route order for direction-aware transitions
// - Initial mount: stay on 'page-fade' so the appear animation runs
// - Subsequent navigations: slide left/right based on previous order
const routeOrder: Record<string, number> = {
  '/': 0,
  '/resume': 1,
  '/experience': 2,
  '/about': 3,
}

const initialOrder = routeOrder[route.path] ?? 0
const transitionName = ref('page-fade')
const prevOrder = ref(initialOrder)

watch(
  () => route.path,
  (to) => {
    const toOrder = routeOrder[to] ?? 0
    // Skip the first trigger that fires right after mount with the same path
    if (toOrder === prevOrder.value) return
    transitionName.value =
      toOrder >= prevOrder.value ? 'page-slide-left' : 'page-slide-right'
    prevOrder.value = toOrder
  },
)

// Prefetch all view chunks during browser idle so navigation has 0 wait.
// We trigger dynamic imports explicitly; Vite emits these as separate chunks
// that the browser caches, and the request fires only when idle.
function prefetchRoutes() {
  // Add 5 view chunks to the cache. import() returns a Promise we don't await.
  import('@/views/HomePage.vue')
  import('@/views/ResumePage.vue')
  import('@/views/ExperiencePage.vue')
  import('@/views/AboutPage.vue')
  import('@/views/NotFound.vue')
}

onMounted(() => {
  themeStore.init()

  if ('requestIdleCallback' in window) {
    requestIdleCallback(prefetchRoutes, { timeout: 2000 })
  } else {
    setTimeout(prefetchRoutes, 200)
  }
})
</script>
```

The rest of the file (template + style) is unchanged.

- [ ] **Step 2: Build to verify the prefetch imports resolve**

Run: `npm run build`
Expected: exit code 0. The `dist/assets/` directory now contains 5 view chunks in addition to vendor/icons/app.

- [ ] **Step 3: Dev-server smoke test**

Run: `npm run dev`. Open `http://localhost:5173/`. Watch DevTools → Network → JS. After the page is idle (~500ms), 5 additional chunk requests should fire. Click any nav link and observe the navigation is instant (no waiting). Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add src/App.vue
git commit -m "perf(router): prefetch view chunks on idle, zero-wait navigation"
```

---

## Task 14: Replace @iconify/vue Icon with AppIcon in TopNavBar

**Files:**
- Modify: `src/components/TopNavBar.vue`

- [ ] **Step 1: Update TopNavBar.vue imports and usages**

In `src/components/TopNavBar.vue`:

1. Change line 5 from `import { Icon } from '@iconify/vue'` to `import AppIcon from '@/components/icons/AppIcon.vue'`.
2. Change line 92 from `<Icon icon="lucide:sun" ... />` to `<AppIcon name="sun" ... />` (keep the `class` attribute intact).
3. Change line 93 from `<Icon icon="lucide:moon" ... />` to `<AppIcon name="moon" ... />`.

- [ ] **Step 2: Build to verify**

Run: `npm run build`
Expected: exit code 0.

- [ ] **Step 3: Visual check**

Run: `npm run dev`. Open `http://localhost:5173/`. The sun/moon toggle in the top-right should still switch theme and the icons should still cross-fade. Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add src/components/TopNavBar.vue
git commit -m "refactor(icons): switch TopNavBar to AppIcon"
```

---

## Task 15: Replace @iconify/vue Icon with AppIcon in Footer, ProjectCard, HeroSection, GitHubContributions, NotFound

**Files:**
- Modify: `src/components/Footer.vue`
- Modify: `src/components/ProjectCard.vue`
- Modify: `src/components/HeroSection.vue`
- Modify: `src/components/GitHubContributions.vue`
- Modify: `src/views/NotFound.vue`

- [ ] **Step 1: Footer.vue — switch to AppIcon**

In `src/components/Footer.vue`:

1. Change line 4 from `import { Icon } from '@iconify/vue'` to `import AppIcon from '@/components/icons/AppIcon.vue'`.
2. Change line 69 from `<Icon :icon="link.icon" class="h-5 w-5" />` to `<AppIcon :name="link.icon" class="h-5 w-5" />`.
3. Change line 80 from `<Icon icon="lucide:arrow-up-right" ... />` to `<AppIcon name="arrow-up-right" ... />`.

- [ ] **Step 2: ProjectCard.vue — switch to AppIcon**

In `src/components/ProjectCard.vue`:

1. Change line 3 from `import { Icon } from '@iconify/vue'` to `import AppIcon from '@/components/icons/AppIcon.vue'`.
2. Change line 111 from `<Icon icon="lucide:star" width="12" height="12" />` to `<AppIcon name="lucide:star" :width="12" :height="12" />`.
3. Change line 158 from `<Icon icon="simple-icons:github" class="w-4 h-4" />` to `<AppIcon name="github" class="w-4 h-4" />` (Top 5 inline).

- [ ] **Step 3: HeroSection.vue — switch to AppIcon**

In `src/components/HeroSection.vue`:

1. Change line 3 from `import { Icon } from '@iconify/vue'` to `import AppIcon from '@/components/icons/AppIcon.vue'`.
2. Change line 173 from `<Icon icon="lucide:chevrons-down" ... />` to `<AppIcon name="lucide:chevrons-down" ... />`.

- [ ] **Step 4: GitHubContributions.vue — switch to AppIcon (header github link only)**

In `src/components/GitHubContributions.vue`:

1. Add the import (line 3): `import AppIcon from '@/components/icons/AppIcon.vue'` — keep the existing `import { Icon } from '@iconify/vue'` if other `<Icon>` usages remain in the file.
2. Locate the header GitHub anchor (search for `simple-icons:github` inside this file) and change it to `<AppIcon name="github" ... />`.
3. If the file has no other `<Icon>` usages after this change, also remove the `import { Icon } from '@iconify/vue'` line.

- [ ] **Step 5: NotFound.vue — switch to AppIcon**

In `src/views/NotFound.vue`:

1. Replace `import { Icon } from '@iconify/vue'` with `import AppIcon from '@/components/icons/AppIcon.vue'`.
2. Change `<Icon icon="lucide:compass" ... />` to `<AppIcon name="lucide:compass" ... />`.
3. Change `<Icon icon="lucide:home" ... />` to `<AppIcon name="lucide:home" ... />`.

- [ ] **Step 6: Build**

Run: `npm run build`
Expected: exit code 0. If a Vue compile error mentions a missing import, you missed an Icon usage — search `grep -n "<Icon" src/components src/views` and fix.

- [ ] **Step 7: Visual check**

Run: `npm run dev`. Open `/`, `/about`, scroll to footer. Verify github / juejin / arrow-up-right / chevrons-down / compass / home icons all render. Stop the dev server.

- [ ] **Step 8: Commit**

```bash
git add src/components/Footer.vue src/components/ProjectCard.vue src/components/HeroSection.vue src/components/GitHubContributions.vue src/views/NotFound.vue
git commit -m "refactor(icons): switch remaining components to AppIcon"
```

---

## Task 16: Final build + lint + preview verification

**Files:** (no file changes)

- [ ] **Step 1: Run type-check**

Run: `npm run type-check`
Expected: exit code 0.

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: exit code 0. (Some Prettier formatting warnings about indentation may appear; the project uses Prettier on `src/`, so they should be auto-fixed. If any error remains, fix it.)

- [ ] **Step 3: Run production build**

Run: `npm run build`
Expected: exit code 0. Inspect `dist/assets/*.js` — confirm `vendor-*.js` and `icons-*.js` exist as separate chunks.

- [ ] **Step 4: Preview the built bundle**

Run: `npm run preview` (in a separate terminal or async).

Open the preview URL printed by Vite (typically `http://localhost:4173`). Verify:
- First paint of `/` shows the hero + GitHub contributions without icons being empty/missing
- DevTools → Network → filter `api.iconify.design` returns 0 requests across all 4 routes
- DevTools → Network → filter `fonts.googleapis` returns 0 requests
- Toggle theme — dark mode applies without flash
- Navigate `/` → `/resume` → `/experience` → `/about` — each switch should feel instant (< 100ms perceived)
- Open DevTools → Performance → record a page load, then a navigation. Verify the navigation's "Scripting" time is near zero (chunks already cached).

Stop the preview server.

- [ ] **Step 5: Commit (if any fixes were made)**

If step 2 or 3 surfaced issues and you fixed them:

```bash
git add -A
git commit -m "chore: fix lint/build issues from optimization pass"
```

If no changes were made, skip this commit.

---

## Self-Review

**Spec coverage:**

- §1.1 Icons local-packed → Task 1, Task 3 ✓
- §1.1 Top 5 inline SVG → Task 2 (AppIcon), Task 14–15 (consumers) ✓
- §1.2 Vite build config → Task 4 ✓
- §1.3 Font self-host → Task 5 ✓
- §2.1 Route idle prefetch → Task 13 ✓
- §2.2 SakuraCanvas idle start → Task 12 ✓
- §2.3 Shadow thinning → Task 8 ✓
- §2.4 content-visibility → Task 9 ✓
- §2.5 will-change + scroll throttle → Task 10, Task 11 ✓
- §3.1 CSS variable hoisting → Task 6, Task 7 ✓
- §3.2 SCSS volume (no unused vars) → Side effect of Task 6 (variables.scss now only contains what's used) ✓

**Placeholder scan:** No TBD/TODO/placeholder phrases. Every step has actual code or commands.

**Type consistency:** `AppIcon` props are `name, width, height, class` (matching consumer usage in Tasks 11, 14, 15). Route prefetch view list matches router/index.ts exactly. `reveal` mixin is consumed by 3 views; the `will-change` removal in Task 10 doesn't change the public API of the mixin.

**One omission caught during review:** Task 8 Step 2 originally said to "find and edit ProjectCard.vue shadow" but the only shadow in ProjectCard is the Tailwind `shadow-lg` utility class, not a literal `box-shadow`. Step 2 correctly handles this by changing the class name to `shadow-md` and verifying with grep.

---

**Plan complete and saved to `docs/superpowers/plans/2026-06-21-performance-optimization.md`.**

**Two execution options:**

1. **Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.
2. **Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?
