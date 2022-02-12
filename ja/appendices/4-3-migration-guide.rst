4.3 移行ガイド
##############

CakePHP 4.3 は 4.0 からのAPI互換アップグレードです。
このページでは、4.3で追加された非推奨事項と機能の概要を説明します。

4.3.0へのアップグレード
=======================

CakePHP 4.3.0にアップグレードするには、次の Composer コマンドを実行してください。::

    php composer.phar require --update-with-dependencies "cakephp/cakephp:^4.3"

非推奨
============

4.3では、いくつかの非推奨機能が導入されています。
これらの機能はすべて 4.x の間は継続されますが、5.0 で削除されます。
非推奨機能の更新を自動化するには、 :ref:`upgrade tool <upgrade-tool-use>` を使用します。::

    bin/cake upgrade rector --rules cakephp43 <path/to/app/src>

.. note::
    これはCakePHP 4.3の変更点のみを更新します。CakePHP 4.2の変更を最初に適用していることを確認してください。

新しい設定オプションが追加され、パスごとに非推奨を無効にすることができるようになりました。
詳細は :ref:`deprecation-warnings` を参照してください。

Connection
----------

- ``Connection::supportsDynamicConstraints()`` は非推奨となりました。
  フィクスチャが動的に制約を削除したり作成したりしないようになったためです。

Controller
----------

- ``Controller.shutdown`` コンポーネントのイベントコールバックの名前が
  ``shutdown`` から ``afterFilter`` に変更されました。これにより、コールバックの一貫性が高まりました。

Database
--------

- 可変のdatetimeクラスを ``DateTimeType`` やその他の時間関連の型クラスで使用することは、非推奨となります。
  そのため、他の型クラスのメソッドである ``DateTimeType::useMutable()``, ``DateTimeType::useImmutable()`` や
  同様のメソッドは非推奨となります。
- ``DriverInterface`` で定義された機能定数を受け付ける ``DriverInterface::supports()`` を採用している
  ``DriverInterface::supportsQuoting()`` および ``DriverInterface::supportSavepoints()`` は現在、非推奨となっています。
- ``DriverInterface::supportsDynamicConstraints()`` は、フィクスチャが動的な制約の削除、作成を試みないため、非推奨となりました。

I18n
----

- datetime クラスの ``Time`` と ``Date`` は非推奨です。
  代わりに、不変的な代替クラスである ``FrozenTime`` と ``FrozenDate`` を使用してください。

Log
---

- ``FileLog`` は、``dateFormat`` 設定オプションを ``DefaultFormatter`` に移動しました。
- ``ConsoleLog`` は、``dateFormat`` 設定オプションを ``DefaultFormatter`` に移動しました。
- ``SyslogLog`` では、``format`` 設定オプションを ``LegacySyslogFormatter`` に移動しました。
  現在のデフォルトは ``DefaultFormatter`` です。

Middleware
----------

- "ダブルパス"のミドルウェア、つまり、``__invoke($request, $response, $next)`` メソッドを持つクラスは非推奨です。
  代わりに、``function($request, $handler)`` というシグネチャを持つ ``Closure`` や、
  ``PsrhttpHttpServer\MiddlewareInterface`` を実装したクラスを使用してください。

Network
-------

- ``Socket::$connected`` は非推奨です。代わりに ``isConnected()`` を使用してください。
- ``Socket::$description`` は非推奨です。
- ``Socket::$encrypted`` は非推奨です。代わりに ``isEncrypted()`` を使用してください。
- ``Socket::$lastError`` は非推奨です。代わりに ``lastError()`` を使用してください。

ORM
---
- ``ModelAwareTrait::loadModel()`` は非推奨です。
  代わりに、新しい ``LocatorAwareTrait::fetchTable()`` を使用してください。
  例えば、コントローラではデフォルトのテーブルインスタンスを取得するために ``$this->fetchTable()`` を実行することもできますし、
  デフォルト以外のテーブルを取得するには ``$this->fetchTable('Foos')`` を使用することもできます。
