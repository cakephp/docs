Caching
#######

Caching is frequently used to reduce the time it takes to create or read from
other resources. Caching is often used to make reading from expensive
resources less expensive. You can easily store the results of expensive queries,
or remote webservice access that doesn't frequently change in a cache. Once
in the cache, re-reading the stored resource from the cache is much cheaper
than accessing the remote resource.

Caching in CakePHP is primarily facilitated by the :php:class:`Cache` class.
This class provides a set of static methods that provide a uniform API to
dealing with all different types of Caching implementations. CakePHP
comes with several cache engines built-in, and provides an easy system
to implement your own caching systems. The built-in caching engines are:

* ``FileCache`` File cache is a simple cache that uses local files. It
  is the slowest cache engine, and doesn't provide as many features for
  atomic operations. However, since disk storage is often quite cheap,
  storing large objects, or elements that are infrequently written
  work well in files. This is the default Cache engine for 2.3+
* ``ApcCache`` APC cache uses the `APC <http://php.net/apc>`_ or `APCu
  <http://php.net/apcu>`_ extension. These extensions use shared memory on the
  webserver to store objects. This makes it very fast, and able to provide
  atomic read/write features. By default CakePHP in 2.0-2.2 will use this cache
  engine, if it's available.
* ``Wincache`` Wincache uses the `Wincache <http://php.net/wincache>`_
  extension. Wincache is similar to APC in features and performance, but
  optimized for Windows and Microsoft IIS.
* ``XcacheEngine`` `Xcache <http://xcache.lighttpd.net/>`_
  is a PHP extension that provides similar features to APC.
* ``MemcacheEngine`` Uses the `Memcache <http://php.net/memcache>`_
  extension. Memcache provides a very fast cache system that can be
  distributed across many servers, and provides atomic operations.
* ``MemcachedEngine`` Uses the `Memcached <http://php.net/memcached>`_
  extension. It also interfaces with memcache but provides better performance.
* ``RedisEngine`` Uses the `phpredis <https://github.com/nicolasff/phpredis>`_
  extension (2.2.3 minimum). Redis provides a fast and persistent cache system
  similar to memcached, also provides atomic operations.

.. versionchanged:: 2.3
    FileEngine is always the default cache engine. In the past a number of people
    had difficulty setting up and deploying APC correctly both in CLI + web.
    Using files should make setting up CakePHP simpler for new developers.

.. versionchanged:: 2.5
    The Memcached engine was added. And the Memcache engine was deprecated.

Regardless of the CacheEngine you choose to use, your application interacts with
:php:class:`Cache` in a consistent manner. This means you can easily swap cache engines
as your application grows. In addition to the :php:class:`Cache` class, the
:doc:`/core-libraries/helpers/cache` allows for full page caching, which
can greatly improve performance as well.

Configuring Cache class
=======================

Configuring the Cache class can be done anywhere, but generally
you will want to configure Cache in ``app/Config/bootstrap.php``. You
can configure as many cache configurations as you need, and use any
mixture of cache engines. CakePHP uses two cache configurations internally,
which are configured in ``app/Config/core.php``. If you are using APC or
Memcache you should make sure to set unique keys for the core caches. This will
prevent multiple applications from overwriting each other's cached data.

Using multiple cache configurations can help reduce the
number of times you need to use :php:func:`Cache::set()` as well as
centralize all your cache settings. Using multiple configurations
also lets you incrementally change the storage as needed.

.. note::

    You must specify which engine to use. It does **not** default to
    File.

Example::

    // Cache configuration for data that can be cached for a short time only.
    Cache::config('short', array(
        'engine' => 'File',
        'duration' => '+1 hours',
        'path' => CACHE,
        'prefix' => 'cake_short_'
    ));

    // Cache configuration for data that can be cached for a long time.
    Cache::config('long', array(
        'engine' => 'File',
        'duration' => '+1 week',
        'probability' => 100,
        'path' => CACHE . 'long' . DS,
    ));

By placing the above code in your ``app/Config/bootstrap.php`` you will
have two additional Cache configurations. The name of these
configurations 'short' or 'long' is used as the ``$config``
parameter for :php:func:`Cache::write()` and :php:func:`Cache::read()`, e.g. ``Cache.short``.

.. note::

    When using the FileEngine you might need to use the ``mask`` option to
    ensure cache files are made with the correct permissions.

.. versionadded:: 2.4

    In debug mode missing directories will now be automatically created to avoid unnecessary
    errors thrown when using the FileEngine.

Creating a storage engine for Cache
===================================

