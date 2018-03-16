2.0 移行ガイド
##############

このページはプロジェクトを2.0に移行する手助けをする、CakePHP 1.3からの変更点の要約をします。
またこれは、コアへのCakePHP 1.3ブランチからの変更点への最新の開発者リファレンスともなります。
必ずこのガイドにある新機能とAPIの変更の全てのページを読んでください。

.. tip::

    1.3のコードを2.0へ移行する手助けとなる、2.0で導入された :ref:`upgrade-shell` を必ずチェックしてください。


サポートするPHPバージョン
=========================

CakePHP 2.xはPHP 5.2.8以上をサポートします。
PHP4のサポートは止めることになります。
いまだPHP4環境での案件で働いている開発者のために、PHP4の開発とサポートの継続期間のうちまで、CakePHP1.xは続けてPHP4をサポートします。

PHP5に移行するということは、全てのメソッドとプロパティはアクセス修飾子を伴うように書き直されるということです。
コード内でprivateもしくはprotectedメソッドをpublicスコープから参照しようと試みると、エラーに遭遇することになります。

これは実際にはフレームワークに多大な変更を与えるわけではありませんが、現在、より厳しくなった可視性を持つメソッドと変数へのアクセスが不可能となったことを意味します。

ファイル・フォルダ名
====================

CakePHP 2.0では、ファイルとフォルダの構造化をする方法を考えなおしました。
PHP 5.3が名前空間のサポートをしていることから、このPHPバージョンを近い将来採用するのに、コードベースを準備することに決めました。
従って、 https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-0.md を採用することにしました。
まずはじめに、ここ数年の後にCakePHP 1.3の内部構造を振り返ると、明確なファイル構成が無いことと、またディレクトリ構成が各々のファイルがどこにあるべきかを真に指し示していないことに気づきました。
この変更に伴い、全体的なフレームワークのパフォーマンスの向上のための（ほぼ）自動的なクラス読み込みについて多少の実験を行うことができるでしょう

これを達成するための最大の障害は、クラスをロードする方法の種々の後方互換性を維持することでした。
また、私たちはフレームワークが ``My_Huge_Class_Name_In_Package`` のような大きなクラス接頭辞をつけることをまったく望んでいません。
私たちは、シンプルなクラス名と同時に、クラスの配置を定義する非常に直感的な方法と、未来のPHP 5.3バージョンのCakePHPのための明確な移行の道のりを提供する戦略を採用することにしました。
まず、私達が採用したファイル命名標準の主な変更を挙げます。

ファイル名
----------

クラスを含むすべてのファイルは、それが含んでいるクラスにちなんで命名される必要があります。
どのファイルも２つ以上のクラスを内包すべきではありません。
従って、ファイル名に小文字化とアンダースコア化はもう要りません。
いくつか例を挙げます:

* ``my_things_controller.php`` は ``MyThingsController.php`` になります
* ``form.php`` (ヘルパー) は ``FormHelper.php`` になります
* ``session.php`` (コンポーネント) は ``SessionComponent.php`` になります


これはアプリケーション中のファイル名を明確で一貫性のあるものにし、以前ファイルローダが混乱し読み込むべきでないファイルを読むという境界ケース(*edge cases*)らを避けることができるようになります。

フォルダ名
----------

ほとんどのフォルダ、特にクラスを含むフォルダはキャメルケース(*CamelCase*)にする必要もあります。
名前空間を考えたときに、それぞれのフォルダは名前空間の階層を象徴することから、クラスを含まない、または名前空間を自身で構成しないフォルダは、小文字で表される必要があります。

キャメルケースのフォルダ:

* Config
* Console
* Controller
* Controller/Component
* Lib
* Locale
* Model
* Model/Behavior
* Plugin
* Test
* Vendor
* View
* View/Helper

小文字のフォルダ:

* webroot
* tmp

htaccess (URL リライティング)
=============================

``app/webroot/.htaccess`` の ``RewriteRule ^(.*)$ index.php?url=$1 [QSA,L]`` の行を ``RewriteRule ^(.*)$ index.php [QSA,L]`` に置き換えてください。

AppController / AppModel / AppHelper / AppShell
===============================================

``app/app_controller.php`` 、 ``app/app_model.php`` 、 ``app/app_helper.php`` はそれぞれ、
``app/Controller/AppController.php`` 、 ``app/Model/AppModel.php`` 、 ``app/View/Helper/AppHelper.php`` に配置・名称変更されました。

また、全てのシェル・タスクはAppShellを継承するようになりました。
独自のAppShell.phpを ``app/Console/Command/AppShell.php`` にもつことができます。

多言語化・地域化
================

__() (二つのアンダースコアでのショートカット関数)
:php:func:`__()` (二つのアンダースコアでのショートカット関数) は常に翻訳を返り値として返すようになりました（もはや出力はされません）。

翻訳の結果を表示させたい場合は::

    echo __('My Message');

としてください。この変更は全ての翻訳のショートカット関数を含みます::

    __()
    __n()
    __d()
    __dn()
    __dc()
    __dcn()
    __c()

これに併せて、オプションパラメータを渡しているなら、翻訳はパラメータを用いて `sprintf <https://secure.php.net/manual/ja/function.sprintf.php>`_ を値を返す前に呼び出します。
以下は一例です::

    // "Called: MyClass:myMethod" のようなものを返す
    echo __('Called: %s:%s', $className, $methodName);

これは全てのショートカット翻訳メソッドに関して同じことが言えます。


指定子に関する更なる情報に関しては、 `sprintf <https://secure.php.net/manual/ja/function.sprintf.php>`_ 関数を見てください。


変更されたクラスの場所と定数
============================

``APP`` と ``CORE_PATH`` 定数は、WEBとコンソール環境で一貫性のある値を持ちます。
CakePHPの前バージョンでは、これらの値が環境によって変わっていました。

Basics.php
==========

-  ``getMicrotime()`` は削除されました。
   代わりにネイティブの ``microtime(true)`` を使用してください。
-  ``e()`` は削除されました。
   ``echo`` を使用してください。
-  ``r()`` は削除されました。
   ``str_replace`` を使用してください。
-  ``a()`` は削除されました。
   ``array()`` を使用してください。
-  ``aa()`` は削除されました。
   ``array()`` を使用してください。
-  ``up()`` は削除されました。
   ``strtoupper()`` を使用してください。
-  ``low()`` は削除されました。
   ``strtolower()`` を使用してください。
-  ``params()`` は削除されました。
   これはCakePHP内で使われることはありませんでした。
-  ``ife()`` は削除されました。
   三項演算子を使ってください。
-  ``uses()`` は削除されました。
   ``App::import()`` を使ってください。
-  PHP4互換のための関数は削除されました。
-  PHP5定数は削除されました。
-  グローバル変数 ``$TIME_START`` は削除されました。
   代わりに ``TIME_START`` 定数か ``$_SERVER['REQUEST_TIME']`` を使用してください。

削除された定数
--------------

正確ではない、または重複している数多くの定数が削除されました。

