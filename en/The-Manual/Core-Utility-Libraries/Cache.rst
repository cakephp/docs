Cache
#####

The Cache class in CakePHP provides a generic frontend for several
backend caching systems. Different Cache configurations and engines can
be setup in your app/config/core.php

Cache::read()
=============

Cache::read($key, $config = null)

Cache::read() is used to read the cached value stored under ``$key``
from the ``$config``. If $config is null the default config will be
used. ``Cache::read()`` will return the cached value if it is a valid
cache or ``false`` if the cache has expired or doesn't exist. The
contents of the cache might evaluate false, so make sure you use the
strict comparison operator ``===`` or ``!==``.

For example:

::

    $cloud = Cache::read('cloud');

    if ($cloud !== false) {
        return $cloud;
    }

    // generate cloud data
    // ...

    // store data in cache
    Cache::write('cloud', $cloud);
    return $cloud;

Cache::write()
==============

Cache::write($key, $value, $config = null);

Cache::write() will write a $value to the Cache. You can read or delete
this value later by refering to it by ``$key``. You may specify an
optional configuration to store the cache in as well. If no ``$config``
is specified default will be used. Cache::write() can store any type of
object and is ideal for storing results of model finds.

::

        if (($posts = Cache::read('posts')) === false) {
            $posts = $this->Post->find('all');
            Cache::write('posts', $posts);
        }

Using Cache::write() and Cache::read() to easily reduce the number of
trips made to the database to fetch posts.

Cache::delete()
===============

Cache::delete($key, $config = null)

``Cache::delete()`` will allow you to completely remove a cached object
from the Cache store.

Cache::config()
===============

``Cache::config()`` is used to create additional Cache configurations.
These additional configurations can have different duration, engines,
paths, or prefixes than your default cache config. Using multiple cache
configurations can help reduce the number of times you need to use
``Cache::set()`` as well as centralize all your cache settings.

You must specify which engine to use. It does **not** default to File.

::

    Cache::config('short', array(  
        'engine' => 'File',  
        'duration'=> '+1 hours',  
        'path' => CACHE,  
        'prefix' => 'cake_short_'
    ));

    // long  
    Cache::config('long', array(  
        'engine' => 'File',  
        'duration'=> '+1 week',  
        'probability'=> 100,  
        'path' => CACHE . 'long' . DS,  
    ));

By placing the above code in your ``app/config/core.php`` you will have
two additional Cache configurations. The name of these configurations
'short' or 'long' is used as the ``$config`` parameter for
``Cache::write()`` and ``Cache::read()``.

You can provide custom ``Cache`` adapters in ``app/libs`` as well as in
plugins using ``$plugin/libs``. App/plugin cache engines can also
override the core engines. Cache adapters must be in a cache directory.
If you had a cache engine named ``MyCustomCacheEngine`` it would be
placed in either ``app/libs/cache/my_custom_cache.php`` as an app/libs.
Or in ``$plugin/libs/cache/my_custom_cache.php`` as part of a plugin.
Cache configs from plugins need to use the plugin dot syntax.

::

    Cache::config('custom', array(
        'engine' => 'CachePack.MyCustomCache',
        ...
    ));

App and Plugin cache engines should be configured in
``app/bootstrap.php``. If you try to configure them in core.php they
will not work correctly.

Cache::set()
============

``Cache::set()`` allows you to temporarily override a cache configs
settings for one operation (usually a read or write). If you use
``Cache::set()`` to change the settings for a write, you should also use
``Cache::set()`` before reading the data back in. If you fail to do so,
the default settings will be used when the cache key is read.

::


    Cache::set(array('duration' => '+30 days'));
    Cache::write('results', $data);

    // Later on

    Cache::set(array('duration' => '+30 days'));
    $results = Cache::read('results');

If you find yourself repeatedly calling ``Cache::set()`` perhaps you
should create a new :doc:`/The-Manual/Core-Utility-Libraries/Cache`.
This will remove the need to call ``Cache::set()``.
