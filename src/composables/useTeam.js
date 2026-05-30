import { onMounted, ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { TEAM as FALLBACK_TEAM } from '@/data/studio'

export function useTeam() {
  const members = ref([...FALLBACK_TEAM])
  const loading = ref(false)
  const error = ref('')

  async function refresh() {
    if (!supabase) return
    error.value = ''
    loading.value = true
    try {
      const { data, error: err } = await supabase
        .from('team_members')
        .select('*')
        .order('sort_order', { ascending: true })
      if (err) throw err
      if (data && data.length) members.value = data
    } catch (e) {
      error.value = e?.message || 'Team load failed'
    } finally {
      loading.value = false
    }
  }

  onMounted(refresh)

  return { members, loading, error, refresh }
}
