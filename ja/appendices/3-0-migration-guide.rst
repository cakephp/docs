3.0 移行ガイド
##############

このページには、CakePHP 2.x ブランチ以来にコアで起こった変更の参照だけではなく、
プロジェクトを 3.0 に移行するのに役立つ CakePHP 2.x からの変更をまとめました。
すべての新機能と API の変更については、このガイドの他のページを必ずお読みください。


必要条件
========

- CakePHP 3.x は、PHP バージョン 5.4.16 以上をサポートしています。
- CakePHP 3.x は、mbstring 拡張モジュールを必要とします。
- CakePHP 3.x は、intl 拡張モジュールを必要とします。

.. warning::

    あなたは上記の要件を満たしていない場合は CakePHP 3.0 は動作しません。

アップグレードツール
====================

このドキュメントで CakePHP 3.0 で行われたすべての重大な変更と改良をカバーするほかに、
時間のかかる一部の機械的修正を補助してくれるコンソールアプリケーションを作成しました。
あなたは `github からのアップグレードツールを取得
<https://github.com/cakephp/upgrade>`_ することができます。

アプリケーションディレクトリのレイアウト
========================================

アプリケーションディレクトリのレイアウトが変更となりました。現在は
`PSR-4 <http://www.php-fig.org/psr/psr-4/>`_ に従います。
あなたのアプリケーションを更新するときには、基準点として `app スケルトン
<https://github.com/cakephp/app>`_ プロジェクトを使用する必要があります。

CakePHP は Composer でのインストールが必要
==========================================

もはや CakePHP は PEAR 経由、または共有ディレクトリにインストールすることは
できなくなりましたので、それらのインストール方法はサポートされなくなりました。
アプリケーションに CakePHP をインストールするためには、代わりに `Composer
<http://getcomposer.org>`_ を使用する必要があります。

名前空間
========

現在、CakePHP のコアクラスのすべてが、名前空間と PSR-4 オートロード仕様に従っています。
例えば **src/Cache/Cache.php** の名前空間は ``Cake\Cache\Cache`` となります。
グローバル定数や :php:meth:`__()` や :php:meth:`debug()` などのヘルパーメソッドは
便宜上名前空間はありません。

削除された定数
==============

以下の非推奨の定数は削除されています。

* ``IMAGES``
* ``CSS``
* ``JS``
* ``IMAGES_URL``
* ``JS_URL``
* ``CSS_URL``
* ``DEFAULT_LANGUAGE``

設定
====

CakePHP 3.0 の設定は、以前のバージョンに比べて大幅に異なっています。
3.0 でどのように設定するかは:doc:`/development/configuration` のドキュメントを
ご覧ください。

もはやクラスパスの追加設定に ``App::build()`` は使用しません。
代わりに、アプリケーションのオートローダを使用して追加のパスをマップする必要があります。
詳細については :ref:`additional-class-paths` 上のセクションをご覧ください。

３つの新しい設定変数は、プラグイン、ビュー、およびロケールファイルのパス設定を提供します。
テンプレート、プラグインやロケールファイルのための複数のパスを設定するには、それぞれ
``App.paths.templates`` 、 ``App.paths.plugins`` 、 ``App.paths.locales``
に複数のパスを追加することができます。

設定キー ``www_root`` は、一貫性を保つために ``wwwRoot`` に変更されました。
あなたの **app.php** 設定ファイルと同様に、 ``Configure::read('App.wwwRoot')``
の利用カ所も修正してください。

新しい ORM
==========

CakePHP 3.0 は、ゼロから再構築された新しい ORM を提供しています。新しい ORM は、
以前のものと著しく異なるため互換性がありません。新しい ORM にアップグレードするためには、
対象となるすべてのアプリケーションで大幅な変更が必要になります。
新しい ORM の使用方法については、新しい :doc:`/orm` ドキュメントをご覧ください。


基本原則
========

* ``LogError()`` は削除されました、それは何のメリットを提供していませんし、
  めったに使用されることはありません。
* 以下のグローバル関数は削除されました: ``config()``, ``cache()``, ``clearCache()``,
  ``convertSlashes()``, ``am()``, ``fileExistsInPath()``, ``sortByKey()`` 。

デバッグ
========

* ``Configure::write('debug', $bool)`` は、もはや 0/1/2 をサポートしていません。
  代わりに、単純なブール値が、デバッグモードをオンまたはオフに切り替えるために使用されます。

オブジェクトの設定
==================

* 現在、CakePHP で使用されるオブジェクトは、一貫したインスタンス設定の保管/検索システムを
  持っています。以前アクセスされていたコード、例えば ``$object->settings`` の代わりに
  ``$object->config()`` を使用するように更新する必要があります。

キャッシュ
==========

* ``Memcache`` エンジンは、削除されました。代わりに
  :php:class:`Cake\\Cache\\Cache\\Engine\\Memcached` を使用してください。
* キャッシュエンジンは現在、初期設定は遅延ロードです。
* :php:meth:`Cake\\Cache\\Cache::engine()` が追加されました。
* :php:meth:`Cake\\Cache\\Cache::enabled()` が追加されました。
  これは、 `` Cache.disable`` 設定オプションを置き換えます。
* :php:meth:`Cake\\Cache\\Cache::enable()` が追加されました。
* :php:meth:`Cake\\Cache\\Cache::disable()` が追加されました。
* キャッシュの設定は、現在イミュータブルです。あなたが設定を変更する必要がある場合、
  最初の設定をドロップしてから再作成する必要があります。
  これは設定オプションで同期の問題を防ぐことができます。
* ``Cache::set()`` は削除されました。あなたが ``Cache::set()`` で元の設定を調整して
  実行時に差し替えたい場合、複数のキャッシュ設定を作成することをお勧めします。
* ``CacheEngine`` の全てのサブクラスは、 `config()`` メソッドを実装するようになりました。
* :php:meth:`Cake\\Cache\\Cache::readMany()`,
  :php:meth:`Cake\\Cache\\Cache::deleteMany()`, および
  :php:meth:`Cake\\Cache\\Cache::writeMany()`` が追加されました。

すべての :php:class:`Cake\\Cache\\Cache\\CacheEngine` メソッドは、
設定されたキープレフィックスの処理を受け付けられるようになりました。
:php:meth:`Cake\\Cache\\CacheEngine::write()` は有効期限の設定ができなくなりました。
有効期限は、キャッシュエンジンの実行時に config() から取得できます。
空のキーでキャッシュメソッドを呼び出すと ``false`` を返す代わりに
:php:class:`InvalidArgumentException` が投げられるようになりました。


コア
====

App
---

- ``App::pluginPath（）`` は削除されました。
  代わりに ``CakePlugin::path（）`` を使用してください。
- ``App::build（）`` は削除されました。
- ``App::location()`` は削除されました。
- ``App::paths（）`` は削除されました。
- ``App::load()`` は削除されました。
- ``App::objects()`` は削除されました。
- ``App::RESET`` は削除されました。
- ``App::APPEND`` は削除されました。
- ``App::PREPEND`` は削除されました。
- ``App::REGISTER`` は削除されました。

Plugin
------

- :php:meth:`Cake\\Core\\Plugin::load()` は ``autoload`` オプションを
  ``true`` に設定しない限りセットアップしません。
- プラグインをロードする際、呼び出し可能な関数を提供することはできません。
- プラグインをロードする際、ロードする設定ファイルの配列を提供することはできません。

Configure
---------

- ``Cake\Configure\PhpReader`` は
  :php:class:`Cake\\Core\\Configure\\Engine\PhpConfig` にリネームしました。
- ``Cake\Configure\IniReader`` は
  :php:class:`Cake\\Core\\Configure\\Engine\IniConfig` にリネームしました。
- ``Cake\Configure\ConfigReaderInterface`` は
  :php:class:`Cake\\Core\\Configure\\ConfigEngineInterface` にリネームしました。
- :php:meth:`Cake\\Core\\Configure::consume()` が追加されました。
- :php:meth:`Cake\\Core\\Configure::load()` はエンジンから誘導することができるよう、
  拡張子サフィックスののないファイル名を想定しています。例えば、 PhpConfig の場合、
  **app.php** をロードするために ``app`` を指定します。
