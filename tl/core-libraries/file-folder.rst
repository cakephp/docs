Folder & File
#############

.. php:namespace:: Cake\Filesystem

The Folder and File utilities are convenience classes to help you read from and
write/append to files; list files within a folder and other common directory
related tasks.

Basic Usage
===========

Ensure the classes are loaded::

    use Cake\Filesystem\Folder;
    use Cake\Filesystem\File;

Then we can setup a new folder instance::

    $dir = new Folder('/path/to/folder');

and search for all *.ctp* files within that folder using regex::

    $files = $dir->find('.*\.ctp');

Now we can loop through the files and read from or write/append to the contents or
simply delete the file::

    foreach ($files as $file) {
        $file = new File($dir->pwd() . DS . $file);
        $contents = $file->read();
        // $file->write('I am overwriting the contents of this file');
        // $file->append('I am adding to the bottom of this file.');
        // $file->delete(); // I am deleting this file
        $file->close(); // Be sure to close the file when you're done
    }

Folder API
==========

.. php:class:: Folder(string $path = false, boolean $create = false, string|boolean $mode = false)

::

    // Create a new folder with 0755 permissions
    $dir = new Folder('/path/to/folder', true, 0755);

.. php:attr:: path

    Path of the current folder. :php:meth:`Folder::pwd()` will return the same
    information.

.. php:attr:: sort

    Whether or not the list results should be sorted by name.

.. php:attr:: mode

    Mode to be used when creating folders. Defaults to ``0755``. Does nothing on
    Windows machines.

.. php:staticmethod:: addPathElement(string $path, string $element)

    Returns $path with $element added, with correct slash in-between::

        $path = Folder::addPathElement('/a/path/for', 'testing');
        // $path equals /a/path/for/testing

    $element can also be an array::

        $path = Folder::addPathElement('/a/path/for', ['testing', 'another']);
        // $path equals /a/path/for/testing/another

.. php:method:: cd( $path )

    Change directory to $path. Returns ``false`` on failure::

        $folder = new Folder('/foo');
        echo $folder->path; // Prints /foo
        $folder->cd('/bar');
        echo $folder->path; // Prints /bar
        $false = $folder->cd('/non-existent-folder');

.. php:method:: chmod(string $path, integer $mode = false, boolean $recursive = true, array $exceptions = [])

    Change the mode on a directory structure recursively. This includes
    changing the mode on files as well::

        $dir = new Folder();
        $dir->chmod('/path/to/folder', 0755, true, ['skip_me.php']);

.. php:method:: copy(array|string $options = [])

    Recursively copy a directory. The only parameter $options can either
    be a path into copy to or an array of options::

        $folder1 = new Folder('/path/to/folder1');
        $folder1->copy('/path/to/folder2');
        // Will put folder1 and all its contents into folder2

        $folder = new Folder('/path/to/folder');
        $folder->copy([
            'to' => '/path/to/new/folder',
            'from' => '/path/to/copy/from', // Will cause a cd() to occur
            'mode' => 0755,
            'skip' => ['skip-me.php', '.git'],
            'scheme' => Folder::SKIP  // Skip directories/files that already exist.
        ]);

    There are 3 supported schemes:

    * ``Folder::SKIP`` skip copying/moving files & directories that exist in the
      destination directory.
    * ``Folder::MERGE`` merge the source/destination directories. Files in the
      source directory will replace files in the target directory. Directory
      contents will be merged.
    * ``Folder::OVERWRITE`` overwrite existing files & directories in the target
      directory with those in the source directory. If both the target and
      destination contain the same subdirectory, the target directory's contents
      will be removed and replaced with the source's.

.. php:staticmethod:: correctSlashFor(string $path)

    Returns a correct set of slashes for given $path ('\\' for
    Windows paths and '/' for other paths).

