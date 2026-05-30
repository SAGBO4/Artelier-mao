<script setup>
import { inject, computed } from 'vue'
import Marquee from '@/components/Marquee.vue'
import SectionHead from '@/components/SectionHead.vue'
import Placeholder from '@/components/Placeholder.vue'
import HeroShowreel from '@/components/heroes/HeroShowreel.vue'
import HeroManifesto from '@/components/heroes/HeroManifesto.vue'
import HeroPlateau from '@/components/heroes/HeroPlateau.vue'
import { useReveal } from '@/composables/useReveal'
import { usePageNav } from '@/composables/usePageNav'
import { CHAPTERS } from '@/data/studio'
import { useProjectsStore } from '@/stores/projects'
import { useTeamStore } from '@/stores/team'

const tweaks = inject('tweaks')
const { setPage } = usePageNav()
const projectsStore = useProjectsStore()
const teamStore = useTeamStore()

const PROJECTS = computed(() => projectsStore.projects)
const TEAM = computed(() => teamStore.members)

useReveal([() => tweaks.t.value.heroVariant, PROJECTS, TEAM])

const marqueeItems = [
  'Identité', 'Espace', 'Digital', 'Événement',
  'Peinture', 'Sérigraphie', 'Batik', 'Code',
  'Direction artistique', 'Mobile · iOS · Android',
  'Gravure laser', 'Fresque'
]
</script>

<template>
  <main class="page page-home" data-screen-label="01 Accueil">
    <HeroShowreel v-if="tweaks.t.value.heroVariant === 'showreel'" />
    <HeroManifesto v-else-if="tweaks.t.value.heroVariant === 'manifesto'" />
    <HeroPlateau v-else />

    <Marquee :items="marqueeItems" />

    <section class="section section-chapters" data-reveal>
      <SectionHead
        num="02"
        kicker="Nos terrains de jeu"
        lead="Identité, Espace, Digital, Événement — et tout ce qui se construit avec les mains, l'œil et le code. Si l'idée existe, on la fabrique."
      >
        <template #title>
          <span>Vous avez une idée.<br /><em>On la réalise.</em></span>
        </template>
      </SectionHead>
      <div class="chapters-list">
        <button
          v-for="(c, idx) in CHAPTERS"
          :key="c.id"
          class="chapter-row"
          data-hover
          data-reveal
          :style="{ transitionDelay: idx * 70 + 'ms' }"
          @click="setPage('prestations', { chapter: c.id })"
        >
          <span class="chapter-num">{{ c.num }}</span>
          <span class="chapter-name">{{ c.name }}</span>
          <span class="chapter-blurb">{{ c.blurb }}</span>
          <span class="chapter-meta">{{ c.services.length }} prestations</span>
          <span class="chapter-arrow" aria-hidden="true">→</span>
        </button>
      </div>
    </section>

    <section class="section section-projects" data-reveal>
      <SectionHead num="03" kicker="Récemment au studio" title="Quelques pièces." />
      <div class="projects-grid">
        <article
          v-for="(p, i) in PROJECTS.slice(0, 6)"
          :key="p.id"
          :class="['project-card', 'project-card-' + (i % 3)]"
          data-reveal
          data-hover
          :style="{ transitionDelay: (i % 3) * 60 + 'ms' }"
          @click="setPage('portfolio', { focus: p.id })"
        >
          <div class="project-img">
            <img
              v-if="p.image_url"
              :src="p.image_url"
              :alt="p.title"
              style="width: 100%; aspect-ratio: 4/5; object-fit: cover; display: block"
            />
            <Placeholder v-else :label="p.title.toLowerCase()" :ratio="p.ratio" :tone="p.tone" />
          </div>
          <div class="project-meta">
            <span class="project-year">{{ p.year }}</span>
            <span class="project-type">{{ p.type }}</span>
          </div>
          <h3 class="project-title">{{ p.title }}</h3>
        </article>
      </div>
      <div class="section-foot">
        <button class="btn-link" data-hover @click="setPage('portfolio')">
          Voir tout le portfolio ↗
        </button>
      </div>
    </section>

    <section class="section section-team-peek" data-reveal>
      <div class="peek-grid">
        <div class="peek-text">
          <p class="manifesto-eyebrow">— L'équipe</p>
          <h2 class="peek-title">
            {{ TEAM.length }} personnes.<br />
            <em>Ceux qui font.</em>
          </h2>
          <p class="peek-lead">
            Designers. Plasticiens. Développeurs. Une équipe au service de l'idée.
          </p>
          <button class="btn-link" data-hover @click="setPage('equipe')">
            L'équipe au complet ↗
          </button>
        </div>
        <div class="peek-list">
          <div
            v-for="(m, i) in TEAM.slice(0, 5)"
            :key="m.id || m.name"
            class="peek-row"
            :style="{ animationDelay: i * 80 + 'ms' }"
          >
            <span class="peek-name">{{ m.name }}</span>
            <span class="peek-role">{{ m.role }}</span>
          </div>
          <div class="peek-row peek-more">
            <span class="peek-name">+ {{ TEAM.length - 5 > 0 ? TEAM.length - 5 : 0 }} autres</span>
            <span class="peek-role">→ page équipe</span>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
