..
  Sessions
  ########

セッション
##########

..
  CakePHP provides a wrapper and suite of utility features on top of PHP's native
  ``session`` extension.  Sessions allow you to identify unique users across the
  requests and store persistent data for specific users. Unlike Cookies, session
  data is not available on the client side.  Usage of the ``$_SESSION`` is generally
  avoided in CakePHP, and instead usage of the Session classes is preferred.

CakePHP は PHP のネイティヴ ``session`` 拡張上に、ユーティリティー機能の\
スイートとラッパーを提供します。セッションはリクエストにまたがるユニーク\
ユーザーの識別と各ユーザーごとの永続的データの格納を可能にします。


..
  Session Configuration
  =====================

セッションの設定
================

..
  Session configuration is stored in ``Configure``, and the session classes will
  retrieve it from there as needed. Session configuration is stored under the top
  level ``Session`` key, and a number of options are available:

セッションの設定は ``Configure`` に格納されます。そしてセッションクラスは\
必要に応じてそこを参照します。セッションの設定はトップレベルの \
``Session`` キー下に格納され、いくつかのオプションが使用可能です:

..
  * ``Session.cookie`` - Change the name of the session cookie.

  * ``Session.timeout`` - The number of *minutes* before CakePHP's session handler expires the session.
  This affects ``Session.autoRegenerate`` (below), and is handled by CakeSession.

  * ``Session.cookieTimeout`` - The number of *minutes* before the session cookie expires.
  If this is undefined, it will use the same value as ``Session.timeout``.
  This affects the session cookie, and is handled by PHP itself.

  * ``Session.checkAgent`` - Should the user agent be checked, on each request.  If
  the useragent does not match the session will be destroyed.

  * ``Session.autoRegenerate`` - Enabling this setting, turns on automatic
    renewal of sessions, and sessionids that change frequently. Enabling this
    value will use the session's ``Config.countdown`` value to keep track of requests.
    Once the countdown reaches 0, the session id will be regenerated.  This is a
    good option to use for applications that need frequently
    changing session ids for security reasons. You can control the number of requests
    needed to regenerate the session by modifying :php:attr:`CakeSession::$requestCountdown`.

  * ``Session.defaults`` - Allows you to use one the built-in default session
    configurations as a base for your session configuration.

  * ``Session.handler`` - Allows you to define a custom session handler. The core
    database and cache session handlers use this.  This option replaces
    ``Session.save`` in previous versions. See below for additional information on
    Session handlers.

  * ``Session.ini`` - Allows you to set additional session ini settings for your
    config.  This combined with ``Session.handler`` replace the custom session
    handling features of previous versions

* ``Session.cookie`` - セッションクッキーの名前を変更します。

* ``Session.timeout`` - CakePHP のセッションハンドラがセッションを破棄するまでの時間を *分* 単位で指定します。この値は下記の ``Session.autoRegenerate`` に影響を与えます。これは CakeSession により処理されています。

* ``Session.cookieTimeout`` - 任意のセッション継続時間を *分* 単位で指定します。もしこれが未定義の場合、 ``Session.timeout`` の値が使用されます。これは session cookie に影響を与え、PHP 自体により処理されています。

* ``Session.checkAgent`` - ユーザーエージェントはチェックされるべきです。ユーザーエージェントがセッションとマッチしない場合、そのセッションは破棄されます。

* ``Session.autoRegenerate`` - このセッティングを有効にするとセッションとセッション ID の自動更新が有効になります。この値はリクエストの継続的な追跡にセッションの ``Config.countdown`` の値を使用します。カウントダウンが 0 になると、セッション ID が再生成されます。これはセキュリティ上の理由でセッション ID を頻繁に変更する場合に有用なオプションです。セッションの再生成が必要なリクエスト数のコントロールは、 :php:attr:`CakeSession::$requestCountdown` の変更によって可能です。

* ``Session.defaults`` - セッションの設定の基礎としてビルトインのデフォルト設定を使用出来ます。

