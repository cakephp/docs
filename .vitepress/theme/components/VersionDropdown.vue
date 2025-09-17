<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, withBase } from 'vitepress'
import { getVersionNavItems, getVersionByPath, getVersionLabel } from '../../cake.js'

const route = useRoute()
const isOpen = ref(false)

// Get version navigation items from centralized config
const versionNavItems = getVersionNavItems()

const currentPath = computed(() => {
  const version = getVersionByPath(route.path)
  return withBase(version.publicPath)
})

const currentVersionText = computed(() => {
  return getVersionLabel(route.path)
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const closeDropdown = () => {
  isOpen.value = false
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.version-dropdown')) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="version-dropdown">
    <button class="nav-dropdown-link" @click="toggleDropdown" :aria-expanded="isOpen">
      {{ currentVersionText }}
      <span class="dropdown-arrow" :class="{ open: isOpen }">▼</span>
    </button>
    <ul v-show="isOpen" class="nav-dropdown-links">
      <li v-for="version in versionNavItems" :key="version.path">
        <a 
          :href="withBase(version.link)" 
          :class="{ active: version.path === currentPath }"
          @click="closeDropdown"
        >
          {{ version.text }}
        </a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.version-dropdown {
  position: relative;
  display: inline-block;
}

.nav-dropdown-link {
  display: flex;
  align-items: center;
  color: var(--vp-c-text-1);
  background: none;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 0 12px;
  height: var(--vp-nav-height);
  line-height: var(--vp-nav-height);
  transition: color 0.25s;
}

.nav-dropdown-link:hover {
  color: var(--vp-c-brand-1);
}

.dropdown-arrow {
  margin-left: 4px;
  font-size: 10px;
  transition: transform 0.25s;
}

.dropdown-arrow.open {
  transform: rotate(180deg);
}

.nav-dropdown-links {
  position: absolute;
  top: calc(var(--vp-nav-height) - 12px);
  right: 0;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  box-shadow: var(--vp-shadow-3);
  list-style: none;
  margin: 0;
  padding: 4px 0;
  min-width: 140px;
  z-index: 1000;
  white-space: nowrap;
}

.nav-dropdown-links li {
  margin: 0;
}

.nav-dropdown-links a {
  display: block;
  padding: 8px 16px;
  color: var(--vp-c-text-1);
  text-decoration: none;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  transition: background-color 0.25s;
}

.nav-dropdown-links a:hover {
  background-color: var(--vp-c-default-soft);
}

.nav-dropdown-links a.active {
  color: var(--vp-c-brand-1);
  font-weight: 500;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .nav-dropdown-links {
    position: fixed;
    top: calc(var(--vp-nav-height-mobile, 55px) + 12px);
    right: 16px;
    left: 16px;
    width: auto;
    min-width: auto;
  }
}
</style>