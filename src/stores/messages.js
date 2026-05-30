import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

export const useMessagesStore = defineStore('messages', () => {
  const messages = ref([])
  const loading = ref(false)

  async function fetchMessages() {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      messages.value = data
    } catch (e) {
      console.error('Error fetching messages:', e)
    } finally {
      loading.value = false
    }
  }

  async function sendMessage(payload) {
    try {
      const { error } = await supabase.from('contacts').insert([payload])
      if (error) throw error
      return { success: true }
    } catch (e) {
      console.error('Error sending message:', e)
      return { success: false, error: e.message }
    }
  }

  async function deleteMessage(id) {
    try {
      const { error } = await supabase.from('contacts').delete().eq('id', id)
      if (error) throw error
      await fetchMessages()
      return { success: true }
    } catch (e) {
      console.error('Error deleting message:', e)
      return { success: false, error: e.message }
    }
  }

  async function markAsRead(id) {
    try {
      const { error } = await supabase.from('contacts').update({ is_read: true }).eq('id', id)
      if (error) throw error
      await fetchMessages()
      return { success: true }
    } catch (e) {
      console.error('Error marking message as read:', e)
      return { success: false, error: e.message }
    }
  }

  return { 
    messages, 
    loading, 
    fetchMessages, 
    sendMessage, 
    deleteMessage, 
    markAsRead 
  }
})
