import { watch } from 'vue'

export function useTheme(t) {
  function applyThemeVars() {
    const r = document.documentElement
    const v = t.value
    r.style.setProperty('--accent', v.accent)
    r.style.setProperty('--paper', v.paper)
    r.style.setProperty('--ink', v.ink)

    const hexToRgb = (h) => {
      const m = h.replace('#', '')
      const x = m.length === 3 ? m.split('').map((c) => c + c).join('') : m
      return [parseInt(x.slice(0, 2), 16), parseInt(x.slice(2, 4), 16), parseInt(x.slice(4, 6), 16)]
    }

    try {
      const [ir, ig, ib] = hexToRgb(v.ink)
      ;[3, 4, 5, 6, 8, 10, 12, 18, 25, 30, 40, 45, 50, 55, 60, 70, 80].forEach((a) => {
        const key = a < 10 ? '0' + a : '' + a
        r.style.setProperty(`--ink-${key}`, `rgba(${ir},${ig},${ib},${a / 100})`)
      })
      const [pr, pg, pb] = hexToRgb(v.paper)
      r.style.setProperty('--paper-warm', `rgb(${Math.max(0, pr - 8)},${Math.max(0, pg - 10)},${Math.max(0, pb - 14)})`)
      r.style.setProperty('--paper-deep', `rgb(${Math.max(0, pr - 22)},${Math.max(0, pg - 26)},${Math.max(0, pb - 32)})`)
    } catch {
      /* ignore invalid hex */
    }
  }

  watch(
    () => [t.value.accent, t.value.paper, t.value.ink, t.value.serif, t.value.density],
    () => {
      const stacks = {
        fraunces: "'Fraunces', 'Cormorant Garamond', Georgia, serif",
        italiana: "'Italiana', 'Cormorant Garamond', Georgia, serif",
        bodoni: "'Bodoni Moda', 'Cormorant Garamond', Georgia, serif",
        cormorant: "'Cormorant Garamond', Georgia, serif",
        instrument: "'Instrument Serif', 'Cormorant Garamond', Georgia, serif"
      }
      document.documentElement.style.setProperty(
        '--font-serif',
        stacks[t.value.serif] || stacks.fraunces
      )
      document.documentElement.dataset.density = t.value.density
      applyThemeVars()
    },
    { immediate: true }
  )
}
