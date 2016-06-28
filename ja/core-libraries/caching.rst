キャッシュ
###########

キャッシュは、外部のリソースからの作成や読み込みにかかる時間を短縮するためによく使用されます。
また、高価なリソースから、安価に読み込むためにも使用されます。重いクエリーの結果やリモートの
ウェブサービスへのアクセスなど変更の少ないデータは、キャッシュへの保存に適しています。
一度キャッシュに登録されたリソースを再読み込みすると、リモートのリソースへのアクセスより
高速です。

CakePHP のキャッシュは、主に :php:class:`Cache` クラスを使用します。
このクラスは、共通の API で全ての異なるタイプのキャッシュの実装を扱う静的なメソッドを
持っています。CakePHP は、いくつかの組込のキャッシュエンジンを用意しています。
そして、独自のキャッシュシステムを実装するための簡単な仕組みを用意しています。
以下が、組込のキャッシュエンジンです:

* ``FileCache`` File キャッシュは、ローカルファイルを使用するシンプルなキャッシュです。
  最も遅いキャッシュエンジンで、アトミックな動作のための多くの機能を持ちません。
  しかしながら、ディスクストレージがとても安価なので、まれに書き込まれるような
  大きなオブジェクトや要素の登録にファイルがよく使われます。
  2.3 以降、デフォルトのキャッシュエンジンになりました。
* ``ApcCache`` APC キャッシュは、PHP の `APC <http://php.net/apc>`_ または
  `ACPu <http://php.net/apcu>`_ 拡張を使用します。
  これらの拡張は、ウェブサーバー中の共有メモリーにオブジェクトを保存します。
  これはとても高速で、アトミックな読み書き機能を利用することができます。
  CakePHP 2.0 から 2.2 までは、(利用可能であれば) デフォルトのキャッシュになりました。
* ``Wincache`` Wincache は、 `Wincache <http://php.net/wincache>`_ 拡張を使用します。
  Wincache は APC と同等の機能やパフォーマンスですが、 Windows と Microsoft IIS に
  最適化しています。
* ``XcacheEngine`` `Xcache <http://xcache.lighttpd.net/>`_
  は、APC と同等の機能を持つ PHP 拡張です。
* ``MemcacheEngine`` `Memcache <http://php.net/memcache>`_ 拡張を使用します。
  Memcache は、複数サーバに分散されたとても速いキャッシュシステムを提供し、
  アトミックな操作を提供します。
* ``MemcachedEngine`` `Memcached <http://php.net/memcached>`_ 拡張を使用します。
  これも memcache のインターフェースですが、より高いパフォーマンスが得られます。
* ``RedisEngine`` `phpredis <https://github.com/nicolasff/phpredis>`_ 拡張を
  使用します。Redis は、memcache と同様に高速で永続化したキャッシュシステムを提供し、
  アトミックな操作を提供します。

.. versionchanged:: 2.3

    FileEngine がデフォルトのキャッシュエンジンです。以前、多くの人々にとって APC を
    CLI とウェブの両方での適切な設定やデプロイが困難ででした。ファイルを利用することで、
    CakePHP の設定が新しい開発者にとってシンプルになりました。

.. versionchanged:: 2.5
    Memcached エンジンが追加されました。そして Memcache エンジンは非推奨です。

あなたが選んだキャッシュエンンジンにかかわらず、 あなたのアプリケーションは、一貫した作法で
:php:class:`Cache` とやり取りします。これは、あなたのアプリケーションの成長に伴い
キャッシュエンジンの交換が容易であることを意味します。 :php:class:`Cahce` クラスに加えて
:doc:`/core-libraries/helpers/cache` は、ページ全体のキャッシュを行います。
これを使うと、とてもパフォーマンスが向上します。

Cache クラスの設定
===================

Cache クラスの設定は、どこでもできます。しかし、一般的には、 ``app/Config/bootstrap.php``
の中で Cache の設定を行います。あなたが必要なだけ、キャッシュの設定を追加できます。
そして、複数のキャッシュエンジンを利用できます。CakePHP は、２つの内部的なキャッシュの設定を
``app/Config/core.php`` で行います。もし、 APC や Memcache を使用している場合、
コアのキャッシュにはユニークなキーをセットしておくべきです。これは、複数アプリケーションで
別のアプリのキャッシュデータを上書きしてしまうのを避けるためです。

複数のキャッシュの設定を利用することで、全てのキャッシュの設定を一元管理するのと同じくらい
:php:func:`Cache::set()` の使用が必要になる回数を減らすことができます。
複数の設定を使用することで、必要なだけストレージを変更できます。

