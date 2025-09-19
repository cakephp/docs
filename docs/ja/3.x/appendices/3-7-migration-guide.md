# 3.7 移行ガイド

CakePHP 3.7 は 3.6 の API の完全上位互換です。
このページでは、3.7 の変更と改善についてのアウトラインを紹介します。

3.7.x にアップグレードするには、次の Composer コマンドを実行してください。

``` bash
php composer.phar require --update-with-dependencies "cakephp/cakephp:3.7.*"
```

## 非推奨

以下は、非推奨のメソッド、プロパティーと動作の一覧です。
これらの機能は、4.0.0 以後に削除されるまで機能し続けます。

- `Cake\Form\Form::errors()` は非推奨です。代わりに `getErrors()` を使用してください。
- `Cake\Http\Client\Response::$headers` は非推奨です。代わりに `getHeaders()` または
  `getHeaderLine()` を使用してください。
- `Cake\Http\Client\Response::$body` は非推奨です。代わりに `getStringBody()`
  を使用してください。
- `Cake\Http\Client\Response::$json` は非推奨です。代わりに `getJson()` を使用してください。
- `Cake\Http\Client\Response::$xml` は非推奨です。代わりに `getXml()` を使用してください。
- `Cake\Http\Client\Response::$cookies` は非推奨です。代わりに `getCookies()`
  を使用してください。
- `Cake\Http\Client\Response::$code` は非推奨です。代わりに `getStatusCode()`
  を使用してください。
- `Cake\Http\Client\Response::body()` は非推奨です。代わりに `getStringBody()`
  を使用してください。
- `Cake\ORM\Association::className()` は非推奨になります。代わりに `getClassName()`
  と `setClassName()` を使用してください。
- 情報を読むために `Cake\Database\Query::join()` を使用することは非推奨です。
  代わりに `Query::clause('join')` を使用してください。
- 情報を読むために `Cake\Database\Query::from()` を使用することは非推奨です。
  代わりに `Query::clause('from')` を使用してください。
- `Cake\Database\Connection::logQueries()` は非推奨です。代わりに `enableQueryLogging()`
  と `isQueryLoggingEnabled()` を使用してください。
- `Cake\Http\Response::withCookie()` に文字列/配列パラメーターを設定することは非推奨です。
  代わりに `Cake\Http\Cookie\Cookie` インスタンスをわたす必要があります。
- `Cake\Validation\Validation::cc()` は `creditCard()` に名前が変更されました。
- `Cake\View\ViewVarsTrait::viewOptions()` は非推奨です。代わりに `viewBuilder()->setOptions()`
  を使用してください。
- `Cake\View\View::$request` は protected になります。他のコンテキストから
  Viewのリクエストインスタンスにアクセスするためには `View::getRequest()/setRequest()`
  を使用してください。
- `Cake\View\View::$response` は protected になります。他のコンテキストから
  Viewのリクエストインスタンスにアクセスするためには `View::getResponse()/setResponse()`
  を使用してください。
- `Cake\View\View::$templatePath` は protected になります。代わりに
  `getTemplatePath()/setTemplatePath()` を使用してください。
- `Cake\View\View::$template` は protected になります。代わりに
  `getTemplate()/setTemplate()` を使用してください。
- `Cake\View\View::$layout` は protected になります。代わりに
  `getLayout()/setLayout()` を使用してください。
- `Cake\View\View::$layoutPath` は protected になります。代わりに
  `getLayoutPath()/setLayoutPath()` を使用してください。
- `Cake\View\View::$autoLayout` は protected になります。代わりに
  `enableAutoLayout()/isAutoLayoutEnabled()` を使用してください。
- `Cake\View\View::$theme` は protected になります。代わりに
  `getTheme()/setTheme()` を使用してください。
- `Cake\View\View::$subDir` は protected になります。代わりに
  `getSubDir()/setSubDir()` を使用してください。
