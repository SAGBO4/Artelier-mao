import { onMounted, ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { STUDIO as FALLBACK_STUDIO } from '@/data/studio'

export function useSettings() {
  const settings = ref({ ...FALLBACK_STUDIO })
  const loading = ref(false)
  const error = ref('')

  async function refresh() {
    if (!supabase) return
    error.value = ''
    loading.value = true
    try {
      const { data, error: err } = await supabase
        .from('site_settings')
        .select('*')
      if (err) throw err
      
      if (data && data.length) {
        const mapped = { ...settings.value }
        data.forEach(s => {
          mapped[s.id] = s.value
        })
        settings.value = mapped
      }
    } catch (e) {
      error.value = e?.message || 'Settings load failed'
    } finally {
      loading.value = false
    }
  }

  onMounted(refresh)

  return { settings, loading, error, refresh }
}
