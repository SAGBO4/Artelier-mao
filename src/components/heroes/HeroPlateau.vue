<script setup>
import { CHAPTERS } from '@/data/studio'
import { usePageNav } from '@/composables/usePageNav'

const { setPage } = usePageNav()
</script>

<template>
  <section class="hero hero-plateau">
    <div class="hero-meta">
      <span class="meta-num">01 / 05</span>
      <span class="meta-divider" />
      <span class="meta-tag">L'atelier — Studio Créatif</span>
    </div>
    <div class="plateau-grid">
      <div class="plateau-intro">
        <h1 class="hero-title hero-title-pl">
          <span class="hero-line"><em>Toutes</em> vos idées,</span>
          <span class="hero-line">mises au monde.</span>
        </h1>
        <p class="hero-lead">
          Studio créatif à Cotonou — since 2025. Identité, espace, digital, événement, booking. Et tout ce qui se fabrique avec les mains.
        </p>
        <div class="hero-cta">
          <button class="btn-primary" data-hover @click="setPage('contact')">
            <span>Démarrer un projet</span>
            <span class="btn-arrow" aria-hidden="true">→</span>
          </button>
        </div>
      </div>
      <button
        v-for="c in CHAPTERS"
        :key="c.id"
        class="plateau-card"
        data-hover
        data-cursor-label="ouvrir →"
        @click="setPage('prestations', { chapter: c.id })"
      >
        <span class="plateau-num">{{ c.num }}</span>
        <h3 class="plateau-name">{{ c.name }}</h3>
        <p class="plateau-blurb">{{ c.blurb }}</p>
        <ul class="plateau-list">
          <li v-for="s in c.services.slice(0, 4)" :key="s.id">— {{ s.title }}</li>
          <li v-if="c.services.length > 4" class="plateau-more">+ {{ c.services.length - 4 }} autres</li>
        </ul>
      </button>
    </div>
  </section>
</template>
