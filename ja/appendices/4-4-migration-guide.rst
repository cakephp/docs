4.4 移行ガイド
###################

CakePHP 4.4 は 4.0 からのAPI互換アップグレードです。
このページでは、4.4で追加された非推奨事項と機能の概要を説明します。

4.4.0へのアップグレード
=======================

CakePHP 4.4.0にアップグレードするには、次の Composer コマンドを実行してください。::

    php composer.phar require --update-with-dependencies "cakephp/cakephp:^4.4"

.. note::
    CakePHP 4.4を動作させるには、PHP 7.4以上が必要です。

非推奨
============

4.4では、いくつかの非推奨機能が導入されています。
これらの機能はすべて 4.x の間は継続されますが、5.0 で削除されます。

Controller
----------

- ``Controller::paginate()`` の ``paginator`` オプションは非推奨です。
  代わりに、 ``className`` を使用してください。
- ``PaginatorComponent`` の ``paginator`` オプションは非推奨です。
  代わりに、 ``className`` を使用してください。

Datasource
----------

- ``FactoryLocator::add()`` はもはやクロージャ・ファクトリ関数を受け付けません。
  代わりに ``LocatorInterface`` のインスタンスを渡さなければなりません。
- ``Cake\Datasource\Paging\Paginator`` は ``Cake\Datasource\Paging\NumericPaginator`` に名称変更されました。

ErrorHandler & ConsoleErrorHandler
----------------------------------

``ErrorHandler`` と ``ConsoleErrorHandler`` クラスは、非推奨となりました。
これらのクラスは、新しい ``ExceptionTrap`` と ``ErrorTrap`` クラスに置き換わりました。
トラップクラスは、より拡張可能で一貫性のあるエラーおよび例外処理フレームワークを提供します。
新しいシステムにアップグレードするためには、（例えば ``config/bootstrap.php`` 中の）
``ErrorHandler`` と ``ConsoleErrorHandler`` の使い方を以下のように置き換えることができます。::

    use Cake\Error\ErrorTrap;
    use Cake\Error\ExceptionTrap;

    (new ErrorTrap(Configure::read('Error')))->register();
    (new ExceptionTrap(Configure::read('Error')))->register();

より詳細なドキュメントについては、 :doc:`/development/errors` を参照してください。
さらに、非推奨のエラー処理システムに関連する以下のメソッドも非推奨となります。:

* ``Debugger::outputError()``
* ``Debugger::getOutputFormat()``
* ``Debugger::setOutputFormat()``
* ``Debugger::addFormat()``
* ``Debugger::addRenderer()``
* ``ErrorLoggerInterface::log()``。 代わりに ``logException()`` を実装してください。
* ``ErrorLoggerInterface::logMessage()``。 代わりに ``logError()`` を実装してください。

RequestHandlerComponent
------------------------

``RequestHandlerComponent`` はゆるやかに非推奨になりました。
``AuthComponent`` のように ``RequestHandler`` を使用しても、ランタイム非推奨にはなりませんが、
5.0では削除される **予定** です。

- ``accepts()`` を ``$this->request->accepts()`` に置き換えてください。
- ``requestedWith()`` をカスタムリクエスト検出器に置き換えてください。
  (例えば、 ``$this->request->is('json')`` など)
- ``prefers()`` を ``ContentTypeNegotiation`` に置き換えてください。
  :ref:`controller-viewclasses` を参照してください。
- ``renderAs()`` を ``Controller`` のコントローラコンテンツネゴシエーション機能に置き換えてください。
- ``checkHttpCache`` オプションを :doc:`/controllers/components/check-http-cache` に置き換えてください。
- ``RequestHandlerComponent`` でビュークラスマッピングを定義する代わりに、 :ref:`controller-viewclasses`
  を使用してください。

PaginatorComponent
------------------

``PaginatorComponent`` は非推奨で、5.0で削除される予定です。
必要なページング設定を行うには、 ``Controller::$paginate`` プロパティ、
または ``Controller::paginate()`` メソッドの ``$settings`` パラメータを使用します。

ORM
---

- ``SaveOptionsBuilder`` は非推奨となりました。代わりにオプション配列を使用してください。

プラグイン
----------

- プラグインクラス名は、プラグイン名に "Plugin" サフィックスを付加したものと一致するようになりました。
  例えば、"ADmad/I18n" のプラグインクラスは、``ADmad\I18n\Plugin`` ではなく、
  ``ADmad\I18n\I18nPlugin`` となります。CakePHP 4.3以降のときと同様です。
  後方互換性のため、旧スタイルの名前も引き続きサポートされます。

TestSuite
---------

