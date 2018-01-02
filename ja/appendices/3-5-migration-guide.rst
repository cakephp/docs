3.5 移行ガイド
##############

CakePHP 3.5 は、3.4 の API の完全上位互換です。
このページでは、3.5 の変更と改善についてのアウトラインを紹介します。

3.5.xにアップグレードするには、次のComposerコマンドを実行してください。

.. code-block:: bash

    php composer.phar require --update-with-dependencies "cakephp/cakephp:3.5.*"

非推奨
======

以下は、非推奨のメソッド、プロパティーと動作の一覧です。
これらの機能は、4.0.0 以後に削除されるまで機能し続けます。

* ``Cake\Http\Client\CookieCollection`` は非推奨です。
  代わりに ``Cake\Http\Cookie\CookieCollection`` を使用してください。
* ``Cake\View\Helper\RssHelper`` は非推奨です。
  使用されることがまれなため、RssHelperは非推奨です。
* ``Cake\Controller\Component\CsrfComponent`` は非推奨です。
  代わりに :ref:`csrf-middleware` を使用してください。
* ``Cake\Datasource\TableSchemaInterface`` は非推奨です。
  ``Cake\Database\TableSchemaAwareInterface`` を使用してください。
* ``Cake\Console\ShellDispatcher`` は非推奨です。アプリケーションでは
  ``Cake\Console\CommandRunner`` を代わりに使用するように更新してください。
* ``Cake\Database\Schema\TableSchema::column()`` は非推奨です。
  代わりに ``Cake\Database\Schema\TableSchema::getColumn()`` を使用してください。
* ``Cake\Database\Schema\TableSchema::constraint()`` は非推奨です。
  代わりに ``Cake\Database\Schema\TableSchema::getConstraint()`` を使用してください。
* ``Cake\Database\Schema\TableSchema::index()`` は非推奨です。
  代わりに ``Cake\Database\Schema\TableSchema::getIndex()`` を使用してください。

非推奨の複合 get / set メソッド
-------------------------------

過去には、CakePHP は get / set モードの両方を提供する 'モーダル' メソッドを
利用していました。これらのメソッドにより、IDE の自動補完や、
将来的に厳格な戻り値の型を追加する機能が複雑になります。
これらの理由から、複合 get / set メソッドは、個別の get および
set メソッドに分割されています。

推奨されなくなり、 ``getX()`` と ``setX()`` メソッドに置き換えられた
メソッドのリストを次に示します。

``Cake\Cache\Cache``
    * ``config()``
    * ``registry()``
``Cake\Console\Shell``
    * ``io()``
``Cake\Console\ConsoleIo``
    * ``outputAs()``
``Cake\Console\ConsoleOutput``
    * ``outputAs()``
``Cake\Database\Connection``
    * ``logger()``
``Cake\Database\TypedResultInterface``
    * ``returnType()``
``Cake\Database\TypedResultTrait``
    * ``returnType()``
``Cake\Database\Log\LoggingStatement``
    * ``logger()``
``Cake\Datasource\ModelAwareTrait``
    * ``modelType()``
``Cake\Database\Query``
    * ``valueBinder()`` の getter 部分 (今は ``getValueBinder()``)
``Cake\Database\Schema\TableSchema``
    * ``columnType()``
``Cake\Datasource\QueryTrait``
    * ``eagerLoaded()`` の getter 部分 (今は ``isEagerLoaded()``)
``Cake\Event\EventDispatcherInterface``
    * ``eventManager()``
``Cake\Event\EventDispatcherTrait``
    * ``eventManager()``
``Cake\Error\Debugger``
    * ``outputAs()`` (今は ``getOutputFormat()`` / ``setOutputFormat()``)
``Cake\Http\ServerRequest``
    * ``env()`` (今は ``getEnv()`` / ``withEnv()``)
    * ``charset()`` (今は ``getCharset()`` / ``withCharset()``)
``Cake\I18n\I18n``
    * ``locale()``
    * ``translator()``
    * ``defaultLocale()``
    * ``defaultFormatter()``
``Cake\ORM\Association\BelongsToMany``
    * ``sort()``
