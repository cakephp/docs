キャッシュ
##########

.. php:namespace::  Cake\Cache

.. php:class:: Cache

キャッシュは、外部のリソースからの読み込みや作成にかかる時間を短縮するためによく使用されます。
遅いリソースから速く読み込むためにもよく使用されます。頻繁に変更されない、遅いクエリの結果や
リモートのウェブサービスへのアクセスをキャッシュに保存することができます。
一旦キャッシュに保存されると、保存されたリソースのキャッシュからの再読み込みは、
リモートリソースへのアクセスより高速です。

CakePHP のキャッシュは、主に ``Chache`` クラスを使用します。
このクラスは、すべての異なる種類のキャッシュの実装を扱うための、統一された API を提供する、
静的なメソッドを持ちます。CakePHP にはいくつかの組み込みのキャッシュエンジンが用意されていて、
独自のキャッシュシステムを実装するための簡単な仕組みを提供します。
以下が、組み込みのキャッシュエンジンです。

* ``FileCache`` File キャッシュはローカルファイルを使用するシンプルなキャッシュです。
  最も遅いキャッシュエンジンで、アトミックな操作のための多くの機能を持ちません。
  しかし、ディスクストレージは非常に安価なので、頻繁に書き込みが行なわれない
  大きなオブジェクトや要素の保存はファイルに適しています。
* ``ApcCache`` APC キャッシュは、PHP の `APCu <http://php.net/apcu>`_ 拡張を使用します。
  この拡張はオブジェクトを保存するためにウェブサーバ上の共有メモリを使います。
  これはとても高速で、かつアトミックな読み込み/書き込みの機能を提供することが可能になります。
* ``Wincache`` Wincache は `Wincache <http://php.net/wincache>`_ 拡張を使います。
  Wincache は APC と同様の機能とパフォーマンスを持ちますが、Windows と IIS に最適化されています。
* ``XcacheEngine`` `Xcache <http://xcache.lighttpd.net/>`_
  は APC と同様の機能を持つ PHP 拡張です。
* ``MemcachedEngine`` `Memcached <http://php.net/memcached>`_ 拡張を使います。
* ``RedisEngine`` `phpredis <https://github.com/nicolasff/phpredis>`_ 拡張を使います。
  Redis は高速で、Memcached と同様の永続キャッシュシステム、アトミックな操作を提供します。

あなたが選択したキャッシュエンジンに関わらず、
アプリケーションは一貫した方法で :php:class:`Cake\\Cache\\Cache` とやり取りします。
あなたはアプリケーションが大きくなるにつれてキャッシュエンジンを交換することができます。

.. _cache-configuration:

Cache クラスの設定
==================

.. php:staticmethod:: config($key, $config = null)

キャッシュクラスの設定はどこでもできますが、一般的には、ブート処理中に設定を行ないます。
**config/app.php** ファイルで行なうのが従来からの慣習です。あなたは必要なだけ、
キャッシュの設定ができます。そして、複数のキャッシュエンジンを使用できます。
CakePHP は、２つの内部的なキャッシュの設定を使用します。 ``_cake_core_`` は、
ファイル構成の保存と、 :doc:`/core-libraries/internationalization-and-localization`
ファイルの結果のパースに使用されます。 ``_cake_model_`` は、アプリケーション上のモデルに対する
スキーマの説明を保存するために使用されます。もし、 APC や Memcached を使用している場合、
コアのキャッシュにはユニークなキーをセットしておくべきです。これは、複数アプリケーションで
別のアプリケーションのキャッシュデータを上書きしてしまうのを避けてくれます。

複数の設定を使用することで、必要なだけストレージを変更できます。
例えば、以下のように **config/app.php** に設定できます。 ::

    // ...
    'Cache' => [
        'short' => [
            'className' => 'File',
            'duration' => '+1 hours',
            'path' => CACHE,
            'prefix' => 'cake_short_'
        ],
        // 完全な名前空間つきの名前を使用。
        'long' => [
            'className' => 'Cake\Cache\Engine\FileEngine',
            'duration' => '+1 week',
            'probability' => 100,
            'path' => CACHE . 'long' . DS,
        ]
    ]
    // ...

