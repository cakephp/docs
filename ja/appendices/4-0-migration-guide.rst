4.0 移行ガイド
##############

CakePHP 4.0 には、重大な変更が含まれており、3.x リリースとの後方互換性はありません。
4.0 にアップグレードする前に、最初に 3.8 にアップグレードし、すべての非推奨警告を解消してください。

4.0 にアップグレードする方法の段階的な手順については、
:doc:`/appendices/4-0-upgrade-guide` を参照してください。

非推奨機能の削除
================

3.8 から非推奨の警告を発していたすべてのメソッド、プロパティと機能が削除されました。

認証機能がスタンドアロンのプラグイン `Authentication
<https://github.com/cakephp/authentication>`__ および
`Authorization <https://github.com/cakephp/authorization>`__ に分割されました。
以前の RssHelper については、同様の機能を持つスタンドアロンの `Feed plugin
<https://github.com/dereuromark/cakephp-feed>`__ をご覧ください。

非推奨
======

以下は、非推奨メソッド、プロパティと動作の一覧です。
これらの機能は、 4.x でも引き続き機能し、 5.0.0 で削除されます。

Component
---------

* ``AuthComponent`` および関連するクラスは廃止され、 5.0.0 で削除されます。代わりに、
  上記の認証および認可ライブラリを使用する必要があります。
* ``SecurityComponent`` は非推奨です。代わりに、フォーム改ざん保護のためには ``FormProtectionComponent`` を使用し、
  ``requireSecure`` 機能のためには :ref:`https-enforcer-middleware` を使用してください。

Filesystem
----------

* このパッケージは非推奨であり、 5.0 で削除されます。多くの設計上の問題があり、そして、
  すでに多くの素晴らしいパッケージが存在する場合、この頻繁に使用されるパッケージを修正することに
  努力する価値はありません。

ORM
---

* ``Entity::isNew()`` をセッターとして使うことは非推奨です。代わりに ``setNew()`` を使用してください。
* ``Entity::unsetProperty()`` は、他のメソッドに合わせて ``Entity::unset()`` に名前が変更されました。
* ``TableSchemaInterface::primaryKey()`` は ``TableSchemaInterface::getPrimaryKey()``
  に名前が変更されました。

View
----

* ``JsonView`` の特別なビュー変数 ``_serialize`` 、 ``_jsonOptions`` および ``_jsonp`` は非推奨になりました。
  代わりに、 ``viewBuilder()->setOption($optionName, $optionValue)`` を、それらのオプションを設定するために使用してください。
* ``XmlView`` の特別なビュー変数 ``_serialize`` 、 ``_rootNode`` および ``_xmlOptions`` は非推奨になりました。
  代わりに、 ``viewBuilder()->setOption($optionName, $optionValue)`` を、それらのオプションを設定するために使用してください。
* ``HtmlHelper::tableHeaders()`` は、ネストされたリストとして定義される属性を持つヘッダーセルを優先するようになりました。
  例: ``['Title', ['class' => 'special']]``
* ``ContextInterface::primaryKey()`` は ``ContextInterface::getPrimaryKey()`` に名前が変更されました。

Mailer
------

* ``Cake\Mailer\Email`` クラスは非推奨になります。代わりに、 ``Cake\Mailer\Mailer`` を使用してください。

App
---

* ``App::path()`` はクラスパスでは非推奨になりました。
  代わりに ``\Cake\Core\App::classPath()`` を使用してください。

破壊的変更
==========

非推奨機能の削除に加えて、破壊的変更が行われました。

Cache
-----

* ``Cake\Cache\CacheEngine::gc()`` と、このメソッドのすべての実装が削除されました。
  このメソッドは、ほとんどのキャッシュドライバーでノーオペレーションであり、ファイルキャッシュでのみ使用されていました。

Controller
----------

* ``Cake\Controller\Controller::referer()`` は、デフォルトで ``local`` パラメーターを、
  false ではなく true に設定します。
  これにより、デフォルトでアプリケーションのドメインに制限されるため、リファラルヘッダーの使用がより安全になります。
* アクションの呼び出し時のコントローラーメソッド名のマッチングで、大文字と小文字が区別されるようになりました。
  たとえば、コントローラーメソッドが ``forgotPassword()`` の場合、 URL で文字列 ``forgotpassword``
  を使用すると、アクション名としてマッチしません。

