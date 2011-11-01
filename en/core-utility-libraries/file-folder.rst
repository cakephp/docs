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

.. php:method:: addPathElement( $path, $element )

.. php:method:: cd( $path )

.. php:method:: chmod( $path, $mode = false, $recursive = true, $exceptions = array ( ) )

.. php:method:: copy( $options = array ( ) )

.. php:method:: correctSlashFor( $path )

.. php:method:: create( $pathname, $mode = false )

.. php:method:: delete( $path = NULL )

.. php:method:: dirsize( )

.. php:method:: errors( )

.. php:method:: find( $regexpPattern = '.*', $sort = false )

.. php:method:: findRecursive( $pattern = '.*', $sort = false )

.. php:method:: inCakePath( $path = '' )

.. php:method:: inPath( $path = '', $reverse = false )

.. php:method:: isAbsolute( $path )

.. php:method:: isSlashTerm( $path )

.. php:method:: isWindowsPath( $path )

.. php:method:: messages( )

.. php:method:: move( $options )

.. php:method:: normalizePath( $path )

.. php:method:: pwd( )

.. php:method:: read( $sort = true, $exceptions = false, $fullPath = false )

.. php:method:: realpath( $path )

.. php:method:: slashTerm( $path )

.. php:method:: tree( $path = NULL, $exceptions = true, $type = NULL )

File API
========

.. php:class:: File

.. php:method:: append( $data, $force = false )

.. php:method:: close( )

.. php:method:: copy( $dest, $overwrite = true )

.. php:method:: create( )

.. php:method:: delete( )

.. php:method:: executable( )

.. php:method:: exists( )

.. php:method:: ext( )

.. php:method:: Folder( )

.. php:method:: group( )

.. php:method:: info( )

.. php:method:: lastAccess( )

.. php:method:: lastChange( )

.. php:method:: md5( $maxsize = 5 )

.. php:method:: name( )

.. php:method:: offset( $offset = false, $seek = 0 )

.. php:method:: open( $mode = 'r', $force = false )

.. php:method:: owner( )

.. php:method:: perms( )

.. php:method:: prepare( $data, $forceWindows = false )

.. php:method:: pwd( )

.. php:method:: read( $bytes = false, $mode = 'rb', $force = false )

.. php:method:: readable( )

.. php:method:: safe( $name = NULL, $ext = NULL )

.. php:method:: size( )

.. php:method:: writable( )

.. php:method:: write( $data, $mode = 'w', $force = false )

.. todo::

    Explain how to use each method.