.. php:method:: create(string $pathname, integer $mode = false)

    Create a directory structure recursively. Can be used to create
    deep path structures like `/foo/bar/baz/shoe/horn`::

        $folder = new Folder();
        if ($folder->create('foo' . DS . 'bar' . DS . 'baz' . DS . 'shoe' . DS . 'horn')) {
            // Successfully created the nested folders
        }

.. php:method:: delete(string $path = null)

    Recursively remove directories if the system allows::

        $folder = new Folder('foo');
        if ($folder->delete()) {
            // Successfully deleted foo and its nested folders
        }

.. php:method:: dirsize()

    Returns the size in bytes of this Folder and its contents.

.. php:method:: errors()

    Get the error from latest method.

.. php:method:: find(string $regexpPattern = '.*', boolean $sort = false)

    Returns an array of all matching files in the current directory::

        // Find all .png in your webroot/img/ folder and sort the results
        $dir = new Folder(WWW_ROOT . 'img');
        $files = $dir->find('.*\.png', true);
        /*
        Array
        (
            [0] => cake.icon.png
            [1] => test-error-icon.png
            [2] => test-fail-icon.png
            [3] => test-pass-icon.png
            [4] => test-skip-icon.png
        )
        */

.. note::

    The folder find and findRecursive methods will only find files. If you
    would like to get folders and files see :php:meth:`Folder::read()` or
    :php:meth:`Folder::tree()`

.. php:method:: findRecursive(string $pattern = '.*', boolean $sort = false)

    Returns an array of all matching files in and below the current directory::

        // Recursively find files beginning with test or index
        $dir = new Folder(WWW_ROOT);
        $files = $dir->findRecursive('(test|index).*');
        /*
        Array
        (
            [0] => /var/www/cake/webroot/index.php
            [1] => /var/www/cake/webroot/test.php
            [2] => /var/www/cake/webroot/img/test-skip-icon.png
            [3] => /var/www/cake/webroot/img/test-fail-icon.png
            [4] => /var/www/cake/webroot/img/test-error-icon.png
            [5] => /var/www/cake/webroot/img/test-pass-icon.png
        )
        */

.. php:method:: inCakePath(string $path = '')

    Returns ``true`` if the file is in a given CakePath.

.. php:method:: inPath(string $path = '', boolean $reverse = false)

    Returns ``true`` if the file is in the given path::

        $Folder = new Folder(WWW_ROOT);
        $result = $Folder->inPath(APP);
        // $result = true, /var/www/example/ is in /var/www/example/webroot/

        $result = $Folder->inPath(WWW_ROOT . 'img' . DS, true);
        // $result = true, /var/www/example/webroot/ is in /var/www/example/webroot/img/

.. php:staticmethod:: isAbsolute(string $path)

    Returns ``true`` if the given $path is an absolute path.

.. php:staticmethod:: isSlashTerm(string $path)

    Returns ``true`` if given $path ends in a slash (i.e. is slash-terminated)::

        $result = Folder::isSlashTerm('/my/test/path');
        // $result = false
        $result = Folder::isSlashTerm('/my/test/path/');
        // $result = true

.. php:staticmethod:: isWindowsPath(string $path)

    Returns ``true`` if the given $path is a Windows path.

.. php:method:: messages()

    Get the messages from the latest method.

.. php:method:: move(array $options)

    Recursive directory move.

.. php:staticmethod:: normalizePath(string $path)

    Returns a correct set of slashes for given $path ('\\' for
    Windows paths and '/' for other paths).

.. php:method:: pwd()

    Return current path.

.. php:method:: read(boolean $sort = true, array|boolean $exceptions = false, boolean $fullPath = false)

    Returns an array of the contents of the current directory. The
    returned array holds two sub arrays: One of directories and one of files::

        $dir = new Folder(WWW_ROOT);
        $files = $dir->read(true, ['files', 'index.php']);
        /*
        Array
        (
            [0] => Array // Folders
                (
                    [0] => css
                    [1] => img
                    [2] => js
                )
            [1] => Array // Files
                (
                    [0] => .htaccess
                    [1] => favicon.ico
                    [2] => test.php
                )
        )
        */