オプション設定は :term:`DSN` を指定することもできます。
これは環境変数や :term:`PaaS` プロバイダーと一緒に動作するときに便利です。 ::

    Cache::config('short', [
        'url' => 'memcached://user:password@cache-host/?timeout=3600&prefix=myapp_',
    ]);

DSN を使用するとき、追加のクエリストリング要素としてパラメーターやオプションが定義できます。

実行時におけるキャッシュエンジンの設定もできます。 ::

    // 短い名前で
    Cache::config('short', [
        'className' => 'File',
        'duration' => '+1 hours',
        'path' => CACHE,
        'prefix' => 'cake_short_'
    ]);

    // 完全な名前空間つきの名前を使用。
    Cache::config('long', [
        'className' => 'Cake\Cache\Engine\FileEngine',
        'duration' => '+1 week',
        'probability' => 100,
        'path' => CACHE . 'long' . DS,
    ]);

    // オブジェクトで
    $object = new FileEngine($config);
    Cache::config('other', $object);

'short' や 'long' という設定名は :php:meth:`Cake\\Cache\\Cache::write()` と
:php:meth:`Cake\\Cache\\Cache::read()` の ``$config`` パラメータとして使われます。
キャッシュエンジンを設定する場合は、次の構文を使用してクラス名を参照することができます。

* 'Engine' または名前空間を含まない短いクラス名。これは、あなたが使いたいキャッシュエンジンを
  ``Cake\Cache\Engine`` か ``App\Cache\Engine`` のどちらかであると推測します。
* :term:`プラグイン記法` は、特定のプラグインからエンジンをロードすることを可能にします。
* 完全に修飾された名前空間つきのクラス名は、従来の場所の外に位置するクラスの使用を可能にします。
* ``CacheEngine`` クラスを継承したオブジェクト。

.. note::

    FileEndine 使用時に、正しいパーミッションでのキャッシュファイルを指定して作成するには、
    ``mask`` オプションの設定が必要です。

設定されたキャッシュエンジンを削除する
--------------------------------------

.. php:staticmethod:: drop($key)

一度設定が作成されたら、変更することはできません。代わりに、
:php:meth:`Cake\\Cache\\Cache::drop()` と :php:meth:`Cake\\Cache\\Cache::config()`
を使用して、設定を削除して再作成する必要があります。キャッシュエンジンを削除すると、設定が削除され、
アダプターが構築されていれば破棄されます。

キャッシュへの書き込み
======================

.. php:staticmethod:: write($key, $value, $config = 'default')

``Cache::write()`` はキャッシュに $value を書き込みます。
この値は後で ``$key`` で参照したり、削除したりすることができます。
オプションの設定を指定して、キャッシュを保存することもできます。
``$config`` を指定しない場合、デフォルトが使用されます。
``Cache::write()`` はあらゆるタイプのオブジェクトを格納することができ、
以下のようにモデルの結果を格納するのに理想的です。 ::

    if (($posts = Cache::read('posts')) === false) {
        $posts = $someService->getAllPosts();
        Cache::write('posts', $posts);
    }

``Cache::write()`` と ``Cache::read()`` を使用して、データベースへのアクセスを減らし、
posts を取得しています。

.. note::

    CakePHP ORM で作成したクエリの結果をキャッシュする場合は、 :ref:`caching-query-results`
    セクションで説明しているように、Query オブジェクトのビルトインキャッシュ機能を使用する方が良いです。

一度に複数のキーを書き込む
--------------------------

.. php:staticmethod:: writeMany($data, $config = 'default')

一度に複数のキャッシュキーを書き込む必要が出るかもしれません。
``write()`` を複数回呼び出すこともできますが、 ``writeMany()`` は
CakePHP がより効率的なストレージ API を使用できるようにします。
例えば Memcached を使用する場合、 ``writeMany()`` を使用して、
複数回のネットワーク接続を節約できます。 ::

    $result = Cache::writeMany([
        'article-' . $slug => $article,
        'article-' . $slug . '-comments' => $comments
    ]);

    // $result は以下を含みます
    ['article-first-post' => true, 'article-first-post-comments' => true]

