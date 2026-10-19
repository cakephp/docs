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

### ORM

- Joined association fields and contained association conditions now use the
  association name when registering column types. When the association name
  differs from the target table alias, such as when using `targetTable` or
  calling `Table::setAlias()`, fields such as datetime columns are now correctly
  converted to their PHP types instead of remaining strings.
- `Cake\ORM\Query\CommonQueryTrait::addDefaultTypes()` now accepts an optional
  second parameter, `?string $alias = null`, to register column types under a
  specific alias. It defaults to the table alias. Query subclasses overriding
  this method must add the optional parameter to their signature and pass it
  through when calling `parent::addDefaultTypes()`.

## Deprecations

Coming soon

## New Features

### Database

- `Cake\Database\Expression\JsonPathExpression` was added. This expression
  object provides a fluent interface for defining JSON path expressions.

### TestSuite

- `Cake\TestSuite\Fixture\DeleteStrategy` was added. This fixture strategy
  cleans fixtures with `DELETE` instead of `TRUNCATE` which can be more
  performant on MySQL, with the trade off of auto increment values not being
  reset between tests.
