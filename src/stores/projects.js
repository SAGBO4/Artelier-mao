import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { PROJECTS as FALLBACK_PROJECTS } from '@/data/studio'

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref([...FALLBACK_PROJECTS])
  const loading = ref(false)
  const error = ref('')

  async function fetchProjects() {
    if (!supabase) return
    
    loading.value = true
    error.value = ''
    
    try {
      const { data, error: err } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (err) throw err
      if (data && data.length) projects.value = data
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  return { 
    projects, 
    loading, 
    error, 
    fetchProjects 
  }
})
