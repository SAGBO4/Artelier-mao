import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

export const useShowreelStore = defineStore('showreel', () => {
  const items = ref([])
  const loading = ref(false)
  const error = ref('')

  async function fetchShowreel() {
    if (!supabase) return
    
    loading.value = true
    error.value = ''
    
    try {
      const { data, error: err } = await supabase
        .from('showreel_items')
        .select('*')
        .order('sort_order', { ascending: true })
      
      if (err) throw err
      items.value = data || []
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  return {
    items,
    loading,
    error,
    fetchShowreel
  }
})
