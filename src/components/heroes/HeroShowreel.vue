<script setup>
import { computed } from 'vue'
import ShowreelColumn from './ShowreelColumn.vue'
import { usePageNav } from '@/composables/usePageNav'
import { useShowreel } from '@/composables/useShowreel'

const { setPage } = usePageNav()
const { items } = useShowreel()

const col1 = computed(() => items.value.filter(i => i.column_id === 1))
const col2 = computed(() => items.value.filter(i => i.column_id === 2))
const col3 = computed(() => items.value.filter(i => i.column_id === 3))

// Fallback if empty
const defaultLabels = ['l\'atelier', 'studio', 'créatif', '2025', 'cotonou', 'bénin']

const strip = ['10 personnes', '—', '17 prestations', '—', 'Fidjrossè, Cotonou', '—', 'Since 2025']
</script>

<template>
  <section class="hero hero-showreel">
    <div class="hero-meta">
      <span class="meta-num">01 / 05</span>
      <span class="meta-divider" />
      <span class="meta-tag">L'atelier — Studio Créatif · since 2025</span>
    </div>
    <div class="showreel-grid">
      <div class="showreel-left">
        <h1 class="hero-title hero-title-tight">
          <span class="hero-line">Vous avez</span>
          <span class="hero-line">une <em>idée</em>.</span>
          <span class="hero-line">On la <em>réalise</em>.</span>
        </h1>
        <p class="hero-lead">
          Studio créatif à Cotonou. Identité, espace, digital, événementiel, booking — et tout ce qui peut être fabriqué.
        </p>
        <div class="hero-cta">
          <button class="btn-primary" data-hover @click="setPage('prestations')">
            <span>Nos prestations</span>
            <span class="btn-arrow" aria-hidden="true">→</span>
          </button>
          <button class="btn-ghost" data-hover @click="setPage('contact')">Démarrer un projet</button>
        </div>
      </div>
      <div class="showreel-right" aria-hidden="true">
        <ShowreelColumn :items="col1.length ? col1 : defaultLabels" dir="up" />
        <ShowreelColumn :items="col2.length ? col2 : defaultLabels" dir="down" />
        <ShowreelColumn :items="col3.length ? col3 : defaultLabels" dir="up" />
      </div>
    </div>
    <div class="hero-strip">
      <span v-for="(s, i) in strip" :key="i" class="hero-strip-item">{{ s }}</span>
    </div>
  </section>
</template>
