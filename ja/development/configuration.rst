構成設定
########

CakePHP アプリケーションの設定は非常に簡単です。CakePHP の
インストールができたら、基本的な Web アプリを作り、それに必要な
データベース設定をセットアップしてみましょう。

もちろん CakePHP の柔軟なアーキテクチャの利点を活用するため、
いろいろなオプションの設定手順も用意されています。CakePHP
コアから継承された機能に簡単な追加を行なうことで、たとえば URL
マッピングルール(route)を追加／設定したり、単語の語尾変化
ルール(inflection)を追加／変更したりできます。

.. index:: database.php, database.php.default
.. _database-configuration:

データベース設定
================

CakePHP では、データベースの詳細設定は ``app/Config/database.php``
ファイルに記載されていることを前提としています。
``app/Config/database.php.default`` ファイルにデータベースの設定例が
記載されています。設定後の内容は、たとえば以下のようになります::

    class DATABASE_CONFIG {
        public $default = array(
            'datasource'  => 'Database/Mysql',
            'persistent'  => false,
            'host'        => 'localhost',
            'login'       => 'cakephpuser',
            'password'    => 'c4k3roxx!',
            'database'    => 'my_cakephp_project',
            'prefix'      => ''
        );
    }

モデルの中で ``$useDbConfig`` プロパティが指定されない場合は、
$default という名の接続用配列が使われます。たとえばあなたの
アプリケーションで、デフォルトのデータベース以外にも従来から
使っている(legacy)データベースを使う必要がある場合、モデルの中で
$default 配列と同様の形式で新しいデータベース $legacy を作り、
さらに適切なモデルの中で ``public $useDbConfig = 'legacy';``
のように書きます。

設定配列の中のキー／値のペアを、
あなたの要求に合うように適切に設定してください。

datasource
    この設定配列が依存するデータソースの名前。
    例：Database/Mysql, Database/Sqlserver, Database/Postgres, Database/Sqlite
    プラグインに含まれるデータソースを使う場合は :term:`プラグイン記法`
    という書式で指定します。
persistent
    データベースへの永続的接続を使うかどうか。SQLServer を使用している場合、
    永続的接続を有効にすべきではありません。クラッシュの診断が困難になります。
host
    データソースサーバのホスト名（またはIPアドレス）
login
    データベースアカウントのユーザ名
password
    データベースアカウントのパスワード
database
    この接続で利用するデータベース名
prefix (*オプション*)
    データベース中のすべてのテーブル名の前にこの prefix を付加する。
    prefix を使わない場合は空文字列のままにします。
port (*オプション*)
    サーバに接続するための TCP ポート番号または Unix ソケット
encoding
    SQL ステートメントをサーバに送る際に使用する文字コード。
    デフォルトは、DB2 以外はそのデータベースのデフォルト値。
    mysql/mysqli 接続で UTF-8 をエンコーディングを使いたい場合、
    'utf8'（ハイフンなし）と指定してください。
schema
    どのスキーマを使うかを指定（PostgreSQL データベース利用時のみ）
unix_socket
    UNIX のソケットファイル経由での接続をサポートするドライバで使われます。
    PostgreSQL を Unix ソケット経由いたい場合、ホスト(host)の設定値は
    ブランクのままにしておきます。
ssl_key
    SSL キーファイルへのパス（MySQL のみサポート、PHP 5.3.7 以降が必要）
ssl_cert
    SSL 証明書ファイルへのパス（MySQL のみサポート、PHP 5.3.7 以降が必要）
ssl_ca
    SSL CA ファイルへのパス（MySQL のみサポート、PHP 5.3.7 以降が必要）
settings
    キー／値のペアを持つ配列を指定すると、データベースサーバへの
    接続が確立された後、これらが ``SET`` コマンドとしてサーバに
    送られます。現時点では MySQL, Postgres, SQLserver のみでの
    サポートです。

.. versionchanged:: 2.4
     ``settings``, ``ssl_key``, ``ssl_cert``, ``ssl_ca`` キーは
    2.4 で追加されました。

