<script setup>
import { inject, ref } from 'vue'

const tweaks = inject('tweaks')
const open = ref(true)

const heroOptions = [
  { value: 'showreel', label: 'A — Showreel' },
  { value: 'manifesto', label: 'B — Manifeste' },
  { value: 'plateau', label: 'C — Plateau' }
]

const serifOptions = [
  { value: 'fraunces', label: 'Fraunces (par défaut)' },
  { value: 'italiana', label: 'Italiana' },
  { value: 'bodoni', label: 'Bodoni Moda' },
  { value: 'cormorant', label: 'Cormorant Garamond' },
  { value: 'instrument', label: 'Instrument Serif' }
]

const densityOptions = ['compact', 'regular', 'comfy']
</script>

<template>
  <aside v-if="open" class="twk-panel-vue">
    <div class="twk-head">
      <strong>Tweaks</strong>
      <button type="button" @click="open = false">✕</button>
    </div>

    <label class="twk-row">
      <span>Hero</span>
      <select :value="tweaks.t.value.heroVariant" @change="(e) => tweaks.setTweak('heroVariant', e.target.value)">
        <option v-for="o in heroOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
      </select>
    </label>

    <label class="twk-row">
      <span>Papier</span>
      <input type="color" :value="tweaks.t.value.paper" @input="(e) => tweaks.setTweak('paper', e.target.value)" />
    </label>

    <label class="twk-row">
      <span>Encre</span>
      <input type="color" :value="tweaks.t.value.ink" @input="(e) => tweaks.setTweak('ink', e.target.value)" />
    </label>

    <label class="twk-row">
      <span>Accent</span>
      <input type="color" :value="tweaks.t.value.accent" @input="(e) => tweaks.setTweak('accent', e.target.value)" />
    </label>

    <label class="twk-row">
      <span>Serif</span>
      <select :value="tweaks.t.value.serif" @change="(e) => tweaks.setTweak('serif', e.target.value)">
        <option v-for="o in serifOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
      </select>
    </label>

    <div class="twk-row twk-density">
      <span>Densité</span>
      <div>
        <button
          v-for="d in densityOptions"
          :key="d"
          type="button"
          :class="{ on: tweaks.t.value.density === d }"
          @click="tweaks.setTweak('density', d)"
        >
          {{ d }}
        </button>
      </div>
    </div>
  </aside>
  <button v-else class="twk-reopen" type="button" @click="open = true">Tweaks</button>
</template>

<style scoped>
.twk-panel-vue {
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 9999;
  width: 260px;
  border-radius: 12px;
  border: 1px solid var(--ink-12);
  background: color-mix(in srgb, var(--paper) 90%, white);
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.twk-head { display:flex; justify-content:space-between; align-items:center; }
.twk-head button { border:1px solid var(--ink-12); border-radius:8px; padding:4px 8px; }
.twk-row { display:flex; flex-direction:column; gap:4px; font-size:12px; }
.twk-row select { height:30px; border:1px solid var(--ink-12); border-radius:8px; background:transparent; padding:0 8px; }
.twk-row input[type='color'] { width:100%; height:30px; border:1px solid var(--ink-12); border-radius:8px; background:transparent; }
.twk-density > div { display:flex; gap:6px; }
.twk-density button { border:1px solid var(--ink-12); border-radius:999px; padding:6px 10px; font-size:11px; text-transform:lowercase; }
.twk-density button.on { background:var(--ink); color:var(--paper); border-color:var(--ink); }
.twk-reopen { position:fixed; right:16px; bottom:16px; z-index:9999; border:1px solid var(--ink-12); border-radius:999px; padding:8px 14px; background:var(--paper); }
</style>