.. note::

    どのエンジンを使用するか指定する必要があります。デフォルトで File には
    **なりません**。


例::

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

``app/Config/bootstrap.php`` に上記のコードを記述することで、Cache 設定が
2 つ追加されます。 'short' と 'long' という設定名で、 :php:func:`Cache::write()`
と :php:func:`Cache::read()` の ``$config`` パラメータで指定します。

.. note::

    FileEndine 使用時に、正しいパーミッションでのキャッシュファイルを指定して作成するには、
    ``mask`` オプションの設定が必要です。

.. versionadded:: 2.4
    デバッグモードで FileEngine 使用時には、不必要なエラーの発生を避けるため、
    存在しないディレクトリは自動作成されるようになりました。

Cache のためのストレージエンジンの作成
======================================

``app/Lib`` 内や、プラグインの ``$plugin/Lib`` 内に独自の ``Cache`` アダプターを
用意できます。アプリケーションやプラグインのキャッシュエンジンは、コアのエンジンと
差し替えられます。 Cache アダプターは、Cache ディレクトリ内に置かなければなりません。
``MyCustomCacheEngine`` と名付けたキャッシュエンジンがあったとすると、
アプリケーションのライブラリとして ``app/Lib/Cache/Engine/MyCustomCacheEngine.php``
に配置されるか、プラグインの一部として
``$plugin/Lib/Cache/Engine/MyCustomCacheEngine.php`` に配置されます。
プラグインの Cache 設定は、ドット記法を使用する必要があります。 ::

    Cache::config('custom', array(
        'engine' => 'CachePack.MyCustomCache',
        // ...
    ));

.. note::

    アプリケーションやプラグインのキャッシュエンジンは、 ``app/Config/bootstrap.php``
    で設定すべきです。もし、core.php にそれらの設定をしたとしても、正しく動作しません。

独自のキャッシュエンジンは、 いくつかの初期化メソッドと抽象メソッドが定義された
:php:class:`CacheEngine` を継承する必要があります。

CacheEngine に必要な API は、以下の通りです。

.. php:class:: CacheEngine

   Cache に使用する全てのキャッシュエンジンの基本クラス。

.. php:method:: write($key, $value, $config = 'default')

    :return: 成功時に boolean 型で true を返します。

    キャッシュに指定されたキーで値を書き込みます。オプションで、
    $config に書き込み先の設定名を指定します。

.. php:method:: read($key, $config = 'default')

    :return: キャッシュの値、失敗時は false。

    キャッシュからキーを読み込みます。オプションで $config に
    読み込み元の設定名を指定します。有効期限切れか未登録の場合は、
    false を返します。

.. php:method:: delete($key, $config = 'default')

    :return: 成功時に boolean 型で true を返します。

    キャッシュからキーを削除します。オプションで $config に
    削除先の設定名を指定します。未登録か削除済みの場合は、 false を返します。

.. php:method:: clear($check)

    :return: 成功時に boolean 型で true を返します。

    キャッシュから全てのキーを削除します。 $check を true にした場合、
    各値が本当に有効期限切れになったかを確認します。

.. php:method:: clearGroup($group)

    :return: 成功時に boolean 型で true を返します。

    キャッシュから同じグループに属する全てのキーを削除します。

.. php:method:: decrement($key, $offset = 1)

    :return: 成功時には減少値、そうでなければ false を返します。

    指定したキーの数値を減少させ、その値を返します。

.. php:method:: increment($key, $offset = 1)

    :return: 成功時には加算値、そうでなければ false を返します。

    指定したキーの数値を加算し、その値を返します。

.. php:method:: gc()

    必須ではありませんが、リソースが有効期限切れの時、整理するために使用してください。
    FileEngine は、このメソッドで有効期限切れの内容を含むファイルを削除します。

.. php:method:: add($key, $value)

    値がキャッシュ中に存在しない場合、その値をセットします。可能であれば、
    アトミックにチェックとセットを行うべきです。

    .. versionadded:: 2.8
        add メソッドは 2.8.0 で追加されました。

クエリ結果の保存に Cache を使用
================================

変更頻度が少ない検索結果や頻繁に読まれる題目をキャッシュの中に置くことで、アプリケーションの
パフォーマンスが劇的に改善されます。 :php:meth:`Model::find()` の検索結果が好例です。
検索結果を格納する Cache を使用するメソッドは以下のようになります。 ::

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