- クエリをプロキシするすべての ``ResultSetInterface`` メソッド（ ```CollectionInterface``` を含む）
  （これらは強制的に結果を取得し、その結果に対してプロキシされたメソッドを呼び出します）は非推奨になりました。
  非推奨な使い方の例として、 ``$query->combine('id', 'title');`` があります。
  これを ``$query->all()->combine('id', 'title');`` に変更する必要があります。
- バリデータオブジェクトを ``Table::save()`` の ``validate`` オプションに渡すことは、非推奨です。
  バリデーターはテーブルクラス内で定義するか、代わりに ``setValidator()`` を使用してください。
- ``Association::setName()`` は非推奨です。
  アソシエーション名は、アソシエーションが存在するときに定義されるべきです。
- ``QueryExpression::addCase()`` は非推奨です。代わりに ``case()`` を使用してください。
  また、 ``['value' => 'literal']`` および ``['column' => 'identifier']`` の構文は、新しい流暢なケースビルダーではサポートされていません。

Routing
-------

- ``:controller`` のようなコロンの付いたルートプレースホルダーは非推奨です。
  代わりに ``{controller}`` のような波括弧付きのプレースホルダーを使用してください。

TestSuite
---------

- ``TestFixture::$fields`` と ``TestFixture::$import`` は非推奨です。
  アプリケーションを :doc:`new fixture system <./fixture-upgrade>` に変換する必要があります。
- ``TestCase::$dropTables`` は非推奨です。
  テスト実行中にテーブルを削除することは  新しいマイグレーションやスキーマダンプベースのフィクスチャとは互換性がなく、5.0では削除されます。

View
----

- FormHelperメソッドの非関連性オプション（例： ``['disabled']`` ）は非推奨となりました。
- ``ViewBuilder::setHelpers()`` の第2引数 ``$merge`` は非推奨となり、
  専用の ``ViewBuilder::addHelpers()`` メソッドを使うことで、マージと上書きの操作が明確に分離できるようになりました。

Behaviorの変更
==============

以下の変更はどのメソッドのシグネチャも変更しませんが、メソッドのセマンティクスや動作を変更します。

Collection
----------

- 同一の実装で、 ``$preserveKeys`` パラメータを ``$keepKeys`` に名称変更しました。

Command
-------

- ``cake i18n extract`` には ``--relative-paths`` オプションがなくなりました。
  このオプションはデフォルトでオンになっています。

Core
----

- ``Configure::load()`` は、無効な設定エンジンが使用されている場合、例外を発生させるようになりました。

Database
--------

- ``ComparisonExpression`` は、生成された ``IdentifierExpression`` のsqlを()でラップしなくなりました。
  これは ``Query::where()`` や、その他の ``ComparisonExpression`` が生成される場所に影響します。

Datasource
----------

- ``ConnectionManager::alias()`` の ``$alias`` と ``$source`` のパラメータ名を、それぞれの内容に合わせて変更しました。
  これはドキュメントと名前付きパラメータにのみ影響します。

Http
----

- ``Http\Client`` は、``ini_get('user_agent')`` で 'CakePHP' を
  ユーザーエージェントのフォールバックとして使用するようになりました。

ORM
---

- ``Entity::isEmpty()`` と ``Entity::hasValue()`` を、'0'を空でない値として扱うように調整しました。
  これにより、ドキュメントや本来の意図に沿った動作となります。
- ``TranslateBehavior`` のエンティティ検証エラーは、 ``{lang}`` ではなく ``_translations.{lang}`` のパスに設定されるようになりました。
  これにより、エンティティエラーのパスが、リクエストデータに使用されるフィールドと同じになります。
  一度に複数の翻訳を変更するフォームがある場合は、検証エラーの表示方法を更新する必要があるかもしれません。