- PHP の設定ファイルの中で ``$config`` 変数を設定することは推奨されません。
  :php:class:`Cake\\Core\\Configure\\Engine\PhpConfig` は、
  設定ファイルが配列を返すことを想定しています。
- 新しい設定エンジン :php:class:`Cake\\Core\\Configure\\Engine\JsonConfig`
  が追加されました。

Object
------

``Object`` クラスは削除されました。以前は、フレームワーク全体の様々な場所で使用された
雑多なメソッドを含んでいました。これらのメソッドの中で最も有用なものは、
トレイトに抽出されています。 ``log()`` メソッドにアクセスするために
:php:trait:`Cake\\Log\\LogTrait` を使用することができます。
:php:trait:`Cake\\Routing\\RequestActionTrait` は ``requestAction()`` を提供します。

コンソール
==========

``cake`` の実行可能ファイルは、 **app/Console** ディレクトリからアプリケーションの
スケルトン内の **bin** ディレクトリに移動してきました。
``bin/cake`` で CakePHP のコンソールを呼び出すことができます。

TaskCollection の置換
---------------------

このクラスは、 :php:class:`Cake\\Console\\TaskRegistry` に名前が変更されました。
新しいクラスによって提供される機能の詳細については、
:doc:`/core-libraries/registry-objects` のセクションを参照してください。
あなたのコードのアップグレードを支援するために ``cake upgrade rename_collections``
を使用することができます。Task は、コールバックへのアクセスはしなくなりました。
使用する任意のコールバックは決して存在しません。

Shell
-----

- ``Shell::__construct()`` は変更されました。
  今は :php:class:`Cake\\Console\\ConsoleIo` のインスタンスを受け取ります。
- ``Shell::param()`` は、params へ簡単にアクセスするために追加されました。

さらに、すべてのシェルメソッドは、呼び出されたときにキャメルケースに変換されます。
例えば、シェルの中に ``hello_world()`` メソッドを持ち、
``bin/cake my_shell hello_world`` と呼び出していた場合、メソッドの名前を
``helloWorld`` に変更する必要があります。コマンドを呼び出す方法で、必要な変更はありません。

ConsoleOptionParser
-------------------

- ``ConsoleOptionParser::merge()`` は、パーサーをマージするために追加されました。

ConsoleInputArgument
--------------------

- ``ConsoleInputArgument::isEqualTo()`` は、２つの引数を比較するために追加されました。

Shell / Task
============

シェルとタスクは ``Console/Command`` と ``Console/Command/Task`` から ``Shell`` と
``Shell/Task`` に移動されました。

ApiShell を削除
----------------

ファイルソース自身とオンラインドキュメント/`API <http://api.cakephp.org/>`_
以上の何の利益も提供しなかったので ApiShell は削除されました。

SchemaShell を削除
-------------------

完全なデータベースマイグレーションの実装ではなく、 `Phinx <http://phinx.org/>`_
のようなより良いツールの登場により、SchemaShell は削除されました。
これは、CakePHP と `Phinx <https://phinx.org/>`__ の間のラッパーとして機能する
`CakePHP Migrations プラグイン <https://github.com/cakephp/migrations>`_
に置き換えられました。 

ExtractTask
-----------

- ``bin/cake i18n extract`` はもはや未翻訳のバリデーションメッセージが含まれていません。
  翻訳されたバリデーションメッセージにしたい場合は、他のコンテンツのような `__()` の呼び出しで
  それらのメッセージをラップする必要があります。

BakeShell / TemplateTask
------------------------

- Bake は、コアソースの一部ではなくなり、`CakePHP Bake プラグイン
  <https://github.com/cakephp/bake>`_ に置き換えられます。
- Bake テンプレートは **src/Template/Bake** の下に移動されました。
- Bake テンプレートの構文は PHP コードがプレーンテキストとして扱うことを可能し、
  テンプレートのロジックを示すために、erb 書式のタグ (``<% %>``) を使用しています。
- ``bake view`` コマンドは ``bake template`` に名前が変更されました。

Event
=====

``getEventManager()`` メソッドは、それを持っていたすべてのオブジェクトで削除されました。
現在、 ``eventManager()`` メソッドは ``EventManagerTrait`` によって提供されています。
``EventManagerTrait`` は、インスタンス化のロジックと、ローカルイベントマネージャへの参照を
維持するロジックが含まれています。

イベントサブシステムは、削除された幾つかのオプション機能がありました。
イベントをディスパッチするとき、もはや次のオプションを使用することはできません。

* ``passParams`` このオプションは暗黙的に常に有効になっています。
  それをオフにすることはできません。
* ``break`` このオプションは削除されました。
  イベントを停止する必要があります。
* ``breakOn`` このオプションは削除されました。
  イベントを停止する必要があります。

Log
===

* ログ設定はイミュータブルです。あなたが設定を変更する必要がある場合は、
  最初の設定をドロップしてから再作成する必要があります。
  これは設定オプションで同期の問題を防ぐことができます。
* ログエンジンは、ログへの最初の書き込み時に遅延ロードされます。
* :php:meth:`Cake\\Log\\Log::engine()` が追加されました。
* 次のメソッドが、 :php:class:`Cake\\Log\\Log` から削除されました。
  ``defaultLevels()``, ``enabled()``, ``enable()``, ``disable()`` 。
