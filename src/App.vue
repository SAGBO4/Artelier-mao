<script setup>
import { provide, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Nav from '@/components/Nav.vue'
import Footer from '@/components/Footer.vue'
import { useClock } from '@/composables/useClock'
import { useTweaks } from '@/composables/useTweaks'
import { useTheme } from '@/composables/useTheme'
import { TWEAK_DEFAULTS } from '@/config/tweaks'

// Pinia Stores
import { useProjectsStore } from '@/stores/projects'
import { useTeamStore } from '@/stores/team'
import { useShowreelStore } from '@/stores/showreel'
import { useSettingsStore } from '@/stores/settings'

const route = useRoute()
const tweaks = useTweaks(TWEAK_DEFAULTS)

const projectsStore = useProjectsStore()
const teamStore = useTeamStore()
const showreelStore = useShowreelStore()
const settingsStore = useSettingsStore()

provide('tweaks', tweaks)
useClock()
useTheme(tweaks.t)

onMounted(() => {
  projectsStore.fetchProjects()
  teamStore.fetchTeam()
  showreelStore.fetchShowreel()
  settingsStore.fetchSettings()
})
</script>

<template>
  <div class="app">
    <Nav />
    <div class="page-shell" :key="route.fullPath">
      <RouterView />
    </div>
    <Footer />
  </div>
</template>
