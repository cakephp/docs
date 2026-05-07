---
title: "Attribute Resolver"
description: "Discover and query PHP attributes across your application with CakePHP's AttributeResolver: configure scanning paths, filter by attribute type or class, cache results, and use console commands for inspection."
---

# Attribute Resolver

`class` Cake\\AttributeResolver\\**AttributeResolver**

The `AttributeResolver` is a static class that scans PHP files in configured
paths, discovers all PHP attributes applied to classes, methods, properties,
parameters, and constants, and makes them available for efficient querying.

Attribute routing uses `AttributeResolver` under the hood, but it is also a
general-purpose tool. You can use it to build your own attribute-driven systems,
such as event listener discovery, dependency injection metadata, or custom
annotation processors.

::: info Added in version 6.0.0
The Attribute Resolver was added.
:::

## Configuration

Resolver configurations can be defined in **config/app.php** under an
`'AttributeResolver'` key:

```php
// config/app.php
return [
    // ...other config...
    'AttributeResolver' => [
        'default' => [
            'paths' => [
                'Controller/*Controller.php',
                'Controller/**/*Controller.php',
            ],
            'basePath' => APP,
            'cache' => '_cake_attributes_',
        ],
    ],
];
```

Then load the configuration in your application bootstrap:

```php
// In config/bootstrap.php or Application::bootstrap()
use Cake\AttributeResolver\AttributeResolver;
use Cake\Core\Configure;

AttributeResolver::setConfig(Configure::read('AttributeResolver'));
```

Alternatively, you can define configurations inline in bootstrap without using
**config/app.php**:

```php
use Cake\AttributeResolver\AttributeResolver;

AttributeResolver::setConfig('default', [
    'paths' => [
        'Controller/*Controller.php',
        'Controller/**/*Controller.php',
    ],
    'basePath' => APP,
    'cache' => '_cake_attributes_',
]);
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `paths` | `string[]` | `[]` | Glob patterns of PHP files to scan, relative to `basePath`. |
| `basePath` | `string` | `APP` | Absolute directory path that `paths` patterns are relative to. |
| `excludePaths` | `string[]` | `[]` | Glob patterns of paths to skip during scanning. |
| `excludeAttributes` | `string[]` | `[]` | Fully-qualified attribute class names to ignore. |
| `cache` | `string\|false` | `false` | Cache configuration name to use. Set to `false` to disable caching. |
| `validateFiles` | `bool` | `false` | When `true`, re-scan if any scanned file has been modified since the cache was written. |

#### `paths`

Patterns are relative to `basePath` and support standard PHP glob syntax. Use
`**` for recursive directory matching:

```php
'paths' => [
    'Controller/*Controller.php',             // Top-level controllers
    'Controller/**/*Controller.php',          // Nested (e.g. prefixes)
    'Model/Table/*Table.php',                 // Table classes
],
```

#### `excludePaths`

Exclude specific subdirectories or files from scanning. Patterns follow the same
rules as `paths`:

```php
'excludePaths' => [
    'Controller/Admin/*Controller.php',
],
```

#### `excludeAttributes`

Prevent specific attribute classes from being indexed. Useful when third-party
attributes you don't own would otherwise pollute your queries:

```php
'excludeAttributes' => [
    SomeThirdParty\Attribute\IgnoreThis::class,
],
```

#### `cache` and `validateFiles`

Caching is strongly recommended for production. The resolver stores its results
using the CakePHP cache layer. The recommended engine is `PhpEngine`, which
stores data as executable PHP files that OPcache compiles into shared memory for
near-zero-cost reads. See
[PhpEngine Options](../core-libraries/caching#caching-phpengine) for
configuration details.

Configure the `_cake_attributes_` cache engine in **config/app.php**:

```php
// config/app.php
use Cake\Cache\Engine\PhpEngine;

'Cache' => [
    '_cake_attributes_' => [
        'className' => PhpEngine::class,
        'prefix' => 'myapp_attributes_',
        'path' => CACHE . 'attributes' . DS,
        'duration' => 0,            // 0 = indefinite; clear at deploy time
    ],
],
```

Set `validateFiles` to `true` during development to automatically detect file
changes without manually clearing the cache. This adds file `mtime` checks on
each request and should be `false` in production:

```php
use Cake\Core\Configure;

