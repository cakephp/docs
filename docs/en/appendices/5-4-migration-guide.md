# 5.4 Migration Guide

The 5.4.0 release is backwards compatible with 5.0. It adds new functionality
and introduces new deprecations. Any functionality deprecated in 5.x will be
removed in 6.0.0.

## Upgrade Tool

The [upgrade tool](../appendices/migration-guides) provides rector rules for
automating some of the migration work. Run rector before updating your
`composer.json` dependencies:

```text
bin/cake upgrade rector --rules cakephp54 <path/to/app/src>
```

## Behavior Changes

### Commands

- `BaseCommand::initialize()` is now being triggered **AFTER** arguments and options have been parsed.
- Command instances are now added to the event manager by default. This means, that event hook methods
like `beforeExecute` and `afterExecute` are always triggered. To avoid duplicate triggering you should remove
any existing calls attaching a command to the event manager from your app code.

### Console

Running `bin/cake` without providing a command name no longer displays the
"No command provided" error message. Instead, the `help` command is shown
directly.

Unknown tokens after a parent command with subcommands are now rejected
(e.g. `bin/cake i18n nonsense`) instead of silently invoking the parent.
See [Subcommand Validation](../console-commands/commands#subcommand-validation).

The `help` command is now hidden from command listings (via
`CommandHiddenInterface`). It remains accessible by running `bin/cake help` or
`bin/cake help <command>`.

The CakePHP version header in help output is now only shown when the CakePHP
version can be determined. When used outside a CakePHP application (where the
version is reported as `unknown`), the header is omitted.

### Events

Events being registered in either `Application::events()` or `Plugin::events()`
now work in both web and CLI contexts. It is therefore highly recommended to
move your event listeners from the `config/bootstrap.php` file to the
`eventListeners()` method in your `Application` or `Plugin` class. Use the
`events()` method when you need custom registration logic or anonymous
listeners.
See [Application and Plugin Events](../core-libraries/events#registering-event-listeners) for more details.

`Application::eventListeners()` and `Plugin::eventListeners()` were added to
register event listener classes declaratively. These listeners are resolved
through the application's dependency injection container, so they can use
constructor-injected dependencies.

`EventAwareApplicationInterface::pluginEvents()` has been deprecated. Plugin
events are now registered while each plugin is bootstrapped.

### I18n

- `Number::parseFloat()` now returns `null` instead of `0.0` when parsing
  fails. This also affects `FloatType` and `DecimalType` database types.

### ORM

- The default eager loading strategy for `HasMany` and `BelongsToMany` associations
  has changed from `select` to `subquery`. If you need the previous behavior,
  explicitly set `'strategy' => 'select'` when defining associations.
  See [Associations](../orm/associations#has-many-associations) for more details.
- `Model.afterSaveCommit` and `Model.afterDeleteCommit` events are now fired
  when `save()` or `delete()` is called inside an outer transaction. Previously,
  these events were silently suppressed. They are now deferred until the
  outermost transaction commits, and discarded on rollback.
  See [Table Objects](../orm/table-objects#aftersavecommit) for more details.
- Table methods `save()`, `delete()`, `patchEntity()`, `patchEntities()` and `loadInto()`
  will now throw an exception if the entity being passed down does not belong to the table instance.
  This will prevent accidental data corruption or deleted records. If you don't want this new behavior,
  you can disable it by calling `$this->disableEntityClassAssertion();` in your `initialize()` method.

### Controller

- Loading a component with the same alias as the controller's default table now
  triggers a warning. See [Component Alias Conflicts](../controllers/components#component-alias-conflicts).

### View

- `FormHelper` now wraps hidden form blocks (CSRF, FormProtection,
  `postLink()` / `postButton()`) with the HTML5 boolean `hidden` attribute
  instead of an inline `style="display:none;"`. This makes the default markup
  compatible with a strict Content-Security-Policy (no need for
  `style-src 'unsafe-inline'`). If you previously selected those wrappers via
  CSS (e.g. `div[style="display:none;"]`), switch to `[hidden]` or set the
  `hiddenClass` template option to opt out and emit a class instead.

## Deprecations

### Command Helpers

- Command helpers under the `Cake\Command\Helper` namespace have been deprecated.
  Instead they have been moved under the `Cake\Console\Helper` namespace.

### Mailer

- The `Mailer::$name` property is unused and has been deprecated.

### ORM

- `SelectQuery::disableHydration()` has been deprecated. Use
  [`Table::unhydratedFind()`](../orm/retrieving-data-and-resultsets#getting-arrays-instead-of-entities)
  instead, which returns an `UnhydratedSelectQuery` whose static type matches the
  array result shape. `disableHydration()` will be removed in 6.0.

## New Features

### Core

- `PluginConfig::getInstalledPlugins()` was added to retrieve a list of all installed plugins
  including flags to indicate about their scope and state.
- A backwards compatible Container implementation has been added to the core. You can opt-in to use it instead of the current
  `league/container` implementation by setting `App.container` to `cake` inside your `config/app.php`.
  See [Dependency Injection Container](../development/dependency-injection) for more details.
- Added the `Cake\Lock\Lock` facade with pluggable lock engines for Redis,
  Memcached, local files, and testing/no-op usage. See [Locking](../core-libraries/locking).

### Collection

- Added [`keys()`](../core-libraries/collections#keys) and [`values()`](../core-libraries/collections#values) methods for extracting keys or re-indexing values.
- Added [`implode()`](../core-libraries/collections#implode) method to concatenate elements into a string.
- Added [`when()`](../core-libraries/collections#when) and [`unless()`](../core-libraries/collections#unless) methods for conditional method chaining.

### Commands

- You can use `$this->io` and `$this->args` inside your commands to access input/output and argument objects
  without needing to pass them down from the `execute()` method. **This will be the default in CakePHP 6.0**
  as those arguments will be removed from the `execute()` method signature.

### Console

- Added `ConsoleHelpHeaderProviderInterface` to allow host applications to
  provide a custom header in console help output.
  See [Customizing the Help Header](../console-commands/commands#customizing-the-help-header).

### Controller

- Added `#[RequestToDto]` attribute for automatic mapping of request data to
  Data Transfer Objects in controller actions.
  See [Request to DTO Mapping](../development/dependency-injection#request-to-dto-mapping).
- Added `unlockActions()` and `unlockFields()` convenience methods to
  `FormProtectionComponent`.
  See [Form Protection Component](../controllers/components/form-protection).

### Http

- Added `JsonStreamResponse` class for memory-efficient streaming of large JSON
  datasets using generators. Supports standard JSON arrays and NDJSON formats,
  envelope structures with metadata, transform callbacks, and graceful mid-stream
  error handling. See [Streaming JSON Responses](../controllers/request-response#streaming-json-responses).

### Database

- Added `notBetween()` method for `NOT BETWEEN` expressions.
  See [Query Builder](../orm/query-builder#advanced-conditions).
- Added `inOrNull()` and `notInOrNull()` methods for combining `IN` conditions with `IS NULL`.
- Added `isDistinctFrom()` and `isNotDistinctFrom()` methods for null-safe comparisons.
- Added `FunctionsBuilder::stringAgg()` for portable string aggregation.
  Translates to `STRING_AGG` or `GROUP_CONCAT` per driver.
  See [Query Builder](../orm/query-builder#string-aggregation).
- Added `Connection::afterCommit()` to register callbacks that run after the
  outermost transaction commits. Callbacks are discarded on rollback.
  See [Database Basics](../orm/database-basics#aftercommit) for more details.
- Added `except()` and `exceptAll()` methods on `SelectQuery` for `EXCEPT`
  and `EXCEPT ALL` set operations. `EXCEPT ALL` is supported on PostgreSQL
  and recent MySQL/MariaDB versions; it is not supported on SQLite or SQL Server.
  See [Query Builder](../orm/query-builder#except).
- Added PostgreSQL index access method reflection. Non-btree indexes (`gin`,
  `gist`, `spgist`, `brin`, `hash`) are now reflected with an `accessMethod`
  field and regenerated with the correct `USING` clause. The `Index` class
  provides constants (`Index::GIN`, `Index::GIST`, `Index::SPGIST`,
  `Index::BRIN`, `Index::HASH`) for these access methods.
  See [Reading Indexes and Constraints](../orm/schema-system#reading-indexes-and-constraints).
- Added `Cake\Database\Type\EnumLabelTrait` and the
  `Cake\Database\Type\Attribute\Label` attribute. The trait provides a default
  `label()` implementation backed by the translator and the attribute lets
  individual cases override the derived label. See
  [EnumLabelTrait and the Label Attribute](../orm/database-basics#enumlabeltrait-and-the-label-attribute).
- Added `LoggedQuery::setRedactor()` to scrub sensitive values from query
  logs. Applies to `__toString()`, `getContext()`, and `jsonSerialize()`,
  so file logs, structured loggers, and anything that JSON-encodes a
  `LoggedQuery` all see the redacted shape.
  See [Redacting Sensitive Values from Query Logs](../orm/database-basics#redacting-sensitive-values-from-query-logs).

### Http

- Added PSR-13 Link implementation with `Cake\Http\Link\Link` and `Cake\Http\Link\LinkProvider`
  classes for hypermedia link support. Links added to responses are automatically emitted
  as HTTP `Link` headers. See [Hypermedia Links](../controllers/request-response#hypermedia-links).

### I18n

- `Number::toReadableSize()` now uses decimal units (KB = 1000 bytes) by default.
  Binary units (KiB = 1024 bytes) can be enabled via parameter or `Number::setUseIecUnits()`.
- Added `TranslatorRegistry::setCacheKeyPrefix()` to isolate translator caches
  per tenant when a custom loader produces different messages for the same
  domain and locale. Accepts a static string or a `Closure` resolved on every
  lookup. See [Isolating Translations Per Tenant](../core-libraries/internationalization-and-localization#isolating-translations-per-tenant).
- Added `TranslatorRegistry::clear()` to drop the in-memory translator map
  without touching the persistent cacher. Intended for long-running workers
  that switch tenants between jobs.
- Added `I18n::setCacheConfig()` to route translator persistence to a Cache
  config other than the default `_cake_translations_`.
- The `cake i18n extract` command now also extracts enum labels using the #[Label] attribute.
- Added `PluralRules::setRule()` to register a custom Gettext plural rule for
  a locale whose built-in form is missing or differs from the layout used by
  your .po/.mo files. See
  [Customizing Plural Rules](../core-libraries/internationalization-and-localization#customizing-plural-rules).

### ORM

- The `associated` option in `newEntity()` and `patchEntity()` now supports
  nested array format matching `contain()` syntax.
  See [Converting Request Data into Entities](../orm/saving-data#converting-request-data-into-entities).
- Added `Table::unhydratedFind()` and the `UnhydratedSelectQuery` class for
  type-safe non-hydrated reads. Unlike `find()->disableHydration()`, the
  returned query's static type matches its array result shape, so static
  analyzers no longer see `entity|array` on `first()`, `all()`, `toArray()`
  and iteration. See [Getting Arrays Instead of Entities](../orm/retrieving-data-and-resultsets#getting-arrays-instead-of-entities).

### Testsuite

- `TestCase::mockModel()` has been added to allow mocking of model classes in tests using Mockery mocks.

### Utility

- Added `Cake\Utility\Fs\Finder` class for fluent file discovery with pattern matching,
  depth control, and custom filters. Added `Cake\Utility\Fs\Path` for cross-platform
  path manipulation. See [Filesystem Utilities](../core-libraries/filesystem.md).
- `Security::encrypt()` can now be configured to use longer keys with separate encryption and authentication keys that are derived from the provided key.
  You can set `Security.encryptWithRawKey` to enable this behavior. See [here](https://github.com/cakephp/cakephp/pull/19325) for more details.
- Added `Text::mask()` method which masks a portion of a string with a repeated character. See [Text Masking](../core-libraries/text.md#text-masking) for more details.
- Added `Text::maskValue()` method which masks all occurrences of given substrings within a string using a repeated character. See [Text Masking](../core-libraries/text.md#text-masking) for more details.

### View

- Added `{{inputId}}` template variable to `inputContainer` and `error` templates
  in FormHelper. See [Built-in Template Variables](../views/helpers/form#built-in-template-variables).
- `FormHelper::enumOptions()` is now public. This lets you build `select`
  options from a backed enum class even when the form was created without
  an entity context. See [Creating Select Pickers](../views/helpers/form#creating-select-pickers).