.. note::

    prefix 設定はテーブルに対して適用されますが、モデルには **適用されません** 。
    たとえばあなたが自分の Apple and Flavor モデル用に JOIN テーブルを
    作る場合、そのテーブル名は（prefix\_apples\_prefix\_flavors **ではなく** ）
    prefix\_apples\_flavors とし、prefix 設定は 'prefix\_' としてください。

ここで、一度 :doc:`/getting-started/cakephp-conventions`
を見ておくことをおすすめします。テーブル（およびいくつかのカラム）
に関する正確なネーミングルールを適用することで、自由に Cake の
能力を引き出すことができ、またいくつかの設定作業を省略できます。
たとえば、あなたのデータベーステーブルの名前を big\_boxes 、
モデル名を BigBox 、コントローラ名ーを BigBoxesController 
とすることで、すべての機能が自動的に有効になります。慣習として、
データベーステーブル名はアンダースコア、小文字、複数形にします。
たとえば bakers, pastry\_stores, and savory\_cakes のようにします。

.. todo::

    SQLServer, Postgres,MySQL といった、それぞれのデータベースベンダー
    固有のオプション指定に関する情報を追加するべき。

追加のクラスパス
================

同一システム上の複数のアプリケーション間で MVC クラスを共有できると
有用な場合があります。両方のアプリケーションで同一のコントローラーを
持たせたい場合、CakePHP の bootstrap.php を使ってそれらの追加クラスを
読み替えさせることができます。

bootstrap.php の中で :php:meth:`App::build()` を使うと、CakePHP
がクラスを検索する際の追加パスを定義できます::

    App::build(array(
        'Model' => array(
            '/path/to/models',
            '/next/path/to/models'
        ),
        'Model/Behavior' => array(
            '/path/to/behaviors',
            '/next/path/to/behaviors'
        ),
        'Model/Datasource' => array(
            '/path/to/datasources',
            '/next/path/to/datasources'
        ),
        'Model/Datasource/Database' => array(
            '/path/to/databases',
            '/next/path/to/database'
        ),
        'Model/Datasource/Session' => array(
            '/path/to/sessions',
            '/next/path/to/sessions'
        ),
        'Controller' => array(
            '/path/to/controllers',
            '/next/path/to/controllers'
        ),
        'Controller/Component' => array(
            '/path/to/components',
            '/next/path/to/components'
        ),
        'Controller/Component/Auth' => array(
            '/path/to/auths',
            '/next/path/to/auths'
        ),
        'Controller/Component/Acl' => array(
            '/path/to/acls',
            '/next/path/to/acls'
        ),
        'View' => array(
            '/path/to/views',
            '/next/path/to/views'
        ),
        'View/Helper' => array(
            '/path/to/helpers',
            '/next/path/to/helpers'
        ),
        'Console' => array(
            '/path/to/consoles',
            '/next/path/to/consoles'
        ),
        'Console/Command' => array(
            '/path/to/commands',
            '/next/path/to/commands'
        ),
        'Console/Command/Task' => array(
            '/path/to/tasks',
            '/next/path/to/tasks'
        ),
        'Lib' => array(
            '/path/to/libs',
            '/next/path/to/libs'
        ),
        'Locale' => array(
            '/path/to/locales',
            '/next/path/to/locales'
        ),
        'Vendor' => array(
            '/path/to/vendors',
            '/next/path/to/vendors'
        ),
        'Plugin' => array(
            '/path/to/plugins',
            '/next/path/to/plugins'
        ),
    ));

.. note::

    あなたのアプリケーションの一番上にある bootstrap.php で、
    すべての追加パスを設定する必要があります。こうすることで、
    これ以降のアプリケーションにおいて、これらのパスが
    有効になります。

.. index:: core.php, configuration

コア（中核部）設定
==================

CakePHP の各アプリケーションには、CakePHP 内部の振る舞いを決めるための
設定ファイルが含まれます。それは ``app/Config/core.php`` です。
このファイルは設定用クラス変数や、あなたのアプリケーションが
どう振る舞うかを決めるための定数の定義の集まりです。それぞれの
変数を見て行く前に、まずは CakePHP の設定レジストリである
:php:class:`Configure` を抑えておく必要があります。

CakePHP のコア設定
------------------