* もはや ```Log::levels()`` を使用してカスタムレベルを作成することはできません。
* ロガーを設定する時、``'types'`` の代わりに ``'levels'`` を使用する必要があります。
* もはやカスタムログレベルを指定することはできません。
  ログレベルのデフォルトセットを使用する必要があります。あなたのアプリケーションの異なる
  セクションのカスタムログファイルや、特定の処理を作成するには、ロギングスコープを使用する
  必要があります。非標準のログレベルを使用すると、今すぐ例外がスローされます。
* :php:trait:`Cake\\Log\\LogTrait` が追加されました。
  あなたのクラスに ``log()`` メソッドを追加するために、このトレイトを使用することができます。
* :php:meth:`Cake\\Log\\Log::write()` メソッドに渡されたロギングスコープは、
  ログエンジンにより良い状況を提供するために、ログエンジンの ``write()``
  メソッドに転送されます。
* ログエンジンは、CakePHP の独自の ``LogInterface`` の代わりに
  ``Psr\Log\LogInterface`` を実装する必要があります。一般的には、
  :php:class:`Cake\\Log\\Engine\\BaseEngine` を継承していたら、
  `write()` メソッドを `log()` に名前を変更する必要があります。
* :php:meth:`Cake\\Log\\Engine\\FileLog` は、 ``ROOT/tmp/logs`` の代わりに
  ``ROOT/logs`` にファイルを書き込みます。

ルーティング
============

名前付きパラメータ
------------------

名前付きパラメータは 3.0 で削除されました。名前付きパラメータは、クエリ文字列パラメータの
「きれいな」バージョンとして 1.2.0 で追加されました。視覚的な利点は議論の余地がありますが、
名前付きパラメータが引き起こした問題には議論の余地はありません。

名前付きパラメータは、CakePHP での特別な処理だけでなく、操作するために必要な任意の PHP や
JavaScript ライブラリを必要としました。 名前付きパラーメータは、CakePHP を *除く*
ライブラリによって実装されず評価されませんでした。名前付きパラメータをサポートするために
必要な追加の複雑さとコードの存在を正当化できずに削除されました。
その場所では、標準のクエリ文字列パラメータや渡された引数を使用する必要があります。
デフォルトでは ``Router`` は、クエリ文字列引数として ``Router::url()``
の任意の追加のパラメータを扱います。

依然として多くのアプリケーションは、まだ名前付きパラメータを含む
URL を解析する必要があります。 :php:meth:`Cake\\Routing\\Router::parseNamedParams()`
は、既存の URL との下位互換性を可能にするために追加されました。


RequestActionTrait
------------------

- :php:meth:`Cake\\Routing\\RequestActionTrait::requestAction()` は、
  特別なオプションの一部が変更されてきました。

- ``options[url]`` は、今は ``options[query]`` です。
- ``options[data]`` は、今は ``options[post]`` です。
- 名前付きパラメータはサポートされなくなりました。

Router
------

* 名前付きパラメータが削除されました。詳細については上記を参照してください。
* ``full_base`` オプションは、 ``_full`` オプションに置き換えられました。
* ``ext`` オプションは、 ``_ext`` オプションに置き換えられました。
* ``_scheme``, ``_port``, ``_host``, ``_base``, ``_full``, ``_ext`` オプションが
  追加されました。
* プラグイン/コントローラ/プレフィックス名を追加することによって、URL 文字列は変更されません。
* デフォルトのフォールバックルートの処理は削除されました。何のルートもパラメータ・セットと
  一致しない場合には、 ``/`` が返されます。
* Route クラスは、クエリ文字列パラメータを含む *すべての* URLの生成に関与しています。
  これで、ルートがはるかに強力かつ柔軟になります。
* 永続的なパラメーターは削除されました。これらは、リバースルーティングされる URL を
  変異させるために、より柔軟な方法を可能にする
  :php:meth:`Cake\\Routing\\Router::urlFilter()` に置き換えられました。
* ``Router::parseExtensions()`` は削除されました。
  代わりに :php:meth:`Cake\\Routing\\Router::extensions()` を使用してください。
  このメソッドは、ルートが接続される前に、*呼び出さなければなりません* 。
  これは、既存のルートを変更しません。
* ``Router::setExtensions()`` は削除されました。
  代わりに :php:meth:`Cake\\Routing\\Router::extensions()` を使用してください。
* ``Router::resourceMap()`` は削除されました。
* ``[method]`` オプションは ``_method`` に名前が変更されました。
* ``[]`` 形式のパラメータで任意のヘッダと照合する機能は削除されました。
  あなたがパースや照合する必要がある場合は、カスタムルートクラスを使用することを
  検討してください。
* ``Router::promote()`` は削除されました。
* URL が任意のルートを処理できないとき ``Router::parse()`` は例外が発生します。
* ルートがパラメータのセットと一致しないとき ``Router::url()`` は例外が発生します。
* ルーティングスコープが導入されています。
  ルーティングスコープは、あなたの routes ファイルを DRY に保ち、Router が
  URL のパース最適化やリバースルーティングの方法についてヒントを与えることができます。

Route
-----

* ``CakeRoute`` は ``Route`` に名前が変更されました。
* ``match()`` のシグネチャを ``match($url, $context = [])`` に変更しました。
  新しい引数についての情報は :php:meth:`Cake\\Routing\\Route::match()` をご覧ください。

ディスパッチャフィルタの設定変更
--------------------------------

ディスパッチャフィルタは、もはや ``Configure`` を使用してアプリケーションに追加されていません。
:php:class:`Cake\\Routing\\DispatcherFactory` で追加してください。
アプリケーションが ``Dispatcher.filters`` を使用していた場合、代わりに
:php:meth:`Cake\\Routing\\DispatcherFactory::add()` を使用する必要があります。


設定方法の変更に加えて、ディスパッチャフィルタは、いくつかの規則が更新され、機能が追加されました。
詳細については、:php:meth:`Cake\\Routing\\DispatcherFactory::add()`
のドキュメントを参照してください。

Filter\AssetFilter
------------------

* AssetFilter によって、プラグインやテーマのアセットは ``include`` を介して
  読み出されていない代わりに、プレーンテキストファイルとして扱われます。
  これは、TinyMCE のような JavaScript ライブラリと short_tags が有効な環境での
  多くの問題が修正されています。
* ``Asset.filter`` 設定とフックのサポートは削除されました。
  この機能は、プラグインやディスパッチャフィルタに置き換える必要があります。


ネットワーク
============

リクエスト
----------

* ``CakeRequest`` は :php:class:`Cake\\Network\\Request` に名前が変更されました。
* :php:meth:`Cake\\Network\\Request::port()` が追加されました。
* :php:meth:`Cake\\Network\\Request::scheme()` が追加されました。
* :php:meth:`Cake\\Network\\Request::cookie()` が追加されました。
* :php:attr:`Cake\\Network\\Request::$trustProxy` が追加されました。
  これは、簡単にロードバランサの背後にある CakePHP アプリケーションを配置することができます。
* 接頭辞は削除されたので、 :php:attr:`Cake\\Network\\Request::$data` は
  接頭辞データキーとマージされなくなりました。
* :php:meth:`Cake\\Network\\Request::env()` が追加されました。
* :php:meth:`Cake\\Network\\Request::acceptLanguage()` は、
  static なメソッドから非 static に変更されました。
* 「モバイル」のリクエスト判定処理は、コアから削除されました。代わりに、app テンプレートは
  ``MobileDetect`` ライブラリを使用して、「モバイル」と「タブレット」のための判定処理を
  追加します。
* ``onlyAllow()`` メソッドは ``allowMethod()`` に名前が変更され、
  「可変長引数リスト (var args)」は受け入れません。すべてのメソッド名は、
  文字列または文字列の配列のどちらかを、最初の引数に渡す必要があります。

レスポンス
----------

* MIMEタイプ ``text/plain`` から ``csv`` 拡張子へのマッピングが削除されました。
  jQuery の XHR リクエストを受け取る際によくある厄介ごとであった ``Accept`` ヘッダーに
  ``text/plain`` が含む場合も、結果として、
  :php:class:`Cake\\Controller\\Component\\RequestHandlerComponent` は ``csv``
  の拡張機能を設定しません。

セッション
==========

セッションクラスは static ではなくなり、代わりにセッションが request オブジェクトを介して
アクセスすることができます。セッションオブジェクトを使用するためには、
:doc:`/development/sessions` ドキュメントをご覧ください。

* :php:class:`Cake\\Network\\Session` と関連するセッションクラスは ``Cake\Network``
  名前空間の下に移動されました。
* ``SessionHandlerInterface`` は、PHP 自体が提供するようになりましたので削除されました。
* ``Session::$requestCountdown`` プロパティは削除されました。
* セッションの checkAgent 機能が削除されました。その機能は、 chrome のフレームや
  flash player が関与するとき、多くのバグを引き起こしました。
* セッション用データベーステーブル名は ``cake_sessions`` の代わりに 
  ``sessions`` になります。
* セッションクッキーのタイムアウトは、自動的にセッションデータのタイムアウトと並行して更新されます。
* セッションクッキーのパスは、"/" の代わりにアプリのベースパスがデフォルトになります。
  新しい設定変数 ``Session.cookiePath`` は、クッキーのパスをカスタマイズするために
  追加されました。
* 新しい便利なメソッド :php:meth:`Cake\\Network\\Session::consume()` は、
  セッションデータの読み取りと削除を１度に行うするために追加されました。
* :php:meth:`Cake\\Network\\Session::clear()` の引数 ``$renew`` のデフォルト値は、
  ``true`` から ``false`` に変更されました。

Network\\Http
=============

* ``HttpSocket`` は :php:class:`Cake\\Network\\Http\\Client` になりました。
* Http\Client は、ゼロから書き直しています。この API を使用すると OAuth のような
  新しい認証システムへの対応や、ファイルのアップロードがシンプルで簡単になります。
  PHP のストリーム API を使用していますので、 cURL は必要ありません。
  詳細は :doc:`/core-libraries/httpclient` ドキュメントをご覧ください。

Network\\Email
==============

* :php:meth:`Cake\\Network\\Email\\Email::config()` は設定プロファイルの定義に
  使用されます。これは、以前のバージョンの ``EmailConfig`` クラスを置き換えます。
* :php:meth:`Cake\\Network\\Email\\Email::profile()` は、インスタンスごとに
  設定オプションを更新するための方法として、 ``config()`` を置き換えます。
* :php:meth:`Cake\\Network\\Email\\Email::drop()` は、Eメールの設定を
  削除できるようにするために追加されました。
* :php:meth:`Cake\\Network\\Email\\Email::configTransport()` は、
  トランスポート設定の定義を行うために追加されました。この変更は、配信プロファイルから
  トランスポートオプションを削除して、Eメールプロファイルをまたがって再利用することができます。
* :php:meth:`Cake\\Network\\Email\\Email::dropTransport()` は、トランスポート設定を
  削除できるようにするために追加されました。


コントローラ
============

Controller
----------

- ``$helpers`` 、 ``$components`` プロパティは、現在 **すべての** 親クラスだけではなく、
  ``AppController`` やプラグインの AppController とマージされます。プロパティは、
  それぞれ別々にマージされます。すべてのクラスのすべての設定が一緒にマージされる代わりに、
  子クラスで定義された設定が使用されます。これは、あなたの AppController で定義された
  いくつかの設定、およびサブクラスで定義されたいくつかの設定を持っている場合は、
  サブクラス内の設定のみが使用されることを意味します。
- ``Controller::httpCodes()`` は削除されました。代わりに
  :php:meth:`Cake\\Network\\Response::httpCodes()` を使用してください。
- ``Controller::disableCache()`` は削除されました。代わりに
  :php:meth:`Cake\\Network\\Response::disableCache()` を使用してください。
- ``Controller::flash()`` は削除されました。このメソッドは、実際にアプリケーションで
  使用されることは稀で、もはや何の目的も果たしませんでした。
- ``Controller::validate()`` と ``Controller::validationErrors()`` は削除されました。
  それらは、モデルとコントローラの関係がはるかに絡み合った 1.x の時代から残っていたメソッドです。
- ``Controller::loadModel()`` は、テーブルオブジェクトをロードします。
- ``Controller::$scaffold`` プロパティは削除されました。
  動的な scaffolding (スキャフォールディング) は、CakePHP のコアから削除されました。
  CRUD という名前の改良された scaffolding のプラグインは、こちら:
  https://github.com/FriendsOfCake/crud
- ``Controller::$ext`` プロパティは削除されました。デフォルト以外のビューファイル拡張子を
  使用する場合、 View を継承し、 ``View::$_ext`` プロパティをオーバーライドする必要が
  あります。
- ``Controller::$methods`` プロパティは削除されました。メソッド名がアクションであるか否かを
  決定するために ``Controller::isAction()`` を使用する必要があります。この変更は
  アクションとしてカウントされるか、されないかを簡単にカスタマイズできるようにしました。
- ``Controller::$Components`` プロパティが削除され、 ``_components`` に
  置き換えられました。実行時にコンポーネントをロードする必要がある場合は、コントローラ上の
  ``$this->loadComponent()`` を使用する必要があります。
- :php:meth:`Cake\\Controller\\Controller::redirect()` のシグネチャは
  ``Controller::redirect(string|array $url, int $status = null)`` に変更されました。
  第三引数 ``$exit`` は削除されました。このメソッドは、もはやレスポンスを送信し、
  スクリプトを終了することはできません。その代わりに、設定された適切なヘッダを持つ
  ``Response`` インスタンスを返します。
- ``base``, ``webroot``, ``here``, ``data``,  ``action``, および ``params``
  マジックプロパティは削除されました。代わりに ``$this->request`` で、これらのすべての
  プロパティにアクセスする必要があります。
- ``_someMethod()`` のようなアンダースコアがプレフィクスのメソッドは、もはや
  private メソッドとして扱われなくなりました。代わりに、適切な可視性のキーワードを使用してください。
  public メソッドのみ、コントローラのアクションとして使用することができます。

Scaffold の削除
----------------

CakePHP の動的なスキャフォールディングは、CakePHP のコアから削除されました。
使用頻度が低く、製品での利用のために意図されていませんでした。
CRUD という名前の改良されたスキャフォールディングプラグインは、こちらです:
https://github.com/FriendsOfCake/crud

ComponentCollection の置換
----------------------------

このクラスは :php:class:`Cake\\Controller\\ComponentRegistry` に名前が変更されました。
新しいクラスによって提供される機能の詳細については、
:doc:`/core-libraries/registry-objects` のセクションを参照してください。
あなたのコードのアップグレードを支援するために ``cake upgrade rename_collections``
を使用することができます。

Component
---------

* ``_Collection`` プロパティは、 ``_registry`` になります。そのプロパティは
  :php:class:`Cake\\Controller\\ComponentRegistry` のインスタンスです。
* すべてのコンポーネントは、設定を取得やセットするために ``config()`` メソッドを
  使用する必要があります。
* コンポーネントのデフォルトの設定では、 ``$_defaultConfig`` プロパティで定義する必要が
  あります。このプロパティは、コンストラクタで提供される任意の設定と自動的にマージされます。
* 設定オプションは、もはや public プロパティとして設定されていません。
* ``Component::initialize()`` メソッドは、もはやイベントリスナーではありません。
  代わりに、 ``Table::initialize()`` や ``Controller::initialize()`` のような
  コンストラクタ後のフックがあります。新しい ``Component::beforeFilter()`` メソッドは
  ``Component::initialize()`` で使用されていたのと同じイベントにバインドされています。
  initialize メソッドは ``initialize(array $config)`` のシグネチャを持つ必要があります。

Controller\\Components
======================

CookieComponent
---------------

- Cookie データを読み込むため :php:meth:`Cake\\Network\\Request::cookie()` します。
  これは、テストを容易にし、ControllerTestCase でクッキーを設定することができます。
- ``Security::cipher()`` は削除されているため、CakePHP の以前のバージョンで
  ``cipher()`` メソッドを使用して暗号化されたクッキーは読み込めません。アップグレードする前に
  ``rijndael()`` や ``aes()`` メソッドでクッキー再暗号化する必要があります。
- ``CookieComponent::type()`` は削除され、``config()`` を介してアクセスする
  設定データに置き換えられました。
- ``write()`` は、もはや ``encryption`` や ``expires`` パラメータを取りません。
  これらの両方は、設定データを介して管理されています。詳細は
  :doc:`/controllers/components/cookie` をご覧ください。
- クッキーのパスは、"/" の代わりにアプリケーションのベースパスがデフォルトです。


AuthComponent
-------------

- ``Default`` が、現在の認証クラスで使用されるデフォルトのパスワードハッシャーです。
  それは排他的に bcrypt ハッシュアルゴリズムを使用しています。2.x で使用される SHA1
  ハッシュを引き続き使用する場合、オーセンティケータの設定で
  ``'passwordHasher' => 'Weak'`` を使用してください。
- 新しい ``FallbackPasswordHasher`` は、古いパスワードをあるアルゴリズムから別の
  アルゴリズムへの移行を助けるために追加されました。詳細は AuthComponent のドキュメントを
  ご覧ください。
- ``BlowfishAuthenticate`` クラスは削除されました。
  ``FormAuthenticate`` を使用してください。
- ``BlowfishPasswordHasher`` クラスは削除されました。
  ``DefaultPasswordHasher`` を代わりに使用してください。
- ``loggedIn()`` メソッドは削除されました。
  ``user()`` を代わりに使用してください。
- 設定オプションは、もはや public プロパティとして設定されていません。
- ``allow()`` や ``deny()`` メソッドは、もはや「可変長引数リスト (var args)」を
  受け入れません。すべてのメソッド名は、文字列または文字列の配列のいずれかを、
  最初の引数として渡す必要があります。
- メソッド ``login()`` は削除されました。代わりに ``setUser()`` に置き換えられました。
  ユーザーがログインするためには、ユーザーを識別して情報を返す ``identify()`` を
  呼ばなければなりません。その時セッションに情報を保存するために ``setUser()`` を使用します。

- ``BaseAuthenticate::_password()`` は削除されました。
  代わりに ``PasswordHasher`` クラスを使用してください。
- ``BaseAuthenticate::logout()`` は削除されました。
- ``AuthComponent`` は、ユーザーを識別した後と、ユーザーがログアウトする前に、
  ２つのイベント ``Auth.afterIdentify`` と ``Auth.logout`` をトリガーします。
  あなたの認証クラスの ``implementedEvents()`` メソッドからマッピング配列を
  返すことによって、これらのイベントのコールバック関数を設定することができます。

ACL 関連クラスは、別のプラグインに移動されました。PasswordHassher, Authentication
および Authorization プロバイダは ``\Cake\Auth`` 名前空間に移動されました。
あなたのプロバイダとハッシャーも同様に ``App\Auth`` 名前空間に移動する必要があります。

RequestHandlerComponent
-----------------------

- 以下のメソッドは RequestHandler コンポーネントから削除されました。
  ``isAjax()``, ``isFlash()``, ``isSSL()``, ``isPut()``, ``isPost()``, ``isGet()``, ``isDelete()`` 。
  代わりに :php:meth:`Cake\\Network\\Request::is()` メソッドと関連する引数を使用してください。
- ``RequestHandler::setContent()`` は削除されました。
  代わりに :php:meth:`Cake\\Network\\Response::type()` を使用してください。
- ``RequestHandler::getReferer()`` は削除されました。
  代わりに :php:meth:`Cake\\Network\\Request::referer()` を使用してください。
- ``RequestHandler::getClientIP()`` は削除されました。
  代わりに :php:meth:`Cake\\Network\\Request::clientIp()` を使用してください。
- ``RequestHandler::getAjaxVersion()`` は削除されました。
- ``RequestHandler::mapType()`` は削除されました。
  代わりに :php:meth:`Cake\\Network\\Response::mapType()` を使用してください。
- 設定オプションは、もはや public プロパティとして設定されていません。

SecurityComponent
-----------------

- 次のメソッドとその関連プロパティは、Security コンポーネントから削除されています:
  ``requirePost()``, ``requireGet()``, ``requirePut()``, ``requireDelete()``.
  代わりに :php:meth:`Cake\\Network\\Request::allowMethod()` を使用してください。
- ``SecurityComponent::$disabledFields()`` は削除されました。
  ``SecurityComponent::$unlockedFields()`` を使用してください。
- SecurityComponent の CSRF 関連機能を抽出し、 CsrfComponent に移動されました。
  このコンポーネントを使うと、フォームの改ざん防止をする必要なしに
  CSRF の対策をすることができます。
- 設定オプションは、もはや public プロパティとして設定されていません。
- ``requireAuth()`` や ``requireSource()`` メソッドは、
  もはや「可変長引数リスト (var args)」 を受け入れません。すべてのメソッド名は、
  文字列または文字列の配列のどちらかを、最初の引数に渡す必要があります。

SessionComponent
----------------

- ``SessionComponent::setFlash()`` は非推奨になりました。
  代わりに :doc:`/controllers/components/flash` を使用してください。

エラー
------

エラーのレンダリング時に、カスタム例外レンダラは、
:php:class:`Cake\\Network\\Response` オブジェクトか文字列のいずれかを返すことが
期待されます。 これは、特定の例外を処理する任意のメソッドがレスポンスまたは文字列の値を
返さなければならないことを意味します。

モデル
======

2.x のモデル層は完全に書き直され、置き換えられています。
新しい ORM の使用方法についての情報は :doc:`/appendices/orm-migration`
を確認してください。

- ``Model`` クラスが削除されました。
- ``BehaviorCollection`` クラスが削除されました。
- ``DboSource`` クラスが削除されました。
- ``Datasource`` クラスが削除されました。
- さまざまなデータソースクラスが削除されました。

ConnectionManager
-----------------

- ConnectionManager は ``Cake\Datasource`` 名前空間に移されました。
- ConnectionManager は、以下のメソッドが削除されました:

  - ``sourceList``
  - ``getSourceName``
  - ``loadDataSource``
  - ``enumConnectionObjects``

- :php:meth:`~Cake\\Database\\ConnectionManager::config()` が追加されました。
  接続を設定するための唯一の方法です。
- :php:meth:`~Cake\\Database\\ConnectionManager::get()` が追加されました。
  それは ``getDataSource()`` を置き換えます。
- :php:meth:`~Cake\\Database\\ConnectionManager::configured()` が追加されました。
  より標準的かつ一貫性のある API として、
  ``sourceList()`` と ``enumConnectionObjects()`` は、
  ``configured()`` と ``config()`` に置き換えられました。
- ``ConnectionManager::create()`` は削除されました。
  ``config($name, $config)`` と ``get($name)`` によって置き換えられました。

ビヘイビア
----------
- ``_someMethod()`` のようなアンダースコアがプレフィクスのメソッドは、もはや
  private メソッドとして扱われなくなりました。
  代わりに、適切な可視性のキーワードを使用してください。

TreeBehavior
------------

TreeBehavior は新しい ORM を使用するように完全に書き直されました。
2.x と同じように動作しますが、いくつかのメソッドは、名前変更または削除されました。

- ``TreeBehavior::children()`` はカスタムファインダー ``find('children')`` になります。
- ``TreeBehavior::generateTreeList()`` はカスタムファインダー ``find('treeList')`` になります。
- ``TreeBehavior::getParentNode()`` は削除されました。
- ``TreeBehavior::getPath()`` はカスタムファインダー ``find('path')`` になります。
- ``TreeBehavior::reorder()`` は削除されました。
- ``TreeBehavior::verify()`` は削除されました。

TestSuite
=========

TestCase
--------

- ``_normalizePath()`` が追加されました。パスの比較をテストすることができ、DS 設定 
  (例えば、Windows の ``\`` や UNIX の ``/``) に関しては、
  すべてのオペレーティングシステムで実行できます。

