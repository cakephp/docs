# Folder & File

The Folder and File utilities are convenience classes to help you read from and
write/append to files; list files within a folder and other common directory
related tasks.

## Basic usage

Ensure the classes are loaded using `App::uses()`:

``` php
<?php
App::uses('Folder', 'Utility');
App::uses('File', 'Utility');
```

Then we can setup a new folder instance:

``` php
<?php
$dir = new Folder('/path/to/folder');
```

and search for all *.ctp* files within that folder using regex:

``` php
<?php
$files = $dir->find('.*\.ctp');
```

Now we can loop through the files and read from or write/append to the contents or
simply delete the file:

``` php
<?php
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

`class` **Folder**(string $path = false, boolean $create = false, string|boolean $mode = false)

``` php
<?php
// Create a new folder with 0755 permissions
$dir = new Folder('/path/to/folder', true, 0755);


Path of the current folder. :php:meth:`Folder::pwd()` will return the same
information.


Whether or not the list results should be sorted by name.


Mode to be used when creating folders. Defaults to ``0755``. Does nothing on
Windows machines.
```

`static` Folder::**addPathElement**(string $path, string $element)

rtype  
string

Returns \$path with \$element added, with correct slash in-between:

``` php
$path = Folder::addPathElement('/a/path/for', 'testing');
// $path equals /a/path/for/testing
```

\$element can also be an array:

``` php
$path = Folder::addPathElement('/a/path/for', array('testing', 'another'));
// $path equals /a/path/for/testing/another
```

::: info Added in version 2.5
$element parameter accepts an array as of 2.5
:::

`method` Folder::**cd**(string $path)

`method` Folder::**chmod**(string $path, integer $mode = false, boolean $recursive = true, array $exceptions = array())

`method` Folder::**copy**(array|string $options = array())

`static` Folder::**correctSlashFor**(string $path)

rtype  
string

Returns a correct set of slashes for given \$path ('\\ for
Windows paths and '/' for other paths).

`method` Folder::**create**(string $pathname, integer $mode = false)

`method` Folder::**delete**(string $path = null)

`method` Folder::**dirsize**()

`method` Folder::**errors**()

`method` Folder::**find**(string $regexpPattern = '.*', boolean $sort = false)

> [!NOTE]
> The folder find and findRecursive methods will only find files. If you
> would like to get folders and files see `Folder::read()` or
> `Folder::tree()`

`method` Folder::**findRecursive**(string $pattern = '.*', boolean $sort = false)

`method` Folder::**inCakePath**(string $path = '')

`method` Folder::**inPath**(string $path = '', boolean $reverse = false)

`static` Folder::**isAbsolute**(string $path)

rtype  
boolean

Returns true if the given \$path is an absolute path.

`static` Folder::**isSlashTerm**(string $path)

rtype  
boolean

Returns true if given \$path ends in a slash (i.e. is slash-terminated):

``` php
<?php
$result = Folder::isSlashTerm('/my/test/path');
// $result = false
$result = Folder::isSlashTerm('/my/test/path/');
// $result = true
```

`static` Folder::**isWindowsPath**(string $path)

rtype  
boolean

Returns true if the given \$path is a Windows path.

`method` Folder::**messages**()

`method` Folder::**move**(array $options)

`static` Folder::**normalizePath**(string $path)

rtype  
string

Returns a correct set of slashes for given \$path ('\\ for
Windows paths and '/' for other paths).

`method` Folder::**pwd**()

`method` Folder::**read**(boolean $sort = true, array|boolean $exceptions = false, boolean $fullPath = false)

`method` Folder::**realpath**(string $path)

`static` Folder::**slashTerm**(string $path)

rtype  
string

Returns \$path with added terminating slash (corrected for
Windows or other OS).

`method` Folder::**tree**(null|string $path = null, array|boolean $exceptions = true, null|string $type = null)

## File API

`class` **File**(string $path, boolean $create = false, integer $mode = 755)

``` php
<?php
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

`method` File::**append**(string $data, boolean $force = false)

`method` File::**close**()

`method` File::**copy**(string $dest, boolean $overwrite = true)

`method` File::**create**()

`method` File::**delete**()

`method` File::**executable**()

`method` File::**exists**()

`method` File::**ext**()

`method` File::**Folder**()

`method` File::**group**()

`method` File::**info**()

`method` File::**lastAccess**()

`method` File::**lastChange**()

`method` File::**md5**(integer|boolean $maxsize = 5)

`method` File::**name**()

`method` File::**offset**(integer|boolean $offset = false, integer $seek = 0)

`method` File::**open**(string $mode = 'r', boolean $force = false)

`method` File::**owner**()

`method` File::**perms**()

<div class="php-static-def">

<File::prepare(string> \$data, boolean \$forceWindows = false)

rtype  
string

Prepares a ascii string for writing. Converts line endings to the
correct terminator for the current platform. For Windows "rn"
will be used, "n" for all other platforms.

</div>

`method` File::**pwd**()

`method` File::**read**(string $bytes = false, string $mode = 'rb', boolean $force = false)

`method` File::**readable**()

`method` File::**safe**(string $name = null, string $ext = null)

`method` File::**size**()

`method` File::**writable**()

`method` File::**write**(string $data, string $mode = 'w', boolean$force = false)

::: info Added in version 2.1
`File::mime()`
:::

`method` File::**mime**()

`method` File::**replaceText**( $search, $replace )

<div class="todo">

Better explain how to use each method with both classes.

</div>
