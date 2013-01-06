Cache
#####

CakePHP
のキャッシュ(\ *Cache*)クラスは、いくつかのバックエンドのキャッシュシステムのための、一般的なフロントエンドを提供します。キャッシュの設定やエンジンの切り替えは、
app/config/core.php でセットアップできます。

Cache::read()
=============

Cache::read($key, $config = null)

Cache::read() は、 ``$config`` から、 ``$key``
に関連付けられて格納されているキャッシュの値を読み込みます。$config が
null
であった場合、デフォルトのコンフィグが利用されます。\ ``Cache::read()``
は、有効なキャッシュであった場合、キャッシュの値を返し、キャッシュが有効期限切れであったり存在しなかった場合は、\ ``false``
を返します。

Cache::write()
==============

Cache::write($key, $value, $config = null);

Cache::write() はキャッシュに $value を書き込みます。\ ``$key``
を参照することで、この値を読み込んだり削除したりすることができます。また、キャッシュを格納するコンフィグレーションを特定することもできます。\ ``$config``
が指定されなかった場合、デフォルトが使用されます。Cache::write()
にはあらゆる型のオブジェクトを格納することができ、モデルのデータを完全に格納することもできます。

::

        if (($posts = Cache::read('posts')) === false) {
            $posts = $this->Post->find('all');
            Cache::write('posts', $posts);
        }

Cache::write() と Cache::read()
を利用することで、モデルがデータベースから posts
を取得する回数を、容易に削減することができます。

Cache::delete()
===============

Cache::delete($key, $config = null)

``Cache::delete()``
はキャッシュに格納されているオブジェクトを完全に削除します。

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

Cache::set()
============

``Cache::set()`` は、一つの操作(通常は read または
write)のために、一時的にキャッシュ設定のセッティングを上書きします。もし
write のためにセッティングを変更するなら、データを読みにいく前に
``Cache::set()``
を使用してください。これを行わなかった場合、デフォルトのキャッシュのキーが読み込まれます。

::


    Cache::set(array('duration' => '+30 days'));
    Cache::write('results', $data);

    // Later on

    Cache::set(array('duration' => '+30 days'));
    $results = Cache::read('results');

``Cache::set()``
を繰り返し呼び出しているなら、新しい\ `キャッシュの設定 </ja/view/772/Cache-config>`_\ を作るべきかもしれません。そうすることで、
``Cache::set()`` を呼び出す必要がなくなります。
