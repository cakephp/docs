# 3.6 移行ガイド

CakePHP 3.6 は、3.5 の API の完全上位互換です。
このページでは、3.6 の変更と改善についてのアウトラインを紹介します。

3.6.x にアップグレードするには、次の Composer コマンドを実行してください。

``` bash
php composer.phar require --update-with-dependencies "cakephp/cakephp:3.6.*"
```

## 非推奨

以下は、非推奨のメソッド、プロパティーと動作の一覧です。
これらの機能は、4.0.0 以後に削除されるまで機能し続けます。

- `bin/cake orm_cache` は、今は `bin/cake schema_cache` です。
- `Cake\Cache\Engine\ApcEngine` は、拡張モジュール名を反映し
  `Cake\Cache\Engine\ApcuEngine` に名前変更されました。
- `Cake\ORM\Table::association()` は非推奨です。代わりに `getAssociation()`
  を使用してください。
- `Xcache` キャッシュエンジンは非推奨になります。Xcache 拡張は
  もはや活発にメンテナンスされていません。もし xcache を使っているなら、代わりに
  APCu、Memcached または Redis の採用を考えてください。
- `Router::setRequestInfo()` に配列の一覧を渡すことは非推奨です。代わりに
  `ServerRequest` のインスタンスを渡してください。
- `Cake\Controller\Controller:$name` は protected になります。
  他のコンテキストの中でコントローラーの名前にアクセスするには、
  `Controller::getName() と setName()` を使用してください。
- `Cake\Controller\Controller:$plugin` は protected になります。
  他のコンテキストの中でコントローラーのプラグインにアクセスするには、
  `Controller::getPlugin() と setPlugin()` を使用してください。
- `Cake\Controller\Controller:$autoRender` は protected になります。代わりに
  `enableAutoRender() と disableAutoRender() と isAutoRenderEnabled()` を使用してください。
- `ValidationSet::isPresenceRequired()` と `ValidationSet::isEmptyAllowed()`
  のセッターモードは非推奨です。代わりに `requirePresence()` と `allowEmpty()`
  を使用してください。
- `Cake\Form\Form::validator()` は非推奨です。代わりに `getValidator()` と
  `setValidator()` を使用してください。
- `Cake\ORM\TableRegistry` の static な API は非推奨になります。代わりにテーブルロケーターを
  直接使用してください。グローバルな `Cake\ORM\Locator\TableLocator` は、
  `Cake\ORM\TableRegistry::getTableLocator()` を介するか、
  `Cake\ORM\Locator\LocatorAwareTrait` を使用してアクセスすることができます。
- `Cake\View\Helper\FormHelper::widgetRegistry()` は非推奨です。代わりに
  `getWidgetLocator()` と `setWidgetLocator()` を使用してください。
- `Cake\ORM\Behavior\TranslateBehavior::locale()` は非推奨です。代わりに
  `getLocale()` と `setLocale()` を使用してください。
- `Cake\Datasource\QueryTrait::formatResults()` のゲッター部分は非推奨です。代わりに
  `getResultFormatters()` を使用してください。
- `Cake\Datasource\QueryTrait::mapReduce()` のゲッター部分は非推奨です。代わりに
  `getMapReducers()` を使用してください。
- `Cake\ORM\Query::contain()` のゲッター部分は非推奨です。代わりに
  `getContain()` を使用してください。
- `Cake\Datasource\QueryInterface::repository()` のゲッター部分は非推奨です。代わりに
  `getRepository()` を使用してください。
- `Cake\Database\Type::map()` のゲッター部分は非推奨です。代わりに
  `getMap()` を使用してください。
- `Cake\Database\Type::map()` で完全な型マップを設定することは非推奨です。代わりに
  `setMap()` を使用してください。
- `Cake\Database\Type::map()` へオブジェクトで `$className` を渡すことは非推奨です。代わりに
  `set()` を使用してください。

いくつかのクラスは *名前変更* されました。古い名前は 4.0 まで動作しますが、
非推奨警告が表示されます。

- `Cake\Network\Exception\BadRequestException` は、
  `Cake\Http\Exception\BadRequestException` に名前変更されます。
- `Cake\Network\Exception\ConflictException` は、
  `Cake\Http\Exception\ConflictException` に名前変更されます。
- `Cake\Network\Exception\ForbiddenException` は、
  `Cake\Http\Exception\ForbiddenException` に名前変更されます。
