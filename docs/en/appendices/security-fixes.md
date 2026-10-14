---
search: false
head:
  - - meta
    - http-equiv: refresh
      content: 0; url=/docs/security/fixes.html
  - - link
    - rel: canonical
      href: https://pieceofcake2.github.io/docs/security/fixes.html
  - - script
    - {}
    - location.replace('/docs/security/fixes.html' + location.hash)
---

<script setup>
import { onMounted } from 'vue'
import { withBase } from 'vitepress'

onMounted(() => {
    location.replace(withBase('/security/fixes.html') + location.hash)
})
</script>

# Security Fixes

This page has moved to [Security Fixes](/security/fixes) in the
[Security](/security/) section.
