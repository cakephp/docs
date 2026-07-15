---
title: "Upgrading CakePHP"
description: "Upgrade CakePHP versions: follow migration guides for each release, understand breaking changes, and smoothly transition between versions."
---

# Migration Guides

Migration guides contain information regarding the new features introduced in
each version and the migration path between major and minor releases.

## Upgrade Tool

CakePHP provides an [upgrade tool](https://github.com/cakephp/upgrade) that
automates many code changes using [Rector](https://getrector.com/). The tool
has rulesets for each minor version to help automate tedious code changes like
method renames and signature updates.

To use the upgrade tool:

```bash
# Install the upgrade tool
git clone https://github.com/cakephp/upgrade
cd upgrade
git checkout 6.x
composer install --no-dev

# Run rector with the desired ruleset
bin/cake upgrade rector --rules cakephp60 <path/to/app/src>
```

Run rector before updating your `composer.json` dependencies
to ensure the tool can resolve class names correctly.

- [6.0 Upgrade Guide](6-0-upgrade-guide)
- [6.0 Migration Guide](6-0-migration-guide)
- [PHPUnit Upgrade](phpunit-upgrade)