上記のコードのキャッシュの読み込みロジックを、ビヘイビアでキャッシュを読み込んだり、
関連モデルのメソッドを実行することで改善できます。改善していくことで
あなたの訓練になります。

2.5 から、 :php:meth:`Cache::remember()` を使用することで、もっとシンプルに
上記を実現することができます。 PHP 5.3 以上を使用している場合、 ``remember()``
メソッドは、以下のように使用します。 ::

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

カウンターの保存に Cache を使用
===============================

様々な用途でカウンターをキャッシュに簡単に格納できます。例えば、コンテストで
'slots' の残りを単純にカウントダウンするために Cache に格納することができます。
Cache クラスは、簡単な方法で、アトミックにカウンターの値を増減できます。
二人のユーザーが同時にカウンターの値を下げた際、不正な値を返すような
カウンターの値が競合するリスクを減らすために、アトミックな操作は重要です。

整数値をセットした後、 :php:meth:`Cache::increment()` と
:php:meth:`Cache::decrement()` を使って操作できます。 ::

    Cache::write('initial_count', 10);

    // Later on
    Cache::decrement('initial_count');

    // or
    Cache::increment('initial_count');

.. note::

    FileEngine では、 increment() と decrement() は動作しません。代わりに
    APC、Redis、Memcached を使用してください。


グループの使用
==============

.. versionadded:: 2.2

あるグループや名前空間に属する複数のキャッシュのデータを指定したいことがあると思います。
同じグループ内の全てのエントリーで共有される情報の変更があった場合は必ず、
全体を無効化するキーが必要になります。これには、キャッシュの設定内で groups を宣言することで
可能になります。 ::

    Cache::config('site_home', array(
        'engine' => 'Redis',
        'duration' => '+999 days',
        'groups' => array('comment', 'post')
    ));

ホームページのために生成された HTML をキャッシュに格納したいとします。そして、
コメントや投稿がデータベースに追加されるごとに、このキャッシュを自動的に無効化したい。
``comment`` と ``post`` グループを追加することで、両方のグループ名を持つキャッシュの
設定に格納されたキーを効果的にタグ付けします。

例えば、新しい投稿が追加された時は必ず、 ``post`` グループに関連する全てのデータを
削除するために、キャッシュエンジンに通知することができます。 ::

    // Model/Post.php

    public function afterSave($created, $options = array()) {
        if ($created) {
            Cache::clearGroup('post', 'site_home');
        }
    }

.. versionadded:: 2.4

:php:func:`Cache::groupConfigs()` は、(例えば同一の)グループに属する設定を
取得するのに使用します。 ::

    // Model/Post.php

    /**
     * 前例の別のバリエーション。同じグループに属する全てのキャッシュを消去します。
     */
    public function afterSave($created, $options = array()) {
        if ($created) {
            $configs = Cache::groupConfigs('post');
            foreach ($configs['post'] as $config) {
                Cache::clearGroup('post', $config);
            }
        }
    }

グループは、同じエンジンで同じプレフィックスを使用している全てのキャッシュ設定間で共有されます。
もし、グループを使用していて、グループ削除をしたい場合、全ての設定に共通のプレフィックスを
指定してください。

Cache API
=========

.. php:class:: Cache

    CakePHP の Cache クラスは、いくつかのバックエンドのキャッシュシステムのための
    一般的なフロントエンドを提供します。キャッシュの設定やエンジンの切り替えは、
    app/config/core.php でセットアップできます。

.. php:staticmethod:: config($name = null, $settings = array())

    ``Cache::config()`` は、追加のキャッシュ設定の作成に使用されます。
    これら追加の設定は、デフォルトのキャッシュ設定とは異なる有効期限 (*duration*)・
    エンジン (*engine*)・パス (*path*)・プレフィックス (*prefix*) を持ちます。

.. php:staticmethod:: read($key, $config = 'default')

    ``Cache::read()`` は、 ``$config`` から ``$key`` で指定したキャッシュの値の
    読込に使用します。 ``Cache::read()`` は、有効なキャッシュがあった場合、
    キャッシュの値を返し、有効期限切れであったり存在しなかった場合は、 ``false`` を
    返します。キャッシュの内容が false であると判断するには、厳密な比較 (``===``
    または ``!==``) を使用してください。

    例::

        $cloud = Cache::read('cloud');

        if ($cloud !== false) {
            return $cloud;
        }

        // cloud データの生成
        // ...

        // データをキャッシュに格納
        Cache::write('cloud', $cloud);
        return $cloud;


