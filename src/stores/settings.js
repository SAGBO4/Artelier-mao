import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { STUDIO as FALLBACK_STUDIO } from '@/data/studio'

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref({ ...FALLBACK_STUDIO })
  const loading = ref(false)
  const error = ref('')

  async function fetchSettings() {
    if (!supabase) return
    
    loading.value = true
    error.value = ''
    
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
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  return {
    settings,
    loading,
    error,
    fetchSettings
  }
})
