<script setup>
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { useSettingsStore } from '@/stores/settings'

const router = useRouter()
const settingsStore = useSettingsStore()
const studio = computed(() => settingsStore.settings)
const year = new Date().getFullYear()

const links = [
  ['home', 'Accueil'],
  ['prestations', 'Prestations'],
  ['portfolio', 'Portfolio'],
  ['equipe', 'Équipe'],
  ['contact', 'Contact']
]

function go(id) {
  router.push({ name: id })
  requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'auto' }))
}
</script>

<template>
  <footer class="footer">
    <div class="footer-top">
      <div class="footer-col footer-big">
        <p class="footer-eyebrow">— L'atelier, {{ studio.city }}</p>
        <h3 class="footer-h">
          Un projet,<br />
          une matière.<br />
          <em>Parlons-en.</em>
        </h3>
        <button class="btn-link" data-hover @click="go('contact')">
          Nous écrire
          <span class="btn-arrow" aria-hidden="true">↗</span>
        </button>
      </div>
      <div class="footer-col">
        <p class="footer-label">Studio</p>
        <p class="footer-line">{{ studio.email }}</p>
        <p class="footer-line">{{ studio.phone }}</p>
        <p class="footer-line footer-mute">
          Fidjrossè,<br />
          Cotonou — Bénin
        </p>
      </div>
      <div class="footer-col">
        <p class="footer-label">Liens</p>
        <p v-if="studio.instagram" class="footer-line"><span class="footer-mute">Instagram</span> {{ studio.instagram }}</p>
        <p v-if="studio.facebook" class="footer-line"><span class="footer-mute">Facebook</span> {{ studio.facebook }}</p>
        <p v-if="studio.linkedin" class="footer-line"><span class="footer-mute">LinkedIn</span> {{ studio.linkedin }}</p>
      </div>
      <div class="footer-col">
        <p class="footer-label">Navigation</p>
        <p v-for="[id, lbl] in links" :key="id" class="footer-line">
          <button class="footer-link" data-hover @click="go(id)">{{ lbl }}</button>
        </p>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© {{ year }} L'atelier — Studio Créatif</span>
      <span class="footer-mute">{{ studio.founded }}</span>
      <span class="footer-mute">Fait à Cotonou, avec les mains.</span>
    </div>
  </footer>
</template>
