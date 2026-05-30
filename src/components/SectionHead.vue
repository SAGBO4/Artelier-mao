<script setup>
defineProps({
  num: { type: String, required: true },
  kicker: { type: String, required: true },
  lead: { type: String, default: '' }
})
</script>

<template>
  <div class="sect-head">
    <div class="sect-kicker">
      <span class="sect-num">{{ num }}</span>
      <span class="sect-line" aria-hidden="true" />
      <span class="sect-tag">{{ kicker }}</span>
    </div>
    <h2 class="sect-title"><slot name="title" /></h2>
    <p v-if="lead" class="sect-lead">{{ lead }}</p>
  </div>
</template>
