# Remaining Method Signatures Missing Return Types After Both PRs

After PR #8173 (scalar types, ~272 signatures) and PR #8174 (object types, 24 signatures) merge, **96 method signatures** will still be missing return types in the CakePHP 5.x documentation.

## Category 1: Fluent/Self-Returning Methods (9 signatures)

These methods return `$this` or `static` but have no declared return type in the PHP source.
**Recommended action:** Add `: static` or `: self` return type to source, then update docs.

```
Cake\Controller\Controller::addViewClasses()
Cake\Http\CorsBuilder::allowCredentials()
Cake\Http\CorsBuilder::allowHeaders(array $headers)
Cake\Http\CorsBuilder::allowMethods(array $methods)
Cake\Http\CorsBuilder::exposeHeaders(array $headers)
Cake\Http\CorsBuilder::maxAge(string|int $age)
Cake\ORM\Table::addBehavior($name, array $options = [])
Cake\View\Helper\FormHelper::unlockField($name)
Cake\Routing\RouteBuilder::setRouteClass($routeClass = null)
```

## Category 2: Methods with No Return Type in PHP Source (13 signatures)

These methods exist in source but have no return type declared.
**Recommended action:** Examine source to determine appropriate return type, add to source, then update docs.

```
Cake\Collection\Collection::each($callback)
Cake\Console\ConsoleOptionParser::addArgument($name, $params = [])
Cake\Console\ConsoleOptionParser::addArguments(array $args)
Cake\Console\ConsoleOptionParser::addOption($name, array $options = [])
Cake\Console\ConsoleOptionParser::addOptions(array $options)
Cake\Console\ConsoleOptionParser::merge($spec)
Cake\Console\ConsoleOptionParser::setDescription($text)
Cake\Console\ConsoleOptionParser::setEpilog($text)
Cake\Http\CorsBuilder::allowOrigin(array|string $domains)
Cake\Routing\RouteBuilder::fallbacks($routeClass = null)
Cake\Routing\RouteBuilder::plugin($name, $options = [], $callback)
Cake\Routing\RouteBuilder::prefix($name, $callback)
Cake\View\View::set(string $var, mixed $value)
```

## Category 3: Methods with Return Type in Source (40 signatures) ⭐

These methods **HAVE return types** in the PHP source but were NOT caught by either PR.
**Recommended action:** These are easy wins! Just add the return types to docs.

### Collection Methods (30 signatures)
All return `CollectionInterface`:

```
Cake\Collection\Collection::append(array|Traversable $items): CollectionInterface
Cake\Collection\Collection::appendItem($value, $key): CollectionInterface
Cake\Collection\Collection::buffered(): CollectionInterface
Cake\Collection\Collection::chunk($chunkSize): CollectionInterface
Cake\Collection\Collection::chunkWithKeys($chunkSize): CollectionInterface
Cake\Collection\Collection::combine($keyPath, $valuePath, $groupPath = null): CollectionInterface
Cake\Collection\Collection::compile($preserveKeys = true): CollectionInterface
Cake\Collection\Collection::countBy($callback): CollectionInterface
Cake\Collection\Collection::extract($path): CollectionInterface
Cake\Collection\Collection::filter($callback): CollectionInterface
Cake\Collection\Collection::groupBy($callback): CollectionInterface
Cake\Collection\Collection::indexBy($callback): CollectionInterface
Cake\Collection\Collection::insert($path, $items): CollectionInterface
Cake\Collection\Collection::listNested($order = 'desc', $nestingKey = 'children'): CollectionInterface
Cake\Collection\Collection::map($callback): CollectionInterface
Cake\Collection\Collection::match($conditions): CollectionInterface
Cake\Collection\Collection::nest($idPath, $parentPath, $nestingKey = 'children'): CollectionInterface
Cake\Collection\Collection::prepend($items): CollectionInterface
Cake\Collection\Collection::prependItem($value, $key): CollectionInterface
Cake\Collection\Collection::reject(callable $c): CollectionInterface
Cake\Collection\Collection::sample($length = 10): CollectionInterface
Cake\Collection\Collection::shuffle(): CollectionInterface
Cake\Collection\Collection::skip($length): CollectionInterface
Cake\Collection\Collection::sortBy($callback, $order = SORT_DESC, $sort = SORT_NUMERIC): CollectionInterface
Cake\Collection\Collection::stopWhen(callable $c): CollectionInterface
Cake\Collection\Collection::take($length, $offset): CollectionInterface
Cake\Collection\Collection::through($callback): CollectionInterface
Cake\Collection\Collection::transpose(): CollectionInterface
Cake\Collection\Collection::unfold(callable $callback): CollectionInterface
Cake\Collection\Collection::zip($items): CollectionInterface
```

### Other Methods (10 signatures)