:php:class:`Configure` クラスは、CakePHP コアの設定用変数群を
管理するために使われます。これらの変数は ``app/Config/core.php``
にあります。それぞれの変数の定義や、それらがあなたの CakePHP
アプリケーションにどう影響するのかを以下に示します。

debug
    CakePHP のデバッグ出力を制御します。
    0 = 本番モード。出力を行いません。
    1 = エラーや警告を出力します。
    2 = エラーや警告、および SQL を出力します。
    [ SQL のログは、ビューやレイアウト内で
    $this->element('sql\_dump') をしている場合にのみ表示されます。 ]

Error
    あなたのアプリケーションのエラーを処理するためのエラーハンドラー
    を設定します。デフォルトでは :php:meth:`ErrorHandler::handleError()`
    が使われます。これは、debug > 0 の場合は :php:class:`Debugger` を、
    debug = 0 の場合は :php:class:`CakeLog` でエラーログ出力をしている
    場合にエラーを表示します。

    サブキー:

    * ``handler`` - callback - エラーを処理するためのコールバック関数。
      これには無名関数を含む、あらゆるタイプのコールバックを指定可能です。
    * ``level`` - int - 捕捉したいエラーのレベル。
    * ``trace`` - boolean - ログファイルにエラーのスタックトレースを出力。

Exception
    捕捉されていない例外に対して使われる、例外ハンドラーを設定します。
    デフォルトでは ErrorHandler::handleException() が使われます。
    これは例外の HTML ページを表示し、さらに debug > 0 の場合であれば、
    コントローラーがないといったフレームワークのエラーも表示します。
    debug = 0 の場合、フレームワークのエラーは強制的に一般的な HTTP
    レベルのエラーに変換されます。例外ハンドリングに関する詳細は
    :doc:`exceptions` セクションを参照してください。

.. _core-configuration-baseurl:

App.baseUrl
    もしあなたのサーバで mod\_rewrite （や、その他の互換モジュール）
    を使いたくない、もしくは使えない場合、CakePHP 組み込みの優れた
    URL のしくみを使うことになります。 ``/app/Config/core.php``
    で以下のような行のコメントを外して有効にしてください::

        Configure::write('App.baseUrl', env('SCRIPT_NAME'));

    さらに、これらの .htaccess ファイルを削除します::

        /.htaccess
        /app/.htaccess
        /app/webroot/.htaccess

    これであなたの URL は、たとえば
    www.example.com/controllername/actionname/param
    ではなく
    www.example.com/index.php/controllername/actionname/param
    として扱われます。

    もし CakePHP を Apache 以外の環境にインストールしようとしている
    場合、それぞれのサーバで URL 書き換えを行なう方法について、
    :doc:`/installation/url-rewriting` に記載があります。
App.encoding
    あなたのアプリケーションで使用しているエンコーディングを定義します。
    このエンコーディングは、レイアウトの中の charset やエンティティ
    のエンコードを生成するのに使われます。この指定はあなたのデータベース
    で使用しているエンコーディングと一致させる必要があります。
Routing.prefixes
    admin のような CakePHP の接頭辞(prefix)ルーティングを活用
    したい場合はコメントを外して有効にします。この変数には使用したい
    ルーティングの接頭辞名の配列を指定します。詳細は後述します。
Cache.disable
    true にすると、サイト全体のキャッシュを無効にします。
    これを行なうと、 :php:class:`Cache` に対するすべての
    read/write は失敗します。
Cache.check
    true にすると、ビューのキャシュを有効にします。さらにコントローラー
    の中でも指定する必要がありますが、この変数はこれらの設定の検出
    を行います。