``Cake\ORM\LocatorAwareTrait``
    * ``tableLocator()``
``Cake\ORM\EntityTrait``
    * ``invalid()`` (今は ``getInvalid()``, ``setInvalid()``,
      ``setInvalidField()``, そして ``getInvalidField()``)
``Cake\ORM\Table``
    * ``validator()``
``Cake\Routing\RouteBuilder``
    * ``extensions()``
    * ``routeClass()``
``Cake\Routing\RouteCollection``
    * ``extensions()``
``Cake\TestSuite\TestFixture``
    * ``schema()``
``Cake\Utility\Security``
    * ``salt()``
``Cake\View\View``
    * ``template()``
    * ``layout()``
    * ``theme()``
    * ``templatePath()``
    * ``layoutPath()``
    * ``autoLayout()`` (今は ``isAutoLayoutEnabled()`` / ``enableAutoLayout()``)

振る舞いの変更
==============

以下の変更は、API 互換性はありますが、あなたのアプリケーションに影響を及ぼし得る
振る舞いのわずかな差異があります。

* ``BehaviorRegistry`` 、 ``HelperRegistry`` 及び ``ComponentRegistry`` では、
  未知のオブジェクト名で ``unload()`` が呼び出されたときに
  例外を発生させるようになりました。 この変更はタイポをより目立たせることで
  エラーを見つけやすくしています。
* ``HasMany`` は ``BelongsToMany`` と同様にアソシエーションのプロパティーに
  空の値が設定されても正常に処理します。つまり、空の配列と同じ方法で
  ``false`` 、 ``null`` 及び空の文字列を処理します。
  ``HasMany`` の場合、関連先の保存方法として ``replace`` が使用されているとき、
  関連するすべてのレコードが削除/リンク解除されます。
  その結果、フォームを使用して空の文字列を渡すことによって、
  関連するレコードをすべて削除/リンク解除することができます。
  これまではカスタムマーシャリングを作成する必要がありました。
* ``ORM\Table::newEntity()`` は 変換された関連付けレコードが
  ``dirty`` の場合にのみアソシエーションプロパティーに ``dirty`` を
  つけるようになりました。プロパティーを含まない関連エンティティーが作成される場合、
  空のレコードには永続化させるためのフラグはつきません。
* ``Http\Client`` はリクエストオブジェクトを作成するときに、
  ``cookie()`` の結果を使用しなくなりました。代わりに ``Cookie`` ヘッダーと
  ``CookieCollection`` が使用できます。
  これは、クライアントにカスタムHTTPアダプターを使用しているときにのみ影響があります。
* シェルを呼び出すときにサブコマンドに複数ワードを用いる場合、
  名前にはキャメルケースを使用する必要がありました。これからは
  アンダースコアでサブコマンドを呼び出すことができます。例えば、
  ``cake tool initMyDb`` は ``cake tool init_my_db`` と呼び出すことができます。
  あなたのシェルが変換規則の異なる2つのサブコマンドを用いていた場合は
  最後に関連付けた規則のコマンドだけが機能します。
* ``SecurityComponent`` はリクエストデータを持たないPOSTリクエストを破棄します。
  この変更はデータベースのデフォルト値のみを使用してレコードを作成するアクションを
  保護するのに役立ちます。
* ``Cake\ORM\Table::addBehavior()`` と ``removeBehavior()`` は ``$this`` を
  返すようになりました。これは、テーブルオブジェクトを
  流れるようなインターフェイスで定義するのに便利です。
* キャッシュエンジンは失敗または誤って構成されたときに例外を発生させなくなりました。
  代わりに、操作不能な ``NullEngine`` としてフォールバックさせます。フォールバックは
  エンジンごとに :ref:`設定 <cache-configuration-fallback>` することもできます。
* ``Cake\Database\Type\DateTimeType`` は以前からのフォーマットに加えて
  ISO-8859-1 でフォーマットされた日付文字列（例えば、 2017-07-09T12:33:00+00:02) を
  変換するようになりました。DateTimeTypeのサブクラスを作成している場合は
  コードを更新する必要があります。

