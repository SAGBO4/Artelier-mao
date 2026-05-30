<script setup>
import Placeholder from '../Placeholder.vue'

const props = defineProps({
  items: { type: Array, required: true },
  dir: { type: String, required: true }
})

const full = [...props.items, ...props.items]
</script>

<template>
  <div :class="'showreel-col showreel-col-' + dir">
    <div class="showreel-track">
      <div v-for="(item, i) in full" :key="i" class="showreel-cell">
        <template v-if="typeof item === 'object'">
          <div v-if="item.image_url" class="placeholder" style="padding:0; aspect-ratio: 3/4">
             <img :src="item.image_url" style="width:100%; height:100%; object-fit:cover; display:block" />
          </div>
          <Placeholder
            v-else
            :label="item.label"
            ratio="3/4"
            :tone="item.tone || 'warm'"
          />
        </template>
        <Placeholder
          v-else
          :label="item"
          ratio="3/4"
          :tone="'warm'"
        />
      </div>
    </div>
  </div>
</template>
