# CSRFプロテクション

クロスサイトリクエストフォージェリ（CSRF）は、
認証されたユーザーの知らないうちに同意なしに
不正なコマンドが実行される
エクスプロイト(攻撃手法)の一種です

CakePHPは、2つの形式のCSRFプロテクションを提供します。:

- `SessionCsrfProtectionMiddleware` は、CSRFトークンをセッションに保存します。
  このため、side-effects(「副作用」と訳されますが、コンピューティング用語としては、
  想定外の動作を起こす可能性を持つあらゆる処理を意味します。エクスプロイトはこれを悪用します)を持つ
  すべてのリクエストでセッションを開く必要があります。
  セッションベースのCSRFトークンの利点は、
  それらが特定のユーザーにスコープされ、
  セッションが有効である間のみ有効であるということです。
- `CsrfProtectionMiddleware` はCSRFトークンをクッキーに保存します。 クッキー values
  クッキーを使用すると、サーバー上にstateがなくてもCSRFチェックを実行できます。
  クッキーの値は、HMACチェックを使用して信頼性が検証されます。
  ただし、ステートレスであるため、CSRFトークンはユーザーとセッション間で再利用できます。

> [!NOTE]
> 両方のアプローチを同時に使用することはできません。
> ひとつだけを選択する必要があります。両方のアプローチを同時に使用すると、
> すべての <span class="title-ref">PUT</span> および <span class="title-ref">POST</span> リクエストでCSRFトークンの不一致エラーが発生します。

## CSRFミドルウェア（クロスサイトリクエストフォージェリミドルウェア）

CSRFプロテクションは、アプリケーション全体、または特定のルーティングスコープに
適用できます。CSRFミドルウェアをアプリケーションミドルウェアスタックに
適用することで、アプリケーション内のすべてのアクションを保護できます。:

``` php
// src/Application.php
// クッキーベースの CSRF トークンの場合
use Cake\Http\Middleware\CsrfProtectionMiddleware;

// セッションベースの CSRF トークンの場合
use Cake\Http\Middleware\SessionCsrfProtectionMiddleware;

public function middleware(MiddlewareQueue $middlewareQueue): MiddlewareQueue
{
    $options = [
        // ...
    ];
    $csrf = new CsrfProtectionMiddleware($options);
    // または
    $csrf = new SessionCsrfProtectionMiddleware($options);

    $middlewareQueue->add($csrf);

    return $middlewareQueue;
}
```

ルーティングスコープにCSRF保護を適用することにより、CSRFを特定のルートグループに条件付きで適用できます。:

``` php
// src/Application.php
use Cake\Http\Middleware\CsrfProtectionMiddleware;
use Cake\Routing\RouteBuilder;

public function routes(RouteBuilder $routes) : void
{
    $options = [
        // ...
    ];
    $routes->registerMiddleware('csrf', new CsrfProtectionMiddleware($options));
    parent::routes($routes);
}

// config/routes.php
$routes->scope('/', function (RouteBuilder $routes) {
    $routes->applyMiddleware('csrf');
});
```

### CookieベースのCSRFミドルウェアオプション

使用可能なオプションは次のとおりです。

- `cookieName` 送信するクッキーの名前。デフォルトは `csrfToken` 。
- `expiry` CSRFトークンの存続期間。デフォルトはブラウザセッションです。
- `secure` クッキーがSecureフラグで設定されるかどうか。
  つまりHTTPS接続が有効なアプリの場合のみ設定されるため、
  HTTP接続の場合は失敗します。デフォルトは `false` です。
- `httponly` クッキーがHttpOnlyフラグで設定されるかどうか。
  デフォルトは `false` です。4.1.0より前では、このhttpOnlyオプションを使用してください。
- `samesite` クッキーをファーストパーティまたは同じサイトのコンテキストに
  制限する必要があるかどうかを宣言できます。
  可能な値は `Lax` ・ `Strict` ・ `None` で、デフォルトは `null` です。
