<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const isMenuOpen = ref(false)

const items = [
  { id: 'home', label: 'Accueil', num: '01' },
  { id: 'prestations', label: 'Prestations', num: '02' },
  { id: 'portfolio', label: 'Portfolio', num: '03' },
  { id: 'equipe', label: 'Équipe', num: '04' },
  { id: 'contact', label: 'Contact', num: '05' }
]

const page = computed(() => route.name)

function go(id) {
  isMenuOpen.value = false
  router.push({ name: id })
  requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'auto' }))
}

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<template>
  <header class="nav" :class="{ 'is-menu-open': isMenuOpen }">
    <div class="nav-inner">
      <button class="brand" aria-label="Accueil" @click="go('home')">
        <span class="brand-mark" aria-hidden="true">
          <span class="brand-glyph">L</span>
        </span>
        <span class="brand-name">L'atelier</span>
        <span class="brand-sub">Studio Créatif</span>
      </button>

      <!-- Desktop Links -->
      <nav class="nav-links">
        <button
          v-for="it in items"
          :key="it.id"
          :class="['nav-link', { 'is-active': page === it.id }]"
          data-hover
          @click="go(it.id)"
        >
          <span class="nav-num">{{ it.num }}</span>
          <span class="nav-lbl">{{ it.label }}</span>
        </button>
      </nav>

      <div class="nav-right">
        <div class="nav-meta">
          <span class="nav-dot" aria-hidden="true" />
          <span>Ouvert</span>
        </div>
        
        <!-- Burger Button -->
        <button class="btn-burger" :class="{ 'is-open': isMenuOpen }" @click="toggleMenu" aria-label="Menu">
          <span class="burger-line"></span>
          <span class="burger-line"></span>
        </button>
      </div>
    </div>

    <!-- Mobile Menu Overlay -->
    <Transition name="fade-menu">
      <div v-if="isMenuOpen" class="mobile-menu">
        <div class="mobile-menu-inner">
          <div class="mobile-menu-links">
            <button
              v-for="it in items"
              :key="it.id"
              :class="['mobile-link', { 'is-active': page === it.id }]"
              @click="go(it.id)"
            >
              <span class="mobile-num">{{ it.num }}</span>
              <span class="mobile-lbl">{{ it.label }}</span>
            </button>
          </div>
          <div class="mobile-menu-foot">
            <p>L'atelier — Studio Créatif</p>
            <p class="footer-mute">Cotonou, Bénin</p>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.nav-right { display: flex; align-items: center; gap: 20px; justify-content: flex-end; }
.nav.is-menu-open { 
  backdrop-filter: none !important; 
  -webkit-backdrop-filter: none !important;
  background: var(--paper);
}

/* Burger Button */
.btn-burger {
  display: none;
  width: 40px;
  height: 40px;
  position: relative;
  z-index: 101; /* Above mobile menu overlay */
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  transition: transform .3s;
}

.burger-line {
  display: block;
  width: 24px;
  height: 1.5px;
  background: var(--ink);
  transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
}

.btn-burger.is-open .burger-line:nth-child(1) { transform: translateY(3.25px) rotate(45deg); }
.btn-burger.is-open .burger-line:nth-child(2) { transform: translateY(-3.25px) rotate(-45deg); }

@media (max-width: 880px) {
  .btn-burger { display: flex; }
  .nav-links { display: none; }
  .nav-meta { display: none; }
}

/* Mobile Overlay Refined */
.mobile-menu {
  position: fixed;
  inset: 0;
  background: var(--paper);
  z-index: 100;
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--ink-05);
}

.mobile-menu-inner {
  padding: 100px var(--pad) 40px;
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
}

.mobile-menu-links {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mobile-link {
  display: flex;
  align-items: baseline;
  gap: 16px;
  font-family: var(--font-serif);
  font-size: clamp(32px, 8vw, 48px);
  text-align: left;
  line-height: 1.25;
  padding: 8px 0;
  transition: transform .3s;
}

.mobile-link:active { transform: scale(0.98); }

.mobile-num {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--ink-40);
  width: 24px;
}

.mobile-link.is-active {
  color: var(--ink);
  font-style: italic;
}

.mobile-menu-foot {
  margin-top: auto;
  font-family: var(--font-mono);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: .1em;
  color: var(--ink-50);
  border-top: 1px solid var(--ink-12);
  padding-top: 24px;
}

.fade-menu-enter-active, .fade-menu-leave-active { transition: opacity 0.5s cubic-bezier(0.19, 1, 0.22, 1), transform 0.5s cubic-bezier(0.19, 1, 0.22, 1); }
.fade-menu-enter-from, .fade-menu-leave-to { opacity: 0; transform: translateY(-10px); }
</style>
