Caching
#######

.. php:namespace::  Cake\Cache

.. php:class:: Cache

Caching can be used to make reading from expensive or slow resources faster, by
maintaining a second copy of the required data in a faster or closer storage
system. For example, you can store the results of expensive queries, or remote
webservice access that doesn't frequently change in a cache. Once in the cache,
reading data from the cache is much cheaper than accessing the remote resource.

Caching in CakePHP is facilitated by the ``Cache`` class.
This class provides a static interface and uniform API to
interact with various Caching implementations. CakePHP
provides several cache engines, and provides a simple interface if you need to
build your own backend. The built-in caching engines are:

* ``FileCache`` File cache is a simple cache that uses local files. It
  is the slowest cache engine, and doesn't provide as many features for
  atomic operations. However, since disk storage is often quite cheap,
  storing large objects, or elements that are infrequently written
<<<<<<< HEAD
  work well in files.
* ``ApcCache`` APC cache uses the PHP `APCu <http://php.net/apcu>`_ extension.
  This extension uses shared memory on the webserver to store objects.
  This makes it very fast, and able to provide atomic read/write features.
* ``Wincache`` Wincache uses the `Wincache <http://php.net/wincache>`_
=======
  work well in files. This is the default Cache engine for 2.3+
* ``ApcCache`` APC cache uses the `APC <https://secure.php.net/apc>`_ or `APCu
  <https://secure.php.net/apcu>`_ extension. These extensions use shared memory on the
  webserver to store objects. This makes it very fast, and able to provide
  atomic read/write features. By default CakePHP in 2.0-2.2 will use this cache
  engine, if it's available.
* ``Wincache`` Wincache uses the `Wincache <https://secure.php.net/wincache>`_
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d
  extension. Wincache is similar to APC in features and performance, but
  optimized for Windows and Microsoft IIS.
* ``XcacheEngine`` `Xcache <http://xcache.lighttpd.net/>`_
  is a PHP extension that provides similar features to APC.
<<<<<<< HEAD
* ``MemcachedEngine`` Uses the `Memcached <http://php.net/memcached>`_
  extension.
* ``RedisEngine`` Uses the `phpredis <https://github.com/nicolasff/phpredis>`_
  extension. Redis provides a fast and persistent cache system similar to
  Memcached, also provides atomic operations.

Regardless of the CacheEngine you choose to use, your application interacts with
:php:class:`Cake\\Cache\\Cache`.

.. _cache-configuration:

Configuring Cache Engines
=========================

.. php:staticmethod:: config($key, $config = null)

Your application can configure any number of 'engines' during its bootstrap
process. Cache engine configurations are defined in **config/app.php**.

For optimal performance CakePHP requires two cache engines to be defined.

* ``_cake_core_`` is used for storing file maps, and parsed results of
  :doc:`/core-libraries/internationalization-and-localization` files.
* ``_cake_model_``, is used to store schema descriptions for your applications
  models.

Using multiple engine configurations also lets you incrementally change the
storage as needed. For example in your **config/app.php** you could put the
following::

    // ...
    'Cache' => [
        'short' => [
            'className' => 'File',
            'duration' => '+1 hours',
            'path' => CACHE,
            'prefix' => 'cake_short_'
        ],
        // Using a fully namespaced name.
        'long' => [
            'className' => 'Cake\Cache\Engine\FileEngine',
            'duration' => '+1 week',
            'probability' => 100,
            'path' => CACHE . 'long' . DS,
        ]
    ]
    // ...

Configuration options can also be provided as a :term:`DSN` string. This is
useful when working with environment variables or :term:`PaaS` providers::

    Cache::config('short', [
        'url' => 'memcached://user:password@cache-host/?timeout=3600&prefix=myapp_',
    ]);

When using a DSN string you can define any additional parameters/options as
query string arguments.

You can also configure Cache engines at runtime::

    // Using a short name
    Cache::config('short', [
        'className' => 'File',
        'duration' => '+1 hours',
        'path' => CACHE,
        'prefix' => 'cake_short_'
    ]);

    // Using a fully namespaced name.
    Cache::config('long', [
        'className' => 'Cake\Cache\Engine\FileEngine',
        'duration' => '+1 week',
        'probability' => 100,
        'path' => CACHE . 'long' . DS,
    ]);
=======
* ``MemcacheEngine`` Uses the `Memcache <https://secure.php.net/memcache>`_
  extension. Memcache provides a very fast cache system that can be
  distributed across many servers, and provides atomic operations.
