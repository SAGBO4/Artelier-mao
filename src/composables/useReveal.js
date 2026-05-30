import { onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'

export function useReveal(extraDeps = []) {
  const route = useRoute()
  let io

  function observe() {
    io?.disconnect()
    io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-revealed')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' }
    )
    document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el))
  }

  onMounted(() => {
    requestAnimationFrame(observe)
  })

  onUnmounted(() => io?.disconnect())

  watch(
    () => [
      route.fullPath,
      ...extraDeps.map((d) => {
        if (typeof d === 'function') return d()
        if (d && typeof d === 'object' && 'value' in d) return d.value
        return d
      })
    ],
    () => requestAnimationFrame(observe)
  )
}
