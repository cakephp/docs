..
    Configuration

構成設定
#############

..
    While conventions remove the need to configure all of CakePHP, you'll still need
    to configure a few things like your database credentials.

慣習にのっとることで CakePHP のすべてを設定する必要性はないものの、
データベースの認証のようないくつかの設定をする必要があります。

..
    Additionally, there are optional configuration options that allow you to swap
    out default values & implementations with ones tailored to your application.

加えて、任意のオプション設定はデフォルトの値やあなたのアプリケーションに合わせたものに置き換えられるようになります。

.. index:: app.php, app.php.default

.. index:: configuration

..
    Configuring your Application

アプリケーションの設定
============================

..
    Configuration is generally stored in either PHP or INI files, and loaded during
    the application bootstrap. CakePHP comes with one configuration file by default,
    but if required you can add additional configuration files and load them in
    **config/bootstrap.php**. :php:class:`Cake\\Core\\Configure` is used for
    general configuration, and the adapter based classes provide ``config()``
    methods to make configuration simple and transparent.

設定は一般的に PHP か INI ファイルに保存され、アプリケーションの bootstrap で読み込まれます。
CakePHP はデフォルトで一つの設定ファイルからなりますが、
もし必要であれば追加の設定ファイルを加え、 **config/bootstrap.php** で読み込むことができます。
:php:class:`Cake\\Core\\Configure` は一般的な設定に利用され、
基底クラスのアダプターで提供されている ``config()`` メソッドは設定をシンプルで明快にします。

..
    Loading Additional Configuration Files

追加の設定ファイルの読み込み
--------------------------------------