次のアサーションメソッドは、長い間非推奨で、PHPUnit のメソッドに置き換えられているとして、
削除されています。

- ``assertEquals()`` 採用により ``assertEqual()``
- ``assertNotEquals()`` 採用により ``assertNotEqual()``
- ``assertSame()`` 採用により ``assertIdentical()``
- ``assertNotSame()`` 採用により ``assertNotIdentical()``
- ``assertRegExp()`` 採用により ``assertPattern()``
- ``assertNotRegExp()`` 採用により ``assertNoPattern()``
- ``assertSame()`` 採用により ``assertReference()``
- ``assertInstanceOf()`` 採用により ``assertIsA()``

いくつかのメソッドは、引数の順序を切り替えていることに注意してください、例えば
``assertEqual($is, $expected)`` は ``assertEquals($expected, $is)``
でなければなりません。

以下のアサーションメソッドは推奨されておらず、将来削除されます。

- ``assertWithinRange()`` 採用により ``assertWithinMargin()``
- ``assertHtml()`` 採用により ``assertTags()``

アサーションメソッド API の一貫性のために ``$expected`` が第１引数となるよう、
両方のメソッドは引数の順番を交換しました。

以下のアサーションメソッドが追加されました。

- ``assertWithinRange()`` の逆として ``assertNotWithinRange()``