- `Cake\View\View::$plugin` は protected になります。代わりに
  `getPlugin()/setPlugin()` を使用してください。
- `Cake\View\View::$name` は protected になります。代わりに
  `getName()/setName()` を使用してください。
- `Cake\View\View::$elementCache` は protected になります。代わりに
  `getElementCache()/setElementCache()` を使用してください。
- `Cake\View\View::$Blocks` は protected になります。ブロックと対話するためには
  Viewのパブリックメソッドを使用してください。
- `Cake\View\View:$helpers` は protected になります。代わりに
  HelperRegistry と対話するためには `helpers()` を使用してください。
- `Cake\View\View::$uuids` は非推奨であり、4.0 で削除されます。
- `Cake\View\View::uuid()` は非推奨であり、4.0 で削除されます。
- `Cake\View\Cell::$template` は protected になります。代わりに
  `viewBuilder()->getTemplate()/setTemplate()` を使用してください。
- `Cake\View\Cell::$plugin` は protected になります。代わりに
  `viewBuilder()->getPlugin()/setPlugin()` を使用してください。
- `Cake\View\Cell::$helpers` は protected になります。代わりに
  `viewBuilder()->getHelpers()/setHelpers()` を使用してください。
- `Cake\View\Cell::$action` は protected になります。
- `Cake\View\Cell::$args` は protected になります。
- `Cake\View\Cell::$View` は protected になります。
- `Cake\View\Cell::$request` は protected になります。
- `Cake\View\Cell::$response` は protected になります。
- `Cake\View\ViewVarsTrait::$viewVars` は非推奨です。このパブリックプロパティーは、
  4.0.0 で削除されます。代わりに `set()` を使用してください。
- `Cake\Filesystem\Folder::normalizePath()` は非推奨です。代わりに
  `correctSlashFor()` を使用するべきです。
- `Cake\Mailer\Email::setConfigTransport()` は非推奨です。代わりに
  `Cake\Mailer\TransportFactory::setConfig()` を使用してください。
- `Cake\Mailer\Email::getConfigTransport()` は非推奨です。代わりに
  `Cake\Mailer\TransportFactory::getConfig()` を使用してください。
- `Cake\Mailer\Email::configTransport()` は非推奨です。代わりに
  `Cake\Mailer\TransportFactory::getConfig()/setConfig()` を使用してください。
- `Cake\Mailer\Email::configuredTransport()` は非推奨です。代わりに
  `Cake\Mailer\TransportFactory::configured()` を使用してください。
- `Cake\Mailer\Email::dropTransport()` は非推奨です。代わりに
  `Cake\Mailer\TransportFactory::drop()` を使用してください。
- 以下のビュー関連の `Cake\Mailer\Email` のメソッドは非推奨になりました。
  `setTemplate()` 、 `getTemplate()` 、 `setLayout()` 、 `getLayout()`
  `setTheme()` 、 `getTheme()` 、 `setHelpers()` および `getHelpers()` です。
  代わりにメールのビュービルダーを通して同じメソッドを使用してください。
  例えば、 `$email->viewBuilder()->getTemplate()` です。
- `Cake\Mailer\Mailer::layout()` は非推奨です。
  代わりに `$mailer->viewBuilder()->setLayout()` を使用してください。
- `Helper::$theme` は削除されました。代わりに `View::getTheme()` を使用してください。
- `Helper::$plugin` は削除されました。代わりに `View::getPlugin()` を使用してください。
- `Helper::$fieldset` と `Helper::$tags` は使用されていないので非推奨です。
- `Helper::$helpers` は protected になったため、ヘルパークラスの外からアクセスするべきではありません。
- `Helper::$request` は削除されました。
  代わりに `View::getRequest()`、`View::setRequest()` を使用してください。
- `Cake\Core\Plugin::load()` と `loadAll()` は非推奨です。代わりに
  `Application::addPlugin()` を使用するべきです。
- `Cake\Core\Plugin::unload()` は非推奨です。代わりに
  `Plugin::getCollection()->remove()` か `clear()` を使用してください。