.. php:staticmethod:: write($key, $value, $config = 'default')

    ``Cache::write()`` はキャッシュに $value を書き込みます。 その後、
    ``$key`` を指定することで、この値を読み込んだり削除することができます。
    また、キャッシュを格納する任意の設定を指定できます。 ``$config`` を
    指定しない場合、デフォルトが使用されます。 ``Cache::write()`` は
    あらゆる型のオフジェクトを格納することができ、モデルの検索結果を
    格納することに適しています。 ::

        if (($posts = Cache::read('posts')) === false) {
            $posts = $this->Post->find('all');
            Cache::write('posts', $posts);
        }

    ``Cache::write()`` と ``Cache::read()`` を利用することで、データベースから
    posts を取得する回数を容易に削減することができます。

.. php:staticmethod:: delete($key, $config = 'default')

    ``Cache::delete()`` は、キャッシュに格納されているオブジェクトを完全に削除します。

.. php:staticmethod:: set($settings = array(), $value = null, $config = 'default')

    ``Cache::set()`` は、１つの操作 (大抵は read や write) のために、
    一時的にキャッシュの設定を上書きできます。もし、write のために設定を変更するなら、
    データを読み込む前にも ``Cache::set()`` を使用してください。これを行わなかった場合、
    キャッシュキーで読み込む時にデフォルトの設定が使用されます。 ::

        Cache::set(array('duration' => '+30 days'));
        Cache::write('results', $data);

        // Later on

        Cache::set(array('duration' => '+30 days'));
        $results = Cache::read('results');

    もし、 ``Cache::set()`` を繰り返し呼ぶところを見つけたなら、 新たな
    :php:func:`Cache::config()`` を作成するべきです。これで ``Cache::set()`` を
    呼ぶ必要が削減できます。

.. php:staticmethod:: increment($key, $offset = 1, $config = 'default')

    キャッシュエンジンに格納された値を自動的に加算します。カウンターやセマフォ型の値の
    更新に適しています。

.. php:staticmethod:: decrement($key, $offset = 1, $config = 'default')

    キャッシュエンジンに格納された値を自動的に減算します。カウンターやセマフォ型の値の
    更新に適しています。

.. php:staticmethod:: add($key, $value, $config = 'default')

    キャッシュにデータを追加します。しかし、キーが存在しない場合に限ります。
    データがゾン歳する場合、このメソッドは false を返します。
    可能な場合、データはアトミックにチェックとセットされます。

    .. versionadded:: 2.8
        add メソッドは、2.8.0 で追加されました。

.. php:staticmethod:: clear($check, $config = 'default')

    指定したキャッシュの設定に関する全てのキャッシュの値を破棄します。 Apc、Memcache、
    Wincache のようなエンジンの場合、キャッシュの削除にキャッシュ設定のプレフィックスを
    使用します。各キャッシュ設定には、それぞれ異なるプレフィックスを設定してください。

.. php:method:: clearGroup($group, $config = 'default')

    :return: 成功時には boolean 型の true を返します。

    キャッシュから同じグループに属するすべてのキーを削除します。

.. php:staticmethod:: gc($config)

    指定したキャッシュ設定のデータを整理 (ガベージコレクト)します。このメソッドは、
    主に FileEngine で使われます。手動でキャッシュデータを消去する必要がある
    キャッシュエンジンに実装されます。

.. php:staticmethod:: groupConfigs($group = null)

    :return: グループと関連する設定名の配列

    設定されたグループ名を返します。

.. php:staticmethod:: remember($key, $callable, $config = 'default')

    キャッシュ経由の読み込みを簡単に利用できます。キャッシュのキーが存在していた場合、
    値を返します。キーが存在しない場合、 callable な関数が実行されて、指定されたキーで
    キャッシュに結果が格納されます。

    例えば、問い合わせの結果をキャッシュしたい時、 ``remember`` を使用して、
    シンプルに実現できます。PHP 5.3 以上を使用している場合、 ::

        class Articles extends AppModel {
            function all() {
                $model = $this;
                return Cache::remember('all_articles', function() use ($model){
                    return $model->find('all');
                });
            }
        }

    .. versionadded:: 2.5
        remember() は 2.5 で追加されました。


.. meta::
    :title lang=ja: キャッシュ
    :keywords lang=ja: 一様な api,xcache,キャッシュエンジン,キャッシュシステム,アトミックな操作,php クラス,ディスクストレージ,スタティックメソッド,php 拡張,consistent manner,似た機能,apc,memcache,問い合わせ,cakephp,要素,サーバー,メモリー
