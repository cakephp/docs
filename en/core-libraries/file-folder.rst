Folder & File
#############

The Folder and File utilities are convenience classes to help you read from and
write/append to files; list files within a folder and other common directory
related tasks.

Basic usage
===========

Ensure the classes are loaded using :php:meth:`App::uses()`::

    <?php
    App::uses('Folder', 'Utility');
    App::uses('File', 'Utility');

Then we can setup a new folder instance::

    <?php
    $dir = new Folder('/path/to/folder');

and search for all *.ctp* files within that folder using regex::

    <?php
    $files = $dir->find('.*\.ctp');

Now we can loop through the files and read from or write/append to the contents or
simply delete the file::

    <?php
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

    <?php
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

    :rtype: string

    Returns $path with $element added, with correct slash in-between::

        $path = Folder::addPathElement('/a/path/for', 'testing');
        // $path equals /a/path/for/testing

    $element can also be an array::

        $path = Folder::addPathElement('/a/path/for', array('testing', 'another'));
        // $path equals /a/path/for/testing/another

    .. versionadded:: 2.5
        $element parameter accepts an array as of 2.5


.. php:method:: cd(string $path)

    :rtype: string

    Change directory to $path. Returns false on failure::

        <?php
        $folder = new Folder('/foo');
        echo $folder->path; // Prints /foo
        $folder->cd('/bar');
        echo $folder->path; // Prints /bar
        $false = $folder->cd('/non-existent-folder');

.. php:method:: chmod(string $path, integer $mode = false, boolean $recursive = true, array $exceptions = array())

    :rtype: boolean

    Change the mode on a directory structure recursively. This includes
    changing the mode on files as well::

        <?php
        $dir = new Folder();
        $dir->chmod('/path/to/folder', 0755, true, array('skip_me.php'));

.. php:method:: copy(array|string $options = array())

    :rtype: boolean

    Copy a directory (recursively by default). The only parameter $options can either
    be a path into copy to or an array of options::

        <?php
        $folder1 = new Folder('/path/to/folder1');
        $folder1->copy('/path/to/folder2');
        // Will put folder1 and all its contents into folder2

        $folder = new Folder('/path/to/folder');
        $folder->copy(array(
            'to' => '/path/to/new/folder',
            'from' => '/path/to/copy/from', // will cause a cd() to occur
            'mode' => 0755,
            'skip' => array('skip-me.php', '.git'),
            'scheme' => Folder::SKIP, // Skip directories/files that already exist.
            'recursive' => true //set false to disable recursive copy
        ));

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

    .. versionchanged:: 2.3
        The merge, skip and overwrite schemes were added to ``copy()``

.. php:staticmethod:: correctSlashFor(string $path)

    :rtype: string

    Returns a correct set of slashes for given $path ('\\' for
    Windows paths and '/' for other paths).

.. php:method:: create(string $pathname, integer $mode = false)

    :rtype: boolean

    Create a directory structure recursively. Can be used to create
    deep path structures like `/foo/bar/baz/shoe/horn`::

        <?php
        $folder = new Folder();
        if ($folder->create('foo' . DS . 'bar' . DS . 'baz' . DS . 'shoe' . DS . 'horn')) {
            // Successfully created the nested folders
        }

.. php:method:: delete(string $path = null)

    :rtype: boolean

    Recursively remove directories if the system allows::

        <?php
        $folder = new Folder('foo');
        if ($folder->delete()) {
            // Successfully deleted foo and its nested folders
        }

.. php:method:: dirsize()

    :rtype: integer

    Returns the size in bytes of this Folder and its contents.

.. php:method:: errors()

    :rtype: array

    Get the error from latest method.

.. php:method:: find(string $regexpPattern = '.*', boolean $sort = false)

    :rtype: array

    Returns an array of all matching files in the current directory::

        <?php
        // Find all .png in your app/webroot/img/ folder and sort the results
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

    :rtype: array

    Returns an array of all matching files in and below the current directory::

        <?php
        // Recursively find files beginning with test or index
        $dir = new Folder(WWW_ROOT);
        $files = $dir->findRecursive('(test|index).*');
        /*
        Array
        (
            [0] => /var/www/cake/app/webroot/index.php
            [1] => /var/www/cake/app/webroot/test.php
            [2] => /var/www/cake/app/webroot/img/test-skip-icon.png
            [3] => /var/www/cake/app/webroot/img/test-fail-icon.png
            [4] => /var/www/cake/app/webroot/img/test-error-icon.png
            [5] => /var/www/cake/app/webroot/img/test-pass-icon.png
        )
        */

.. php:method:: inCakePath(string $path = '')

    :rtype: boolean

    Returns true if the file is in a given CakePath.

.. php:method:: inPath(string $path = '', boolean $reverse = false)

    :rtype: boolean

    Returns true if the file is in the given path::

        <?php
        $Folder = new Folder(WWW_ROOT);
        $result = $Folder->inPath(APP);
        // $result = true, /var/www/example/app/ is in /var/www/example/app/webroot/

        $result = $Folder->inPath(WWW_ROOT . 'img' . DS, true);
        // $result = true, /var/www/example/app/webroot/ is in /var/www/example/app/webroot/img/

.. php:staticmethod:: isAbsolute(string $path)

    :rtype: boolean

    Returns true if the given $path is an absolute path.

.. php:staticmethod:: isSlashTerm(string $path)

    :rtype: boolean

    Returns true if given $path ends in a slash (i.e. is slash-terminated)::

        <?php
        $result = Folder::isSlashTerm('/my/test/path');
        // $result = false
        $result = Folder::isSlashTerm('/my/test/path/');
        // $result = true