- 以下の `Cake\Error\ExceptionRender` のプロパティは protected になりました。
  `$error` 、 `$controller` 、 `$template` および `$method` です。
- `TestCase::$fixtures` にてアンダースコアー形式のフィクスチャー名を使用することは非推奨です。
  代わりにキャメルケース形式の名前を使用してください。例えば、 `app.FooBar` や `plugin.MyPlugin.FooBar` です。

## 緩やかな非推奨

以下のメソッド、プロパティー、機能は非推奨になりますが、5.0.0 まで削除されません。

- `Cake\TestSuite\ConsoleIntegrationTestCase` は非推奨です。代わりに
  `Cake\TestSuite\ConsoleIntegrationTestTrait` をテストケースに含めるべきです。

## 振る舞いの変更

- `Cake\Database\Type\IntegerType` は SQL を生成しデータベースの結果を PHP の型に変換するときに
  値が数値ではない場合に例外を発生させるようになります。
- `Cake\Database\Statement\StatementDecorator::fetchAll()` は結果が見つからなかった時、
  `false` の代わりに空配列を返します。
- `Cake\Database\Statement\BufferedStatement` は `StatementDecorator` から継承しなくなり、
  そして、 `IteratorAggregate` インターフェイスを実装しなくなりました。代わりに、
  コレクションと一緒にステートメントを使うことをよりよくサポートするために、 `Iterator` インターフェイスを直接実装します。
- リクエストからのデータをエンティティーに変換するとき、 ORM は boolean 、integer 、float 、decimal 型のために
  非スカラーデータを `null` に変換します。
- `ExceptionRenderer` はカスタムアプリケーション例外クラスのハンドラーメソッドを **常に** 呼び出すようになりました。
  以前は、カスタム例外クラスハンドラーメソッドはデバッグモードのみで呼び出されていました。
- `Router::url()` `Router::url()` でURLを生成した時、デフォルトで `__method` キーを `GET` にします。

## 新機能

### Cache

- `ArrayEngine` が追加されました。このエンジンはメモリーキャッシュの実装において揮発性を提供します。
  永続的なキャッシュストレージを必要としないテストスイートや長期実行プロセスに最適です。

### Database

- `Cake\Database\FunctionsBuilder::rand()` が追加されました。

### Datasource

- `Paginator` は、一致するモデルのプレフィクス付きデフォルトソートフィールドも存在する場合、
  クエリー文字列内のプレフィクスのない `sort` 値をプライマリーモデルと一致させるようになりました。
  例えば、コントローラーがデフォルトソートの `['Users.name' => 'desc']` を定義していれば、
  `Users.name` か `name` のどちらかをソートキーとして使用できます。

### Error

- `ExceptionRenderer` は、例外処理時にプレフィクス付きのエラーコントローラーを探すようになりました。
  これにより、アプリケーション内の各ルーティングプレフィックスに対して、
  カスタムエラーコントローラーロジックを定義できます。
- `ErrorHandlerMiddleware` は以前の例外をログに含めるようになりました。

### Filesystem

- `Cake\Filesystem\Folder::normalizeFullPath()` が追加されました。

### Form

- `Cake\Form\Form::setData()` が追加されました。
  このメソッドはフォームのデフォルト値の定義を簡単にします。
- `Cake\Form\Form::getData()` が追加されました。

### Http

- `Cake\Http\ServerRequest::setTrustedProxies()` が追加されました。
- `curl` 拡張がインストールされている場合、 `Cake\Http\Client` はデフォルトで Curl ベースのアダプターを使用するようになりました。
- 新しい定数が `SecurityHeadersMiddleware` に追加されました。新しい定数は、
  HTTP ヘッダーのコンポーネントを構築するために使用されます。

### Mailer

- `Cake\Mailer\TransportFactory` と `Cake\Mailer\TransportRegistry` が追加されました。
  このクラスは、メールからトランスポート作成を抽出し、メールが将来的によりシンプルになることを可能にします。