* ``Session.handler`` - カスタムセッションハンドラーの定義が可能です。コアデータベースとキャッシュセッションハンドラーが使います。このオプションは以前のバージョンの ``Session.save`` を置き換えます。詳しくはセッションハンドラーの追加情報をご覧下さい。

* ``Session.ini`` - 追加のセッション ini セッティングを config に加えることが出来ます。これは ``Session.handler`` と合わせて以前のバージョンのカスタムセッションハンドリング機能を置き換えます。

..
  CakePHP's defaults to setting ``session.cookie_secure`` to true, when your
  application is on an SSL protocol.  If your application serves from both SSL and
  non-SSL protocols, then you might have problems with sessions being lost.  If
  you need access to the session on both SSL and non-SSL domains you will want to
  disable this::

CakePHP のデフォルトは、アプリケーションが SSL プロトコル上にある時、 \
``session.cookie_secure`` が有効 (true) です。SSL と SSL 以外のプロトコルで\
アプリケーションを動かす場合、セッション消失の問題が発生するかも知れません。\
SSL と SSL 以外のドメイン両方でセッションにアクセスする必要がある場合、\
これを無効にします::

    Configure::write('Session', array(
        'defaults' => 'php',
        'ini' => array(
            'session.cookie_secure' => false
        )
    ));

..
  Session cookie paths default to ``/`` in 2.0, to change this you can use the
  ``session.cookie_path`` ini flag to the directory path of your application::

セッションクッキーパスのデフォルト 2.0 において ``/`` です。これを変更する\
場合は ``session.cookie_path`` ini フラグにアプリケーションのディレクトリパス\
を指定することが出来ます::

    Configure::write('Session', array(
        'defaults' => 'php',
        'ini' => array(
            'session.cookie_path' => '/app/dir'
        )
    ));

..
  Built-in Session handlers & configuration
  =========================================

ビルトインセッションハンドラーと設定
====================================

..
  CakePHP comes with several built in session configurations.  You can either use
  these as the basis for your session configuration, or you can create a fully
  custom solution.  To use defaults, simply set the 'defaults' key to the name of
  the default you want to use.  You can then override any sub setting by declaring
  it in your Session config::

CakePHP にはいくつかビルトインなセッションの設定があります。\
これらをセッションの設定の基本として使用するか、完全にカスタマイズした\
ソリューションを作成するかは自由です。デフォルトを使用する場合、単純に \
'defaults' キーに使用したいデフォルト名をセットします。セッション \
config で宣言をすればサブセッティングだけを上書きすることも出来ます::

    Configure::write('Session', array(
        'defaults' => 'php'
    ));

..
  The above will use the built-in 'php' session configuration.  You could augment
  part or all of it by doing the following::

上記はビルトインの 'php' 設定を使用します。下記のように全てまたは部分的に\
設定を上書きすることも出来ます::

    Configure::write('Session', array(
        'defaults' => 'php',
        'cookie' => 'my_app',
        'timeout' => 4320 //3 days
    ));

..
  The above overrides the timeout and cookie name for the 'php' session
  configuration.  The built-in configurations are:

上記は 'php' 設定のタイムアウトとクッキー名を上書きします。ビルトイン設定は:

..
  * ``php`` - Saves sessions with the standard settings in your php.ini file.
  * ``cake`` - Saves sessions as files inside ``app/tmp/sessions``.  This is a
    good option when on hosts that don't allow you to write outside your own home
    dir.
  * ``database`` - Use the built in database sessions. See below for more information.
  * ``cache`` - Use the built in cache sessions. See below for more information.

* ``php`` - php.ini ファイルの標準セッティングに沿ってセッションを保存します。
* ``cake`` - セッションをファイルとして ``app/tmp/sessions`` に保存します。ホストの設定がホームディレクトリ以外の書き込みを禁止している場合、有効なオプションです。
* ``database``  ビルトインデータベースのセッションを使用します。詳しくは下記をご覧下さい。
* ``cache`` - ビルトインキャッシュのセッションを使用します。詳しくは下記をご覧下さい。

..
  Session Handlers
  ----------------

セッションハンドラー
--------------------