Read-through キャッシュ
-----------------------

.. php:staticmethod:: remember($key, $callable, $config = 'default')

Cache を使用すると、Read-through キャッシュを簡単に行うことができます。
指定されたキャッシュキーが存在する場合、それが返されます。
キーが存在しない場合、呼び出し可能オブジェクトが呼び出され、結果がキャッシュに格納されます。

たとえば、リモートサービスコールの結果をキャッシュすることがよくあります。
あなたはこれをシンプルにするために ``remember()`` を使うことができます。 ::

    class IssueService
    {

        public function allIssues($repo)
        {
            return Cache::remember($repo . '-issues', function () use ($repo) {
                return $this->fetchAll($repo);
            });
        }

    }


キャッシュからの読み込み
========================

.. php:staticmethod:: read($key, $config = 'default')

``Cache::read()`` は、 ``$key`` 配下に格納されたキャッシュされた値を
``$config`` から読み込むために使用されます。 ``$config`` が null の場合、
デフォルトの設定が使用されます。 ``Cache::read()`` は、有効なキャッシュであれば
キャッシュされた値を返し、キャッシュが期限切れになっているか存在しない場合は ``false`` を返します。
キャッシュの内容は false と評価される可能性があるので、必ず厳密な比較演算子
``===`` または ``!==`` を使用してください。

例::

    $cloud = Cache::read('cloud');

    if ($cloud !== false) {
        return $cloud;
    }

    // クラウドデータを生成する
    // ...

    // キャッシュにデータを保存する
    Cache::write('cloud', $cloud);
    return $cloud;

一度に複数のキーを読み込む
--------------------------

.. php:staticmethod:: readMany($keys, $config = 'default')

一度に複数のキーを書き込んだ後、あなたは恐らくそれらを同様に読み込みたいでしょう。
``read()`` を複数回呼び出すこともできますが、 ``readMany()`` は CakePHP が
より効率的なストレージ API を使用できるようにします。例えば Memcached を使用している場合、
``readMany()`` を使用して、複数回のネットワーク接続を節約できます。 ::

    $result = Cache::readMany([
        'article-' . $slug,
        'article-' . $slug . '-comments'
    ]);
    // $result は以下を含みます
    ['article-first-post' => '...', 'article-first-post-comments' => '...']


キャッシュからの削除
====================

.. php:staticmethod:: delete($key, $config = 'default')

``Cache::delete()`` を使うと、キャッシュされたオブジェクトをストアから完全に削除できます。 ::

    // キーの削除
    Cache::delete('my_key');

一度に複数のキーの削除
----------------------

.. php:staticmethod:: deleteMany($keys, $config = 'default')

一度に複数のキーを書き込んだら、それらを削除したいかもしれません。
``delete()`` を複数回呼び出すこともできますが、 ``deleteMany()`` は CakePHP が
より効率的なストレージ API を使用できるようにします。例えば Memcached を使用している場合、
``deleteMany()`` を使用して、複数回のネットワーク接続を節約できます。 ::

    $result = Cache::deleteMany([
        'article-' . $slug,
        'article-' . $slug . '-comments'
    ]);
    // $result は以下を含みます
    ['article-first-post' => true, 'article-first-post-comments' => true]


キャッシュデータのクリア
========================

.. php:staticmethod:: clear($check, $config = 'default')

キャッシュ設定から、すべてのキャッシュされた値を破棄します。Apc、Memcached、Wincache
などのエンジンでは、キャッシュ設定のプレフィックスを使用してキャッシュエントリを削除します。
異なるキャッシュ設定には異なる接頭辞が付いていることを確認してください。 ::

    // 有効期限切れのキーのみをクリアする。
    Cache::clear(true);

    // すべてのキーをクリアする。
    Cache::clear(false);


