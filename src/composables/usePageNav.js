import { useRouter } from 'vue-router'

export function usePageNav() {
  const router = useRouter()

  function setPage(name, state = {}) {
    const query = {}
    if (state.chapter) query.chapter = state.chapter
    if (state.focus) query.focus = state.focus
    router.push({ name, query })
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'auto' }))
  }

  return { setPage }
}