- `Cake\Network\Exception\GoneException` は、
  `Cake\Http\Exception\GoneException` に名前変更されます。
- `Cake\Network\Exception\HttpException` は、
  `Cake\Http\Exception\HttpException` に名前変更されます。
- `Cake\Network\Exception\InternalErrorException` は、
  `Cake\Http\Exception\InternalErrorException` に名前変更されます。
- `Cake\Network\Exception\InvalidCsrfTokenException` は、
  `Cake\Http\Exception\InvalidCsrfTokenException` に名前変更されます。
- `Cake\Network\Exception\MethodNotAllowedException` は、
  `Cake\Http\Exception\MethodNotAllowedException` に名前変更されます。
- `Cake\Network\Exception\NotAcceptableException` は、
  `Cake\Http\Exception\NotAcceptableException` に名前変更されます。
- `Cake\Network\Exception\NotFoundException` は、
  `Cake\Http\Exception\NotFoundException` に名前変更されます。
- `Cake\Network\Exception\NotImplementedException` は、
  `Cake\Http\Exception\NotImplementedException` に名前変更されます。
- `Cake\Network\Exception\ServiceUnavailableException` は、
  `Cake\Http\Exception\ServiceUnavailableException` に名前変更されます。
- `Cake\Network\Exception\UnauthorizedException` は、
  `Cake\Http\Exception\UnauthorizedException` に名前変更されます。
- `Cake\Network\Exception\UnavailableForLegalReasonsException` は、
  `Cake\Http\Exception\UnavailableForLegalReasonsException` に名前変更されます。
- `Cake\Network\Session` は、 `Cake\Http\Session` に名前変更されます。
- `Cake\Network\Session\DatabaseSession` は、
  `Cake\Http\Session\DatabaseSession` に名前変更されます。
- `Cake\Network\Session\CacheSession` は、
  `Cake\Http\Session\CacheSession` に名前変更されます。
- `Cake\Network\CorsBuilder` は、 `Cake\Http\CorsBuilder` に名前変更されます。
- `Cake\View\Widget\WidgetRegistry` は、
  `Cake\View\Widget\WidgetLocator` に名前変更されます。

## 非推奨警告の無効化

非推奨警告は、将来のバージョンの CakePHP の準備に役立つように意図されていますが、
コードの更新は段階的な作業になる可能性があります。
新しい方法の採用に取り組んでいる間、非推奨警告を無効にすることができます。
**config/app.php** の中で `Error.errorLevel` を設定できます。 :

    // config/app.php の中で
    'Error' => [
        'errorLevel' => E_ALL ^ E_USER_DEPRECATED
    ]

非推奨警告が解消された後は、エラーレベルを `E_ALL` に設定して、
非推奨のメソッドの今後の使用を防ぐことができます。

## 振る舞いの変更

以下の変更は、API 互換性はありますが、あなたのアプリケーションに影響を及ぼし得る
振る舞いのわずかな差異があります。

- `Cake\Utility\Security::randomBytes()` は、PHP5 で
  セキュアーなエントロピーのソースが見つからない場合に例外をスローします。
- `SecurityComponent` で生成されたトークンには、ユーザー/セッション間のトークンの再利用を防ぐために、
  ユーザーのセッション ID が含まれるようになりました。これにより、セキュリティトークンの値が変更され、
  以前のバージョンの CakePHP で作成されたフォームは 3.6 で検証に失敗します。
- `Cake\Database\Query::page()` は、 ページの値が 1 より小さい場合、例外が発生します。
- ページネーションでは、すべてのページの複数のフィールドを並べ替えることができます。
  以前は、最初のページのみを複数の列でソートすることができました。
  さらに、クエリー文字列で定義されたソート条件は、デフォルトの順序を完全に置き換えるのではなく、
  デフォルトの順序パラメーターの *先頭に追加* されます。
- タスククラスが見つからない場合、シェルクラスは例外をスローするようになりました。
  以前は無効なタスクは暗黙のうちに無視されました。
- 可能であれば、CakePHP 内部で例外を連鎖させ、根本的なエラーの原因を露呈させることができます。
- MySQL コネクションのエンコーディングは `utf8mb4` (4バイトユニコード) がデフォルトです。
  旧デフォルトの `utf8` を引き続き使用したい場合は、 `config/app.php` の中で、
  アプリケーションのデータソースのエンコーディングを 'utf8' に設定してください。
