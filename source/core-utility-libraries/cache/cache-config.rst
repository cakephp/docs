8.7.4 Cache::config()
---------------------

``Cache::config()`` is used to create additional Cache
configurations. These additional configurations can have different
duration, engines, paths, or prefixes than your default cache
config. Using multiple cache configurations can help reduce the
number of times you need to use ``Cache::set()`` as well as
centralize all your cache settings.

You must specify which engine to use. It does **not** default to
File.

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

By placing the above code in your ``app/config/core.php`` you will
have two additional Cache configurations. The name of these
configurations 'short' or 'long' is used as the ``$config``
parameter for ``Cache::write()`` and ``Cache::read()``.

You can provide custom ``Cache`` adapters in ``app/libs`` as well
as in plugins using ``$plugin/libs``. App/plugin cache engines can
also override the core engines. Cache adapters must be in a cache
directory. If you had a cache engine named ``MyCustomCacheEngine``
it would be placed in either ``app/libs/cache/my_custom_cache.php``
as an app/libs. Or in ``$plugin/libs/cache/my_custom_cache.php`` as
part of a plugin. Cache configs from plugins need to use the plugin
dot syntax.

::

    Cache::config('custom', array(
        'engine' => 'CachePack.MyCustomCache',
        ...
    ));

App and Plugin cache engines should be configured in
``app/bootstrap.php``. If you try to configure them in core.php
they will not work correctly.