Console
-------

* ``ConsoleIo::styles()`` は ``getStyle()`` および ``setStyle()`` に分割されました。これは ``ConsoleOutput`` にも影響します。

Component
---------

* ``Cake\Controller\Component\RequestHandlerComponent`` は、リクエストパラメーターではなくリクエスト属性として、
  ``isAjax`` を設定するようになりました。したがって、 ``$request->getParam('isAjax')`` の代わりに
  ``$request->getAttribute('isAjax')`` を使用する必要があります。
* ``RequestHandlerComponent`` の入力データ解析機能は削除され。
  代わりに、 :ref:`body-parser-middleware` を使用する必要があります。
* ``Cake\Controller\Component\PaginatorComponent`` は、リクエストパラメーターではなくリクエスト属性として、
  ページングパラメーター情報を設定するようになりました。したがって、 ``$request->getParam('paging')`` の代わりに、
  ``$request->getAttribute('paging')`` を使用する必要があります。

Database
--------

* ``Cake\Database\TypeInterface`` の型マッピングクラスは ``Type`` を継承しなくなり、
  ``BatchCastingInterface`` 機能を活用します。
* ``Cake\Database\Type::map()`` は、セッターとしてのみ機能します。
  型インスタンスを検査するには ``Type::getMap()`` を使用する必要があります。
* Date 、 Time 、 Timestamp および Datetime カラムタイプは、デフォルトで不変の時刻オブジェクトを返すようになりました。
* ``BoolType`` は、空でない文字列値を ``true`` にマーシャリングしたり、空文字列を
  ``false`` にマーシャリングしなくなりました。代わりに、非ブール文字列値は ``null`` に変換されます。
* ``DecimalType`` は、浮動小数ではなく文字列を使用して 10 進数値を表すようになりました。
  浮動小数を使用することで、精度が低下していました。
* ``JsonType`` は、データベースコンテキストの値を準備するときに ``null`` を保持するようになりました。
  3.x では、 ``'null'`` を出力します。
* ``StringType`` は、配列値を、空文字列の代わりに ``null`` にマーシャリングします。
* ``Cake\Database\Connection::setLogger()`` は ロギングを無効化するために ``null`` を受け入れなくなりました。
  代わりに、 ``Psr\Log\NullLogger`` のインスタンスを渡して、ロギングを無効にします。
* ``Database\Log\LoggingStatement`` 、 ``Database\QueryLogger`` および ``Database\Log\LoggedQuery``
  の内部実装が変更されました。これらのクラスを拡張する場合は、コードを更新する必要があります。
* ``Cake\Database\Log\LoggingStatement`` 、 ``Cake\Database\QueryLogger`` および ``Cake\Database\Log\LoggedQuery``
  の内部実装が変更されました。これらのクラスを拡張する場合は、コードを更新する必要があります。
* ``Cake\Database\Schema\CacheCollection`` および ``Cake\Database\SchemaCache`` の内部実装が変更されました。
  これらのクラスを拡張する場合は、コードを更新する必要があります。
* データべーススキーマは、 ``CHAR`` カラムを ``string`` ではなく、新しい ``char`` 型にマッピングするようになりました。
* SqlServer の datetime カラムは、名前を一致させるために 'timestamp' ではなく 'datetime'
  型にマップされるようになりました。
* MySQL 、 PostgreSQL および SqlServer のデータベーススキーマは、少数秒をサポートするカラムを、
  新しい抽象少数型にマップするようになりました。

  * **MySQL**

    #. ``DATETIME(1-6)`` => ``datetimefractional``
    #. ``TIMESTAMP(1-6)`` => ``timestampfractional``

  * **PostgreSQL**

    #. ``TIMESTAMP`` => ``timestampfractional``
    #. ``TIMESTAMP(1-6)`` => ``timestampfractional``

  * **SqlServer**

    #. ``DATETIME2`` => ``datetimefractional``
    #. ``DATETIME2(1-7) => ``datetimefractional``

