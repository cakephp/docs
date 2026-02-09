---
title: "Cache Tool"
description: "Manage cache from CLI in CakePHP: clear all caches, specific cache configs, and maintain cached data via console commands."
---

# Cache Tool

To help you better manage cached data from a CLI environment, a console command
is available for clearing cached data your application has:

```bash
// Clear one cache config
bin/cake cache clear <configname>

// Clear all cache configs
bin/cake cache clear_all

// Clear one cache group
bin/cake cache clear_group <groupname>
```
