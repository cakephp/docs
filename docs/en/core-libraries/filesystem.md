# Filesystem

CakePHP provides filesystem utilities for working with files and directories efficiently.
These utilities are split into two main classes:

- **Finder** - A fluent, iterator-based API for discovering files and directories
- **Path** - Static utilities for path manipulation

## Finder

`class` Cake\\Utility\\Fs\\**Finder**

The `Finder` class provides a lazy, iterator-based approach to discovering files and directories
with a fluent interface for building complex queries. It's memory-efficient and works consistently
across different operating systems.

### Available Methods

#### Location & Type

`method` Cake\\Utility\\Fs\\Finder::**in**(string $directory)

`method` Cake\\Utility\\Fs\\Finder::**files**()

`method` Cake\\Utility\\Fs\\Finder::**directories**()

`method` Cake\\Utility\\Fs\\Finder::**all**()

`method` Cake\\Utility\\Fs\\Finder::**recursive**(bool $recursive = true)

#### Filtering by Name

`method` Cake\\Utility\\Fs\\Finder::**name**(string $pattern)

`method` Cake\\Utility\\Fs\\Finder::**notName**(string $pattern)

#### Filtering by Path

`method` Cake\\Utility\\Fs\\Finder::**path**(string $pattern)

`method` Cake\\Utility\\Fs\\Finder::**notPath**(string $pattern)

`method` Cake\\Utility\\Fs\\Finder::**pattern**(string $globPattern)

`method` Cake\\Utility\\Fs\\Finder::**exclude**(string $directory)

#### Depth Control

`method` Cake\\Utility\\Fs\\Finder::**depth**(int $depth, DepthOperator $operator = DepthOperator::EQUAL)

#### Custom Filtering

`method` Cake\\Utility\\Fs\\Finder::**filter**(callable $callback)

`method` Cake\\Utility\\Fs\\Finder::**ignoreHiddenFiles**()

### Basic Usage

#### Finding Files and Directories

Find all PHP files in a directory:

``` php
use Cake\Utility\Fs\Finder;

$finder = (new Finder())
    ->in('src')
    ->name('*.php')
    ->files();

foreach ($files as $file) {
    echo $file->getPathname();
}
```

Find directories while excluding certain ones:

``` php
$directories = (new Finder())
    ->in('src')
    ->exclude('vendor')
    ->exclude('tmp')
    ->directories();
```

By default, the Finder searches recursively. Use `recursive(false)` for top-level only:

``` php
$finder = (new Finder())
    ->in('src')
    ->recursive(false)
    ->files();
```

### Filtering Examples

#### By Filename Pattern

Include and exclude specific filename patterns:

``` php
$finder = (new Finder())
    ->in('src')
    ->name('*.php')              // Include all PHP files
    ->notName('*Test.php')       // Exclude test files
    ->notName('*Fixture.php')    // Exclude fixtures
    ->files();
```

#### By Path Pattern

Filter by path containing specific strings or regex patterns:

``` php
$finder = (new Finder())
    ->in('src')
    ->path('Controller')                    // Include paths containing "Controller"
    ->notPath('Test')                       // Exclude paths containing "Test"
    ->path('/Controller\.php$/')            // Or use regex patterns
    ->files();
```

#### By Depth

Control traversal depth using type-safe operators:

``` php
use Cake\Utility\Fs\Enum\DepthOperator;

// Maximum depth of 3
$finder = (new Finder())
    ->in('src')
    ->depth(3, DepthOperator::LESS_THAN)
    ->files();

// Depth range (1, 2, or 3)
$finder = (new Finder())
    ->in('src')
    ->depth(0, DepthOperator::GREATER_THAN)
    ->depth(4, DepthOperator::LESS_THAN)
    ->files();
```

Available depth operators: `EQUAL`, `NOT_EQUAL`, `LESS_THAN`, `GREATER_THAN`,
`LESS_THAN_OR_EQUAL`, `GREATER_THAN_OR_EQUAL`.

#### Using Glob Patterns

Use glob patterns with `**` for recursive matching:

``` php
$finder = (new Finder())
    ->in('.')
    ->pattern('src/**/*Controller.php')
    ->pattern('tests/**/*Test.php')
    ->files();
```

Glob syntax: `*` matches any characters except `/`, `**` matches including `/`,
`?` matches single character, `[abc]` matches any character in set.

#### Custom Filters

For complex filtering, use custom callbacks:

``` php
use SplFileInfo;

$finder = (new Finder())
    ->in('src')
    ->filter(fn(SplFileInfo $file) => $file->getSize() > 1024)
    ->filter(fn(SplFileInfo $file) => $file->getMTime() > strtotime('-1 week'))
    ->files();
```

The callback receives `SplFileInfo` and the relative path:

``` php
$finder = (new Finder())
    ->in('.')
    ->filter(function (SplFileInfo $file, string $relativePath) {
        return str_starts_with($relativePath, 'src/Controller')
            || str_starts_with($relativePath, 'src/Model');
    })
    ->files();
```

### Complete Example

Combining multiple filters:

``` php
use Cake\Utility\Fs\Finder;
use Cake\Utility\Fs\Enum\DepthOperator;

$finder = (new Finder())
    ->in('src')
    ->in('plugins')
    ->name('*.php')
    ->notName('*Test.php')
    ->exclude('vendor')
    ->exclude('tmp')
    ->path('Controller')
    ->depth(5, DepthOperator::LESS_THAN)
    ->ignoreHiddenFiles()
    ->files();

foreach ($finder as $file) {
    echo $file->getRealPath() . PHP_EOL;
}
```

## Path

`class` Cake\\Utility\\Fs\\**Path**

The `Path` class provides static utilities for path manipulation.

### Available Methods

`static` Cake\\Utility\\Fs\\Path::**normalize**(string $path)

Convert paths to use forward slashes.

`static` Cake\\Utility\\Fs\\Path::**makeRelative**(string $path, string $base)

Convert an absolute path to a relative path based on a base directory.

`static` Cake\\Utility\\Fs\\Path::**join**(string ...$segments)

Join multiple path segments into a single path.

`static` Cake\\Utility\\Fs\\Path::**matches**(string $pattern, string $path)

Test if a path matches a glob pattern. Supports `*`, `**`, `?`, and `[abc]` syntax.

### Examples

``` php
use Cake\Utility\Fs\Path;

// Normalize path separators
Path::normalize('path\\to\\file.php');
// Returns: 'path/to/file.php'

// Make relative paths
Path::makeRelative('/var/www/app/src/Controller/UsersController.php', '/var/www/app');
// Returns: 'src/Controller/UsersController.php'

// Join path segments
Path::join('src', 'Controller', 'UsersController.php');
// Returns: 'src/Controller/UsersController.php'

// Match glob patterns
Path::matches('*.php', 'test.php');                                      // true
Path::matches('src/**/*.php', 'src/Controller/UsersController.php');    // true
Path::matches('src/**/Test/*.php', 'src/Controller/UsersController.php'); // false
```