* PostgreSQL のスキーマは、タイムゾーンをサポートするカラムを、新しい抽象タイムゾーン型にマップするようになりました。
  (0) 精度を指定しても、上記の通常の分数型の場合のように、型マッピングは変更されません。

  * **PostgreSQL**

    #. ``TIMESTAMPTZ`` => ``timestamptimezone``
    #. ``TIMESTAMPTZ(0-6)`` => ``timestamptimezone``
    #. ``TIMESTAMP WITH TIME ZONE`` => ``timestamptimezone``
    #. ``TIMESTAMP(0-6) WITH TIME ZONE`` => ``timestamptimezone``

Datasources
-----------

* ``ModelAwareTrait::$modelClass`` は protected になりました。

Error
-----

* エラーハンドラークラス ``BaseErrorHandler`` 、 ``ErrorHandler`` および ``ConsoleErrorHandler`` の内部が変更されました。
  これらのクラスを拡張した場合は、それに応じて更新する必要があります。
* ``ErrorHandlerMiddleware`` は、例外レンダラークラス名またはインスタンスではなく、
  コンストラクター引数として、エラーハンドラークラス名またはインスタンスを受け取るようになりました。

Event
-----

* 件名のないイベントで ``getSubject()`` を呼び出すと、例外が発生するようになりました。

Http
----

* ``Cake\Http\ServerRequest::referer()`` は、デフォルトで ``local`` パラメーターを false ではなく true に設定します。
  これにより、リファラーヘッダーはデフォルトでアプリケーションのドメインに制限されるため、リファラーヘッダーの使用がより安全になります。
* パラメーターが欠落している場合の ``Cake\Http\ServerRequest::getParam()`` のデフォルト値は、
  ``false`` ではなく ``null`` になりました。
* ``Cake\Http\Client\Request::body()`` は削除されました。代わりに、 ``getBody()`` か ``withBody()`` を使用してください。
* ``Cake\Http\Client\Response::isOk()`` は、すべての 2xx および 3xx レスポンスコードに対して、 ``true`` を返すようになりました。
* ``Cake\Http\Cookie\Cookie::getExpiresTimestamp()`` は、数値を返すようになりました。
  これにより、 ``setcookie()`` で使用されているものと型が一致します。
* ``Cake\Http\ServerRequest::referer()`` は、現在のリクエストにリファラーがない場合、 ``null`` を返すようになりました。
  以前は、 ``/`` を返していました。
* ``Cake\Cookie\CookieCollection::get()`` は、存在しないクッキーにアクセスすると、例外を返すようになりました。
  クッキーの存在をチェックするために ``has()`` を使用してください。
* ``Cake\Http\ResponseEmitter::emit()`` のシグネチャが変更され、 2 番目の引数がなくなりました。
* ``App.mergeFilesAsObjects`` のデフォルト値は ``true`` になりました。アプリケーションがファイルアップロードを使用する場合、
  このフラグを ``false`` に設定することで、 3.x の動作との互換性を維持できます。
* ``Cake\Http\Response::getCookie()`` によって返される配列キーが変更されました。
  ``expire`` が ``expires`` に、 ``httpOnly`` が ``httponly`` に変わりました。

Http\Session
------------

* セッションクッキー名は、デフォルトで ``CAKEPHP`` に設定されなくなりました。代わりに、 ``php.ini`` ファイルで定義された、
  デフォルトのクッキー名が使用されます。``Session.cookie`` 設定オプションを使用してクッキー名を設定できます。
* セッションクッキーは、デフォルトで ``SameSite`` 属性が ``Lax`` に設定されるようになります。
  詳細については、 :ref:`session-configuration` セクションを確認してください。

I18n
----

* ``Cake\I18n\Date`` や ``Cake\I18n\FrozenDate`` オブジェクトを JSON エンコードすると、
  以前の形式 ``yyyy-MM-dd'T'HH:mm:ssxxx`` ではなく、 ``yyyy-MM-dd`` 形式で
  日付部分のみの文字列が生成されるようになりました。

Mailer
------

* ``Email::set()`` は削除されました。代わりに ``Email::setViewVars()`` を使用してください。
* ``Email::createView()`` は削除されました。
* ``Email::viewOptions()`` は削除されました。代わりに
  ``$email->getRenderer()->viewBuilder()->setOption()`` を使用してください。

ORM
---

