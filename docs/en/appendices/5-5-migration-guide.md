# 5.5 Migration Guide

The 5.5.0 release is backwards compatible with 5.0. It adds new functionality
and introduces new deprecations. Any functionality deprecated in 5.x will be
removed in 6.0.0.

## Upgrade Tool

The [upgrade tool](../appendices/migration-guides) provides rector rules for
automating some of the migration work. Run rector before updating your
`composer.json` dependencies:

```text
bin/cake upgrade rector --rules cakephp55 <path/to/app/src>
```

## Behavior Changes

### Database

- Expressions created with `FunctionsBuilder::concat()` now use `CONCAT()` with
  postgres instead of the `||` operator.

## Deprecations

Coming soon

## New Features

Coming soon
