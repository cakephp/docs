<script setup lang="ts">
  import { onMounted, onUnmounted, ref } from 'vue'
  import { useRouter } from 'vitepress'

  const visible = ref(false)
  const router = useRouter()

  let before = null
  let after = null

  onMounted(() => {
    before = () => { visible.value = true }
    after = () => {
      // Small delay to ensure rendering is done
      setTimeout(() => { visible.value = false }, 50)
    }
    router.onBeforeRouteChange = before
    router.onAfterRouteChange = after
  })

  onUnmounted(() => {
    if (router.onBeforeRouteChange === before) {
      router.onBeforeRouteChange = undefined
    }
    if (router.onAfterRouteChange === after) {
      router.onAfterRouteChange = undefined
    }
  })
</script>

<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="page-loader"
    >
      <div class="page-loader-bar" />
    </div>
  </transition>
</template>

<style scoped>
.page-loader-bar {
  position: fixed;
  top: 0;
  width: 100%;
  height: 2px;
  background-clip: padding-box;
  overflow: hidden;
  z-index: 1000;

  &::before,
  &::after {
    content: "";
    position: absolute;
    will-change: left, right;
    top: 0;
    left: 0;
    bottom: 0;
    background-color: var(--cake-color-progress);
  }

  &::before {
    animation: indeterminate 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
  }

  &::after {
    animation: indeterminate-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;
    animation-delay: 1.15s;
  }
}

@keyframes indeterminate {
  0% {
    left: -35%;
    right: 100%;
  }
  60% {
    left: 100%;
    right: -90%;
  }
  100% {
    left: 100%;
    right: -90%;
  }
}

@keyframes indeterminate-short {
  0% {
    left: -200%;
    right: 100%;
  }
  60% {
    left: 107%;
    right: -8%;
  }
  100% {
    left: 107%;
    right: -8%;
  }
}
</style>