ビュー
======

テーマは基本的なプラグイン
----------------------------

モジュラーアプリケーション・コンポーネントを作成する方法として、テーマやプラグインを
持つことは、制約や混乱を解決します。CakePHP 3.0 では、テーマはもはやアプリケーションの
**内部** に存在しません。その代わりに、スタンドアロンのプラグインです。
これは、テーマに対するいくつかの問題を解決します。

- プラグインの *中* にテーマを置けませんでした。
- テーマはヘルパー、またはカスタムビュークラスを提供することができませんでした。

これらの問題の両方は、テーマをプラグインに変換することによって解決されます。

View フォルダの名前変更
-----------------------

ビューファイルを含むフォルダは、 **src/View** の代わりに **src/Template** の下に移りました。
これは、php クラス (例えば、ヘルパーや View クラス) のファイルとビューファイルを
分離するために行われました。

次の View フォルダがコントローラ名との衝突を避けるために変更されました。

- ``Layouts`` は ``Layout`` になります。
- ``Elements`` は ``Element`` になります。
- ``Errors`` は ``Error`` になります。
- ``Emails`` は ``Email`` になります。 (``Layout`` 内も同様に ``Email``)

HelperCollection の置換
-------------------------

このクラスは :php:class:`Cake\\View\\HelperRegistry` に名前が変更されました。
新しいクラスによって提供される機能の詳細については、
:doc:`/core-libraries/registry-objects` のセクションを参照してください。
あなたのコードのアップグレードを支援するために ``cake upgrade rename_collections``
を使用することができます。

View クラス
-----------

- ``plugin`` キーは、 :php:meth:`Cake\\View\\View::element()` の引数 ``$options``
  から削除されました。
  代わりに ``SomePlugin.element_name`` としてエレメント名を指定してください。
- ``View::getVar()`` は削除されました。代わりに :php:meth:`Cake\\View\\View::get()`
  を使用してください。
- ``View::$ext`` は削除されました。代わりに protected なプロパティ ``View::$_ext``
  になりました。
- ``View::addScript()`` は削除されました。
  代わりに :ref:`view-blocks` を使用してください。
