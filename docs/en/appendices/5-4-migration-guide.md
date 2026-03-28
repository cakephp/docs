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

### Controller

When loading a component that has the same alias as the controller's default table,
CakePHP now triggers a warning. This helps identify situations where accessing
`$this->ComponentAlias` returns the table instead of the component:

```php
class PaymentsController extends AppController
{
    public function initialize(): void
    {
        parent::initialize();
        // Triggers warning: Component alias `Payments` clashes with the default table name
        $this->loadComponent('Payments');
    }
}
```

To resolve this, either use a different component alias or set `Controller::$defaultTable`
to an empty string if the controller doesn't use a table.

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

### Http

- Added PSR-13 Link implementation with `Cake\Http\Link\Link` and `Cake\Http\Link\LinkProvider`
  classes for hypermedia link support. Links added to responses are automatically emitted
  as HTTP `Link` headers.

```php
use Cake\Http\Link\Link;

// Add links to a response
$response = $response->withLink(new Link('/api/users', 'self'));
$response = $response->withLink(
    (new Link('/api/users?page=2'))
        ->withRel('next')
        ->withAttribute('type', 'application/json'),
);

// Preload resources
$response = $response->withLink(
    (new Link('/css/app.css'))
        ->withRel('preload')
        ->withAttribute('as', 'style'),
);
```

### Utility

- Added `Cake\Utility\Fs\Finder` class for fluent file discovery with pattern matching,
  depth control, and custom filters. Added `Cake\Utility\Fs\Path` for cross-platform
  path manipulation.

### Collection

- Added `keys()` method to return a collection containing only the keys.
- Added `values()` method to return a collection of values re-indexed with consecutive integers.
- Added `implode()` method to concatenate elements into a string, with optional path extraction.
- Added `when()` and `unless()` methods for conditional method chaining.

```php
// keys() and values()
$collection = new Collection(['a' => 1, 'b' => 2]);
$collection->keys()->toList(); // ['a', 'b']
$collection->values()->toList(); // [1, 2]

// implode() with path extraction
$collection = new Collection([['name' => 'foo'], ['name' => 'bar']]);
$collection->implode(', ', 'name'); // 'foo, bar'

// Conditional chaining with when() and unless()
$collection = new Collection($items)
    ->when($shouldFilter, fn($c) => $c->filter(fn($v) => $v['active']))
    ->unless($hasDefaults, fn($c) => $c->append($defaults));
```

### View

- Added `{{inputId}}` template variable to `inputContainer` and `error` templates
  in FormHelper. See [Built-in Template Variables](../views/helpers/form#built-in-template-variables).
