Caching
#######

Caching is frequently used to reduce the time it takes to create or read from
other resources.  Caching is often used to make reading from expensive 
resources less expensive.  You can easily store the results of expensive queries,
or remote webservice access that doesn't frequently change in a cache.  Once
in the cache, re-reading the stored resource from the cache is much cheaper
than accessing the remote resource.

Caching in CakePHP is primarily facilitated by the :php:class:`Cache` class.
This class provides a set of static methods that provide a uniform API to 
dealing with all different types of Caching implementations.  CakePHP
comes with several cache engines built-in, and provides an easy system 
to implement your own caching systems. The built-in caching engines are:

* ``FileCache`` File cache is a simple cache that uses local files, it 
  is the slowest cache engine, and doesn't provide as many features for 
  atomic operations.  However, since disk storage is often quite cheap, 
  storing large objects, or elements that are infrequently written
  work well in files.
* ``ApcCache`` APC cache uses the PHP `APC <http://php.net/apc>`_ extension
  This extension uses shared memory on the webserver to store objects.
  This makes it very fast, and able to provide atomic read/write features.
  By default CakePHP will use this cache engine if it's available.
* ``Wincache`` Wincache uses the `Wincache <http://php.net/wincache>`_
  extension.  Wincache is similar to APC in features and performance, but 
  optimized for windows and IIS.
* ``XcacheEngine`` Similar to APC, `Xcache <http://xcache.lighttpd.net/>`_
  is a PHP extension that provides similar features to APC.
* ``MemcacheEngine`` Uses the `Memcache <http://php.net/memcache>`_
  extension.  Memcache provides a very fast cache system that can be 
  distributed across many servers, and provides atomic operations.

Regardless of the CacheEngine you choose to use, your application interacts with
:php:class:`Cache` in a consistent manner.  This means you can easily swap cache engines
as your application grows. In addition to the :php:class:`Cache` class, the 
:doc:`/core-libraries/helpers/cache` allows for full page caching, which
can greatly improve performance as well.


Configuring Cache class
=======================

Configuring the Cache class can be done anywhere, but generally
you will want to configure Cache in ``app/Config/bootstrap.php``.  You
can configure as many cache configurations as you need, and use any 
mixture of cache engines.  CakePHP uses two cache configurations internally,
which are configured in ``app/Config/core.php``.

Using multiple cache configurations can help reduce the
number of times you need to use :php:func:`Cache::set()` as well as
centralize all your cache settings.  Using multiple configurations
also lets you incrementally change the storage as needed.

.. note::

    You must specify which engine to use. It does **not** default to
    File.

Example::

    <?php
    Cache::config('short', array(
        'engine' => 'File',  
        'duration' => '+1 hours',  
        'path' => CACHE,  
        'prefix' => 'cake_short_'
    ));

    // long  
    Cache::config('long', array(  
        'engine' => 'File',  
        'duration' => '+1 week',  
        'probability' => 100,  
        'path' => CACHE . 'long' . DS,  
    ));

By placing the above code in your ``app/Config/bootstrap.php`` you will
have two additional Cache configurations. The name of these
configurations 'short' or 'long' is used as the ``$config``
parameter for :php:func:`Cache::write()` and :php:func:`Cache::read()`.

Creating a storage engine for Cache
===================================

You can provide custom ``Cache`` adapters in ``app/Lib`` as well
as in plugins using ``$plugin/Lib``. App/plugin cache engines can
also override the core engines. Cache adapters must be in a cache
directory. If you had a cache engine named ``MyCustomCacheEngine``
it would be placed in either ``app/Lib/Cache/Engine/MyCustomCacheEngine.php``
as an app/libs. Or in ``$plugin/Lib/Cache/Engine/MyCustomCacheEngine.php`` as
part of a plugin. Cache configs from plugins need to use the plugin
dot syntax.::

    <?php
    Cache::config('custom', array(
        'engine' => 'CachePack.MyCustomCache',
        ...
    ));

.. note::

    App and Plugin cache engines should be configured in
    ``app/Config/bootstrap.php``. If you try to configure them in core.php
    they will not work correctly.

Custom Cache engines must extend :php:class:`CacheEngine` which defines
a number of abstract methods as well as provides a few initialization 
methods.

The required API for a CacheEngine is

.. php:class:: CacheEngine

    The base class for all cache engines used with Cache.

.. php:method:: write($key, $value, $duration)

    :return: boolean for success.

    Write value for a key into cache, $duration specifies
    how long the entry should exist in the cache.

.. php:method:: read($key)

    :return: The cached value or false for failure.

    Read a key from the cache.  Return false to indicate
    the entry has expired or does not exist.

.. php:method:: delete($key)

    :return: Boolean true on success.

    Delete a key from the cache. Return false to indicate that
    the entry did not exist or could not be deleted.

.. php:method:: clear($check)

    :return: Boolean true on success.

    Delete all keys from the cache.  If $check is true, you should
    validate that each value is actually expired.

.. php:method:: decrement($key, $offset = 1)

    :return: Boolean true on success.

    Decrement a number under the key and return decremented value

.. php:method:: increment($key, $offset = 1)

    :return: Boolean true on success.

    Increment a number under the key and return incremented value