* ``Table::newEntity()`` は、入力として配列を必要とし、検証が実行されずに偶発的な保存がされることを防ぐために、
  検証を実施します。つまり、入力無しでエンティティーを作成するには、 ``Table::newEmptyEntity()`` を使用する必要があります。
* ``Query::where()`` に ``['name' => null]`` のような条件を使用すると、例外が発生します。
  3.x では、 SQL の ``name = NULL`` のような条件のSQLを生成していましたが、これは常に 0 行と一致するため、誤った結果を返します。
  ``null`` と比較するときは、 ``['name IS' => null]`` のような ``IS`` 演算子を使用する必要があります。
* false ではなく、エンティティーではない結果で、 ``Model.beforeSave`` イベントを停止すると、例外が発生します。
  この変更により、 ``Table::save()`` は常にエンティティーまたは false を返します。
* テーブルクラスは、テーブル名とカラム名のエイリアスがデータベースによって切り捨てられた場合に、例外を投げるようになりました。
  これは実際のエイリアスが一致しない場合、隠れたエラーが発生する前に警告を発するものです。
* ``TableLocator::get()`` および ``TableRegistry::get()`` は常に **CamelCase** 形式のエイリアスを期待するようになりました。
  予期せぬ形式のエイリアスが渡された場合、テーブルやエンティティクラスが正しくロードされません。
* ``IsUnique`` ルールはデフォルトで有効になっていた ``allowMultipleNulls`` オプションを受け付けなくなりました。
  このオプションは 4.2 で再度追加されましたが、デフォルトでは無効になっています。

Router
------

* ``Router::prefix()`` および ``$routes->prefix()`` で生成されたルーティングプレフィックスは、
  アンダースコアーではなく、キャメルケースになりました。``my_admin`` の代わりに、 ``MyAdmin`` を使用する必要があります。
  この変更により、プレフィックスが他のルーティングパラメーターで正規化され、語尾変化のオーバーヘッドが削除されます。
* ``RouteBuilder::resources()`` は、 URL 内のリソース名をデフォルトではアンダースコア形式の代わりにダッシュ形式で変換するようになりました。
  ``$options`` 引数で、 ``'inflect' => 'underscore'`` を使用することで、アンダースコア形式での変換を保持できます。
* ``Router::plugin()`` および ``Router::prefix()`` は、デフォルトで URL のダッシュ形式のプラグイン/プレフィックス名を
  使用するようになりました。``$options`` 引数で、 ``'path'`` キーを使用して、下線（または他のカスタムパス）を保持できます。
* ``Router`` は、リクエストのスタックではなく、リクエストの単一インスタンスのみへの参照を維持します。
  ``Router::pushRequest()`` 、 ``Router::setRequestInfo()`` および ``Router::setRequestContext()`` は削除されました。
  代わりに、 ``Router::setRequest()`` を使用してください。
  ``Router::popRequest()`` は削除されました。``Router::getRequest()`` には、 ``$current`` 引数がなくなりました。

TestSuite
---------

* ``Cake\TestSuite\TestCase::$fixtures`` は、コンマ区切りの文字列にすることができなくなりました。配列でなければなりません。

Utility
-------

* ``Cake\Utility\Xml::fromArray()`` は ``$options`` パラメーターの配列を必要とします。
* ``Cake\Filesystem\Folder::copy($to, array $options = [])`` および
  ``Cake\Filesystem\Folder::move($to, array $options = [])`` には、
  最初の引数として抽出されたターゲットパスがあります。
* ``Xml::build()`` の ``readFile`` オプションは、デフォルトで true ではなくなりました。
  代わりに、ローカルファイルを読み取るために、 ``readFile`` を有効にする必要があります。
* ``Hash::sort()`` は、方向パラメーターで ``SORT_ASC`` および ``SORT_DESC`` 定数を受け入れるようになりました。
* ``Inflector::pluralize()`` は ``index`` を ``indices`` ではなく ``indexes`` に反映するようになりました。
  これは、この複数形のコアおよびエコシステムでの技術的な使用を反映しています。

View
----

* テンプレートは、 app や plugin ルート上の ``src/Template/`` から ``templates/`` フォルダーへ移動されました。
  この変更により、 ``src`` フォルダーには、 composer のオートローダーを介して
  オートロードされるクラスを持つファイルのみが含まれるようになりました。
