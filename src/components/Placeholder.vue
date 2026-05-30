<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, required: true },
  ratio: { type: String, default: '4/5' },
  tone: { type: String, default: 'warm' },
  caption: { type: String, default: '' },
  kind: { type: String, default: 'stripe' }
})

const tones = {
  warm: { a: 'var(--ink-04)', b: 'var(--ink-08)', fg: 'var(--ink-50)' },
  cool: { a: 'var(--ink-06)', b: 'var(--ink-12)', fg: 'var(--ink-55)' },
  neutral: { a: 'var(--paper-warm)', b: 'var(--ink-05)', fg: 'var(--ink-45)' },
  ink: { a: 'var(--ink-70)', b: 'var(--ink-80)', fg: 'rgba(255,255,255,.65)' }
}

const style = computed(() => {
  const s = tones[props.tone] || tones.warm
  const bg =
    props.kind === 'dots'
      ? `radial-gradient(circle at 50% 50%, ${s.b} 1.2px, transparent 1.6px) 0 0/12px 12px, ${s.a}`
      : `repeating-linear-gradient(135deg, ${s.a} 0 14px, ${s.b} 14px 28px)`
  return { aspectRatio: props.ratio, background: bg, color: s.fg }
})
</script>

<template>
  <div class="placeholder" :style="style">
    <span class="ph-corner ph-tl" aria-hidden="true" />
    <span class="ph-corner ph-tr" aria-hidden="true" />
    <span class="ph-corner ph-bl" aria-hidden="true" />
    <span class="ph-corner ph-br" aria-hidden="true" />
    <span class="ph-label">{{ label }}</span>
    <span v-if="caption" class="ph-caption">{{ caption }}</span>
  </div>
</template>
