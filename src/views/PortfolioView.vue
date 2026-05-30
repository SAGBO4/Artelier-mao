<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import Placeholder from '@/components/Placeholder.vue'
import Lightbox from '@/components/Lightbox.vue'
import { useReveal } from '@/composables/useReveal'
import { CHAPTERS } from '@/data/studio'
import { useProjectsStore } from '@/stores/projects'

const route = useRoute()
const filter = ref('all')
const open = ref(null)
const projectsStore = useProjectsStore()
const PROJECTS = computed(() => projectsStore.projects)

watch(
  () => route.query.focus,
  (focus) => {
    if (!focus) {
      open.value = null
      return
    }
    // Try to find in dynamic projects first, then fallback
    open.value = PROJECTS.value.find((p) => p.id === focus) || null
  },
  { immediate: true }
)

const visible = computed(() => {
  const list = PROJECTS.value
  return filter.value === 'all' ? list : list.filter((p) => p.chapter === filter.value)
})

useReveal([filter, PROJECTS])

function navLb(dir) {
  if (!open.value) return
  const i = visible.value.findIndex((p) => p.id === open.value.id)
  if (i === -1) return
  const ni = (i + dir + visible.value.length) % visible.value.length
  open.value = visible.value[ni]
}
</script>

<template>
  <main class="page page-portfolio" data-screen-label="03 Portfolio">
    <section class="presta-hero">
      <div class="presta-hero-meta">
        <span class="meta-num">03 / 05</span>
        <span class="meta-divider" />
        <span class="meta-tag">Sélection de pièces · {{ PROJECTS.length }} projets</span>
      </div>
      <h1 class="presta-title">
        La mise au monde de<br />
        <em>vos idées.</em>
      </h1>
      <p class="presta-lead">
        Chaque projet est unique. Nous ne dupliquons pas, nous construisons. Cliquez sur une pièce pour explorer le détail.
      </p>
    </section>

    <section class="presta-controls" data-reveal>
      <div class="presta-chips">
        <button
          :class="['chip', { 'is-active': filter === 'all' }]"
          data-hover
          @click="filter = 'all'"
        >
          <span class="chip-num">00</span><span>Tout voir</span>
        </button>
        <button
          v-for="c in CHAPTERS"
          :key="c.id"
          :class="['chip', { 'is-active': filter === c.id }]"
          data-hover
          @click="filter = c.id"
        >
          <span class="chip-num">{{ c.num }}</span><span>{{ c.name }}</span>
        </button>
      </div>
      <div class="portfolio-stats">
        <span class="footer-mute">{{ visible.length }} résultat(s)</span>
      </div>
    </section>

    <section class="portfolio-grid-premium">
      <article
        v-for="(p, i) in visible"
        :key="p.id"
        :class="['portfolio-card-premium', `pf-variant-${i % 4}`]"
        data-reveal
        data-hover
        :style="{ transitionDelay: (i % 3) * 80 + 'ms' }"
        @click="open = p"
      >
        <div class="pf-card-inner">
          <div class="portfolio-img-shell">
            <img
              v-if="p.image_url"
              :src="p.image_url"
              :alt="p.title"
              class="pf-real-img"
            />
            <Placeholder v-else :label="p.title.toLowerCase()" :ratio="p.ratio || '4/5'" :tone="p.tone" />
            <div class="pf-overlay">
              <span class="pf-year-tag">{{ p.year }}</span>
            </div>
          </div>
          <div class="pf-card-info">
            <div class="pf-card-top">
              <span class="pf-category">{{ p.type }}</span>
              <span class="pf-chapter">{{ p.chapter }}</span>
            </div>
            <h3 class="pf-card-title">{{ p.title }}</h3>
          </div>
        </div>
      </article>
    </section>

    <div v-if="visible.length === 0" class="portfolio-empty" data-reveal>
      <p>Aucun projet dans cette catégorie pour le moment.</p>
    </div>

    <Lightbox
      v-if="open"
      :project="open"
      :projects="visible"
      @close="open = null"
      @nav="navLb"
    />
  </main>
</template>

<style scoped>
.portfolio-grid-premium {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: clamp(24px, 3vw, 48px) clamp(20px, 2.4vw, 32px);
  padding: clamp(40px, 6vw, 80px) 0;
}

.portfolio-card-premium {
  grid-column: span 6;
  transition: transform 0.5s cubic-bezier(0.2, 0.7, 0.2, 1);
}

.portfolio-card-premium:hover {
  transform: translateY(-8px);
}

/* Variantes de tailles pour le look asymétrique */
.pf-variant-1 { grid-column: span 6; margin-top: 40px; }
.pf-variant-2 { grid-column: 4 / span 5; }
.pf-variant-3 { grid-column: span 7; }

@media (max-width: 900px) {
  .portfolio-card-premium, .pf-variant-1, .pf-variant-2, .pf-variant-3 {
    grid-column: span 12 !important;
    margin-top: 0 !important;
  }
}

.portfolio-img-shell {
  position: relative;
  overflow: hidden;
  border-radius: 4px;
}

.pf-real-img {
  width: 100%;
  aspect-ratio: 4/5;
  object-fit: cover;
  display: block;
  transition: transform 0.8s cubic-bezier(0.2, 0.7, 0.2, 1);
}

.portfolio-card-premium:hover .pf-real-img {
  transform: scale(1.04);
}

.pf-overlay {
  position: absolute;
  top: 14px;
  right: 14px;
  pointer-events: none;
}

.pf-year-tag {
  font-family: var(--font-mono);
  font-size: 10px;
  padding: 4px 10px;
  background: var(--paper);
  border-radius: 99px;
  color: var(--ink);
  opacity: 0;
  transform: translateY(-4px);
  transition: all 0.3s;
}

.portfolio-card-premium:hover .pf-year-tag {
  opacity: 1;
  transform: none;
}

.pf-card-info {
  margin-top: 18px;
}

.pf-card-top {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: .1em;
  color: var(--ink-50);
  margin-bottom: 6px;
}

.pf-card-title {
  font-family: var(--font-serif);
  font-size: clamp(24px, 2vw, 36px);
  font-weight: 400;
  line-height: 1.1;
  letter-spacing: -0.01em;
}

.portfolio-stats {
  font-family: var(--font-mono);
  font-size: 11px;
}

.portfolio-empty {
  padding: 100px 0;
  text-align: center;
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 20px;
  color: var(--ink-40);
}
</style>
