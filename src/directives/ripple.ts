import type { Directive } from 'vue'

export const vRipple: Directive = {
  mounted(el: HTMLElement) {
    el.style.position = el.style.position || 'relative'
    el.style.overflow = 'hidden'

    el.addEventListener('click', (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const ripple = document.createElement('span')
      const size = Math.max(rect.width, rect.height) * 2

      ripple.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        margin-left: ${-size / 2}px;
        margin-top: ${-size / 2}px;
        border-radius: 50%;
        background: currentColor;
        opacity: 0.12;
        transform: scale(0);
        animation: ripple-expand 0.5s ease-out forwards;
        pointer-events: none;
      `

      el.appendChild(ripple)
      setTimeout(() => ripple.remove(), 600)
    })
  },
}

// Add the keyframes globally once
if (typeof document !== 'undefined' && !document.getElementById('ripple-keyframes')) {
  const style = document.createElement('style')
  style.id = 'ripple-keyframes'
  style.textContent = `
    @keyframes ripple-expand {
      to { transform: scale(1); opacity: 0; }
    }
    @media (prefers-reduced-motion: reduce) {
      @keyframes ripple-expand {
        to { transform: scale(1); opacity: 0; animation-duration: 0.01ms; }
      }
    }
  `
  document.head.appendChild(style)
}
