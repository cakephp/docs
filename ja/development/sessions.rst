セッション
##########

CakePHP は PHP のネイティブ ``session`` 拡張上に、ユーティリティ機能のスイートとラッパーを
提供します。セッションはリクエストにまたがるユニークユーザーの識別と各ユーザーごとの永続的データの
格納を可能にします。クッキーとは異なり、セッションデータはクライアント側では利用されません。
CakePHP において、 ``$_SESSION`` の利用は通常避けています。代わりに Session クラスの利用を
推奨しています。

.. _session-configuration:

セッションの設定
================

セッションの設定は、通常 ``/config/app.php`` で定義されます。
また、いくつかのオプションが使用可能です:

* ``Session.timeout`` - CakePHP のセッションハンドラがセッションを破棄するまでの時間を
  *分* 単位で指定します。

* ``Session.defaults`` - セッションの設定の基礎としてビルトインのデフォルト設定を使用出来ます。
  ビルトインの defaults に関しては、以下をご覧ください。

* ``Session.handler`` - カスタムセッションハンドラーの定義が可能です。コアデータベースと
  キャッシュセッションハンドラーが使います。このオプションは以前のバージョンの ``Session.save`` を
  置き換えます。詳しくはセッションハンドラーの追加情報をご覧下さい。

* ``Session.ini`` - 追加のセッション ini セッティングを config に加えることが出来ます。これは
  ``Session.handler`` と合わせて以前のバージョンのカスタムセッションハンドリング機能を置き換えます。

* ``Session.cookie`` - 使用するクッキー名。デフォルトは「CAKEPHP」。

* ``Session.cookiePath`` - セッションクッキーを設定するための url パス。
  php.ini の設定 ``session.cookie_path`` にマップします。デフォルトは、アプリのベースパス。

アプリケーションが SSL プロトコル上にある時、CakePHP のデフォルトは、
``session.cookie_secure`` が ``true`` です。SSL と 非 SSL の両方のプロトコルで
アプリケーションを動かす場合、セッション消失の問題が発生するかも知れません。SSL と 非 SSL の
ドメイン両方でセッションにアクセスする必要がある場合、これを無効にします。 ::

    Configure::write('Session', [
        'defaults' => 'php',
        'ini' => [
            'session.cookie_secure' => false
        ]
    ]);

セッションクッキーパスは、デフォルトでアプリケーションのベースパスになります。これを
変更するためには、 ``session.cookie_path`` ini の値を使用できます。例えば、
すべてのサブドメインにまたがってセッションを永続化させたい場合、以下のようにします。 ::

    Configure::write('Session', [
        'defaults' => 'php',
        'ini' => [
            'session.cookie_path' => '/',
            'session.cookie_domain' => '.yourdomain.com'
        ]
    ]);

デフォルトでは、 PHP は ``Session.timeout`` の設定に関わらず、ブラウザーを閉じると
すぐに有効期限切れになるセッションクッキーを設定します。クッキーのタイムアウトは
``session.cookie_lifetime`` ini の値で制御します。以下のように設定できます。 ::

    Configure::write('Session', [
        'defaults' => 'php',
        'ini' => [
            // サイト上のページに訪問せず 30 分経つとクッキーを無効にします。
            'session.cookie_lifetime' => 1800
        ]
    ]);

``Session.timeout`` と ``session.cookie_lifetime`` の値の間の違いは、
後者はクライアントがクッキーを正しく伝えていることに依存していることです。
もしあなたがより厳密なタイムアウトチェックを必要な場合、クライアントの情報を信頼せず、
``Session.timeout`` を使用してください。

``Session.timeout`` は、ユーザーが無活動の合計時間 (例えば、セッションが使われるページを
見ていない時間)に相当し、そして、ユーザーがサイト上に留まることのできる合計時間(分)を
制限しないことに注意してください。

ビルトインセッションハンドラーと設定
====================================

CakePHP にはいくつかビルトインなセッションの設定があります。これらをセッションの設定の基本として
使用するか、完全にカスタマイズしたソリューションを作成するかは自由です。デフォルトを使用する場合、
単純に 'defaults' キーに使用したいデフォルト名をセットします。セッション config で宣言をすれば
サブセッティングだけを上書きすることも出来ます。 ::

    Configure::write('Session', [
        'defaults' => 'php'
    ]);

上記はビルトインの 'php' 設定を使用します。下記のように全てまたは部分的に
設定を上書きすることも出来ます。 ::

    Configure::write('Session', [
        'defaults' => 'php',
        'cookie' => 'my_app',
        'timeout' => 4320 // 3 days
    ]);

上記は 'php' 設定のタイムアウトとクッキー名を上書きします。ビルトイン設定は:

* ``php`` - php.ini ファイルの標準セッティングに従ってセッションを保存します。
* ``cake`` - セッションをファイルとして ``app/tmp/sessions`` に保存します。ホストの設定が
  ホームディレクトリー以外の書き込みを禁止している場合、有効なオプションです。