Session
    セッション機能に関して使われる設定の配列です。デフォルトのプリセット
    定義として 'defaults' キーが使われますが、ここで宣言されている設定は
    デフォルトの設定を上書きします。

    サブキー

    * ``name`` - 使用するクッキーの名前。デフォルトは 'CAKEPHP'。
    * ``timeout`` - セッションの有効期間（単位：分）。
      この timeout は CakePHP が制御します。
    * ``cookieTimeout`` - セッションクッキーを有効にしたい期間（単位：分）。
    * ``checkAgent`` - セッションの開始時にユーザーエージェント文字列を
      チェックするかどうか。古い IE/Chrome でフレームを使う場合や、Web
      ブラウザ機能を持つ一部のデバイスで AJAX を使いたい場合に false
      にする必要があるかもしれません。
    * ``defaults`` - あなたのセッションの基本構成として使用する
      デフォルト設定。php, cake, cache, database という４種類の
      ビルトイン機構があります。
    * ``handler`` - ユーザー独自のセッションハンドラーとして使えます。
       このハンドラーは `session_save_handler` と一緒に使える callable 
       の配列を期待します。このオプションを有効にすると、ini 配列に
       `session.save_handler` が自動的に追加されます。
    * ``autoRegenerate`` - この設定を有効にすると、セッションを毎回
      自動生成し、セッション ID が頻繁に変わります。詳細は
      :php:attr:`CakeSession::$requestCountdown` を参照してください。
    * ``ini`` - ini の値として追加で設定したい連想配列。

    ビルトインのデフォルトは以下の通りです:

    * 'php' - あなたの php.ini で定義されている設定を使う
    * 'cake' - セッションファイルを CakePHP の /tmp ディレクトリに保存する
    * 'database' - CakePHP のデータベースセッションを使う
    * 'cache' - セッションの保存に Cache クラスを使う

    カスタムセッションハンドラーを定義する場合、
    ``app/Model/Datasource/Session/<name>.php`` に記載します。
    そのクラスは :php:interface:`CakeSessionHandlerInterface` を
    インプリメント(implements)している必要があります。
    また Session.handler を <name> に設定してください。

    データベースセッションを使うには、cake のシェルコマンド:
    ``cake schema create Sessions`` を使って
    ``app/Config/Schema/sessions.php`` を実行します。

Security.salt
    セキュリティ関連のハッシュ処理で使われるランダムな文字列
Security.cipherSeed
    文字列を暗号化／復号化するのに使われるランダムな文字列（数字のみ）
Asset.timestamp
    適切なヘルパーを使っている場合、静的ファイルの URL
    (CSS, JavaScript, 画像) の末尾に個々のファイルの最終更新時刻
    を表すタイムスタンプを追加します。
    有効な値は以下の通りです:
    (boolean) false - 何もしない（デフォルト）
    (boolean) true - debug > 0 の場合にタイムスタンプを付加
    (string) 'force' - debug >= 0 の場合にタイムスタンプを付加
Acl.classname, Acl.database
    CakePHP のアクセス制御リスト(ACL)機能で使われる定数。
    詳細はアクセス制御リストの章を参照してください。

.. note::
    キャッシュの設定は core.php にもあります。
    - 後日追記します。新しい情報が追加されたらお知らせします。

:php:class:`Configure` クラスは、コアの設定をその場で読み書き
するのに使われます。これは、たとえばあなたのアプリケーションの
限られた範囲でデバッグ設定を有効にしたい場合などに特に便利です。

構成用定数
----------

ほとんどの構成用設定は Configure によって処理されますが、実行時に
CakePHP が参照する定数がいくつか存在します。

.. php:const:: LOG_ERROR

    エラー定数。エラーログ出力とデバッグを区別するのに使われます。
    現在 PHP は LOG\_DEBUG をサポートします。

コアのキャッシュ設定
--------------------

CakePHP は内部的に ``_cake_model_`` と ``_cake_core_`` 
という２つのキャッシュ設定を使います。``_cake_core_`` はファイルの
パスやオブジェクトの格納位置を保存するのに使われ、``_cake_model_``
はスキーマの定義やデータソースのソース一覧を保存するのに使われます。
これらはリクエストのたびに参照されますので、APC や Memcached のような、
高速なキャッシュストレージを使う際の推奨設定になっています。デフォルト
では debug > 0 の場合、いずれの設定も 10 秒おきに有効期限が切れます。

すべてのキャシュデータは :php:class:`Cache` で保存され、
:php:meth:`Cache::clear()` を使ってクリアできます。

クラスの設定
============

.. php:class:: Configure

CakePHP では設定が必要な項目はほとんどありませんが、あなたの
アプリケーション固有の設定ルールを作ることが有用な場合もあります。
あなたは過去に、いくつかのファイルの中で変数や定数を定義することで、
独自の設定値を持たせていたようなケースがあったかもしれません。
このルールを強制し、これらの値を使うためには、毎回設定ファイルを
インクルードする必要がありました。