* ``Cell`` 、 ``Element`` 、 ``Email`` および ``Plugin`` といった特別なテンプレートフォルダーは、
  それぞれ小文字の ``cell`` 、 ``element`` 、 ``email`` および ``plugin`` に名前が変更されました。
  これにより、特別なフォルダーとアプリケーションのコントローラー名に対応する ``CamelCase`` 形式のフォルダーを
  視覚的に区別しやすくなります。
* テンプレートの拡張子も、 ``.ctp`` から ``.php`` に変更されました。
  特別な拡張子は、実際の利点を提供せず、代わりに、 ``.ctp`` 拡張子を持つファイルを PHP ファイルとして認識するように
  エディターや IDE を設定する必要がありました。
* ``ViewBuilder::setLayout()`` または ``View::setLayout()`` の引数として ``false`` を使用して、
  ``View::$layout`` プロパティを ``false`` に設定することはできなくなりました。
  代わりに、 ``ViewBuilder::disableAutoLayout()`` や ``View::disableAutoLayout()`` を使用して、
  レイアウトなしでビューテンプレートを描画します。
* ``Cake\View\View`` は、 ``render()`` が複数回呼び出された場合、 ``null`` を返す代わりに再描画します。
* 定数 ``View::NAME_ELEMENT`` と ``View::NAME_LAYOUT`` は削除されました。
  ``View::TYPE_ELEMENT`` と ``View::TYPE_LAYOUT`` が使用できます。

Helper
------

* ``Cake\View\Helper\PaginatorHelper::hasPage()`` の引数が逆になっています。
  これにより、 'model' が第 2 引数である他のページネーターメソッドとの一貫性が保たれます。
* ``Cake\View\Helper\UrlHelper::build()`` は第 2 引数にブール値を受け入れなくなりました。
  代わりに、 ``['fullBase' => true]`` を使用しなければなりません。
* コンテキスト無しでフォームを作成するには、 ``FormHelper::create()`` の最初の引数として、
  ``null`` のみを使用する必要があります。コンテキストを推測できない他の値を渡すと、例外がスローされます。
* ``Cake\View\Helper\FormHelper`` および ``Cake\View\Helper\HtmlHelper`` は、 HTML データ属性
  ``data-confirm-message`` を使用して、 ``confirm`` オプションを持つメソッドの確認メッセージを保持するようになりました。
* ``Cake\View\Helper\FormHelper::button()`` は、 HTML エンティティーがデフォルトで、ボタンテキストと
  HTML 属性 をエンコードするようになりました。新しいオプション ``escapeTitle`` が追加され、
  他の HTML 属性とは別にタイトルのエスケープを制御できるようになりました。
* ``Cake\View\Helper\SecureFieldTokenTrait`` が削除されました。
  そのフォームトークンデータ構築機能は、内部クラス ``FormProtector`` に含まれるようになりました。
* ``HtmlHelper::docType()`` メソッドが削除されました。HTML4 および XHTML は廃止され、
  HTML5 の doctype は非常に短く、直接入力するのが簡単です。
* ``HtmlHelper::scriptBlock()`` および ``HtmlHelper::scriptStart()`` の ``safe`` オプションが削除されました。
  有効にすると、現在無効になっている XHTML のみに必要な ``CDATA`` タグを生成します。

Log
---

* ``Cake\Log\LogTrait::log()`` および ``Cake\Log\Log::write()`` などのログ関連メソッドは、
  ``$message`` 引数に文字列のみを受け入れるようになりました。
  この変更は、 API を `PSR-3 <https://www.php-fig.org/psr/psr-3/>`__ 標準に合わせるために必要でした。

その他
------

* アプリケーションの ``config/bootstrap.php`` には、 ``Router::fullBaseUrl()`` への呼び出しを含めてください。
  最新のスケルトンアプリケーションの ``bootstrap.php`` を参照し、それに応じて更新します。
* ``App::path()`` は、 ``Template`` の代わりに ``$type`` および ``templates`` を使用して、
  テンプレートへのパスを取得します。同様にロケールフォルダーのパスを取得するには、 ``Locale`` の代わりに
  ``locales`` を使用します。