- APCu と Wincache エンジンは、TTL を持つデータに対して別々の `_expires` キーを
  設定しなくなりました。代わりに、キャッシュエンジンのネイティブ TTL 機能に依存します。
  デフォルトでは、単一のリクエストと CLI スクリプトに対する APCu で作成された
  すべてのエントリーの有効期限は同じになります。この動作を変更するには
  `apc.use_request_time` を使うことができます。
- `Router::parseNamedParams()` は、もはやリクエストオブジェクトを直接変更しません。
  代わりに、このメソッドの戻り値を使用して、変更されたリクエストにアクセスする必要があります。
- 文字列値に属性マッチャーを使用するとき、 `Hash::extract()` は、もはや整数 `0` と一致しません。
- コンソール環境は `--plugin` オプションで指定されたプラグインを自動的にロードしなくなりました。
  その代わりに、アプリケーションのブートストラップによって必要なプラグインがすべてロードされるようにする
  必要があります。
- `Cake\Http\CorsBuilder::build()` はもはやレスポンスを変更しません。
  `build()` が返す更新されたレスポンスを使用する必要があります。

## Cache

- Fallback エンジンは、どのキャッシュ設定でも `fallback = false` をセットすることで
  無効にすることができます。

## Collection

- `appendItem()`, `prepend()`, `prependItems()` メソッドが `CollectionTrait`
  に追加されました。

## Configure

- `consumeOrFail()` が追加され、データが存在することを期待して読み込む API を完成させました。

## Console

CLI ツールを構築する新しい方法が追加されました。
シェルとタスクには、互換性を損なうことなく修正するのが難しいいくつかの欠点があります。
`Cake\Console\Command` はコンソールアプリケーションを構築するための推奨方法として、
長期的に `Shell` を置き換えます。詳しくは [コンソールコマンド](../console-and-shells/commands)
セクションをご覧ください。

- `ConsoleOptionParse::enableSubcommandSort()` が追加されました。このメソッドを使用すると、
  生成されたヘルプテキスト内のサブコマンドの自動ソートを無効にすることができます。

## Core