CakePHP の Configure クラスは、アプリケーションや実行時固有の値を
保存したり取り出したりするのに使います。注意していただきたいのですが、
このクラスは、その中にいかなるものでも格納することができ、さらにあなたの
コードのいかなる箇所でもそれらを使うことができてしまいます。
これにより、CakePHP のデザインの元になっている MVC パターンを
壊してしまうことになりかねません。 Configure クラスのそもそもの目的は、
多数のオブジェクト間で共有できる変数群の集中管理です。
"convention over configuration（設定より規約）"の世界の中で生きようと
する努力を怠らず、せっかく私たちが整えた MVC 構造という環境を壊すことの
ないようにしてください。

このクラスは、あなたのアプリケーション中の静的なコンテキストにおいて、
いかなるところからでも呼び出せるようになっています::

    Configure::read('debug');

.. php:staticmethod:: write($key, $value)

    :param string $key: 書き込むキー。 :term:`ドット記法` が使えます。
    :param mixed $value: 保存する値

    アプリケーションの設定の中で ``write()`` を使ってデータを格納します::

        Configure::write('Company.name','Pizza, Inc.');
        Configure::write('Company.slogan','Pizza for your body and soul');

    .. note::

        ``$key`` パラメーターで使われる :term:`ドット記法` により、
        あなたの構成設定値を論理的にグループ化できます。

    直前の例は、以下のような単一の呼び出しとしても書けます::

        Configure::write(
            'Company',
            array(
                'name' => 'Pizza, Inc.',
                'slogan' => 'Pizza for your body and soul'
            )
        );

    ``Configure::write('debug', $int)`` を使えば、その場で動的に
    デバッグモードと本番モードを行ったり来たりできます。特に、
    AMF や SOAP のやりとりの最中はデバッグ情報がパースエラーの原因と
    なりがちなので、それを防ぐのに有効です。

.. php:staticmethod:: read($key = null)

    :param string $key: 読み込むキー。 :term:`ドット記法` が使えます。

    アプリケーションから設定データを読み込むのに使います。デフォルトは
    CakePHP で重要な debug 値です。何らかのキーが指定されたらその
    データを返します。前述の write() の例を元に、そのデータを呼び出して
    みましょう::

        Configure::read('Company.name');    // 'Pizza, Inc.' が返されます
        Configure::read('Company.slogan');  // 'Pizza for your body and soul'
                                            // が返されます

        Configure::read('Company');

        // 返される値:
        array('name' => 'Pizza, Inc.', 'slogan' => 'Pizza for your body and soul');

    $key を指定しない場合、 Configure にあるすべての値を返します。指定された $key に関連する
    値が存在しない場合、 null を返します。

.. php:staticmethod:: check($key)

    :param string $key: チェックするキー。

    key/path が存在し、かつ null でない値を持つかどうかをチェックします。

    .. versionadded:: 2.3
        ``Configure::check()`` は 2.3 で追加されました。

.. php:staticmethod:: delete($key)

    :param string $key: 削除するキー。 :term:`ドット記法` が使えます。

    アプリケーションの設定から情報を削除します::

        Configure::delete('Company.name');

.. php:staticmethod:: version()

    現在のアプリケーションで動いている CakePHP のバージョンを返します。

.. php:staticmethod:: config($name, $reader)

    :param string $name: 接続中のリーダー（読み込み機構）の名前
    :param ConfigReaderInterface $reader: 接続されるリーダーのインスタンス

    Configure に設定リーダーを接続します。接続されたリーダーは、
    設定ファイルをロードするのに使われます。設定ファイルを読み込む
    方法の詳細は :ref:`loading-configuration-files` をごらんください。

.. php:staticmethod:: configured($name = null)

    :param string $name: チェックするリーダーの名前。指定しない場合、
        接続されているすべてのリーダーの一覧が返されます。

    指定された名前のリーダーが接続されているかをチェックするか、
    または接続されたリーダーの一覧を取得します。

.. php:staticmethod:: drop($name)

    接続されているリーダーオブジェクトを削除します。

設定ファイルを読み書きする
==========================

