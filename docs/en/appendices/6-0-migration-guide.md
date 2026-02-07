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

## Breaking Changes

### Renamed Methods

Methods starting with a `_` have been renamed to **remove the leading underscore**.
You can find a full list of adjusted methods in the [cakephp/upgrade tool](https://github.com/cakephp/upgrade/blob/6.x/config/rector/sets/cakephp60.php).

Some methods have also been renamed to better reflect their purpose. These are:

| Class                                 | Old Method(s)                                       | New Method(s)                                          |
|---------------------------------------|-----------------------------------------------------|--------------------------------------------------------|
| `Cake\Console\ConsoleOutput`          | `_write()`                                          | `writeStream()`                                        |
| `Cake\Form\Form`                      | `_execute()`                                        | `process()`                                            |
| `Cake\Http\Client`                    | `_sendRequest()`                                    | `processRequest()`                                     |
| `Cake\Http\ServerRequest`             | `_is()`                                             | `isType()`                                             |
| `Cake\Http\Client\Adapter\Stream`     | `_send()`                                           | `processRequest()`                                     |
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

### Datasource

- `Datasource/Paging/PaginatedInterface` now extends `IteratorAggregate`
  instead of `Traversable`.
- `EntityTrait::isEmpty()` has been dropped in favor of `hasValue()`.

### Http

- Using `$request->getParam('?')` to get the query params is no longer possible.
  Use `$request->getQueryParams()` instead.
- The methods `_getCookies()`, `_getJson()`, `_getXml()`, `_getHeaders()`
  and `_getBody()` have been removed. Use/Overwrite their non-prefixed public alternative instead.

### ORM

- The `_accessible` property inside Entities has been renamed to `patchable`
  to better reflect its purpose.
- `setAccess` method has been renamed to `setPatchable`.
- `getAccessible` method has been renamed to `getPatchable`.
- `isAccessible` method has been renamed to `isPatchable`.
- The `accessibleFields` option used in e.g. ORM Queries has been
  renamed to `patchableFields`.

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
