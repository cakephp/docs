5.1 移行ガイド
###################

5.1.0 リリースは 5.0 と後方互換性があります。
新機能が追加され、新たな非推奨機能が導入されます。
5.x で非推奨とされた機能は 6.0.0 で削除されます。

動作の変更
================

- Connectionは、設定に ``read`` または ``write`` キーが存在する場合、その値に関係なく一意の読み取りおよび書き込みドライバーを作成するようになりました。
- FormHelper は、 ``required`` 属性が設定されている入力要素に対して ``aria-required`` 属性を生成しなくなりました。
  これらの要素では ``aria-required`` 属性は冗長であり、HTML のバリデーション警告を引き起こします。
  スタイリングやスクリプトで ``aria-required`` 属性を使用している場合は、アプリケーションを更新する必要があります。
- 重複した名前でアソシエーションを追加しようとすると例外が発生するようになりました。
  必要に応じて ``$table->associations()->has()`` を使って条件付きでアソシエーションを定義できます。
- テキストユーティリティおよび TextHelper の省略や最大長に関するメソッドは、
  ``...`` の代わりに UTF-8 文字の ``ellipsis`` を使用するようになりました。
- ``TableSchema::setColumnType()`` は、指定したカラムが存在しない場合に例外をスローするようになりました。
- ``PluginCollection::addPlugin()`` は、同じ名前のプラグインがすでに追加されている場合に例外をスローするようになりました。
- ``TestCase::loadPlugins()`` は、以前にロードされたプラグインをすべてクリアするようになりました。
  そのため、以降のテストで必要なすべてのプラグインを指定する必要があります。
- ``groups`` を使用する ``Cache`` 設定用のハッシュアルゴリズムが変更されました。
  すべてのキーに対して新しいグループプレフィックスのハッシュが生成されるため、キャッシュミスが発生します。
  完全にコールドキャッシュとなるのを避けるため、段階的なデプロイを検討してください。
- ``FormHelper::getFormProtector()`` は、従来の型に加えて ``null`` を返すようになりました。
  これにより動的なビューコードがエラーになりにくくなりますが、ほとんどのアプリケーションには影響しません。
- ``Table::findList()`` の ``valueSeparator`` のデフォルト値が ``;`` から半角スペースに変更されました。
- ``ErrorLogger`` は ``Psr\Log\LogTrait`` を使用するようになりました。
- ``Database\QueryCompiler::$_orderedUnion`` は削除されました。

非推奨
============

I18n
----

- ``_cake_core_`` キャッシュ設定キーは ``_cake_translations_`` に変更されました。

Mailer
------

- ``Mailer::setMessage()`` は非推奨となりました。このメソッドは直感的でない動作をし、利用頻度も非常に低いためです。


新機能
============

Cache
-----

- ``RedisEngine`` で Redis への TLS 接続を有効にする ``tls`` オプションがサポートされるようになりました。。
  ``ssl_ca``、``ssl_cert``、``ssl_key`` オプションを使用して Redis 用の TLS コンテキストを定義できます。

Command
-------

- ``bin/cake plugin list`` が追加され、利用可能なすべてのプラグイン、そのロード設定、およびバージョンを一覧表示できるようになりました。
- オプションの ``Command`` 引数に ``default`` 値を指定できるようになりました。
- ``BannerHelper`` が追加されました。このコマンドヘルパーは、テキストをカラフルな背景と余白付きのバナーとして整形できます。
- ``ConsoleOutput`` に ``info.bg``、``warning.bg``、``error.bg``、``success.bg`` のデフォルトスタイルが追加されました。

Console
-------

- ``Arguments::getBooleanOption()`` および ``Arguments::getMultipleOption()`` が追加されました。
- ``Arguments::getArgument()`` は、未知の引数名が指定された場合に例外をスローするようになりました。
  これにより、オプション名と引数名の混同を防ぐことができます。


Controller
----------

- コンポーネントでも、コントローラやコマンドと同様に、DIコンテナを使用して依存関係を解決し、コンストラクタの引数として受け取れるようになりました。

Core
----

- ``PluginConfig`` が追加されました。このクラスを使用すると、利用可能なすべてのプラグイン、そのロード設定、およびバージョンを取得できます。
- ``toString``、 ``toInt``、 ``toBool`` 関数が追加されました。これらの関数は、リクエストデータや他の入力値を型安全にキャストし、変換に失敗した場合は ``null`` を返します。
- ``pathCombine()`` が追加され、重複や末尾のスラッシュを気にせずパスを組み立てられるようになりました。
- ``BaseApplication`` および ``BasePlugin`` クラスに新しい ``events`` フックが追加されました。
  このフックは、アプリケーションのグルーバルイベントリスナーを登録する推奨方法です。詳しくは :ref:`Registering Listeners <registering-event-listeners>` を参照してください。

Database
--------

