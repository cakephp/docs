構成設定
#############

慣習にのっとることで CakePHP のすべてを設定する必要性はないものの、
データベースの認証のようないくつかの設定をする必要があります。

加えて、任意のオプション設定はデフォルトの値やあなたのアプリケーションに合わせたものに置き換えられるようになります。

.. index:: app.php, app.php.default

.. index:: configuration

アプリケーションの設定
============================

設定は一般的に PHP か INI ファイルに保存され、アプリケーションの bootstrap で読み込まれます。
CakePHP はデフォルトで一つの設定ファイルからなりますが、
もし必要であれば追加の設定ファイルを加え、 **config/bootstrap.php** で読み込むことができます。
:php:class:`Cake\\Core\\Configure` は一般的な設定に利用され、
基底クラスのアダプターで提供されている ``config()`` メソッドは設定をシンプルで明快にします。

追加の設定ファイルの読み込み
--------------------------------------

もしあなたのアプリケーションに多くの設定オプションがあるとき、設定を複数のファイルに分けることで役に立ちます。
**config/** ディレクトリに複数ファイルを作成したのち、 **bootstrap.php** でそれらを読み込めます。
::

    use Cake\Core\Configure;
    use Cake\Core\Configure\Engine\PhpConfig;

    Configure::config('default', new PhpConfig());
    Configure::load('app', 'default', false);
    Configure::load('other_config', 'default');

追加の設定ファイルは環境特有のオーバーライドとしても利用できます。各ファイルを **app.php** の後で読み込むことで、
以前に宣言した変数を再定義でき、 development や staging 環境の設定をカスタマイズ可能となります。

一般的な設定
---------------------

変数の書き方と CakePHP アプリケーションへの影響を以下に記述します。

debug
    CakePHP のデバッグ出力を制御します。 ``false`` = 本番モードです。
    エラーメッセージやエラー、ワーニング出力を行いません。 ``true`` = エラーとワーニングが出力されます。
App.namespace
    app クラス下で見つける名前空間です。

    .. note::

        名前空間の設定を変更した時は、おそらく **composer.json** ファイルもまた
        この名前空間を利用するように更新する必要があります。
        加えて、新しい autoloader を ``php composer.phar dumpautoload`` を実行して作成します。

.. _core-configuration-baseurl:

App.baseUrl
    もし Apache の mod\_rewrite を CakePHPで **利用しない** 予定の場合、この定義のコメントを解除します。
    .htaccess ファイルを取り除くことを忘れないでください。
App.base
    アプリの存在するベースディレクトリです。もし ``false`` をセットしたら、自動で検出されます。
    ``false`` 以外の場合、書き出しは `/` から始め、終わりに `/` を確実に付けないようにしてください。
    例えば、 `/basedir` は有効な App.base です。さもなければ、AuthComponent は適切に動かなくなります。
App.encoding
    あなたのアプリケーションで使用するエンコードを指定します。
    このエンコーディングはレイアウトの charset の生成やエンティティのエンコードに利用されます。
    それは、データベースのエンコードの値と合うように指定すべきです。
App.webroot
    webroot のディレクトリです。
App.wwwRoot
    webroot のファイルパスです。
App.fullBaseUrl
    アプリケーションのルートまでのドメイン名 ( プロトコル含む ) です。
    これは完全な URLs を生成する際に利用されます。デフォルトでは、この値は $_SERVER の環境情報から生成されます。
    しかし、パフォーマンスを最適化したり、他人が ``Host`` ヘッダーを操作するのを心配するならば、自分で指定すべきでしょう。
    CLI 環境 ( シェル ) では web サーバとの関連が無いので  `fullBaseUrl` を $_SERVER から読むことができません。
    もしシェルから URLs を作成する必要がある場合 (例えばメールの送信) 、自力で指定する必要があります。    
App.imageBaseUrl
    webroot 以下の公開画像ディレクトリのパスになります。
    もし :term:`CDN` を利用している場合、CDN の場所をセットすべきです。
App.cssBaseUrl
    webroot 以下の公開 css ディレクトリのパスになります。
    もし :term:`CDN` を利用している場合、CDN の場所をセットすべきです。
App.jsBaseUrl
    webroot 以下の公開 js ディレクトリのパスになります。
    もし :term:`CDN` を利用している場合、CDN の場所をセットすべきです。
App.paths
    Configure の class ベースでないリソースのパスです。
    ``plugins`` 、 ``templates`` 、 ``locales`` などのサブキーをサポートし、
    それぞれプラグイン、view テンプレート、locale ファイルのパスを指定できます。
Security.salt
    ハッシュ化の時に利用されるランダムな文字列です。
    この値は 対称暗号化の際、HMAC ソルトのように利用されます。
Asset.timestamp
    適切なヘルパーを使用した際、アセットファイルの URLs (CSS, JavaScript, Image) の終端に
    そのファイルの最終更新時間のタイムスタンプを加えます。
    有効な値:

    - (bool) ``false`` - 何もしません (デフォルト)
    - (bool) ``true`` - debug が ``true`` の時に加えます
    - (string) 'force' - 常にタイムスタンプを加えます

データベースの設定
----------------------

データベース接続の設定は :ref:`データベース設定 <database-configuration>` を参照してください。

キャッシュの設定
---------------------

CakePHP のキャッシュ設定は :ref:`キャッシュ設定 <cache-configuration>` を参照してください。

エラーと例外ハンドリング設定
------------------------------------------

エラーの設定と例外のハンドリングは :ref:`エラーと例外設定 <error-configuration>` を参照してください。

ログの設定
---------------------

CakePHP のログの設定は :ref:`log-configuration` を参照してください。

メールの設定
-------------------

CakePHP のメールプリセットの設定は :ref:`メールの設定 <email-configuration>` を参照してください。

セッションの設定
---------------------

CakePHP のセッション操作の設定は :ref:`セッションの設定 <session-configuration>` を参照してください。

ルーティングの設定
---------------------

ルーティングの設定やあなたのアプリケーションのルートの作成に関するより多くの情報は :ref:`ルーティングの設定 <session-configuration>` を参照してください。

.. _additional-class-paths:

追加のクラスパス
======================

追加のクラスパスはあなたのアプリケーションで利用されるオートローダーを通じてセットアップされます。
``Composer`` を利用してオートローダーを作成する際、以下のように記述してコントローラーの fallback パスを提供します。
::

    "autoload": {
        "psr-4": {
            "App\\Controller\\": "/path/to/directory/with/controller/folders",
            "App\": "src"
        }
    }

上記は ``App`` と ``App\Controller`` 両方の名前空間のセットアップパスです。
一つ目のキーが検索され、もしパスがその class/file に含まれなければ二つ目のキーが検索されます。
一つの名前空間に複数のディレクトリをマップでき、以下のように記述します。
::

    "autoload": {
        "psr-4": {
            "App\": ["src", "/path/to/directory"]
        }
    }

プラグイン、ビュー、テンプレート、ロケールのパス
----------------------------------------------------------------------------

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

パスはディレクトリセパレータ付きで終了し、そうでないと適切に動作しないです。

Inflection の設定
========================

:ref:`inflection-configuration` を参照してください。

Configure クラス
====================

.. php:namespace:: Cake\Core

.. php:class:: Configure

CakePHP の Configure クラスはアプリケーションもしくは実行時の特定の値の保存と取り出しで利用されます。
このクラスは何でも保存でき、その後他のどのような箇所でも利用できるため、確実に CakePHP の MVC デザインパターンを破壊する誘惑に気をつけてください。
Configure クラスの主なゴールは、中央集権化された変数を維持し、たくさんのオブジェクト間で共有できることです。
"設定より規約" であることを努めるように、そして MVC の構造を破壊しないように記憶しておいてください。

``Configure`` はどこからでもアクセスできます。
::

    Configure::read('debug');

設定データの書き込み
--------------------------

.. php:staticmethod:: write($key, $value)

``write()`` を利用してアプリケーションの設定にデータを保存します。
::

    Configure::write('Company.name','Pizza, Inc.');
    Configure::write('Company.slogan','Pizza for your body and soul');

.. note::

    ``$key`` 変数に :term:`ドット記法` を使用すると、 論理的なグループに設定を整理できます。

上記例は一度の呼び出しで記述できます。
::

    Configure::write('Company', [
        'name' => 'Pizza, Inc.',
        'slogan' => 'Pizza for your body and soul'
    ]);

``Configure::write('debug', $bool)`` を利用してデバッグと本番モードをオンザフライ方式で変更できます。
これはとりわけ JSON のやりとりで使いやすく、デバッグ情報がパースの問題を引き起こす際です。

設定データの読み込み
---------------------------

.. php:staticmethod:: read($key = null)

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

もし $key が null のままだと、Configure のすべての値が返却されます。

.. php:staticmethod:: readOrFail($key)

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

``Configure::readOrFail()`` は 3.1.7 で追加されました。

定義されている設定データのチェック
------------------------------------------------

.. php:staticmethod:: check($key)

キー / パス が存在しているか、値が null でないかチェックする場合に利用します。
::

    $exists = Configure::check('Company.name');

設定データの削除
---------------------------

.. php:staticmethod:: delete($key)

アプリケーションの設定から情報を削除するために利用されます。
::

    Configure::delete('Company.name');

設定データの読み書き
-------------------------------------

.. php:staticmethod:: consume($key)

Configure からキーの読み込みと削除を行います。
もしあなたが値の読み込みと削除を単一の動作で組み合わせたい時に便利です。

設定ファイルの読み書き
=======================================

.. php:staticmethod:: config($name, $engine)

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

複数のエンジンを Configure に設定することができ、それぞれ異なった種類もしくはパスの設定ファイルを読み込みます。
Configure のいくつかのメソッドを利用して設定されたエンジンとやり取りできます。
どのエンジンのエイリアスが設定されているかチェックするには、 :php:meth:`Configure::configured()` が利用できます。
::

    // 配置されたエンジンのエイリアスの配列を取得する
    Configure::configured();

    // 特定のエンジンが配置されているかチェックする
    Configure::configured('default');

.. php:staticmethod:: drop($name)

配置されたエンジンを取り除くことができます。
``Configure::drop('default')`` は default のエンジンエイリアスを取り除きます。
この先、そのエンジンを使って設定ファイルを読み込もうとする試みは失敗します。
::

    Configure::drop('default');

.. _loading-configuration-files:

設定ファイルの読み込み
---------------------------

.. php:staticmethod:: load($key, $config = 'default', $merge = true)

一旦設定エンジンに Configure を設定すると、設定ファイルを読み込むことができます。
::

    // 'default' エンジンオブジェクトを使用して my_file.php を読み込む
    Configure::load('my_file', 'default');

読み込まれた設定ファイルは、自身のデータを Configure 内に存在しているランタイムの設定とマージします。
これは存在しているランタイムの設定へ値の上書きや新規追加を可能とします。
``$merge`` を ``true`` にセットすることで、存在している設定の値を上書きしなくなります。

設定ファイルの作成や編集
-----------------------------------------

.. php:staticmethod:: dump($key, $config = 'default', $keys = [])

全て、もしくはいくつかの Configure にあるデータを、ファイルや設定エンジンがサポートしているストレージシステムにダンプします。
シリアライズのフォーマットは、$config で配置された設定エンジンから決定されます。
例えば、もし 'default' エンジンが :php:class:`Cake\\Core\\Configure\\Engine\\PhpConfig` ならば、
生成されたファイルは :php:class:`Cake\\Core\\Configure\\Engine\\PhpConfig` によって読み込み可能な PHP の設定ファイルになるでしょう。

'default' エンジンは PhpConfig のインスタンスとして考えられます。Configure の全てのデータを `my_config.php` に保存します。
::

    Configure::dump('my_config', 'default');

エラーハンドリング設定のみ保存します。
::

    Configure::dump('error', 'default', ['Error', 'Exception']);

``Configure::dump()`` は設定ファイルの編集もしくは上書きに利用でき、
それは :php:meth:`Configure::load()` によって読み込み可能なファイルです。

ランタイムの設定の保存
-----------------------------

.. php:staticmethod:: store($name, $cacheConfig = 'default', $data = null)

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

ランタイム設定を復元する
-------------------------------

.. php:staticmethod:: restore($name, $cacheConfig = 'default')

ひとたびランタイムの設定を保存すると、おそらく復元する必要があり、そして再びそれにアクセスできます。
``Configure::restore()`` がちょうどそれに該当します。
::

    // キャッシュからランタイム設定を復元する
    Configure::restore('user_1234', 'default');

設定情報を復元した際、同じキーで復元することが重要で、
そしてキャッシュ設定は保存されていたように利用されます。
復元情報は存在しているランタイム設定の上位にマージされます。

自分の設定エンジンを作成する
=======================================

設定エンジンは CakePHP の一つの拡張であり、設定エンジンをアプリケーションやプラグインに作成できます。
設定エンジンは :php:interface:`Cake\\Core\\Configure\\ConfigEngineInterface` を継承する必要があります。
このインタフェースは単一の必須メソッドとして読み込みメソッドを決定します。
もしあなたが XML ファイルを好むなら、シンプルな Xml 設定エンジンを作成できるでしょう。
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

**config/bootstrap.php** 内にこのエンジンを配置してそれを利用できます。
::

    use App\Configure\Engine\XmlConfig;

    Configure::config('xml', new XmlConfig());
    ...

    Configure::load('my_xml', 'xml');

``read()`` メソッドは、 ``$key`` を含んだ名前のリソースで配列形式の設定情報を返却しなければいけません。

.. php:namespace:: Cake\Core\Configure

.. php:interface:: ConfigEngineInterface

    クラス形式でインターフェースを定義づけ、設定の読み込みと保存を :php:class:`Configure` にて行います。

.. php:method:: read($key)

    :param string $key: キー名や読み込みの識別子

    このメソッドは ``$key`` で識別された設定データの読み込みやパースを行い、ファイルにある配列データを返却するでしょう。

.. php:method:: dump($key)

    :param string $key: 書き出しの識別子
    :param array $data: ダンプデータ

    このメソッドは ``$key`` で識別されている設定データのダンプや保存を行うでしょう。

組み込みの設定エンジン
==============================

.. php:namespace:: Cake\Core\Configure\Engine

PHP の設定ファイル
-----------------------

.. php:class:: PhpConfig

素の PHP として保存された設定ファイルを読み込むことができます。
あなたのアプリの設定ファイル、もしくは :term:`プラグイン記法` を使用してプラグインの設定ディレクトリから読み込むことができます。
ファイルは *必ず* 配列を返却しなければいけません。
設定ファイルの一例はこのようになります。
::

    return [
        'debug' => 0,
        'Security' => [
            'salt' => 'its-secret'
        ],
        'App' => [
            'namespace' => 'App'
        ]
    ];

カスタム設定ファイルは、以下のように **config/bootstrap.php** 内に記述して挿入してください。
::

    Configure::load('customConfig');

Ini設定ファイル
-----------------------

.. php:class:: IniConfig

素の .ini ファイルとして保存された設定ファイルを読み込むことができます。
ini ファイルは php の ``parse_ini_file()`` と互換性がある必要があり、以下の改善事項の恩恵を受けます。

* ドット記法の値は配列に展開される
* 'on' や 'off' のような真偽値じみた値は真偽値に変換される

ini ファイルの一例です。
::

    debug = 0

    [Security]
    salt = its-secret

    [App]
    namespace = App

上記 ini ファイルでは、先述した PHP の設定データと同じ結果になるでしょう。
配列構造はドット記法の値もしくはセクションを通じて作成されます。
セクションはドットで分割されたキーを深いネストに含むことができます。

Json 設定ファイル
------------------------

.. php:class:: JsonConfig

JSON 形式でエンコードされた .json 設定ファイルを読み込んだりダンプしたりできます。

以下、JSON ファイルの一例です。
::

    {
        "debug": false,
        "App": {
            "namespace": "MyApp"
        },
        "Security": {
            "salt": "its-secret"
        }
    }


CakePHP のブート処理
=====================

もし何か追加の設定が必要であれば、 **config/bootstrap.php** ファイルに加えます。
このファイルは各リクエストや CLI コマンドの前に読み込まれます。

このファイルは多数の共通ブート処理タスクに理想的です。

- 便利な関数の定義
- 定数の宣言
- キャッシュの設定
- 語尾変化の設定
- 設定ファイルの読み込み

何かを bootstrap ファイルに追加する場合は、MVC ソフトウェアのデザインパターンを保つように注意が必要です。
コントローラーで使うための独自フォーマット関数を配置したくなる欲望にかられる恐れがあります。
カスタムロジックをアプリケーションに加える良い方法は :doc:`/controllers` や :doc:`/views` のセクションを参照してください。

環境変数
=====================

例えば Heroku のように、いくつかの現代的なクラウド事業者では、環境変数を定義できます。
環境変数の定義にあたり、あなたの CakePHP アプリケーションを 12factor app のように設定できます。
`12factor app instructions <http://12factor.net/>`_ はステートレスアプリを作成するのに良い方法で、
そしてデプロイを簡単ににします。
例えばこれの意味するところは、もしあなたがデータベースの変更が必要な場合、
ソースコードの変更を必要とせず、ホストの設定にある DATABASE_URL 変数を編集するのみです。

**app.php** を参照の通り、以下の変数が影響されます。

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

例をご覧のように、いくつかの設定オプションを :term:`DSN` 文字列として定義します。
これはデータベースやログ、メール送信やキャッシュ設定のケースが挙げられます。

もし環境変数があなたの環境に定義されていなければ、CakePHP は **app.php** に定義されいてる変数を利用します。
`php-dotenv library <https://github.com/josegonzalez/php-dotenv>`_ を利用して環境変数をローカルの開発に使えます。
ライブラリの Readme により多くの情報を参照してください。

.. meta::
    :title lang=ja: Configuration
    :keywords lang=ja: finished configuration,legacy database,database configuration,value pairs,default connection,optional configuration,example database,php class,configuration database,default database,configuration steps,index database,configuration details,class database,host localhost,inflections,key value,database connection,piece of cake,basic web
