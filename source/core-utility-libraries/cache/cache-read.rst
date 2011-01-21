8.7.1 Cache::read()
-------------------

Cache::read($key, $config = null)

Cache::read() is used to read the cached value stored under
``$key`` from the ``$config``. If $config is null the default
config will be used. ``Cache::read()`` will return the cached value
if it is a valid cache or ``false`` if the cache has expired or
doesn't exist. The contents of the cache might evaluate false, so
make sure you use the strict comparison operator ``===`` or
``!==``.

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

8.7.1 Cache::read()
-------------------

Cache::read($key, $config = null)

Cache::read() is used to read the cached value stored under
``$key`` from the ``$config``. If $config is null the default
config will be used. ``Cache::read()`` will return the cached value
if it is a valid cache or ``false`` if the cache has expired or
doesn't exist. The contents of the cache might evaluate false, so
make sure you use the strict comparison operator ``===`` or
``!==``.

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