* ``MemcachedEngine`` Uses the `Memcached <https://secure.php.net/memcached>`_
  extension. It also interfaces with memcache but provides better performance.
* ``RedisEngine`` Uses the `phpredis <https://github.com/nicolasff/phpredis>`_
  extension (2.2.3 minimum). Redis provides a fast and persistent cache system
  similar to memcached, also provides atomic operations.

.. versionchanged:: 2.3
    FileEngine is always the default cache engine. In the past a number of people
    had difficulty setting up and deploying APC correctly both in CLI + web.
    Using files should make setting up CakePHP simpler for new developers.
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

    // Using a constructed object.
    $object = new FileEngine($config);
    Cache::config('other', $object);

The name of these engine configurations ('short' and 'long') are used as the ``$config``
parameter for :php:meth:`Cake\\Cache\\Cache::write()` and
:php:meth:`Cake\\Cache\\Cache::read()`. When configuring cache engines you can
refer to the class name using the following syntaxes::

<<<<<<< HEAD
    // Short name (in App\ or Cake namespaces)
    Cache::config('long', ['className' => 'File']);

    // Plugin short name
    Cache::config('long', ['className' => 'MyPlugin.SuperCache']);
=======
Configuring Cache class
=======================
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

    // Full namespace
    Cache::config('long', ['className' => 'Cake\Cache\Engine\FileEngine']);

    // An object implementing CacheEngineInterface
    Cache::config('long', ['className' => $myCache]);

.. note::

    When using the FileEngine you might need to use the ``mask`` option to
    ensure cache files are made with the correct permissions.

<<<<<<< HEAD
Engine Options
--------------

Each engine accepts the following options:

* ``duration`` Specify how long items in this cache configuration last.
  Specified as a ``strototime()`` compatible expression.
* ``groups`` List of groups or 'tags' associated to every key stored in this
  config.  handy for deleting a complete group from cache.
* ``prefix`` Prepended to all entries. Good for when you need to share
  a keyspace with either another cache config or another application.