新機能の追加
============

スコープ付きミドルウェア
------------------------

特定のURLスコープのルートに条件付きでミドルウェアを適用できるようになりました。
これにより、ミドルウェア内部でURLチェックコードを記述せずに、
アプリケーションのさまざまな部分に対応するミドルウェア層を構築できます。
詳しくは、 :ref:`connecting-scoped-middleware` をご覧ください。

新しいコンソールランナー
------------------------

3.5.0 では ``Cake\Console\CommandRunner`` が追加されました。このクラスは
``Cake\Console\CommandCollection`` とともに、CLI環境と新しい
``Application`` クラスを統合します。 ``Application`` クラスは
``console()`` フックを実装できるようになりました。これは、どのCLIコマンドが
公開されているか、それらがどのように命名されているか、シェルが
どのように依存関係を取得するかを完全に制御できます。この新しいクラスを採用するには
``bin/cake.php`` のファイルの内容を
`こちら <https://github.com/cakephp/app/tree/3.next/bin/cake.php>`_ の
ファイルに置き換える必要があります。

キャッシュエンジンフォールバック
--------------------------------

キャッシュエンジンは、 ``fallback`` キーを用いて定義できるようになりました。
このキーは処理エンジンが誤って設定されている場合(または使用できない場合)に
フォールバックを使用する構成を定義するものです。
詳しくは :ref:`cache-configuration-fallback` のフォールバックの設定をご覧ください。

アプリケーションのスケルトンに dotenv のサポートを追加
--------------------------------------------------------

アプリケーションのスケルトンに、「dotenv」の統合機能が追加されました。
これは、あなたのアプリケーションを環境変数を使用して構成することを容易にします。
詳しくは :ref:`environment-variables` の章をご覧ください。

コンソールの結合テスト
----------------------

``Cake\TestSuite\ConsoleIntegrationTestCase`` クラスが追加され、
コンソールアプリケーションの結合テストがより簡単になりました。
詳しくは、 :ref:`console-integration-testing` をご覧ください。
このテストクラスは、現在の ``Cake\Console\ShellDispatcher`` および
新たに追加された ``Cake\Console\CommandRunner`` と完全に互換性があります。

コレクション
------------

* ``Cake\Collection\Collection::avg()`` が追加されました。
* ``Cake\Collection\Collection::median()`` が追加されました。

コア
----

* ``Cake\Core\Configure::read()`` は、要求されたキーが存在しない場合に用いる
  デフォルト値をサポートするようになりました。
* ``Cake\Core\ObjectRegistry`` に、 ``Countable`` および
  ``IteratorAggregate`` インターフェースが実装されました。

コンソール
----------

* ``Cake\Console\ConsoleOptionParser::setHelpAlias()`` が追加されました。
  このメソッドを使用することで、ヘルプ出力を生成するときに使用される
  コマンド名を設定できます。デフォルトは ``cake`` です。
* ``Cake\Console\ShellDispatcher`` の代わりに ``Cake\Console\CommandRunnner`` が
  追加されました。
* アプリケーションが提供するコマンドラインツールを定義するための
  インターフェイスとして ``Cake\Console\CommandCollection`` が追加されました。

データベース
------------

* SQLiteドライバーに ``mask`` オプションが追加されました。このオプションは
  SQLiteデータベースファイルが作成されたときのアクセス権限の設定を可能にします。

データソース
------------

* ``Cake\Datasource\SchemaInterface`` オプションが追加されました。
* ``smallinteger`` と ``tinyinteger`` に新しい抽象型が追加されました。
  既存の ``SMALLINT`` 型と ``TINYINT`` 型がこれらの新しい抽象型として
  反映されるようになりました。 ``TINYINT(1)`` 型は、引き続きMySQLで
  boolean型として扱われます。
* ``Cake\Datasource\PaginatorInterface`` が追加されました。
  ``PaginatorComponent`` は、このインターフェイスを通してページネーションを
  取り扱うようになりました。これにより、他のORMと似た実装で
  コンポーネントによってページネーションをできるようになりました。
* ``Cake\Datasource\Paginator`` は ORM/Database のクエリーインスタンスを
  ページ制御するために追加されました。

