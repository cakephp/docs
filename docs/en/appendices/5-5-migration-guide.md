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

- `Postgres` driver does not replace `FunctionsBuilder::concat()` expressions with `||` operations.

## Deprecations

Coming soon

## New Features

### TestSuite

- `Cake\TestSuite\Fixture\DeleteStrategy` was added. This fixture strategy
  cleans fixtures with `DELETE` instead of `TRUNCATE` which can be more
  performant on MySQL, with the trade off of auto increment values not being
  reset between tests.
