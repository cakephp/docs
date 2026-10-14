# 統合テスト

統合テストは、アプリケーションにリクエストを送り、そのレスポンスを確認するテストです。
`IntegrationTestTrait` は URL とデータからリクエストを組み立て、本物の `Dispatcher` を通して
ディスパッチします (ディスパッチャー・フィルター、ルーティング、コンポーネント、コントローラー、
ビュー、レイアウトがすべて動き、モックは使いません)。そして `CakeResponse` をブラウザーに送る代わりに
保持します。そのあと `assert*()` メソッドで、ステータスコード、リダイレクト、ヘッダー、ボディ、
描画されたテンプレートとレイアウト、セッション、フラッシュメッセージ、Cookie を確認します。
`EmailTrait` を使うと、リクエスト中に送信されたメールも確認できます。

すべて PHPUnit のプロセス内で実行されます。Web サーバーもブラウザーも使わないため、
1 リクエストは数ミリ秒で終わります。

::: pieceofcake2
`IntegrationTestTrait` と `EmailTrait` は、CakePHP 4.x/5.x からのバックポートとして v2.12.4 で
追加されました。メソッド名と動作は CakePHP 5 に合わせているため、アプリケーションを CakePHP 5 に
移行するときもテストの変更はわずかで済みます。
:::

<a id="when-to-use-integration-tests"></a>

## 統合テストを使う場面