AttributeResolver::setConfig('default', [
    'paths' => ['Controller/**/*Controller.php'],
    'basePath' => APP,
    'cache' => '_cake_attributes_',
    'validateFiles' => Configure::read('debug'),
]);
```

## Querying Attributes

Call `AttributeResolver::collection()` to get a filterable
`AttributeCollection`. On first call the resolver scans the configured paths and
builds the index; subsequent calls return the cached result.

```php
use Cake\AttributeResolver\AttributeResolver;
use App\Attribute\MyAttribute;

$collection = AttributeResolver::collection();
```

You can also call filter methods directly on `AttributeResolver` without
`collection()`. The call is forwarded to the `'default'` configuration:

```php
// Equivalent to AttributeResolver::collection()->withAttribute(MyAttribute::class)
$results = AttributeResolver::withAttribute(MyAttribute::class)->toArray();
```

### Using a Named Configuration

Pass the configuration name to `collection()` to query a non-default resolver:

```php
$collection = AttributeResolver::collection('controllers');
```

## Filtering Collections

`class` Cake\\AttributeResolver\\**AttributeCollection**

`AttributeCollection` provides a fluent, chainable API for narrowing results.
Each filter method returns a new collection; the original is unchanged:

```php
use Cake\AttributeResolver\AttributeResolver;
use Cake\AttributeResolver\Enum\AttributeTargetType;
use App\Attribute\MyAttribute;

$results = AttributeResolver::collection()
    ->withAttribute(MyAttribute::class)
    ->withTargetType(AttributeTargetType::METHOD)
    ->toArray();
```

### Filter Methods

#### `withAttribute(string|array $names)`

Restrict results to attributes whose class name exactly matches one of the given
names:

```php
$collection->withAttribute(MyAttribute::class);
$collection->withAttribute([RouteAttribute::class, GetAttribute::class]);
```

#### `withAttributeContains(string $search)`

Filter by a partial attribute class name match:

```php
// Matches any attribute whose class name contains 'Route'
$collection->withAttributeContains('Route');
```

#### `withNamespace(string $pattern)`

Filter by a namespace glob pattern. Use `*` as a wildcard:

```php
// All attributes in the App\Routing namespace
$collection->withNamespace('App\Routing\*');
```

#### `withClassName(string|array $names)`

Restrict to attributes found on a specific class or set of classes:

```php
$collection->withClassName(ArticlesController::class);
```

#### `withClassNameContains(string $search)`

Filter by a partial class name match:

```php
$collection->withClassNameContains('Controller');
```

#### `withTargetType(AttributeTargetType|array $types)`

Filter by what PHP construct the attribute is applied to:

```php
use Cake\AttributeResolver\Enum\AttributeTargetType;

$collection->withTargetType(AttributeTargetType::METHOD);
$collection->withTargetType([AttributeTargetType::CLASS_, AttributeTargetType::METHOD]);
```

Available target types:

| Value | Constant | Meaning |
|-------|----------|---------|
| `'class'` | `AttributeTargetType::CLASS_` | Applied to a class declaration |
| `'method'` | `AttributeTargetType::METHOD` | Applied to a method |
| `'property'` | `AttributeTargetType::PROPERTY` | Applied to a property |
| `'parameter'` | `AttributeTargetType::PARAMETER` | Applied to a function/method parameter |
| `'constant'` | `AttributeTargetType::CONSTANT` | Applied to a class constant |

#### `withPlugin(?string $pluginName)`

Restrict results to attributes discovered in a specific plugin. Pass `null` to
return only application-level attributes:

```php
$collection->withPlugin('MyPlugin');
$collection->withPlugin(null); // App-level only
```

#### `filter(Closure $callback)`

Apply an arbitrary filter when none of the built-in methods fit. The closure
receives an `AttributeInfo` instance and must return `bool`:

```php
use Cake\AttributeResolver\ValueObject\AttributeInfo;