..
  Session handlers can also be defined in the session config array.  When defined
  they allow you to map the various ``session_save_handler`` values to a class or
  object you want to use for session saving. There are two ways to use the
  'handler'.  The first is to provide an array with 5 callables.  These callables
  are then applied to ``session_set_save_handler``::

セッションハンドラーはセッション config 配列でも定義出来ます。定義すると\
セッション保存に使用したいクラスやオブジェクトに様々な \
``session_save_handler`` の値をマップ可能です。 'handler' の使用には二つの\
方法があります。一つ目は 5 つの呼び出し可能な (callable) 配列を一つ用意する\
方法です。これは都度 ``session_set_save_handler`` に適用されます::

    Configure::write('Session', array(
        'userAgent' => false,
        'cookie' => 'my_cookie',
        'timeout' => 600,
        'handler' => array(
            array('Foo', 'open'),
            array('Foo', 'close'),
            array('Foo', 'read'),
            array('Foo', 'write'),
            array('Foo', 'destroy'),
            array('Foo', 'gc'),
        ),
        'ini' => array(
            'cookie_secure' => 1,
            'use_trans_sid' => 0
        )
    ));

..
  The second mode is to define an 'engine' key.  This key should be a classname
  that implements ``CakeSessionHandlerInterface``.  Implementing this interface
  will allow CakeSession to automatically map the methods for the handler.  Both
  the core Cache and Database session handlers use this method for saving
  sessions.  Additional settings for the handler should be placed inside the
  handler array.  You can then read those values out from inside your handler.

二つ目の方法は 'engine' キーを定義することです。このキーは \
``CakeSessionHandlerInterface`` を実装するクラス名にするべきです。\
このインターフェースを実装すると CakeSession がハンドラーのメソッドを自動で\
マップすることを可能にします。コアのキャッシュとデータベースのセッション\
ハンドラー両方はこのメソッドでセッション保存を行います。ハンドラーの\
追加セッティングはハンドラーの配列内に設置されるべきです。そうすることで\
ハンドラー内部の外からこれらの値を読み込めるようになります。

..
  You can also use session handlers from inside plugins.  By setting the engine to
  something like ``MyPlugin.PluginSessionHandler``.  This will load and use the
  ``PluginSessionHandler`` class from inside the MyPlugin of your application.

またプラグイン内部からセッションハンドラーを使用することも出来ます。\
エンジンを ``MyPlugin.PluginSessionHandler`` といった形で設定します。\
これはアプリケーションの MyPlugin 内部から ``PluginSessionHandler`` クラスを\
読み込み使用します。


CakeSessionHandlerInterface
---------------------------

..
  This interface is used for all custom session handlers inside CakePHP, and can
  be used to create custom user land session handlers.  Simply implement the
  interface in your class and set ``Session.handler.engine``  to the classname
  you've created.  CakePHP will attempt to load the handler from inside
  ``app/Model/Datasource/Session/$classname.php``.  So if your classname is
  ``AppSessionHandler`` the file should be
  ``app/Model/Datasource/Session/AppSessionHandler.php``.

このインターフェースは CakePHP 内部の全カスタムセッションハンドラーで\
使用されます。単純にクラス内にインターフェースを実装し \
``Session.handler.engine`` を作成したクラス名にセットします。 CakePHP は\
そのハンドラーを ``app/Model/Datasource/Session/$classname.php`` 内部から\
読み込みます。例えば ``AppSessionHandler`` というクラス名なら、\
``app/Model/Datasource/Session/AppSessionHandler.php`` となります。


..
  Database sessions
  -----------------

データーベースセッション
------------------------

..
  The changes in session configuration change how you define database sessions.
  Most of the time you will only need to set ``Session.handler.model`` in your
  configuration as well as choose the database defaults::

セッションの設定方法の変更はデータベースセッションの定義の仕方も\
変更しました。ここではデータベースのデフォルトを選ぶように、ほとんどは\
設定の中の ``Session.handler.model`` をセットするだけです::


    Configure::write('Session', array(
        'defaults' => 'database',
        'handler' => array(
            'model' => 'CustomSession'
        )
    ));