* ``database``  ビルトインのデータベースセッションを使用します。詳しくは下記をご覧下さい。
* ``cache`` - ビルトインのキャッシュセッションを使用します。詳しくは下記をご覧下さい。

セッションハンドラー
--------------------

セッションハンドラーはセッション config 配列でも定義出来ます。'handler.engine' 設定キーを
定義すると、クラス名の命名やハンドラーインスタンスの提供ができます。クラスやオブジェクトは、
ネイティブ PHP の ``SessionHandlerInterface`` を実装しなければなりません。
このインターフェースを実装することによって、 ``Session`` がハンドラーのメソッドと
自動的にマップすることができます。コアの Cache や Database セッションハンドラーは、
セッションに保存する際にこのメソッドを使用します。ハンドラーのための追加の設定は、
handler 配列内に配置されます。ハンドラー内からこれらの値を読むことができます。 ::

    'Session' => [
        'handler' => [
            'engine' => 'DatabaseSession',
            'model' => 'CustomSessions'
        ]
    ]

上記は、どのようにアプリケーションのモデルを使ってデータベースセッションハンドラーを
設定できるかを示しています。クラス名をあなたの handler.engine に使用した時、
CakePHP は、 ``Network\Session`` 名前空間内にクラスがあることを期待します。
例えば、 ``AppSessionHandler`` クラスを持っていた場合、ファイルは、
**src/Network/Session/AppSessionHandler.php** であるべきです。そして、
クラス名は、 ``App\Network\Session\AppSessionHandler`` であるべきです。
プラグインの中のセッションハンドラを使うこともできます。その場合、エンジンを
``MyPlugin.PluginSessionHandler`` のように設定します。

データーベースセッション
------------------------

もし、セッションデータを保存するためにデータベースを使用する必要がある場合、
以下のように設定してください。 ::

    'Session' => [
        'defaults' => 'database'
    ]

