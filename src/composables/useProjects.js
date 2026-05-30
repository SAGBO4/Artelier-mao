import { onMounted, ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { PROJECTS as FALLBACK_PROJECTS } from '@/data/studio'

export function useProjects() {
  const projects = ref([...FALLBACK_PROJECTS])
  const loading = ref(false)
  const error = ref('')

  async function refresh() {
    if (!supabase) {
      // Supabase not configured, sticking with fallback data.
      return
    }
    error.value = ''
    loading.value = true
    try {
      const { data, error: err } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })
      if (err) throw err
      if (data && data.length) projects.value = data
    } catch (e) {
      // fallback stays in place
      error.value = e?.message || 'Projects load failed'
    } finally {
      loading.value = false
    }
  }

  onMounted(refresh)

  return { projects, loading, error, refresh }
}

