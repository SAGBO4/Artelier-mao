<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import SectionHead from '@/components/SectionHead.vue'
import { useReveal } from '@/composables/useReveal'
import { usePageNav } from '@/composables/usePageNav'
import { CHAPTERS, ALL_SERVICES } from '@/data/studio'

const route = useRoute()
const { setPage } = usePageNav()

const active = ref(route.query.chapter || 'all')
const view = ref('chapitres')

watch(
  () => route.query.chapter,
  (ch) => {
    active.value = ch || 'all'
  }
)

const visible = computed(() =>
  active.value === 'all' ? CHAPTERS : CHAPTERS.filter((c) => c.id === active.value)
)

useReveal([active, view])
</script>

<template>
  <main class="page page-prestations" data-screen-label="02 Prestations">
    <section class="presta-hero">
      <div class="presta-hero-meta">
        <span class="meta-num">02 / 05</span>
        <span class="meta-divider" />
        <span class="meta-tag">17 prestations · et au-delà</span>
      </div>
      <h1 class="presta-title">
        Une idée.<br />
        <em>On la réalise.</em>
      </h1>
      <p class="presta-lead">
        Voici ce que nous faisons déjà — Identité, Espace, Digital, Événement. Et si votre idée n'entre dans aucune case, parlons-en : on construit.
      </p>
    </section>

    <section class="presta-controls" data-reveal>
      <div class="presta-chips">
        <button
          :class="['chip', { 'is-active': active === 'all' }]"
          data-hover
          @click="active = 'all'"
        >
          <span class="chip-num">00</span>
          <span>Tout</span>
        </button>
        <button
          v-for="c in CHAPTERS"
          :key="c.id"
          :class="['chip', { 'is-active': active === c.id }]"
          data-hover
          @click="active = c.id"
        >
          <span class="chip-num">{{ c.num }}</span>
          <span>{{ c.name }}</span>
        </button>
      </div>
      <div class="view-toggle" role="tablist" aria-label="Vue">
        <button
          :class="['view-btn', { 'is-active': view === 'chapitres' }]"
          role="tab"
          @click="view = 'chapitres'"
        >par territoire</button>
        <button
          :class="['view-btn', { 'is-active': view === 'mosaique' }]"
          role="tab"
          @click="view = 'mosaique'"
        >mosaïque</button>
      </div>
    </section>

    <section v-if="view === 'chapitres'" class="presta-chapters">
      <div v-for="c in visible" :key="c.id" class="chapter-block" data-reveal>
        <header class="chapter-head">
          <span class="chapter-num-big">{{ c.num }}</span>
          <div>
            <h2 class="chapter-name-big">{{ c.name }}</h2>
            <p class="chapter-blurb-big">{{ c.blurb }}</p>
          </div>
          <span class="chapter-count">
            {{ c.services.length }} prestation{{ c.services.length > 1 ? 's' : '' }}
          </span>
        </header>
        <div class="services-grid">
          <article
            v-for="(s, i) in c.services"
            :key="s.id"
            class="service-card"
            data-reveal
            data-hover
            :style="{ transitionDelay: i * 40 + 'ms' }"
          >
            <span class="service-idx">{{ String(i + 1).padStart(2, '0') }}</span>
            <h3 class="service-title">{{ s.title }}</h3>
            <p class="service-excerpt">{{ s.excerpt }}</p>
            <div class="service-tags">
              <span v-for="k in s.keywords" :key="k" class="tag">{{ k }}</span>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section v-else class="presta-mosaic">
      <div class="mosaic-grid">
        <article
          v-for="(s, i) in ALL_SERVICES"
          :key="s.id"
          :class="['mosaic-card', 'mosaic-' + s.chapter]"
          data-reveal
          data-hover
          :style="{ transitionDelay: (i % 6) * 35 + 'ms' }"
        >
          <div class="mosaic-top">
            <span class="mosaic-num">{{ s.chapterNum }}</span>
            <span class="mosaic-chap">{{ s.chapterName }}</span>
          </div>
          <h3 class="mosaic-title">{{ s.title }}</h3>
          <p class="mosaic-excerpt">{{ s.excerpt }}</p>
        </article>
      </div>
    </section>

    <section class="section section-cta" data-reveal>
      <h2 class="cta-title">
        Un brief en tête ?<br />
        <em>Racontez-nous.</em>
      </h2>
      <button class="btn-primary" data-hover @click="setPage('contact')">
        <span>Démarrer un projet</span>
        <span class="btn-arrow" aria-hidden="true">→</span>
      </button>
    </section>
  </main>
</template>