- プラグインは、 [Plugin Objects](../plugins#plugin-objects) を定義できるようになります。これらのクラスはオプションであり、
  プラグインがミドルウェアおよびコンソールコマンドをホストアプリケーションに追加できるようにします。
  プラグインを設定および定義するためのクラスベースの方法です。
- より詳細なエラーメッセージを作成するときに、正しいクラス/型名を取得するために
  `getTypeName()` が追加されました。

## Database

- `Query::identifier()` が追加されました。
  このメソッドを使用すると、複雑なクエリーで使用する識別子の式を簡単に作成できます。
- 長期間実行されているスクリプトで接続がタイムアウトすると、データベース接続は自動的に再確立されます。
- `Cake\Database\Type\BatchCastingInterface` が追加されました。
  このインターフェイスにより、型クラスは、すべての列を一括して操作することによって
  キャスト操作を最適化できます。このインターフェイスは現在カスタムタイプで使用でき、
  4.x のコアタイプで使用されます。
- `Cake\Database\Type\DateTimeType::setTimezone()` が追加されました。
  このメソッドを使用すると、datetime オブジェクトをデータベースに挿入する前に変換する
  タイムゾーンを設定できます。データベースから読み取られる日時データは変更されません。
- `Cake\Database\Statement\StatementDecorator::fetchAssoc()` が追加されました。
- `Cake\Database\Statement\BufferedStatement::fetchAssoc()` が追加されました。
- `Cake\Database\Statement\StatementDecorator::FETCH_TYPE_NUM` が追加されました。
- `Cake\Database\Statement\StatementDecorator::FETCH_TYPE_ASSOC` が追加されました。
- `Cake\Database\Statement\StatementDecorator::FETCH_TYPE_OBJ` が追加されました。

## Datasource

- `binaryuuid` という新しい抽象型が追加されました。
  MySQL と SQLite では、 `BINARY(16)` がカラムの型として使われます。
  SQLServer と、Postgres はネイティブの UUID 型を使用します。

## Event

- `Cake\Event\EventInterface` が、今後より良いタイプヒントが得られるようにするために
  追加されました。

## Form

- Form クラスは `_validatorClass` プロパティーをサポートするようになりました。
  これは `ORM\Table` と同じように動作します。

## Http

- `Response::withAddedLink()` が追加され、 `Link` ヘッダーの作成が簡単になりました。
- `BodyParserMiddleware` が追加されました。

## I18n

- FormHelper に残った２つの i18n 翻訳文字列 `'Edit %s'` と `'New %s'` は、
  `'Edit {0}'` と `'New {0}'` になります。
  CakePHP からの翻訳メッセージを使用している場合は、PO ファイル内の翻訳を調整してください。

## Mailer

- `Email` のさまざまな電子メールアドレス設定メソッドは、個々のプロパティーをリセットできるように
  `[]` を受け入れるようになりました。

## ORM

- `EntityTrait::isEmpty()` と `EntityTrait::hasValue()` が追加されました。
- `Table::getAssociation()` は、 `.` で区切られたパス (例 `Users.Comments`)
  を使って深くネストされた関連付けを読むことができるようになりました。
  このメソッドは、未知の関連付けを取得するときに例外を発生させます。
- `Table::addBehaviors()` が追加され、一度に複数のビヘイビアーを追加するのが簡単になりました。
- `Table::getBehavior()` が追加されました。
- `CounterCacheBehavior` コールバック関数はカウンタ値の更新をスキップするために
  `false` を返すことができます。
- `TimestampBehavior` は、常にミュータブルな time インスタンスを使用するのではなく、
  time オブジェクトを作成するときに正しいミュータブル/イミュータブルクラス型を使用するようになりました。
- `Query::selectAllExcept()` が追加されました。
- `Query::whereInList()` と `Query::whereNotInList()` は、 `IN` と `NOT IN`
  条件を囲んだ１つのラッパーとして追加されています。

## Routing

- `Cake\Routing\Route\EntityRoute` が追加されました。
  このルートクラスは、エンティティーからのデータを必要とするルートを構築するのを容易にします。
  詳しくは [Entity Routing](../development/routing#entity-routing) セクションをご覧ください。
- ルーティング変数は、 `{var}` スタイルのプレースホルダーを使用できます。
  このスタイルは、中間の語の変数を定義できます。 `{var}` プレースホルダーと
  `:var` スタイルプレースホルダーを組み合わせることはできません。
- `Router::routeExists()` が追加されました。
  このメソッドを使用すると、ルート配列を有効なルートに解決できるかどうかを確認できます。
- ルート接続でコンパクトな '文字列ターゲット'、例えば `Bookmarks::index`
  を使用できるようになりました。詳しくは [Routes Configuration](../development/routing#routes-configuration) をご覧ください。
- `RoutingMiddleware` はルートによって作成されたルートコレクションをキャッシュすることができます。
  ルートをキャッシュすると、アプリケーションの起動時間が大幅に短縮されます。
  また、インスタンス化しカレントオブジェクト（`$this`）をプラグインルーティングに渡す必要があります。

## Shell

- `cake assets copy` コマンドには、プラグインアセットがすでにアプリケーションの
  webroot に存在する場合、上書きするための `--overwrite` オプションが追加されました。

## Utility

- `Security::randomString()` が追加されました。

## Validation

- `Validation::compareFields()` は `Validation::compareWith()`
  のより柔軟なバージョンとして追加されました。
- `Validator::notSameAs()` が追加され、
  フィールドが別のフィールドと同じでないかどうかを簡単に確認できます。
- 新しいフィールド比較メソッドが追加されました。 `equalToField()`,
  `notEqualToField()`, `greaterThanField()`,
  `greaterThanOrEqualToField()`, `lessThanField()`,
  `lessThanOrEqualToField()` が追加されました。
- Validator ルールは、 `rule` キーが定義されていない場合、
  ルールエイリアスをルールメソッドとして使用します。
- `Validator::addNested()` と `addNestedMany()` は、他のバリデーターメソッドと同様に
  `when` と `message` パラメーターをサポートするようになりました。

## View

- `UrlHelper::script()`, `css()`, そして `image()` メソッドは `timestamp`
  オプションをサポートしています。このオプションを使用すると、単一のメソッド呼び出しに対して
  `Asset.timestamp` の設定を行うことができます。
- Cell クラスには `initialize()` フックメソッドが追加されました。
- `PaginatorHelper` はソート方向が変更されるたびにページを1にリセットします。