* APP_PATH
* BEHAVIORS
* COMPONENTS
* CONFIGS
* CONSOLE_LIBS
* CONTROLLERS
* CONTROLLER_TESTS
* ELEMENTS
* HELPERS
* HELPER_TESTS
* LAYOUTS
* LIB_TESTS
* LIBS
* MODELS
* MODEL_TESTS
* SCRIPTS
* VIEWS

CakeRequest
===========

この新しいクラスはやってくるリクエストに紐付けられたパラメータと作用をカプセル化します。
これは ``Dispatcher`` 、 ``RequestHandlerComponent`` 、 ``Controller`` の中にある多くの機能を置き換えます。
また、全ての場所での ``$this->params`` 配列を置き換えます。
``CakeRequest`` は ``ArrayAccess`` を実装するので、古いパラメータ配列を用いる多くの相互作用は変更する必要がありません。
更なる情報は新機能CakeRequestを見てください。

リクエスト処理、$_GET['url'] と.htaccessファイル
================================================

CakePHPは ``$_GET['url']`` をアプリケーションのリクエストパスの処理に使わなくなりました。
代わりに ``$_SERVER['PATH_INFO']`` を使います。
これはURL書き換えを伴ったサーバーと伴わないものとでより一貫性をもつURLリクエスト処理の方法となります。
これらの変更により、.htaccessファイルと ``app/webroot/index.php`` を、この変更を適用するために変更されたファイルに書き換える必要があります。
また、 ``$this->params['url']['url']`` はもう存在しません。
同等の値を得るには、代わりに$this->request->urlを使用する必要があります。
この属性には、URLから先頭のスラッシュ ``/`` の直前までを除いた値が格納されています。