CakePHP アプリケーションのテストは、通常いくつかのレベルで行います
([テストの種類](/ja/development/testing#types-of-tests) を参照してください)。統合テストは、
[`ControllerTestCase::testAction()`](/ja/development/testing#testing-controllers) で書いていた
コントローラーのテストの代わりになります。

| | `ControllerTestCase::testAction()` | `IntegrationTestTrait` |
| --- | --- | --- |
| 基底クラス | `ControllerTestCase` | 任意のテストケース (通常は `CakeTestCase`) |
| コントローラー | `generate()` でモックを作成 (`_stop()` やコンポーネントをモックにできる) | `Dispatcher` が生成する本物のコントローラー |
| リクエスト | `testAction($url, ['method' => ..., 'data' => ...])` | `get()`、`post()`、`put()`、`patch()`、`delete()`、`head()`、`options()` |
| ディスパッチャー・フィルター | 実行されない | 実行される (`Dispatcher.filters`) |
| `SecurityComponent` | `_validatePost()` をモックにするか無効化する | `enableSecurityToken()` と `enableCsrfToken()` が正しいトークンを追加する |
| リダイレクト | `_stop()` をモックにして `exit` を回避し、`$this->headers['Location']` を読む | `exit` は自動的に置き換えられる。`assertRedirect()` で確認する |
| 結果 | `$this->vars`、`$this->view`、`$this->contents`、`$this->headers`、`$this->result` | `viewVariable()`、`$this->_response`、`$this->_controller`、アサーション |
| 例外 | テストに投げられる | 本番と同じようにエラーページとして描画される。`disableErrorHandlerMiddleware()` で投げるようにできる |
| セッション、Cookie | `$_SESSION` と `$_COOKIE` を自分でセットする | `session()`、`cookie()`、`cookieEncrypted()`、`assertSession()`、`assertCookie()` |

`ControllerTestCase` と `testAction()` は引き続きサポートされており、両方のテストを同じテストスイートで
使えます。テストを 1 つずつ移行しても、新しいテストだけを `IntegrationTestTrait` で書いてもかまいません。

統合テストは JavaScript を実行せず、ブラウザーで描画もしません。複数のページにまたがる操作の流れを
本物のブラウザーでテストするには [E2E テスト](/ja/development/e2e-testing) を使ってください。
モデル、ビヘイビア、ライブラリのロジックはユニットテストで確認します。

<a id="migrating-from-testaction"></a>

### testAction() からの移行

同じテストを `ControllerTestCase` と `IntegrationTestTrait` で書くと次のようになります。

```php
// Before: ControllerTestCase
class ArticlesControllerTest extends ControllerTestCase
{
    public function testAdd(): void
    {
        $Articles = $this->generate('Articles', [
            'components' => ['Security' => ['_validatePost']],
        ]);
        $Articles->Security->expects($this->any())
            ->method('_validatePost')
            ->will($this->returnValue(true));

        $this->testAction('/articles/add', [
            'method' => 'post',
            'data' => ['Article' => ['title' => 'New article']],
        ]);

        $this->assertStringContainsString('/articles/view/', $this->headers['Location']);
    }
}
```

```php
// After: IntegrationTestTrait
class ArticlesControllerTest extends CakeTestCase
{
    use IntegrationTestTrait;

    public function testAdd(): void
    {
        $this->enableSecurityToken();

        $this->post('/articles/add', [
            'Article' => ['title' => 'New article'],
        ]);

        $this->assertRedirectContains('/articles/view/');
    }
}
```

新しいテストでは `SecurityComponent` をモックにしません。`enableSecurityToken()` が `FormHelper` で
作ったフォームと同じトークンを追加するので、アプリケーションのトークン検証もあわせてテストされます。

<a id="setting-up"></a>

## セットアップ

テストケースでトレイトを使います。基底クラスには通常 `CakeTestCase` を使います。
`$fixtures` を読み込み、各テストのあとで `Configure` を元に戻してくれるためです。

```php
// tests/TestCase/Controller/ArticlesControllerTest.php
class ArticlesControllerTest extends CakeTestCase
{
    use IntegrationTestTrait;

    /**
     * @var array<string>
     */
    public $fixtures = ['app.article', 'app.user'];

    public function testIndex(): void
    {
        $this->get('/articles');

        $this->assertResponseOk();
        $this->assertResponseContains('<h1>Articles</h1>');
    }
}
```

クラスはフレームワークの Composer classmap でオートロードされるため、
`App::uses('IntegrationTestTrait', 'TestSuite')` と `App::uses('EmailTrait', 'TestSuite')` は
書かなくてもかまいません。

どちらのアプリケーション構成でも使い方は同じで、違うのはテストを置く場所だけです。

- **モダン構成** (`pieceofcake2/app`): テストを `tests/TestCase/Controller/`、フィクスチャを
  `tests/Fixture/` に置き、`vendor/bin/phpunit` または
  `bin/cake test app Controller/ArticlesController` で実行します。
- **レガシー構成** (`app/` ディレクトリ): テストを `app/Test/Case/Controller/`、フィクスチャを
  `app/Test/Fixture/` に置き、`app/Console/cake test app Controller/ArticlesController` で実行します。

どちらの構成でも、フィクスチャ `app.article` は `ArticleFixture` クラスです。
[テストケースの規約](/ja/development/testing#test-case-conventions) と
[テストの実行](/ja/development/testing#running-tests) を参照してください。

リクエストには、アプリケーションのルーティング (`config/routes.php`、レガシー構成では
`app/Config/routes.php`) と `core.php` の設定 (`Security.salt`、`Session`、`Exception.renderer`) が
使われます。URL は、アプリケーションがドキュメントルートにインストールされているものとして
ディスパッチされます。`App.base` は設定しない限り空です。

トレイトの状態 (リクエストの設定、セッションのデータ、レスポンス) は、各テストのあとで `@after`
メソッドがクリアします。`tearDown()` で何かを呼び出す必要はありません。

<a id="making-requests"></a>

## リクエストの送信

次のメソッドはそれぞれリクエストを 1 回ディスパッチし、アサーションのためにレスポンスを保持します。

| メソッド | 説明 |
| --- | --- |
| `get($url)`、`delete($url)`、`head($url)`、`options($url)` | ボディのデータなしでリクエストをディスパッチします。 |
| `post($url, $data = [])`、`put($url, $data = [])`、`patch($url, $data = [])` | データ付きでリクエストをディスパッチします。配列はリクエストデータ (`$this->request->data`)、文字列は生のボディ (`$this->request->input()`) になります。 |
| `resolveUrl($url)` | リクエストする URL を文字列で返します (ルーティング配列には `Router::url()` を使います)。 |

`$url` には次のものを指定できます。

- `/articles/view/1?page=2` のようなパス (クエリ文字列も付けられます)
- `https://example.com/articles` のような完全な URL (ホストと HTTPS もセットされます)
- `['controller' => 'articles', 'action' => 'view', 1]` のようなルーティング配列

データが配列のときは、本物のフォームデータと同じようにスカラー値は文字列に変換されます。
アップロードファイルの形 (`name`、`type`、`tmp_name`、`error`、`size`) をした配列はそのまま渡されます。

```php
public function testEdit(): void
{
    $this->enableSecurityToken();

    $this->put(['controller' => 'articles', 'action' => 'edit', 1], [
        'Article' => ['id' => 1, 'title' => 'Changed'],
    ]);

    $this->assertRedirect(['controller' => 'articles', 'action' => 'index']);
}
```

<a id="setting-up-the-request"></a>

## リクエストの準備

次のメソッドはリクエストの前に呼び出します。設定した内容は各テストのあとでクリアされます。

| メソッド | 説明 |
| --- | --- |
| `configRequest(array $data)` | リクエストの設定をマージします。`headers` (次のリクエストだけで使われます)、`environment` (`HTTP_REFERER` や `REMOTE_ADDR` などの `$_SERVER` の値)、`cookies`、`files` (`$_FILES` の配列)、`input` (生のボディ) を指定できます。 |
| `replaceRequest(array $data)` | リクエストの設定を置き換えます。 |
| `requestAsJson()` | `Accept` と `Content-Type` ヘッダーを `application/json` にします。 |
| `session(array $data)` | 以降の各リクエストの前にセッションへ書き込むデータを指定します。 |
| `cookie(string $name, string $value)` | リクエストの Cookie を追加します。`Name[key]` は `$_COOKIE['Name']['key']` になります。 |
| `cookieEncrypted(string $name, array\|string $value, string\|false $encrypt = 'cipher', ?string $key = null)` | `CookieComponent` と同じ方法で暗号化した Cookie を追加します。 |
| `enableSecurityToken()` | `SecurityComponent` が検証する `_Token` フィールドと CSRF トークンを追加します。 |
| `setUnlockedFields(array $unlockedFields = [])` | `SecurityComponent` のハッシュから除外するフィールドを指定します。 |
| `enableCsrfToken()` | CSRF トークンだけを追加します。 |
| `enableRetainFlashMessages()` | ビューが描画したあとも、フラッシュメッセージをセッションに残します。 |
| `disableErrorHandlerMiddleware()` | エラーページを描画する代わりに、例外をテストに投げます。 |

<a id="headers-and-the-environment"></a>

### ヘッダーと環境変数

```php
public function testApiView(): void
{
    $this->configRequest([
        'headers' => ['Authorization' => 'Bearer secret-token'],
        'environment' => ['REMOTE_ADDR' => '192.0.2.1'],
    ]);
    $this->requestAsJson();

    $this->get('/api/articles/1.json');

    $this->assertResponseOk();
    $this->assertContentType('application/json');
}

public function testApiAdd(): void
{
    $this->requestAsJson();

    $this->post('/api/articles.json', json_encode(['title' => 'From the API']));

    $this->assertResponseCode(201);
    $this->assertHeaderContains('Location', '/api/articles/');
}
```

`headers` の設定は次のリクエストだけに適用されます。そのほかの設定は、テスト内の以降のすべての
リクエストに適用されます。

<a id="session-and-cookies"></a>

### セッションと Cookie

`session()` は、以降の各リクエストの前にセッションへデータを書き込みます。たとえばユーザーを
ログインした状態にできます。

```php
public function testAddRequiresAdmin(): void
{
    $this->session(['Auth' => ['User' => ['id' => 2, 'role' => 'author']]]);

    $this->get('/admin/articles/add');

    $this->assertResponseCode(403);
}
```

`$_SESSION` は同じテスト内のリクエスト間で引き継がれます。そのため、1 回目のリクエストでログインし、
次のリクエストでそのセッションを使うこともできます。セッションは各テストのあとでクリアされます。

`cookie()` は通常の Cookie を追加します。`cookieEncrypted()` は `CookieComponent` の形式で Cookie を
追加します。名前は `CakeCookie[key]` の形になり、配列は JSON にエンコードされ、値は `$encrypt` で
指定したモード (`'cipher'`、`'aes'`、`'rijndael'`、暗号化しない場合は `false`) で暗号化されます。
キーのデフォルトは `Security.salt` です。`CookieComponent` に設定した `type` を渡してください。

```php
public function testRememberMeCookie(): void
{
    $this->cookieEncrypted('CakeCookie[remember]', ['id' => 1], 'aes');

    $this->get('/users/dashboard');

    $this->assertResponseOk();
}
```

<a id="securitycomponent-and-csrf-tokens"></a>

### SecurityComponent と CSRF トークン

`enableSecurityToken()` は、`SecurityComponent` が検証する `_Token` フィールド (`fields`、`unlocked`、
デバッグモードでは `debug`) と CSRF トークンを追加します。フィールドは送信するデータから計算されます。
ちょうどそのフィールドだけを持つフォームに対して `FormHelper::secure()` が計算するのと同じ値です。
トークンは、データがあるリクエストか、GET・HEAD・OPTIONS 以外のメソッドのリクエストに追加されます。
ただし、データが文字列の場合は追加されません。

アプリケーションが `SecurityComponent::$unlockedFields` や `FormHelper::unlockField()` でロックを
解除したフィールドは、ハッシュに含まれません。同じフィールドを `setUnlockedFields()` に渡してください。

```php
public function testAddWithPreview(): void
{
    $this->session(['Auth' => ['User' => ['id' => 1, 'role' => 'admin']]]);
    $this->enableSecurityToken();
    // The controller sets $this->Security->unlockedFields = ['Article.preview'];
    $this->setUnlockedFields(['Article.preview']);

    $this->post('/articles/add', [
        'Article' => ['title' => 'Draft', 'preview' => '1'],
    ]);

    $this->assertResponseOk();
    $this->assertResponseContains('Preview: Draft');
}
```

`enableCsrfToken()` は CSRF トークン (データとセッションの `_Token.key`) だけを追加します。
`SecurityComponent::$validatePost` を無効にし、`csrfCheck` だけを有効にしているアクションで使います。
`enableSecurityToken()` には CSRF トークンも含まれるので、両方を呼び出す必要はありません。

<a id="flash-messages"></a>

### フラッシュメッセージ

フラッシュメッセージは、ビューが描画したときにセッションから削除されます。
`assertFlashMessage()` などのフラッシュメッセージのアサーションを使うには、リクエストの前に
`enableRetainFlashMessages()` を呼び出してメッセージを残しておきます。

```php
public function testAdd(): void
{
    $this->session(['Auth' => ['User' => ['id' => 1, 'role' => 'admin']]]);
    $this->enableSecurityToken();
    $this->enableRetainFlashMessages();

    $this->post('/articles/add', [
        'Article' => ['title' => 'New article', 'body' => 'Body'],
    ]);

    $this->assertRedirectContains('/articles/view/');
    $this->assertFlashMessage('The article has been saved.');
    $this->assertFlashElement('Flash/success');
}
```

<a id="exceptions"></a>

### 例外

リクエストのディスパッチ中に投げられた例外は、本番と同じように `Exception.renderer` の設定
(デフォルトは `ExceptionRenderer`) で描画され、エラーページがレスポンスになります。

```php
public function testViewMissing(): void
{
    $this->get('/articles/view/999');

    $this->assertResponseError();
    $this->assertResponseCode(404);
    $this->assertResponseContains('Article not found');
}
```

例外そのものをテストで受け取るには、`disableErrorHandlerMiddleware()` を呼び出します。CakePHP 2 には
ミドルウェアがありませんが、メソッド名は CakePHP 5 と同じにしています。

```php
public function testViewMissingThrows(): void
{
    $this->disableErrorHandlerMiddleware();
    $this->expectException(NotFoundException::class);

    $this->get('/articles/view/999');
}
```

アプリケーション内で失敗した PHPUnit のアサーション (モックの中など) は、常にテストに投げられます。

<a id="inspecting-the-response"></a>

## レスポンスの確認

アサーションのほかに、次のものを使って直前のリクエストの結果を参照できます。

- `viewVariable(string $name)` はビュー変数を返します。セットされていなければ `null` を返します。
- `$this->_response` は `CakeResponse` です。
- `$this->_controller` はディスパッチされたコントローラーです。コントローラーが生成されなかった場合
  (アセットやリダイレクトのルートなど) は `null` です。
- `$this->_exception` はディスパッチ中に投げられた例外です。エラーページとして描画された場合も
  セットされます。
- `$this->_viewName` と `$this->_layoutName` は、描画されたビューとレイアウトのファイルです。

```php
public function testIndex(): void
{
    $this->get('/articles?page=2');

    $this->assertResponseOk();
    $this->assertCount(10, $this->viewVariable('articles'));
    $this->assertSame('Articles', $this->_controller->name);
}

public function testApiJson(): void
{
    $this->get('/api/articles/1.json');

    $data = json_decode((string)$this->_response->body(), true);
    $this->assertSame('First article', $data['article']['title']);
}
```

<a id="assertions"></a>

## アサーション

どのアサーションも、最後の引数で失敗時のメッセージを指定できます。例外がエラーページとして
描画された場合は、その例外のメッセージとスタックトレースが失敗時のメッセージに追加されます。

| 分類 | アサーション |
| --- | --- |
| ステータス | `assertResponseOk()` (200-204)、`assertResponseSuccess()` (200-308)、`assertResponseError()` (400-429)、`assertResponseFailure()` (500-505)、`assertResponseCode(int $code)` |
| リダイレクト | `assertRedirect($url = null)`、`assertRedirectEquals($url = null)`、`assertRedirectContains(string $url)`、`assertRedirectNotContains(string $url)`、`assertRedirectBackToReferer(?int $code = null)`、`assertNoRedirect()` |
| ヘッダー | `assertHeader(string $header, string $content)`、`assertHeaderContains(string $header, string $content)`、`assertHeaderNotContains(string $header, string $content)`、`assertContentType(string $type)` |
| ボディ | `assertResponseContains(string $content, string $message = '', bool $ignoreCase = false)`、`assertResponseNotContains(...)`、`assertResponseEquals($content)`、`assertResponseNotEquals($content)`、`assertResponseRegExp(string $pattern)`、`assertResponseNotRegExp(string $pattern)`、`assertResponseEmpty()`、`assertResponseNotEmpty()` |
| ビュー | `assertTemplate(string $content)`、`assertLayout(string $content)` |
| セッション | `assertSession($expected, string $path)`、`assertSessionHasKey(string $path)`、`assertSessionNotHasKey(string $path)` |
| フラッシュ | `assertFlashMessage(string $expected, string $key = 'flash')`、`assertFlashMessageAt(int $at, ...)`、`assertFlashMessageContains(string $expected, string $key = 'flash', string $message = '', bool $ignoreCase = false)`、`assertFlashMessageContainsAt(int $at, ...)`、`assertFlashElement(string $expected, string $key = 'flash')`、`assertFlashElementAt(int $at, ...)` |
| Cookie | `assertCookie($expected, string $name)`、`assertCookieIsSet(string $name)`、`assertCookieNotSet(string $cookie)`、`assertCookieEncrypted($expected, string $name, string $encrypt = 'cipher', ?string $key = null)` |
| ファイル | `assertFileResponse(string $expected)` |

引数についての補足です。

- リダイレクト先の URL は絶対 URL として比較され、ルーティング配列も指定できます。URL を指定しない
  `assertRedirect()` は、`Location` ヘッダーがあることだけを確認します。
- `assertContentType()` には `json` のような型の別名も、`application/json` のような MIME タイプも
  指定できます。
- `assertTemplate()` と `assertLayout()` は、描画されたファイルのパスの一部を確認します。たとえば
  `assertTemplate('Articles' . DS . 'index')` のように使います。
- セッションのパスは `Auth.User.id` のような `Hash` のパスです。
- `assertFileResponse()` は `CakeResponse::file()` で送信したファイルを確認します。

```php
public function testLogin(): void
{
    $this->enableSecurityToken();

    $this->post('/users/login', [
        'User' => ['username' => 'mark', 'password' => 'secret', 'remember' => '1'],
    ]);

    $this->assertRedirect('/');
    $this->assertSessionHasKey('Auth.User.id');
    $this->assertCookieEncrypted(['id' => 1], 'CakeCookie[remember]');
}

public function testDownload(): void
{
    $this->get('/articles/download/1');

    $this->assertFileResponse(WWW_ROOT . 'files' . DS . 'article-1.pdf');
    $this->assertHeaderContains('Content-Disposition', 'article-1.pdf');
}
```

<a id="testing-emails"></a>

## メールのテスト

`EmailTrait` を使うと、テスト中はすべての `CakeEmail` が `TestEmailTransport` を使います。この
トランスポートはメールを送信せずに記録し、`assertMail*()` メソッドが記録されたメールを確認します。
統合テストでも、それ以外のテストケースでも使えます。

```php
class UsersControllerTest extends CakeTestCase
{
    use EmailTrait;
    use IntegrationTestTrait;

    /**
     * @var array<string>
     */
    public $fixtures = ['app.user'];

    public function testRegisterSendsWelcomeEmail(): void
    {
        $this->enableSecurityToken();

        $this->post('/users/register', [
            'User' => ['email' => 'alice@example.com', 'username' => 'alice'],
        ]);

        $this->assertRedirect(['controller' => 'users', 'action' => 'thanks']);
        $this->assertMailCount(1);
        $this->assertMailSentTo('alice@example.com');
        $this->assertMailSentFrom('noreply@example.com');
        $this->assertMailSubjectContains('Welcome');
        $this->assertMailContainsText('Hello alice');
        $this->assertMailContainsHtml('<strong>alice</strong>');
        $this->assertMailSentWith('both', 'emailFormat');
        $this->assertMailContainsAttachment('terms.pdf', ['mimetype' => 'application/pdf']);
    }
}
```

| アサーション | 説明 |
| --- | --- |
| `assertMailCount(int $count)`、`assertNoMailSent()` | 送信されたメールの数を確認します。 |
| `assertMailSentTo(string $address)`、`assertMailSentFrom(array\|string $address)` | そのアドレス宛て、またはそのアドレスからメールが送信されたことを確認します。 |
| `assertMailContains(string $contents)`、`assertMailContainsText(string $expected)`、`assertMailContainsHtml(string $contents)` | 本文全体、テキストパート、HTML パートに文字列が含まれることを確認します。 |
| `assertMailSubjectContains(string $contents)` | 件名 (MIME デコード後) に文字列が含まれることを確認します。 |
| `assertMailSentWith(string $expected, string $parameter)` | `CakeEmail` のゲッターがその値を返すことを確認します。たとえば `assertMailSentWith('both', 'emailFormat')` のように使います。 |
| `assertMailContainsAttachment(string $filename, array $file = [])` | そのファイル名 (と設定) の添付ファイルが送信されたことを確認します。 |
| `assertMailSentToAt()`、`assertMailSentFromAt()`、`assertMailSentWithAt()`、`assertMailContainsAt()`、`assertMailContainsTextAt()`、`assertMailContainsHtmlAt()`、`assertMailSubjectContainsAt()` | 1 通のメールについて同じ確認をします。最初の引数 `int $at` は 0 から始まるインデックスです。 |

どのアサーションも、最後の引数で失敗時のメッセージを指定できます。

<a id="testemailtransport-and-overridetransport"></a>

### TestEmailTransport と overrideTransport()

`TestEmailTransport` は `EmailTrait` なしでも使えます。

- `TestEmailTransport::replaceAllTransports()` はすべての `CakeEmail` がテスト用のトランスポートを
  使うようにし、`TestEmailTransport::restoreTransports()` は設定されたトランスポートに戻します。
- `TestEmailTransport::getMessages()` は送信された `CakeEmail` オブジェクトを返し、
  `TestEmailTransport::clearMessages()` はそれを消去します。
- メールの設定に `'transport' => 'TestEmail'` を指定すると、その設定だけでこのトランスポートを
  使います。

`EmailTrait` は、各テストの前に `replaceAllTransports()` を、各テストのあとに `clearMessages()` と
`restoreTransports()` を呼び出します。

`static` CakeEmail::**overrideTransport**($name)

それぞれの `transport` の設定にかかわらず、すべての `CakeEmail` インスタンス (この呼び出しより前に
作成されたものも含みます) がトランスポート `$name` (`'TestEmail'` や `'Debug'` など) を使うようにします。
`null` を渡すと、設定されたトランスポートに戻ります。`TestEmailTransport::replaceAllTransports()` と
`restoreTransports()` はこのメソッドを使っています。

<a id="mocking"></a>

## モック

デフォルトでは何もモックにしませんが、必要な箇所はモックにできます。たとえば外部サービスを呼び出す
モデルのメソッドです。`getMockForModel()` はモックを `ClassRegistry` に登録するので、ディスパッチ
されたコントローラーはそのモックを使います。

```php
public function testPublishCallsApi(): void
{
    $Article = $this->getMockForModel('Article', ['callApi']);
    $Article->expects($this->once())
        ->method('callApi')
        ->willReturn(true);
    $this->enableSecurityToken();

    $this->post('/articles/publish/1');

    $this->assertRedirect(['controller' => 'articles', 'action' => 'index']);
}
```

<a id="differences-from-cakephp-5"></a>

## CakePHP 5 との違い

- **ミドルウェアと `Application` クラスはありません。** リクエストは `Dispatcher`
  (`IntegrationTestDispatcher`) を通るので、ディスパッチャー・フィルターが実行されます。
  `useHttpServer()`、`ContainerStubTrait`、`TestSession` は使えません。
- **`exit` は置き換えられます。** CakePHP 2 は、`Controller::redirect()`、`AuthComponent`、
  `RequestHandlerComponent` (Ajax のリダイレクト)、`AssetDispatcher`、リダイレクトのルート
  (`Router::redirect()`) でレスポンスを送信して `exit` を呼び出します。テストではレスポンス
  (`IntegrationTestResponse`) が送信する代わりに `IntegrationTestStop` を投げます。これにより
  リクエストは同じ位置で終了し、レスポンスが保持されます。
- **スーパーグローバル。** `CakeRequest` や `CookieComponent` などのクラスは `$_GET`、`$_POST`、
  `$_FILES`、`$_COOKIE`、`$_SERVER` を読むため、これらはリクエストのディスパッチ中だけセットされ、
  そのあと元に戻されます。
- **FormProtection と CSRF のミドルウェアの代わりに `SecurityComponent` を使います。**
  `SecurityComponent::$csrfCheck` はデフォルトで有効なので、`enableSecurityToken()` は CSRF トークンも
  追加します。CakePHP 2 には Cookie を使う CSRF トークンがないため、`enableCsrfToken()` に
  `$cookieName` 引数はありません。コントローラーでロックを解除したフィールドは
  `setUnlockedFields()` にも渡す必要があります。
- **エラー** は `Exception.renderer` で描画されます。`disableErrorHandlerMiddleware()` は CakePHP 5 の
  名前のままです。
- **フラッシュメッセージ** は `Message` セッションキーから読み込みます (CakePHP 5 では `Flash`)。
  エレメント名は CakePHP 2 が保存する名前で、`$this->Flash->success()` なら `Flash/success`、
  `SessionComponent::setFlash()` なら `default` です。`$at` に `0` を指定すると最初のメッセージを
  確認します (CakePHP 5 ではすべてのメッセージを確認します)。
- **Cookie** は `CookieComponent` の形式を使います。値は `CakeCookie[...]` という Cookie に入り、
  配列は JSON にエンコードされます。`cookieEncrypted()` と `assertCookieEncrypted()` のデフォルトは
  `CookieComponent` の `cipher` モードです (CakePHP 5 では `aes`)。
- **ヘッダー** は大文字と小文字を区別せずに照合され、複数の値は `, ` で連結されます。`Content-Type` は
  常に参照でき、`CakeResponse::send()` が付けるのと同じ文字セットが含まれます。
- **メール** は `CakeEmail` オブジェクトで、`CakeEmail` のゲッターで値を読みます。件名は
  `assertMailSubjectContains()` の前に MIME デコードされます。`assertMailContainsAttachment()` では
  常にファイル名が一致する必要があります。
- **バックポートしていないもの:** `assertRedirectBack()` (CakePHP 2 にはリクエストの `url` 設定が
  ありません)、`Flash` セッションキーを使うフラッシュメッセージのアサーション、`enableCsrfToken()` の
  `$cookieName` 引数、`MiddlewareDispatcher`。
- **クラス名。** CakePHP 2 には名前空間がないため、制約クラスには `StatusOkConstraint` や
  `MailCountConstraint` のように `Constraint` という接尾辞が付いています。
- **アップロードファイル** としてデータや `configRequest(['files' => ...])` で渡したファイルは、
  本物のアップロードではありません。`is_uploaded_file()` と `move_uploaded_file()` は `false` を返します。

<a id="tips-and-troubleshooting"></a>

## ヒントとトラブルシューティング

- **`redirect()` のあとのコードが実行されない。** `IntegrationTestStop` は、本番で `exit` が
  リクエストを終了するのと同じ位置でリクエストを終了します。そのため、`redirect()` の呼び出しより
  あとのコードと `afterFilter()` は、本番と同じくテストでも実行されません。リダイレクトは
  `assertRedirect()` で確認してください。
- **メッセージは表示されているのにフラッシュメッセージのアサーションが失敗する。** ビューが描画した
  ときにメッセージをセッションから削除しています。リクエストの前に `enableRetainFlashMessages()` を
  呼び出してください。
- **`assertFlashMessage()` がメッセージを見つけられない。** フラッシュメッセージは `Message`
  セッションキーの下に保存され、`$key` のデフォルトは `flash` です。コントローラーが使ったキーを
  渡してください。たとえば `AuthComponent` のメッセージなら `'auth'` です。
- **POST リクエストがブラックホールに送られる (400)。** そのアクションは `SecurityComponent` で
  保護されています。`enableSecurityToken()` を呼び出し、コントローラーがロックを解除するフィールドを
  `setUnlockedFields()` に渡してください。フォームが送信するのと同じフィールドを送信します。
- **単独では成功するテストがテストスイートでは失敗する。** スーパーグローバルは各リクエストのあとで、
  `$_SESSION` は各テストのあとで元に戻りますが、`Configure` を元に戻すのは `CakeTestCase` だけです。
  基底クラスには `CakeTestCase` を使い、ほかの静的な状態をテスト内で変更したときは元に戻してください。
- **例外が 500 のページに隠れてしまう。** アサーションの失敗時のメッセージには、描画された例外の
  メッセージとスタックトレースが含まれます。例外そのものを受け取るには
  `disableErrorHandlerMiddleware()` を呼び出してください。
- **URL が見つからない。** リクエストは、アプリケーションがドキュメントルートにあるものとして、
  アプリケーションのルーティングでディスパッチされます。`resolveUrl()` で URL を確認し、ルーティングの
  変更に追従できるようにルーティング配列を使ってください。
