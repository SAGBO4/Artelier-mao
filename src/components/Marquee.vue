<script setup>
defineProps({
  items: { type: Array, required: true },
  speed: { type: Number, default: 60 }
})
</script>

<template>
  <div class="marquee" role="presentation">
    <div class="marquee-track" :style="{ animationDuration: speed + 's' }">
      <div
        v-for="rep in 2"
        :key="rep"
        class="marquee-group"
        :aria-hidden="rep === 2"
      >
        <span v-for="(it, i) in items" :key="rep + '-' + i" class="marquee-item">
          <span class="marquee-glyph" aria-hidden="true" />
          <span>{{ it }}</span>
        </span>
      </div>
    </div>
  </div>
</template>
