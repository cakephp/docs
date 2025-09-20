<script setup lang="ts">
  import { onMounted, onUnmounted, ref } from 'vue'
  import { useRouter } from 'vitepress'

  const visible = ref(false)
  const router = useRouter()

  let before: (() => void) | null = null
  let after: (() => void) | null = null

  onMounted(() => {
    before = () => { visible.value = true }
    after = () => {
      // Small delay to ensure rendering is done
      setTimeout(() => { visible.value = false }, 10)
    }
    router.onBeforeRouteChange = before
    router.onAfterRouteChange = after
  })

  onUnmounted(() => {
    if (router.onBeforeRouteChange === before) {
      router.onBeforeRouteChange = null
    }
    if (router.onAfterRouteChange === after) {
      router.onAfterRouteChange = null
    }
  })
</script>

<template>
  <transition name="fade">
    <div v-if="visible" class="page-loader">
      <div class="loader-spinner"></div>
    </div>
  </transition>
</template>

<style scoped>
  .page-loader {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }

  .loader-spinner {
    width: 48px;
    height: 48px;
    border: 4px solid #ccc;
    border-top-color: var(--vp-c-brand-1);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>
