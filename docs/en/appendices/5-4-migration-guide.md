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

### Console

Running `bin/cake` without providing a command name no longer displays the
"No command provided" error message. Instead, the `help` command is shown
directly.

The `help` command is now hidden from command listings (via
`CommandHiddenInterface`). It remains accessible by running `bin/cake help` or
`bin/cake help <command>`.

The CakePHP version header in help output is now only shown when the CakePHP
version can be determined. When used outside a CakePHP application (where the
version is reported as `unknown`), the header is omitted.

### I18n

- `Number::parseFloat()` now returns `null` instead of `0.0` when parsing
  fails. This also affects `FloatType` and `DecimalType` database types.

### ORM

- The default eager loading strategy for `HasMany` and `BelongsToMany` associations
  has changed from `select` to `subquery`. If you need the previous behavior,
  explicitly set `'strategy' => 'select'` when defining associations.

### Controller

- Loading a component with the same alias as the controller's default table now
  triggers a warning. See [Component Alias Conflicts](../controllers/components#component-alias-conflicts).

## Deprecations

### Command Helpers

- Command helpers under the `Cake\Command\Helper` namespace have been deprecated.
  Instead they have been moved under the `Cake\Console\Helper` namespace.

### Mailer

- The `Mailer::$name` property is unused and has been deprecated.

## New Features

### Core

- `PluginConfig::getInstalledPlugins()` was added to retrieve a list of all installed plugins
  including flags to indicate about their scope and state.
- A backwards compatible Container implementation has been added to the core. You can opt-in to use it instead of the current
  `league/container` implementation by setting `App.container` to `cake` inside your `config/app.php`.
  See [Dependency Injection Container](../development/dependency-injection) for more details.

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

### Database

- Added `notBetween()` method for `NOT BETWEEN` expressions.
  See [Query Builder](../orm/query-builder#advanced-conditions).
- Added `inOrNull()` and `notInOrNull()` methods for combining `IN` conditions with `IS NULL`.
- Added `isDistinctFrom()` and `isNotDistinctFrom()` methods for null-safe comparisons.

### Http

- Added PSR-13 Link implementation with `Cake\Http\Link\Link` and `Cake\Http\Link\LinkProvider`
  classes for hypermedia link support. Links added to responses are automatically emitted
  as HTTP `Link` headers. See [Hypermedia Links](../controllers/request-response#hypermedia-links).

### I18n

- `Number::toReadableSize()` now uses decimal units (KB = 1000 bytes) by default.
  Binary units (KiB = 1024 bytes) can be enabled via parameter or `Number::setUseIecUnits()`.

### ORM

- The `associated` option in `newEntity()` and `patchEntity()` now supports
  nested array format matching `contain()` syntax.
  See [Converting Request Data into Entities](../orm/saving-data#converting-request-data-into-entities).

### Testsuite

- `TestCase::mockModel()` has been added to allow mocking of model classes in tests using Mockery mocks.

### Utility

- Added `Cake\Utility\Fs\Finder` class for fluent file discovery with pattern matching,
  depth control, and custom filters. Added `Cake\Utility\Fs\Path` for cross-platform
  path manipulation. See [Filesystem Utilities](../core-libraries/filesystem.md).
- `Security::encrypt()` can now be configured to use longer keys with separate encryption and authentication keys that are derived from the provided key.
  You can set `Security.encryptWithRawKey` to enable this behavior. See [here](https://github.com/cakephp/cakephp/pull/19325) for more details.

### View

- Added `{{inputId}}` template variable to `inputContainer` and `error` templates
  in FormHelper. See [Built-in Template Variables](../views/helpers/form#built-in-template-variables).
