Folder & File
#############

The Folder and File utilities are convenience classes to help you read, write,
and append to files; list files within a folder and other common directory
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

Now we can loop through the files and read, write or append to the contents or
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

.. php:class:: Folder


.. php:staticmethod:: addPathElement( $path, $element )
		    
		    :rtype: string
		
		    Returns $path with $element added, with correct slash in-between.::
		    
		        <?php
		        $path = Folder::addPathElement('/a/path/for', 'testing');
		        // $path equals /a/path/for/testing


.. php:method:: cd( $path )

		    :rtype: string
		    
		    Change directory to $path. Returns false on failure.


.. php:method:: chmod( $path, $mode = false, $recursive = true, $exceptions = array ( ) )

		    :rtype: boolean
		
		    Change the mode on a directory structure recursively. This 
		    includes changing the mode on files as well.


.. php:method:: copy( $options = array ( ) )

		    :rtype: boolean
		
		    Recursively copy a directory. The only parameter $options can 
		    either be a path into copy to or an array of options::
		
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
		        ));


.. php:staticmethod:: correctSlashFor( $path )

		    :rtype: string
		
		    Returns a correct set of slashes for given $path. (\\ for 
		    Windows paths and / for other paths.)
		

.. php:method:: create( $pathname, $mode = false )

		    :rtype: boolean
		
		    Create a directory structure recursively. Can be used to create 
		    deep path structures like `/foo/bar/baz/shoe/horn`
		
		
.. php:method:: delete( $path = NULL )

		    :rtype: boolean
		
		    Recursively Remove directories if the system allows.
		
		
.. php:method:: dirsize( )

		    :rtype: integer
		
		    Returns the size in bytes of this Folder and its contents.
		
		
.. php:method:: errors( )

		    :rtype: array
		
		    Get error from latest method.
		
		
.. php:method:: find( $regexpPattern = '.*', $sort = false )

		    :rtype: array
		
		    Returns an array of all matching files in current directory.
		
		
.. php:method:: findRecursive( $pattern = '.*', $sort = false )

		    :rtype: array
		
		    Returns an array of all matching files in and below current directory.
		

.. php:method:: inCakePath( $path = '' )

		    :rtype: boolean
		
		    Returns true if the File is in a given CakePath.
		

.. php:method:: inPath( $path = '', $reverse = false )

		    :rtype: boolean
		
		    Returns true if the File is in given path.
		

.. php:staticmethod:: isAbsolute( $path )

		    :rtype: boolean
		
		    Returns true if given $path is an absolute path.


.. php:staticmethod:: isSlashTerm( $path )

		    :rtype: boolean
		
		    Returns true if given $path ends in a slash (i.e. is slash-terminated).
		

.. php:staticmethod:: isWindowsPath( $path )

		    :rtype: boolean
		
		    Returns true if given $path is a Windows path.
		

.. php:method:: messages( )

		    :rtype: array
		
		    Get messages from latest method.


.. php:method:: move( $options )

		    :rtype: boolean
		
		    Recursive directory move.
		

.. php:staticmethod:: normalizePath( $path )

		    :rtype: string
		
		    Returns a correct set of slashes for given $path. (\\ for 
		    Windows paths and / for other paths.)
		

.. php:method:: pwd( )

		    :rtype: string
		
		    Return current path.
		

.. php:method:: read( $sort = true, $exceptions = false, $fullPath = false )

		    :rtype: mixed
		
		    Returns an array of the contents of the current directory. The 
		    returned array holds two arrays: One of directories and one of files.
		

.. php:method:: realpath( $path )

		    :rtype: string
		
		    Get the real path (taking ".." and such into account).


.. php:staticmethod:: slashTerm( $path )

		    :rtype: string
		
		    Returns $path with added terminating slash (corrected for 
		    Windows or other OS).


.. php:method:: tree( $path = NULL, $exceptions = true, $type = NULL )

		    :rtype: mixed
		
		    Returns an array of nested directories and files in each directory.
		

File API
========

.. php:class:: File

.. php:method:: append( $data, $force = false )

		    :rtype: boolean
		
		    Append given data string to this File.
		

.. php:method:: close( )

		    :rtype: boolean
		
		    Closes the current file if it is opened.
		

.. php:method:: copy( $dest, $overwrite = true )

		    :rtype: boolean
		
		    Copy the File to $dest
		
		
.. php:method:: create( )

		    :rtype: boolean
		
		    Creates the File.
		
		
.. php:method:: delete( )

		    :rtype: boolean
		
		    Deletes the File.
		
		
.. php:method:: executable( )

		    :rtype: boolean
		
		    Returns true if the File is executable.
		
		
.. php:method:: exists( )

		    :rtype: boolean
		
		    Returns true if the File exists.
		
		
.. php:method:: ext( )

		    :rtype: string
		
		    Returns the File extension.
		
		
.. php:method:: Folder( )

		    :rtype: Folder
		
		    Returns the current folder.
		
		
.. php:method:: group( )

		    :rtype: integer
		
		    Returns the File's group.
		
		
.. php:method:: info( )

		    :rtype: string
		
		    Returns the File info.
		
		
.. php:method:: lastAccess( )

		    :rtype: integer
		
		    Returns last access time.
		
		
.. php:method:: lastChange( )

		    :rtype: integer
		
		    Returns last modified time.
		
		
.. php:method:: md5( $maxsize = 5 )

		    :rtype: string
		
		    Get md5 Checksum of file with previous check of Filesize
		
		
.. php:method:: name( )

		    :rtype: string
		
		    Returns the File name without extension.
		
		
.. php:method:: offset( $offset = false, $seek = 0 )

		    :rtype: mixed
		
		    Sets or gets the offset for the currently opened file.
		
		
.. php:method:: open( $mode = 'r', $force = false )

		    :rtype: boolean
		
		    Opens the current file with a given $mode
		
		
.. php:method:: owner( )

		    :rtype: integer
		
		    Returns the File's owner.
		
		
.. php:method:: perms( )

		    :rtype: string
		
		    Returns the "chmod" (permissions) of the File.
		
		
.. php:staticmethod:: prepare( $data, $forceWindows = false )

		    :rtype: string
		
		    Prepares a ascii string for writing. Converts line endings to the 
		    correct terminator for the current platform. If windows "\r\n" 
		    will be used all other platforms will use "\n"
		
		
.. php:method:: pwd( )

		    :rtype: string
		
		    Returns the full path of the File.
		
		
.. php:method:: read( $bytes = false, $mode = 'rb', $force = false )

		    :rtype: mixed
		
		    Return the contents of this File as a string or return false on failure.
		
		
.. php:method:: readable( )

		    :rtype: boolean
		
		    Returns true if the File is readable.
		
		
.. php:method:: safe( $name = NULL, $ext = NULL )

		    :rtype: string
		
		    Makes filename safe for saving.
		
		
.. php:method:: size( )

		    :rtype: integer
		
		    Returns the Filesize.
		
		
.. php:method:: writable( )

		    :rtype: boolean
		
		    Returns true if the File is writable.
		
		
.. php:method:: write( $data, $mode = 'w', $force = false )

		    :rtype: boolean
		
		    Write given data to this File.
		
		
.. todo::
    
    Better explain how to use each method with both classes.