この設定は、以下の項目を持つデータベーステーブルが必要になります。 ::

  CREATE TABLE `sessions` (
    `id` char(40) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    `created` datetime DEFAULT CURRENT_TIMESTAMP, -- Optional
    `modified` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Optional
    `data` blob DEFAULT NULL, -- for PostgreSQL use bytea instead of blob
    `expires` int(10) unsigned DEFAULT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

`アプリケーションスケルトン <https://github.com/cakephp/app>`_ の中の
``config/schema/sessions.sql`` に、sessions テーブルのためのスキーマのコピーがあります。

セッションの保存を処理するための独自の ``Table`` クラスを使用することもできます。 ::

    'Session' => [
        'defaults' => 'database',
        'handler' => [
            'engine' => 'DatabaseSession',
            'model' => 'CustomSessions'
        ]
    ]

上記は、 Session にビルドインの 'database' の defaults を使用することを伝え、
データベースにセッション情報を保存するために ``CustomSessions`` と呼ばれる Table に
委任することを指定します。

キャッシュセッション
--------------------

キャッシュクラスはセッションの格納にも使用されます。これはキャッシュ内のセッションを
APC, Memcached, または Xcache のように格納することを可能にします。キャッシュセッションの
使用ではいくつか注意する点があります。もし、キャッシュ容量を使い果たした場合、
セッションは、レコードが追い出されるように有効期限切れになり始めます。

キャッシュベースのセッションを使うために Session の config を以下のように設定します。 ::

    Configure::write('Session', [
        'defaults' => 'cache',
        'handler' => [
            'config' => 'session'
        ]
    ]);

これは Session に ``CacheSession`` クラスをセッション保存先として
委任する設定です。'config' キーをキャッシュの設定に使用できます。
デフォルトのキャッシュ設定は ``'default'`` です。

ini ディレクティブの設定
========================

ビルドイン defaults は、セッション設定のための共通の基盤を提供することを試みます。
必要に応じて特定の ini フラグを微調整することもあります。 CakePHP ではデフォルト設定にしろ、
カスタム設定にしろ、両者の ini セッティングをカスタマイズ出来ます。セッションセッティングの
``ini`` キーで、個別の設定値を指定することが可能です。例えば ``session.gc_divisor`` のような
セッティングをコントロールするのに使えます。 ::

    Configure::write('Session', [
        'defaults' => 'php',
        'ini' => [
            'session.cookie_name' => 'MyCookie',
            'session.cookie_lifetime' => 1800, // Valid for 30 minutes
            'session.gc_divisor' => 1000,
            'session.cookie_httponly' => true
        ]
    ]);

カスタムセッションハンドラーの作成
==================================

カスタムセッションハンドラーの作成は CakePHP で容易に出来ます。この例で、セッションを
キャッシュ (APC) とデータベースの両方に格納するセッションハンドラーを作成します。
これは APC による、キャッシュ限度を超過した際の消失について心配が不要な、最善で高速な
IO をもたらします。

まずカスタムクラスを作成し **src/Network/Session/ComboSession.php**
に保存する必要があります。クラスは以下のようになります。 ::

    namespace App\Network\Session;

    use Cake\Cache\Cache;
    use Cake\Core\Configure;
    use Cake\Network\Session\DatabaseSession;

    class ComboSession extends DatabaseSession
    {
        public $cacheKey;

        public function __construct()
        {
            $this->cacheKey = Configure::read('Session.handler.cache');
            parent::__construct();
        }

        // セッションからデータ読込み
        public function read($id)
        {
            $result = Cache::read($id, $this->cacheKey);
            if ($result) {
                return $result;
            }
            return parent::read($id);
        }

        // セッションへのデータ書込み
        public function write($id, $data)
        {
            Cache::write($id, $data, $this->cacheKey);
            return parent::write($id, $data);
        }

        // セッションの破棄
        public function destroy($id)
        {
            Cache::delete($id, $this->cacheKey);
            return parent::destroy($id);
        }

        // 有効期限切れセッションの削除
        public function gc($expires = null)
        {
            return Cache::gc($this->cacheKey) && parent::gc($expires);
        }
    }

このクラスはビルトインの ``DatabaseSession`` を継承しそのロジックや振る舞いを重複して
定義することを避けています。それぞれのオペレーションを :php:class:`Cake\\Cache\\Cache`
オペレーションでラップします。これで高速なキャッシュからセッションを取得しつつ、
キャッシュ限度の考慮を不要にしています。このセッションハンドラーを使うのもまた簡単です。
**app.php** のセッションブロックを以下のように設定します。 ::

    'Session' => [
        'defaults' => 'database',
        'handler' => [
            'engine' => 'ComboSession',
            'model' => 'Session',
            'cache' => 'apc'
        ]
    ],
    // apc キャッシュ config を追加すること
    'Cache' => [
        'apc' => ['engine' => 'Apc']
    ]

これでアプリケーションはカスタムセッションハンドラーを使ったセッションデータの読み書きを行います。


.. php:class:: Session

.. _accessing-session-object:

セッションオブジェクトへのアクセス
==================================

リクエストオブジェクトにアクセスできる任意の場所でセッションデータにアクセスすることができます。
これは、以下でセッションにアクセス可能であることを意味します。

* Controllers
* Views
* Helpers
* Cells
* Components

基本的なセッションオブジェクトに加えて、ビューの中でセッションを扱うために
:php:class:`Cake\\View\\Helper\\SessionHelper` が使用できます。
基本的なセッションの使用例は以下の通り。 ::

    $name = $this->request->session()->read('User.name');

    // 複数回セッションにアクセスする場合、
    // ローカル変数にしたくなるでしょう。
    $session = $this->request->session();
    $name = $session->read('User.name');

セッションデータの読込みと書込み
====================================

.. php:method:: read($key)

:php:meth:`Hash::extract()` 互換の構文を使ってセッションから値を読込みます。 ::

    $session->read('Config.language');

.. php:method:: write($key, $value)

``$key`` は、ドット区切りで ``$value`` の書込み先を指定します。 ::

    $session->write('Config.language', 'en');

以下のように１つもしくは複数のハッシュを指定することもできます。 ::

    $session->write([
      'Config.theme' => 'blue',
      'Config.language' => 'en',
    ]);

.. php:method:: delete($key)

セッションからデータ削除が必要なら ``delete()`` が使用できます。 ::

    $session->delete('Some.value');

.. php:staticmethod:: consume($key)

セッションからデータの読込みと削除が必要なら ``consume()`` が使用できます。 ::

    $session->consume('Some.value');

.. php:method:: check($key)

セッションにデータが存在するかどうかを知りたいなら ``check()`` が使用できます。 ::

    if ($session->check('Config.language')) {
        // Config.language が存在し null ではない。
    }

セッションの破棄
======================

.. php:method:: destroy()

ユーザーがログアウトするときにセッションの破棄は便利です。セッションを破棄するために
``destroy()`` メソッドを使用してください。 ::

    $session->destroy();

セッションの破棄は、セッション内の全てのサーバー側データを削除しますが、セッションクッキーの
**削除はしません** 。

セッション ID の切替え
=======================

.. php:method:: renew()

ユーザーがログインやログアウトした時、 ``AuthComponent`` は自動的にセッション ID を更新しますが、
セッション ID を手動で切り替えたい時もあるでしょう。そのためには、 ``renew()`` メソッドを
使います。 ::

    $session->renew();

フラッシュメッセージ
=====================

フラッシュメッセージは、エンドユーザーに一度だけ表示する短いメッセージです。それらは、
エラーメッセージの表示や、アクションが上手くいったことを確認するためにしばしば用いられます。

フラッシュメッセージのセットや表示には、
:doc:`/controllers/components/flash` と
:doc:`/views/helpers/flash` を使いましょう。

.. meta::
    :title lang=ja: Sessions
    :keywords lang=ja: session defaults,session classes,utility features,session timeout,session ids,persistent data,session key,session cookie,session data,last session,core database,security level,useragent,security reasons,session id,attr,countdown,regeneration,sessions,config
