# 6.0 Migration Guide

CakePHP 6.0 contains breaking changes, and is not backwards compatible with 5.x.
Before attempting to upgrade to 6.0 first upgrade to 5.2+ and resolve all
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

- `Cake\Console\ConsoleOutput`  
  - `_write()` has been renamed to `writeStream()`

- `Cake\Form\Form`  
  - `_execute()` has been renamed to `process()`

- `Cake\Http\Client`  
  - `_sendRequest()` has been renamed to `processRequest()`

- `Cake\Http\ServerRequest`  
  - `_is()` has been renamed to `isType()`

- `Cake\Http\Client\Adapter\Stream`  
  - `_send()` has been renamed to `processRequest()`

- `Cake\I18n\DateFormatTrait`  
  - `_parseDateTime()` has been renamed to `processDateTime()`

- `Cake\Mailer\Transport\SmtpTransport`  
  - `_connect()` has been renamed to `connectSmtp()`
  - `_disconnect()` has been renamed to `disconnectSmtp()`

- `Cake\ORM\Table`  
  - `_saveMany()` has been renamed to `doSaveMany()`
  - `_deleteMany()` has been renamed to `doDeleteMany()`

- `Cake\ORM\Behavior\TreeBehavior`  
  - `_moveUp()` has been renamed to `doMoveUp()`
  - `_moveDown()` has been renamed to `doMoveDown()`
  - `_removeFromTree()` has been renamed to `doRemoveFromTree()`

- `Cake\ORM\Association\HasMany`  
  - `_unlink()` has been renamed to `doUnlink()`

- `Cake\ORM\Query\SelectQuery`  
  - `_decorateResults()` has been renamed to `ormDecorateResults()`
  - `_execute()` has been renamed to `ormExecute()`

- `Cake\Utility\Hash`  
  - `_filter()` has been renamed to `doFilter()`
  - `_merge()` has been renamed to `doMerge()`

- `Cake\Utility\Text`  
  - `_wordWrap()` has been renamed to `doWordWrap()`

- `Cake\Utility\Xml`  
  - `_fromArray()` has been renamed to `doFromArray()`
  - `_toArray()` has been renamed to `doToArray()`

- `Cake\View\View`  
  - `_render()` has been renamed to `renderFile()`

- `Cake\View\Helper\PaginatorHelper`  
  - `_numbers()` has been renamed to `buildNumbers()`

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