- ``base``, ``webroot``, ``here``, ``data``,  ``action``, および ``params``
  マジックプロパティは削除されました。
  代わりに ``$this->request`` で、これらのすべてのプロパティにアクセスする必要があります。
- ``View::start()`` は、もはや既存のブロックに追加されません。
  代わりに、end が呼び出されたときに、ブロックの内容を上書きします。
  ブロックコンテンツを結合する必要がある場合は、２回目に start を呼び出すときに
  ブロックコンテンツを取得 (fetch) するか、もしくは ``append()`` で追加するモードを
  使用する必要があります。
- ``View::prepend()`` は、もはやキャプチャーモードを持っていません。
- ``View::startIfEmpty()`` は削除されました。
  start() がいつも startIfEmpty を上書きするので、目的は全然かないません。
- ``View::$Helpers`` は削除されました。 ``_helpers`` に置き換えられました。
  実行時にヘルパーをロードする必要がある場合は、あなたのビューファイルに
  ``$this->addHelper()`` を使用する必要があります。
- ``View`` は、テンプレートが存在しない時に ``MissingViewException`` の代わりに
  ``Cake\View\Exception\MissingTemplateException`` を発生させます。 

ViewBlock
---------

- ``ViewBlock::append()`` は削除されました。代わりに
  :php:meth:`Cake\\View\ViewBlock::concat()` を使用してください。
  ですが、 ``View::append()`` はまだ存在します。

JsonView
--------

- デフォルトでは、JSON データは、エンコードされた HTML エンティティを持つことになります。
  これは、JSON ビューのコンテンツが HTML ファイルに埋め込まれている場合、XSS が生じる
  問題を防ぐことができます。
- :php:class:`Cake\\View\\JsonView` は、 ``_jsonOptions`` ビュー変数をサポートします。
  これは JSON を生成するときに使用されるビットマスクオプションを設定することができます。

XmlView
-------

- :php:class:`Cake\\View\\XmlView` は、 ``_xmlOptions`` ビュー変数をサポートします。
  これは、XML を生成するときに使用されるオプションを設定することができます。

View\\Helper
============

- ``$settings`` は ``$_config`` と呼ばれ、 ``config()`` メソッドを介してアクセスする
  必要があります。
- 設定オプションは、もはや public プロパティとして設定されていません。
- ``Helper::clean()`` は削除されました。
  完全に XSS を防止するのに十分なほど堅牢ではありませんでした。
  代わりに :php:func:`h` や htmlPurifier のような専用のライブラリを使用して、
  内容をエスケープする必要があります。
- ``Helper::output()`` は削除されました。このメソッドは、2.x の中で非推奨でした。
- メソッド ``Helper::webroot()``, ``Helper::url()``, ``Helper::assetUrl()``,
  ``Helper::assetTimestamp()`` は :php:class:`Cake\\View\\Helper\\UrlHelper`
  ヘルパーに移動しました。 ``Helper::url()`` は
  :php:meth:`Cake\\View\\Helper\\UrlHelper::build()` として利用できます。
- 非推奨のプロパティへのマジックアクセサが削除されました。
  次のプロパティは、request オブジェクトからアクセスする必要があります。

  - base
  - here
  - webroot
  - data
  - action
  - params


Helper
------

ヘルパーは、以下のメソッドが削除されました。

* ``Helper::setEntity()``
* ``Helper::entity()``
* ``Helper::model()``
* ``Helper::field()``
* ``Helper::value()``
* ``Helper::_name()``
* ``Helper::_initInputField()``
* ``Helper::_selectedArray()``

これらのメソッドは、FormHelper のでのみ使用部分、および長い間に問題があることが
明らかになった永続フィールドの機能の一部でした。FormHelper は、もはやこれらのメソッドに
依存しておらず、これらが提供する複雑さはもう必要ありません。

以下のメソッドが削除されました。

* ``Helper::_parseAttributes()``
* ``Helper::_formatAttribute()``

これらのメソッドは、ヘルパーが頻繁に使用する ``StringTemplate`` クラスで見つけることが
できます。独自のヘルパーに文字列テンプレートを統合する簡単な方法は、
``StringTemplateTrait`` を参照してください。

FormHelper
----------

FormHelper は、3.0 のために完全に書き直されました。
これは、いくつかの大きな変更が特徴的です。

* FormHelper は、新しい ORM で動作します。
  しかし、他の ORM またはデータソースと統合するための拡張可能なシステムを持っています。
* FormHelper は、新しいカスタム入力ウィジェットを作成し、組み込みのウィジェットを
  増強することを可能にする拡張可能なウィジェットのシステムを採用しています。
* 文字列テンプレートはヘルパーの基礎となっています。
  どこでも一緒に配列を操作する代わりに、 FormHelper で生成される HTML のほとんどは、
  テンプレートセットを使用して、中心的な一か所でカスタマイズすることができます。

これらの大きな変更に加えて、いくつかの小さな破壊的な変更もなされています。
これらの変更は、FormHelper の HTML 生成を合理化し、過去にあった問題を軽減します。