..
  The above will tell CakeSession to use the built in 'database' defaults, and
  specify that a model called ``CustomSession`` will be the delegate for saving
  session information to the database.

上記は CakeSession にビルトインの 'database' 設定を使用するように伝え、 \
``CustomSession`` というモデルにデータベースへのセッション情報保存の権限を\
委任よう指定しています。

..
  Cache Sessions
  --------------

キャッシュセッション
--------------------

..
  The Cache class can be used to store sessions as well.  This allows you to store
  sessions in a cache like APC, memcache, or Xcache.  There are some caveats to
  using cache sessions, in that if you exhaust the cache space, sessions will
  start to expire as records are evicted.

キャッシュクラスはセッションの格納にも使用されます。これはキャッシュ内の\
セッションを APC, memcache, または Xcache のように格納することを可能に\
します。キャッシュセッションの使用ではいくつか注意する点があります。

..
  To use Cache based sessions you can configure you Session config like::

セッションを元としたキャッシュを使うためセッション config を以下のように\
設定します::

    Configure::write('Session', array(
        'defaults' => 'cache',
        'handler' => array(
            'config' => 'session'
        )
    ));

..
  This will configure CakeSession to use the ``CacheSession`` class as the
  delegate for saving the sessions.  You can use the 'config' key which cache
  configuration to use. The default cache configuration is ``'default'``.

これは CakeSession に ``CacheSession`` クラスをセッション保存先として\
委任する設定です。'config' キーをキャッシュの設定に使用できます。\
デフォルトのキャッシュ設定は ``'default'`` です。

..
  Setting ini directives
  ======================

ini 指示子の設定
================

..
  The built-in defaults attempt to provide a common base for session
  configuration. You may need to tweak specific ini flags as well.  CakePHP
  exposes the ability to customize the ini settings for both default
  configurations, as well as custom ones. The ``ini`` key in the session settings,
  allows you to specify individual configuration values. For example you can use
  it to control settings like ``session.gc_divisor``::

デフォルト設定はセッション用に共通の土台を提供します。必要に応じて\
特定の ini フラグを微調整することもあります。 CakePHP ではデフォルト\
設定にしろ、カスタム設定にしろ、両者の ini セッティングをカスタマイズ\
出来ます。セッションセッティングの ``ini`` キーで、個別の設定値を指定\
することが可能です。例えば ``session.gc_divisor`` のようなセッティングを\
コントロールするのに使えます::

    Configure::write('Session', array(
        'defaults' => 'php',
        'ini' => array(
            'session.gc_divisor' => 1000,
            'session.cookie_httponly' => true
        )
    ));


..
  Creating a custom session handler
  =================================

カスタムセッションハンドラーの作成
==================================

..
  Creating a custom session handler is straightforward in CakePHP.  In this
  example we'll create a session handler that stores sessions both in the Cache
  (apc) and the database.  This gives us the best of fast IO of apc,
  without having to worry about sessions evaporating when the cache fills up.

カスタムセッションハンドラーの作成は CakePHP で容易に出来ます。\
この例で、セッションをキャッシュ (apc) とデータベースの両方に\
格納するセッションハンドラーを作成します。これは apc による、\
キャッシュ限度を超過した際の消失について心配が不要な、最善で\
高速な IO をもたらします。

..
  First we'll need to create our custom class and put it in
  ``app/Model/Datasource/Session/ComboSession.php``.  The class should look
  something like::

