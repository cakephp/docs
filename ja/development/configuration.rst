構成設定
########

規約は CakePHP のすべてを設定する必要性を取り除きますが、
データベースの認証情報のようないくつかの設定をする必要があります。

さらに、デフォルト値と実装をアプリケーションに合わせて差し替えできるようにするオプションの
設定オプションもあります。

.. index:: app.php, app.php.default

.. index:: configuration

アプリケーションの設定
======================

設定は一般的に PHP か INI ファイルに保存され、アプリケーションのブート処理時に読み込まれます。
CakePHP はデフォルトで一つの設定ファイルからなりますが、もし必要であれば追加の設定ファイルを加え、
ブート処理コードで読み込むことができます。 :php:class:`Cake\\Core\\Configure`
は一般的な設定に利用され、基底クラスのアダプターで提供されている ``config()`` メソッドは設定を
シンプルで明快にします。

追加の設定ファイルの読み込み
----------------------------

もしアプリケーションに多くの設定オプションがあるとき、設定を複数のファイルに分けることで役に立ちます。
**config/** ディレクトリに複数ファイルを作成したのち、 **bootstrap.php** でそれらを読み込めます。 ::

    use Cake\Core\Configure;
    use Cake\Core\Configure\Engine\PhpConfig;

    Configure::config('default', new PhpConfig());
    Configure::load('app', 'default', false);
    Configure::load('other_config', 'default');

追加の設定ファイルを使用して、環境特有の設定に上書きすることもできます。各ファイルを **app.php**
の後で読み込むことで、開発環境やステージング環境の設定をカスタマイズするために
以前に宣言した変数を再定義できます。

一般的な設定
------------

以下は、変数の説明と CakePHP アプリケーションに与える影響です。

debug
    CakePHP のデバッグ出力を制御します。 ``false`` = 本番モードです。
    エラーメッセージやエラー、ワーニング出力を行いません。 ``true`` = エラーとワーニングが出力されます。
App.namespace
    app クラスを見つけるための名前空間。

    .. note::

        名前空間の設定を変更した時は、おそらく **composer.json** ファイルもまた、
        この名前空間を利用するように更新する必要があります。加えて、
        ``php composer.phar dumpautoload`` を実行して、新しいオートローダーを作成してください。

.. _core-configuration-baseurl:

App.baseUrl
    もし CakePHP で Apache の mod\_rewrite を利用する **予定がない** 場合、
    この定義のコメントを解除してください。
    .htaccess ファイルを取り除くことを忘れないでください。
App.base
    アプリの存在するベースディレクトリです。もし ``false`` をセットしたら、自動で検出されます。
    ``false`` 以外の場合、書き出しは `/` から始め、 `/` で終わらないことを確認してください。
    例えば、 `/basedir` は有効な App.base です。さもなければ、
    AuthComponent は適切に動かなくなります。
App.encoding
    あなたのアプリケーションで使用するエンコードを指定します。
    このエンコーディングはレイアウトの charset の生成やエンティティのエンコードに利用されます。
    それは、データベースのエンコードの値と合うように指定すべきです。
App.webroot
    webroot のディレクトリです。
App.wwwRoot
    webroot のファイルパスです。
App.fullBaseUrl
    アプリケーションのルートまでの (プロトコルを含む) 完全修飾ドメイン名です。
    これは完全な URL を生成する際に利用されます。デフォルトでは、この値は
    $_SERVER の環境情報から生成されます。しかし、パフォーマンスを最適化したり、
    他人が ``Host`` ヘッダーを操作するのを心配するならば、自分で指定すべきでしょう。
    CLI 環境 (シェル) ではウェブサーバとの関連が無いので  `fullBaseUrl` を
    $_SERVER から読むことができません。もしシェルから URL を作成する必要がある場合
    (例えばメールの送信) 、自力で指定する必要があります。
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
    クラスベースではないリソースの Configure のパスです。
    ``plugins`` 、 ``templates`` 、 ``locales`` などのサブキーをサポートし、
    それぞれプラグイン、ビューテンプレート、ロケールファイルのパスを指定できます。
Security.salt
    ハッシュ化の時に利用されるランダムな文字列です。
    この値は 対称キー暗号化の際、HMAC ソルトとして利用されます。
Asset.timestamp
    適切なヘルパーを使用した際、アセットファイルの URL (CSS, JavaScript, Image) の終端に
    そのファイルの最終更新時間のタイムスタンプを加えます。
    有効な値:

    - (bool) ``false`` - 何もしません (デフォルト)。
    - (bool) ``true`` - debug が ``true`` の時にタイムスタンプを加えます。
    - (string) 'force' - 常にタイムスタンプを加えます。

データベースの設定
------------------

データベース接続の設定は :ref:`データベース設定 <database-configuration>` を参照してください。

キャッシュの設定
----------------

CakePHP のキャッシュ設定は :ref:`キャッシュ設定 <cache-configuration>` を参照してください。

エラーと例外ハンドリング設定
----------------------------

エラーの設定と例外のハンドリングは :ref:`エラーと例外設定 <error-configuration>` を参照してください。

ログの設定
----------

CakePHP のログの設定は :ref:`log-configuration` を参照してください。

メールの設定
------------

CakePHP のメールプリセットの設定は :ref:`メールの設定 <email-configuration>` を参照してください。

セッションの設定
----------------

CakePHP のセッション操作の設定は :ref:`セッションの設定 <session-configuration>`
を参照してください。

ルーティングの設定
------------------

ルーティングの設定やアプリケーションのルートの作成に関する詳しい情報は
:ref:`ルーティングの設定 <routes-configuration>` を参照してください。

.. _additional-class-paths:

追加のクラスパス
================

追加のクラスパスはアプリケーションで利用されるオートローダーを通じてセットアップされます。
``Composer`` を利用してオートローダーを作成する際、以下のように記述してコントローラーの
代わりのパスを提供します。 ::

    "autoload": {
        "psr-4": {
            "App\\Controller\\": "/path/to/directory/with/controller/folders",
            "App\": "src"
        }
    }

上記は ``App`` と ``App\Controller`` 両方の名前空間のパスをセットアップします。
一つ目のキーが検索され、そのパスにクラス/ファイルが含まれていなければ二つ目のキーが検索されます。
次のようにして、一つの名前空間に複数のディレクトリをマップすることもできます。 ::

    "autoload": {
        "psr-4": {
            "App\": ["src", "/path/to/directory"]
        }
    }

プラグイン、ビュー、テンプレート、ロケールのパス
------------------------------------------------

プラグイン、ビューテンプレート、そしてロケールはクラスではないので、オートローダーの設定はありません。
CakePHP はこれらのリソースの追加パスをセットアップするための 3 つの Configure 変数を提供します。
**config/app.php** の中でこれらの変数をセットできます。 ::

    return [
        // 他の設定
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
=================

:ref:`inflection-configuration` を参照してください。

Configure クラス
================

.. php:namespace:: Cake\Core

.. php:class:: Configure

CakePHP の Configure クラスはアプリケーションもしくは実行時の特定の値の保存と取り出しで利用されます。
このクラスは何でも保存でき、その後他のどのような箇所でも利用できるため、確実に CakePHP の
MVC デザインパターンを破壊する誘惑に気をつけてください。Configure クラスの主なゴールは、
中央集権化された変数を維持し、たくさんのオブジェクト間で共有できることです。
「設定より規約」を維持することを忘れないでください。そうすれば、我々が導入した MVC 構造を
壊すことはないでしょう。

``Configure`` はアプリケーションのどこからでもアクセスできます。 ::

    Configure::read('debug');

設定データの書き込み
--------------------

.. php:staticmethod:: write($key, $value)

``write()`` を利用してアプリケーションの設定にデータを保存します。 ::

    Configure::write('Company.name','Pizza, Inc.');
    Configure::write('Company.slogan','Pizza for your body and soul');

.. note::

    ``$key`` 変数に :term:`ドット記法` を使用すると、 論理的なグループに設定を整理できます。

上記の例は一度の呼び出しでも記述できます。 ::

    Configure::write('Company', [
        'name' => 'Pizza, Inc.',
        'slogan' => 'Pizza for your body and soul'
    ]);

``Configure::write('debug', $bool)`` を利用してデバッグと本番モードを即時に変更できます。
これはとりわけ JSON のやりとりで使いやすく、デバッグ情報がパースの問題を引き起こす際です。

設定データの読み込み
--------------------

.. php:staticmethod:: read($key = null)

アプリケーションから設定データを読み込むために利用されます。
デフォルトは CakePHP の重要な debug 値です。
もしキーが渡されれば、そのデータが返却されます。
上記の write() の例を取り上げると、以下のようにデータを読み込みます。 ::

    Configure::read('Company.name');    // 出力: 'Pizza, Inc.'
    Configure::read('Company.slogan');  // 出力: 'Pizza for your body and soul'

    Configure::read('Company');

    // 出力:
    ['name' => 'Pizza, Inc.', 'slogan' => 'Pizza for your body and soul'];

もし $key が null のままだと、Configure のすべての値が返却されます。


.. php:staticmethod:: readOrFail($key)

設定データを単に :php:meth:`Cake\\Core\\Configure::read` で読み込みますが、
一方で key/value ペアを検索することを期待します。要求されたペアが存在しない場合、
:php:class:`RuntimeException` が投げられます。 ::

    Configure::readOrFail('Company.name');    // 出力: 'Pizza, Inc.'
    Configure::readOrFail('Company.geolocation');  // 例外を投げる

    Configure::readOrFail('Company');

    // 出力:
    ['name' => 'Pizza, Inc.', 'slogan' => 'Pizza for your body and soul'];

.. versionadded:: 3.1.7
    ``Configure::readOrFail()`` は 3.1.7 で追加されました。

定義されている設定データのチェック
----------------------------------

.. php:staticmethod:: check($key)

キー / パス が存在しているか、値が null でないかチェックする場合に利用します。 ::

    $exists = Configure::check('Company.name');

設定データの削除
----------------

.. php:staticmethod:: delete($key)

アプリケーションの設定から情報を削除するために利用されます。 ::

    Configure::delete('Company.name');

設定データの読み書き
--------------------

.. php:staticmethod:: consume($key)

Configure からキーの読み込みと削除を行います。
もしあなたが値の読み込みと削除を単一の動作で組み合わせたい時に便利です。

設定ファイルの読み書き
======================

.. php:staticmethod:: config($name, $engine)

CakePHP は 2 つの組み込み設定ファイルエンジンを搭載しています。
:php:class:`Cake\\Core\\Configure\\Engine\\PhpConfig` は
Configure が昔から読んできた同じフォーマットで PHP の設定ファイル形式を読み込むことができます。
:php:class:`Cake\\Core\\Configure\\Engine\\IniConfig` は ini 設定ファイル形式を読み込めます。
詳細な ini ファイルの仕様は `PHP マニュアル <http://php.net/parse_ini_file>`_ を参照してください。
コアの設定エンジンを利用するにあたり、Configure に :php:meth:`Configure::config()`
を設定する必要があります。 ::

    use Cake\Core\Configure\Engine\PhpConfig;

    // config から設定ファイルを読み込み
    Configure::config('default', new PhpConfig());

    // 別のパスから設定ファイルを読み込み
    Configure::config('default', new PhpConfig('/path/to/your/config/files/'));

複数のエンジンを Configure に設定することができ、それぞれ異なった種類もしくはパスの設定ファイルを
読み込みます。Configure のいくつかのメソッドを利用して設定されたエンジンとやり取りできます。
どのエンジンのエイリアスが設定されているかチェックするには、 :php:meth:`Configure::configured()`
が利用できます。 ::

    // 配置されたエンジンのエイリアスの配列を取得する
    Configure::configured();

    // 特定のエンジンが配置されているかチェックする
    Configure::configured('default');

.. php:staticmethod:: drop($name)

配置されたエンジンを取り除くことができます。
``Configure::drop('default')`` は default のエンジンエイリアスを取り除きます。
この先、そのエンジンを使って設定ファイルを読み込もうとする試みは失敗します。 ::

    Configure::drop('default');

.. _loading-configuration-files:

設定ファイルの読み込み
----------------------

.. php:staticmethod:: load($key, $config = 'default', $merge = true)

一旦設定エンジンに Configure を設定すると、設定ファイルを読み込むことができます。 ::

    // 'default' エンジンオブジェクトを使用して my_file.php を読み込む
    Configure::load('my_file', 'default');

読み込まれた設定ファイルは、自身のデータを Configure 内に存在している実行時の設定とマージします。
これは存在している実行時の設定へ値の上書きや新規追加を可能とします。
``$merge`` を ``true`` にセットすることで、存在している設定の値を上書きしなくなります。

設定ファイルの作成や編集
------------------------

.. php:staticmethod:: dump($key, $config = 'default', $keys = [])

全て、もしくはいくつかの Configure にあるデータを、
ファイルや設定エンジンがサポートしているストレージシステムにダンプします。
シリアライズのフォーマットは、$config で配置された設定エンジンから決定されます。
例えば、もし 'default' エンジンが :php:class:`Cake\\Core\\Configure\\Engine\\PhpConfig`
ならば、生成されたファイルは :php:class:`Cake\\Core\\Configure\\Engine\\PhpConfig`
によって読み込み可能な PHP の設定ファイルになるでしょう。

'default' エンジンは PhpConfig のインスタンスとして考えられます。
Configure の全てのデータを `my_config.php` に保存します。 ::

    Configure::dump('my_config', 'default');

エラーハンドリング設定のみ保存します。 ::

    Configure::dump('error', 'default', ['Error', 'Exception']);

``Configure::dump()`` は :php:meth:`Configure::load()` で読み込み可能な設定ファイルを
変更もしくは上書きするために利用できます。


実行時の設定を保存
------------------

.. php:staticmethod:: store($name, $cacheConfig = 'default', $data = null)

将来のリクエストのために、実行時の設定を保存することができます。
設定は現在のリクエストのみ値を記憶するので、
もしその後のリクエストで編集された設定情報を利用したければ、それを保存する必要があります。 ::

    // 現在の設定を 'user_1234' キーに 'default' キャッシュとして保存
    Configure::store('user_1234', 'default');

保存された設定データはその名前のキャッシュ設定で存続します。
キャッシュに関するより詳しい情報は :doc:`/core-libraries/caching` を参照してください。

実行時の設定を復元
------------------

.. php:staticmethod:: restore($name, $cacheConfig = 'default')

実行時の設定を保存すると、おそらくそれを復元して、再びそれにアクセスする必要があります。
``Configure::restore()`` がちょうどそれに該当します。 ::

    // キャッシュから実行時の設定を復元する
    Configure::restore('user_1234', 'default');

設定情報を復元する場合、それを保存する時に使われたのと同じ鍵、
およびキャッシュ設定で復元することが重要です。
復元された情報は、既存の実行時設定の最上位にマージされます。

自分の設定エンジンを作成
========================

設定エンジンは CakePHP の拡張可能な部品であり、設定エンジンをアプリケーションやプラグインに作成できます。
設定エンジンは :php:interface:`Cake\\Core\\Configure\\ConfigEngineInterface`
を実装する必要があります。このインタフェースは唯一の必須メソッドとして read メソッドを定義します。
もしあなたが XML ファイルを好むなら、シンプルな Xml 設定エンジンを作成できるでしょう。 ::

    // src/Configure/Engine/XmlConfig.php の中で
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
            // ファイルにデータをダンプするためのコード
        }
    }

**config/bootstrap.php** 内にこのエンジンを配置してそれを利用できます。 ::

    use App\Configure\Engine\XmlConfig;

    Configure::config('xml', new XmlConfig());
    ...

    Configure::load('my_xml', 'xml');

設定エンジンの ``read()`` メソッドは、 ``$key`` という名前の
リソースに含まれる設定情報を配列形式で返さなければなりません。

.. php:namespace:: Cake\Core\Configure

.. php:interface:: ConfigEngineInterface

    :php:class:`Configure` 中で設定データの読み込みとその保存を行うクラスによって使用される
    インターフェースを定義します。

.. php:method:: read($key)

    :param string $key: キー名や読み込みの識別子

    このメソッドは ``$key`` で識別される設定データの読み込みやパースを行い、
    ファイルにある配列データを返却すべきです。

.. php:method:: dump($key)

    :param string $key: 書き出しの識別子
    :param array $data: ダンプデータ

    このメソッドは ``$key`` で識別されるキーに
    与えられた設定データのダンプや保存を行うべきです。

組み込みの設定エンジン
======================

.. php:namespace:: Cake\Core\Configure\Engine

PHP の設定ファイル
------------------

.. php:class:: PhpConfig

プレーンな PHP として保存された設定ファイルを読み込むことができます。あなたのアプリの設定ファイル、
もしくは :term:`プラグイン記法` を使用してプラグインの設定ディレクトリから読み込むことができます。
ファイルは *必ず* 配列を返却しなければいけません。設定ファイルの一例はこのようになります。 ::

    return [
        'debug' => 0,
        'Security' => [
            'salt' => 'its-secret'
        ],
        'App' => [
            'namespace' => 'App'
        ]
    ];

**config/bootstrap.php** 内に以下のように挿入して、カスタム設定ファイルを読み込みます。 ::

    Configure::load('customConfig');

Ini 設定ファイル
----------------

.. php:class:: IniConfig

プレーンな .ini ファイルとして保存された設定ファイルを読み込むことができます。
ini ファイルは php の ``parse_ini_file()`` 関数と互換性がある必要があり、
以下の改善事項の恩恵を受けます。

* ドット記法の値は配列に展開される
* 'on' や 'off' のような真偽値じみた値は真偽値に変換される

ini ファイルの一例です。 ::

    debug = 0

    [Security]
    salt = its-secret

    [App]
    namespace = App

上記の ini ファイルでは、先述した PHP の設定データと同じ結果になるでしょう。
配列構造はドット記法の値もしくはセクションを通じて作成されます。
セクションはドットで分割されたキーを深いネストに含むことができます。

Json 設定ファイル
-----------------

.. php:class:: JsonConfig

JSON 形式でエンコードされた .json 設定ファイルを読み込んだりダンプしたりできます。

以下、JSON ファイルの一例です。 ::

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
====================

もし何か追加の設定が必要であれば、 **config/bootstrap.php** ファイルに加えます。
このファイルは各リクエストや CLI コマンドの前に読み込まれます。

このファイルは多数の共通ブート処理タスクに理想的です。

- 便利な関数の定義
- 定数の宣言
- キャッシュ設定の定義
- ロギング設定の定義
- 独自語尾変化の読み込み
- 設定ファイルの読み込み

コントローラーで使うための独自フォーマット関数を配置したくなる欲望にかられる恐れがあります。
カスタムロジックをアプリケーションに加える良い方法は :doc:`/controllers` や
:doc:`/views` のセクションを参照してください。

.. _application-bootstrap:

Application::bootstrap()
------------------------

アプリケーションの低レベルな関心事を設定するために使用する **config/bootstrap.php**
ファイルに加えて、 プラグインのロードや初期化、グローバルイベントリスナーの追加のために
``Application::bootstrap()`` フックメソッドが利用できます。 ::

    // src/Application.php の中で
    namespace App;

    use Cake\Core\Plugin;
    use Cake\Http\BaseApplication;

    class Application extends BaseApplication
    {
        public function bootstrap()
        {
            // config/bootstrap.php を `require_once`  するために parent を呼びます。
            parent::bootstrap();

            Plugin::load('MyPlugin', ['bootstrap' => true, 'routes' => true]);
        }
    }

``Application::bootstrap()`` の中でプラグインやイベントを読み込むと、各テストメソッドで
イベントやルートが再処理されるため :ref:`integration-testing` が簡単になります。

環境変数
========

例えば Heroku のように、いくつかの現代的なクラウド事業者では、環境変数を定義できます。
環境変数を定義することによって、CakePHP アプリケーションを 12factor app のように設定できます。
`12factor app instructions <http://12factor.net/>`_ はステートレスなアプリを作成するための、
そしてデプロイを簡単にするための良い方法です。例えば、もしデータベースを変更することが必要な場合、
ソースコード内で変更することなく、ホスト設定の DATABASE_URL 変数を変更するだけで済みます。

**app.php** を参照の通り、以下の変数が影響されます。

- ``DEBUG`` (``0`` または ``1``)
- ``APP_ENCODING`` (例: UTF-8)
- ``APP_DEFAULT_LOCALE`` (例: ``en_US``)
- ``SECURITY_SALT``
- ``CACHE_DEFAULT_URL`` (例: ``File:///?prefix=myapp_&serialize=true&timeout=3600&path=../tmp/cache/``)
- ``CACHE_CAKECORE_URL`` (例: ``File:///?prefix=myapp_cake_core_&serialize=true&timeout=3600&path=../tmp/cache/persistent/``)
- ``CACHE_CAKEMODEL_URL`` (例: ``File:///?prefix=myapp_cake_model_&serialize=true&timeout=3600&path=../tmp/cache/models/``)
- ``EMAIL_TRANSPORT_DEFAULT_URL`` (例: ``smtp://user:password@hostname:port?tls=null&client=null&timeout=30``)
- ``DATABASE_URL`` (例: ``mysql://user:pass@db/my_app``)
- ``DATABASE_TEST_URL`` (例: ``mysql://user:pass@db/test_my_app``)
- ``LOG_DEBUG_URL`` (例: ``file:///?levels[]=notice&levels[]=info&levels[]=debug&file=debug&path=../logs/``)
- ``LOG_ERROR_URL`` (例: ``file:///?levels[]=warning&levels[]=error&levels[]=critical&levels[]=alert&levels[]=emergency&file=error&path=../logs/``)

例をご覧のように、いくつかの設定オプションを :term:`DSN` 文字列として定義します。
これはデータベースやログ、メール送信やキャッシュ設定のケースが挙げられます。

もし環境変数があなたの環境に定義されていなければ、CakePHP は **app.php** に定義されている変数を利用します。
`php-dotenv ライブラリ <https://github.com/josegonzalez/php-dotenv>`_
を利用して環境変数をローカルの開発に使えます。詳しい情報はライブラリの Readme の説明を参照してください。

.. meta::
    :title lang=ja: 構成設定
    :keywords lang=ja: finished configuration,legacy database,database configuration,value pairs,default connection,optional configuration,example database,php class,configuration database,default database,configuration steps,index database,configuration details,class database,host localhost,inflections,key value,database connection,piece of cake,basic web