.. php:staticmethod:: isWindowsPath(string $path)

    :rtype: boolean

    Returns true if the given $path is a Windows path.

.. php:method:: messages()

    :rtype: array

    Get the messages from the latest method.

.. php:method:: move(array $options)

    :rtype: boolean

    Move a directory (recursively by default). The only parameter $options is the same as for ``copy()``

.. php:staticmethod:: normalizePath(string $path)

    :rtype: string

    Returns a correct set of slashes for given $path ('\\' for
    Windows paths and '/' for other paths).

.. php:method:: pwd()

    :rtype: string

    Return current path.

.. php:method:: read(boolean $sort = true, array|boolean $exceptions = false, boolean $fullPath = false)

    :rtype: mixed

    :param boolean $sort: If true will sort results.
    :param mixed $exceptions: An array of files and folder names to ignore. If
        true or '.' this method will ignore hidden or dot files.
    :param boolean $fullPath: If true will return results using absolute paths.

    Returns an array of the contents of the current directory. The
    returned array holds two sub arrays: One of directories and one of files::

        <?php
        $dir = new Folder(WWW_ROOT);
        $files = $dir->read(true, array('files', 'index.php'));
        /*
        Array
        (
            [0] => Array // folders
                (
                    [0] => css
                    [1] => img
                    [2] => js
                )
            [1] => Array // files
                (
                    [0] => .htaccess
                    [1] => favicon.ico
                    [2] => test.php
                )
        )
        */

.. php:method:: realpath(string $path)

    :rtype: string

    Get the real path (taking ".." and such into account).

.. php:staticmethod:: slashTerm(string $path)

    :rtype: string

    Returns $path with added terminating slash (corrected for
    Windows or other OS).

.. php:method:: tree(null|string $path = null, array|boolean $exceptions = true, null|string $type = null)

    :rtype: mixed

    Returns an array of nested directories and files in each directory.

File API
========

.. php:class:: File(string $path, boolean $create = false, integer $mode = 755)

::

    <?php
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

    :rtype: boolean

    Append the given data string to the current file.

.. php:method:: close()

    :rtype: boolean

    Closes the current file if it is opened.

.. php:method:: copy(string $dest, boolean $overwrite = true)

    :rtype: boolean

    Copy the file to $dest.

.. php:method:: create()

    :rtype: boolean

    Creates the file.

.. php:method:: delete()

    :rtype: boolean

    Deletes the file.

.. php:method:: executable()

    :rtype: boolean

    Returns true if the file is executable.

.. php:method:: exists()

    :rtype: boolean

    Returns true if the file exists.

.. php:method:: ext()

    :rtype: string

    Returns the file extension.

.. php:method:: Folder()

    :rtype: Folder

    Returns the current folder.

.. php:method:: group()

    :rtype: integer|false

    Returns the file's group, or false in case of an error.

.. php:method:: info()

    :rtype: array

    Returns the file info.

    .. versionchanged:: 2.1
        ``File::info()`` now includes filesize & mimetype information.

.. php:method:: lastAccess()

    :rtype: integer|false

    Returns last access time, or false in case of an error.

.. php:method:: lastChange()

    :rtype: integer|false

    Returns last modified time, or false in case of an error.

.. php:method:: md5(integer|boolean $maxsize = 5)

    :rtype: string

    Get the MD5 Checksum of file with previous check of filesize,
    or false in case of an error.

.. php:method:: name()

    :rtype: string

    Returns the file name without extension.

.. php:method:: offset(integer|boolean $offset = false, integer $seek = 0)

    :rtype: mixed

    Sets or gets the offset for the currently opened file.

.. php:method:: open(string $mode = 'r', boolean $force = false)

    :rtype: boolean

    Opens the current file with the given $mode.

.. php:method:: owner()

    :rtype: integer

    Returns the file's owner.

.. php:method:: perms()

    :rtype: string

    Returns the "chmod" (permissions) of the file.

.. php:staticmethod:: prepare(string $data, boolean $forceWindows = false)

    :rtype: string

    Prepares a ascii string for writing. Converts line endings to the
    correct terminator for the current platform. For Windows "\r\n"
    will be used, "\n" for all other platforms.

.. php:method:: pwd()

    :rtype: string

    Returns the full path of the file.

.. php:method:: read(string $bytes = false, string $mode = 'rb', boolean $force = false)

    :rtype: string|boolean

    Return the contents of the current file as a string or return false on failure.

.. php:method:: readable()

    :rtype: boolean

    Returns true if the file is readable.

.. php:method:: safe(string $name = null, string $ext = null)

    :rtype: string

    Makes filename safe for saving.

.. php:method:: size()

    :rtype: integer

    Returns the filesize.

.. php:method:: writable()

    :rtype: boolean

    Returns true if the file is writable.

.. php:method:: write(string $data, string $mode = 'w', boolean$force = false)

    :rtype: boolean

    Write given data to the current file.

.. versionadded:: 2.1 ``File::mime()``

.. php:method:: mime()

    :rtype: mixed

    Get the file's mimetype, returns false on failure.

.. php:method:: replaceText( $search, $replace )

    :rtype: boolean

    Replaces text in a file. Returns false on failure and true on success.

    .. versionadded::
        2.5 ``File::replaceText()``

.. todo::

    Better explain how to use each method with both classes.


.. meta::
    :title lang=en: Folder & File
    :description lang=en: The Folder and File utilities are convenience classes to help you read, write, and append to files; list files within a folder and other common directory related tasks.
    :keywords lang=en: file,folder,cakephp utility,read file,write file,append file,recursively copy,copy options,folder path,class folder,file php,php files,change directory,file utilities,new folder,directory structure,delete file