$collection->filter(fn(AttributeInfo $info): bool =>
    count($info->arguments) > 0
);
```

### Materializing Results

| Method | Return type | Description |
|--------|-------------|-------------|
| `toArray()` | `AttributeInfo[]` | All matching `AttributeInfo` objects |
| `toList()` | `AttributeInfo[]` | Alias for `toArray()` |
| `first()` | `?AttributeInfo` | First matching result, or `null` |
| `count()` | `int` | Number of matching results |

`AttributeCollection` also implements `IteratorAggregate`, so you can use it
directly in a `foreach`:

```php
foreach (AttributeResolver::collection()->withAttribute(MyAttribute::class) as $info) {
    // $info is an AttributeInfo instance
}
```

## The AttributeInfo Value Object

`class` Cake\\AttributeResolver\\ValueObject\\**AttributeInfo**

Each result from a collection is an `AttributeInfo` readonly value object with
the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `className` | `string` | FQCN of the class where the attribute was found |
| `attributeName` | `string` | FQCN of the attribute class |
| `arguments` | `array` | Arguments passed to the attribute constructor |
| `filePath` | `string` | Absolute path to the PHP file |
| `lineNumber` | `int` | Line number of the attribute declaration |
| `target` | `AttributeTarget` | Metadata about what the attribute is applied to |
| `fileTime` | `int` | Unix timestamp of the file's last modification |
| `pluginName` | `?string` | Plugin name, or `null` for application code |

### `getInstance(?string $expectedClass = null): object`

Instantiates the actual attribute object using its stored arguments. Optionally
pass the expected class name to validate the type:

```php
$info = AttributeResolver::collection()
    ->withAttribute(MyAttribute::class)
    ->first();

if ($info !== null) {
    $attr = $info->getInstance(MyAttribute::class);
    // $attr is an instance of MyAttribute
}
```

### The AttributeTarget Value Object

`class` Cake\\AttributeResolver\\ValueObject\\**AttributeTarget**

The `target` property of `AttributeInfo` describes the PHP construct the
attribute was applied to:

| Property | Type | Description |
|----------|------|-------------|
| `type` | `AttributeTargetType` | `class`, `method`, `property`, `parameter`, or `constant` |
| `name` | `string` | Name of the method, property, parameter, or constant. Empty for class targets. |
| `declaringClass` | `string` | FQCN of the class that declares this target |
| `isDeclaringClassAbstract` | `bool` | Whether the declaring class is abstract |
| `declaringClassType` | `DeclaringClassType` | `class`, `interface`, `trait`, or `enum` |
| `methodVisibility` | `?MethodVisibility` | Visibility for method targets; `null` otherwise |

## Multiple Configurations

You can define more than one resolver configuration to scan different sets of
paths independently:

```php
// Bootstrap
AttributeResolver::setConfig('controllers', [
    'paths' => ['Controller/**/*Controller.php'],
    'basePath' => APP,
    'cache' => '_cake_attributes_',
]);

AttributeResolver::setConfig('models', [
    'paths' => ['Model/Table/*Table.php'],
    'basePath' => APP,
    'cache' => '_cake_attributes_',
]);

// Query each independently
$controllerAttrs = AttributeResolver::collection('controllers');
$modelAttrs = AttributeResolver::collection('models');
```

Attribute routing uses the `'default'` configuration by default. You can pass a
different name to `connectAttributes()` if you need separate scanning settings
for routing:

```php
$routes->connectAttributes('routing');
```

## Caching and Cache Warming

Results are cached after the first scan and reused on subsequent requests.
Use `warm()` to proactively populate the cache, or `clear()` to invalidate it:

```php
// Force a fresh scan and write to cache
AttributeResolver::warm('default');

// Invalidate in-memory and persistent cache
AttributeResolver::clear('default');
```

### Warming the Cache via Console

Use the `attributes warm` command to pre-populate the cache during deployment,
so the first web request doesn't bear the scanning cost:

```bash
# Warm the default configuration
bin/cake attributes warm