### ORM

- `Cake\ORM\EntityTrait::hasErrors()` が追加されました。
  このメソッドはエンティティーがエラーを持っているかどうかを `getErrors()` よりも効率的にチェックできます。
- 更新は多くの関連付けデータを持つようになり、 `_ids` を尊重します。
  これにより、パッチ適用によって多くの関連付けが新しいエンティティーの作成と同じように機能し、多くの関連付けとの整合性が保たれます。

### Shell

- `cake i18n extract` は新しい `--relative-paths` オプションを追加しました。
  これは、POT ファイル内のパスのコメントを、絶対パスではなくアプリケーションのルートディレクトリーを基準にして作成します。
- `cake i18n extract` は新しい `--marker-error` オプションを追加しました。
  これは、POTファイル内のコメントとして非静的な値を使う翻訳関数の報告を可能にします。

### TestSuite

- 新しいアサーションメソッドが `IntegrationTestCase` に追加されました。
  - `assertResponseNotEquals()`
  - `assertHeaderNotContains()`
  - `assertRedirectNotContains()`
  - `assertFlashElement()`
  - `assertFlashElementAt()`
- `IntegrationTestCase` と `ConsoleIntegrationTestCase` によって提供されていたカスタムアサーションは、
  現在、制約クラスを通して実装されています。
- `TestCase::loadPlugins()` 、 `removePlugins()` および `clearPlugins()` は、
  `Plugin::load()` と `Plugin::unload()` が非推奨になったため、
  動的にロードされたプラグインを扱うのをより簡単にするために追加されました。
- `getMockForModel()` は `$methods` パラメーターに `null` をサポートします。
  これにより、元のコードを実行するモックを作成できます。これは、
  動作を PHPUnit モックオブジェクトがどのように機能するかに合わせます。
- メールのテストを容易にするために `EmailTrait` が追加されました。
- 統合アサーションのデフォルトメッセージは、可能であれば発生した例外からより多くのコンテキストを提供するように改善されました。

### Utility

- `Cake\Utility\Text::getTransliterator()` が追加されました。
- `Cake\Utility\Text::setTransliterator()` が追加されました。
- `Cake\Utility\Xml::loadHtml()` が追加されました。

### Validation

- `Cake\Validation\Validation::iban()` が国際的な銀行口座番号を検証するために追加されました。
- `Cake\Validation\Validator::allowEmptyString()` 、 `allowEmptyArray()` 、 `allowEmptyDate()` 、
  `allowEmptyTime()` 、 `allowEmptyDateTime()` および `allowEmptyFile()` が追加されました。
  これらの新しいメソッドは `allowEmpty()` に代わるもので、フィールドが空とみなすべきものをより細かく制御できます。

### View

- `FormHelper` は確認ボックス用に生成された Javascript スニペットをカスタマイズすることを可能にする
  `confirmJs` テンプレート変数をサポートしました。
- `FormHelper` はカスタムバリデーションメッセージから HTML5 の検証メッセージを設定するための
  `autoSetCustomValidity` オプションを持ちます。 詳しくは、 [Html5 Validity Messages](../views/helpers/form#html5-validity-messages) をご覧ください。
- `ViewBuilder` 、 `setVar()` 、 `setVars()` 、 `getVar()` 、 `getVars()` および
  `hasVar()` が追加されました。これらのメソッドは `ViewVarsTrait` に定義された
  public の `viewVars` プロパティーを置き換えます。
- `PaginatorHelper` はプレフィクスのないソートキーを、デフォルトモデルのモデルプレフィクスのついたものと一致させるようになります。
  これは `Cake\Datasource\Paginator` で加えられた変更でスムーズな操作を可能にします。
- `FormHelper` は 入力オプションで最大長が指定されていない場合は、`maxLength` バリデーションルールを読み、
  HTML 入力の `maxlength` 属性を自動的に定義します。
