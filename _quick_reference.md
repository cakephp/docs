# Quick Reference: 96 Remaining Signatures by Priority

## HIGH PRIORITY: Category 3 - Easy Wins (40 signatures)

These already have return types in PHP source. Just add to docs!

### Collection Methods (30) - All return `CollectionInterface`
```
append, appendItem, buffered, chunk, chunkWithKeys, combine, compile, countBy,
extract, filter, groupBy, indexBy, insert, listNested, map, match, nest,
prepend, prependItem, reject, sample, shuffle, skip, sortBy, stopWhen, take,
through, transpose, unfold, zip
```

### Other Methods (10)
| Method | Return Type |
|--------|-------------|
| `Log::log()` | `bool` |
| `Session::check()` | `bool` |
| `Session::delete()` | `void` |
| `Session::destroy()` | `void` |
| `Session::read()` | `mixed` |
| `Session::readOrFail()` | `mixed` |
| `Session::renew()` | `void` |
| `Session::write()` | `void` |
| `Debugger::getType()` | `string` |
| `Hash::insert()` | `ArrayAccess\|array` |

---

## MEDIUM PRIORITY: Categories 1 & 2 (22 signatures)

### Category 1: Fluent Methods (9) - Need `static`/`self` return type

```
Controller::addViewClasses()
CorsBuilder::allowCredentials()
CorsBuilder::allowHeaders()
CorsBuilder::allowMethods()
CorsBuilder::exposeHeaders()
CorsBuilder::maxAge()
Table::addBehavior()
FormHelper::unlockField()
RouteBuilder::setRouteClass()
```

### Category 2: No Return Type in Source (13) - Need investigation

**Collection:**
- `each()`

**ConsoleOptionParser (7):**
- `addArgument()`, `addArguments()`, `addOption()`, `addOptions()`
- `merge()`, `setDescription()`, `setEpilog()`

**CorsBuilder:**
- `allowOrigin()`

**RouteBuilder (3):**
- `fallbacks()`, `plugin()`, `prefix()`

**View:**
- `set()`

---

## LOW PRIORITY: Categories 4 & 5 (34 signatures)

### Category 4: Callback Classes (1)
- `Class::responseHeader()` - Documentation convention only

### Category 5: Not Found/Inherited (33)

These need research to determine if they're inherited, deprecated, or in traits:

- **DateTime methods (7)**: Likely from Chronos library
- **Helper methods (5)**: Check traits (FormHelper, HtmlHelper, PaginatorHelper)
- **Entity methods (4)**: Check EntityTrait
- **Controller methods (3)**: Check traits (fetchTable, fetchModel, set)
- **Others (14)**: Various classes

---

## Action Plan

### Phase 1: Quick Wins (Est. 1-2 hours)
✓ Add 40 signatures that already have return types in source

### Phase 2: Fluent Methods (Est. 2-3 hours)
✓ Add return types to 9 fluent methods in PHP source
✓ Update documentation

### Phase 3: Investigation (Est. 3-4 hours)
✓ Investigate 13 methods without return types
✓ Determine and add appropriate types

### Phase 4: Research (Est. 4-6 hours)
✓ Research 33 'not found' methods
✓ Determine if inherited/deprecated/in traits
✓ Update or remove from documentation

**Total estimated effort: 10-15 hours**
