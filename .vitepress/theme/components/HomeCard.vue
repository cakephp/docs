<script setup>
import { computed } from 'vue'
import { withBase } from 'vitepress'

const props = defineProps({
  href: { type: String, required: true },
})

const destination = computed(() => withBase(props.href))
</script>

<template>
  <a class="home-card" :href="destination">
    <div class="home-card-copy"><slot /></div>
    <span class="home-card-arrow" aria-hidden="true">→</span>
  </a>
</template>
