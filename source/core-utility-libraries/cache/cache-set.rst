8.7.5 Cache::set()
------------------

``Cache::set()`` allows you to temporarily override a cache configs
settings for one operation (usually a read or write). If you use
``Cache::set()`` to change the settings for a write, you should
also use ``Cache::set()`` before reading the data back in. If you
fail to do so, the default settings will be used when the cache key
is read.

::

    
    Cache::set(array('duration' => '+30 days'));
    Cache::write('results', $data);
    
    // Later on
    
    Cache::set(array('duration' => '+30 days'));
    $results = Cache::read('results');

If you find yourself repeatedly calling ``Cache::set()`` perhaps
you should create a new
`Cache configuration </view/1515/Cache-config>`_. This will remove
the need to call ``Cache::set()``.

8.7.5 Cache::set()
------------------

``Cache::set()`` allows you to temporarily override a cache configs
settings for one operation (usually a read or write). If you use
``Cache::set()`` to change the settings for a write, you should
also use ``Cache::set()`` before reading the data back in. If you
fail to do so, the default settings will be used when the cache key
is read.

::

    
    Cache::set(array('duration' => '+30 days'));
    Cache::write('results', $data);
    
    // Later on
    
    Cache::set(array('duration' => '+30 days'));
    $results = Cache::read('results');

If you find yourself repeatedly calling ``Cache::set()`` perhaps
you should create a new
`Cache configuration </view/1515/Cache-config>`_. This will remove
the need to call ``Cache::set()``.
