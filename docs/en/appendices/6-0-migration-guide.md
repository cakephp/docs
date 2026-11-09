# 6.0 Migration Guide

CakePHP 6.0 contains breaking changes, and is not backwards compatible with 5.x.
Before attempting to upgrade to 6.0 first upgrade to 5.3+ and resolve all
deprecation warnings.

## Behavior Changes

- All datasource connections require the `username`, `password` and
  `database` keys as default values have been removed to prevent accidental
  privileged user usage.
- The `ORM.mapJsonTypeForSqlite` configuration option has been removed. The
  SQLite adapter will map all columns with `json` in their names to the
  `JsonType` by default.
- `Cake\View\Widget\FileWidget` was removed as it was redundant. The standard
  input widget will be used for file inputs in 6.x.
- `Text::uuid()` now generates UUID v7 complaint strings instead of UUID v4.
- `Cake\Event\Event::getSubject()` can now return `null` if the event has no
  subject instead of throwing an exception.

- `Model.buildValidator` is now dispatched before the named validation method,
  allowing listeners to register providers used by `Validator::add()`. Listeners
  that inspect rules added by `validationDefault()` must account for this order.

- Calling behavior methods directly on the table instance is now opt-in.
  Behaviors no longer expose their public methods as mixin methods on the
  table unless they are attached with the `implementedMethods` configuration
  set to `true`, a map of `alias => method` pairs, or a list of method names.

## Breaking Changes

### Renamed Methods