Note: ホームページ自体(``http://domain/``)の $this->request->url は、
``/`` の代わりに ``false`` を返します。必要に応じて判定に使ってください::

    if (!$this->request->url) {} // $this->request->url === '/' の代わり

コンポーネント
==============

Componentは、全てのコンポーネントが必須とする基底クラスになりました。
コンポーネントとそのコンストラクタが変更になったことから、これを書き換える必要があります::

    class PrgComponent extends Component {
        public function __construct(ComponentCollection $collection,
          $settings = array()) {
            parent::__construct($collection, $settings);
        }
    }

ヘルパーのように、コンポーネントのオーバライドされたコンストラクタで ``parent::__construct()`` を呼ぶことが重要です。
また、設定(*settings*)は ``initialize()`` コールバックではなく、コンストラクタに渡されるようになりました。
これは上手く設定されたオブジェクトを簡単に取得することができるようになり、基底クラスがプロパティのセットアップを処理することができるようになります。

設定がコンポーネントのコンストラクタに移動したことで、 ``initialize()`` コールバックは2番目の引数に ``$settings`` を受け取らないようになりました。
以下のメソッド特性を使うようにコンポーネントを書き換える必要があります::

    public function initialize(Controller $controller) { }

加えて、initialize()メソッドはコンポーネントが有効な時のみ呼び出されます。
これは通常、コントローラに直接付随したコンポーネントを意味します。

非推奨だったコールバックの削除
------------------------------

Componentで非推奨となったすべてのコールバックはComponentCollectionに移動されませんでした。
コールバックと対話するには代わりに `trigger()` メソッドを使う必要があります。
コールバックを引き起こす必要があるなら、以下のように呼び出すことができます::

    $this->Components->trigger('someCallback', array(&$this));

コンポーネント無効化の変更点
----------------------------

以前は、例えば `$this->Auth->enabled = false;` によってコンポーネントを無効化することができました。
CakePHP 2.0 では、ComponentCollectionのdisableメソッド、 `$this->Components->disable('Auth');` を使用する必要があります。
enabledプロパティを使っても正しく動作しないでしょう。

Aclコンポーネント
-----------------

-  ``AclComponent`` の実装部分は、 ``AclInterface`` の実装が必要となりました。
-  このコンポーネントが使う ``ACL`` の実装部分をランタイムで変更できるように、 ``AclComponent::adapter()`` が追加されました。
-  ``AclComponent::grant()`` は非推奨となりました。
   将来のバージョンでは削除されることになります。
   代わりに ``AclComponent::allow()`` を使用してください。
-  ``AclComponent::revoke()`` は非推奨となりました。
   将来のバージョンでは削除されることになります。
   代わりに ``AclComponent::deny()`` を使用してください。

RequestHandlerコンポーネント
----------------------------

多くのRequestHandlerコンポーネントのメソッドは単に ``CakeRequest`` のメソッドの代用品となりました。
以下のメソッドは非推奨となり、将来のバージョンでは削除されることになります。:

-  ``isSsl()``
-  ``isAjax()``
-  ``isPost()``
-  ``isPut()``
-  ``isFlash()``
-  ``isDelete()``
-  ``getReferer()``
-  ``getClientIp()``
-  ``accepts()`` 、 ``prefers()`` 、 ``requestedWith()`` は全てマッピングされたコンテンツタイプを扱うようになり、MIMEタイプでは動作しないようになりました。
   新しいコンテントタイプを作成するためには、 ``RequestHandler::setContent()`` を使うことができます。
-  ``RequestHandler::setContent()`` は配列を一つの引数として指定することができないようになりました。
   両方の引数を与える必要があります。

Securityコンポーネント
----------------------

Securityコンポーネントは基本認証とダイジェスト認証を処理しないようになりました。
これら二つは、新しいAuthコンポーネントによって処理されます。
以下のメソッドはSecurityコンポーネントから削除されました:

-  requireLogin()
-  generateDigestResponseHash()
-  loginCredentials()
-  loginRequest()
-  parseDigestAuthData()

加えて、以下のプロパティが削除されました:

-  $loginUsers
-  $requireLogin

全ての種類の認証を単一の場所に提供し、それぞれのコンポーネントの役割を能率化するために、これらの機能はAuthコンポーネントに移動しました。

Authコンポーネント
------------------

Authコンポーネントは2.0のために完全に書き直れました。
これは開発者の混乱と頓挫(*frustration*)を減らすようになされました。
加えて、Authコンポーネントはより柔軟で拡張性が高くなりました。
:doc:`/core-libraries/components/authentication` ガイドでより詳しくみることができます。

Emailコンポーネント
-------------------

Emailコンポーネントは非推奨となり、Eメールを送る新しいライブラリクラスが作成されました。
詳細は、 :doc:`/core-utility-libraries/email` のEメールの変更を見てください。

Sessionコンポーネント
---------------------

Sessionコンポーネントは以下のメソッドを失いました。

* activate()
* active()
* __start()

cakeErrorの削除
===============

``cakeError()`` メソッドは削除されました。
``cakeError`` の使用から例外を使うように切り替えることが推奨されています。
``cakeError`` が削除されたのは、それがただの例外のシミュレーションであった為です。
代わりに、CakePHP2.0では実際の例外が使われます。

エラーハンドリング
==================

エラーハンドリングの実装は2.0で劇的に変わりました。
フレームワークの至るところに例外が導入され、エラーハンドリングはよりコントロールできるように、柔軟に書き直されました。
詳しくは、 :doc:`/development/exceptions` と :doc:`/development/errors` のセクションを読むことができます。

ライブラリクラス
================

App
---

``App::build()`` のAPIは ``App::build($paths, $mode).`` に変更されました。
これで既存のパスに前方追加(*prepend*)、後方追加(*append*)、リセットをかけられるようになりました。
$mode引数は次の3つの値を取ることができます: App::APPEND、App::PREPEND、 ``App::RESET`` 。
この関数のデフォルトの振る舞いは同じものが残されています（つまり、既存のリストの前方に新しいパスが追加されます）。

App::path()
~~~~~~~~~~~

* プラグインをサポートするようになりました。
  App::path('Controller', 'Users') はUsersプラグインのコントローラの設置場所を返します。
* コアのパスをマージしないようになりました。
  App::build()で定義されたパスか、アプリケーション（またはプラグインに対応する）デフォルトのパスのみを返します。

App::build()
~~~~~~~~~~~~

* コアのパスとアプリケーションのパスをマージしなくなりました。

App::objects()
~~~~~~~~~~~~~~

* プラグインをサポートするようになりました。
  App::objects('Users.Model') はUsersプラグインのモデルを返します。
* 空の結果や不正な型に対してfalseの代わりにarray()を返すようになりました。
* コアのオブジェクトを返さないようになりました。
  App::objects('core')はarray()を返します。
* 完全なクラス名を返すようになりました。

Appクラスは以下のプロパティを失いました。
これらの値にアクセスするにはApp::path()メソッドを使ってください。

* App::$models
* App::$behaviors
* App::$controllers
* App::$components
* App::$datasources
* App::$libs
* App::$views
* App::$helpers
* App::$plugins
* App::$vendors
* App::$locales
* App::$shells

App::import()
~~~~~~~~~~~~~

* 再帰的にクラスを探索しないようになりました。
  App::build()で定義されたパスを元にした値を厳密に使用します。
* App::import('Component', 'Component')と読み込むことができなくなりました。
  App::uses('Component', 'Controller'); を使ってください。
* App::import('Lib', 'CoreClass') を利用したコアクラスの読み込みは不可能になりました。
* 存在しないファイルの読み込み、正しくない型またはパッケージ名の指定、$nameと$file引数へのnull値の指定は返り値falseの結果となります。
* App::import('Core', 'CoreClass')はもうサポートされません。
  代わりにApp::uses()を使用し、後はクラスの自動読み込みに任せるようにしましょう。
* 外部(*Vendor*)ファイルの読み込みはvendorsフォルダを再帰的に探索しないようになりました。
  また、以前のようにファイルをアンダースコアに変換しないようにもなりました。

App::core()
~~~~~~~~~~~

* 第一引数は必須となり、常に一つのパスを返すようになりました。
* vendorsのパスを得るために使うことはもうできません。
* 新しいスタイルのパッケージ名のみ受け付けます。

App::uses()を用いたクラスの読み込み
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

クラスの読み込み方が大きく書き直されましたが、手慣れた方法を尊重するためにアプリケーションのコードを変更する必要が稀にあります。
最も大きな変更は新しいメソッドが導入されたことです::

    App::uses('AuthComponent', 'Controller/Component');

私たちは関数名を、クラス名を探索すべき場所を宣言する方法であるPHP 5.3の ``use`` キーワードを模倣するものと定めました。
:php:meth:`App::uses()` の第一引数は読みこもうとするクラスの完全な名前となります。
また、第二引数は、属する場所のパッケージ名（または名前空間）になります。
CakePHP 1.3の :php:meth:`App::import()` との主な違いは、前者が実際にクラスをインポートせず、単にシステムをセットアップだけということです。
従って、クラスが初めて使用される時にその探索がなされます。

:php:meth:`App::import()` から移行し :php:meth:`App::uses()` を使用するいくつかの例を挙げます::

    App::import('Controller', 'Pages');
    // は次のようになる
    App::uses('PagesController', 'Controller');

    App::import('Component', 'Auth');
    // は次のようになる
    App::uses('AuthComponent', 'Controller/Component');

    App::import('View', 'Media');
    // は次のようになる
    App::uses('MediaView', 'View');

    App::import('Core', 'Xml');
    // は次のようになる
    App::uses('Xml', 'Utility');

    App::import('Datasource', 'MongoDb.MongoDbSource');
    // は次のようになる
    App::uses('MongoDbSource', 'MongoDb.Model/Datasource');

以前 ``App::import('Core', $class);`` を用いて読み込んでいたすべてのクラスは、正しいパッケージを参照する ``App::uses()`` を用いて読み込む必要があります。
APIを見て新しいフォルダでクラスを探索するようにしてください。いくつか例を挙げます::

    App::import('Core', 'CakeRoute');
    // は次のようになる
    App::uses('CakeRoute', 'Routing/Route');

    App::import('Core', 'Sanitize');
    // は次のようになる
    App::uses('Sanitize', 'Utility');

    App::import('Core', 'HttpSocket');
    // は次のようになる
    App::uses('HttpSocket', 'Network/Http');

:php:meth:`App::import()` が以前どのように作用していたかとは対照的に、新しいクラスローダはクラスを再帰的に探索しません。
これは常に副作用を及ぼしていたいくつかの稀にしか使われない機能のコストにおいて、開発モードを含めて強烈なパフォーマンスの上昇を導きました。
改めて言うと、クラスローダは正にあなたが探すために伝えたパッケージからのみクラスを取り出すことになります。

App::build() とコアのパス
~~~~~~~~~~~~~~~~~~~~~~~~~

:php:meth:`App::build()` はアプリケーションのパスとコアのパスをマージしなくなりました。

例::

    App::build(array('controllers' => array('/full/path/to/controllers')));
    // は次のようになる
    App::build(array('Controller' => array('/full/path/to/Controller')));

    App::build(array('helpers' => array('/full/path/to/controllers')));
    // は次のようになる
    App::build(array('View/Helper' => array('/full/path/to/View/Helper')));

CakeLog
-------

-  ログのストリームは :php:class:`CakeLogInterface` を実装(*implement*)することが必要になりました。
   設定されたロガークラスがこれをしないと、例外が発生します。

Cache
-----

-  :php:class:`Cache` は静的なクラスになり、getInstance()メソッドをもたないようになりました。
-  CacheEngineは抽象(*abstract*)クラスになりました。
   直接そのクラスを作ることはもうできなくなりました。
-  CacheEngineの実装はCacheEngineを継承する必要があります。
   設定されたクラスがそれをしないと、例外が発生します。
-  FileCacheはキャッシュの設定を変更する際に、パスの設定の末尾にスラッシュを付けることを必要とするようになりました。
-  Cacheは最後に設定されたエンジンの名前を保有しないようになりました。
   これはエンジンを指定する操作をしたいときは、$configパラメータが指定したい設定名と同一でなければいけないということを意味します。

::

    Cache::config('something');
    Cache::write('key', $value);

    // 上記は、以下のようになることでしょう。
    Cache::write('key', $value, 'something');

Router
------

- ``Router::setRequestInfo()`` を用いてnamedパラメータの設定を更新することができなくなりました。
  ``Router::connectNamed()`` を使ってnamedパラメータの扱いを設定するべきです。
- Routerは ``getInstance()`` メソッドをもたないようになりました。
  これは静的なクラスなので、メソッドやプロパティは静的に呼ぶようにしてください。
- ``Router::getNamedExpressions()`` は非推奨になりました。
   代わりに新しいルーターの定数である、``Router::ACTION`` 、 ``Router::YEAR`` 、 ``Router::MONTH`` 、 ``Router::DAY`` 、 ``Router::ID`` 、 ``Router::UUID`` を使用してください。
- ``Router::defaults()`` が削除されました。
  デフォルトのルーティングを無効にするにはアプリケーションのroutes.phpからコアのルートファイルのインクルードを削除してください。
  逆に、デフォルトのルーティングが欲しい場合、routesファイルに ``Cake/Config/routes.php`` へのインクルードを追加する必要があるでしょう。
- Router::parseExtensions()を利用している時、拡張子のパラメータは ``$this->params['url']['ext']`` 以下ではなくなりました。
  代わりに ``$this->request->params['ext']`` で利用可能となります。
- プラグインのルートのデフォルトが変更になりました。
  index以外のアクションにはプラグインショートカットルート(*Plugin short routes*)が標準で組み込まれなくなりました。
  以前は``/users`` や ``/users/add`` はUsersプラグインのUsersControllerにマッピングされていました。
  2.0では、 ``index`` アクションのみがショートカットルートとして与えられます。
  引き続きショートカットを利用したいと思う方は、以下のようにルートを追加できます::

    Router::connect(
      '/users/:action',
      array('controller' => 'users', 'plugin' => 'users')
    );

  ショートカットルートを有効にしたいプラグイン毎にroutesファイルにこれを追加してください。

app/Config/routes.phpファイルは以下の行をファイルの後方に追加するように更新する必要があります::

    require CAKE . 'Config' . DS . 'routes.php';

これはアプリケーションのデフォルトのルートを生成するために必要となります。
このようなルートを望まない、または独自の標準を実装したいなら、独自のルーティングルールを記述したファイルを読み込むようにすることができるでしょう。

Dispatcher
----------

- Dispatcherはcake/libsの中に移動されました。
  ``app/webroot/index.php`` を更新する必要があります。
- ``Dispatcher::dispatch()`` は二つの引数を受け取るようになりました。
  リクエストとレスポンスのオブジェクトです。
  これらは ``CakeRequest`` と ``CakeResponse`` 、またはそのサブクラスのインスタンスである必要があります。
- ``Dispatcher::parseParams()`` は ``CakeRequest`` オブジェクトのみ（訳注：おそらくサブクラスも）受け入れるようになりました。
- ``Dispatcher::baseUrl()`` は削除されました。
- ``Dispatcher::getUrl()`` は削除されました。
- ``Dispatcher::uri()`` は削除されました。
- ``Dispatcher::$here`` は削除されました。

Configure
---------

-  ``Configure::read()`` は「debug」値でなく、代わりにConfigureの全ての値を返すようになりました。
   もしデバッグ値を得たいのなら、 ``Configure::read('debug');`` を使用してください。
-  ``Configure::load()`` はConfigureリーダーを用いてセットアップしなければならなくなりました。
   詳しい情報は、 :ref:`loading-configuration-files` を見てください。
-  ``Configure::store()`` は、与えられたCacheの設定に対して値を書き込むようになりました。
   詳しい情報は、 :ref:`loading-configuration-files` を見てください。

Scaffold
--------

-  Scaffoldの'edit'ビューは'form'に名前を変えるべきです。
   これはScaffoldとBakeのテンプレートに矛盾がないようにするために為されました。

   -  ``views/scaffolds/edit.ctp`` -> ``View/Scaffolds/form.ctp``
   -  ``views/posts/scaffold.edit.ctp`` -> ``View/Posts/scaffold.form.ctp``

Xml
---

-  Xmlクラスは完全に書き直されました。
   もはやこのクラスはデータを整形せず、SimpleXMLElementのラッパーになりました。
   以下のメソッドが使用できます：

   -  ``Xml::build()``:  静的なメソッドで、XML文字列、配列、ファイルまたはURLのパスを渡せます。
      SimpleXMLElementのインスタンスを返すか、エラーの場合は例外が投げられます。
   -  ``Xml::fromArray():`` 静的なメソッドで、配列を元にSimpleXMLElementを返します。
   -  ``Xml::toArray()``: 静的なメソッドで、SimpleXMLElementを元に配列を返します。

Xmlクラスになされた変更における更に詳しい情報は、:php:class:`Xml` ドキュメントを見てください。

Inflector
---------

-  Inflector に ``getInstance()`` はもうありません。
-  ``Inflector::slug()`` は $map 引数をサポートしなくなりました。
   字訳のルールを定義するには ``Inflector::rules()`` を使ってください。

CakeSession
-----------

CakeSessionは完全に静的なクラスとなり、 ``SessionHelper`` と ``SessionComponent`` の両方はこれのラッパーと構文糖です。
モデルや他のコンテキストで簡単に使えるようになりました。
全てのメソッドは静的に呼び出されます。

セッションの設定もまた変更されました。
:doc:`詳しい情報についてはセッションのセクションを見てください。 </development/sessions>`

HttpSocket
----------

- HttpSocketはヘッダーのキーを変更しないようになりました。
  コアの他の場所にならって、HttpSocketはヘッダーに変更を加えないようになりました。
  :rfc:`2616` はヘッダーが大文字小文字を区別すると言及していますし、HttpSocketはリモートホストが送る値を保持します。
- HttpSocketはレスポンスをオブジェクトとして返すようになりました。
  配列の代わりに、HttpSocketはHttpResponseのインスタンスを返します。
  更に詳しい情報は、 :php:class:`HttpSocket` ドキュメントを見てください。
- クッキーは内部でインスタンス毎でなく、ホスト別に保持されます。
  これは、それぞれ違うサーバーに二つのリクエストを送る場合、ドメイン1からのクッキーはドメイン2に送信されないことを意味します。
  これは在り得るセキュリティ問題を回避するためのものです。


ヘルパー
========

コンストラクタの変更
--------------------

ClassRegistryからViewが削除されたことに対応して、Helper::__construct()の特性(*signature*)が変わりました。
以下のものを使うようにサブクラスを更新する必要があります::

    public function __construct(View $View, $settings = array())

コンストラクタをオーバーライドするとき、常に `parent::__construct` を呼ぶ必要もあります。
`Helper::__construct` はビューのインスタンスをのちの参照のために `$this->_View` に格納します。
settingsは親コンストラクタによって扱われることはありません。

HelperCollectionの追加
----------------------

ビューレイヤーに含まれる各々のクラスの責任を精査した結果、Viewが一つのタスクよりかなり多い処理をしていることが明らかになりました。
ヘルパーの生成の責任はViewの中核的なものではなく、これはHelperCollectionに移動しました。
HelperCollectionはヘルパーの読み込みと生成、またヘルパーのコールバックの起動の責任を負います。
デフォルトでは、ViewはコンストラクタでHelperCollectionを生成し、その後の操作でこれを使います。
ビューのHelperCollectionは `$this->Helpers` にあります。

この機能を書き直した動機は、いくつかの問題点からもたらされました。

* ClassRegistryにビューが登録されることは、requestActionやEmailComponentが使用されていた時、レジストリー汚染問題を起こしていました。
* ビューがグローバルシンボルとしてアクセスできることは乱用を招いていました。
* ヘルパーは自己完結していませんでした。
  ヘルパーを生成した後、オブジェクトを機能させるために手動で他のオブジェクトを生成する必要がありました。

HelperCollectionについて、より詳しくは :doc:`/core-libraries/collections` ドキュメントを見てください。

非推奨になったプロパティ
------------------------

以下のヘルパのプロパティは非推奨となります。
将来のリリースで削除される予定のこれらのプロパティに直接アクセスする代わりに、Requestオブジェクトのプロパティまたはヘルパーのメソッドを使ってください。

-  ``Helper::$webroot`` は非推奨になりました。代わりにRequestオブジェクトのwebrootプロパティを使用してください。
-  ``Helper::$base`` は非推奨になりました。代わりにRequestオブジェクトのbaseプロパティを使用してください。
-  ``Helper::$here`` は非推奨になりました。代わりにRequestオブジェクトのhereプロパティを使用してください。
-  ``Helper::$data`` は非推奨になりました。代わりにRequestオブジェクトのdataプロパティを使用してください。
-  ``Helper::$params`` は非推奨になりました。代わりに ``$this->request`` を使用してください。

XmlHelper、AjaxHelper、JavascriptHelperの削除
---------------------------------------------

AjaxHelperとJavascriptHelperは1.3バージョンから非推奨となったため削除されました。
XmlHelperは、 :php:class:`Xml` の改善により、時代遅れで冗長になったことから削除されました。
以前のXmlHelperの使用方法を書きなおすためには ``Xml`` クラスを使う必要があります。

AjaxHelperとJavascriptHelperは、JsHelperとHtmlHelperに置き換えられました。

JsHelper
--------

-  ``JsBaseEngineHelper`` は抽象クラスとなりました。
   以前はエラーを吐いていたメソッド全てを実装する必要があるでしょう。

PaginatorHelper
---------------

-  ``PaginatorHelper::sort()`` はtitleとkey引数の順序を逆に取るようになりました。
   $keyは常に最初の引数になります。
   これは2番目のものを追加するときに引数を交換(*swap*)する必要を無くすためです。
-  PaginatorHelperは内部で使われるページングのパラメーターに数多くの変更があります。
   defaultキーは削除されました。
-  PaginatorHelperはクエリ文字列のページングパラメーターを用いてのリンクの生成をサポートするようになりました。

全体的にページネーションに対していくつか改善があります。
その詳しい情報については、新しいページネーションの機能のページを見てください。

FormHelper
----------

$selectedパラメータの削除
~~~~~~~~~~~~~~~~~~~~~~~~~

``$selected`` パラメータは ``FormHelper`` のいくつかのメソッドから削除されました。
全てのメソッドは ``$attributes['value']`` キーをサポートするようになり、 ``$selected`` の代わりに使われるでしょう。
この変更は ``FormHelper`` のメソッドを簡略化し、数多くの引数を減らし、 ``$selected`` が作り出す重複を無くすものです。
影響のあるメソッドは以下のとおりです:

-  FormHelper::select()
-  FormHelper::dateTime()
-  FormHelper::year()
-  FormHelper::month()
-  FormHelper::day()
-  FormHelper::hour()
-  FormHelper::minute()
-  FormHelper::meridian()

フォームのデフォルトURLが現在のアクションに
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

全てのフォームのデフォルトのURLは、passed、named、そしてクエリ文字列パラメータを含む現在のURLになりました。
``$this->Form->create()`` の第二引数に ``$options['url']`` を与えることによって、このデフォルトを上書きすることができます。

FormHelper::hidden()
~~~~~~~~~~~~~~~~~~~~

隠し(*hidden*)フィールドはclass属性を削除しないようになりました。
これは隠しフィールドにバリデーションエラーがある場合は、 ``error-field`` クラス名が付与されることを意味します。

CacheHelper
-----------

CacheHelperはViewから完全に分離され、ヘルパーのコールバックを用いてキャッシュを生成するようになりました。
``afterRender`` と ``afterLayout`` コールバックでコンテンツを更新する他のヘルパーの後にCacheHelperを配置しなければならないことを覚えておいてください。
これを忘れると、いくつかの変更がキャッシュされたコンテンツに含まれないことになるでしょう。

また、CacheHelperはキャッシュしない範囲を指定するために ``<cake:nocache>`` を使わなくなりました。
代わりに特別なHTML・XMLコメントである、 ``<!--nocache-->`` と ``<!--/nocache-->`` を使ってください。
これでCacheHelperが正しいマークアップの生成と、以前と同じ機能を発揮できます。
詳しくは、CacheHelperとViewの変更を見てください。

より柔軟なヘルパーの属性(*Attribute*)フォーマット
-------------------------------------------------

Helperクラスは更に3つのprotectedな属性を持つようになりました:

* ``Helper::_minimizedAttributes``: 最小化される属性の配列(例: ``array('checked', 'selected', ...)``);
* ``Helper::_attributeFormat``: 属性の生成方法(例: ``%s="%s"``);
* ``Helper::_minimizedAttributeFormat``: 最小化される属性の生成方法:(例 ``%s="%s"``)

デフォルトではCakePHP 1.3での値の使われ方と変わっていません。
しかし、 ``<input type="checkbox" checked />`` のようなHTMLの真偽値属性を扱うことができるようになりました。
これをするには、AppHelperの ``$_minimizedAttributeFormat`` を ``%s`` に変えるだけです。

Html・Formヘルパー、またその他でこれを使うには、次のように書けます::

    $this->Form->checkbox('field', array('checked' => true, 'value' => 'some_value'));

他の便宜的方法は最小化される属性をキーではなくアイテムとして渡すことです。
例を挙げます::

    $this->Form->checkbox('field', array('checked', 'value' => 'some_value'));

``checked`` が数値添字であることに注意してください。

コントローラ
============

- コントローラのコンストラクタは二つの引数を受け取るようになりました。
  CakeRequestと、CakeResponseオブジェクトです。
  これらのオブジェクトは非推奨となったいくつかのプロパティを配置するために使われ、コントローラ内部に$requestと$responseとして設置されるでしょう。
- ``Controller::$webroot`` は非推奨になりました。代わりにRequestオブジェクトのwebrootプロパティを使用してください。
- ``Controller::$base`` は非推奨になりました。代わりにRequestオブジェクトのbaseプロパティを使用してください。
- ``Controller::$here`` は非推奨になりました。代わりにRequestオブジェクトのhereプロパティを使用してください。
- ``Controller::$data`` は非推奨になりました。代わりにRequestオブジェクトのdataプロパティを使用してください。
- ``Controller::$params`` は非推奨になりました。代わりに ``$this->request`` を使用してください。
- ``Controller::$Component`` は ``Controller::$Components`` に移動しました。
  より詳しい情報は :doc:`/core-libraries/collections` ドキュメントを見てください。
- ``Controller::$view`` は ``Controller::$viewClass`` に名前が変わりました。
  ``Controller::$view`` は今はどのビューファイルを描画するかを変更するのに使われます。
- ``Controller::render()`` はCakeResponseオブジェクトを返すようになりました。

コントローラの非推奨となったプロパティは ``__get()`` メソッドを通してアクセス可能となります。
このメソッドは将来のバージョンで削除されますので、アプリケーションを改訂することをお勧めします。

コントローラはページ付けに対してmaxLimitを定義するようになりました。
この最大値は100にセットされますが、$paginateオプションで上書き可能です。


Pagination
----------

ページネーションは古くからControllerの一つのメソッドでありました。
しかし、これは多くの問題を生み出していました。
ページネーションを継承して書き換えたり、修正したりすることは難しいことでした。
2.0ではページネーションはコンポーネントに展開されました。
:php:meth:`Controller::paginate()` はまだ存在しており、 :php:class:`PaginatorComponent` を読み込んで使う便宜メソッドとして提供されます。

2.0のページ付けで提供される新しい機能についてより詳しい情報は、 :doc:`/core-libraries/components/pagination` ドキュメントを見てください。

ビュー
======

ViewはClassRegistryに登録されなくなりました
-------------------------------------------

ビューがClassRegistryに登録されることは乱用を招き、事実上グローバルシンボルを作り出していました。
2.0では各ヘルパーは現在の `View` インスタンスをコンストラクタで受け取ります。
これはヘルパーにグローバルシンボルを作り出すことなく、以前の様式と同様にビューにアクセスさせることができます。
どのヘルパーでも `$this->_View` でビューのインスタンスにアクセスできます。

Deprecated properties
---------------------

-  ``View::$webroot`` は非推奨になりました。代わりにRequestオブジェクトのwebrootプロパティを使用してください。
-  ``View::$base`` は非推奨になりました。代わりにRequestオブジェクトのbaseプロパティを使用してください。
-  ``View::$here`` は非推奨になりました。代わりにRequestオブジェクトのhereプロパティを使用してください。
-  ``View::$data`` は非推奨になりました。代わりにRequestオブジェクトのdataプロパティを使用してください。
-  ``View::$params`` は非推奨になりました。代わりに ``$this->request`` を使用してください。
-  ``View::$loaded`` は削除されました。 ``HelperCollection`` を使って読み込み済みのヘルパーにアクセスしてください。
- ``View::$model`` は削除されました。この振る舞いは今は :php:class:`Helper` にあります。
- ``View::$modelId`` は削除されました。この振る舞いは今は :php:class:`Helper` にあります。
- ``View::$association`` は削除されました。この振る舞いは今は :php:class:`Helper` にあります。
- ``View::$fieldSuffix`` は削除されました。この振る舞いは今は :php:class:`Helper` にあります。
- ``View::entity()`` は削除されました。この振る舞いは今は :php:class:`Helper` にあります。
-  ``View::_loadHelpers()`` は削除され、代わりに ``View::loadHelpers()`` が使われるようになりました。
-  ``View::element()`` のキャッシュ方法は変更されました。下方に詳しい情報がありますので参照してください。
-  ビューのコールバックは方々に移されました。下方に詳しい情報がありますので参照してください。
-  ``View::element()`` のAPIが変更されました。詳しい情報はここを読んでください。

ビューの非推奨となったプロパティは ``__get()`` メソッドを通してアクセス可能となります。
このメソッドは将来のバージョンで削除されますので、アプリケーションを改訂することをお勧めします。

削除されたメソッド
------------------

* ``View::_triggerHelpers()`` は削除されました。代わりに ``$this->Helpers->trigger()`` を使ってください。
* ``View::_loadHelpers()`` は削除されました。代わりに ``$this->loadHelpers()`` を使ってください。
  ヘルパーは、自身のもつヘルパーを遅延読み込み(*lazy load*)するようになりました。

追加されたメソッド
------------------

* ``View::loadHelper($name, $settings = array());`` が追加され、これは単一のヘルパーを読み込みます。
* ``View::loadHelpers()`` が追加され、これは ``View::$helpers`` で示されたヘルパー全てを読み込みます。

View->Helpers
-------------

デフォルトではViewオブジェクトは :php:class:`HelperCollection` を `$this->Helpers`` に保持します。

テーマ
------

コントローラでテーマを使うには、 ``public $view = 'Theme';`` と指定しないようになりました。
代わりに ``public $viewClass = 'Theme';`` としてください。

コールバックの位置の変更
------------------------

以前はbeforeLayoutはscripts_for_layoutとcontent_for_layoutが準備された後に起動されていました。
2.0では、全ての特殊な変数が準備される前にbeforeLayoutが起動するようになり、レイアウトにそれらの変数が渡される前に操作することが可能になります。
beforeRenderもまた同様で、ビューでの変数全てが操作される前に起動するようになりました。
これらの変更に加え、ヘルパーのコールバックはレンダリングするファイル名を常に受け取るようになりました。
これはヘルパーが ``$this->_View`` を通してビューに、 ``$this->_View->output`` を通してその時点でのビューのコンテンツにアクセスできることと併せて、以前より強い制御ができるようになります。

ヘルパーのコールバックの特性の変更
----------------------------------

ヘルパーのコールバックは常に一つの引数、beforeRenderとafterRenderにはレンダリングされるビューファイルが、beforeLayoutとafterLayoutにはレンダリングされるレイアウトファイルが与えられるようになりました。
ヘルパーの関数特性は以下のようにする必要があります::

    public function beforeRender($viewFile) {

    }

    public function afterRender($viewFile) {

    }

    public function beforeLayout($layoutFile) {

    }

    public function afterLayout($layoutFile) {

    }


エレメントのキャッシュと、ビューのコールバックは2.0でより強い柔軟性と整合性を提供するために変更されました。
:doc:`これらの変更について詳しく見る </views>`

Cacheヘルパーの分離
-------------------

前バージョンでは :php:class:`CacheHelper` と :php:class:`View` の間に強固な密結合がありました。
2.0ではこの密結合は取り除かれ、CacheHelperはフルページキャッシュを生成するために他のヘルパーと同じくコールバックだけを使うようになりました。


Cacheヘルパーの ``<cake:nocache>`` タグの変更
---------------------------------------------

前バージョンでは、CacheHelperは特別な ``<cake:nocache>`` タグをフルページキャッシュの一部とすべできはない出力の目印として使っていました。
このタグはXMLスキーマの要素ではなく、HTMLまたはXMLドキュメントで有効となり得ませんでした。
2.0では、このタグはHTML・XMLのコメントに置き換えられました::

    <cake:nocache> が <!--nocache-->
    </cake:nocache> が <!--/nocache-->

また、更新時に必ずビューキャッシュのファイルを削除するように、フルページビューキャッシュのための内部コード変更されました。

MediaViewの変更
---------------

:php:func:`MediaView::render()` は定義されていないファイルタイプを、falseを返す代わりにダウンロードを強制するようになりました。
別名でのダウンロードのためのファイル名を提供したいなら、この関数に渡す配列パラメーターに「name」キーを使って拡張子を含む完全な名前を指定します。


SimpleTestの替わりにPHPUnit
===========================

全てのコアのテストケースとテストの基盤はPHPUnit 3.7を使うように方向性を変えました。
もちろん関連するファイル郡を置き換えることによってアプリケーションでSimpleTestを使い続けることもできます。
SimpleTestをずっとサポートすることはもうないでしょう。
そして、PHPUnitに移行することもまた推奨されます。
テストを移行する方法についての更なる情報は、 PHPUnitへ移行するヒントを見てください。

グループテストの廃止
--------------------

PHPUnitはグループテストと単一のテストケースを、テスト実行の中で区別しません。
このため、グループテストのオプションと、古い形式のグループテストは削除されました。
GroupTestを ``PHPUnit_Framework_Testsuite`` のサブクラスに移行することをお勧めします。
CakePHPのテストスイートの中にこのサンプルとなるものがいくつか見つけられるでしょう。
また、 ``TestManager`` のメソッドに依存していたグループテストも削除されました。

テストスイートのシェル
----------------------

テストスイートのシェルはその呼び出しがシンプルに、また拡張がされました。
今や、 ``case`` と ``group`` を識別する必要はなくなりました。
全てのテストはテストケースであると家庭されます。
以前は、 ``cake testsuite app case models/post`` としていたでしょうが、 ``cake testsuite app Model/Post`` とすることができるようになりました。


テストスイートのシェルはPHPUnitのコマンドラインツールを使うように書き直されました。
PHPUnitによって全てのコマンドラインオプションがサポートされています。
全ての可能な修飾子のリストが ``cake testsuite help`` で参照できます。

モデル
======

関連モデルは遅延読み込みが為されるようになりました。
存在しないモデルのプロパティに値を割り当てようとすると、エラーを投げるような事態を垣間見ることが出来るでしょう::

    $Post->inexistentProperty[] = 'value';

上記は「注意：オーバーロードされた（訳注：PHPのオーバーロードのこと）プロパティの$inexistentPropertyへの間接的な変更は効果がありません。」(*Notice: Indirect modification of overloaded property $inexistentProperty has no effect*)というエラーを投げることでしょう。
以下のように、プロパティに初期値を与えることによってこの問題を解決できます::

    $Post->nonexistentProperty = array();
    $Post->nonexistentProperty[] = 'value';

また、以下のようにモデルのクラスにプロパティを定義するだけでも解決できます::

    class Post {
        public $nonexistentProperty = array();
    }

これらのどちらかのアプローチでnoticeエラーを回避できることでしょう。

Cake 1.2での ``find()`` の文法はサポートされなくなりました。
findはCake 1.3の ``$model->find('type', array(PARAMS))`` のような文法を使うべできす。

- ``Model::$_findMethods`` は ``Model::$findMethods`` になりました。
  このプロパティはpublicとなり、ビヘイビアによって更新することができるようになりました。



データベースオブジェクト
------------------------

Cake 2.0はデータベースオブジェクトに後方互換性への大きな影響の無い変更を加えました。
最大のものはデータベースの接続処理にPDOを採用したことです。
PHP5のありきたりなインストールを利用しているなら、既に必要な拡張はインストールされているでしょう。
しかし、使いたいと思う各ドライバのための個々の拡張を活性化する必要があるかもしれません。

全てのDBOに渡ってPDOを利用することは、各々のDBOに関してコードを均一にすることができ、全てのドライバでより信頼できる、予測可能な振る舞いを提供することができます。
また、データベースに関するコードのより移植可能で正確なテストを書くことも可能になりました。

まずはじめに「 *affected rows* 」 と 「 *total rows* 」の統計が無いことに気づくかもしれません。
これはよりパフォーマンスを上げるために、またPDOの遅延設計のために報告されないもので、この問題を克服する方法はありますが、非常に各データベースに特有のことです。
これらの統計はどこかに行ってしまった、というわけではないですが、いくつかのドライバでは失われるか正確でない可能性があります。

PDOを採用した後に追加された素晴らしい機能のうちの一つは、利用可能ならばネイティブなドライバを使ったクエリのプレースホルダを用いたプリペアードステートメント(*prepared statements*)を使えるようになったことです。

変更のリスト
~~~~~~~~~~~~

* DboMysqliが削除されました。
  DboMysqlのみをサポートします。
* DboSource::executeのAPIが変更されました。
  二番目の引数としてクエリの値の配列をとるようになりました::

    public function execute($sql, $params = array(), $options = array())

  上記が以下のようになりました::

    public function execute($sql, $options = array(), $params = array())

  第三引数はログのオプションを受け取ることを意味し、現在は「log」オプションのみ理解します。

* DboSource::value() は第三引数を失い、これはどのような場合も使われることはありませんでした。
* DboSource::fetchAll() は第二引数に配列を受け取ることができるようになり、クエリに結び付けられる値を渡します。
  第三引数は削除されました。例::

    $db->fetchAll(
      'SELECT
        * from users
      WHERE
        username = ?
      AND
        password = ?',
      array('jhon', '12345')
    );
    $db->fetchAll(
      'SELECT
        * from users
      WHERE
          username = :username
      AND
        password = :password',
      array('username' => 'jhon', 'password' => '12345')
    );

PDOドライバは自動的にこれらの値をエスケープします。

* データベースの統計は関連するDBOの「fullDebug」プロパティがtrueにセットされている時のみ収集されるようになりました。
* 新しいメソッドDboSource::getConnection()は直接ドライバと対話する必要がある場合のためにPDOオブジェクトを返します。
* 真偽値の扱いがよりクロスデータベース(*cross-database*)指向にするため、多少変更が成されました。
  テストケースを変更する必要があるかもしれません。
* PostgreSQLのサポートは莫大に向上し、正しいスキーマの生成、テーブルのtruncateができるようになり、これを使ったテストを書くのがより簡単になりました。
* DboSource::insertMulti() はSQL文字列を受け取らないようになりました。
  一度に全てを挿入するためのフィールドの配列とネストされた値の配列を単に渡してください。
* TranslateBehavior はモデルのvirtualFieldsを使うように書きなおされました。
  これで実装がより移植可能になりました。
* 全てのMysqlに関するもののテストケースは関連するドライバのテストケースに移されました。
  これによりDboSourceTestのファイルを多少薄くできました。
* トランザクションのネストのサポート。
  何重かにトランザクションを開始することができるようになりました。
  commitメソッドが同じ回数だけ呼び出された時のみコミットがなされます。
* SQLiteサポートが素晴らしく向上しました。
  cake 1.3との主な違いはSQLite 3.xのみをサポートするということです。
  これは開発中のアプリケーションで素晴らしい代替物となり、テストケースの実行が素早くなります。
* 真偽値カラムの値はPHPネイティブの真偽値型に自動的にキャストされます。
  従って、もし返り値を文字列や数値として期待しているなら、テストケースやコードを必ず書きなおしてください:
  例えば以前に「published」カラムを使っていなら、mysqlを使っていればfindから返ってくるの全ての値は以前数値でしたが、今は厳密に真偽値となりました。

ビヘイビア
==========

BehaviorCollection
------------------

-  ``BehaviorCollection`` はmappedMethodsを ``strtolower()`` しないようになりました。
   ビヘイビアのmappedMethodsは大文字小文字を区別するようになりました。

AclBehaviorとTreeBehavior
-------------------------

- 設定として文字列をサポートしなくなりました。例::

    public $actsAs = array(
        'Acl' => 'Controlled',
        'Tree' => 'nested'
    );

  こうなりました::

    public $actsAs = array(
        'Acl' => array('type' => 'Controlled'),
        'Tree' => array('type' => 'nested')
    );

プラグイン
==========

プラグインはコンポーネント、ヘルパー、モデルに、マジックとして自身のプラグイン接頭辞を付け加えなくなりました。
明示的に使いたいものを指定しなければなりません。以前は::

    public $components = array('Session', 'Comments');

とすると、アプリケーション・コアのコンポーネントをチェックする前にコントローラのプラグインを調べていたでしょう。
これはアプリケーション・コアのコンポーネントのみを見るようになりました。
プラグインからオブジェクトを使いたい場合は、プラグインの名前を指定しなければなりません::

    public $components = array('Session', 'Comment.Comments');

これは、マジックの失敗によって起こされていた問題をデバッグすることの煩雑さを減らすために為されました。
また、オブジェクトの参照が単一の信頼できる方法になったことで、アプリケーションでの矛盾をなくします。

プラグインのAppコントローラとモデル
-----------------------------------

プラグインのAppControllerとAppModelはプラグインフォルダに直接配置されないようになりました。
これらは以下のようにプラグインのControllerとModelフォルダに配置されます::

    /app
        /Plugin
            /Comment
                /Controller
                    CommentAppController.php
                /Model
                    CommentAppModel.php

コンソール
==========

コンソールのフレームワークの大部分は以下の問題の多くを処理するために、2.0で再建されました:

-  強固な密結合
-  シェルでヘルプ文字列を作るのが難しかった
-  シェルのパラメータを検証するのは面倒だった
-  プラグインのタスクは到達不可能だった（訳注：プラグインから別のプラグインのタスクは呼び出せなかった
-  オブジェクトの責任が大きすぎた

後方非互換なShellのAPIの変更
----------------------------

-  ``Shell`` は ``AppModel`` のインスタンスを保持しないようになりました。
   この ``AppModel`` のインスタンスは正しく組み立てられておらず、問題に満ちていました。
-  ``Shell::_loadDbConfig()`` は削除されました。
   これは一般的にShellに置くのにふさわしいものではありませんでした。
   もしユーザにDB設定を作成するかどうかをユーザに問う必要があるなら、 ``DbConfigTask`` を使うことが出来ます。
-  Shellは標準入力、標準出力、標準エラー出力にアクセスするために ``$this->Dispatcher`` を使わないようになりました。
   今はそれらを扱うために ``ConsoleOutput`` と ``ConsoleInput`` オブジェクトをもつようになりました。
-  シェルはタスクを遅延読み込みし、タスクを実行時読み込みする時にヘルパー、コンポーネント、ビヘイビアで使われるものと似たインターフェイスを、 ``TaskCollection`` を使って提供します。
-  ``Shell::$shell`` は削除されました。
-  ``Shell::_checkArgs()`` は削除されました。
   ``ConsoleOptionParser`` に設定をしてください。
-  シェルは ``ShellDispatcher`` に直接アクセスしないようになりました。
   代わりに ``ConsoleInput`` と ``ConsoleOutput`` オブジェクトを使用しなくてはなりません。
   他のシェルを立ち上げる必要があるなら、「Invoking other shells from your shell」セクションを見てください。

後方非互換なShellDispathserのAPIの変更
--------------------------------------

-  ``ShellDispatcher`` は標準出力、標準入力、標準エラー出力のファイルハンドルを持たないようになりました。
-  ``ShellDispatcher::$shell`` は削除されました。
-  ``ShellDispatcher::$shellClass`` は削除されました。
-  ``ShellDispatcher::$shellName`` は削除されました。
-  ``ShellDispatcher::$shellCommand`` は削除されました。
-  ``ShellDispatcher::$shellPaths`` は削除されました。代わりに ``App::path('shells');`` を使ってください。
-  ``ShellDispatcher`` は「help」を特殊な状態をもつマジックメソッドとして使わないようになりました。
   代わりに ``--help/-h`` オプション、またオプションパーサーを使ってください。

後方非互換なShellの変更
-----------------------

-  BakeのControllerTaskは ``public`` と ``admin`` を引数として取らなくなりました。
   これらはオプションになり、 ``--admin`` や ``--public`` のように指定されます。

あなたが使うシェルが何らかのパラメータが変更されたならば、そのシェルのヘルプを使用することをお勧めします。
また、利用可能となった新しいAPIの詳しい機能について、コンソールの新機能を見ることもお勧めします。


デバッグ
========

``debug()`` 関数はデフォルトでHTMLセーフな文字列で出力をするようになりました。
コンソールで使用される場合はこれは無効になります。
デバッグのために、 ``debug()`` の ``$showHtml`` オプションにfalseを指定して、HTMLセーフな出力を無効にすることもできます。

ConnectionManager
=================

``ConnectionManager::enumConnectionObjects()`` はファイル名、クラス名、プラグインの配列の代わりに作成されたコネクション各々の現在の設定を返します。
これは真に有用なものではありませんでした。

データベースのコネクションを定義する際、以前設定を定義してた方法にいくつかの変更を加える必要があります。
基本的にデータベース設定クラスでは、より良い一貫性を保つために、「driver」クラスはもう受け付けません。
また、データソースがパッケージに移動したため、探索するためのパッケージを渡す必要があります。
例を挙げます::

    public $default = array(
        'datasource' => 'Database/Mysql',
        'persistent' => false,
        'host' => 'localhost',
        'login' => 'root',
        'password' => 'root',
        'database' => 'cake',
    );