.. php:staticmethod:: gc($config)

キャッシュ設定内のガーベージコレクトエントリ。これは主に FileEngine で使用されます。
キャッシュされたデータを手動で削除する必要のある任意のキャッシュエンジンによって実装される必要があります。

.. note::

    APC と Wincache は、ウェブサーバーと CLI 用に分離されたキャッシュを使用するため、
    別々にクリアする必要があります。（CLI ではウェブサーバーのキャッシュをクリアできません）

キャッシュを使用してカウンタを保存する
======================================

.. php:staticmethod:: increment($key, $offset = 1, $config = 'default')

.. php:staticmethod:: decrement($key, $offset = 1, $config = 'default')

アプリケーション内のカウンタは、キャッシュに保存するのに適しています。
例として、コンテストの残りの「枠」の単純なカウントダウンをキャッシュに格納することができます。
Cache クラスは簡単な方法でカウンタ値をインクリメント/デクリメントするアトミックな方法を公開しています。
競合のリスクを軽減し、同時に2人のユーザーが値を1つ下げて誤った値にする可能性があるため、
これらの値にはアトミック操作が重要です。

整数値を設定した後、 ``increment()`` および ``decrement()`` を使用して整数値を操作できます。 ::

    Cache::write('initial_count', 10);

    // 設定した後に
    Cache::decrement('initial_count');

    // または
    Cache::increment('initial_count');

.. note::

    インクリメントとデクリメントは FileEngine では機能しません。
    代わりに、APC、Wincache、Redis または Memcached を使用する必要があります。


キャッシュを使用して共通のクエリ結果を格納する
==============================================

まれにしか変更されない、またはキャッシュに大量の読み込みが行われるような結果をキャッシュすることによって、
アプリケーションのパフォーマンスを大幅に向上させることができます。
この完璧な例は、 :php:meth:`Cake\\ORM\\Table::find()` の結果です。
この Query オブジェクトを使用すると、 ``cache()`` メソッドを使用して結果をキャッシュできます。
詳細は、 :ref:`caching-query-results` セクションを参照してください。

グループの使用
==============

たまに、複数のキャッシュエントリを特定のグループまたは名前空間に属するようにマークしたい場合があります。
同じグループ内のすべてのエントリで共有される情報が変更されるたびに、キーを大量に無効化したいというのは
一般的な要件です。これは、キャッシュ設定でグループを宣言することで可能です。 ::

    Cache::config('site_home', [
        'className' => 'Redis',
        'duration' => '+999 days',
        'groups' => ['comment', 'article']
    ]);

.. php:method:: clearGroup($group, $config = 'default')

ホームページに生成された HTML をキャッシュに保存したいが、
コメントや投稿がデータベースに追加されるたびにこのキャッシュを自動的に無効にしたいとします。
``comment`` と ``article`` グループを追加することで、このキャッシュ設定に保存されているキーに、
両方のグループ名で効果的にタグを付けできます。

たとえば、新しい投稿が追加されるたびに、 ``article`` グループに関連付けられたすべてのエントリを
削除するように Cache エンジンに指示できます。 ::

    // src/Model/Table/ArticlesTable.php
    public function afterSave($entity, $options = [])
    {
        if ($entity->isNew()) {
            Cache::clearGroup('article', 'site_home');
        }
    }

.. php:staticmethod:: groupConfigs($group = null)

``groupConfigs()`` を使用すると、グループと設定の間のマッピングを取得できます。
つまり、同じグループを持ちます。 ::

    // src/Model/Table/ArticlesTable.php

    /**
     * すべてのキャッシュ設定をクリアする前述の例のバリエーション
     * 同じグループを持つ
     */
    public function afterSave($entity, $options = [])
    {
        if ($entity->isNew()) {
            $configs = Cache::groupConfigs('article');
            foreach ($configs['article'] as $config) {
                Cache::clearGroup('article', $config);
            }
        }
    }

グループは、同じエンジンと同じ接頭辞を使用して、すべてのキャッシュ設定で共有されます。
グループを使用していて、グループの削除を使用する場合は、すべての設定の共通プレフィックスを選択します。