```
Cake\Log\Log::log($msg, $level = LOG_ERR): bool
Session::check($key): bool
Session::delete($key): void
Session::destroy(): void
Session::read($key, $default = null): mixed
Session::readOrFail($key): mixed
Session::renew(): void
Session::write($key, $value): void
Debugger::getType($var): string
Hash::insert(array $data, $path, $values = null): ArrayAccess|array
```

Note: `Session` is `Cake\Http\Session`, `Debugger` is `Cake\Error\Debugger`, `Hash` is `Cake\Utility\Hash`

## Category 4: Callback Classes (1 signature)

Documentation convention for callbacks, not real CakePHP classes.
**Recommended action:** No change needed unless documentation should be updated to clarify.

```
Class::responseHeader($header = null, $value = null)
```

## Category 5: Not Found / Inherited / Potentially Deprecated (33 signatures)

These methods were not found in CakePHP 6 source. They may be:
- Inherited from third-party libraries (e.g., Chronos for DateTime)
- Defined in traits (deeper search needed)
- Deprecated or removed in CakePHP 6
- Documentation errors

**Recommended action:** Research each method to determine if it's still valid, inherited, or should be removed from docs.

### DateTime Methods (7 signatures) - Likely from Chronos
```
Cake\I18n\DateTime::isYesterday()
Cake\I18n\DateTime::isThisWeek()
Cake\I18n\DateTime::isThisMonth()
Cake\I18n\DateTime::isThisYear()
Cake\I18n\DateTime::isWithinNext($interval)
Cake\I18n\DateTime::wasWithinLast($interval)
Cake\Database\DateTimeType::setTimezone(string|\DateTimeZone|null $timezone)
```

### CacheEngine Methods (2 signatures)
```
Cake\Cache\CacheEngine::read($key)
Cake\Cache\CacheEngine::write($key, $value)
```

### HTTP Methods (3 signatures)
```
Cake\Http\Response::withBody($body)
Cake\Http\Response::withHeader($header, $value)
Cake\Http\TestSuite\Response::newClientResponse(int $code = 200, array $headers = [], string $body = '')
```

### Mailer Methods (4 signatures)
```
Cake\Mailer\Mailer::addAttachment(\Psr\Http\Message\UploadedFileInterface|string $path, ?string $name, ?string $mimetype, ?string $contentId, ?bool $contentDisposition)
Cake\Mailer\Mailer::setAttachments($attachments)
Cake\Mailer\Mailer::setEmailPattern($pattern)
Cake\Mailer\Mailer::drop($key)
```

### ORM Entity Methods (4 signatures)
```
Cake\ORM\Entity::dirty($field = null, $dirty = null)
Cake\ORM\Entity::get($field)
Cake\ORM\Entity::patch(array $fields, array $options = [])
Cake\ORM\Entity::set($field, $value = null, array $options = [])
```

### Controller Methods (3 signatures)
```
Cake\Controller\Controller::fetchModel(string|null $modelClass = null, string|null $modelType = null)
Cake\Controller\Controller::fetchTable(string $alias, array $config = [])
Cake\Controller\Controller::set(string $var, mixed $value)
```

### View Helper Methods (5 signatures)
```
Cake\View\Helper\FormHelper::password(string $fieldName, array $options)
Cake\View\Helper\FormHelper::text(string $name, array $options)
Cake\View\Helper\HtmlHelper::setTemplates(array $templates)
Cake\View\Helper\PaginatorHelper::setTemplates($templates)
Cake\View\Helper\PaginatorHelper::sortKey(string $model = null, mixed $options = [])
```

### Routing Methods (3 signatures)
```
Cake\Routing\RouteBuilder::extensions(stringnull $extensions, $merge = true)
Cake\Routing\RouteBuilder::reverse($params, $full = false)
Cake\Routing\RouteBuilder::url($url = null, $full = false)
```

### Other Methods (2 signatures)
```
Cake\Core\Configure::setConfig($name, $engine)
Cake\ORM\TableLocator::get($alias, $config)
```

---

## Summary

| Category | Count | Priority |
|----------|-------|----------|
| Fluent methods (need return type in source) | 9 | Medium |
| No return type in source (need investigation) | 13 | Medium |
| **Has return type in source (easy wins!)** | **40** | **HIGH** |
| Callback classes (documentation only) | 1 | Low |
| Not found/inherited (need research) | 33 | Low |
| **TOTAL** | **96** | |

## Recommended Next Steps

1. **Quick win:** Add the 40 signatures that already have return types in source (Category 3)
2. Add return types to the 9 fluent methods in PHP source, then update docs (Category 1)
3. Investigate and add return types to the 13 methods without declared types (Category 2)
4. Research the 33 'not found' methods to determine if inherited/deprecated/traits (Category 5)