まずカスタムクラスを作成し ``app/Model/Datasource/Session/ComboSession.php`` \
として保存する必要があります。クラスは以下のようになります::

    App::uses('DatabaseSession', 'Model/Datasource/Session');

    class ComboSession extends DatabaseSession implements CakeSessionHandlerInterface {
        public $cacheKey;

        public function __construct() {
            $this->cacheKey = Configure::read('Session.handler.cache');
            parent::__construct();
        }

        // セッションからデータ読み込み
        public function read($id) {
            $result = Cache::read($id, $this->cacheKey);
            if ($result) {
                return $result;
            }
            return parent::read($id);
        }

        // セッションへデータ書き込み
        public function write($id, $data) {
            $result = Cache::write($id, $data, $this->cacheKey);
            if ($result) {
                return parent::write($id, $data);
            }
            return false;
        }

        // セッションの破棄
        public function destroy($id) {
            $result = Cache::delete($id, $this->cacheKey);
            if ($result) {
                return parent::destroy($id);
            }
            return false;
        }

        // 期限切れセッションの削除
        public function gc($expires = null) {
            return Cache::gc($this->cacheKey) && parent::gc($expires);
        }
    }
        // 期限切れセッションの削除
        public function gc($expires = null) {
            return Cache::gc($this->cacheKey) && parent::gc($expires);
        }
    }

..
  Our class extends the built-in ``DatabaseSession`` so we don't have to duplicate
  all of its logic and behavior. We wrap each operation with a :php:class:`Cache`
  operation.  This lets us fetch sessions from the fast cache, and not have to
  worry about what happens when we fill the cache.  Using this session handler is
  also easy.  In your ``core.php`` make the session block look like the following::

このクラスはビルトインの ``DatabaseSession`` を継承しそのロジックや\
振る舞いを重複して定義することを避けています。それぞれのオペレーションを \
:php:class:`Cache` オペレーションでラップします。これで高速な\
キャッシュからセッションを取得しつつ、キャッシュ限度の考慮を\
不要にしています。このセッションハンドラーを使うのもまた簡単です。 \
``core.php`` のセッションブロックを以下のように設定します::

    Configure::write('Session', array(
        'defaults' => 'database',
        'handler' => array(
            'engine' => 'ComboSession',
            'model' => 'Session',
            'cache' => 'apc'
        )
    ));

    // apc キャッシュ config を追加すること
    Cache::config('apc', array('Engine' => 'Apc'));

..
  Now our application will start using our custom session handler for reading &
  writing session data.

これでアプリケーションはカスタムセッションハンドラーを使った\
セッションデータの読み書きを行います。


.. php:class:: CakeSession

..
  Reading & writing session data
  ==============================

セッションデータの読み込みと書き込み
====================================

..
  Depending on the context you are in your application you have different classes
  that provide access to the session.  In controllers you can use
  :php:class:`SessionComponent`.  In the view, you can use
  :php:class:`SessionHelper`.  In any part of your application you can use
  ``CakeSession`` to access the session as well. Like the other interfaces to the
  session, ``CakeSession`` provides a simple CRUD interface.

アプリケーション内のコンテキストにより、セッションへのアクセスを提供するクラスが異なります。コントローラーでは :php:class:`SessionComponent` を使用します。ビューでは :php:class:`SessionHelper` を使用します。どこからでも使用可能な ``CakeSession`` をでセッションにアクセスすることも出来ます。他のインターフェースと同じく、 ``CakeSession`` はシンプルな CRUD インターフェースを提供します。

.. php:staticmethod:: read($key)

..
  You can read values from the session using :php:meth:`Set::classicExtract()`
  compatible syntax::

:php:meth:`Set::classicExtract()` 互換記法を用いてセッションから値を読み込みます::

    CakeSession::read('Config.language');

.. php:staticmethod:: write($key, $value)

..
   ``$key`` should be the dot separated path you wish to write ``$value`` to::

``$key`` はドット区切りで ``$value`` の書き込み先を指定します::

    CakeSession::write('Config.language', 'eng');

.. php:staticmethod:: delete($key)

..
   When you need to delete data from the session, you can use delete::

セッションからデータ削除が必要なら削除も可能です::

    CakeSession::delete('Config.language');

..
  You should also see the documentation on
  :doc:`/core-libraries/components/sessions` and
  :doc:`/core-libraries/helpers/session` for how to access Session data
  in the controller and view.

コントローラーとビューからのセッションデータへのアクセス方法については、\
合わせて :doc:`/core-libraries/components/sessions` と \
:doc:`/core-libraries/helpers/session` をご覧下さい。