全体的にキャッシュを有効または無効にする
========================================

.. php:staticmethod:: disable()

キャッシュの有効期限に関連する問題を把握しようとするときに、
キャッシュの読み込みと書き込みをすべて無効にする必要があります。
``enable()`` と ``disable()`` を使ってこれを行うことができます。 ::

    // すべてのキャッシュ読み取りとキャッシュ書き込みを無効にする。
    Cache::disable();

無効にすると、すべての読み込みと書き込みは ``null`` を返却します。

.. php:staticmethod:: enable()

無効にすると、 ``enable()`` を使用してキャッシュを再び有効にすることができます。 ::

    // すべてのキャッシュの読み込みと書き込みを再び有効にする。
    Cache::enable();

.. php:staticmethod:: enabled()

もしキャッシュの状態を確認する必要がある場合は、 ``enabled()`` を使用してください。


キャッシュ用ストレージエンジンの作成
====================================

``App\Cache\Engine`` と ``$plugin\Cache\Engine`` を使用してカスタムした
``Cache`` のアダプターをプラグインとして提供することができます。
src/plugin キャッシュエンジンは、コアエンジンをオーバーライドすることもできます。
キャッシュアダプターはキャッシュディレクトリー内になければなりません。
``MyCustomCacheEngine`` という名前のキャッシュエンジンがあれば、 app/libs として
**src/Cache/Engine/MyCustomCacheEngine.php** に置かれます。
または、プラグインの一環として、 **plugin/Cache/Engine/MyCustomCacheEngine.php** に置かれます。
プラグインのキャッシュ設定は、プラグインドット構文を使用する必要があります。 ::

    Cache::config('custom', [
        'className' => 'CachePack.MyCustomCache',
        // ...
    ]);

カスタムキャッシュエンジンは、いくつかの抽象メソッドを定義するだけでなく、
いくつかの初期化メソッドを提供する :php:class:`Cake\\Cache\\CacheEngine` を拡張する必要があります。

キャッシュエンジンに必要な API は次のとおりです。

.. php:class:: CacheEngine

    Cache で使用されるすべてのキャッシュエンジンの基本クラス。

.. php:method:: write($key, $value, $config = 'default')

    :return: 成功時に boolean

    キーの値をキャッシュに書き込みます。
    省略可能な文字列 $config は、書き込む設定名を指定します。

.. php:method:: read($key)

    :return: キャッシュ値または失敗時に ``false`` 。

    キャッシュからキーを読み取ります。
    エントリが期限切れまたは存在しないことを示す場合は ``false`` を返します。

.. php:method:: delete($key)

    :return: Boolean 成功時に ``true``

    キャッシュからキーを削除します。
    エントリが存在しなかったか、削除できなかったことを示す場合は ``false`` を返します。

.. php:method:: clear($check)

    :return: Boolean 成功時に ``true``

    キャッシュからすべてのキーを削除します。
    $check が ``true`` の場合、各値が実際に期限切れであることを検証する必要があります。

.. php:method:: clearGroup($group)

    :return: Boolean 成功時に ``true``

    同じグループに属するキャッシュからすべてのキーを削除します。

.. php:method:: decrement($key, $offset = 1)

    :return: Boolean 成功時に ``true``

    キー配下の数字をデクリメントし、デクリメントされた値を返します。

.. php:method:: increment($key, $offset = 1)

    :return: Boolean 成功時に ``true``

    キー配下の数字をインクリメントし、インクリメントされた値を返します。

.. php:method:: gc()

    必須ではありませんが、リソースの有効期限が切れたときにクリーンアップするために使用されます。
    FileEngine はこれを使用して、期限切れのコンテンツを含むファイルを削除します。


.. meta::
    :title lang=ja: キャッシュ
    :keywords lang=ja: uniform api,xcache,cache engine,cache system,atomic operations,php class,disk storage,static methods,php extension,consistent manner,similar features,apc,memcache,queries,cakephp,elements,servers,memory
