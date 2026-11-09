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

- `Postgres` driver does not transform `CONCAT()` function expressions into `||` operations.
- `Postgres` driver does not transform `JSON_VALUE()` function expression into `JSONB_PATH_QUERY()`
  for versions 17 and newer.
- `BoolType` converts `t` to true to support how PostgreSQL returns boolean values from `JSON_VALUE()`.

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

### Http

- HTTP method overrides from `_method` or `X-Http-Method-Override` are normalized
  to uppercase. Invalid syntax and non-string values now raise
  `BadRequestException` (HTTP 400). See
  [HTTP Method Overrides](../controllers/request-response#http-method-overrides).

## Deprecations

### Database

- `Cake\Database\Driver\Mysql::isMariaDb()` is deprecated. You should upgrade to
  the dedicated MariaDb driver instead.

## New Features

### Database

- MariaDb now has a dedicated driver class. To upgrade your application change
  `mysql://` to `mariadb://` in your database connection configuration.
- MySQL `string`, `char`, `text` and `uuid` columns now support a `charset`
  option. See [MySQL Column Character Sets](../orm/schema-system#mysql-column-character-sets).
- `Cake\Database\Expression\JsonPathExpression` was added. This expression
  object provides a fluent interface for defining JSON path expressions.
- `FunctionsBuilder::jsonValue()` accepts a `returnType` parameter to allow
  setting the return type without `JosnPathExpression`. The return type from
  the path expression is used if not set.
- `FunctionsBuilder::jsonExists()` was added.

### ORM

- `Table::list()` was added. It runs the `list` finder and returns the
  executed key/value result set. See
  [Getting The List Directly](../orm/retrieving-data-and-resultsets#getting-the-list-directly).

### TestSuite

- `Cake\TestSuite\Fixture\DeleteStrategy` was added. This fixture strategy
  cleans fixtures with `DELETE` instead of `TRUNCATE` which can be more
  performant on MySQL, with the trade off of auto increment values not being
  reset between tests.