- `field` チェックするフォームフィールド。デフォルトは `_csrfToken` 。
  これを変更するには、FormHelperの構成も必要になります。

### セッションベースのCSRFミドルウェアオプション

使用可能なオプションは次のとおりです。

- `key` 使用するセッションキー。デフォルトは `csrfToken` です。
- `field` チェックするフォームフィールド。これを変更するには、FormHelperの構成も必要になります。

有効にすると、リクエストオブジェクトのCSRFトークンを取得できます。:

``` php
$token = $this->request->getAttribute('csrfToken');
```

### 特定のアクションのCSRFチェックをスキップする

どちらのCSRFミドルウェア実装でも、
チェックコールバック機能をスキップして、
CSRFトークンチェックを実行する必要があるURLを
よりきめ細かく制御できます。:

``` php
// src/Application.php
use Cake\Http\Middleware\CsrfProtectionMiddleware;

public function middleware(MiddlewareQueue $middlewareQueue): MiddlewareQueue
{
    $csrf = new CsrfProtectionMiddleware();

    // コールバックが `true`を返す場合、トークンチェックはスキップされます。
    $csrf->skipCheckCallback(function ($request) {
        // Skip token check for API URLs.
        if ($request->getParam('prefix') === 'Api') {
            return true;
        }
    });

    // CSRF保護ミドルウェアの前にルーティングミドルウェアがキューに追加されていることを確認してください。
    $middlewareQueue->add($csrf);

    return $middlewareQueue;
}
```

> [!NOTE]
> CSRFプロテクションミドルウェアは、クッキーまたはセッションを使用して
> ステートフルリクエストを処理するルートにのみ適用する必要があります。
> たとえば、APIを開発する場合、認証にクッキーを使用しないステートレスリクエストは
> CSRFの影響を受けないため、これらのルートにミドルウェアを適用する必要はありません。

### フォームヘルパーとの統合

`CSRFプロテクションミドルウェア` は `フォームヘルパー` とシームレスに統合されます。
フォームヘルパーを使用して作成したフォームを生成するたびに、CSRFトークンを持つ
hiddenフィールドが挿入されます。

> [!NOTE]
> CSRFプロテクションを使用する場合は `フォームヘルパー` でフォームを作成する必要があります。
> そうでない場合は、hiddenフィールドを手動してください。

### CSRFプロテクションとAJAXリクエスト

リクエストデータパラメータに加えて、CSRFトークンは
特別な `X-CSRF-Token` ヘッダーを介して送信できます。
多くの場合、ヘッダーを使用すると、CSRFトークンを
重めのJavaScriptのアプリケーションまたは
XML / JSONベースのAPIエンドポイントと簡単に統合できます。

CSRFトークンは、JavaScriptでは `csrfToken` クッキーを介して、
PHPでは `csrfToken` という名前のリクエストオブジェクト属性を
介して取得できます。
JavaScriptコードがCakePHPビューテンプレートとは別のファイルにある場合、
およびJavaScriptを介してクッキーを解析する機能がすでにある場合は、
クッキーの使用が簡単になる可能性があります。

個別のJavaScriptファイルがあるが、クッキーの処理をしたくない場合は、
たとえば、次のようなスクリプトブロックを定義することにより、
レイアウトのグローバルJavaScript変数にトークンを設定できます。:

``` php
echo $this->Html->scriptBlock(sprintf(
    'var csrfToken = %s;',
    json_encode($this->request->getAttribute('csrfToken'))
));
```

次に、このスクリプトブロックの後にロードされる任意のスクリプトファイルで、
`csrfToken` または `window.csrfToken` としてトークンに
アクセスできます。

metaタグにトークンを設定する方法もあります。:

``` php
echo $this->Html->meta('csrfToken', $this->request->getAttribute('csrfToken'));
```

`csrfToken` という名前の `metaタグ` を探すことでスクリプトからアクセスできます。
jQueryを使用する場合と同じくらい簡単で

> var csrfToken = \$('meta\[name="csrfToken"\]').attr('content');
