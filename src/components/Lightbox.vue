<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import Placeholder from './Placeholder.vue'

const props = defineProps({
  project: { type: Object, required: true },
  projects: { type: Array, required: true }
})

const emit = defineEmits(['close', 'nav'])

const idx = computed(() => props.projects.findIndex((p) => p.id === props.project.id))

function onKey(e) {
  if (e.key === 'Escape') emit('close')
  else if (e.key === 'ArrowRight') emit('nav', 1)
  else if (e.key === 'ArrowLeft') emit('nav', -1)
}

onMounted(() => {
  window.addEventListener('keydown', onKey)
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="lightbox" @click="emit('close')">
    <div class="lb-inner" @click.stop>
      <div class="lb-top">
        <span class="lb-counter">
          {{ String(idx + 1).padStart(2, '0') }}
          <span class="footer-mute">/ {{ String(projects.length).padStart(2, '0') }}</span>
        </span>
        <button class="lb-close" aria-label="Fermer" data-hover @click="emit('close')">Fermer ✕</button>
      </div>
      <div class="lb-stage">
        <button class="lb-arrow lb-prev" aria-label="Précédent" data-hover @click="emit('nav', -1)">←</button>
        <div class="lb-img">
          <img
            v-if="project.image_url"
            :src="project.image_url"
            :alt="project.title"
            style="width: 100%; max-height: 70vh; object-fit: contain; display: block; margin: 0 auto"
          />
          <Placeholder
            v-else
            :label="project.title.toLowerCase()"
            :ratio="project.ratio"
            :tone="project.tone"
            kind="stripe"
          />
        </div>
        <button class="lb-arrow lb-next" aria-label="Suivant" data-hover @click="emit('nav', 1)">→</button>
      </div>
      <div class="lb-meta">
        <div>
          <p class="footer-label">{{ project.year }} · {{ project.type }}</p>
          <h3 class="lb-title">{{ project.title }}</h3>
        </div>
        <p class="lb-tag">{{ project.chapter }}</p>
      </div>
    </div>
  </div>
</template>
