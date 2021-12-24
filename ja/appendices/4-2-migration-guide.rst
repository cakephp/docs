4.2 移行ガイド
##############

CakePHP 4.2 は 4.0 からのAPI互換アップグレードです。
このページでは、4.2で追加された非推奨事項と機能の概要を説明します。

4.2.0へのアップグレード
=======================

CakePHP 4.2.0にアップグレードするには、次の Composer コマンドを実行してください。::

    php composer.phar require --update-with-dependencies "cakephp/cakephp:4.2.x"

非推奨
============

4.2では、いくつかの非推奨機能が導入されています。
これらの機能はすべて 4.x の間は継続されますが、5.0 で削除されます。
非推奨機能の更新を自動化するには、`upgrade tool <upgrade-tool-use>` を使用します。::

    bin/cake upgrade rector --rules cakephp42 <path/to/app/src>

.. note::
    これはCakePHP 4.2の変更点のみを更新します。CakePHP 4.1の変更を最初に適用していることを確認してください。

パスごとに非推奨を無効にするための新しい設定オプションが追加されました。
詳細は `deprecation-warnings` を参照してください。

Core
----

- ``Exception::responseHeader()`` は非推奨になりました。
  HTTP のレスポンスヘッダを設定するには ``HttpException::setHeaders()`` を使用しなければなりません。
  レスポンスヘッダを設定するアプリケーションやプラグインの例外は ``HttpException`` のサブクラスに更新する必要があります。
- ``Cake\Core\Exception\Exception`` は
  ``Cake\Core\Exception\CakeException`` に名前が変更されました。

Database
--------

- ``Cake\Database\Exception`` は ``Cake\Database\Exception\DatabaseException`` に名前が変更されました。

ORM
---

- ``TableLocator::allowFallbackClass()`` が追加されました。
  このメソッドは、自動的に生成されるフォールバックテーブルクラスを無効にします。
  現在は無効にすることがオプトインされていますが、将来的にはデフォルトになります。
- ``ORM\Behavior::getTable()`` は非推奨になりました。
  代わりに、``table()`` を使用してください。
  この変更により、``ORM\Table`` 間でメソッドの戻り値が異なるようになったため、メソッド名も異なるものになりました。

Behaviorの変更
==============

以下の変更はどのメソッドのシグネチャも変更しませんが、メソッドのセマンティクスや動作を変更します。

Collection
----------

- ``Collection::groupBy()`` と ``Collection::indexBy()`` は、パスが存在しない場合や
  パスに NULL 値が含まれている場合に例外をスローするようになりました。
  null をサポートする必要がある場合は、コールバックを使用してデフォルト値を返すようにしました。

Controller
----------

- ``Controller::$components`` は protected になりました。
  以前は protected として文書化されていました。
  これは、実装で可視性を public に変更できるため、ほとんどのアプリケーションコードに影響を与えることはないはずです。

Component
---------

- ``FlashComponent::set()`` を ``Exception`` インスタンスと一緒に使用する場合、
  デフォルトで ``element`` オプションを ``error`` に設定するようになりました。

Database
--------

- ``TimeType`` は ``H:i`` 形式の値を正しくマーシャルするようになりました。
  ※以前は、これらの値はバリデーション実行後に ``null`` にキャストされていました。

Error
-----

- 例外コードは ``HttpException`` の HTTP ステータスコードとしてのみ使用されるようになりました。
  その他の例外で 500 以外の値を返すHTTPコードは ``ExceptionRenderer::$exceptionHttpCodes`` によって制御されます。

  .. note::
      例外が更新されるまで以前の動作に戻す必要がある場合は、
      カスタムの ExceptionRenderer を作成して ``getHttpCode()`` 関数をオーバーライドすることができます。
      詳細は `custom-exceptionrenderer` を参照してください。

- ``ConsoleErrorHandler`` は例外コードを ``ConsoleException`` の終了コードとしてのみ使用するようになりました。

Validation
----------

- ``Validation::time()`` は、分がない場合に文字列を拒否するようになりました。
  ※以前は時間のみの数字を受け付けていましたが、APIのドキュメントでは分が必要だと示されていました。

破壊的変更
==========

API の背後に、対応が必要ないくつかの破壊的変更があります。
これらの変更は通常、テストにのみ影響します。

I18n
----
- `Aura.Intl <https://github.com/auraphp/Aura.Intl>`_ パッケージへの依存性は、もはやメンテナンスされていないため削除されました。
  アプリ/プラグインが :ref:`custom translation loaders <creating-generic-translators>` を持っている場合、
  ``Aura\Intl\Package`` の代わりに ``Cake\I18n\Package`` のインスタンスを返す必要があります。

テスト
------