- ``point``、 ``linestring``、 ``polygon``、 ``geometry`` 型のサポートが追加されました。
  これらの型は地理空間やデカルト座標を扱う際に便利です。SQLite のサポートは内部的にテキストカラムを使用しており、
  データを地理空間値として操作するための関数はありません。
- ``SelectQuery::__debugInfo()`` に、クエリがどのコネクションロール用のものかが含まれるようになりました。
- ``SelectQuery::intersect()`` および ``SelectQuery::intersectAll()`` が追加されました。
  これらのメソッドにより、 ``INTERSECT`` および ``INTERSECT ALL`` 結合を使用したクエリを記述できるようになりました。
- ``intersect``、 ``intersect-all``、および ``set-operations-order-by`` 機能がサポートされるようになりました。
- 4.x に存在したバッファリングなしでレコードを取得する機能が復活しました。
  ``SelectQuery::enableBufferedResults()``、` `SelectQuery::disableBufferedResults()``、
  ``SelectQuery::isBufferedResultsEnabled()`` メソッドが再追加されました。

Datasource
----------

- ``RulesChecker::remove()``、 ``removeCreate()``、 ``removeUpdate()``、および
  ``removeDelete()`` メソッドが追加されました。これらのメソッドにより、ルールを名前で削除できるようになりました。


Http
----

- ``SecurityHeadersMiddleware::setPermissionsPolicy()`` が追加されました。このメソッドにより、``permissions-policy`` ヘッダー値を定義できるようになりました。
- ``Client`` はリクエスト送信時に ``HttpClient.beforeSend`` および ``HttpClient.afterSend`` イベントを発火するようになりました。
  これらのイベントを利用して、ログ記録、キャッシュ、テレメトリ収集などを行うことができます。
- ``Http\Server::terminate()`` が追加されました。
  このメソッドは ``Server.terminate`` イベントを発火し、fastcgi 環境ではレスポンス送信後にロジックを実行できます。
  その他の環境では ``Server.terminate`` イベントはレスポンス送信 *前* に実行されます。

I18n
----

- ``Number::formatter()`` および ``currency()`` は、丸め方法を上書きする ``roundingMode`` オプションを受け付けるようになりました。
- ``toDate`` および ``toDateTime`` 関数が追加されました。これらの関数は、リクエストデータや他の入力値を型安全にキャストし、変換に失敗した場合は ``null`` を返します。

ORM
---

- アソシエーションのファインダークエリで ``preserveKeys`` オプションを設定できるようになりました。
  これにより、 ``formatResults()`` と組み合わせて、アソシエーションのファインダー結果を連想配列として返すことができます。
- 名前に ``json`` を含む SQLite カラムを ``JsonType`` にマッピングできるようになりました。
  この機能は現時点ではオプトインであり、アプリで ``ORM.mapJsonTypeForSqlite`` 設定値を ``true`` にすることで有効になります。

TestSuite
---------

- CakePHP およびアプリのテンプレートは PHPUnit ``^10.5.5 || ^11.1.3"`` を使用するように更新されました。
- ``ConnectionHelper`` のメソッドがすべて static になりました。このクラスは状態を持たず、メソッドが static に更新されました。
- ``LogTestTrait`` が追加されました。この新しいトレイトにより、テスト内でログを簡単にキャプチャし、ログメッセージの有無をアサートできるようになりました。
- ``IntegrationTestTrait::replaceRequest()`` が追加されました。

Utility
-------

- ``Hash::insert()`` および ``Hash::remove()`` は、 ``array`` データに加えて ``ArrayAccess`` オブジェクトも受け付けるようになりました。

Validation
----------

- ``Validation::enum()`` および ``Validator::enum()`` が追加されました。これらのバリデーションメソッドにより、Backed Enum 値の検証が簡単になりました。
- ``Validation::enumOnly()`` および ``Validation::enumExcept()`` が追加されました。これらのメソッドにより、特定のケースの検証や、Backed Enum 値のバリデーションをさらに簡単に行うことができます。

View
----

- View cells は、アクションの前後で ``Cell.beforeAction`` および ``Cell.afterAction`` イベントを発火するようになりました。
- ``NumberHelper::format()`` は、丸め方法を上書きする ``roundingMode`` オプションを受け付けるようになりました。

Helpers
-------

- ``TextHelper::autoLinkUrls()`` に、リンクラベルの表示を改善するためのオプションが追加されました:
  * ``stripProtocol``: リンク先の先頭から ``http://`` や ``https://`` を取り除きます。デフォルトは無効です。
  * ``maxLength``: リンクラベルの最大長を指定します。デフォルトは無効です。
  * ``ellipsis``: リンクラベルの末尾に付加する文字列です。デフォルトはUTF8バージョンです。
- ``HtmlHelper::meta()`` で ``meta('csrfToken')`` を使うことで、現在の CSRF トークンを含む meta タグを生成できるようになりました。