Methods starting with a `_` have been renamed to **remove the leading underscore**.
You can find a full list of adjusted methods in the [cakephp/upgrade tool](https://github.com/cakephp/upgrade/blob/6.x/config/rector/sets/cakephp60.php).

Some methods have also been renamed to better reflect their purpose. These are:

| Class                                 | Old Method(s)                                       | New Method(s)                                          |
|---------------------------------------|-----------------------------------------------------|--------------------------------------------------------|
| `Cake\Collection\ExtractTrait`        | `_extract()`                                        | `extractColumn()`                                      |
| `Cake\Console\ConsoleOutput`          | `_write()`                                          | `writeStream()`                                        |
| `Cake\Form\Form`                      | `_execute()`                                        | `process()`                                            |
| `Cake\Http\Client`                    | `_sendRequest()`                                    | `processRequest()`                                     |
| `Cake\Http\ServerRequest`             | `_is()`                                             | `isType()`                                             |
| `Cake\Http\Client\Adapter\Stream`     | `_send()`                                           | `processRequest()`                                     |
| `Cake\Http\Cookie\Cookie`             | `resolveSameSiteEnum()`                             | `resolveSameSite()`                                    |
| `Cake\I18n\DateFormatTrait`           | `_parseDateTime()`                                  | `processDateTime()`                                    |
| `Cake\Mailer\Transport\SmtpTransport` | `_connect()`<br>`_disconnect()`                     | `connectSmtp()`<br>`disconnectSmtp()`                  |
| `Cake\ORM\Table`                      | `_saveMany()`<br>`_deleteMany()`                    | `doSaveMany()`<br>`doDeleteMany()`                     |
| `Cake\ORM\Behavior\TreeBehavior`      | `_moveUp()`<br>`_moveDown()`<br>`_removeFromTree()` | `doMoveUp()`<br>`doMoveDown()`<br>`doRemoveFromTree()` |
| `Cake\ORM\Association\HasMany`        | `_unlink()`                                         | `doUnlink()`                                           |
| `Cake\ORM\Query\SelectQuery`          | `_decorateResults()`<br>`_execute()`                | `ormDecorateResults()`<br>`ormExecute()`               |
| `Cake\Utility\Hash`                   | `_filter()`<br>`_merge()`                           | `doFilter()`<br>`doMerge()`                            |
| `Cake\Utility\Text`                   | `_wordWrap()`                                       | `doWordWrap()`                                         |
| `Cake\Utility\Xml`                    | `_fromArray()`<br>`_toArray()`                      | `doFromArray()`<br>`doToArray()`                       |
| `Cake\View\View`                      | `_render()`                                         | `renderFile()`                                         |
| `Cake\View\Helper\PaginatorHelper`    | `_numbers()`                                        | `buildNumbers()`                                       |

### Renamed Properties

Properties starting with a `_` have been renamed to **remove the leading underscore**.
You can find a full list of adjusted properties in the
[cakephp/upgrade tool](https://github.com/cakephp/upgrade/blob/6.x/config/rector/sets/cakephp60.php).

Some properties have also been renamed to better reflect their purpose. These are:

- `Cake\ORM\Entity`
  - `$_accessible` has been renamed to `patchable`
- `Cake\View\View`
  - `$_helpers` has been renamed to `helperRegistry` as `$helpers` already exists to hold the configuration

### Renamed Classes

- `Cake\Database\DriverFeatureEnum` has moved to `Cake\Database\Enum\DriverFeature`.
- `Cake\Http\Cookie\SameSiteEnum` has moved to `Cake\Http\Cookie\Enum\SameSite`.
- The `Cake\Command\Helper` namespace has been removed. Use the
  `Cake\Console\Helper` namespace for `BannerHelper`, `ProgressHelper`,
  `TableHelper`, and `TreeHelper`.

### Method Signatures

- All fluent methods now declare a `static` return type. Update return types
  in overridden methods and interface implementations accordingly. This affects
  methods on classes and interfaces such as `Controller`, `Table`, `EntityInterface`,
  `EventInterface`, `Mailer`, and `ViewBuilder`. The
  [upgrade tool](https://github.com/cakephp/upgrade/blob/6.x/config/rector/sets/cakephp60.php)
  contains the full list.
- The following methods now return `void`: `ServerRequest::allowMethod()`,
  `Configure::load()`, `ResponseEmitter::emit()`, `Session::close()`,
  `Table::deleteOrFail()`, `FixtureInterface::insert()` and `truncate()`,
  and `ConsoleInputArgument::validateChoice()` and
  `ConsoleInputOption::validateChoice()`. Remove assignments and conditions
  that depend on their former return values. Handle exceptions where applicable.
- The callback parameters of `CsrfProtectionMiddleware::skipCheckCallback()`,
  `SessionCsrfProtectionMiddleware::skipCheckCallback()`, `View::cache()`,
  `TestCase::withErrorReporting()`, `Table::executeTransaction()`, and
  `AttributeCollection::filter()` now require a `Closure` instead of a general
  `callable`. `ResultSetFactory::getDtoHydrator()` now returns a `Closure`.

### Console

- The `validChoice` method on `ConsoleInputArgument` and `ConsoleInputOption` has been renamed to `validateChoice`.

### Command

- Command args and io are now available as properties instead of them being
  passed down to the execute method. See the current state of
  [Commands](../console-commands/commands.md) for examples.

### Event

- The signature of `EventManagerInterface::on()` has changed. The 2nd and 3rd
  parameters have been swapped. Calls which pass an options array as the 2nd
  argument will need to be updated to pass it as the 3rd argument instead or
  use named parameters.

### Dependency Injection

- CakePHP now uses `Cake\Container\Container` by default and no longer requires
  `league/container`. Remove the old `App.container = 'cake'` config option. To use a
  custom container, set `App.container` to a class name implementing
  `Cake\Container\ContainerInterface`.
- Replace `Cake\Core\Container`, `Cake\Core\ContainerInterface` and
  `Cake\Core\ServiceProvider` with their `Cake\Container` equivalents.
- Auto-wiring and its resolution cache are enabled by default. Remove delegation
  to `League\Container\ReflectionContainer`; use `disableAutoWiring()` and
  `enableAutoWiring()` to configure the built-in resolver. See
  [Auto-wiring](../development/dependency-injection#auto-wiring) for details.
- `Container::defaultToShared()`, `enableAutoWiring()` and `disableAutoWiring()`
  return `static`. Update the return types of overrides accordingly.

### Datasource

- `Datasource/Paging/PaginatedInterface` now extends `IteratorAggregate`
  instead of `Traversable`.
- `EntityTrait::isEmpty()` has been dropped in favor of `hasValue()`.

### Database

- Operators in condition-array keys, such as `['views >' => 1000]` or
  `['id IN' => $ids]`, are no longer supported and raise an
  `InvalidArgumentException`. Use the predicate functions in
  `Cake\Database\Expression` instead. Plain equality conditions, nested boolean
  arrays, and the fluent `QueryExpression` API remain supported.

  ```php
  use function Cake\Database\Expression\{equals, greaterThan, in, notEquals};

  // Before (CakePHP 5.x)
  $query->where([
      'views >' => 1000,
      'id IN' => $ids,
      'parent_id IS' => $parentId,
      'deleted IS NOT' => null,
  ]);

  // After (CakePHP 6.x)
  $query->where([
      'views' => greaterThan(1000),
      'id' => in($ids),
      'parent_id' => equals($parentId),
      'deleted' => notEquals(null),
  ]);
  ```

  `equals()` and `notEquals()` generate `IS NULL` and `IS NOT NULL` when their
  value is `null`. Use `isNull()` and `isNotNull()` for explicit null checks.
  Predicates infer binding types from the query; pass `type:` to override them.
  The [upgrade tool](6-0-upgrade-guide#upgrade-tool-use) includes this conversion
  in its `cakephp60` rules. See
  [Predicate Functions](../orm/query-builder#predicate-functions) for the full
  function reference and examples.

- Binary columns now use `binary` for fixed-length data and `varbinary` for
  variable-length data. In migration `addColumn()` calls, remove
  `'fixed' => true` from fixed-length `binary` columns, and change variable-length
  `binary` columns to `varbinary`. The `fixed` option is no longer used;
  `TableSchemaInterface::TYPE_VARBINARY` is available for the new type.

### Error

- `Debugger::outputMask()`, `setOutputMask()` have been removed.

### Http

CakePHP now provides its own PSR-7 HTTP message implementations and no longer
requires `laminas/laminas-diactoros`. Replace direct uses of the following
Diactoros classes with their CakePHP equivalents, including in test fixtures:

| Previous class                                | Replacement                           |
|-----------------------------------------------|---------------------------------------|
| `Laminas\Diactoros\Uri`                       | `Cake\Http\Uri`                       |
| `Laminas\Diactoros\Stream`                    | `Cake\Http\Stream`                    |
| `Laminas\Diactoros\UploadedFile`              | `Cake\Http\UploadedFile`              |
| `Laminas\Diactoros\Response\RedirectResponse` | `Cake\Http\Response\RedirectResponse` |
| `Laminas\Diactoros\MessageTrait`              | `Cake\Http\MessageTrait`              |

CakePHP's PSR-17 factories now create CakePHP objects. Type against the PSR
interfaces when your code accepts multiple implementations. If your application
still uses other Diactoros classes or functions, declare
`laminas/laminas-diactoros` as a direct dependency. CakePHP also no longer requires
`laminas/laminas-httphandlerrunner`; declare it directly if your application uses it.

- `RequestFactory::createRequest()` now declares `Cake\Http\Client\Request`
  as its return type. `ResponseFactory::createResponse()` now declares
  `Cake\Http\Response`. The stream, URI, and uploaded-file factories return their
  corresponding CakePHP classes. Update overridden methods to use compatible
  return types.
- Custom HTTP client authentication strategies must implement
  `Cake\Http\Client\Auth\AuthenticationInterface`. Strategies used with the
  `proxy` option must also implement
  `Cake\Http\Client\Auth\ProxyAuthenticationInterface`. Update overrides of
  `Client::createAuth()` to return `AuthenticationInterface`. See
  [Custom Authentication Strategies](../core-libraries/httpclient#custom-authentication-strategies).
- `Client::createRequest()` now accepts `array|string|null` for its `$data`
  argument. Update the signatures of overrides accordingly.
- When following a `303` redirect, the HTTP client now changes non-`HEAD`
  requests to `GET` and removes the request body and its associated headers.
  Redirects to a different scheme, host, or port remove the original
  `Authorization` and `Cookie` headers; matching cookies from the client's cookie
  jar are then applied. Relative redirect locations are resolved against the
  current request URL. Redirect targets must use HTTP or HTTPS and have a host.
- `Client\Response` now defaults to status `200` when constructed without a
  status line. Its body constructor argument accepts a string or
  `Psr\Http\Message\StreamInterface`; a supplied stream is used as-is.
- HTTP message header mutations validate header names and values. Invalid names,
  control characters in values, and empty value arrays throw
  `InvalidArgumentException`. Use `withoutHeader()` to remove a header.
- When the HTTP client decodes a gzip response body, it removes the
  `Content-Encoding` and `Content-Length` headers so they describe the decoded
  body. Invalid gzip data raises `Cake\Core\Exception\CakeException`.
- `CallbackStream` no longer extends the Diactoros implementation. Its callback
  runs once when the contents are read, and subsequent reads return an empty
  string. It cannot be rewound or read in chunks using `read()`.
- `JsonStreamResponse` validates its options when constructed and when calling
  `withStreamOptions()`. Invalid option types or values, such as an unsupported
  `format` or a non-positive `flushEvery`, throw `InvalidArgumentException`.

- Using `$request->getParam('?')` to get the query params is no longer possible.
  Use `$request->getQueryParams()` instead.
- The methods `_getCookies()`, `_getJson()`, `_getXml()`, `_getHeaders()`
  and `_getBody()` have been removed. Use/Overwrite their non-prefixed public alternative instead.

- URL parsing now uses PHP 8.5's `Uri\WhatWg\Url` and `Uri\Rfc3986\Uri`
  parsers. Review malformed or relative URL inputs and exception handling. In
  particular, `Client::createFromUrl()` can now throw
  `Uri\WhatWg\InvalidUrlException` for inputs previously rejected with
  `InvalidArgumentException`. See
  [Creating Scoped Clients](../core-libraries/httpclient#http_client_scoped_client).

### ORM

- The `_accessible` property inside Entities has been renamed to `patchable`
  to better reflect its purpose.
- `setAccess` method has been renamed to `setPatchable`.
- `getAccessible` method has been renamed to `getPatchable`.
- `isAccessible` method has been renamed to `isPatchable`.
- The `accessibleFields` option used in e.g. ORM Queries has been
  renamed to `patchableFields`.
- `TranslateTrait::translation()` now only retrieves an existing translation
  and returns `null` when none exists. Use `getOrCreateTranslation()` if the
  previous create-on-access behavior is needed.

### Router

- `RouteBuilder` has adjusted the signature of `scope()`, `prefix()` and `resources()`
  so the 2nd and 3rd parameters have been swapped.
  We recommend using named parameters to prevent confusion and make the code more readable.

### Utility

- The default placeholder format for `Text::insert()` has been changed.
  They now use `{foo}` instead of `:foo`. You can get the old
  behavior by using the `before` and `after` keys of `$options`.

### View

- `'escape'`/`'escapeTitle'` keys have now been separated cleanly into `escape` for escaping content/labels, and
  `'escapeAttributes'` for HTML attributes respectively. They also don't overlap anymore, so if you need to prevent escaping
  on content and attributes, make sure to set them both to false.
- `title` has been renamed to `content` in scopes where this is not an attribute, but content or label element, specifically:
  `'item'`/`itemWithoutLink` breadcrumb templates.
- `multicheckboxTitle` template of FormHelper is now `multicheckboxLabel`.

- `FormHelper` now defaults `nestedCheckboxAndRadio` to `false`, placing
  checkbox and radio inputs before their labels. Set it to `true` to retain
  nesting, or use `nestedInput` on individual controls. Review CSS selectors
  that depend on the old markup.
- The default `radioWrapper` template is now
  `<div class="radio">{{input}}{{label}}</div>`. Custom wrappers must include
  `{{input}}` as well as `{{label}}` when inputs are not nested.
- Multicheckbox option labels cannot be disabled. Use an array for label
  attributes when calling `multiCheckbox()`; direct `MultiCheckboxWidget`
  callers must also pass an array for `label`.

## New Features

### Database

- Namespaced predicate functions build field-keyed conditions with bound values.
  They support comparisons, ranges, membership, null checks, and custom SQL
  operators. The returned immutable predicates can be reused across queries.
  See [Predicate Functions](../orm/query-builder#predicate-functions).

### Http

- The HTTP client supports live response bodies through the Stream adapter with
  the `stream` and `readTimeout` options. See
  [Streaming Responses](../core-libraries/httpclient#streaming-responses).
- `Client\Response::getJsonArray()` provides strict JSON array decoding, and
  `getJsonAs()` passes decoded data to an application-defined validating decoder.
  See [Reading JSON and XML Response Bodies](../core-libraries/httpclient#http-client-xml-json).

### Event

- Event subscriptions can now be declared on listener classes and methods with
  the repeatable `Cake\Event\Attribute\EventListener` attribute. Register them
  through `EventManager::registerAttributeListeners()` or
  `AttributeEventListenerConnector`, with support for constructor dependency
  injection and named event managers. See
  [Registering Listeners with Attributes](../core-libraries/events#registering-listeners-with-attributes)
  for configuration and examples.

### ORM

- Entities can now map fields to real class properties, including typed
  properties and PHP 8.4 asymmetric visibility/property hooks. When changing
  declared fields inside entity methods, continue to use `set()`/`patch()` if
  you need dirty tracking and related entity bookkeeping.

### Router

- Attribute routing is now available via `RouteBuilder::connectAttributes()` and the
  new `Cake\Routing\Attribute` namespace. Routes can be defined directly on controller
  classes and actions using PHP attributes such as `#[Get]`, `#[Post]`, `#[Scope]`,
  `#[Resource]`, and more. See [Attribute Routing](../development/attribute-routing)
  for full documentation.
