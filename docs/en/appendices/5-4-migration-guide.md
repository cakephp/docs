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

### I18n

`Number::parseFloat()` now returns `null` instead of `0.0` when parsing
fails. This also affects `FloatType` and `DecimalType` database types.

### ORM

The default eager loading strategy for `HasMany` and `BelongsToMany` associations
has changed from `select` to `subquery`. If you need the previous behavior,
explicitly set `'strategy' => 'select'` when defining associations.

## Deprecations

- WIP

## New Features

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

### I18n

- `Number::toReadableSize()` now uses decimal units (KB = 1000 bytes) by default.
  Binary units (KiB = 1024 bytes) can be enabled via parameter or `Number::setUseIecUnits()`.

### ORM

- The `associated` option in `newEntity()` and `patchEntity()` now supports
  nested array format matching `contain()` syntax.
  See [Converting Request Data into Entities](../orm/saving-data#converting-request-data-into-entities).

### Utility

- Added `Cake\Utility\Fs\Finder` class for fluent file discovery with pattern matching,
  depth control, and custom filters. Added `Cake\Utility\Fs\Path` for cross-platform
  path manipulation.

### View

- Added `{{inputId}}` template variable to `inputContainer` and `error` templates
  in FormHelper. See [Built-in Template Variables](../views/helpers/form#built-in-template-variables).
