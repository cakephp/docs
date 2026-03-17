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

### I18n

- `Number::toReadableSize()` now calculates decimal units (KB, MB, GB and TB)
using an exponent of ten, meaning that 1 KB is 1000 Bytes. The units from the
previous calculation method, where 1024 Bytes equaled 1 KB, have been changed
to KiB, MiB, GiB, and TiB as defined in ISO/IEC 80000-13. It is possible to
switch between the two units using a new optional boolean parameter in
`Number::toReadableSize()`, as well as the new global setter `Number::setUseIecUnits()`.

### Utility

- New `Cake\Utility\Fs\Finder` class provides a fluent, iterator-based API for
  discovering files and directories with support for pattern matching, depth
  control, and custom filters. The `Cake\Utility\Fs\Path` class offers
  cross-platform utilities for path manipulation.
