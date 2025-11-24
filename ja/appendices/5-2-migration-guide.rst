5.2 移行ガイド
###################

5.2.0 リリースは 5.0 と後方互換性があります。
新機能が追加され、新たな非推奨機能が導入されます。
5.x で非推奨とされた機能は 6.0.0 で削除されます。

動作の変更
================

- ``ValidationSet::add()`` は、すでに定義されている名前でルールが追加された場合にエラーを発生させるようになりました。
  この変更は、ルールが誤って上書きされるのを防ぐことを目的としています。
- ``Http\Session`` は、無効なセッション・プリセットが使用された場合に例外を発生させるようになりました。
- ``FormProtectionComponent`` は、 ``Cake\Controller\Exception\FormProtectionException`` を発生させるようになりました。
  このクラスは ``BadRequestException`` のサブクラスであり、ログからフィルタリングできる利点があります。
- ``NumericPaginator::paginate()`` は、 ``SelectQuery`` インスタンスが渡された場合でも ``finder`` オプションを使用するようになりました。

非推奨
============

Console
-------

- ``Arguments::getMultipleOption()`` は非推奨になりました。代わりに ``getArrayOption()`` を使用してください。

Datasource
----------

- ``EntityInterface`` インスタンスを文字列にキャストする機能は非推奨となりました。
  代わりにエンティティを ``json_encode()`` してください。

- ``EntityInterface::set()`` を使って複数のエンティティフィールドを一括代入することは非推奨となりました。
  代わりに ``EntityInterface::patch()`` を使用してください。例えば、
  ``$entity->set(['field1' => 'value1', 'field2' => 'value2'])`` のような使い方は
  ``$entity->patch(['field1' => 'value1', 'field2' => 'value2'])`` に変更してください。

Event
-----

- イベントリスナーやコールバックから値を返すことは非推奨となりました。代わりに ``$event->setResult()`` を使用してください。
  また、イベントの伝播を停止したい場合は ``$event->stopPropogation()`` を使用してください。

View
----

- ``FormHelper`` の ``errorClass`` オプションは非推奨となり、テンプレート文字列の使用が推奨されます。
  アップグレードするには、 ``errorClass`` の定義をテンプレートセットに移動してください。
  詳細は :ref:`customizing-templates` を参照してください。


新機能
============

Console
-------

- ``cake counter_cache`` コマンドが追加されました。このコマンドは ``CounterCacheBehavior`` を使用しているモデルのカウンターを再生成するために使用できます。
- ``ConsoleIntegrationTestTrait::debugOutput()`` により、コンソールコマンドの統合テストのデバッグが容易になりました。
- ``ConsoleInputArgument`` は ``separator`` オプションをサポートするようになりました。
  このオプションにより、位置引数を ``,`` などの文字列で区切ることができ、
  CakePHP は引数を配列として分割して処理します。
- ``Arguments::getArrayArgumentAt()`` および ``Arguments::getArrayArgument()`` が追加されました。
  これらのメソッドにより、区切り文字 ``separator`` で区切られた位置引数を配列として取得できます。
- ``ConsoleInputOption`` は ``separator`` オプションをサポートするようになりました。
  このオプションにより、オプション値を ``,`` などの文字列で区切ることができ、
  CakePHP は引数を配列として分割して処理します。
- ``Arguments::getArrayArgumentAt()``、 ``Arguments::getArrayArgument()``、および
  ``Arguments::getArrayOption()`` が追加されました。これらのメソッドにより、
  区切り文字 ``separator`` で区切られた位置引数やオプションを配列として取得できます。

Database
--------

- ``nativeuuid`` 型が追加されました。この型により、MariaDB を使用した Mysql 接続で ``uuid`` カラムを利用できるようになりました。他のすべてのドライバーでは、 ``nativeuuid`` は ``uuid`` のエイリアスです。
- ``Cake\Database\Type\JsonType::setDecodingOptions()`` が追加されました。このメソッドにより、 ``json_decode()`` の ``$flags`` 引数の値を設定できます。
- ``CounterCacheBehavior::updateCounterCache()`` が追加されました。このメソッドにより、設定された関連付けのすべてのレコードのカウンターキャッシュ値を更新できます。
  同様の処理をコンソールから実行する ``CounterCacheCommand`` も追加されました。
- ``Cake\Database\Driver::quote()`` が追加されました。このメソッドは、プリペアドステートメントが使用できない場合に、SQL クエリで使用する値をクォートする方法を提供します。

Datasource
----------

- アプリケーションルールで ``Closure`` を使用してバリデーションメッセージを定義できるようになりました。
  これにより、エンティティの状態やバリデーションルールのオプションに基づいて動的なバリデーションメッセージを作成できます。

Error
-----

- カスタム例外に対して、 ``ErrorController`` で特定のエラーハンドリングロジックを定義できるようになりました。

ORM
---

- ``CounterCacheBehavior::updateCounterCache()`` が追加されました。このメソッドにより、設定された関連付けのすべてのレコードのカウンターキャッシュ値を更新できます。
- ``BelongsToMany::setJunctionProperty()`` および ``getJunctionProperty()`` が追加されました。
  これらのメソッドにより、中間テーブルのレコードをハイドレートする際に使用される ``_joinData`` プロパティをカスタマイズできます。
- ``Table::findOrCreate()`` は、第2引数に配列を直接渡してデータを指定できるようになりました。

TestSuite
---------

- ``TestFixture::$strictFields`` プロパティが追加されました。このプロパティを有効にすると、フィクスチャーのレコードリストにスキーマに存在しないフィールドが含まれている場合にエラーが発生します。

View
----

- ``FormHelper::deleteLink()`` が追加されました。これは、テンプレート内で ``DELETE`` メソッドを使用した削除リンクを簡単に作成できるラッパーです。
- ``HtmlHelper::importmap()`` が追加されました。このメソッドにより、JavaScript ファイルのインポートマップを定義できます。
- ``FormHelper`` は、フォームコントロールの div にクラスを適用するために ``containerClass`` テンプレートを使用するようになりました。デフォルト値は ``input`` です。