イベント
--------

* ``Cake\Event\EventManager::on()`` と ``off()`` はチェーン実装可能になり、
  複数のイベントを一度に設定することが容易になりました。

Http
----

* 新たに ``Cookie`` と ``CookieCollection`` クラスが追加されました。
  これらのクラスを使用するとオブジェクト指向でクッキーを扱うことができます。
  また、これらは ``Cake\Http\ServerRequest`` 、 ``Cake\Http\Response`` 、
  ``Cake\Http\Client\Response`` で利用できます。
  詳しくは、 :ref:`request-cookies` と :ref:`response-cookies` をご覧ください。
* セキュリティヘッダーの適用が容易になる新しいミドルウエアが追加されました。
  詳しくは、 :ref:`security-header-middleware` をご覧ください。
* クッキーデータを透過的に暗号化する新しいミドルウェアが追加されました。
  詳しくは、 :ref:`encrypted-cookie-middleware` をご覧ください。
* CSRFに対する保護を容易にする、新しいミドルウェアが追加されました。
  詳しくは、 :ref:`csrf-middleware` をご覧ください。
* ``Cake\Http\Client::addCookie()`` が追加されました。
  これはクライアントインスタンスへのクッキー追加を容易にします。

インスタンス設定トレイト
------------------------

* ``InstanceConfigTrait::getConfig()`` は ``$default`` という
  第二引数を取るようになりました。もし特定の ``key`` に使用できる値がない場合、
  その ``$default`` の値が返却されます。

ORM
---

* ``Cake\ORM\Query::contain()`` は一つのアソシエーションが入る場合、
  ラッピング配列なしで呼び出すことができるようになり。つまり、
  ``contain('Comments', function (){ ... });`` で動作するようになります。
  この変更で ``leftJoinWith()`` や ``matching()`` のような、他の
  イーガーローディング関連のメソッドと ``contain()`` の一貫性を与えています。

ルーティング
------------

* ``Cake\Routing\Router::reverseToArray()`` が追加されました。
  このメソッドを使用することで、リクエストオブジェクトをURL文字列の生成に
  使用できる配列に変換できます。
* ``Cake\Routing\RouteBuilder::resources()`` に ``path`` オプションが追加されました。
  このオプションを使用するとコントローラー名に一致しないリソースパスを
  作ることができます。
* ``Cake\Routing\RouteBuilder`` に、特定のHTTPメソッドのルートを作成するメソッドが
  追加されました。例えば ``get()`` や ``post()`` が追加されています。
* ``Cake\Routing\RouteBuilder::loadPlugin()`` が追加されました。
* ``Cake\Routing\Route`` のオプション定義メソッドは
  流れるようなインターフェイスになりました。

TestSuite
---------

* ``TestCase::loadFixtures()`` は引数が与えられていないとき、
  すべてのフィクスチャーをロードするようになりました。
* ``IntegrationTestCase::head()`` が追加されました。
* ``IntegrationTestCase::options()`` が追加されました。
* ``IntegrationTestCase::disableErrorHandlerMiddleware()`` が追加されました。
  結合テストのデバッグがより簡単になりました。

バリデーション
--------------

* ``Cake\Validation\Validator::scalar()`` は、フィールドが非スカラー型データを
  取得しないことを保証するために追加されました。
* ``Cake\Validation\Validator::regex()`` が追加されました。
  正規表現パターンでのデータ検証を今までより便利にします。
* ``Cake\Validation\Validator::addDefaultProvider()`` が追加されました。
  このメソッドでアプリケーションで作成されたすべてのバリデーターに
  バリデーションプロバイダーを挿入できます。
* ``Cake\Validation\ValidatorAwareInterface`` が追加されました。
  これは、 ``Cake\Validation\ValidatorAwareTrait`` によって実装されるメソッドを
  定義します。

View
----

* ``Cake\View\Helper\PaginatorHelper::limitControl()`` が追加されました。
  このメソッドを使用すると、ページネートされた結果セットのlimit値を
  更新するセレクトボックスのフォームを作ることができます。
