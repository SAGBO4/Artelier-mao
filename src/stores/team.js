import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { TEAM as FALLBACK_TEAM } from '@/data/studio'

export const useTeamStore = defineStore('team', () => {
  const members = ref([...FALLBACK_TEAM])
  const loading = ref(false)
  const error = ref('')

  async function fetchTeam() {
    if (!supabase) return
    
    loading.value = true
    error.value = ''
    
    try {
      const { data, error: err } = await supabase
        .from('team_members')
        .select('*')
        .order('sort_order', { ascending: true })
      
      if (err) throw err
      if (data && data.length) members.value = data
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  return {
    members,
    loading,
    error,
    fetchTeam
  }
})
