import { onMounted, onUnmounted } from 'vue'

export function useClock() {
  let id
  onMounted(() => {
    const tick = () => {
      const el = document.getElementById('nav-time')
      if (!el) return
      const t = new Date().toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Africa/Porto-Novo'
      })
      el.textContent = 'Cotonou · ' + t
    }
    tick()
    id = setInterval(tick, 30000)
  })
  onUnmounted(() => clearInterval(id))
}