CakePHP には２つのビルトインの設定ファイル用リーダーが備わっています。
:php:class:`PhpReader` は PHP の設定ファイルを読むことができますが、
Configure も歴史的にこれと同じフォーマットのファイルを読めるように
なっています。 :php:class:`IniReader` は ini 形式の設定ファイルを
読むことができます。ini ファイルの仕様については
`PHP documentation <http://php.net/parse_ini_file>`_ を参照してください。
コアの設定ファイルリーダーを使うには、そのファイルを
:php:meth:`Configure::config()` で Configure に接続してください。::

    App::uses('PhpReader', 'Configure');
    // app/Config から設定ファイルを読み込む
    Configure::config('default', new PhpReader());

    // 別のパスから設定ファイルを読み込む
    Configure::config('default', new PhpReader('/path/to/your/config/files/'));

Configure に複数のリーダーを接続することができます。それぞれの
リーダーは異なった種類の設定ファイル、もしくは異なったタイプの
ソースを読みます。Configure に備わっている他のメソッドを使って
接続されたリーダーとやりとりすることもできます。
:php:meth:`Configure::configured()` を使って接続されている
リーダーの別名を取得できます::

    // 接続されたリーダーの別名の配列を取得する
    Configure::configured();

    // 特定のリーダーが接続されているかをチェック
    Configure::configured('default');

接続されているリーダーを取り外すこともできます。
``Configure::drop('default')`` はデフォルトリーダーの別名を
取り外します。これ以降、リーダーを介した設定ファイルへの読み込みは
失敗します。

.. _loading-configuration-files:

設定ファイルのロード
--------------------

.. php:staticmethod:: load($key, $config = 'default', $merge = true)

    :param string $key: ロードする設定ファイルの識別子
    :param string $config: 設定されたリーダーの別名
    :param boolean $merge: 読まれたファイルの中身をマージするか、
        それとも既存の値を上書きするか。

Configure に設定リーダーを接続して、設定ファイルを読み込みます::

    // リーダーオブジェクト 'default' を使って my_file.php をロードする
    Configure::load('my_file', 'default');

ロードされた設定ファイルは、そのデータを Configure にある既存の
実行時設定とマージします。また、既存の実行時設定を上書きして
新しい値を追加することもできます。 ``$merge`` を true にすると、
値は既存の設定には上書きされません。

設定ファイルを生成／変更する
----------------------------

.. php:staticmethod:: dump($key, $config = 'default', $keys = array())

    :param string $key: ファイル名、または生成されるストレージ設定
    :param string $config: データを格納するリーダーの名前
    :param array $keys: 保存したいトップレベルのキーのリスト。デフォルトは
        すべてのキー。

Configure にある全部または一部のデータをダンプして、ファイルまたは
設定リーダーでサポートされているストレージシステムに格納します。
シリアライズ化のフォーマットはs $config として接続されている設定
リーダーにより決定されます。たとえば 'default' のアダプターは
:php:class:`PhpReader` で、生成されたファイルは
:php:class:`PhpReader` で読み込みが可能な PHP の設定ファイルになります。

'default' リーダーは PhpReader のインスタンスを使い、 Configure
にあるすべてのデータを `my_config.php` というファイルに保存します。::

    Configure::dump('my_config.php', 'default');

エラーハンドラー設定だけを保存します。::

    Configure::dump('error.php', 'default', array('Error', 'Exception'));

``Configure::dump()`` は  :php:meth:`Configure::load()` で読める形式の
設定ファイルを変更または上書きするのにも使えます。

.. versionadded:: 2.2
    ``Configure::dump()`` は 2.2 で追加されました。

実行時設定を保存する
--------------------

.. php:staticmethod:: store($name, $cacheConfig = 'default', $data = null)

    :param string $name: キャッシュファイルのストレージキー
    :param string $cacheConfig: 設定データを保存するキャッシュ設定の名前
    :param mixed $data: 保存するデータ、null にすると Configure 中のすべての
        データを保存。

将来取り出して使えるように、実行時設定の値を保存することもできます。
configure は現在のリクエストの値しか記憶しないので、何らかの変更した
値を後続するリクエストでも使いたい場合は、それらを保存しておく
必要があります。::

    // 'default' キャッシュにある 'user_1234' キーの中の現在の設定を保存する
    Configure::store('user_1234', 'default');