- ``ConsoleIntegrationTestTrait`` は、
  cakephp/cakephp パッケージ全体を必要とせずにコンソールアプリケーションをテストできるように、
  依存関係とともに console パッケージに移動されました。

  - ``Cake\TestSuite\ConsoleIntegrationTestTrait`` は ``Cake\Console\TestSuite\ConsoleIntegrationTestTrait`` に移動しました。
  - ``Cake\TestSuite\Constraint\Console\*`` は ``Cake\Console\TestSuite\Constraint\*`` に移動しました。
  - ``Cake\TestSuite\Stub\ConsoleInput`` は ``Cake\Console\TestSuite\StubConsoleInput`` に移動しました。
  - ``Cake\TestSuite\Stub\ConsoleOutput`` は ``Cake\Console\TestSuite\StubConsoleOutput`` に移動しました。
  - ``Cake\TestSuite\Stub\MissingConsoleInputException`` は ``Cake\Console\TestSuite\MissingConsoleInputException`` に移動しました。

- ``ContainerStubTrait`` は、
  cakephp/cakephp パッケージ全体を必要とせずにコンソールアプリケーションをテストできるように、
  core パッケージに移動されました。

  - ``Cake\TestSuite\ContainerStubTrait`` は ``Cake\Core\TestSuite\ContainerStubTrait`` に移動しました。

- ``HttpClientTrait`` は、
  cakephp/cakephp パッケージ全体を必要とせずにhttpアプリケーションをテストできるように、
  http パッケージに移動されました。

  - ``Cake\TestSuite\HttpClientTrait`` は ``Cake\Http\TestSuite\HttpClientTrait`` に移動しました。

Behaviorの変更
==============

以下の変更は、どのメソッドのシグネチャも変更しませんが、
メソッドのセマンティクスや動作は変更します。

ORM
---

* ``Table::saveMany()`` は、まだ 'dirty' で、オリジナルのフィールド値を含むエンティティで
  ``Model.afterSaveCommit`` イベントをトリガーするようになりました。
  これは ``Model.afterSaveCommit`` のイベントペイロードを ``Table::save()`` と一致させるためのものです。

Routing
-------

* ``Router::parseRequest()`` は、クライアントが無効な HTTP メソッドを使用した場合に、
  ``InvalidArgumentException`` の代わりに ``BadRequestException`` を発生させるようになりました。

新機能
======

Cache
-----

* ``RedisEngine`` は ``deleteAsync()`` と ``clearBlocking()`` メソッドをサポートするようになりました。
  これらのメソッドは、Redis の ``UNLINK`` オペレーションを使用して、
  後で Redis が削除できるようにデータをマークします。


Command
-------

* ``bin/cake routes`` は、ルートテンプレート内の衝突をハイライトするようになりました。
* ``Command::getDescription()`` では、カスタムの説明文を設定することができます。:ref:`console-command-description` を参照してください。

Controller
----------

* ``Controller::viewClasses()`` が追加されました。
  このメソッドは、コンテントタイプネゴシエーションを行う必要があるコントローラで実装する必要があります。
  ビュークラスは、content-type ネゴシエーションに参加するために、
  静的メソッド ``contentType()`` を実装する必要があります。

Database
--------

* ``SQLite`` ドライバが PHP8.1+ でメモリ内共有データベースをサポートするようになりました。
* ``Query::newExpr()`` の代わりに ``Query::expr()`` が追加されました。
* ``QueryExpression::case()`` ビルダーは、``CakeDatabaseTypedResultInterface`` を実装した
  ``then()`` と ``else()`` に渡す式からの型推定をサポートするようになりました。

Error
-----

* ``ErrorTrap`` と ``ExceptionTrap`` が追加されました。
  これらのクラスは、アプリケーションのための最新のエラー処理システムの基礎を形成しています。
  詳しくは :doc:`/development/errors` をご覧ください。

Http
----

* ``BaseApplication::handle()`` は、 ``$request`` を
  常にサービスコンテナに追加するようになりました。
* ``HttpsEnforcerMiddleware`` に ``hsts`` オプションが追加され、
  ``Strict-Transport-Security`` ヘッダーを設定することができるようになりました。

Mailer
------

* ``Mailer`` が ``autoLayout`` 設定を受け付けるようになり、
  ``false`` を設定することで ``ViewBuilder`` での自動レイアウトを無効にできるようになりました。

ORM
---

* ``TreeBehavior`` に ``cascadeCallbacks`` オプションが追加されました。
  このオプションを有効にすると、 ``TreeBehavior`` は ``find()`` の結果をイテレートして、個別にレコードを削除するようになります。
  これにより、ツリーノードを削除する際に ORM コールバックを使用することができるようになります。

Routing
-------

* ``RoutingMiddleware`` は、マッチした ``Route`` インスタンスに "route" リクエスト属性を
  設定するようになりました。

View
----

* ``View::contentType()`` が追加されました。
  ビューは、content-typeネゴシエーションに参加するために、このメソッドを実装する必要があります。
* ``View::TYPE_MATCH_ALL`` が追加されました。
  この特別なcontent-typeにより、content-typeネゴシエーションがマッチしない場合のフォールバックビューを構築することができます。