- カラムを選択する際に、カラムに設定されているデフォルトの型よりも関数式で指定された型が優先されるようになりました。
  例えば、 ``$query->select(['id' => $query->func()->min('id')])`` を使うと、
  取得したエンティティの `id` の値は、`integer` ではなく `float` になります。

Routing
-------

- ``Router::connect()``, ``Router::prefix()``, ``Router::plugin()``, ``Router::scope()`` は非推奨です。
  代わりに、対応する非静的な ``RouteBuilder`` メソッドを使用してください。
- ``RouteBuilder::resources()`` は、'braced' プレースホルダーを使用するルートを生成するようになりました。

TestSuite
---------

- ``TestCase::deprecated()`` は、コールバックによって
  少なくとも1つのdeprecation warningが発生したことをアサートするようになりました。

Validation
----------

- ``Validator::setProvider()`` は、オブジェクトでも文字列でもないプロバイダ名が使用された場合、
  例外を発生させるようになりました。
  これまでは、エラーは発生しませんでしたが、そのプロバイダも動作しませんでした。

View
----

- ``ViewBuilder::build()`` の ``$vars`` パラメータは非推奨です。
  代わりに ``setVar()`` を使用してください。
- ``HtmlHelper::script()`` と ``HtmlHelper::css()`` は、スキームを含む絶対URLをエスケープするようになりました。

破壊的変更
==========

API の背後に、対応が必要ないくつかの破壊的変更があります。
これらの変更は通常、テストにのみ影響します。

Log
---

- ``BaseLog::_getFormattedDate()`` と ``dateFormat`` の設定が削除されました。
  メッセージのフォーマットロジックがログフォーマッタに移されたためです。

View
----

- ``TimeHelper::fromString()`` は、 ``Time`` ではなく ``FrozenTime`` のインスタンスを返すようになりました。

新機能
======

Controller
----------

- ``Controller::middleware()`` が追加され、単一のコントローラに対してのみミドルウェアを定義することができるようになりました。
  詳しくは :ref:`controller-middleware` をご覧ください。
- コントローラでは、アクションパラメータに ``float``, ``int``, ``bool``, ``array`` のいずれかの型宣言をサポートするようになりました。
  ブール型で渡されるパラメータは、 ``0`` か ``1`` のどちらかでなければなりません。

Core
----

- ``deprecationWarning()`` は、重複した通知を出さなくなりました。代わりに 最初に表示されるようになりました。
  これにより、テスト出力の読みやすさ これにより、テスト出力の可読性が向上し、HTMLの文脈での視覚的ノイズも改善されます。
  ``app_local.php`` で、 ``Error.allowDuplicateDeprecations`` を ``true`` に設定することで、
  重複した通知出力を復元することができます。
- CakePHP の ``league/container`` への依存度が ``^4.1.1`` に変更されました。
  DIコンテナは実験的とされていますが、このアップグレードにより、
  サービスプロバイダーの定義のアップグレードが必要になる可能性があります。

Database
--------

* データベースマッピングタイプは、カラムのSQL生成とカラムスキーマの反映を指定するために、
  ``Cake\Database\SchemaAwareInterface`` を実装できるようになりました。
  これにより、カスタムタイプで非標準のカラムを扱うことができます。
* ログに記録されるクエリは、postgres、sqlite、mysql の各ドライバで
  ``TRUE`` と ``FALSE`` を使用するようになりました。
  これにより、クエリをコピーして対話型プロンプトで実行することが容易になりました。
* ``DateTimeType`` では、リクエストデータをユーザーのタイムゾーンから
  アプリケーションのタイムゾーンに変換できるようになりました。
  詳しくは :ref:`converting-request-data-from-user-timezone` をご覧ください。
* ``JsonType::setEncodingOptions()`` が追加されました。
  このメソッドでは、データを永続化する際にORMがJSONをシリアライズする際の
  ``json_encode()`` オプションを定義することができます。
