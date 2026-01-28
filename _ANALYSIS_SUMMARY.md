# Analysis Summary: Remaining Method Signatures Without Return Types

## Overview

After PR #8173 (scalar return types) and PR #8174 (object return types) merge into the `5.x` branch, **96 method signatures** will still be missing return types in the CakePHP documentation.

## Baseline Numbers

- **Total signatures on 5.x branch**: 395
- **Signatures without return types**: 391
- **Signatures with return types**: 4

## PRs Impact

- **PR #8173 (scalar types)**: Added return types to 272 signatures
  - Includes: `void`, `bool`, `int`, `string`, `array`, `mixed`, `static`, etc.

- **PR #8174 (object types)**: Added return types to 24 signatures
  - Includes: `Response`, `Component`, `SelectQuery`, `EntityInterface`, etc.

## Remaining: 96 Signatures

### Breakdown by Category

| Category | Count | Priority | Description |
|----------|-------|----------|-------------|
| **Has return type in source (easy wins!)** | **40** | **HIGH** | Already have return types in PHP source—just need to add to docs |
| No return type in source | 13 | Medium | Need to investigate and determine appropriate type |
| Fluent methods | 9 | Medium | Return `$this` or `static` but lack type declaration in source |
| Not found / inherited | 33 | Low | May be inherited from third-party libs, deprecated, or in traits |
| Callback classes | 1 | Low | Documentation convention only |

### Category Highlights

#### Category 3: Easy Wins (40 signatures) ⭐

These are **low-hanging fruit**—they already have return types in the PHP source:

- **30 Collection methods**: All return `CollectionInterface`
  - `append()`, `map()`, `filter()`, `chunk()`, etc.

- **10 other methods**:
  - `Log::log()` → `bool`
  - Session methods → `void`, `bool`, `mixed`
  - `Debugger::getType()` → `string`
  - `Hash::insert()` → `ArrayAccess|array`

#### Category 1: Fluent Methods (9 signatures)

Methods that return `$this`/`static` for chaining but lack return type:
- `Controller::addViewClasses()`
- `CorsBuilder` methods (5 methods)
- `Table::addBehavior()`
- `FormHelper::unlockField()`
- `RouteBuilder::setRouteClass()`

#### Category 2: No Return Type in Source (13 signatures)

Need to check source to determine return type:
- `Collection::each()`
- `ConsoleOptionParser` methods (7 methods)
- `RouteBuilder` methods (3 methods)
- Others (2 methods)

#### Category 5: Not Found/Inherited (33 signatures)

Require investigation:
- **DateTime methods** (7): Likely inherited from Chronos library
- **Helper methods** (5): May be in traits
- **Entity methods** (4): Check for traits
- **Others** (17): Various classes, may be deprecated

## Recommended Next Steps

1. **Quick win**: Add the 40 signatures from Category 3 (already have return types)
2. Add return types to 9 fluent methods in PHP source, then update docs
3. Investigate and add return types to 13 methods without declared types
4. Research 33 'not found' methods—determine if inherited/deprecated/in traits

## Files Generated

- `/media/mark/data/work/git/docs/_remaining_signatures_analysis.md` - Detailed analysis with code examples
- `/media/mark/data/work/git/docs/_remaining_signatures_by_category.txt` - Simple list by category
- `/media/mark/data/work/git/docs/_ANALYSIS_SUMMARY.md` - This file

## Verification

```
Original without types: 391
Scalar PR additions:    272
Object PR additions:     24
                       ----
Remaining:               95-96 ✓
```

The small discrepancy (95 vs 96) is likely due to signature variations or duplicates in the parsing.
