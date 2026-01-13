Filesystem
##########

.. php:namespace:: Cake\Utility\Fs

CakePHP provides filesystem utilities for working with files and directories efficiently.
These utilities are split into two main classes:

- **Finder** - A fluent, iterator-based API for discovering files and directories
- **Path** - Static utilities for path manipulation

Finder
======

.. php:class:: Finder

The ``Finder`` class provides a lazy, iterator-based approach to discovering files and directories
with a fluent interface for building complex queries. It's memory-efficient and works consistently
across different operating systems.

Available Methods
-----------------

Location & Type
~~~~~~~~~~~~~~~

.. php:method:: in(string $directory)

    Add a directory to search in. Can be called multiple times.

.. php:method:: files()

    Find only files (returns iterator).

.. php:method:: directories()

    Find only directories (returns iterator).

.. php:method:: all()

    Find both files and directories (returns iterator).

.. php:method:: recursive(bool $recursive = true)

    Enable or disable recursive directory traversal. Default is ``true``.

Filtering by Name
~~~~~~~~~~~~~~~~~

.. php:method:: name(string $pattern)

    Include files/directories matching a glob pattern. Multiple calls use OR logic.

.. php:method:: notName(string $pattern)

    Exclude files/directories matching a glob pattern. Multiple calls use OR logic.

Filtering by Path
~~~~~~~~~~~~~~~~~

.. php:method:: path(string $pattern)

    Include files whose relative path matches a pattern (substring or regex). Multiple calls use OR logic.

.. php:method:: notPath(string $pattern)

    Exclude files whose relative path matches a pattern (substring or regex). Multiple calls use OR logic.

.. php:method:: pattern(string $globPattern)

    Include files matching a glob pattern against the full relative path. Supports ``**`` for recursive matching.

.. php:method:: exclude(string $directory)

    Exclude specific directories from traversal. More efficient than filtering.

Depth Control
~~~~~~~~~~~~~

.. php:method:: depth(int $depth, DepthOperator $operator = DepthOperator::EQUAL)

    Filter by directory depth using operators like EQUAL, LESS_THAN, GREATER_THAN, etc.

Custom Filtering
~~~~~~~~~~~~~~~~

.. php:method:: filter(callable $callback)

    Apply custom filter callback. Receives ``SplFileInfo`` and relative path. Multiple calls use AND logic.

.. php:method:: ignoreHiddenFiles()

    Exclude hidden files (files starting with ``.``).

Basic Usage
-----------

Finding Files and Directories
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Find all PHP files in a directory::

    use Cake\Utility\Fs\Finder;

    $finder = (new Finder())
        ->in('src')
        ->name('*.php')
        ->files();

    foreach ($files as $file) {
        echo $file->getPathname();
    }

Find directories while excluding certain ones::

    $directories = (new Finder())
        ->in('src')
        ->exclude('vendor')
        ->exclude('tmp')
        ->directories();

By default, the Finder searches recursively. Use ``recursive(false)`` for top-level only::

    $finder = (new Finder())
        ->in('src')
        ->recursive(false)
        ->files();

Filtering Examples
------------------

By Filename Pattern
~~~~~~~~~~~~~~~~~~~

Include and exclude specific filename patterns::

    $finder = (new Finder())
        ->in('src')
        ->name('*.php')              // Include all PHP files
        ->notName('*Test.php')       // Exclude test files
        ->notName('*Fixture.php')    // Exclude fixtures
        ->files();

By Path Pattern
~~~~~~~~~~~~~~~

Filter by path containing specific strings or regex patterns::

    $finder = (new Finder())
        ->in('src')
        ->path('Controller')                    // Include paths containing "Controller"
        ->notPath('Test')                       // Exclude paths containing "Test"
        ->path('/Controller\.php$/')            // Or use regex patterns
        ->files();

By Depth
~~~~~~~~

Control traversal depth using type-safe operators::

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

Available depth operators: ``EQUAL``, ``NOT_EQUAL``, ``LESS_THAN``, ``GREATER_THAN``,
``LESS_THAN_OR_EQUAL``, ``GREATER_THAN_OR_EQUAL``.

Using Glob Patterns
~~~~~~~~~~~~~~~~~~~

Use glob patterns with ``**`` for recursive matching::

    $finder = (new Finder())
        ->in('.')
        ->pattern('src/**/*Controller.php')
        ->pattern('tests/**/*Test.php')
        ->files();

Glob syntax: ``*`` matches any characters except ``/``, ``**`` matches including ``/``,
``?`` matches single character, ``[abc]`` matches any character in set.

Custom Filters
~~~~~~~~~~~~~~

For complex filtering, use custom callbacks::

    use SplFileInfo;

    $finder = (new Finder())
        ->in('src')
        ->filter(fn(SplFileInfo $file) => $file->getSize() > 1024)
        ->filter(fn(SplFileInfo $file) => $file->getMTime() > strtotime('-1 week'))
        ->files();

The callback receives ``SplFileInfo`` and the relative path::

    $finder = (new Finder())
        ->in('.')
        ->filter(function (SplFileInfo $file, string $relativePath) {
            return str_starts_with($relativePath, 'src/Controller')
                || str_starts_with($relativePath, 'src/Model');
        })
        ->files();

Complete Example
----------------

Combining multiple filters::

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

Path
====

.. php:class:: Path

The ``Path`` class provides static utilities for path manipulation.

Available Methods
-----------------

.. php:staticmethod:: normalize(string $path)

    Convert paths to use forward slashes.

.. php:staticmethod:: makeRelative(string $path, string $base)

    Convert an absolute path to a relative path based on a base directory.

.. php:staticmethod:: join(string ...$segments)

    Join multiple path segments into a single path.

.. php:staticmethod:: matches(string $pattern, string $path)

    Test if a path matches a glob pattern. Supports ``*``, ``**``, ``?``, and ``[abc]`` syntax.

Examples
--------

::

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

.. meta::
    :title lang=en: Filesystem
    :keywords lang=en: finder,filesystem,files,directories,glob,path,iterator,fluent interface,cross-platform