* すべての機能チェックをひとつの関数にまとめた ``DriverInterface::sets()`` を追加しました。
  ドライバーは、カスタム機能名、または 機能 constants: の定数のいずれかをサポートします。

  * ``FEATURE_CTE``
  * ``FEATURE_JSON``
  * ``FEATURE_QUOTE``
  * ``FEATURE_SAVEPOINT``
  * ``FEATURE_WINDOW``

- ``PDO::inTranaction()`` が返すステータスを反映する ``DriverInterface::inTransaction()`` を追加しました。
- ``CASE, WHEN, THEN`` 文のための流暢なビルダーが追加されました。

Form
----

* ``Form::execute()`` に ``$options`` パラメータが追加されました。
  このパラメータは、どのバリデータを適用するかを選択したり、バリデーションを無効にするために使用できます。
* ``Form::validate()`` に ``$validator`` パラメータが追加され、適用するバリデーションセットを選択できるようになりました。
  このパラメータは、適用されるバリデーションセットを選択します。

Http
----

- ``CspMiddleware`` は、``cspScriptNonce`` と ``cspStyleNonce`` のリクエスト属性を設定するようになり、
  厳格なコンテンツセキュリティポリシーの採用を効率化しました。
- ``Client::addMockResponse()`` と ``clearMockResponses()`` が追加されました。

Log
---

- ログエンジンは、書き込む前にメッセージ文字列をフォーマットするためにフォーマッタを使用するようになりました。
  これは ``formatter`` 設定オプションで設定できます。
  詳細は :ref:`logging-formatters` のセクションを参照してください。
- ``JsonFormatter`` が追加され、任意のログエンジンの ``formatter`` オプションとして設定できるようになりました。

ORM
---

- HasManyおよびBelongsToManyのアソシエーションを ``contain()`` するクエリは、
  結果キャストのステータスを伝搬するようになりました。
  これにより、すべてのアソシエーションからの結果は、タイプマッピングオブジェクトでキャストされるか、
  まったくキャストされないかのいずれかになります。
- ``Table`` では、 ``displayField`` のデフォルトの候補となるフィールドのリストに
  ``label`` が含まれるようになりました。
- nullを許容するカラムに対して、 ``Query::whereNotInListOrNull()`` と ``QueryExpression::notInOrNull()`` を追加しました。
  なぜなら、 ``null != value`` は常にfalseであり、カラムがnullの場合、 ``NOT IN`` のテストは常に失敗するからです。
- ``LocatorAwareTrait::fetchTable()`` が追加されました。
  これにより、 ``$this->fetchTable()`` を使って、コントローラ、コマンド、メーラー、セルなどの
  traitを使ったクラスのテーブルインスタンスを取得することができます。
  ``LocatorAwareTrait::$defaultTable`` プロパティを設定することで、デフォルトのテーブルエイリアスを指定することができます。

TestSuite
---------

- ``IntegrationTestTrait::enableCsrfToken()`` において、
  カスタムのCSRFクッキー/セッションキー名を使用できるようになりました。
- HTTPモックを簡単に書けるように ``HttpClientTrait`` を追加しました。
  詳細は :ref:`httpclient-testing` を参照してください。
- 新しいフィクスチャシステムが導入されました。
  このフィクスチャシステムはスキーマとデータを分離し、既存のマイグレーションを再利用してテストスキーマを定義することができます。
  アップグレードの方法は :doc:`./fixture-upgrade` ガイドで説明しています。

View
----

- ``HtmlHelper::script()`` と ``HtmlHelper::css()`` は、
  ``cspScriptNonce`` と ``cspStyleNonce`` のリクエスト属性が存在する場合、
  生成されたタグに ``nonce`` 属性を追加するようになりました。
- ``FormHelper::control()`` はバリデータのメタデータに基づいて
  ``aria-invalid``, ``aria-required`` , ``aria-describedby`` 属性を生成するようになりました。
  自動ラベル要素を無効にしてプレースホルダーを提供した場合には、 ``aria-label`` 属性が設定されます。
- ``ViewBuilder::addHelpers()`` が追加され、マージと上書きの操作が明確に分離されました。