- UUID 周辺のフィクスチャ名が統合されました (``UuidItemsFixture``, ``BinaryUuidItemsFixture``)。
  これらの名前を使用している場合は、必ず更新してください。
  ``UuidportfoliosFixture`` は core では使われていませんでしたが、現在は削除されています。

新機能
======

私たちは、機能を出荷できるようにするために、新しいプロセスを追加し、
コミュニティからのフィードバックを集めて それらの機能を進化させていきます。
私たちはこの仕組みを `experimental-features` と呼んでいます。

Core
----

- コンテナ :doc:`/development/dependency-injection` の実験的サポートが追加されました。

Console
-------

- ``ConsoleIo::comment()`` が追加されました。
  このメソッドは、生成されたヘルプテキストのコメントのように、テキストを青く整形します。
- ``TableHelper`` は ``<text-right>`` 書式タグをサポートするようになりました。
  これは、セルの内容を（左ではなく）右端に揃えます。

Database
--------

- ``SqlServer`` はデフォルトでクライアント側のバッファリングされたカーソルを準備された文のために作成するようになりました。
  これは、サーバー側の SCROLL カーソルのパフォーマンスの問題を修正するために変更されました。
  ほとんどの結果セットでパフォーマンスが向上されることを確認してください。

  .. warning::
      クエリ結果が大きいユーザの場合、``Query::disableBufferedResults()`` が呼ばれないと
      クライアント側のバッファの割り当てにエラーが発生する可能性があります。
      最大バッファサイズは ``php.ini`` で ``pdo_sqlsrv.client_buffer_max_kb_size`` で設定できます。
      詳細は https://docs.microsoft.com/ja-jp/sql/connect/php/cursor-types-pdo-sqlsrv-driver?view=sql-server-ver15#pdo_sqlsrv-and-client-side-cursors
      を参照してください。
- 現在の結果キャスティングモードを取得するために ``Query::isResultsCastingEnabled()`` が追加されました。
- 照合（ collation ）に文字列リテラルを使えるように、 ``StringExpression`` が追加されました。
- ``IdentifierExpression`` が照合（ collation ）をサポートするようになりました。

Http
----

- ``Cake\Http\Middleware\SessionCsrfProtectionMiddleware`` が追加されました。
  このミドルウェアは、CSRFトークンをクッキーではなく、セッションに格納します。
  これにより、CSRFトークンはセッションに合わせてユーザスコープ化され、時間ベースのものとなり、
  クッキーベースのCSRFトークンよりもセキュリティが強化されます。
  このミドルウェアは ``CsrfProtectionMiddleware`` の代替品です。

- ``hal+json``, ``hal+xml``, ``jsonld`` が ``Response`` に追加され、
  ``withType()`` で使用できるようになりました。
- ``Client::createFromUrl()``  を追加しました。このメソッドを使うと、
  ベースパスを含む特定のドメインにスコープされたHTTPクライアントを作成することができます。
- 新しいユーティリティクラス ``CakeHttp\\FlashMessage`` が追加され、
  そのインスタンスは ``ServerRequest::getFlash()`` を通して利用できるようになりました。
  ``FlashComponent`` に似たクラスで、フラッシュメッセージを設定することができます。
  特にミドルウェアからのフラッシュメッセージを設定するのに便利です。

ORM
---

- ``Table::subquery()`` と ``Query::subquery()`` が追加されました。
  これらのメソッドを使うと、自動エイリアスを持たないクエリオブジェクトを作成することができます。
  これにより、サブクエリや一般的なテーブル式を作成する際のオーバーヘッドや複雑さを軽減することができます。
- 3.xで利用可能だった ``IsUnique`` ルールは ``allowMultipleNulls`` オプションを受け入れるようになりました。
  3.x とは異なり、デフォルトでは無効になっています。

TestSuite
---------

- ``EmailTrait::assertMailSubjectContains()`` と
  ``assertMailSubjectContainsAt()`` が追加されました。
- ``mockService()`` に ``ConsoleIntegrationTestTrait`` と ``IntegrationTestCaseTrait`` が追加されました。
  このメソッドは :doc:`/development/dependency-injection` コンテナに注入されたサービスを
  モックオブジェクトやスタブオブジェクトに置き換えることを可能にします。

View
----

- コンテキストクラスは ``attributes()`` の結果に
  ``comment``, ``null``, ``default`` のメタデータオプションを含めるようになりました。
- ``ViewBuilder::addHelper()`` は、ヘルパーのコンストラクタにオプションを渡すための
  ``$options`` パラメータを受け付けるようになりました。
- オプション ``assetUrlClassName``` が ``UrlHelper``` に追加されました。
  このオプションを使うと、デフォルトのアセットの URL リゾルバをアプリケーション固有のものに置き換えることができます。
  これは、アセットキャッシュバストのパラメータをカスタマイズする必要がある場合に便利です。
