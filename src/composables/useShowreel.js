import { onMounted, ref } from 'vue'
import { supabase } from '@/lib/supabase'

export function useShowreel() {
  const items = ref([])
  const loading = ref(false)
  const error = ref('')

  async function refresh() {
    if (!supabase) return
    error.value = ''
    loading.value = true
    try {
      const { data, error: err } = await supabase
        .from('showreel_items')
        .select('*')
        .order('sort_order', { ascending: true })
      if (err) throw err
      items.value = data || []
    } catch (e) {
      error.value = e?.message || 'Showreel load failed'
    } finally {
      loading.value = false
    }
  }

  onMounted(refresh)

  return { items, loading, error, refresh }
}