* ``ObjectRegistry::get()`` は、指定された名前のオブジェクトがロードされていない場合、例外をスローするようになりました。
  ``ObjectRegistry::has()`` を使用して、オブジェクトがレジストリーに存在することを確認する必要があります。
  マジックゲッター ``ObjectRegistry::__get()`` は、指定された名前のオブジェクトがロードされない場合、
  引き続き ``null`` を返します。
* ロケールファイルは、 ``src/Locale`` から ``resources/locales`` に移動しました。
* CakePHP にバンドルされていた ``cacert.pem`` ファイルは、
  `composer/ca-bundle <https://packagist.org/packages/composer/ca-bundle>`__
  への依存関係に置き換えられました。


新機能
======

Console
-------

* コマンドクラスは、 ``defaultName()`` メソッドを実装して、慣習に基づいた CLI 名を上書きできます。

Core
----

* ``InstanceConfigTrait::getConfigOrFail()`` および ``StaticConfigTrait::getConfigOrFail()`` が追加されました。
  他の ``orFail`` メソッドと同様に、これらのメソッドは要求されたキーが存在しないか
  ``null`` 値を持っている場合に例外を発生させます。

Database
--------

* データベースのタイムゾーンが PHP のタイムゾーンと一致しない場合は、 ``DateTime::setDatabaseTimezone()`` を使用できます。
  詳しくは、 `datetime-type` をご覧ください。
* ``DateTime::setKeepDatabaseTimezone()`` により、クエリーによって生成された DateTime オブジェクトに、
  データベースのタイムゾーンを保持できます。
* ``Cake\Database\Log\LoggedQuery`` は ``JsonSerializable`` を実装するようになりました。
* ``Cake\Database\Connection`` で PSR-3 のロガーを使用できるようになりました。
  その結果、スタンドアロンのデータベースパッケージを使用しているユーザーは、
  ロギングに ``cakephp/log`` パッケージを使用することを強制されなくなりました。
* ``Cake\Database\Connection`` で PSR-16 のキャッシャー を使用できるようになりました。
  その結果、スタンドアロンのデータベースパッケージを使用しているユーザーは、
  キャッシングに ``cakephp/cache`` パッケージを使用することを強制されなくなりました。
  新しいメソッド ``Cake\Database\Connection::setCache()`` および ``Cake\Database\Connection::getCache()`` が追加されました。
* ``Cake\Databases\ConstraintsInterface`` が ``Cake\Datasource\FixtureInterface`` から抽出されました。
  このインターフェースは、制約をサポートするフィクスチャー実装によって実装する必要があります。
  これは、私たちの経験からは一般にリレーショナルデータベースです。
* 抽象型 ``char`` が追加されました。このタイプは、固定長の文字列カラムを処理します。
* 抽象型 ``datetimefractional`` および ``timestampfractional`` が追加されました。
  このタイプは、秒の小数部を持つカラムデータ型を処理します。
* SqlServer スキーマは、 SYSDATETIME() などの関数を含むデフォルト値をサポートするようになりました。
* 抽象型 ``datetimetimezone`` および ``timestamptimezone`` が追加されました。
  このタイプは、タイムゾーンをサポートするカラムデータ型を処理します。

Error
-----

* 接頭辞付きのコントローラーアクションによってエラーが発生した場合、
  ``ErrorController`` は接頭辞付きのエラーテンプレートがある場合は、それを利用します。
  この動作は ``debug`` がオフの場合にのみ適用されます。

Http
----

* フレームワーク全体を含めずに ``cakephp/http`` を使用できます。
* CakePHP は `PSR-15: HTTP Server Request Handlers
  <https://www.php-fig.org/psr/psr-15/>`__ の仕様をサポートするようになりました。
  結果としてミドルウェアは ``Psr\Http\Server\MiddlewareInterface`` を実装するようになりました。
  CakePHP 3.x スタイルの呼び出し可能なダブルパスミドルウェアは、後方互換性のために引き続きサポートされています。
* ``Cake\Http\Client`` は `PSR-18: HTTP Client <https://www.php-fig.org/psr/psr-18/>`__
  の仕様に準拠するようになりました。
