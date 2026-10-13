<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useData } from 'vitepress'

const { theme } = useData()

const bannerConfig = computed(() => theme.value.versionBanner)

const isVisible = computed(() => {
  if (bannerConfig.value === true) {
    return true
  }

  if (bannerConfig.value && typeof bannerConfig.value === 'object') {
    return bannerConfig.value.enabled !== false
  }

  return false
})

const message = computed(() => {
  if (bannerConfig.value && typeof bannerConfig.value === 'object' && bannerConfig.value.message) {
    return bannerConfig.value.message
  }

  return 'This version of the documentation is outdated.'
})

const link = computed(() => {
  if (bannerConfig.value && typeof bannerConfig.value === 'object') {
    return bannerConfig.value.link || ''
  }

  return ''
})

const linkText = computed(() => {
  if (bannerConfig.value && typeof bannerConfig.value === 'object' && bannerConfig.value.linkText) {
    return bannerConfig.value.linkText
  }

  return 'View the latest version.'
})

const bannerElement = ref(null)
let resizeObserver = null

function setLayoutTopHeight(height) {
  if (typeof document === 'undefined') {
    return
  }

  document.documentElement.style.setProperty('--vp-layout-top-height', height)
}

async function syncLayoutTopHeight() {
  if (!isVisible.value) {
    setLayoutTopHeight('0px')
    return
  }

  await nextTick()

  const bannerHeight = bannerElement.value?.offsetHeight || 0
  setLayoutTopHeight(`${bannerHeight}px`)
}

watch(isVisible, () => {
  syncLayoutTopHeight()
}, { immediate: true })

onMounted(() => {
  if (typeof window === 'undefined' || !window.ResizeObserver) {
    return
  }

  resizeObserver = new ResizeObserver(() => {
    syncLayoutTopHeight()
  })

  if (bannerElement.value) {
    resizeObserver.observe(bannerElement.value)
  }

  syncLayoutTopHeight()
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }

  setLayoutTopHeight('0px')
})

</script>

<template>
  <div
    v-if="isVisible"
    ref="bannerElement"
    class="version-banner"
    role="status"
    aria-live="polite"
  >
    {{ message }}
    <a v-if="link" :href="link" target="_self">{{ linkText }}</a>
  </div>
</template>


<style scoped>
  .version-banner {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: calc(var(--vp-z-index-nav) + 1);
    background: #fff7e8;
    color: #734a00;
    padding: 12px 16px;
    width: 100%;
    text-align: center;
    user-select: none;
    border-bottom: 1px solid #e8c892;
  }

  .version-banner a {
    color: inherit;
    text-decoration: underline;
  }

  .dark .version-banner {
    background: #2d2417;
    color: #f3c372;
    border-bottom-color: #9b6a1f;
  }
</style>