保存された設定データは :php:class:`Cache` クラス内で永続的データになります。
これにより、 :php:class:`Cache` が扱えるストレージエンジンにおいて、
設定情報を保存できます。

実行時設定を呼び出す
--------------------

.. php:staticmethod:: restore($name, $cacheConfig = 'default')

    :param string $name: ロードするストレージキー
    :param string $cacheConfig: データをロードするキャッシュ設定

実行時設定を保存した後は、おそらくそこに再度アクセスして値を取り出す
ことになります。これは ``Configure::restore()`` により行います。::

    // キャッシュから実行時設定を取り出す
    Configure::restore('user_1234', 'default');

設定情報を取り出す際は、保存した時に使ったものと同じキャッシュから、
同じキーを使って取り出すことが重要です。取り出された情報は、
既存の実行時設定の最上位にマージされます。

独自の設定用リーダーを作成する
==============================

設定用リーダーは CakePHP の中で拡張可能な部品です。このため、
あなたのアプリケーションとプラグインの中で、設定用リーダーを
新たに作成することも可能です。設定用リーダーは 
:php:interface:`ConfigReaderInterface` をインプリメント(implements)
する必要があります。このインターフェースでは唯一の必須メソッドとして
read メソッドが定義されています。たとえば、あなたが本当に XML
ファイルが好きなら、あなたのアプリケーションのためにシンプルな
XML 設定リーダを作ることもできます。::

    // app/Lib/Configure/XmlReader.php の中
    App::uses('Xml', 'Utility');
    class XmlReader implements ConfigReaderInterface {
        public function __construct($path = null) {
            if (!$path) {
                $path = APP . 'Config' . DS;
            }
            $this->_path = $path;
        }

        public function read($key) {
            $xml = Xml::build($this->_path . $key . '.xml');
            return Xml::toArray($xml);
        }

        // 2.3 時点では dump() メソッドもまだ必須です
        public function dump($key, $data) {
            // code to dump data to file
        }
    }

あなたの ``app/Config/bootstrap.php`` でこのリーダーを接続して
利用できます::

    App::uses('XmlReader', 'Configure');
    Configure::config('xml', new XmlReader());
    ...

    Configure::load('my_xml');

設定リーダの ``read()`` メソッドは、 ``$key`` という名前のリソースが
保持する設定情報の配列を返さなければなりません。

.. php:interface:: ConfigReaderInterface

    :php:class:`Configure` で設定データを読んだり保存したりするクラスで
    使われるインターフェースを定義します。

.. php:method:: read($key)

    :param string $key: ロードするキーの名前もしくは識別子

    ``$key`` で識別される設定データをロードまたはパースし、
    ファイルの中のデータを配列として返します。

.. php:method:: dump($key)

    :param string $key: 書き込む先の識別子
    :param array $data: ダンプするデータ

    このメソッドは、``$key`` で識別されるキーに対して設定された
    データをダンプまたは保存します。

.. versionadded:: 2.3
    ``ConfigReaderInterface::dump()`` は 2.3 で追加されました。

.. php:exception:: ConfigureException

    設定データをロード／保存／復元する際にエラーが発生すると、
    この例外が投げられます。エラーが発生した場合、
    :php:interface:`ConfigReaderInterface` の実装はこのエラーを
    スロー(throw)しなければなりません。

ビルトインの設定リーダー
------------------------

.. php:class:: PhpReader

    これを使うと、プレーンな PHP ファイルとして保存されている設定
    ファイルを読み込むことができます。これはファイルを ``app/Config``
    から読み込むか、または :term:`プラグイン記法` を使ってプラグインの
    設定ディレクトリから読み込むことができます。これらのファイルには
    ``$config`` 変数が含まれて **いなければなりません** 。設定
    ファイルの読み込みの例を以下に示します。::

        $config = array(
            'debug' => 0,
            'Security' => array(
                'salt' => 'its-secret'
            ),
            'Exception' => array(
                'handler' => 'ErrorHandler::handleException',
                'renderer' => 'ExceptionRenderer',
                'log' => true
            )
        );

    ファイルに ``$config`` がなかった場合は :php:exc:`ConfigureException`
    が発生します。

    あなたのカスタムの設定ファイルをロードするには、
    app/Config/bootstrap.php に以下のコードを挿入します::

        Configure::load('customConfig');

