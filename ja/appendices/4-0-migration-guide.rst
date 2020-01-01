4.0 移行ガイド
##############

CakePHP 4.0 には、重大な変更が含まれており、3.x リリースとの後方互換性はありません。
4.0 にアップグレードする前に、最初に 3.8 にアップグレードし、すべての非推奨警告を解消してください。

4.0.x にアップグレードするには、次の composer コマンドを実行してください。

.. code-block:: bash

    php composer.phar require --update-with-dependencies "cakephp/cakephp:4.0.*"

非推奨機能の削除
================

3.8 から非推奨の警告を発していたすべてのメソッド、プロパティと機能が削除されました。

認証機能がスタンドアロンのプラグイン `Authentication
<https://github.com/cakephp/authentication>`__ および
`Authorization <https://github.com/cakephp/authorization>`__ に分割されました。
以前の RssHelper は、同様の機能を持つスタンドアロンの `Feed plugin
<https://github.com/dereuromark/cakephp-feed>`__ として見つけることができます。

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

* このパッケージは非推奨であり、 5.0 で削除されます。多くの設計上の問題があり、この頻繁に使用されないパッケージを修正することは、
  既に多くのパッケージが存在している場合、努力する価値がないと思われます。

ORM
---

* ``Entity::isNew()`` をセッターとして使うことは非推奨です。代わりに ``setNew()`` を使用してください。
* ``Entity::unsetProperty()`` は、他のメソッドに合わせて ``Entity::unset()`` に名前が変更されました。

View
----

* ``JsonView``の特殊なビュー変数 ``_serialize`` 、 ``_jsonOptions`` および ``_jsonp`` は非推奨になりました。
  代わりに、 ``viewBuilder()->setOption($optionName, $optionValue)`` を、それらのオプションを設定するために使用してください。
* ``XmlView`` の特殊なビュー変数 ``_serialize`` 、 ``_rootNode`` および ``_xmlOptions`` は非推奨になりました。
  代わりに、 ``viewBuilder()->setOption($optionName, $optionValue)`` を、それらのオプションを設定するために使用してください。
* ``HtmlHelper::tableHeaders()`` は、ネストされたリストとして定義される属性を持つヘッダーセルを優先するようになりました。
  例: ``['Title', ['class' => 'special']]``

Mailer
-----

* ``Cake\Mailer\Email`` クラスは非推奨になります。代わりに、 ``Cake\Mailer\Mailer`` を使用してください。

App
---

* ``App::path()`` の2番目の引数 ``$plugin`` は非推奨です。プラグインパス用には、代わりに、
  ``\Cake\Core\Plugin::classPath()/templatePath()`` を使用してください。

破壊的変更
==========

非推奨機能の削除に加えて、破壊的変更が行われました。

Cache
-----

* ``Cake\Cache\CacheEngine::gc()`` とこのメソッドのすべての実装が削除されました。
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

* ``ConsoleIo::styles()`` は ``getStyle()`` と ``setStyle()`` に分割されました。これは ``ConsoleOutput`` にも影響します。

Component
---------

* ``Cake\Controller\Component\RequestHandlerComponent`` は、リクエストパラメーターではなくリクエスト属性として、
  ``isAjax`` を設定するようになりました。したがって、 ``$request->getParam('isAjax')`` の代わりに
  ``$request->getAttribute('isAjax')`` を使用する必要があります。
* ``RequestHandlerComponent`` の入力データ解析機能は削除され、非推奨の警告を発します。
  代わりに、 :ref:`body-parser-middleware` を使用する必要があります。
* ``Cake\Controller\Component\PagingComponent`` は、リクエストパラメーターではなくリクエスト属性として、
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
* ``Cake\Database\Schema\CacheCollection`` と ``Cake\Database\SchemaCache`` の内部実装が変更されました。
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
* セッションクッキー名はデフォルトで ``CAKEPHP`` に設定されなくなりました。代わりに、 ``php.ini`` ファイルで定義された、
  デフォルトのクッキー名が使用されます。``Session.cookie`` 設定オプションを使用してクッキー名を設定できます。
* ``Cake\Cookie\CookieCollection::get()`` は、存在しないクッキーにアクセスすると、例外を返すようになりました。
  クッキーの存在をチェックするために ``has()`` を使用してください。
* ``Cake\Http\ResponseEmitter::emit()`` のシグネチャが変更され、 2 番目の引数がなくなりました。
* ``App.mergeFilesAsObjects`` のデフォルト値は ``true`` になりました。アプリケーションがファイルアップロードを使用する場合、
  このフラグを ``false`` に設定することで、 3.x の動作との互換性をできます。
* ``Cake\Http\Response::getCookie()`` によって返される配列キーが変更されました。
  ``expire`` が ``expires`` に、 ``httpOnly`` が ``httponly`` に変わりました。
