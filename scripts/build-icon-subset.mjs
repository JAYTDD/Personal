// scripts/build-icon-subset.mjs
// Build a custom icon collection JSON containing only the icons we actually use,
// to avoid bundling the full ~5MB lucide + simple-icons data.

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

// 1. Collect every icon name referenced anywhere under src/ (vue templates,
//    data modules, composables) so new files can never be missed.
function walk(dir) {
  const out = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = resolve(dir, entry.name)
    if (entry.isDirectory()) out.push(...walk(path))
    else out.push(path)
  }
  return out
}

const sources = walk(resolve(root, 'src')).filter((path) => /\.(vue|ts)$/.test(path))

// Inline names in AppIcon.vue are excluded — they are rendered as inline SVG and
// never reach @iconify/vue's Icon component. We also exclude 'devicon-plain:java'
// because we have no @iconify-json/devicon-plain package installed; the browser
// will fetch from iconify API as a one-off (acceptable for a rarely-used icon).
const inlineNames = new Set(['sun', 'moon', 'arrow-up', 'arrow-up-right', 'github'])
const skipPrefixes = ['devicon-plain:']

const referenced = new Set()
for (const path of sources) {
  const content = readFileSync(path, 'utf8')
  // Match lucide:xxx and simple-icons:xxx
  const matches = content.matchAll(/['"`](lucide|simple-icons):[a-z0-9-]+['"`]/g)
  for (const m of matches) {
    const full = m[0].replace(/['"`]/g, '')
    if (skipPrefixes.some((p) => full.startsWith(p))) continue
    const localName = full.split(':')[1]
    if (inlineNames.has(localName) && path.endsWith('AppIcon.vue')) continue
    referenced.add(full)
  }
}

console.log(`[icons] Referenced ${referenced.size} unique icons`)

// 2. Load full collections and pick only referenced icons
const lucideFull = JSON.parse(
  readFileSync(resolve(root, 'node_modules/@iconify-json/lucide/icons.json'), 'utf8'),
)
const simpleFull = JSON.parse(
  readFileSync(resolve(root, 'node_modules/@iconify-json/simple-icons/icons.json'), 'utf8'),
)

function pickCollection(full, prefix) {
  // Preserve root-level viewBox dimensions (e.g. 24x24 for lucide/simple-icons).
  // Without this, @iconify/vue's getIcon() falls back to its 16x16 default,
  // and AppIcon.vue's viewBox ends up "0 0 16 16" — clipping the 24x24 icon
  // body to its top-left quadrant inside any sized container.
  const out = { prefix, icons: {} }
  if (typeof full.width === 'number') out.width = full.width
  if (typeof full.height === 'number') out.height = full.height
  for (const fullName of referenced) {
    if (!fullName.startsWith(prefix + ':')) continue
    const name = fullName.slice(prefix.length + 1)
    if (full.icons[name]) {
      out.icons[name] = full.icons[name]
    } else {
      console.warn(`[icons] ${fullName} not found in ${prefix}`)
    }
  }
  return out
}

const lucide = pickCollection(lucideFull, 'lucide')
const simple = pickCollection(simpleFull, 'simple-icons')

// 3. Write subsets
const outDir = resolve(root, 'src/assets/icons')
mkdirSync(outDir, { recursive: true })
writeFileSync(resolve(outDir, 'lucide-subset.json'), JSON.stringify(lucide))
writeFileSync(resolve(outDir, 'simple-icons-subset.json'), JSON.stringify(simple))
console.log(`[icons] lucide subset: ${Object.keys(lucide.icons).length} icons`)
console.log(`[icons] simple-icons subset: ${Object.keys(simple.icons).length} icons`)
