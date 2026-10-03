<script setup>
import { withBase } from 'vitepress'
</script>

<template>
  <div class="home-welcome">
    <div class="home-welcome-copy">
      <slot />
      <div class="home-actions">
        <a class="home-button home-button-primary" :href="withBase('/quickstart.html')">
          Get started <span aria-hidden="true">→</span>
        </a>
        <a class="home-button home-button-secondary" :href="withBase('/installation.html')">
          Installation
        </a>
      </div>
    </div>
    <div class="home-welcome-art" aria-hidden="true">
      <img :src="withBase('/logo.svg')" alt="" width="112" height="88" />
    </div>
  </div>
</template>
