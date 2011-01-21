7.2.2 Cache Engines in Cake
---------------------------

New since 1.2 are several cache engines or cache backends. These
interface transparently with the cache helper, allowing you to
store view caches in a multitude of media without worrying about
the specifics of that media. The choice of cache engine is
controlled through the app/config/core.php config file. Most
options for each caching engine are listed in the core.php config
file and more detailed information on each caching engine can be
found in the Caching Section.

File
The File Engine is the default caching engine used by cake. It
writes flat files to the filesystem and it has several optional
parameters but works well with the defaults.
APC
The APC engine implements the
`Alternative PHP Cache <http://php.net/apc>`_ opcode Cacher. Like
XCache, this engine caches the compiled PHP opcode.
XCache
The XCache caching engine is functionally similar to APC other than
it implements the `XCache <http://xcache.lighttpd.net/>`_ opcode
caching engine. It requires the entry of a user and password to
work properly.
/tr
Memcache
The Memcache engine works with a memcaching server allowing you to
create a cache object in system memory. More information on
memcaching can be found on `php.net <http://www.php.net/memcache>`_
and `memcached <http://www.danga.com/memcached/>`_
7.2.2 Cache Engines in Cake
---------------------------

New since 1.2 are several cache engines or cache backends. These
interface transparently with the cache helper, allowing you to
store view caches in a multitude of media without worrying about
the specifics of that media. The choice of cache engine is
controlled through the app/config/core.php config file. Most
options for each caching engine are listed in the core.php config
file and more detailed information on each caching engine can be
found in the Caching Section.

File
The File Engine is the default caching engine used by cake. It
writes flat files to the filesystem and it has several optional
parameters but works well with the defaults.
APC
The APC engine implements the
`Alternative PHP Cache <http://php.net/apc>`_ opcode Cacher. Like
XCache, this engine caches the compiled PHP opcode.
XCache
The XCache caching engine is functionally similar to APC other than
it implements the `XCache <http://xcache.lighttpd.net/>`_ opcode
caching engine. It requires the entry of a user and password to
work properly.
/tr
Memcache
The Memcache engine works with a memcaching server allowing you to
create a cache object in system memory. More information on
memcaching can be found on `php.net <http://www.php.net/memcache>`_
and `memcached <http://www.danga.com/memcached/>`_