* ``probability``` Probability of hitting a cache gc cleanup. Setting to 0 will disable
   ``Cache::gc()`` from ever being called automatically.

FileEngine Options
-------------------

FileEngine uses the following engine specific options:

* ``isWindows`` Automatically populated with whether the host is windows or not
* ``lock`` Should files be locked before writing to them?
* ``mask`` The mask used for created files
* ``path`` Path to where cachefiles should be saved. Defaults to system's temp dir.

RedisEngine Options
-------------------

RedisEngine uses the following engine specific options:

* ``port`` The port your Redis server is running on.
* ``host`` The host your Redis server is running on.
* ``database`` The database number to use for connection.
* ``password`` Redis server password.
* ``persistent`` Should a persistent connection be made to Redis.
* ``timeout`` Connection timeout for Redis.
* ``unix_socket`` Path to a unix socket for Redist.

MemcacheEngine Options
----------------------

- ``compress`` Whether to compress data.
- ``username`` Login to access the Memcache server.
- ``password`` Password to access the Memcache server.
- ``persistent`` The name of the persistent connection. All configurations using
   the same persistent value will share a single underlying connection.
- ``serialize`` The serializer engine used to serialize data. Available engines are php,
   igbinary and json. Beside php, the memcached extension must be compiled with the
   appropriate serializer support.
- ``servers`` String or array of memcached servers. If an array MemcacheEngine will use
   them as a pool.
- ``options`` Additional options for the memcached client. Should be an array of option => value.
   Use the ``\Memcached::OPT_*`` constants as keys.

.. _cache-configuration-fallback:

Configuring Cache Fallbacks
---------------------------

In the event that an engine is not available, such as the ``FileEngine`` trying
to write to an unwritable folder or the ``RedisEngine`` failing to connect to
Redis, the engine will fall back to the noop ``NullEngine`` and trigger a loggable
error. This prevents the application from throwing an uncaught exception due to
cache failure.

You can configure Cache configurations to fall back to a specified config using
the ``fallback`` configuration key::

    Cache::config('redis', [
        'className' => 'Redis',
=======
    // Cache configuration for data that can be cached for a short time only.
    Cache::config('short', array(
        'engine' => 'File',
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d
        'duration' => '+1 hours',
        'prefix' => 'cake_redis_',
        'host' => '127.0.0.1',
        'port' => 6379,
        'fallback' => 'default',
    ]);

<<<<<<< HEAD
If the Redis server unexpectedly failed, writing to the ``redis`` cache
configuration would fall back to writing to the ``default`` cache configuration.
If writing to the ``default`` cache configuration *also* failed in this scenario, the
engine would fall back once again to the ``NullEngine`` and prevent the application
from throwing an uncaught exception.

.. versionadded:: 3.5.0
    Cache engine fallbacks were added.
=======
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
parameter for :php:func:`Cache::write()` and :php:func:`Cache::read()`, e.g. ``Cache::read('my_data', 'short')``.
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

Removing Configured Cache Engines
---------------------------------

.. php:staticmethod:: drop($key)

Once a configuration is created you cannot change it. Instead you should drop
the configuration and re-create it using :php:meth:`Cake\\Cache\\Cache::drop()` and
:php:meth:`Cake\\Cache\\Cache::config()`. Dropping a cache engine will remove
the config and destroy the adapter if it was constructed.

Writing to a Cache
==================

.. php:staticmethod:: write($key, $value, $config = 'default')

<<<<<<< HEAD
``Cache::write()`` will write a $value to the Cache. You can read or
delete this value later by referring to it by ``$key``. You may
specify an optional configuration to store the cache in as well. If
no ``$config`` is specified, default will be used. ``Cache::write()``
can store any type of object and is ideal for storing results of
model finds::
=======
You can provide custom ``Cache`` adapters in ``app/Lib`` as well
as in plugins using ``$plugin/Lib``. App/plugin cache engines can
also override the core engines. Cache adapters must be in a cache
directory. If you had a cache engine named ``MyCustomCacheEngine``
it would be placed in either ``app/Lib/Cache/Engine/MyCustomCacheEngine.php``
as an app/libs or in ``$plugin/Lib/Cache/Engine/MyCustomCacheEngine.php`` as
part of a plugin. Cache configs from plugins need to use the plugin
dot syntax. ::
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

    if (($posts = Cache::read('posts')) === false) {
        $posts = $someService->getAllPosts();
        Cache::write('posts', $posts);
    }

Using ``Cache::write()`` and ``Cache::read()`` to reduce the number
of trips made to the database to fetch posts.

.. note::

    If you plan to cache the result of queries made with the CakePHP ORM,
    it is better to use the built-in cache capabilities of the Query object
    as described in the :ref:`caching-query-results` section

Writing Multiple Keys at Once
-----------------------------

.. php:staticmethod:: writeMany($data, $config = 'default')

You may find yourself needing to write multiple cache keys at once. While you
can use multiple calls to ``write()``, ``writeMany()`` allows CakePHP to use
more efficient storage API's where available. For example using ``writeMany()``
save multiple network connections when using Memcached::

    $result = Cache::writeMany([
        'article-' . $slug => $article,
        'article-' . $slug . '-comments' => $comments
    ]);

    // $result will contain
    ['article-first-post' => true, 'article-first-post-comments' => true]

Read Through Caching
--------------------

.. php:staticmethod:: remember($key, $callable, $config = 'default')

Cache makes it easy to do read-through caching. If the named cache key exists,
it will be returned. If the key does not exist, the callable will be invoked
and the results stored in the cache at the provided key.

For example, you often want to cache remote service call results. You could use
``remember()`` to make this simple::

    class IssueService
    {
        public function allIssues($repo)
        {
            return Cache::remember($repo . '-issues', function () use ($repo) {
                return $this->fetchAll($repo);
            });
        }
    }

Reading From a Cache
====================

.. php:staticmethod:: read($key, $config = 'default')

``Cache::read()`` is used to read the cached value stored under
``$key`` from the ``$config``. If ``$config`` is null the default
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

    // Generate cloud data
    // ...

    // Store data in cache
    Cache::write('cloud', $cloud);
    return $cloud;

Reading Multiple Keys at Once
-----------------------------

.. php:staticmethod:: readMany($keys, $config = 'default')

<<<<<<< HEAD
After you've written multiple keys at once, you'll probably want to read them as
well. While you could use multiple calls to ``read()``, ``readMany()`` allows
CakePHP to use more efficient storage API's where available. For example using
``readMany()`` save multiple network connections when using Memcached::
=======
    :return: The decremented value on success, false otherwise.
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

    $result = Cache::readMany([
        'article-' . $slug,
        'article-' . $slug . '-comments'
    ]);
    // $result will contain
    ['article-first-post' => '...', 'article-first-post-comments' => '...']

Deleting From a Cache
=====================

<<<<<<< HEAD
.. php:staticmethod:: delete($key, $config = 'default')
=======
    :return: The incremented value on success, false otherwise.
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

``Cache::delete()`` will allow you to completely remove a cached
object from the store::

    // Remove a key
    Cache::delete('my_key');

Deleting Multiple Keys at Once
------------------------------

<<<<<<< HEAD
.. php:staticmethod:: deleteMany($keys, $config = 'default')
=======
.. php:method:: add($key, $value)

    Set a value in the cache if it did not already exist. Should use
    an atomic check and set where possible.

    .. versionadded:: 2.8
        add method was added in 2.8.0.

Using Cache to store common query results
=========================================
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

After you've written multiple keys at once, you may want to delete them.  While
you could use multiple calls to ``delete()``, ``deleteMany()`` allows CakePHP to use
more efficient storage API's where available. For example using ``deleteMany()``
save multiple network connections when using Memcached::

    $result = Cache::deleteMany([
        'article-' . $slug,
        'article-' . $slug . '-comments'
    ]);
    // $result will contain
    ['article-first-post' => true, 'article-first-post-comments' => true]

Clearing Cached Data
====================

.. php:staticmethod:: clear($check, $config = 'default')

<<<<<<< HEAD
Destroy all cached values for a cache configuration. In engines like: Apc,
Memcached, and Wincache, the cache configuration's prefix is used to remove
cache entries. Make sure that different cache configurations have different
prefixes::
=======
As of 2.5 you can accomplish the above much more simple by using
:php:meth:`Cache::remember()`. Assuming you are using PHP 5.3 or
newer, using the ``remember()`` method would look like::
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

    // Will only clear expired keys.
    Cache::clear(true);

    // Will clear all keys.
    Cache::clear(false);

.. php:staticmethod:: gc($config)

Garbage collects entries in the cache configuration. This is primarily
used by FileEngine. It should be implemented by any Cache engine
that requires manual eviction of cached data.

.. note::

    Because APC and Wincache use isolated caches for webserver and CLI they
    have to be cleared separately (CLI cannot clear webserver and vice versa).

Using Cache to Store Counters
=============================

<<<<<<< HEAD
.. php:staticmethod:: increment($key, $offset = 1, $config = 'default')

.. php:staticmethod:: decrement($key, $offset = 1, $config = 'default')

Counters in your application are good candidates for storage in a cache.  As an
example, a simple countdown for remaining 'slots' in a contest could be stored
in Cache. The Cache class exposes atomic ways to increment/decrement counter
values in an easy way. Atomic operations are important for these values as it
reduces the risk of contention, and ability for two users to simultaneously
lower the value by one, resulting in an incorrect value.
=======
Counters for various things are easily stored in a cache. For example, a simple
countdown for remaining 'slots' in a contest could be stored in Cache. The
Cache class exposes atomic ways to increment/decrement counter values in an easy
way. Atomic operations are important for these values as it reduces the risk of
contention, a scenario where two users simultaneously lower the value by one,
resulting in an incorrect value.
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

After setting an integer value you can manipulate it using ``increment()`` and
``decrement()``::

    Cache::write('initial_count', 10);

    // Later on
    Cache::decrement('initial_count');

    // Or
    Cache::increment('initial_count');

.. note::

    Incrementing and decrementing do not work with FileEngine. You should use
    APC, Wincache, Redis or Memcached instead.

Using Cache to Store Common Query Results
=========================================

You can greatly improve the performance of your application by putting results
that infrequently change, or that are subject to heavy reads into the cache.
A perfect example of this are the results from
:php:meth:`Cake\\ORM\\Table::find()`. The Query object allows you to cache
results using the ``cache()`` method. See the :ref:`caching-query-results` section
for more information.

Using Groups
============

Sometimes you will want to mark multiple cache entries to belong to certain
group or namespace. This is a common requirement for mass-invalidating keys
whenever some information changes that is shared among all entries in the same
group. This is possible by declaring the groups in cache configuration::

    Cache::config('site_home', [
        'className' => 'Redis',
        'duration' => '+999 days',
        'groups' => ['comment', 'article']
    ]);

.. php:method:: clearGroup($group, $config = 'default')

Let's say you want to store the HTML generated for your homepage in cache, but
would also want to automatically invalidate this cache every time a comment or
post is added to your database. By adding the groups ``comment`` and ``article``,
we have effectively tagged any key stored into this cache configuration with
both group names.

For instance, whenever a new post is added, we could tell the Cache engine to
remove all entries associated to the ``article`` group::

    // src/Model/Table/ArticlesTable.php
    public function afterSave($event, $entity, $options = [])
    {
        if ($entity->isNew()) {
            Cache::clearGroup('article', 'site_home');
        }
    }

.. php:staticmethod:: groupConfigs($group = null)

``groupConfigs()`` can be used to retrieve mapping between group and
configurations, i.e.: having the same group::

    // src/Model/Table/ArticlesTable.php

    /**
     * A variation of previous example that clears all Cache configurations
     * having the same group
     */
    public function afterSave($event, $entity, $options = [])
    {
        if ($entity->isNew()) {
            $configs = Cache::groupConfigs('article');
            foreach ($configs['article'] as $config) {
                Cache::clearGroup('article', $config);
            }
        }
    }

Groups are shared across all cache configs using the same engine and same
prefix. If you are using groups and want to take advantage of group deletion,
choose a common prefix for all your configs.

Globally Enable or Disable Cache
================================

.. php:staticmethod:: disable()

You may need to disable all Cache read & writes when trying to figure out cache
expiration related issues. You can do this using ``enable()`` and
``disable()``::

    // Disable all cache reads, and cache writes.
    Cache::disable();

Once disabled, all reads and writes will return ``null``.

.. php:staticmethod:: enable()

Once disabled, you can use ``enable()`` to re-enable caching::

    // Re-enable all cache reads, and cache writes.
    Cache::enable();

.. php:staticmethod:: enabled()

If you need to check on the state of Cache, you can use ``enabled()``.

Creating a Cache Engine
=======================

You can provide custom ``Cache`` engines in ``App\Cache\Engine`` as well
as in plugins using ``$plugin\Cache\Engine``. Cache engines must be in a cache
directory. If you had a cache engine named ``MyCustomCacheEngine``
it would be placed in either **src/Cache/Engine/MyCustomCacheEngine.php**.
Or in **plugins/MyPlugin/src/Cache/Engine/MyCustomCacheEngine.php** as
part of a plugin. Cache configs from plugins need to use the plugin
dot syntax::

    Cache::config('custom', [
        'className' => 'MyPlugin.MyCustomCache',
        // ...
    ]);

Custom Cache engines must extend :php:class:`Cake\\Cache\\CacheEngine` which
defines a number of abstract methods as well as provides a few initialization
methods.

The required API for a CacheEngine is

.. php:class:: CacheEngine

    The base class for all cache engines used with Cache.

.. php:method:: write($key, $value, $config = 'default')

<<<<<<< HEAD
    :return: boolean for success.
=======
    ``Cache::set()`` allows you to temporarily override a cache config's
    settings for one operation (usually a read or write). If you use
    ``Cache::set()`` to change the settings for a write, you should
    also use ``Cache::set()`` before reading the data back in. If you
    fail to do so, the default settings will be used when the cache key
    is read. ::
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

    Write value for a key into cache, optional string $config
    specifies configuration name to write to.

.. php:method:: read($key)

    :return: The cached value or ``false`` for failure.

    Read a key from the cache. Return ``false`` to indicate
    the entry has expired or does not exist.

.. php:method:: delete($key)

    :return: Boolean ``true`` on success.

    Delete a key from the cache. Return ``false`` to indicate that
    the entry did not exist or could not be deleted.

.. php:method:: clear($check)

<<<<<<< HEAD
    :return: Boolean ``true`` on success.
=======
.. php:staticmethod:: add($key, $value, $config = 'default')

    Add data to the cache, but only if the key does not exist already.
    In the case that data did exist, this method will return false.
    Where possible data is checked & set atomically.

    .. versionadded:: 2.8
        add method was added in 2.8.0.

.. php:staticmethod:: clear($check, $config = 'default')
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

    Delete all keys from the cache. If $check is ``true``, you should
    validate that each value is actually expired.

.. php:method:: clearGroup($group)

    :return: Boolean ``true`` on success.

    Delete all keys from the cache belonging to the same group.

.. php:method:: decrement($key, $offset = 1)

    :return: Boolean ``true`` on success.

    Decrement a number under the key and return decremented value

.. php:method:: increment($key, $offset = 1)

    :return: Boolean ``true`` on success.

    Increment a number under the key and return incremented value

.. php:method:: gc()

    Not required, but used to do clean up when resources expire.
    FileEngine uses this to delete files containing expired content.


.. meta::
    :title lang=en: Caching
    :keywords lang=en: uniform api,xcache,cache engine,cache system,atomic operations,php class,disk storage,static methods,php extension,consistent manner,similar features,apc,memcache,queries,cakephp,elements,servers,memory
