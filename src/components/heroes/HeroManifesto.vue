<script setup>
import { usePageNav } from '@/composables/usePageNav'

const { setPage } = usePageNav()
</script>

<template>
  <section class="hero hero-manifesto">
    <div class="hero-meta">
      <span class="meta-num">01 / 05</span>
      <span class="meta-divider" />
      <span class="meta-tag">L'atelier — Studio Créatif</span>
    </div>
    <h1 class="hero-mf-title">
      <span>Vous avez</span>
      <span>une <em>idée</em>.</span>
      <span>On la <em>met</em></span>
      <span>au <em>monde</em>.</span>
    </h1>
    <div class="hero-mf-foot">
      <p class="hero-lead hero-lead-mf">
        Identité. Espace. Digital. Événement. Booking.<br />
        Studio créatif à Fidjrossè, Cotonou — since 2025.
      </p>
      <div class="hero-cta">
        <button class="btn-primary" data-hover data-cursor-label="ouvrir →" @click="setPage('prestations')">
          <span>Nos prestations</span>
          <span class="btn-arrow" aria-hidden="true">→</span>
        </button>
        <button class="btn-ghost" data-hover @click="setPage('contact')">Démarrer un projet</button>
      </div>
    </div>
  </section>
</template>