# Warm a named configuration
bin/cake attributes warm --config controllers
```

If caching is disabled (`'cache' => false`), the command exits with a warning.

### Automating Cache Warming

Manually running `bin/cake attributes warm` is fine during initial setup, but
easy to forget. When the cache is stale — for example after baking a new
controller or installing a plugin that adds attributes — the resolver falls back
to a full scan on the next request, adding latency at the worst possible moment.
Automating the warm step removes that risk and keeps cache hits consistent across
all environments.

#### After Composer install or update

Add `bin/cake attributes warm` to your **composer.json** scripts so it runs
automatically whenever a package (including plugins) is installed or updated:

```json
{
    "scripts": {
        "post-install-cmd": [
            "bin/cake attributes warm"
        ],
        "post-update-cmd": [
            "bin/cake attributes warm"
        ]
    }
}
```

This ensures the attribute cache is refreshed whenever `composer install` or
`composer update` completes — covering plugin installation, removal, and version
changes.

#### After bake commands

CakePHP dispatches a `Command.afterExecute` event after every command finishes.
You can listen to this event in your **src/Application.php** to automatically
warm the cache after any `bake` command:

```php
// src/Application.php
use Cake\AttributeResolver\AttributeResolver;
use Cake\Console\BaseCommand;
use Cake\Event\EventInterface;
use Cake\Event\EventManagerInterface;

public function events(EventManagerInterface $eventManager): EventManagerInterface
{
    $eventManager->on('Command.afterExecute', function (EventInterface $event): void {
        $command = $event->getSubject();
        if (!$command instanceof BaseCommand) {
            return;
        }
        // Re-warm after any bake command
        if (str_starts_with($command->getName(), 'bake ')) {
            AttributeResolver::warm('default');
        }
    });

    return $eventManager;
}
```

## Console Commands

The attribute resolver ships three console commands for inspecting discovered
attributes from the command line.

### `attributes list`

Displays all discovered attributes in a table. Supports several filters and
output formats:

```bash
bin/cake attributes list

# Filter by attribute class (partial match)
bin/cake attributes list --attribute Route

# Filter by target class (partial match)
bin/cake attributes list --class ArticlesController

# Filter by namespace pattern (wildcard supported)
bin/cake attributes list --namespace "App\Controller\*"

# Filter by target type: class, method, property, parameter, constant
bin/cake attributes list --type method

# Filter by plugin
bin/cake attributes list --plugin MyPlugin

# Output as JSON
bin/cake attributes list --format json

# Show full class names without truncation
bin/cake attributes list --verbose
```

### `attributes inspect`

Shows detailed information for a single attribute, including its arguments and
the source location where it was declared:

```bash
bin/cake attributes inspect

# Filter by attribute class name (partial match)
bin/cake attributes inspect Route

# Filter by class name
bin/cake attributes inspect --class ArticlesController

# Use a named configuration
bin/cake attributes inspect --config controllers
```

### `attributes warm`

Warms the attribute cache:

```bash
bin/cake attributes warm

# Use a named configuration
bin/cake attributes warm --config controllers
```

## Plugin Scanning

The resolver automatically includes all loaded plugins when scanning. Plugin
files are discovered using each plugin's registered paths. Discovery respects
the following rules:

- Plugins not registered with the Plugin collection are skipped.
- Debug-only plugins are excluded when `debug` mode is off.
- CLI-only plugins are still scanned in web contexts so the cache stays
  consistent between web and CLI requests.

To restrict scanning to a single plugin's attributes, use `withPlugin()`:

```php
$pluginAttrs = AttributeResolver::collection()->withPlugin('MyPlugin');
```

## Building Custom Integrations

`AttributeResolver` is not limited to routing. Any feature that needs to
discover PHP attributes at runtime can use it. The example below finds all
methods tagged with a hypothetical `#[ListensTo]` attribute and registers them
as event listeners:

```php
namespace App\Event;

use App\Attribute\ListensTo;
use Cake\AttributeResolver\AttributeResolver;
use Cake\AttributeResolver\Enum\AttributeTargetType;
use Cake\Event\EventManager;

class AttributeListenerLoader
{
    public static function load(EventManager $manager): void
    {
        $collection = AttributeResolver::collection()
            ->withAttribute(ListensTo::class)
            ->withTargetType(AttributeTargetType::METHOD);

        foreach ($collection as $info) {
            $attribute = $info->getInstance(ListensTo::class);
            $listener = new ($info->className)();
            $manager->on($attribute->eventName, [$listener, $info->target->name]);
        }
    }
}
```

Configure the paths to include whatever classes your integration scans:

```php
AttributeResolver::setConfig('listeners', [
    'paths' => ['Listener/**/*.php'],
    'basePath' => APP,
    'cache' => '_cake_attributes_',
]);
```
