8.7.2 Cache::write()
--------------------

Cache::write($key, $value, $config = null);

Cache::write() will write a $value to the Cache. You can read or
delete this value later by refering to it by ``$key``. You may
specify an optional configuration to store the cache in as well. If
no ``$config`` is specified default will be used. Cache::write()
can store any type of object and is ideal for storing results of
model finds.

::

        if (($posts = Cache::read('posts')) === false) {
            $posts = $this->Post->find('all');
            Cache::write('posts', $posts);
        }

Using Cache::write() and Cache::read() to easily reduce the number
of trips made to the database to fetch posts.