* ``Cake\Http\Client\Response::isSuccess()`` が追加されました。このメソッドは、
  レスポンスステータスコードが 2xx の場合 true を返します。
* ``CspMiddleware`` が追加され、コンテンツセキュリティポリシーヘッダーの定義がより簡単になりました。
* ``HttpsEnforcerMiddleware`` が追加されました。これにより ``SecureComponent`` の ``requireSecure`` 機能が
  置き換えられました。
* Cookie は ``SameSite`` 属性をサポートするようになりました。

I18n
----

* ``Date`` および ``FrozenDate`` は、 ``today('Asia/Tokyo')`` のようなさまざまなファクトリーヘルパーの
  タイムゾーンパラメーターを尊重するようになりました。

Mailer
------

* メールメッセージ生成の責務は ``Cake\Mailer\Renderer`` に移されました。
  これは主にアーキテクチャーの変更であり、 ``Email`` クラスの使用方法には影響しません。
  唯一の違いは、テンプレート変数を設定するために ``Email::set()`` の代わりに ``Email::setViewVars()``
  を使用する必要があることです。

ORM
---

* ``Table::saveManyOrFail()`` メソッドが追加され、エラーの場合に失敗した特定のエンティティーで
  ``PersistenceFailedException`` をスローします。
* コールバックを含む多くのエンティティーを一度に削除するための ``Table::deleteMany()``
  および ``Table::deleteManyOrFail()`` メソッドが追加されました。
  エンティティーはトランザクションセーフで削除されます。
* 新しい空のエンティティーオブジェクトを作成するために ``Table::newEmptyEntity()`` が追加されました。
  これはフィールドバリデーションをトリガーしません。
  エンティティは、空のレコードとして検証エラーなしで永続化できます。
* ``Cake\ORM\RulesChecker::isLinkedTo()`` および ``isNotLinkedTo()`` が追加されました。
  これらの新しいアプリケーションルールを使用すると、関連付けがあるかもしくは関連レコードがあるかどうかを確認できます。
* 新しい型クラス ``DateTimeFractionalType`` がマイクロ秒精度の日付型として追加されました。
  この型をデフォルトの ``datetime`` 型として ``TypeFactory`` に追加するか、個々のカラムに再マッピングすることで、
  この型の使用を選択できます。このタイプをデータベースタイプに自動的にマッピングする方法については、
  Database migration notes を参照してください。
* タイムゾーンをサポートする日時型に、新しい型クラス ``DateTimeTimezoneType`` が追加されました。
  この型をデフォルトの ``datetime`` 型として ``TypeFactory`` に追加するか、個々のカラムに再マッピングすることで、
  この型の使用を選択できます。このタイプをデータベースタイプに自動的にマッピングする方法については、
  Database migration notes を参照してください。

Routing
-------

* ``Cake\Routing\Asset`` が追加されました。このクラスは、 ``Router::url()`` と同等の静的インターフェースで、
  アセットURL生成を公開します。詳しくは `asset-routing` をご覧ください。

TestSuite
---------

* ``TestSite\EmailTrait::assertMailContainsAttachment()`` が追加されました。

Validation
----------

* ``Validation::dateTime()`` がマイクロ秒を含む値を受け入れるようになりました。

View
----

* ``FormHelper`` は、エンティティーの ORM テーブルクラスで "notEmpty" とマークされたフィールドの
  HTML5 検証メッセージを生成するようになりました。この機能は ``autoSetCustomValidity``
  クラス設定オプションで切り替えることができます。
* ``FormHelper`` は、日時フィールドのネイティブ HTML5 入力タグを生成するようになりました。
  詳しくは、`Form Helper <create-datetime-controls>` ページを参照してください。
  以前のマークアップを保持する必要がある場合は、シム化された FormHelper が
  `Shim plugin <https://github.com/dereuromark/cakephp-shim>`__ にあり、
  古い動作・生成が含まれています（4.x ブランチ）。
* ``FormHelper`` は、時間コンポーネントを持つ ``datetime`` ウィジェットのデフォルトのステップサイズを
  秒に設定するようになりました。フィールドが新しい ``datetimefractional`` もしくは ``timestampfractional``
  データベースタイプからのものである場合、デフォルトはミリ秒です。
