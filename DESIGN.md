# Design System: Resin Blog

## 1. Visual Theme & Atmosphere

A clean, minimal personal blog with a touch of playful warmth. The interface balances professional developer aesthetics with personal touches — falling cherry blossom petals on the homepage, hand-drawn notebook paper for the contact section, and a typewriter hero effect. Density is moderate (5/10), variance is low-medium (3/10) favoring centered single-column layouts, motion is fluid and purposeful (6/10).

## 2. Color Palette & Roles

- **Canvas White** (#FFFFFF) — Primary page background
- **Surface Gray** (#F9FAFB) — Card backgrounds, subtle contrast sections
- **Charcoal Ink** (#1A1A1A) — Primary text, borders, active nav states
- **Muted Steel** (#666666) — Secondary text, descriptions
- **Placeholder Gray** (#9CA3AF) — Placeholder text, disabled states
- **Border Light** (#E5E7EB) — Card borders, dividers
- **Accent Blue** (#2563EB) — Links, active states, React-related tags
- **Accent Green** (#16A34A) — Vue-related tags, success states
- **Tag Blue BG** (#F0F7FF) — Blue tag pill backgrounds
- **Tag Blue Text** (#2563EB) — Blue tag pill text
- **Petal Pink** (rgba(255, 182, 193, 0.6)) — Falling petal animation particles
- **Notebook Line** (#A7F3D0) — Horizontal rules on contact notebook paper
- **Notebook BG** (#F0FDF4) — Contact section notebook background
- **Teal Tooltip** (#2DD4BF) — Contact hover tooltip background
- **GitHub Green Scale** — #EBEDF0 → #9BE9A8 → #40C463 → #30A14E → #216E39

## 3. Typography Rules

- **Display/Headlines:** System UI sans-serif, track-tight, weight-driven hierarchy
- **Hero Title:** 48px/56px, bold, #1A1A1A
- **Hero Subtitle:** 16px/24px, #666666
- **Section Title:** 20px/28px, bold, #1A1A1A
- **Body:** 16px/24px, relaxed leading, #666666
- **Card Title:** 18px/26px, semibold, #1A1A1A
- **Tag/Pill:** 14px, medium weight
- **Small/Caption:** 13px/20px, #666666
- **Mono (dates, code):** ui-monospace, monospace

## 4. Component Stylings

### Buttons
- Primary: bg #1A1A1A, text white, radius 4px, padding 8px 16px
- Ghost: bg white, border 1px #E5E7EB, text #1A1A1A
- Active: dark bg, white text

### Tags/Pills
- Padding: 6px 16px
- Border-radius: 9999px (full pill)
- Blue variant: bg #F0F7FF, text #2563EB
- Yellow variant: bg #FEF3C7, text #92400E
- Outlined variant: bg transparent, border 1px #1A1A1A

### Cards
- Background: white
- Border-radius: 12px (large), 8px (medium), 4px (small)
- Shadow: 0 1px 2px rgba(0,0,0,0.05) default, 0 4px 6px -1px rgba(0,0,0,0.1) hover
- Hover: translateY(-2px), enhanced shadow
- Border: 1px solid #E5E7EB (optional)

### Timeline Dots
- Default: 12px circle, border 2px white, box-shadow 0 0 0 2px currentColor
- Active: 16px circle, brighter color

### Contact Icons
- Size: 48px circle
- Background: #DCFCE7 (light green)
- Border: 3px solid #1A1A1A
- Hover: scale(1.1) translateY(-4px)

## 5. Layout Principles

- Max-width: 1200px centered
- Single-column centered for most content
- Two-column for resume (sidebar + content) and plan (filters + cards)
- Generous vertical spacing between sections
- Content padding: 24px horizontal
- Section gap: 48px-64px

## 6. Motion & Interaction

- **Typewriter:** steps(n) animation, ~3s per line, blinking cursor
- **Petal Fall:** 8-15s linear infinite, translateY + rotate
- **Card Hover:** 200ms ease-out, translateY(-2px) + shadow
- **Tab Switch:** 150ms ease, content fade/slide
- **Tooltip:** 200ms ease, opacity + translateY
- **Scroll-to-Top:** smooth scroll behavior
- **Scroll Reveal:** IntersectionObserver triggered fade-in

## 7. Anti-Patterns (Banned)

- No emojis as UI icons (use SVG or icon components)
- No pure black (#000000)
- No neon/outer glow shadows
- No 3-column equal grids for features
- No generic placeholder names
- No filler UI text
