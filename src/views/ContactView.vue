<script setup>
import { ref, computed } from 'vue'
import { useReveal } from '@/composables/useReveal'
import { useSettingsStore } from '@/stores/settings'
import { useMessagesStore } from '@/stores/messages'

const form = ref({ name: '', email: '', subject: '', message: '' })
const sent = ref(false)
const submitting = ref(false)
const settingsStore = useSettingsStore()
const messagesStore = useMessagesStore()
const settings = computed(() => settingsStore.settings)

const canSend = computed(() => form.value.name && form.value.email && form.value.message)

useReveal([sent])

async function onSubmit(e) {
  e.preventDefault()
  if (!canSend.value || submitting.value) return
  
  submitting.value = true
  const { success } = await messagesStore.sendMessage(form.value)
  
  if (success) {
    sent.value = true
    form.value = { name: '', email: '', subject: '', message: '' }
  } else {
    alert("Une erreur est survenue lors de l'envoi. Veuillez réessayer.")
  }
  submitting.value = false
}

const social = computed(() => {
  return [
    { label: "Instagram", handle: settings.value.instagram || "@latelier.studio" },
    { label: "Facebook", handle: settings.value.facebook || "/latelier" },
    { label: "LinkedIn", handle: settings.value.linkedin || "/latelier" }
  ].filter(s => s.handle)
})
</script>

<template>
  <main class="page page-contact" data-screen-label="05 Contact">
    <template v-if="sent">
      <section class="contact-sent" data-reveal>
        <p class="meta-num">05 / 05 — Envoyé</p>
        <h1 class="presta-title">
          Merci.<br />
          <em>On revient vers vous.</em>
        </h1>
        <p class="presta-lead">
          Votre message est bien arrivé. Souvent un appel, parfois un café à l'atelier.
        </p>
        <button class="btn-primary" data-hover @click="sent = false">
          <span>Renvoyer un message</span>
        </button>
      </section>
    </template>

    <template v-else>
      <section class="presta-hero">
        <div class="presta-hero-meta">
          <span class="meta-num">05 / 05</span>
          <span class="meta-divider" />
          <span class="meta-tag">Contact</span>
        </div>
        <h1 class="presta-title">
          Une idée ?<br />
          <em>Écrivez-nous.</em>
        </h1>
        <p class="presta-lead">Quelques lignes suffisent. On vous répond sous 48 heures.</p>
      </section>

      <section class="contact-simple" data-reveal>
        <div class="contact-cols">
          <form class="contact-form-simple" @submit="onSubmit">
            <div class="fields">
              <label class="field">
                <span class="field-label">Nom</span>
                <input v-model="form.name" type="text" placeholder="Votre nom" required />
              </label>
              <label class="field">
                <span class="field-label">Email</span>
                <input v-model="form.email" type="email" placeholder="vous@exemple.com" required />
              </label>
              <label class="field field-full">
                <span class="field-label">Sujet (optionnel)</span>
                <input v-model="form.subject" type="text" placeholder="Identité, événement, site, fresque…" />
              </label>
              <label class="field field-full">
                <span class="field-label">Message</span>
                <textarea v-model="form.message" class="field-textarea" rows="7" placeholder="Dites-nous tout." required />
              </label>
            </div>
            <div class="form-nav form-nav-simple">
              <button type="submit" class="btn-primary" :disabled="!canSend || submitting" data-hover>
                <span>{{ submitting ? 'Envoi...' : 'Envoyer' }}</span>
                <span v-if="!submitting" class="btn-arrow" aria-hidden="true">↗</span>
              </button>
            </div>
          </form>

          <aside class="contact-side">
            <div class="contact-side-block">
              <p class="footer-label">Écrire directement</p>
              <a :href="'mailto:' + settings.email" class="contact-big contact-mail" data-hover>{{ settings.email }}</a>
              <p class="footer-line footer-mute">Réponse sous 48h ouvrées.</p>
            </div>
            
            <div class="contact-side-block">
              <p class="footer-label">Téléphone</p>
              <a :href="'tel:' + (settings.phone || '').replace(/\s+/g, '')" class="contact-big" data-hover>{{ settings.phone }}</a>
            </div>

            <div class="contact-side-block">
              <p class="footer-label">Au studio</p>
              <p class="contact-addr">{{ settings.city || 'Fidjrossè, Cotonou' }}</p>
              <p class="footer-line footer-mute">Sur rendez-vous, du lundi au samedi.</p>
            </div>

            <div class="contact-side-block">
              <p class="footer-label">Réseaux</p>
              <p v-for="s in social" :key="s.label" class="contact-mail-line">
                <span class="footer-mute">{{ s.label }}</span>
                <span>{{ s.handle }}</span>
              </p>
            </div>
          </aside>
        </div>
      </section>
    </template>
  </main>
</template>