- ``data[`` プレフィックスは、生成されたすべての入力から削除されました。
  プレフィックスはもう本当の目的を果たしていません。
- ``text()``, ``select()`` のような様々なスタンドアロンの入力メソッドは、もはや
  id 属性を生成しません。
- ``inputDefaults`` オプションは ``create()`` から削除されました。
- ``create()`` のオプション ``default`` と ``onsubmit`` が削除されました。
  代わりに、JavaScript イベントバインドを使用するか、 ``onsubmit`` に必要なすべての
  js コードを設定する必要があります。
- ``end()`` は、もはやボタンを作ることはできません。
  ``button()`` や ``submit()`` でボタンを作成する必要があります。
- ``FormHelper::tagIsInvalid()`` は削除されました。
  代わりに ``isFieldError()`` を使用してください。
- ``FormHelper::inputDefaults()`` は削除されました。
  ``templates()`` を使って FormHelper のテンプレートを定義/増強することができます。
- ``wrap`` と ``class`` オプションは ``error()`` メソッドから削除されました。
- ``showParents`` オプションが select() から削除されました。
- ``div`` 、 ``before`` 、 ``after`` 、 ``between`` および ``errorMessage``
  オプションは、 ``input()`` から削除されました。
  包んでいる HTML を更新するためにテンプレートを使用することができます。
  ``templates`` オプションでは、一つの input のためにロードされたテンプレートを
  上書きすることができます。
- ``separator`` 、 ``between`` 、および ``legend`` オプションは、 ``radio()``
  から削除されました。包んでいる HTML を変更するためにテンプレートを使用することができます。
- ``format24Hours`` パラメータは、 ``hour()`` から削除されました。
  これは、 ``format`` オプションに置き換えられました。
- ``minYear`` と ``maxYear`` パラメータは、 ``year()`` から削除されました。
  これらのパラメータの両方は、現在のオプションとして提供することができます。
- ``dateFormat`` と ``timeFormat`` パラメータは、 ``datetime()`` から削除されました。
  入力が表示されるべき順序を定義するためにテンプレートを使用することができます。
- ``submit()`` が持っていた ``div``, ``before`` および ``after`` オプションは
  削除されました。この内容を変更するために ``submitContainer`` テンプレートを
  カスタマイズすることができます。
- ``inputs()`` メソッドは、もはや ``$fields`` パラメータの中で
  ``legend`` や ``fieldset`` を受け付けません。
  ``$options`` パラメータを使用してください。
  ``$fields`` パラメータは配列です。
  ``$blacklist`` は、削除されました。その機能は、 ``$fields`` パラメータの中で
  ``'field' => false`` を指定することで置き換えられます。
- ``inline`` パラメータは、postLink() メソッドから削除されました。
  代わりに、 ``block`` オプションを使用する必要があります。
  ``block => true`` を設定すると、以前の動作をエミュレートします。
- ISO 8601 に準拠して、 ``hour()`` 、 ``time()`` および ``dateTime()`` の
  ``timeFormat`` パラメータは、デフォルトが 24 です。
- :php:meth:`Cake\\View\\Helper\\FormHelper::postLink()` の引数
  ``$confirmMessage`` は、削除されました。
  メッセージを指定するために ``$options`` にキー ``confirm`` を使用する必要があります。
- チェックボックスとラジオ入力タイプは、デフォルトでラベル要素の *内側* にレンダリングされます。
  これは、 `Bootstrap <http://getbootstrap.com/>`_ や
  `Foundation <http://foundation.zurb.com/>`_ のような人気の CSS ライブラリとの
  互換性を高めることに役立ちます。
- テンプレートタグは、すべてキャメルバックです。3.0 より前のタグ
  ``formstart`` 、 ``formend`` 、 ``hiddenblock`` と ``inputsubmit`` が
  ``formStart`` 、 ``formEnd`` 、 ``hiddenBlock`` と ``inputSubmit`` になりました。
  あなたのアプリケーションでカスタマイズされている場合は、それらを変更してください。

3.0 の FormHelper の使用方法の詳細については、 :doc:`/views/helpers/form`
ドキュメントを確認することをお勧めします。

HtmlHelper
----------

- ``HtmlHelper::useTag()`` は削除されました。代わりに ``tag()`` を使用してください。
- ``HtmlHelper::loadConfig()`` は削除されました。タグのカスタマイズは、
  ``templates()`` や ``templates`` 設定を使用して行うことができます。
- ``HtmlHelper::css()`` の第２引数 ``$options`` は、出力内容として配列を
  必要とします。
- ``HtmlHelper::style()`` の最初の引数 ``$data`` は、出力内容として配列を必要とします。
- ``inline`` パラメータは、meta(), css(), script(), scriptBlock() メソッドから
  削除されました。代わりに、 ``block`` オプションを使用する必要があります。
  ``block => true`` を設定すると、以前の動作をエミュレートします。
- ``HtmlHelper::meta()`` の ``$type`` は文字列です。
  追加オプションは、 ``$options`` として渡すことができます。
- ``HtmlHelper::nestedList()`` の ``$options`` は配列です。
  タグタイプのための第４引数は削除され、 ``$options`` 配列に含まれています。
- :php:meth:`Cake\\View\\Helper\\HtmlHelper::link()` の引数 ``$confirmMessage``
  は削除されました。これで、メッセージを指定するために ``$options`` にキー ``confirm``
  を使用する必要があります。

PaginatorHelper
---------------

- ``link()`` は削除されました。
  それは、もはや内部ヘルパーによって使用されませんでした。
  それは、ユーザーランドのコードでの利用率は低く、もはやヘルパーの目標に適合していません。
- ``next()`` は、もはや 'class', もしくは 'tag' オプションを持ちません。
  それは、もはや disabled 引数はありません。代わりにテンプレートが使用されます。
- ``prev()`` は、もはや 'class', もしくは 'tag' オプションを持ちません。
  それは、もはや disabled 引数はありません。代わりにテンプレートが使用されます。
- ``first()`` は、もはや 'after', 'ellipsis', 'separator', 'class', または 'tag'
  オプションを持ちません。
- ``last()`` は、もはや 'after', 'ellipsis', 'separator', 'class', または 'tag'
  オプションを持ちません。
- ``numbers()`` は、もはや 'separator', 'tag', 'currentTag', 'currentClass',
  'class', 'tag', 'ellipsis' オプションを持ちません。
  これらのオプションは、テンプレートによって容易に実現できます。
  ``$options`` パラメータは配列です。
- ``%page%`` スタイルのプレースホルダーは、
  :php:meth:`Cake\\View\\Helper\\PaginatorHelper::counter()` から削除されました。
  代わりに ``{{page}}`` スタイルのプレースホルダを使用してください。
- ``url()`` は ``generateUrl()`` に、メソッド宣言の衝突を避けるために名前が変更されました。

デフォルトでは、すべてのリンクと非アクティブなテキストは、 ``<li>`` 要素でラップされています。
これは、CSS の記述を容易にするのに役立ち、人気 CSS フレームワークとの互換性を改善します。

それぞれのメソッドでさまざまなオプションの代わりに、テンプレート機能を使用する必要があります。
テンプレートを使用する方法については、:ref:`paginator-templates` ドキュメントをご覧ください。

TimeHelper
----------

- ``TimeHelper::__set()``, ``TimeHelper::__get()``, および
  ``TimeHelper::__isset()`` は削除されました。
  これらは非推奨な属性のためのマジックメソッドでした。
- ``TimeHelper::serverOffset()`` は削除されました。
  それは間違った時間数学習慣を促進しました。
- ``TimeHelper::niceShort()`` は削除されました。

NumberHelper
------------

- :php:meth:`NumberHelper::format()` の ``$options`` は配列です。

SessionHelper
-------------

- ``SessionHelper`` は非推奨になりました。
  ``$this->request->session()`` を直接使用してください。
  フラッシュメッセージ機能は代わりに :doc:`/views/helpers/flash` に移動されました。


JsHelper
--------

- ``JsHelper`` と関連するすべてのエンジンが削除されました。
  選択したライブラリのための JavaScript コードの非常に小さなサブセットを生成するだけで、
  すべての JavaScript コードをヘルパーを使用して生成しようとして、よく障害になっていました。
  直接お好みの JavaScript ライブラリを使用することをお勧めします。

CacheHelper の削除
-------------------

CacheHelper は削除されました。それが提供するキャッシュ機能は、HTML 以外のレイアウトや
データビューでは、非標準で、制限され、互換性がありませんでした。
これらの制限は、すべての再構築が必要でること意味していました。
エッジサイド・インクルードは、CacheHelper 機能を実装するための標準的な方法になります。
しかし、PHP で `エッジサイド・インクルード
<http://en.wikipedia.org/wiki/Edge_Side_Includes>`_ を実装することは、
多くの制限およびエッジケースがあります。出来損ないのソリューションを構築する代わりに、
開発者が必要とする `Varnish <http://varnish-cache.org>`_ や
`Squid <http://squid-cache.org>`_ を使ったすべてのレスポンスのキャッシュをお勧めします。

I18n
====

国際化サブシステムは完全に書き直されました。一般的に、 ``__()`` 関数ファミリーを
使用している場合は、確実に前のバージョンと同じ振る舞いを期待できます。 

内部的には、 ``I18n`` クラスは ``Aura\Intl`` を使用し、適切なメソッドは、
このライブラリの特定の機能にアクセスするために用意されています。
このため ``I18n`` 内部のほとんどのメソッドが削除または名前が変更されました。

``ext/intl`` も使用しているため、L10n クラスが完全に削除されました。
これは、PHP の ``Locale`` クラスから利用可能なデータと比較して時代遅れで不完全なデータを
提供していました。

デフォルトのアプリケーションの言語は、もはやブラウザが受け付ける言語や、ブラウザセッションで
設定された ``Config.language`` 値を有することにより、自動的に変更されません。
しかしながら、ブラウザによって送信された ``Accept-Language`` ヘッダから自動言語切り替えを
取得するには、ディスパッチャのフィルタを使用することができます。 ::

    // In config/bootstrap.php
    DispatcherFactory::addFilter('LocaleSelector');

自動的にユーザセッションに値を設定することで言語を選択するための組み込みの置換はありません。

翻訳されたメッセージのデフォルトのフォーマット関数は、もはや ``sprintf`` ではなく、
より高度で機能豊富な ``MessageFormatter`` クラスです。
一般的に、次のようにメッセージ内のプレースホルダを書き換えることができます。 ::

    // Before:
    __('Today is a %s day in %s', 'Sunny', 'Spain');

    // After:
    __('Today is a {0} day in {1}', 'Sunny', 'Spain');

古い ``sprintf`` フォーマッタを使用して、あなたのメッセージの書き換えを避けることができます。 ::

    I18n::defaultFormatter('sprintf');

また、 ``Config.language`` 値は削除されて、もはやアプリケーションの現在の言語を
制御するために使用することができません。
代わりに、 ``I18n`` クラスを使用することができます。 ::

    // Before
    Configure::write('Config.language', 'fr_FR');

    // Now
    I18n::locale('en_US');

- 以下のメソッドが移動されました：

    - ``Cake\I18n\Multibyte::utf8()`` から ``Cake\Utility\Text::utf8()`` へ
    - ``Cake\I18n\Multibyte::ascii()`` から ``Cake\Utility\Text::ascii()`` へ
    - ``Cake\I18n\Multibyte::checkMultibyte()`` から ``Cake\Utility\Text::isMultibyte()`` へ

- CakePHP は mbstring 拡張モジュールを必要とするので、 ``Multibyte`` クラスは
  削除されました。
- CakePHP 全体のエラーメッセージは、もはや国際化機能を介して渡されません。
  これは、CakePHP の内部を簡略化し、オーバーヘッドを削減するために行われました。
  これまで、実際に翻訳されたメッセージに直面している開発者はめったにいませんので、
  余分なオーバーヘッドの割に、とても小さな利益しか得られません。

L10n
====

- :php:class:`Cake\\I18n\\L10n` のコンストラクタは
  :php:class:`Cake\\Network\\Request` インスタンスを引数として受け取ります。


テスト
=======

- ``TestShell`` は削除されました。CakePHP、アプリケーションのスケルトン、
  および新たに bake したプラグインのテストを実行するためにすべて ``phpunit`` を使用します。
- webrunner (webroot/test.php) は削除されました。
  2.x の最初のリリース以来、CLI の採用が大幅に増加しています。
  加えて、CLIランナーは、IDEや他の自動化ツールの持つ優れた統合を提供しています。

  ブラウザからテストを実行する方法が必要だとあなた自身理解している場合は、
  `VisualPHPUnit <https://github.com/NSinopoli/VisualPHPUnit>`_ を試してください。
  これは、古い webrunner 以上に多くの追加機能を提供しています。
- ``ControllerTestCase`` は非推奨で、CakePHP 3.0.0 で削除されます。
  代わりに、新しい :ref:`integration-testing` 機能を使用してください。
- フィクスチャは、今では複数形を使用して参照する必要があります。 ::

    // 以下の代わりに
    $fixtures = ['app.article'];

    // 以下を使用してください。
    $fixtures = ['app.articles'];

ユーティリティ
===============

Set クラスの削除
-----------------

Set クラスは、削除されました。代わりに Hash クラスを使用する必要があります。

Folder & File
-------------

フォルダとファイルのクラスの名前が変更されました。

- ``Cake\Utility\File`` は :php:class:`Cake\\Filesystem\\File` に名前が変更されました。
- ``Cake\Utility\Folder`` は :php:class:`Cake\\Filesystem\\Folder` に名前が変更されました。

Inflector
---------

- :php:meth:`Cake\\Utility\\Inflector::slug()` の引数 ``$replacement`` の
  デフォルト値が アンダースコア (``_``) からダッシュ (``-``) に変更されました。
  URL で単語を区切るためにダッシュを使用することは一般的な選択であり、また、
  Google が推奨します。

- :php:meth:`Cake\\Utility\\Inflector::slug()` の文字変換は変更されました。
  独自の文字変換を使用する場合は、コードを更新する必要があります。
  正規表現の代わりに、文字変換は単純な文字列の置換を使用しています。
  これは、大幅なパフォーマンス向上をもたらした。 ::

    // 以下の代わりに
    Inflector::rules('transliteration', [
        '/ä|æ/' => 'ae',
        '/å/' => 'aa'
    ]);

    // 以下を使用してください。
    Inflector::rules('transliteration', [
        'ä' => 'ae',
        'æ' => 'ae',
        'å' => 'aa'
    ]);

- 複数形と単数化のための語尾変化無し・不規則変化の規則の別々のセットが削除されました。
  代わりに、それぞれのための共通のリストを持っています。
  'singular' (単数) や 'plural' (複数) タイプで
  :php:meth:`Cake\\Utility\\Inflector::rules()` を使う時、もはや
  ``$rules`` 引数配列中の 'uninflected' や 'irregular' のようなキーは使用できません。

:php:meth:`Cake\\Utility\\Inflector::rules()` を使用する際、 ``$type`` 引数に
'uninflected' や 'irregular' の値を使用することによって、語尾変化無し・不規則変化の規則の
リストを追加や上書きすることができます。

Sanitize
--------

- ``Sanitize`` クラスが削除されました。

Security
--------

- ``Security::cipher()`` は削除されました。
  それは安全ではく悪い暗号慣行を促進しました。
  代わりに :php:meth:`Security::encrypt()` を使用してください。
- 設定値 ``Security.cipherSeed`` は不要になります。
  ``Security::cipher()`` の削除にともない、その設定は使用されなくなりました。
- CakePHP 2.3.1 以前に暗号化された値のための
  :php:meth:`Cake\\Utility\\Security::rijndael()` の後方互換性は削除されました。
  移行前に ``Security::encrypt()`` とCakePHP 2.x の最新のバージョンを使って値を
  再暗号化する必要があります。
- blowfish ハッシュを生成する機能が削除されました。
  ``Security::hash()`` で "blowfish" 型は使用できません。
  blowfish ハッシュの生成と検証をするためには、PHP の `password_hash()` と
  `password_verify()` を使用する必要があります。
  CakePHP と一緒にインストールされる互換ライブラリ `ircmaxell/password-compat
  <https://packagist.org/packages/ircmaxell/password-compat>`_ は、 
  PHP < 5.5 のためにこれらの機能を提供します。
- データの暗号化/復号化する場合、OpenSSL は mcrypt より優先的に使用されます。
  この変更は、パフォーマンスが向上し、mcrypt のためのサポートを終了することで、
  ディストリビューションに対して CakePHP の将来の保証を提供します。
- ``Security::rijndael()`` は非推奨です。mycrypt を使用している場合のみ利用可能です。

.. warning::

    以前のバージョンの Security::encrypt() で暗号化されたデータは openssl の実装と
    互換性がありません。アップグレードするときに
    :ref:`mcrypt の実装を設定する <force-mcrypt>` 必要があります。

Time
----

- ``CakeTime`` は :php:class:`Cake\\I18n\\Time` に名前が変更されました。
- ``CakeTime::serverOffset()`` は削除されました。
  それは間違った時間数学習慣を促進しました。
- ``CakeTime::niceShort()`` は削除されました。
- ``CakeTime::convert()`` は削除されました。
- ``CakeTime::convertSpecifiers()`` は削除されました。
- ``CakeTime::dayAsSql()`` は削除されました。
- ``CakeTime::daysAsSql()`` は削除されました。
- ``CakeTime::fromString()`` は削除されました。
- ``CakeTime::gmt()`` は削除されました。
- ``CakeTime::toATOM()`` は ``toAtomString`` に名前が変更されました。
- ``CakeTime::toRSS()`` は ``toRssString`` に名前が変更されました。
- ``CakeTime::toUnix()`` は ``toUnixString`` に名前が変更されました。
- ``CakeTime::wasYesterday()`` は、メソッドの命名の残りの部分を一致させるために
  ``isYesterday`` に名前が変更されました。
- ``CakeTime::format()`` は、もはや ``sprintf`` フォーマット文字列を使用しません。
  代わりに ``i18nFormat`` を使用することができます。
- :php:meth:`Time::timeAgoInWords()` の ``$options`` は配列です。

Time はもう static メソッドのコレクションではありません、それはすべてのメソッドを
継承するために ``DateTime`` 型を拡張し、 ``intl`` 拡張の助けを借りて、
位置認識フォーマット関数が追加されます。

一般的には、このような式は::

    CakeTime::aMethod($date);

次のように書き換えることによって移行できます。 ::

    (new Time($date))->aMethod();

Number
------

Number ライブラリは、内部的に ``NumberFormatter`` クラスを使用するために書き換えられました。

- ``CakeNumber`` は :php:class:`Cake\\I18n\\Number` には前が変更されました。
- :php:meth:`Number::format()` の ``$options`` は配列です。
- :php:meth:`Number::addFormat()` は削除されました。
- ``Number::fromReadableSize()`` は
  :php:meth:`Cake\\Utility\\Text::parseFileSize()` に移動しました。

Validation
----------

- :php:meth:`Validation::range()` の範囲は ``$lower`` と ``$upper`` が与えられた場合、
  内包的になります。
- ``Validation::ssn()`` は削除されました。

Xml
---

- :php:meth:`Xml::build()` の ``$options`` は配列です。
- ``Xml::build()`` は、もはや URL を受け付けません。
  URL から XML ドキュメントを作成する必要がある場合、
  :ref:`Http\\Client <http-client-xml-json>` を使用してください。
