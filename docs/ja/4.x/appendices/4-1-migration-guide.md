# 4.1 移行ガイド

CakePHP 4.1 は 4.0 からのAPI互換アップグレードです。
このページでは、4.1で追加された非推奨事項と機能の概要を説明します。

## 4.1.0へのアップグレード

CakePHP 4.1.0にアップグレードするには、次の Composer コマンドを実行してください。:

    php composer.phar require --update-with-dependencies "cakephp/cakephp:4.1.x"

## 非推奨

4.1では、いくつかの非推奨機能が導入されています。
これらの機能はすべて 4.x の間は継続されますが、5.0 で削除されます。
非推奨機能の更新を自動化するには、\`upgrade tool \<upgrade-tool-use\>\` を使用します。:

``` text
bin/cake upgrade rector --rules cakephp41 <path/to/app/src>
```

> [!NOTE]
> これはCakePHP 4.1の変更点のみを更新します。CakePHP 4.0の変更を最初に適用していることを確認してください。

### Controller

- `PaginatorComponent` の `sortWhitelist` オプションは非推奨になりました。
  代わりに、`sortableFields` を使用してください。
- `PaginatorComponent` の `whitelist` オプションは非推奨になりました。
  代わりに、`allowedParameters` を使用してください。

### Database

- `TableSchema::getPrimary()` は非推奨になりました。
  代わりに、 `getPrimaryKey()` を使用してください。
- `Cake\Database\Schema\BaseSchema` は
  `Cake\Database\Schema\SchemaDialect` に名前が変更されました。
- `Cake\Database\Schema\MysqlSchema` は
  `Cake\Database\Schema\MysqlSchemaDialect` に名前が変更されました。
- `Cake\Database\Schema\SqliteSchema` は
  `Cake\Database\Schema\SqliteSchemaDialect` に名前が変更されました。
- `Cake\Database\Schema\SqlserverSchema` は
  `Cake\Database\Schema\SqlserverSchemaDialect` に名前が変更されました。
- `Cake\Database\Schema\PostgresSchema` は
  `Cake\Database\Schema\PostgresSchemaDialect` に名前が変更され、内部マークされました。
- `DateTimeType::setTimezone()` は非推奨になりました。
  代わりに、 `setDatabaseTimezone()` を使用してください。
- `FunctionBuilder::cast([...])` に対するマジックメソッド署名は非推奨になりました。
  代わりに、 `FunctionBuilder::cast('field', 'type')` を使用してください。
- `Cake\Database\Expression\Comparison` は
  `Cake\Database\Expression\ComparisonExpression` に名前が変更されました。

### Datasource

- `Paginator` の `sortWhitelist` オプションは非推奨になりました。
  代わりに、 `sortableFields` を使用してください。
- `Paginator` の `whitelist` オプションは非推奨になりました。
  代わりに、 `allowedParameters` を使用してください。

### Form

- `Form::schema()` は非推奨になりました。
  代わりに、 `Form::getSchema()` か `Form::setSchema()` を使用してください。

### Http

- `CsrfProtectionMiddleware::whitelistCallback()` は非推奨になりました。
  代わりに、 `skipCheckCallback()` を使用してください。
- `ServerRequest::input()` は非推奨になりました。
  PHP の生の入力を文字列として取得するには、 `(string)$request->getBody()` を使用してください。
  `BodyParserMiddleware` を使ってリクエストのボディを解析してください。そうすれば、 `$request->getParsedBody()` で配列やオブジェクトとして利用できるようにします。
- フレームワーク内でのクッキー作成との一貫性を高めるために、
  `CsrfProtectionMiddleware` の `httpOnly` オプションは、`httponly` に変更されました。

### ORM

- `QueryExpression::or_()` と `QueryExpression::and_()` は非推奨になりました。
  代わりに `or()` と `and()` を使用してください。

### Routing

- `Cake\Routing\Exception\RedirectException` は非推奨になりました。
  代わりに、 `Cake\Http\Exception\RedirectException` を使用してください。

### View

- `Form/ContextInterface::primaryKey()` は非推奨になりました。
  代わりに、 `getPrimaryKey()` を使用してください。

## Behaviorの変更

以下の変更はどのメソッドの署名も変更しませんが、メソッドのセマンティクスや動作を変更します。

### Database

- MySQL: （未だにブーリアン型にマップされている） `TINYINT(1)` 以外の整数の表示幅は無視されるようになりました。
  MySQL 8では表示幅は非推奨です。

### Http

- アップロードしたファイルの正規化は、`ServerRequest` から `ServerRequestFactory` に移動されました。
  これは、ネストされたファイルアップロード配列を使用するリクエストオブジェクトを作成している場合、
  テストに影響を与える可能性があります。
  `IntegrationTestCaseTrait` を使ったテストは変更する必要はありません。

### ORM

- `Cake\ORM\TableRegistry` は非推奨になりました。
  テーブルロケーターインスタンスを取得するためには、
  代わりに `Cake\ORM\Locator\LocatorAwareTrait::getTableLocator()` か
  `Cake\Datasource\FactoryLocator::get('Table')` を使用してください。
  `Controller`, `Command`, `TestCase` のようなクラスは、
  すでに `Cake\ORMLocator\LocatorAwareTrait` を使用しています。
  そのため、これらのクラスでは `$this->getTableLocator()->get('ModelName')` を使うことができます。
- BelongsToMany アソシエーションは、ジャンクションテーブルの BelongsTo アソシエーションで設定された bindingKey を尊重するようになりました。
  以前は、ターゲットテーブルの主キーが常に代わりに使用されていました。
- アソシエーション名が適切に大文字と小文字を区別するようになりました。
  そのため、 `Query::contain()` や `Table::hasMany()` のような関数で参照する際には、適切にマッチさせなければなりません。
- `Cake\ORM\AssociationCollection` は、内部で保持しているオブジェクトマップのキーを生成するために、
  アソシエーション名を小文字にしなくなりました。

### TestSuite

- `TestCase::setAppNamespace()` は、保存と復元が簡単になるように、以前のアプリの名前空間を返すようになりました。
- MySQL予約キーワードの変更に伴い、GroupsFixtureの名前がSectionsFixtureに変更されました。

### View

- フォームヘルパーのデフォルトの値のソースが `context` の代わりに `data, context` に設定されるようになりました。
  もし `setValueSources()` を使って値のソースを変更する場合は、コードを更新する必要があるかもしれません。
- CakePHPで提供されている `FormHelper` コンテキストクラスは、コンストラクタに `$request` オブジェクトを取らなくなりました。

## 新機能

### Datasource

- `EntityInterface::getAccessible()` が追加されました。

### Console

- 環境変数 `NO_COLOR` が設定されている場合、すべての出力に色の ANSI エスケープコードは含まれません。
  詳しくは [no-color.org](https://no-color.org/) を参照してください。
- コマンドはシェルが `$io->setInteractivate(false)` を使っていたのと同じように対話モードを無効にすることができるようになりました。
  これは、必要に応じてプロンプトを回避し、デフォルト値を使用します。
  `--quiet` / `-q` を使うことで、既存のすべてのコマンドに対して直接呼び出すことができるようになりました。

### Database

- MySQL 8 がサポートされました。テストも行われています。
- SQL関数の集約を表現するために `AggregateExpression` を追加しました。
  `FunctionsBuilder::aggregate()` は新しい集約SQL関数をラップするのに使えます。
- 任意の集約式にウィンドウ関数のサポートが追加されました。
  `AggregateExpression` はウィンドウ式をラップしたため、連鎖的な呼び出しによって任意のインスタンスを簡単に拡張することができます。
- 集約関数が `FILTER (WHERE ...)` 区をサポートしました。
- PostgreSQL と SQLServer は エイリアスを持つ集約関数に対して `HAVING` 条件をサポートするようになりました。
- `FunctionsBuilder::cast()` が追加されました。
- Common Table Expression (CTE) が追加されました。
  CTEは、\`<Query::with>()\` を用いてクエリにアタッチすることが可能です。
- `Query::orderAsc()` と `Query::orderDesc()` はClosureをフィールドとして受け付けるようになり、
  提供されている `QueryExpression` オブジェクトを使って複雑なオーダー式を構築できるようになりました。

### Error

- ウェブコンテキストではHTMLを、CLIコンテキストではANSIスタイルで出力するようになりました。
  周期的な構造や繰り返しオブジェクトの出力がよりシンプルになりました。
  周期的なオブジェクトは一度だけダンプされ、完全な値に戻るために参照 ID を使用します。
- `Debugger::addEditor()` と `Debugger::setEditor()` が追加されました。
  これらのメソッドにより、エディタのフォーマットを追加したり、好みのエディタを設定したりすることができます。
- 設定値として `Debugger.editor` が追加されました。この値は、優先されるエディタのリンク形式として使用されます。
- `ErrorHandlerMiddleware` は `Http\Exception\RedirectException` をハンドルするようになり、
  それらの例外を HTTP リダイレクトレスポンスに変換するようになりました。
- `BaseErrorHandler` は設定されたエラーロガーを使ってPHPの警告やエラーをログに記録するようになりました。
- カスタムエラーロガーに必要なインターフェイスを正式なものにするために `ErrorLoggerInterface` が追加されました。

### Form

- `Form::set()` を追加しました。
  このメソッドは `View::set()` や `Controller::set()` と同じようにフォームオブジェクトにデータを追加することができます。

### Http

- `BaseApplication::addOptionalPlugin()` を追加しました。
  このメソッドは、プラグインの読み込みや、開発者依存のため存在しない可能性のあるプラグインのエラー処理を行います。
- `Cake\HttpException\RedirectException` を追加しました。
  この例外は Routing パッケージの `RedirectException` を置き換えるもので、 アプリケーションのどこでも発生させることができます。
- `CsrfProtectionMiddleware` は `samesite` 属性を設定したクッキーを作成することができるようになりました。
- `Session::read()` が2番目のパラメータでデフォルト値を設定できるようになりました。
- `Session::readOrFail()` は、キーが見つからなかった場合に例外を発生させたい場合に便利な `read()` 操作のラッパーとして追加されました。

### I18n

- `Time` , `FrozenTime` , `Date` , `FrozenDate` の `setJsonEncodeFormat` メソッドは、
  カスタムの文字列を返すための callable を受け入れるようになりました。
- `parseDateTime()` と `parseDate()` は、 `disableLenientParsing()` を使用して、簡潔な構文解析を無効にすることができます。
  デフォルトでは有効になっています。（IntlDateFormatter と同様です）

### Log

- ログメッセージに `{foo}` スタイルのプレースホルダを含めることができるようになりました。
  これらのプレースホルダは `$context` パラメータの値に置き換えられます。

### ORM

- ORMはリクエストデータから各エンティティがマージされた後に
  `Model.afterMarshal` イベントをトリガーするようになりました。
- `TranslateBehavior` を使用しているときに、 `locale` finderオプションを使用して、
  単一の検索呼び出しのロケールを変更することができます。
- `Query::clearResult()` が追加されました。
  このメソッドを使うと、クエリの結果を削除して再実行できるようになります。
- `Table::delete()` は、cascadeCallbackの操作中に依存するアソシエーションが削除に失敗した場合、
  削除操作を中止してfalseを返すようになりました。
- `Table::saveMany()` は保存されたエンティティに対して
  `Model.afterSaveCommit` イベントを起動するようになりました。

### Routing

- ルートパス文字列からURL配列を素早く生成するための便利な関数 `urlArray()` が導入されました。

### TestSuite

- `FixtureManager::unload()` は、フィクスチャがアンロードされている間、
  テストの *end* でテーブルを切り詰めることはなくなりました。
  テーブルはフィクスチャのセットアップ中にも切り捨てられます。
  切り捨て処理が少なくなったため、テストスイートの実行がより速くなるはずです。
- メールボディアサーションは、失敗メッセージにメールの内容を含めるようになり、
  テストのデバッグがより簡単になりました。
- チェーン可能なフィクスチャ設定を可能にするために、`TestCase::addFixture()` が追加されました。
  これは、IDEでも自動補完可能です。

### View

- `TextHelper::::slug()` を追加しました。
  このメソッドは、 `Cake\Utility\Text::slug()` を委譲します。
- ヘルパーを追加するためのチェイン可能なラッパーメソッドとして
  `ViewBuilder::addHelper()` を追加しました。
- ルートパスからのリンクやURLをより簡単に作成するために、ビュー層でIDEをサポートした
  `HtmlHelper::linkFromPath()` と `UrlHelper::urlFromPath()` を追加しました。

### Utility

- `Hash::combine()` は `$keyPath` パラメータに `null` を指定できるようになりました。
  nullを指定すると、数値インデックス付きの出力配列になります。
