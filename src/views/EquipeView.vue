<script setup>
import SectionHead from '@/components/SectionHead.vue'
import Placeholder from '@/components/Placeholder.vue'
import { useReveal } from '@/composables/useReveal'
import { useTeamStore } from '@/stores/team'
import { computed } from 'vue'

const teamStore = useTeamStore()
const members = computed(() => teamStore.members)
useReveal([members])

const collab = [
  { n: '01', t: 'Écoute & idée', d: "On comprend votre idée. Même floue. Surtout floue." },
  { n: '02', t: 'Maquette + matière', d: 'On dessine. On imprime. On touche. Vite, et beaucoup.' },
  { n: '03', t: 'Atelier ouvert', d: 'Le client passe au studio. On montre ce qui marche, ce qui rate.' },
  { n: '04', t: 'Mise au monde', d: 'Identité, app, mur, événement. Livré. Et suivi dans le temps.' }
]
</script>

<template>
  <main class="page page-equipe" data-screen-label="04 Équipe">
    <section class="presta-hero">
      <div class="presta-hero-meta">
        <span class="meta-num">04 / 05</span>
        <span class="meta-divider" />
        <span class="meta-tag">L'équipe · {{ members.length }} personnes</span>
      </div>
      <h1 class="presta-title">
        Ceux qui<br />
        <em>font.</em>
      </h1>
      <p class="presta-lead">
        Une équipe pluridisciplinaire au service de la création. Chaque projet trouve ses mains, son outil, sa voix.
      </p>
    </section>

    <section class="team-grid">
      <article
        v-for="(m, i) in members"
        :key="m.id || m.name"
        class="team-card-premium"
        data-reveal
        :style="{ transitionDelay: (i % 5) * 80 + 'ms' }"
      >
        <div class="team-frame">
          <div class="team-portrait-lux">
            <img
              v-if="m.image_url"
              :src="m.image_url"
              :alt="m.name"
              class="team-img"
            />
            <Placeholder v-else :label="m.name.split(' ')[0].toLowerCase()" ratio="1/1" :tone="m.tone" />
          </div>
        </div>
        <div class="team-content-lux">
          <p class="team-role-lux">{{ m.role }}</p>
          <h3 class="team-name-lux">{{ m.name }}</h3>
          <p class="team-bio-lux">{{ m.bio }}</p>
          <div class="team-skills-lux">
            <span v-for="s in m.skills" :key="s" class="lux-tag">{{ s }}</span>
          </div>
        </div>
      </article>
    </section>

    <section class="section section-collab" data-reveal>
      <SectionHead
        num="05"
        kicker="Comment on travaille"
        lead="Quatre temps. Une seule équipe. Le client reste dans la boucle, du brief jusqu'à l'après."
      >
        <template #title>De l'<em>idée</em> au <em>réel</em>.</template>
      </SectionHead>
      <div class="collab-grid">
        <div
          v-for="(s, i) in collab"
          :key="s.n"
          class="collab-step"
          data-reveal
          :style="{ transitionDelay: i * 70 + 'ms' }"
        >
          <span class="collab-num">{{ s.n }}</span>
          <h4 class="collab-t">{{ s.t }}</h4>
          <p class="collab-d">{{ s.d }}</p>
        </div>
      </div>
    </section>
  </main>
</template>