..
    If your application has many configuration options it can be helpful to split
    configuration into multiple files. After creating each of the files in your
    **config/** directory you can load them in **bootstrap.php**::

もしあなたのアプリケーションに多くの設定オプションがあるとき、設定を複数のファイルに分けることで役に立ちます。
**config/** ディレクトリに複数ファイルを作成したのち、 **bootstrap.php** でそれらを読み込めます。
::

    use Cake\Core\Configure;
    use Cake\Core\Configure\Engine\PhpConfig;

    Configure::config('default', new PhpConfig());
    Configure::load('app', 'default', false);
    Configure::load('other_config', 'default');

..
    You can also use additional configuration files to provide environment specific
    overrides. Each file loaded after **app.php** can redefine previously declared
    values allowing you to customize configuration for development or staging
    environments.

追加の設定ファイルは環境特有のオーバーライドとしても利用できます。各ファイルを **app.php** の後で読み込むことで、
以前に宣言した変数を再定義でき、 development や staging 環境の設定をカスタマイズ可能となります。

..
    General Configuration

一般的な設定
---------------------

..
    Below is a description of the variables and how they affect your CakePHP
    application.

変数の書き方と CakePHP アプリケーションへの影響を以下に記述します。

..
    debug
        Changes CakePHP debugging output. ``false`` = Production mode. No error
        messages, errors, or warnings shown. ``true`` = Errors and warnings shown.

debug
    CakePHP のデバッグ出力を制御します。 ``false`` = 本番モードです。
    エラーメッセージやエラー、ワーニング出力を行いません。 ``true`` = エラーとワーニングが出力されます。

..
    App.namespace
        The namespace to find app classes under.

        .. note::

            When changing the namespace in your configuration, you will also
            need to update your **composer.json** file to use this namespace
            as well. Additionally, create a new autoloader by running
            ``php composer.phar dumpautoload``.

App.namespace
    app クラス下で見つける名前空間です。

    .. note::

        名前空間の設定を変更した時は、おそらく **composer.json** ファイルもまた
        この名前空間を利用するように更新する必要があります。
        加えて、新しい autoloader を ``php composer.phar dumpautoload`` を実行して作成します。

.. _core-configuration-baseurl:

..
    App.baseUrl
        Un-comment this definition if you **don’t** plan to use Apache’s
        mod\_rewrite with CakePHP. Don’t forget to remove your .htaccess
        files too.

App.baseUrl
    もし Apache の mod\_rewrite を CakePHPで **利用しない** 予定の場合、この定義のコメントを解除します。
    .htaccess ファイルを取り除くことを忘れないでください。

..
    App.base
        The base directory the app resides in. If ``false`` this
        will be auto detected. If not ``false``, ensure your string starts
        with a `/` and does NOT end with a `/`. E.g., `/basedir` is a valid
        App.base. Otherwise, the AuthComponent will not work properly.

App.base
    アプリの存在するベースディレクトリです。もし ``false`` をセットしたら、自動で検出されます。
    ``false`` 以外の場合、書き出しは `/` から始め、終わりに `/` を確実に付けないようにしてください。
    例えば、 `/basedir` は有効な App.base です。さもなければ、AuthComponent は適切に動かなくなります。

..
    App.encoding
        Define what encoding your application uses.  This encoding
        is used to generate the charset in the layout, and encode entities.
        It should match the encoding values specified for your database.

App.encoding
    あなたのアプリケーションで使用するエンコードを指定します。
    このエンコーディングはレイアウトの charset の生成やエンティティのエンコードに利用されます。
    それは、データベースのエンコードの値と合うように指定すべきです。

..
    App.webroot
        The webroot directory.

App.webroot
    webroot のディレクトリです。

..
    App.wwwRoot
        The file path to webroot.

App.wwwRoot
    webroot のファイルパスです。

..
    App.fullBaseUrl
        The fully qualified domain name (including protocol) to your application's
        root. This is used when generating absolute URLs. By default this value
        is generated using the $_SERVER environment. However, you should define it
        manually to optimize performance or if you are concerned about people
        manipulating the ``Host`` header.
        In a CLI context (from shells) the `fullBaseUrl` cannot be read from $_SERVER,
        as there is no webserver involved. You do need to specify it yourself if
        you do need to generate URLs from a shell (e.g. when sending emails).

App.fullBaseUrl
    アプリケーションのルートまでのドメイン名 ( プロトコル含む ) です。
    これは完全な URLs を生成する際に利用されます。デフォルトでは、この値は $_SERVER の環境情報から生成されます。
    しかし、パフォーマンスを最適化したり、他人が ``Host`` ヘッダーを操作するのを心配するならば、自分で指定すべきでしょう。
    CLI 環境 ( シェル ) では web サーバとの関連が無いので  `fullBaseUrl` を $_SERVER から読むことができません。
    もしシェルから URLs を作成する必要がある場合 (例えばメールの送信) 、自力で指定する必要があります。    

..
    App.imageBaseUrl
        Web path to the public images directory under webroot. If you are using
        a :term:`CDN` you should set this value to the CDN's location.

App.imageBaseUrl
    webroot 以下の公開画像ディレクトリのパスになります。
    もし :term:`CDN` を利用している場合、CDN の場所をセットすべきです。

..
    App.cssBaseUrl
        Web path to the public css directory under webroot. If you are using
        a :term:`CDN` you should set this value to the CDN's location.

App.cssBaseUrl
    webroot 以下の公開 css ディレクトリのパスになります。
    もし :term:`CDN` を利用している場合、CDN の場所をセットすべきです。

..
    App.jsBaseUrl
        Web path to the public js directory under webroot. If you are using
        a :term:`CDN` you should set this value to the CDN's location.

App.jsBaseUrl
    webroot 以下の公開 js ディレクトリのパスになります。
    もし :term:`CDN` を利用している場合、CDN の場所をセットすべきです。

..
    App.paths
        Configure paths for non class based resources. Supports the
        ``plugins``, ``templates``, ``locales`` subkeys, which allow the definition
        of paths for plugins, view templates and locale files respectively.

App.paths
    Configure の class ベースでないリソースのパスです。
    ``plugins`` 、 ``templates`` 、 ``locales`` などのサブキーをサポートし、
    それぞれプラグイン、view テンプレート、locale ファイルのパスを指定できます。
 
..
    Security.salt
        A random string used in hashing. This value is also used as the
        HMAC salt when doing symetric encryption.

Security.salt
    ハッシュ化の時に利用されるランダムな文字列です。
    この値は 対称暗号化の際、HMAC ソルトのように利用されます。

..
    Asset.timestamp
        Appends a timestamp which is last modified time of the particular
        file at the end of asset files URLs (CSS, JavaScript, Image) when
        using proper helpers.
        Valid values:
        - (bool) ``false`` - Doesn't do anything (default)
        - (bool) ``true`` - Appends the timestamp when debug is ``true``
        - (string) 'force' - Always appends the timestamp.

Asset.timestamp
    適切なヘルパーを使用した際、アセットファイルの URLs (CSS, JavaScript, Image) の終端に
    そのファイルの最終更新時間のタイムスタンプを加えます。
    有効な値:

    - (bool) ``false`` - 何もしません (デフォルト)
    - (bool) ``true`` - debug が ``true`` の時に加えます
    - (string) 'force' - 常にタイムスタンプを加えます

..
    Database Configuration

データベースの設定
----------------------

..
    See the :ref:`Database Configuration <database-configuration>` for information
    on configuring your database connections.

データベース接続の設定は :ref:`データベース設定 <database-configuration>` を参照してください。

..
    Caching Configuration

キャッシュの設定
---------------------

..
    See the :ref:`Caching Configuration <cache-configuration>` for information on
    configuring caching in CakePHP.

CakePHP のキャッシュ設定は :ref:`キャッシュ設定 <cache-configuration>` を参照してください。

..
    Error and Exception Handling Configuration

エラーと例外ハンドリング設定
------------------------------------------

..
    See the :ref:`Error and Exception Configuration <error-configuration>` for
    information on configuring error and exception handlers.

エラーの設定と例外のハンドリングは :ref:`エラーと例外設定 <error-configuration>` を参照してください。

..
    Logging Configuration

ログの設定
---------------------

..
    See the :ref:`log-configuration` for information on configuring logging in
    CakePHP.

CakePHP のログの設定は :ref:`log-configuration` を参照してください。

..
    Email Configuration

メールの設定
-------------------

..
    See the :ref:`Email Configuration <email-configuration>` for information on
    configuring email presets in CakePHP.

CakePHP のメールプリセットの設定は :ref:`メールの設定 <email-configuration>` を参照してください。

..
    Session Configuration

セッションの設定
---------------------

..
    See the :ref:`session-configuration` for information on configuring session
    handling in CakePHP.

CakePHP のセッション操作の設定は :ref:`セッションの設定 <session-configuration>` を参照してください。

..
    Routing configuration

ルーティングの設定
---------------------

..
    See the :ref:`Routes Configuration <routes-configuration>` for more information
    on configuring routing and creating routes for your application.

ルーティングの設定やあなたのアプリケーションのルートの作成に関するより多くの情報は :ref:`ルーティングの設定 <session-configuration>` を参照してください。

.. _additional-class-paths:

..
    Additional Class Paths

追加のクラスパス
======================

..
    Additional class paths are setup through the autoloaders your application uses.
    When using ``Composer`` to generate your autoloader, you could do the following,
    to provide fallback paths for controllers in your application::

追加のクラスパスはあなたのアプリケーションで利用されるオートローダーを通じてセットアップされます。
``Composer`` を利用してオートローダーを作成する際、以下のように記述してコントローラーの fallback パスを提供します。
::

    "autoload": {
        "psr-4": {
            "App\\Controller\\": "/path/to/directory/with/controller/folders",
            "App\": "src"
        }
    }

..
    The above would setup paths for both the ``App`` and ``App\Controller``
    namespace. The first key will be searched, and if that path does not contain the
    class/file the second key will be searched. You can also map a single namespace
    to multiple directories with the following::

上記は ``App`` と ``App\Controller`` 両方の名前空間のセットアップパスです。
一つ目のキーが検索され、もしパスがその class/file に含まれなければ二つ目のキーが検索されます。
一つの名前空間に複数のディレクトリをマップでき、以下のように記述します。
::

    "autoload": {
        "psr-4": {
            "App\": ["src", "/path/to/directory"]
        }
    }

..
    Plugin, View Template and Locale Paths

プラグイン、ビュー、テンプレート、ロケールのパス
----------------------------------------------------------------------------

..
    Since plugins, view templates and locales are not classes, they cannot have an
    autoloader configured. CakePHP provides three Configure variables to setup additional
    paths for these resources. In your **config/app.php** you can set these variables::

プラグイン、ビューテンプレート、そしてロケールはクラスではないので、オートローダーの構成はありません。
CakePHP はこれらのリソースの追加パスのセットアップに 3 つの Configure 変数を提供します。
::

    return [
        // More configuration
        'App' => [
            'paths' => [
                'plugins' => [
                    ROOT . DS . 'plugins' . DS,
                    '/path/to/other/plugins/'
                ],
                'templates' => [
                    APP . 'Template' . DS,
                    APP . 'Template2' . DS
                ],
                'locales' => [
                    APP . 'Locale' . DS
                ]
            ]
        ]
    ];

..
    Paths should end with a directory separator, or they will not work properly.

パスはディレクトリセパレータ付きで終了し、そうでないと適切に動作しないです。

..
    Inflection Configuration

Inflection の設定
========================
..
    See the :ref:`inflection-configuration` docs for more information.

:ref:`inflection-configuration` を参照してください。

..
    Configure Class

Configure クラス
====================

.. php:namespace:: Cake\Core

.. php:class:: Configure

..
    CakePHP's Configure class can be used to store and retrieve
    application or runtime specific values. Be careful, this class
    allows you to store anything in it, then use it in any other part
    of your code: a sure temptation to break the MVC pattern CakePHP
    was designed for. The main goal of Configure class is to keep
    centralized variables that can be shared between many objects.
    Remember to try to live by "convention over configuration" and you
    won't end up breaking the MVC structure we've set in place.

CakePHP の Configure クラスはアプリケーションもしくは実行時の特定の値の保存と取り出しで利用されます。
このクラスは何でも保存でき、その後他のどのような箇所でも利用できるため、確実に CakePHP の MVC デザインパターンを破壊する誘惑に気をつけてください。
Configure クラスの主なゴールは、中央集権化された変数を維持し、たくさんのオブジェクト間で共有できることです。
"設定より規約" であることを努めるように、そして MVC の構造を破壊しないように記憶しておいてください。

..
    You can access ``Configure`` from anywhere in your application

 ``Configure`` はどこからでもアクセスできます。
 ::

    Configure::read('debug');

..
    Writing Configuration data

設定データの書き込み
--------------------------

.. php:staticmethod:: write($key, $value)

..
    Use ``write()`` to store data in the application's configuration::

``write()`` を利用してアプリケーションの設定にデータを保存します。
::

    Configure::write('Company.name','Pizza, Inc.');
    Configure::write('Company.slogan','Pizza for your body and soul');

..
    .. note::

    The :term:`dot notation` used in the ``$key`` parameter can be used to
    organize your configuration settings into logical groups.

.. note::

    ``$key`` 変数に :term:`ドット記法` を使用すると、 論理的なグループに設定を整理できます。

..
    The above example could also be written in a single call::

上記例は一度の呼び出しで記述できます。
::

    Configure::write('Company', [
        'name' => 'Pizza, Inc.',
        'slogan' => 'Pizza for your body and soul'
    ]);

..
    You can use ``Configure::write('debug', $bool)`` to switch between debug and
    production modes on the fly. This is especially handy for JSON interactions
    where debugging information can cause parsing problems.

``Configure::write('debug', $bool)`` を利用してデバッグと本番モードをオンザフライ方式で変更できます。
これはとりわけ JSON のやりとりで使いやすく、デバッグ情報がパースの問題を引き起こす際です。

..
    Reading Configuration Data

設定データの読み込み
---------------------------

.. php:staticmethod:: read($key = null)

..
    Used to read configuration data from the application. Defaults to
    CakePHP's important debug value. If a key is supplied, the data is
    returned. Using our examples from write() above, we can read that
    data back::

アプリケーションから設定データを読み込むために利用されます。
引数のデフォルト値はCakePHPにおいて重要なデバッグ用の値です。
もしキーが渡されれば、そのデータが返却されます。
上記 write() の例を取り上げると、以下のようにデータを読み込みます。
::

    Configure::read('Company.name');    // Yields: 'Pizza, Inc.'
    Configure::read('Company.slogan');  // Yields: 'Pizza for your body and soul'

    Configure::read('Company');

    // Yields:
    ['name' => 'Pizza, Inc.', 'slogan' => 'Pizza for your body and soul'];

..
    If $key is left null, all values in Configure will be returned.

もし $key が null のままだと、Configure のすべての値が返却されます。

.. php:staticmethod:: readOrFail($key)

..
    Reads configuration data just like :php:meth:`Cake\\Core\\Configure::read`
    but expects to find a key/value pair. In case the requested pair does not
    exist, a :php:class:`RuntimeException` will be thrown::

設定データを単に :php:meth:`Cake\\Core\\Configure::read` で読み込みますが、
一方で key/value ペアを検索することを期待します。
リクエストされたペアが存在しない場合、 :php:class:`RuntimeException` が投げられます。
::

    Configure::readOrFail('Company.name');    // Yields: 'Pizza, Inc.'
    Configure::readOrFail('Company.geolocation');  // Will throw an exception

    Configure::readOrFail('Company');

    // Yields:
    ['name' => 'Pizza, Inc.', 'slogan' => 'Pizza for your body and soul'];

.. versionadded:: 3.1.7

..
    ``Configure::readOrFail()`` was added in 3.1.7

``Configure::readOrFail()`` は 3.1.7 で追加されました。

..
    Checking to see if Configuration Data is Defined

定義されている設定データのチェック
------------------------------------------------

.. php:staticmethod:: check($key)

..
    Used to check if a key/path exists and has non-null value::

キー / パス が存在しているか、値が null でないかチェックする場合に利用します。
::

    $exists = Configure::check('Company.name');

..
    Deleting Configuration Data

設定データの削除
---------------------------

.. php:staticmethod:: delete($key)

..
    Used to delete information from the application's configuration::

アプリケーションの設定から情報を削除するために利用されます。
::

    Configure::delete('Company.name');

..
    Reading & Deleting Configuration Data

設定データの読み書き
-------------------------------------

.. php:staticmethod:: consume($key)

..
    Read and delete a key from Configure. This is useful when you want to
    combine reading and deleting values in a single operation.

Configure からキーの読み込みと削除を行います。
もしあなたが値の読み込みと削除を単一の動作で組み合わせたい時に便利です。

..
    Reading and writing configuration files

設定ファイルの読み書き
=======================================

.. php:staticmethod:: config($name, $engine)

..
    CakePHP comes with two built-in configuration file engines.
    :php:class:`Cake\\Core\\Configure\\Engine\\PhpConfig` is able to read PHP config
    files, in the same format that Configure has historically read.
    :php:class:`Cake\\Core\\Configure\\Engine\\IniConfig` is able to read ini config
    files.  See the `PHP documentation <http://php.net/parse_ini_file>`_ for more
    information on the specifics of ini files.  To use a core config engine, you'll
    need to attach it to Configure using :php:meth:`Configure::config()`::

CakePHP は 2 つの組み込み設定ファイルエンジンを搭載しています。
:php:class:`Cake\\Core\\Configure\\Engine\\PhpConfig` は Configure が昔から読んできた同じフォーマットで PHP の設定ファイル形式を読み込むことができます。
:php:class:`Cake\\Core\\Configure\\Engine\\IniConfig` は ini 設定ファイル形式を読み込めます。
詳細な ini ファイルの仕様は `PHP マニュアル <http://php.net/parse_ini_file>`_ を参照してください。
コアの設定エンジンを利用するにあたり、Configure に :php:meth:`Configure::config()`:: を設定する必要があります。
::

    use Cake\Core\Configure\Engine\PhpConfig;

    // Read config files from config
    Configure::config('default', new PhpConfig());

    // Read config files from another path.
    Configure::config('default', new PhpConfig('/path/to/your/config/files/'));

..
    You can have multiple engines attached to Configure, each reading different
    kinds or sources of configuration files. You can interact with attached engines
    using a few other methods on Configure. To check which engine aliases are
    attached you can use :php:meth:`Configure::configured()`::

複数のエンジンを Configure に設定することができ、それぞれ異なった種類もしくはパスの設定ファイルを読み込みます。
Configure のいくつかのメソッドを利用して設定されたエンジンとやり取りできます。
どのエンジンのエイリアスが設定されているかチェックするには、 :php:meth:`Configure::configured()` が利用できます。
::

    // 配置されたエンジンのエイリアスの配列を取得する
    Configure::configured();

    // 特定のエンジンが配置されているかチェックする
    Configure::configured('default');

.. php:staticmethod:: drop($name)

..
    You can also remove attached engines. ``Configure::drop('default')``
    would remove the default engine alias. Any future attempts to load configuration
    files with that engine would fail::

配置されたエンジンを取り除くことができます。
``Configure::drop('default')`` は default のエンジンエイリアスを取り除きます。
この先、そのエンジンを使って設定ファイルを読み込もうとする試みは失敗します。
::

    Configure::drop('default');

.. _loading-configuration-files:

..
    Loading Configuration Files

設定ファイルの読み込み
---------------------------

.. php:staticmethod:: load($key, $config = 'default', $merge = true)

..
    Once you've attached a config engine to Configure you can load configuration
    files::

一旦設定エンジンに Configure を設定すると、設定ファイルを読み込むことができます。
::

    // 'default' エンジンオブジェクトを使用して my_file.php を読み込む
    Configure::load('my_file', 'default');

..
    Loaded configuration files merge their data with the existing runtime
    configuration in Configure. This allows you to overwrite and add new values into
    the existing runtime configuration. By setting ``$merge`` to ``true``, values
    will not ever overwrite the existing configuration.

読み込まれた設定ファイルは、自身のデータを Configure 内に存在しているランタイムの設定とマージします。
これは存在しているランタイムの設定へ値の上書きや新規追加を可能とします。
``$merge`` を ``true`` にセットすることで、存在している設定の値を上書きしなくなります。

..
    Creating or Modifying Configuration Files

設定ファイルの作成や編集
-----------------------------------------

.. php:staticmethod:: dump($key, $config = 'default', $keys = [])

..
    Dumps all or some of the data in Configure into a file or storage system
    supported by a config engine. The serialization format is decided by the config
    engine attached as $config. For example, if the 'default' engine is
    a :php:class:`Cake\\Core\\Configure\\Engine\\PhpConfig`, the generated file will be
    a PHP configuration file loadable by the
    :php:class:`Cake\\Core\\Configure\\Engine\\PhpConfig`

全て、もしくはいくつかの Configure にあるデータを、ファイルや設定エンジンがサポートしているストレージシステムにダンプします。
シリアライズのフォーマットは、$config で配置された設定エンジンから決定されます。
例えば、もし 'default' エンジンが :php:class:`Cake\\Core\\Configure\\Engine\\PhpConfig` ならば、
生成されたファイルは :php:class:`Cake\\Core\\Configure\\Engine\\PhpConfig` によって読み込み可能な PHP の設定ファイルになるでしょう。

..
    Given that the 'default' engine is an instance of PhpConfig.
    Save all data in Configure to the file `my_config.php`::

'default' エンジンは PhpConfig のインスタンスとして考えられます。Configure の全てのデータを `my_config.php` に保存します。
::

    Configure::dump('my_config', 'default');

..
    Save only the error handling configuration::

エラーハンドリング設定のみ保存します。
::

    Configure::dump('error', 'default', ['Error', 'Exception']);

..
    ``Configure::dump()`` can be used to either modify or overwrite
    configuration files that are readable with :php:meth:`Configure::load()`

``Configure::dump()`` は設定ファイルの編集もしくは上書きに利用でき、
それは :php:meth:`Configure::load()` によって読み込み可能なファイルです。

..
    Storing Runtime Configuration

ランタイムの設定の保存
-----------------------------

.. php:staticmethod:: store($name, $cacheConfig = 'default', $data = null)

..
    You can also store runtime configuration values for use in a future request.
    Since configure only remembers values for the current request, you will
    need to store any modified configuration information if you want to
    use it in subsequent requests::
    
    //Store the current configuration in the 'user_1234' key in the 'default' cache.
    Configure::store('user_1234', 'default');

将来のリクエストのために、ランタイムの設定もまた保存することができます。
設定は現在のリクエストのみ値を記憶するので、
もしその後のリクエストで編集された設定情報を利用したければ、それを保存する必要があります。
::

    //現在の設定を 'user_1234' キーに 'default' キャッシュとして保存
    Configure::store('user_1234', 'default');

Stored configuration data is persisted in the named cache configuration. See the
:doc:`/core-libraries/caching` documentation for more information on caching.

保存された設定データはその名前のキャッシュ設定で存続します。
キャッシュに関するより詳しい情報は :doc:`/core-libraries/caching` を参照してください。

..
    Restoring Runtime Configuration

ランタイム設定を復元する
-------------------------------

.. php:staticmethod:: restore($name, $cacheConfig = 'default')

..
    Once you've stored runtime configuration, you'll probably need to restore it
    so you can access it again. ``Configure::restore()`` does exactly that::

ひとたびランタイムの設定を保存すると、おそらく復元する必要があり、そして再びそれにアクセスできます。
``Configure::restore()`` がちょうどそれに該当します。
::

    // キャッシュからランタイム設定を復元する
    Configure::restore('user_1234', 'default');

..
    When restoring configuration information it's important to restore it with
    the same key, and cache configuration as was used to store it. Restored
    information is merged on top of the existing runtime configuration.

設定情報を復元した際、同じキーで復元することが重要で、
そしてキャッシュ設定は保存されていたように利用されます。
復元情報は存在しているランタイム設定の上位にマージされます。

..
    Creating your Own Configuration Engines

自分の設定エンジンを作成する
=======================================

..
    Since configuration engines are an extensible part of CakePHP, you can create
    configuration engines in your application and plugins.  Configuration engines
    need to implement the
    :php:interface:`Cake\\Core\\Configure\\ConfigEngineInterface`.  This interface
    defines a read method, as the only required method.  If you like XML
    files, you could create a simple Xml config engine for you application::

設定エンジンは CakePHP の一つの拡張であり、設定エンジンをアプリケーションやプラグインに作成できます。
設定エンジンは :php:interface:`Cake\\Core\\Configure\\ConfigEngineInterface` を継承する必要があります。
このインタフェース
::

    // In src/Configure/Engine/XmlConfig.php
    namespace App\Configure\Engine;

    use Cake\Core\Configure\ConfigEngineInterface;
    use Cake\Utility\Xml;

    class XmlConfig implements ConfigEngineInterface
    {

        public function __construct($path = null)
        {
            if (!$path) {
                $path = CONFIG;
            }
            $this->_path = $path;
        }

        public function read($key)
        {
            $xml = Xml::build($this->_path . $key . '.xml');
            return Xml::toArray($xml);
        }

        public function dump($key, array $data)
        {
            // Code to dump data to file
        }
    }

In your **config/bootstrap.php** you could attach this engine and use it::

    use App\Configure\Engine\XmlConfig;

    Configure::config('xml', new XmlConfig());
    ...

    Configure::load('my_xml', 'xml');

The ``read()`` method of a config engine, must return an array of the
configuration information that the resource named ``$key`` contains.

.. php:namespace:: Cake\Core\Configure

.. php:interface:: ConfigEngineInterface

    Defines the interface used by classes that read configuration data and
    store it in :php:class:`Configure`

.. php:method:: read($key)

    :param string $key: The key name or identifier to load.

    This method should load/parse the configuration data identified by ``$key``
    and return an array of data in the file.

.. php:method:: dump($key)

    :param string $key: The identifier to write to.
        :param array $data: The data to dump.

        This method should dump/store the provided configuration data to a key identified by ``$key``.

Built-in Configuration Engines
==============================

.. php:namespace:: Cake\Core\Configure\Engine

PHP Configuration Files
-----------------------

.. php:class:: PhpConfig

Allows you to read configuration files that are stored as plain PHP files.
You can read either files from your app's config or from plugin configs
directories by using :term:`plugin syntax`. Files *must* return an array.
An example configuration file would look like::

    return [
        'debug' => 0,
        'Security' => [
            'salt' => 'its-secret'
        ],
        'App' => [
            'namespace' => 'App'
        ]
    ];

Load your custom configuration file by inserting the following in
**config/bootstrap.php**::

    Configure::load('customConfig');

Ini Configuration Files
-----------------------

.. php:class:: IniConfig

Allows you to read configuration files that are stored as plain .ini files.
The ini files must be compatible with php's ``parse_ini_file()`` function, and
benefit from the following improvements

* dot separated values are expanded into arrays.
* boolean-ish values like 'on' and 'off' are converted to booleans.

An example ini file would look like::

    debug = 0

    [Security]
    salt = its-secret

    [App]
    namespace = App

The above ini file, would result in the same end configuration data
as the PHP example above. Array structures can be created either
through dot separated values, or sections. Sections can contain
dot separated keys for deeper nesting.


Json Configuration Files
------------------------

.. php:class:: JsonConfig

Allows you to read / dump configuration files that are stored as JSON encoded
strings in .json files.

An example JSON file would look like::

    {
        "debug": false,
        "App": {
            "namespace": "MyApp"
        },
        "Security": {
            "salt": "its-secret"
        }
    }


Bootstrapping CakePHP
=====================

If you have any additional configuration needs, you should add them to your
application's **config/bootstrap.php** file. This file is included before each
request, and CLI command.

This file is ideal for a number of common bootstrapping tasks:

- Defining convenience functions.
- Declaring constants.
- Creating cache configurations.
- Configuring inflections.
- Loading configuration files.

Be careful to maintain the MVC software design pattern when you add things to
the bootstrap file: it might be tempting to place formatting functions there in
order to use them in your controllers. As you'll see in the :doc:`/controllers`
and :doc:`/views` sections there are better ways you add custom logic to your
application.

Environment Variables
=====================

Some of the modern cloud providers, like Heroku, let you define environment
variables. By defining environment variables, you can configure your CakePHP
app as an 12factor app. Following the
`12factor app instructions <http://12factor.net/>`_ is a good way to create a
stateless app, and to ease the deployment of your app.
This means for example, that if you need to change your database, you'll just
need to modify a DATABASE_URL variable on your host configuration without the
need to change it in your source code.

As you can see in your **app.php**, the following variables are concerned:

- ``DEBUG`` (``0`` or ``1``)
- ``APP_ENCODING`` (ie UTF-8)
- ``APP_DEFAULT_LOCALE`` (ie ``en_US``)
- ``SECURITY_SALT``
- ``CACHE_DEFAULT_URL`` (ie ``File:///?prefix=myapp_&serialize=true&timeout=3600&path=../tmp/cache/``)
- ``CACHE_CAKECORE_URL`` (ie ``File:///?prefix=myapp_cake_core_&serialize=true&timeout=3600&path=../tmp/cache/persistent/``)
- ``CACHE_CAKEMODEL_URL`` (ie ``File:///?prefix=myapp_cake_model_&serialize=true&timeout=3600&path=../tmp/cache/models/``)
- ``EMAIL_TRANSPORT_DEFAULT_URL`` (ie ``smtp://user:password@hostname:port?tls=null&client=null&timeout=30``)
- ``DATABASE_URL`` (ie ``mysql://user:pass@db/my_app``)
- ``DATABASE_TEST_URL`` (ie ``mysql://user:pass@db/test_my_app``)
- ``LOG_DEBUG_URL`` (ie ``file:///?levels[]=notice&levels[]=info&levels[]=debug&file=debug&path=../logs/``)
- ``LOG_ERROR_URL`` (ie ``file:///?levels[]=warning&levels[]=error&levels[]=critical&levels[]=alert&levels[]=emergency&file=error&path=../logs/``)

As you can see in the examples, we define some options configuration as
:term:`DSN` strings. This is the case for databases, logs, email transport and
cache configurations.

If the environment variables are not defined in your environment, CakePHP will
use the values that are defined in the **app.php**. You can use
`php-dotenv library <https://github.com/josegonzalez/php-dotenv>`_ to use
environment variables in a local development. See the Readme instructions of the
library for more information.

.. meta::
    :title lang=ja: Configuration
    :keywords lang=ja: finished configuration,legacy database,database configuration,value pairs,default connection,optional configuration,example database,php class,configuration database,default database,configuration steps,index database,configuration details,class database,host localhost,inflections,key value,database connection,piece of cake,basic web
