# 3.9 Migration Guide

CakePHP 3.9 is an API compatible upgrade from 3.8. This page outlines the
changes and improvements made.

To upgrade to 3.9.x run the following composer command:

``` bash
php composer.phar require --update-with-dependencies "cakephp/cakephp:3.9.*"
```

## Deprecations

- `ConsoleIo::info()`, `success()`, `warning()` and `error()` will no
  longer accept `null` values in the `message` parameter in 4.0.
- Using a comma separated string for `$fixtures` in test cases is deprecated.
  Instead use an array, or implement the new `getFixtures()` method on your
  test case classes.
- `Validator::errors()` was renamed to `Validator::validate()`.
- `FormHelper::create()` now emits deprecation warnings when the `$context`
  parameter is a boolean or string. These values trigger fatal errors in 4.0 and
  will need to be updated before upgrading.
- The magic method signature for `FunctionBuilder::cast([...])` is deprecated.
  Use `FunctionBuilder::cast('field', 'type')` instead.
- Abandoned `zendframework` package has been replaced with [laminas](https://github.com/laminas/laminas-diactoros)
  which provides backwards-compatible classes.

## New Features

### Cache

- `MemcachedEngine::write()` and `add()` no longer cap duration to 30 days.
  Instead all expiration values are forwarded to memcache.

### Console

- `ConsoleIo::abort()` was added.
- Command classes can implement the `defaultName()` method to overwrite the
  conventions based CLI name.

### Database

- `Driver::newTableSchema()` was added. This hook method lets you customize
  which the class used for schema metadata.
- `FunctionBuilder::cast()` was added.
- `Query::orderAsc()` and `Query::orderDesc()` now accept Closure's as their
  field enabling you to use build complex order expressions with the provided
  `QueryExpression` object.

### Datasource

- `Cake\Datasource\SimplePaginator` was added. This class makes paginating
  very large results more efficient. It skips running the potentially expensive
  `count()` query. If you only use 'next' and 'previous' navigation in
  your pagination controls this class can be a good solution.

### Http

- `Cake\Http\Client\Response::isSuccess()` was backported from 4.0
- `Cake\Http\Middleware\CspMiddleware` was backported from 4.0
- `BaseApplication::addOptionalPlugin()` was added. This method handles
  loading plugins, and handling errors for plugins that may not exist because
  they are dev dependencies.

### I18n

- `Number::FORMAT_CURRENCY_ACCOUNTING` was added.
- `Number::CURRENCY_ACCOUNTING` was added.
- `Number::getDefaultCurrencyFormat()` and
  `Number::setDefaultCurrencyFormat()` were added. These methods let you
  define the formatting style for currency values.
- The `setJsonEncodeFormat` method on `Time`, `FrozenTime`, `Date` and
  `FrozenDate` now accepts a callable that can be used to return a custom
  string.
- The i18n global functions now only return strings. The changes made to 4.0 to
  remove the null return value when no translation string is provide have been
  backported to 3.9.
- Lenient parsing can be disabled for `parseDateTime()` and `parseDate()` using
  `disableLenientParsing()`. The default is enabled - the same as IntlDateFormatter.

### ORM

- `Table::saveManyOrFail()` method has been added that will throw `PersistenceFailedException`
  with the specific entity that failed in case of an error. The entities are saved within a transaction.
- `Table::deleteMany()` and `Table::deleteManyOrFail()` methods have been added for removing many
  entities at once including callbacks. The entities are removed within a transaction.
- `TableLocator::clear()` now resets the internal `options` array.
- BelongsToMany associations now respect the bindingKey set in the junction table's BelongsTo association.
  Previously, the target table's primary key was always used instead.
- `Query::clearResult()` was added. This method lets you remove the result
  from a query so you can re-execute it.

### TestSuite

- `TestCase::getFixtures()` was added. This method lets you generate your
  fixture list using application specific logic if necessary.
- `TestSuite\EmailTrait::assertMailContainsAttachment()` was added.

### Utility

- `Hash::combine()` now accepts `null` for the `$keyPath` parameter.
  Providing null will result in a numerically indexed output array.
- `Hash::sort()` now accepts the `SORT_ASC` and `SORT_DESC` constants in the direction parameter.
- `Text::uuid()` now uses `random_int()` with PHP 5.6 insted of `mt_rand()`.
  This adds a dependency on paragonie/random_compat which implements it for PHP 5.6.

### Validation

- The 'empty' field detection in `Validator` now considers
  `UploadedFileInterface` objects that have `UPLOAD_ERR_NO_FILE` as their
  error code to be empty.
- `Validation::notAlphaNumeric()` and `Validator::notAlphaNumeric()` were
  backported from 4.x.
- `Validation::asciiAlphaNumeric()` and `Validator::asciiAlphaNumeric()`
  were backported from 4.x.
- `Validation::notAsciiAlphaNumeric()` and
  `Validator::notAsciiAlphaNumeric()` were backported from 4.x.

### View

- `FormHelper` had the `selectedClass` template variable added. This template
  key controls the class name used when a radio or checkbox is selected.
- `TextHelper::slug()` was backported from 4.0.