.. php:method:: gc()

    Not required, but used to do clean up when resources expire.
    FileEngine uses this to delete files containing expired content.

Using Cache to store common query results
=========================================

You can greatly improve the performance of your application by putting
results that infrequently change, or that are subject to heavy reads into the
cache.  A perfect example of this are the results from :php:meth:`Model::find()`
A method that uses Cache to store results could look like::

    <?php 
    class Post extends AppModel {
    
        function newest() {
            $result = Cache::read('newest_posts', 'longterm');
            if (!$result) {
                $result = $this->find('all', array('order' => 'Post.updated DESC', 'limit' => 10));
                Cache::write('newest_posts', $result, 'longterm');
            }
            return $result;
        }
    }

You could improve the above code by moving the cache reading logic into
a behavior, that read from the cache, or ran the associated model method.
That is an exercise you can do though.


Using Cache to store counters
=============================

Counters for various things are easily stored in a cache.  For example a simple
countdown for remaining 'slots' in a contest could be store in Cache.  The
Cache class exposes atomic ways to increment/decrement counter values in an easy
way.  Atomic operations are important for these values as it reduces the risk of
contention, and ability for two users to simultaneously lower the value by one
resulting in an incorrect value.

After setting an integer value you can manipulate it using 
:php:meth:`Cache::increment()` and :php:meth:`Cache::decrement()`::

    <?php
    Cache::write('initial_count', 10);

    // Later on
    Cache::decrement('initial_count');

    //or 
    Cache::increment('initial_count');

.. note::

    Incrementing and decrementing do not work with FileEngine. You should use
    APC or Memcache instead.


Cache API
=========

.. php:class:: Cache

    The Cache class in CakePHP provides a generic frontend for several
    backend caching systems. Different Cache configurations and engines
    can be setup in your app/Config/core.php

.. php:staticmethod:: config($name = null, $settings = array())

    ``Cache::config()`` is used to create additional Cache
    configurations. These additional configurations can have different
    duration, engines, paths, or prefixes than your default cache
    config. 

.. php:staticmethod:: read($key, $config = 'default')

    Cache::read() is used to read the cached value stored under
    ``$key`` from the ``$config``. If $config is null the default
    config will be used. ``Cache::read()`` will return the cached value
    if it is a valid cache or ``false`` if the cache has expired or
    doesn't exist. The contents of the cache might evaluate false, so
    make sure you use the strict comparison operator ``===`` or
    ``!==``.

    For example::

        <?php
        $cloud = Cache::read('cloud');

        if ($cloud !== false) {
            return $cloud;
        }

        // generate cloud data
        // ...

        // store data in cache
        Cache::write('cloud', $cloud);
        return $cloud;


.. php:staticmethod:: write($key, $value, $config = 'default')

    Cache::write() will write a $value to the Cache. You can read or
    delete this value later by referring to it by ``$key``. You may
    specify an optional configuration to store the cache in as well. If
    no ``$config`` is specified default will be used. Cache::write()
    can store any type of object and is ideal for storing results of
    model finds.::

            if (($posts = Cache::read('posts')) === false) {
                $posts = $this->Post->find('all');
                Cache::write('posts', $posts);
            }

    Using Cache::write() and Cache::read() to easily reduce the number
    of trips made to the database to fetch posts.

.. php:staticmethod:: delete($key, $config = 'default')

    ``Cache::delete()`` will allow you to completely remove a cached
    object from the Cache store.

.. php:staticmethod:: set($settings = array(), $value = null, $config = 'default')

    ``Cache::set()`` allows you to temporarily override a cache configs
    settings for one operation (usually a read or write). If you use
    ``Cache::set()`` to change the settings for a write, you should
    also use ``Cache::set()`` before reading the data back in. If you
    fail to do so, the default settings will be used when the cache key
    is read.::

        <?php
        Cache::set(array('duration' => '+30 days'));
        Cache::write('results', $data);
    
        // Later on
    
        Cache::set(array('duration' => '+30 days'));
        $results = Cache::read('results');

    If you find yourself repeatedly calling ``Cache::set()`` perhaps
    you should create a new :php:func:`Cache::config()`. This will remove the 
    need to call ``Cache::set()``.

.. php:staticmethod:: increment($key, $offset = 1, $config = 'default')

    Atomically increment a value stored in the cache engine. Ideal for
    modifing counters or semaphore type values.

.. php:staticmethod:: decrement($key, $offset = 1, $config = 'default')

    Atomically decrement a value stored in the cache engine. Ideal for
    modifing counters or semaphore type values.

.. php:staticmethod:: clear($check, $config = 'default')

    Destroy all cached values for a cache configuration.  In engines like Apc,
    Memcache and Wincache, the cache configuration's prefix is used to remove
    cache entries.  Make sure that different cache configurations have different
    prefixes.

.. php:staticmethod:: gc($config)

    Garbage collects entries in the cache configuration.  This is primarily
    used by FileEngine. It should be implemented by any Cache engine
    that requires manual eviction of cached data.


.. meta::
    :title lang=en: Caching
    :keywords lang=en: uniform api,xcache,cache engine,cache system,atomic operations,php class,disk storage,static methods,php extension,consistent manner,similar features,apc,memcache,queries,cakephp,elements,servers,memory