.. php:method:: realpath(string $path)

    Get the real path (taking ".." and such into account).

.. php:staticmethod:: slashTerm(string $path)

    Returns $path with added terminating slash (corrected for
    Windows or other OS).

.. php:method:: tree(null|string $path = null, array|boolean $exceptions = true, null|string $type = null)

    Returns an array of nested directories and files in each directory.

File API
========

.. php:class:: File(string $path, boolean $create = false, integer $mode = 755)

::

    // Create a new file with 0644 permissions
    $file = new File('/path/to/file.php', true, 0644);

.. php:attr:: Folder

    The Folder object of the file.

.. php:attr:: name

    The name of the file with the extension. Differs from
    :php:meth:`File::name()` which returns the name without the extension.

.. php:attr:: info

    An array of file info. Use :php:meth:`File::info()` instead.

.. php:attr:: handle

    Holds the file handler resource if the file is opened.

.. php:attr:: lock

    Enable locking for file reading and writing.

.. php:attr:: path

    The current file's absolute path.

.. php:method:: append(string $data, boolean $force = false)

    Append the given data string to the current file.

.. php:method:: close()

    Closes the current file if it is opened.

.. php:method:: copy(string $dest, boolean $overwrite = true)

    Copy the file to $dest.

.. php:method:: create()

    Creates the file.

.. php:method:: delete()

    Deletes the file.

.. php:method:: executable()

    Returns ``true`` if the file is executable.

.. php:method:: exists()

    Returns ``true`` if the file exists.

.. php:method:: ext()

    Returns the file extension.

.. php:method:: Folder()

    Returns the current folder.

.. php:method:: group()

    Returns the file's group, or ``false`` in case of an error.

.. php:method:: info()

    Returns the file info.

.. php:method:: lastAccess( )

    Returns last access time.

.. php:method:: lastChange()

    Returns last modified time, or ``false`` in case of an error.

.. php:method:: md5(integer|boolean $maxsize = 5)

    Get the MD5 Checksum of file with previous check of filesize,
    or ``false`` in case of an error.

.. php:method:: name()

    Returns the file name without extension.

.. php:method:: offset(integer|boolean $offset = false, integer $seek = 0)

    Sets or gets the offset for the currently opened file.

.. php:method:: open(string $mode = 'r', boolean $force = false)

    Opens the current file with the given $mode.

.. php:method:: owner()

    Returns the file's owner.

.. php:method:: perms()

    Returns the "chmod" (permissions) of the file.

.. php:staticmethod:: prepare(string $data, boolean $forceWindows = false)

    Prepares a ascii string for writing. Converts line endings to the
    correct terminator for the current platform. For Windows "\\r\\n"
    will be used, "\\n" for all other platforms.

.. php:method:: pwd()

    Returns the full path of the file.

.. php:method:: read(string $bytes = false, string $mode = 'rb', boolean $force = false)

    Return the contents of the current file as a string or return ``false`` on failure.

.. php:method:: readable()

    Returns ``true`` if the file is readable.

.. php:method:: safe(string $name = null, string $ext = null)

    Makes filename safe for saving.

.. php:method:: size()

    Returns the filesize in bytes.

.. php:method:: writable()

    Returns ``true`` if the file is writable.

.. php:method:: write(string $data, string $mode = 'w', boolean$force = false)

    Write given data to the current file.

.. php:method:: mime()

    Get the file's mimetype, returns ``false`` on failure.

.. php:method:: replaceText( $search, $replace )

    Replaces text in a file. Returns ``false`` on failure and ``true`` on success.

.. todo::

    Better explain how to use each method with both classes.

.. meta::
    :title lang=en: Folder & File
    :description lang=en: The Folder and File utilities are convenience classes to help you read, write, and append to files; list files within a folder and other common directory related tasks.
    :keywords lang=en: file,folder,cakephp utility,read file,write file,append file,recursively copy,copy options,folder path,class folder,file php,php files,change directory,file utilities,new folder,directory structure,delete file
