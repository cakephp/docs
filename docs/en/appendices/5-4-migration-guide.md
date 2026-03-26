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

``Number::parseFloat()`` now returns ``null`` instead of ``0.0`` when parsing
fails. Previously, when ``NumberFormatter::parse()`` failed it returned ``false``,
which was cast to ``0.0``. This silently converted invalid input like ``"abc"``
to ``0.0``, making it impossible to distinguish from valid ``"0"`` input.

This also affects ``FloatType`` and ``DecimalType`` database types which use
``Number::parseFloat()`` internally. Invalid locale-formatted form input will
now result in ``null`` entity values instead of ``0``.

### ORM

The default eager loading strategy for `HasMany` and `BelongsToMany` associations
has changed from ``select`` to ``subquery``. The ``subquery`` strategy performs
better for larger datasets as it avoids packet size limits from large ``WHERE IN``
clauses and reduces PHP memory usage by keeping IDs in the database.

If you need the previous behavior, you can explicitly set the strategy when
defining associations:

```php
$this->hasMany('Comments', [
    'strategy' => 'select',
]);
```

## Deprecations

- WIP

## New Features

### Controller

#### RequestToDto Attribute

A new ``#[RequestToDto]`` attribute enables automatic mapping of request data to
Data Transfer Objects in controller actions. This provides a clean way to handle
form data with type safety:

```php
use Cake\Controller\Attribute\RequestToDto;

class UsersController extends AppController
{
    public function create(#[RequestToDto] UserCreateDto $dto): void
    {
        // $dto is automatically populated from request data
        $user = $this->Users->newEntity([
            'email' => $dto->email,
            'name' => $dto->name,
        ]);
    }
}
```

Your DTO class must implement a static ``createFromArray()`` method:

```php
class UserCreateDto
{
    public function __construct(
        public string $email,
        public string $name,
    ) {
    }

    public static function createFromArray(array $data): self
    {
        return new self(
            email: $data['email'] ?? '',
            name: $data['name'] ?? '',
        );
    }
}
```

The attribute supports configuring the data source:

```php
use Cake\Controller\Attribute\Enum\RequestToDtoSource;

// Use query string parameters
public function search(
    #[RequestToDto(source: RequestToDtoSource::Query)] SearchDto $dto
): void {}

// Use POST body data
public function create(
    #[RequestToDto(source: RequestToDtoSource::Body)] CreateDto $dto
): void {}

// Merge query and body (body takes precedence)
public function update(
    #[RequestToDto(source: RequestToDtoSource::Request)] UpdateDto $dto
): void {}

// Auto-detect based on request method (default)
public function handle(
    #[RequestToDto(source: RequestToDtoSource::Auto)] DataDto $dto
): void {}
```

#### FormProtection Convenience Methods

``FormProtectionComponent`` now has convenience methods for unlocking actions
and fields:

```php
// In your controller's beforeFilter()
$this->FormProtection->unlockActions(['api', 'webhook']);
$this->FormProtection->unlockFields(['dynamic_field', 'optional_field']);

// With merge option (default is true)
$this->FormProtection->unlockActions('newAction', merge: true);
$this->FormProtection->unlockFields(['field1', 'field2'], merge: false);
```

### Database

#### Query Expression Methods

New convenience methods have been added to ``QueryExpression``:

- ``notBetween()`` for ``NOT BETWEEN`` expressions:

  ```php
  $query = $articles->find()
      ->where(function (QueryExpression $exp) {
          return $exp->notBetween('view_count', 100, 1000);
      });
  // WHERE view_count NOT BETWEEN 100 AND 1000
  ```

- ``inOrNull()`` for ``(field IN (...) OR field IS NULL)`` patterns:

  ```php
  $query = $articles->find()
      ->where(function (QueryExpression $exp) {
          return $exp->inOrNull('category_id', [1, 2, 3]);
      });
  // WHERE (category_id IN (1, 2, 3) OR category_id IS NULL)
  ```

- ``isDistinctFrom()`` and ``isNotDistinctFrom()`` for null-safe comparisons:

  ```php
  $query = $articles->find()
      ->where(function (QueryExpression $exp) {
          // True when values differ, treating NULL as a comparable value
          return $exp->isDistinctFrom('status', 'published');
      });
  // WHERE status IS DISTINCT FROM 'published'
  // MySQL uses: NOT (status <=> 'published')

  $query = $articles->find()
      ->where(function (QueryExpression $exp) {
          // True when values are equal, treating NULL = NULL as true
          return $exp->isNotDistinctFrom('category_id', null);
      });
  // WHERE category_id IS NOT DISTINCT FROM NULL
  // MySQL uses: category_id <=> NULL
  ```

### I18n

- `Number::toReadableSize()` now calculates decimal units (KB, MB, GB and TB)
using an exponent of ten, meaning that 1 KB is 1000 Bytes. The units from the
previous calculation method, where 1024 Bytes equaled 1 KB, have been changed
to KiB, MiB, GiB, and TiB as defined in ISO/IEC 80000-13. It is possible to
switch between the two units using a new optional boolean parameter in
`Number::toReadableSize()`, as well as the new global setter `Number::setUseIecUnits()`.

### ORM

#### Nested Array Format for Marshalling

The ``associated`` option in ``newEntity()`` and ``patchEntity()`` now supports
the same nested array format as ``contain()``:

```php
// Nested arrays (new in 5.4)
$entity = $articles->newEntity($data, [
    'associated' => [
        'Tags',
        'Comments' => [
            'Users',
            'Attachments',
        ],
    ],
]);

// Mixed with options
$entity = $articles->newEntity($data, [
    'associated' => [
        'Tags' => ['onlyIds' => true],
        'Comments' => [
            'Users',
            'validate' => 'special',
        ],
    ],
]);
```

CakePHP distinguishes associations from options using naming conventions:
- Association names use PascalCase (e.g., ``Users``, ``Comments``)
- Option keys use camelCase (e.g., ``onlyIds``, ``validate``)

### Utility

- New `Cake\Utility\Fs\Finder` class provides a fluent, iterator-based API for
  discovering files and directories with support for pattern matching, depth
  control, and custom filters. The `Cake\Utility\Fs\Path` class offers
  cross-platform utilities for path manipulation.

### View

#### FormHelper Template Variables

The ``inputContainer`` and ``error`` templates now receive an ``{{inputId}}``
variable containing the input element's HTML id attribute. This is useful for
generating related element IDs for ARIA attributes or custom JavaScript:

```php
$this->Form->setTemplates([
    'inputContainer' => '<div class="input {{type}}{{required}}" id="{{inputId}}-container">{{content}}</div>',
    'error' => '<div class="error" id="{{inputId}}-error">{{content}}</div>',
]);
```