.. php:class:: IniReader

    このクラスではプレーンな .ini ファイルとして保存された設定ファイルを
    読み込むことができます。ini ファイルは PHP の ``parse_ini_file`` 
    関数と互換性を持っている必要があり、また以下の追加機能が使えます。

    * ドット区切りの値は配列に展開されます。
    * 'on' や 'off' のようにブール値を表す値は boolean 型に変換されます。

    ini ファイルの例としては以下のようになります::

        debug = 0

        Security.salt = its-secret

        [Exception]
        handler = ErrorHandler::handleException
        renderer = ExceptionRenderer
        log = true

    上記の ini ファイルの場合は、その前に示した PHP の例のように設定
    データが読み込まれます。ドット区切り値またはセクションは配列構造
    に展開されます。セクションの中でもドット区切りで構成を入れ子に
    できます。

.. _inflection-configuration:

Inflection(語尾変化)設定
========================

CakePHP の命名規約は実に優れています。あなたのデータベーステーブルに
big\_boxes 、モデルに BigBox 、コントローラーに BigBoxesController
と名前をつけてもらえれば、これですべてが自動的に動作します。
CakePHP はそれぞれの部品を関連付けるにあたり、それぞれの単語の
単数形と複数形を *inflecting(語尾の変化)* によって把握します。

ここで、CakePHP の :php:class:`Inflector` （複数形、単数形、
キャメルクラス、アンダースコアへの相互変換を司るクラス）が
思ったように動かないケースを想定してみましょう。これは特に、
英語話者ではない人たちにとって起こりがちです。もし CakePHP
があなたの Foci （訳注：focus（焦点）の複数形）や Fish （訳注：
同じ種類の魚の場合は単複同型）を認識してくれない場合、CakePHP
にあなたの特別なケースについて教えることができます。

カスタム inflection のロード
----------------------------

カスタム inflection をロードするには ``app/Config/bootstrap.php``
ファイルの中に :php:meth:`Inflector::rules()` を書きます。::

    Inflector::rules('singular', array(
        'rules' => array(
            '/^(bil)er$/i' => '\1',
            '/^(inflec|contribu)tors$/i' => '\1ta'
        ),
        'uninflected' => array('singulars'),
        'irregular' => array('spins' => 'spinor')
    ));

または::

    Inflector::rules('plural', array('irregular' => array('phylum' => 'phyla')));

これらのコードは、指定されたルールを lib/Cake/Utility/Inflector.php
で定義されている inflection セットにマージし、コアのルールより
優先度の高いルールとして追加します。

CakePHP の起動(bootstrap)
=========================

もし何からの追加設定が必要な場合、app/Config/bootstrap.php
にある CakePHP の bootstrap ファイルを使います。このファイルは
CakePHP のコアな起動処理の直後に実行されます。

このファイルは起動時における多くの共通的な処理を行います。:

- 便利な関数群を定義
- グローバル定数群の登録
- 追加のモデル、ビュー、コントローラーへのパスを定義
- キャッシュ構造の生成
- inflection の構成
- 設定ファイルの読み込み

何かを bootstrap ファイルに追加する場合は、MVC ソフトウェアの
デザインパターンをメンテする際に注意が必要です: 追加部分に、
あなたのコントローラーで使うための独自のフォーマット関数を入れたくなる
欲望にかられる恐れがあります。

ぜひその誘惑と戦ってください。その先に、必ず良いことがありますよ。

また、何かを :php:class:`AppController` クラスに入れることを考慮する
必要があるかもしれません。このクラスはあなたのアプリケーションの
すべてのコントローラーの親クラスです。 :php:class:`AppController` 
はあなたのコントローラーすべてにおいて使われるコールバックや
メソッドを定義するための便利な場所です。

.. meta::
    :title lang=ja: Configuration
    :keywords lang=ja: finished configuration,legacy database,database configuration,value pairs,default connection,optional configuration,example database,php class,configuration database,default database,configuration steps,index database,configuration details,class database,host localhost,inflections,key value,database connection,piece of cake,basic web
