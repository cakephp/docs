# 5.3 Migration Guide

The 5.3.0 release is a backwards compatible with 5.0. It adds new functionality
and introduces new deprecations. Any functionality deprecated in 5.x will be
removed in 6.0.0.

## Upgrade Tool

The [upgrade tool](../appendices/migration-guides) provides rector rules for
automating some of the migration work. Run rector before updating your
`composer.json` dependencies:

``` text
bin/cake upgrade rector --rules cakephp53 <path/to/app/src>
```

## Upgrade to PHP 8.2

If you are not running on **PHP 8.2 or higher**, you will need to upgrade PHP before updating CakePHP.

> [!NOTE]
> CakePHP 5.3 requires **a minimum of PHP 8.2**.

## Behavior Changes

### Core

- `InstanceConfigTrait::deleteConfig()` was added. For classes using this trait,
  you can now use `$this->deleteConfig('key')` instead of `$this->setConfig('key', null)`

### Database

- `Query::with()` now accepts an array of expressions to align with other query clauses.
  This also allows clearing the expressions with an empty array.

### ORM

- `joinWith()` now asserts when the association conflicts with an existing join and will overwrite it.
  Because existing code might harmlessly ignore the join or accidentally rely on that behavior, this change is not breaking
  in production for CakePHP 5.

### Validation

- The signature of `Validator::validate(array $data, bool $newRecord = true, array $context = [])` has now a additional third parameter `$context`.
  It can be used to pass necessary context into the validation when marshalling.

### View

- The `format()` and `currency()` methods of `NumberHelper` now accept also null as input and can return any default string here.
  This allows for easier templates, in particular baked ones. Make sure to adjust any extending helper (plugin or app level) by adding that type.

## Deprecations

### Database

- `Query::newExpr()` is deprecated. Use `Query::expr()` instead.

### Form

- `Form::_execute()` is deprecated. You should rename your `_execute`
  methods to `process()` which accepts the same parameters and has the same
  return type.

### Http

- Using `$request->getParam('?')` to get the query params is deprecated.
  Use `$request->getQueryParams()` instead.

### ORM

- Calling behavior methods on table instances is now deprecated. To call
  a method of an attached behavior you need to use
  `$table->getBehavior('Sluggable')->slugify()` instead of `$table->slugify()`.
- `EntityTrait::isEmpty()` is deprecated. Use `hasValue()` instead.

### Plugin

- Loading of plugins without a plugin class is deprecated. For your existing plugins
  which don't have one, you can use the `bin/cake bake plugin MyPlugin --class-only`
  command, which will create the file `plugins/MyPlugin/src/MyPlugin.php`.

### View

- Passing an array as the first argument to `BreadcrumbsHelper::add()` and
  `BreadcrumbsHelper::prepend()` is deprecated. Use `addMany()` and
  `prependMany()` instead.

## New Features

### Cache

- Added Redis Cluster support to `RedisEngine`. Configure the `cluster` option
  with an array of server addresses to enable cluster mode.
