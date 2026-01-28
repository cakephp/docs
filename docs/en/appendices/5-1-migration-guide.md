# 5.1 Migration Guide

The 5.1.0 release is a backwards compatible with 5.0. It adds new functionality
and introduces new deprecations. Any functionality deprecated in 5.x will be
removed in 6.0.0.

## Upgrade Tool

The [upgrade tool](../appendices/migration-guides) provides rector rules for
automating some of the migration work. Run rector before updating your
`composer.json` dependencies:

``` text
bin/cake upgrade rector --rules cakephp51 <path/to/app/src>
```

## Behavior Changes

- Connection now creates unique read and write drivers if the keys `read` or
  `write` are present in the config regardless of values.
- FormHelper no longer generates `aria-required` attributes on input elements
  that also have the `required` attribute set. The `aria-required` attribute
  is redundant on these elements and generates HTML validation warnings. If you
  are using `aria-required` attribute in styling or scripting you'll need to
  update your application.
- Adding associations with duplicate names will now raise exceptions. You can
  use `$table->associations()->has()` to conditionally define associations if
  required.
- Text Utility and TextHelper methods around truncation and maximum length are using
  a UTF-8 character for `ellipsis` instead of `...` legacy characters.
- `TableSchema::setColumnType()` now throws an exception if the specified column
  does not exist.
- `PluginCollection::addPlugin()` now throws an exception if a plugin of the same
  name is already added.
- `TestCase::loadPlugins()` will now clear out any previously loaded plugins. So
  you must specify all plugins required for any subsequent tests.
- The hashing algorithm for `Cache` configurations that use `groups`. Any
  keys will have new group prefix hashes generated which will cause cache
  misses. Consider an incremental deploy to avoid operating on an entirely cold
  cache.
- `FormHelper::getFormProtector()` now returns `null` in addition to its
  previous types. This allows dynamic view code to run with fewer errors and
  shouldn't impact most applications.
- The default value for `valueSeparator` in `Table::findList()` is now
  a single space instead of `;`.
- `ErrorLogger` uses `Psr\Log\LogTrait` now.
- `Database\QueryCompiler::$_orderedUnion` was removed.

## Deprecations

### I18n

- The `_cake_core_` cache config key has been renamed to `_cake_translations_`.

### Mailer

- `Mailer::setMessage()` is deprecated. It has unintuitive behavior and very
  low usage.

## New Features

### Cache

- `RedisEngine` now supports a `tls` option that enables connecting to redis
  over a TLS connection. You can use the `ssl_ca`, `ssl_cert` and
  `ssl_key` options to define the TLS context for redis.

### Command

- `bin/cake plugin list` has been added to list all available plugins,
  their load configuration and version.
- Optional `Command` arguments can now have a `default` value.
- `BannerHelper` was added. This command helper can format text as a banner
  with a coloured background and padding.
- Additional default styles for `info.bg`, `warning.bg`, `error.bg` and
  `success.bg` were added to `ConsoleOutput`.

### Console

- `Arguments::getBooleanOption()` and `Arguments::getMultipleOption()` were added.
- `Arguments::getArgument()` will now raise an exception if an unknown
  argument name is provided. This helps prevent mixing up option/argument names.

### Controller

- Components can now use the DI container to have dependencies resolved and
  provided as constructor parameters just like Controllers and Commands do.

### Core

- `PluginConfig` was added. Use this class to get all available plugins, their load config and versions.
- The `toString`, `toInt`, `toBool` functions were added. They give you
  a typesafe way to cast request data or other input and return `null` when conversion fails.
- `pathCombine()` was added to help build paths without worrying about duplicate and trailing slashes.
- A new `events` hook was added to the `BaseApplication` as well as the `BasePlugin` class. This hook
  is the recommended way to register global event listeners for you application. See [Registering Listeners](../core-libraries/events#registering-event-listeners)

### Database

- Support for `point`, `linestring`, `polygon` and `geometry` types were
  added. These types are useful when working with geospatial or cartesian
  co-ordinates. Sqlite support uses text columns under the hood and lacks
  functions to manipulate data as geospatial values.
- `SelectQuery::__debugInfo()` now includes which connection role the query
  is for.
- `SelectQuery::intersect()` and `SelectQuery::intersectAll()` were added.
  These methods enable queries using `INTERSECT` and `INTERSECT ALL`
  conjunctions to be expressed.
- New supports features were added for `intersect`, `intersect-all` and
  `set-operations-order-by` features.
- The ability to fetch records without buffering which existed in 4.x has been restored.
  Methods `SelectQuery::enableBufferedResults()`, `SelectQuery::disableBufferedResults()`
  and `SelectQuery::isBufferedResultsEnabled()` have been re-added.

### Datasource

- `RulesChecker::remove()`, `removeCreate()`, `removeUpdate()`, and
  `removeDelete()` methods were added. These methods allow you to remove rules
  by name.

### Http

- `SecurityHeadersMiddleware::setPermissionsPolicy()` was added. This method
  adds the ability to define `permissions-policy` header values.
- `Client` now emits `HttpClient.beforeSend` and `HttpClient.afterSend`
  events when requests are sent. You can use these events to perform logging,
  caching or collect telemetry.
- `Http\Server::terminate()` was added. This method triggers the
  `Server.terminate` event which can be used to run logic after the response
  has been sent in fastcgi environments. In other environments the
  `Server.terminate` event runs *before* the response has been sent.

### I18n

- `Number::formatter()` and `currency()` now accept a `roundingMode`
  option to override how rounding is done.
- The `toDate`, and `toDateTime` functions were added. They give you
  a typesafe way to cast request data or other input and return `null` when
  conversion fails.

### ORM

- Setting the `preserveKeys` option on association finder queries. This can be
  used with `formatResults()` to replace association finder results with an
  associative array.
- SQLite columns with names containing `json` can now be mapped to `JsonType`.
  This is currently an opt-in feature which is enabled by setting the `ORM.mapJsonTypeForSqlite`
  configure value to `true` in your app.

### TestSuite

- CakePHP as well as the app template have been updated to use PHPUnit `^10.5.5 || ^11.1.3"`. - `ConnectionHelper` methods are now all static. This class has no state and its methods were updated to be static. - `LogTestTrait` was added. This new trait makes it easy to capture logs in your tests and make assertions on the presence or absence of log messages. - `IntegrationTestTrait::replaceRequest()` was added.

### Utility

- `Hash::insert()` and `Hash::remove()` now accept `ArrayAccess` objects along with `array` data.

### Validation

- `Validation::enum()` and `Validator::enum()` were added. These validation
  methods simplify validating backed enum values.
- `Validation::enumOnly()` and `Validation::enumExcept()` were added to check for specific cases
  and further simplify validating backed enum values.

### View

- View cells now emit events around their actions `Cell.beforeAction` and
  `Cell.afterAction`.
- `NumberHelper::format()` now accepts a `roundingMode` option to override how
  rounding is done.

### Helpers

- `TextHelper::autoLinkUrls()` has options added for better link label printing:
  - `stripProtocol`: Strips `http://` and `https://` from the beginning of the link. Default off.
  - `maxLength`: The maximum length of the link label. Default off.
  - `ellipsis`: The string to append to the end of the link label. Defaults to UTF8 version.
- `HtmlHelper::meta()` can now create a meta tag containing the current CSRF
  token using `meta('csrfToken')`.
