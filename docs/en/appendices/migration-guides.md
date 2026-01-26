# Migration Guides

Migration guides contain information regarding the new features introduced in
each version and the migration path between 5.x minor releases.

## Upgrade Tool

CakePHP provides an [upgrade tool](https://github.com/cakephp/upgrade) that
automates many code changes using [Rector](https://getrector.com/). The tool
has rulesets for each minor version to help automate tedious code changes like
method renames and signature updates.

To use the upgrade tool:

``` text
# Install the upgrade tool
git clone https://github.com/cakephp/upgrade
cd upgrade
git checkout 5.x
composer install --no-dev

# Run rector with the desired ruleset
bin/cake upgrade rector --rules cakephp51 <path/to/app/src>
```

Run rector before updating your `composer.json` dependencies
to ensure the tool can resolve class names correctly.

- [5 0 Upgrade Guide](5-0-upgrade-guide)
- [5 0 Migration Guide](5-0-migration-guide)
- [5 1 Migration Guide](5-1-migration-guide)
- [5 2 Migration Guide](5-2-migration-guide)
- [5 3 Migration Guide](5-3-migration-guide)
- [5 4 Migration Guide](5-4-migration-guide)
- [Phpunit10](phpunit10)