- Several [Cache Events](../core-libraries/caching#cache-events) were added to allow monitoring the caching behavior.

### Collection

- `Collection::any()` was added to replace `Collection::some()` with a more familiar name.

### Command

- `cake plugin assets symlink` command now supports a `--relative` option to
  create relative path symlinks. This is useful when creating symlinks within
  containers that use volume mounts.
- `cake server` now supports a `--frankenphp` option that will start the
  development server with [FrankenPHP](https://frankenphp.dev/).

### Console

- Added `TreeHelper` which outputs an array as a tree such as an array of filesystem
  directories as array keys and files as lists under each directory.
- Commands can now implement `getGroup()` to customize how commands are
  grouped in `bin/cake -h` output.
- `CommandCollection::replace()` was added. This method allows you to replace
  an existing command in the collection without needing to remove and re-add it.
  This is particularly useful when using `autoDiscover` and you want to replace
  a command with a customized version.

### Core

- Added `Configure` attribute to support injecting `Configure` values into
  constructor arguments. See ref:\`configure-dependency-injection\`.

### Database

- Added support for Entra authentication to SqlServer driver.
- Added `Query::optimizerHint()` which accepts engine-specific optimizer hints.
- Added `Query::getDriver()` helper which returns the `Driver` for the current connection
  role by default.
- Added support for `year` column types in MySQL.
- Added support for `inet`, `cidr` and `macaddr` network column types to
  postgres driver.
- Added `TypeFactory::getMapped()` to retrieve the mapped class name for a specific type.
  This provides a cleaner API compared to using `TypeFactory::getMap()` with a type argument.

### Error

- `Debugger` now replaces `ROOT` with the
  `Debugger.editorBasePath` Configure value if defined. This improves
  debugging workflows within containerized environments.

### Http

- The new `RateLimitMiddleware` provides configurable rate limiting for your
  application to protect against abuse and ensure fair usage of resources. It
  supports multiple identification strategies (IP, user, route, API key),
  different rate limiting algorithms (sliding window, fixed window, token bucket),
  and advanced features like custom identifiers, request costs, and dynamic limits.
- `UnprocessableContentException` was added.

### I18n

- Added `DateTimePeriod` which wraps a php `DatePeriod` and returns `DateTime`
  instances when iterating.
- Added `DatePeriod` which wraps a php `DatePeriod` and returns `Date` instances
  when iterating.
- Added `toQuarterRange()` method to `DateTime` and `FrozenTime` classes which returns
  an array containing the start and end dates of the quarter for the given date.
- Added `Date::getTimestamp()`. This method returns an int of the date's
  timestamp.

### Mailer

- Added `Message::addAttachment()` for adding attachments to a message. Like
  other message methods, it can be accessed via the `Mailer` instance as `$mailer->addAttachment()`.

### ORM

- `Table::patchEntity()`, `Table::newEntity()`, `Marshaller::one()` and
  `Marshaller::many()` now accept a `strictFields` option that only applies
  validation to the fields listed in the `fields` option.
- Added `TableContainer` that you can register in your `Application::services()` to
  add dependency injection for your Tables.
- Added `SelectQuery::projectAs()` for projecting query results into Data
  Transfer Objects (DTOs) instead of Entity objects. DTOs provide a
  memory-efficient alternative (approximately 3x less memory than entities) for
  read-only data access. See [Dto Projection](../orm/query-builder#dto-projection).
- Added the `#[CollectionOf]` attribute for declaring the element type of
  array properties in DTOs. This enables proper hydration of nested
  associations into DTOs.

### Pagination

- Added `SortableFieldsBuilder` class enabling fluent configuration of
  sortable fields with advanced features. The `sortableFields` option now
  accepts a callable that receives a `SortableFieldsBuilder` instance,
  allowing you to map friendly sort keys to database fields with multi-column
  sorting and direction control.
- Added `SortField` class for defining sort field configurations with
  customizable default directions and locked directions (e.g.,
  `SortField::asc('price')` or `SortField::desc('created', locked: true)`).
- Added support for combined sorting keys in URLs (e.g., `?sort=title-asc` or
  `?sort=price-desc`) in addition to the traditional `?sort=field&direction=asc`
  format.

### Routing

- Added `RouteBuilder::setOptions()` method to set default route options at
  the scope level. This allows you to apply options like `_host`, `_https`,
  and `_port` to all routes within a scope without repeating them on each
  route. Options set at the scope level are inherited by nested scopes and can
  be overridden on individual routes.
- `EntityRoute` now handles enum value conversions. This enables you to use
  enum backed properties as route parameters. When an enum backed property is
  used in routing, the enum's `value` or `name` will be used.
- Added `RedirectTrait`. This trait can be used to create custom redirect route
  classes.

### TestSuite

- `assertRedirectBack()` added to assert a successful redirect has been made to the same previous URL.
- `assertRedirectBackToReferer()` added to assert a successful redirect has been made to the referer URL.
- `assertFlashMessageContains()` and `assertFlashMessageContainsAt()` were added. These methods enable
  substring matching of flash message content.
- `TestFixture::$tableAlias` was added. This property lets you define the
  table alias that will be used to load an `ORM\Table` instance for a fixture.
  This improves compatibility for schemas that do not closely follow naming conventions.

### Utility

- `Text::uuid()` now supports configurable UUID generation. You can set a custom
  UUID generator using `Configure::write('Text.uuidGenerator', $closure)` to
  integrate your own UUID generation strategy or third-party libraries.

### Validation

- `ipOrRange()` validation has has been added to check for an IP or a range (subnet).
- When validating within CakePHP marshalling context, the entity will be passed
  into the `context` argument for use inside custom validation rules. This can
  be useful when patching partially and then needing to get that data from the
  entity instead of the passed data.
- `existsInNullable()` rule has been added. This rule allows `null` values
  in nullable composite foreign keys, which is semantically correct for optional
  relationships. Use `$rules->existsInNullable(['author_id', 'site_id'], 'SiteAuthors')` instead of `existsIn()` when you want to permit null values
  in foreign keys.

### View

- `HtmlHelper::scriptStart()` and `scriptEnd()` now allow simple
  wrapping script tags (`<script>...</script>`) around inline JavaScript. This
  enables syntax highlighting in many editors to work. The wrapping script tag
  will be removed and replaced with a script tag generated by the helper.
- `FormHelper` now supports a new option `nestedCheckboxAndRadio`.
  By default, the helper generates inputs of type checkbox and radio nested
  inside their label. Setting the `nestedCheckboxAndRadio` option to `false`
  will turn off the nesting.
- `ViewBuilder::setConfigMergeStrategy()` was added to control how view options
  are merged with the View class's default configuration. Available strategies are
  `ViewBuilder::MERGE_DEEP` (recursive merge, default) and `ViewBuilder::MERGE_SHALLOW`
  (simple array merge). This is useful when you want to replace array values in view
  options rather than deep merging them.
- `ViewBuilder::getConfigMergeStrategy()` was added to retrieve the current merge
  strategy setting.
- `PaginatorHelper::limitControl()` now automatically respects the
  `maxLimit` configuration from the paginator, filtering out any limit options
  that exceed it. A new `steps` option was added to automatically generate limit
  options in multiples of a specific value (e.g., `['steps' => 10]` generates
  10, 20, 30... up to maxLimit).
- `BreadcrumbsHelper::addMany()` and `BreadcrumbsHelper::prependMany()`
  were added. These methods allow adding multiple breadcrumbs at once with support
  for shared options that apply to all crumbs.