You can provide custom ``Cache`` adapters in ``app/Lib`` as well
as in plugins using ``$plugin/Lib``. App/plugin cache engines can
also override the core engines. Cache adapters must be in a cache
directory. If you had a cache engine named ``MyCustomCacheEngine``
it would be placed in either ``app/Lib/Cache/Engine/MyCustomCacheEngine.php``
as an app/libs or in ``$plugin/Lib/Cache/Engine/MyCustomCacheEngine.php`` as
part of a plugin. Cache configs from plugins need to use the plugin
dot syntax. ::

    Cache::config('custom', array(
        'engine' => 'CachePack.MyCustomCache',
        // ...
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

.. php:method:: write($key, $value, $config = 'default')

    :return: boolean for success.

    Write value for a key into cache, optional string $config
    specifies configuration name to write to.

.. php:method:: read($key, $config = 'default')

    :return: The cached value or false for failure.

    Read a key from the cache, optional string $config
    specifies configuration name to read from. Return false to
    indicate the entry has expired or does not exist.

.. php:method:: delete($key, $config = 'default')

    :return: Boolean true on success.

    Delete a key from the cache, optional string $config
    specifies configuration name to delete from. Return false to
    indicate that the entry did not exist or could not be deleted.

.. php:method:: clear($check)

    :return: Boolean true on success.

    Delete all keys from the cache. If $check is true, you should
    validate that each value is actually expired.

.. php:method:: clearGroup($group)

    :return: Boolean true on success.

    Delete all keys from the cache belonging to the same group.

.. php:method:: decrement($key, $offset = 1)

    :return: The decremented value on success, false otherwise.

    Decrement a number under the key and return decremented value

.. php:method:: increment($key, $offset = 1)

    :return: The incremented value on success, false otherwise.

    Increment a number under the key and return incremented value

.. php:method:: gc()

    Not required, but used to do clean up when resources expire.
    FileEngine uses this to delete files containing expired content.

.. php:method:: add($key, $value)

    Set a value in the cache if it did not already exist. Should use
    an atomic check and set where possible.

    .. versionadded:: 2.8
        add method was added in 2.8.0.

Using Cache to store common query results
=========================================

You can greatly improve the performance of your application by putting
results that infrequently change, or that are subject to heavy reads into the
cache. A perfect example of this are the results from :php:meth:`Model::find()`.
A method that uses Cache to store results could look like::

    class Post extends AppModel {

        public function newest() {
            $result = Cache::read('newest_posts', 'long');
            if (!$result) {
                $result = $this->find('all', array('order' => 'Post.updated DESC', 'limit' => 10));
                Cache::write('newest_posts', $result, 'long');
            }
            return $result;
        }
    }

You could improve the above code by moving the cache reading logic into
a behavior, that read from the cache, or ran the associated model method.
That is an exercise you can do though.

As of 2.5 you can accomplish the above much more simple by using
:php:meth:`Cache::remember()`. Assuming you are using PHP 5.3 or
newer, using the ``remember()`` method would look like::

    class Post extends AppModel {

        public function newest() {
            $model = $this;
            return Cache::remember('newest_posts', function() use ($model){
                return $model->find('all', array(
                    'order' => 'Post.updated DESC',
                    'limit' => 10
                ));
            }, 'long');
        }
    }

Using Cache to store counters
=============================

Counters for various things are easily stored in a cache. For example, a simple
countdown for remaining 'slots' in a contest could be stored in Cache. The
Cache class exposes atomic ways to increment/decrement counter values in an easy
way. Atomic operations are important for these values as it reduces the risk of
contention, a scenario where two users simultaneously lower the value by one,
resulting in an incorrect value.

After setting an integer value, you can manipulate it using
:php:meth:`Cache::increment()` and :php:meth:`Cache::decrement()`::

    Cache::write('initial_count', 10);

    // Later on
    Cache::decrement('initial_count');

    // or
    Cache::increment('initial_count');

.. note::

    Incrementing and decrementing do not work with FileEngine. You should use
    APC, Redis or Memcached instead.


Using groups
============

.. versionadded:: 2.2

Sometimes you will want to mark multiple cache entries to belong to a certain
group or namespace. This is a common requirement for mass-invalidating keys
whenever some information changes that is shared among all entries in the same
group. This is possible by declaring the groups in cache configuration::

    Cache::config('site_home', array(
        'engine' => 'Redis',
        'duration' => '+999 days',
        'groups' => array('comment', 'post')
    ));

Let's say you want to store the HTML generated for your homepage in cache, but
would also want to automatically invalidate this cache every time a comment or
post is added to your database. By adding the groups ``comment`` and ``post``,
we have effectively tagged any key stored into this cache configuration with
both group names.

For instance, whenever a new post is added, we could tell the Cache engine to
remove all entries associated to the ``post`` group::

    // Model/Post.php

    public function afterSave($created, $options = array()) {
        if ($created) {
            Cache::clearGroup('post', 'site_home');
        }
    }

.. versionadded:: 2.4

:php:func:`Cache::groupConfigs()` can be used to retrieve mapping between
group and configurations, i.e.: having the same group::

    // Model/Post.php

    /**
     * A variation of previous example that clears all Cache configurations
     * having the same group
     */
    public function afterSave($created, $options = array()) {
        if ($created) {
            $configs = Cache::groupConfigs('post');
            foreach ($configs['post'] as $config) {
                Cache::clearGroup('post', $config);
            }
        }
    }

Groups are shared across all cache configs using the same engine and same
prefix. If you are using groups and want to take advantage of group deletion,
choose a common prefix for all your configs.

Cache API
=========

.. php:class:: Cache

    The Cache class in CakePHP provides a generic frontend for several
    backend caching systems. Different Cache configurations and engines
    can be set up in your app/Config/core.php

.. php:staticmethod:: config($name = null, $settings = array())

    ``Cache::config()`` is used to create additional Cache
    configurations. These additional configurations can have different
    duration, engines, paths, or prefixes than your default cache
    config.

.. php:staticmethod:: read($key, $config = 'default')

    ``Cache::read()`` is used to read the cached value stored under
    ``$key`` from the ``$config``. If $config is null the default
    config will be used. ``Cache::read()`` will return the cached value
    if it is a valid cache or ``false`` if the cache has expired or
    doesn't exist. The contents of the cache might evaluate false, so
    make sure you use the strict comparison operators: ``===`` or
    ``!==``.

    For example::

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

    ``Cache::write()`` will write a $value to the Cache. You can read or
    delete this value later by referring to it by ``$key``. You may
    specify an optional configuration to store the cache in as well. If
    no ``$config`` is specified, default will be used. ``Cache::write()``
    can store any type of object and is ideal for storing results of
    model finds::

        if (($posts = Cache::read('posts')) === false) {
            $posts = $this->Post->find('all');
            Cache::write('posts', $posts);
        }

    Using ``Cache::write()`` and ``Cache::read()`` to easily reduce the number
    of trips made to the database to fetch posts.

.. php:staticmethod:: delete($key, $config = 'default')

    ``Cache::delete()`` will allow you to completely remove a cached
    object from the Cache store.

.. php:staticmethod:: set($settings = array(), $value = null, $config = 'default')

    ``Cache::set()`` allows you to temporarily override a cache config's
    settings for one operation (usually a read or write). If you use
    ``Cache::set()`` to change the settings for a write, you should
    also use ``Cache::set()`` before reading the data back in. If you
    fail to do so, the default settings will be used when the cache key
    is read. ::

        Cache::set(array('duration' => '+30 days'));
        Cache::write('results', $data);

        // Later on

        Cache::set(array('duration' => '+30 days'));
        $results = Cache::read('results');

    If you find yourself repeatedly calling ``Cache::set()`` then perhaps
    you should create a new :php:func:`Cache::config()`. This will remove the
    need to call ``Cache::set()``.

.. php:staticmethod:: increment($key, $offset = 1, $config = 'default')

    Atomically increment a value stored in the cache engine. Ideal for
    modifying counters or semaphore type values.

.. php:staticmethod:: decrement($key, $offset = 1, $config = 'default')

    Atomically decrement a value stored in the cache engine. Ideal for
    modifying counters or semaphore type values.

.. php:staticmethod:: add($key, $value, $config = 'default')

    Add data to the cache, but only if the key does not exist already.
    In the case that data did exist, this method will return false.
    Where possible data is checked & set atomically.

    .. versionadded:: 2.8
        add method was added in 2.8.0.

.. php:staticmethod:: clear($check, $config = 'default')

    Destroy all cached values for a cache configuration. In engines like Apc,
    Memcache and Wincache, the cache configuration's prefix is used to remove
    cache entries. Make sure that different cache configurations have different
    prefixes.

.. php:method:: clearGroup($group, $config = 'default')

    :return: Boolean true on success.

    Delete all keys from the cache belonging to the same group.

.. php:staticmethod:: gc($config)

    Garbage collects entries in the cache configuration. This is primarily
    used by FileEngine. It should be implemented by any Cache engine
    that requires manual eviction of cached data.


.. php:staticmethod:: groupConfigs($group = null)

    :return: Array of groups and its related configuration names.

    Retrieve group names to config mapping.

.. php:staticmethod:: remember($key, $callable, $config = 'default')

    Provides an easy way to do read-through caching. If the cache key exists
    it will be returned. If the key does not exist, the callable will be invoked
    and the results stored in the cache at the provided key.

    For example, you often want to cache query results. You could use
    ``remember()`` to make this simple. Assuming you are using PHP 5.3 or
    newer::

        class Articles extends AppModel {
            function all() {
                $model = $this;
                return Cache::remember('all_articles', function() use ($model){
                    return $model->find('all');
                });
            }
        }

    .. versionadded:: 2.5
        remember() was added in 2.5.


.. meta::
    :title lang=en: Caching
    :keywords lang=en: uniform api,xcache,cache engine,cache system,atomic operations,php class,disk storage,static methods,php extension,consistent manner,similar features,apc,memcache,queries,cakephp,elements,servers,memory
