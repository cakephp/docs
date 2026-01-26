# Folder & File

The Folder and File utilities are convenience classes to help you read from and
write/append to files; list files within a folder and other common directory
related tasks.

::: info Deprecated in version 4.0
The `File` and `Folder` classes will be removed in 5.0. Use SPL classes like `SplFileInfo` or `SplFileObject` and iterator classes like `RecursiveDirectoryIterator`, `RecursiveRegexIterator` etc. instead.
:::

## Basic Usage

Ensure the classes are loaded:

``` php
use Cake\Filesystem\Folder;
use Cake\Filesystem\File;
```

Then we can setup a new folder instance:

``` php
$dir = new Folder('/path/to/folder');
```

and search for all *.php* files within that folder using regex:

``` php
$files = $dir->find('.*\.php');
```

Now we can loop through the files and read from or write/append to the contents or
simply delete the file:

``` php
foreach ($files as $file) {
    $file = new File($dir->pwd() . DS . $file);
    $contents = $file->read();
    // $file->write('I am overwriting the contents of this file');
    // $file->append('I am adding to the bottom of this file.');
    // $file->delete(); // I am deleting this file
    $file->close(); // Be sure to close the file when you're done
}
```

## Folder API

`class` Cake\\Filesystem\\**Folder**(string $path = false, boolean $create = false, string|boolean $mode = false)

``` php
// Create a new folder with 0755 permissions
$dir = new Folder('/path/to/folder', true, 0755);


Path of the current folder. :php:meth:`Folder::pwd()` will return the same
information.


Whether or not the list results should be sorted by name.


Mode to be used when creating folders. Defaults to ``0755``. Does nothing on
Windows machines.
```

`static` Cake\\Filesystem\\Folder::**addPathElement**(string $path, string $element)

Returns \$path with \$element added, with correct slash in-between:

``` php
$path = Folder::addPathElement('/a/path/for', 'testing');
// $path equals /a/path/for/testing
```

\$element can also be an array:

``` php
$path = Folder::addPathElement('/a/path/for', ['testing', 'another']);
// $path equals /a/path/for/testing/another
```

`method` Cake\\Filesystem\\Folder::**cd**( $path )

`method` Cake\\Filesystem\\Folder::**chmod**(string $path, integer $mode = false, boolean $recursive = true, array $exceptions = [])

`method` Cake\\Filesystem\\Folder::**copy**(string $to, array $options = [])

`static` Cake\\Filesystem\\Folder::**correctSlashFor**(string $path)

Returns a correct set of slashes for given \$path ('\\ for
Windows paths and '/' for other paths).

`method` Cake\\Filesystem\\Folder::**create**(string $pathname, integer $mode = false)

`method` Cake\\Filesystem\\Folder::**delete**(string $path = null)

`method` Cake\\Filesystem\\Folder::**dirsize**()

`method` Cake\\Filesystem\\Folder::**errors**()

`method` Cake\\Filesystem\\Folder::**find**(string $regexpPattern = '.*', boolean $sort = false)

> [!NOTE]
> The folder find and findRecursive methods will only find files. If you
> would like to get folders and files see `Folder::read()` or
> `Folder::tree()`

`method` Cake\\Filesystem\\Folder::**findRecursive**(string $pattern = '.*', boolean $sort = false)

`method` Cake\\Filesystem\\Folder::**inCakePath**(string $path = '')

`method` Cake\\Filesystem\\Folder::**inPath**(string $path = '', boolean $reverse = false)

`static` Cake\\Filesystem\\Folder::**isAbsolute**(string $path)

Returns `true` if the given \$path is an absolute path.

`static` Cake\\Filesystem\\Folder::**isSlashTerm**(string $path)

Returns `true` if given \$path ends in a slash (i.e. is slash-terminated):

``` php
$result = Folder::isSlashTerm('/my/test/path');
// $result = false
$result = Folder::isSlashTerm('/my/test/path/');
// $result = true
```

`static` Cake\\Filesystem\\Folder::**isWindowsPath**(string $path)

Returns `true` if the given \$path is a Windows path.

`method` Cake\\Filesystem\\Folder::**messages**()

`method` Cake\\Filesystem\\Folder::**move**(array $options)

`static` Cake\\Filesystem\\Folder::**normalizeFullPath**(string $path)

Returns a path with slashes normalized for the operating system.

`method` Cake\\Filesystem\\Folder::**pwd**()

`method` Cake\\Filesystem\\Folder::**read**(boolean $sort = true, array|boolean $exceptions = false, boolean $fullPath = false)

`method` Cake\\Filesystem\\Folder::**realpath**(string $path)

`static` Cake\\Filesystem\\Folder::**slashTerm**(string $path)

Returns \$path with added terminating slash (corrected for
Windows or other OS).

`method` Cake\\Filesystem\\Folder::**tree**(null|string $path = null, array|boolean $exceptions = true, null|string $type = null)

## File API

`class` Cake\\Filesystem\\**File**(string $path, boolean $create = false, integer $mode = 755)

``` php
// Create a new file with 0644 permissions
$file = new File('/path/to/file.php', true, 0644);


The Folder object of the file.


The name of the file with the extension. Differs from
:php:meth:`File::name()` which returns the name without the extension.


An array of file info. Use :php:meth:`File::info()` instead.


Holds the file handler resource if the file is opened.


Enable locking for file reading and writing.


The current file's absolute path.
```

`method` Cake\\Filesystem\\File::**append**(string $data, boolean $force = false)

`method` Cake\\Filesystem\\File::**close**()

`method` Cake\\Filesystem\\File::**copy**(string $dest, boolean $overwrite = true)

`method` Cake\\Filesystem\\File::**create**()

`method` Cake\\Filesystem\\File::**delete**()

`method` Cake\\Filesystem\\File::**executable**()

`method` Cake\\Filesystem\\File::**exists**()

`method` Cake\\Filesystem\\File::**ext**()

`method` Cake\\Filesystem\\File::**Folder**()

`method` Cake\\Filesystem\\File::**group**()

`method` Cake\\Filesystem\\File::**info**()

`method` Cake\\Filesystem\\File::**lastAccess**( )

`method` Cake\\Filesystem\\File::**lastChange**()

`method` Cake\\Filesystem\\File::**md5**(integer|boolean $maxsize = 5)

`method` Cake\\Filesystem\\File::**name**()

`method` Cake\\Filesystem\\File::**offset**(integer|boolean $offset = false, integer $seek = 0)

`method` Cake\\Filesystem\\File::**open**(string $mode = 'r', boolean $force = false)

`method` Cake\\Filesystem\\File::**owner**()

`method` Cake\\Filesystem\\File::**perms**()

`static` Cake\\Filesystem\\File::**prepare**(string $data, boolean $forceWindows = false)

Prepares a ascii string for writing. Converts line endings to the
correct terminator for the current platform. For Windows "\r\n"
will be used, "\n" for all other platforms.

`method` Cake\\Filesystem\\File::**pwd**()

`method` Cake\\Filesystem\\File::**read**(string $bytes = false, string $mode = 'rb', boolean $force = false)

`method` Cake\\Filesystem\\File::**readable**()

`method` Cake\\Filesystem\\File::**safe**(string $name = null, string $ext = null)

`method` Cake\\Filesystem\\File::**size**()

`method` Cake\\Filesystem\\File::**writable**()

`method` Cake\\Filesystem\\File::**write**(string $data, string $mode = 'w', boolean$force = false)

`method` Cake\\Filesystem\\File::**mime**()

`method` Cake\\Filesystem\\File::**replaceText**( $search, $replace )

<div class="todo">

Better explain how to use each method with both classes.

</div>
