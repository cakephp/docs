# コンテンツセキュリティポリシーミドルウェア

`CspMiddleware` を使用すると、Content-Security-Policyヘッダーをアプリケーションに簡単に追加できます。使用する前に `paragonie/csp-builder` をインストールしておく必要があります

``` bash
composer require paragonie/csp-builder
```

次に、配列を使用するか、ビルドされた `CSPBuilder` オブジェクトを渡すことで、ミドルウェアを構成できます。:

``` php
use Cake\Http\Middleware\CspMiddleware;

$csp = new CspMiddleware([
    'script-src' => [
        'allow' => [
            'https://www.google-analytics.com',
        ],
        'self' => true,
        'unsafe-inline' => false,
        'unsafe-eval' => false,
    ],
]);

$middlewareQueue->add($csp);
```

厳密なCSP構成を使用したい場合は、 `scriptNonce` および `styleNonce` オプションを
使用してノンス(ナンス)ベースのCSPルールを有効にできます。
これらのオプションを有効にすると、CSPポリシーが変更され、
リクエストに `cspScriptNonce` 属性と`cspStyleNonce` 属性が設定されます。
これらの属性は、 `HtmlHelper` によって作成されたすべてのスクリプトおよびCSSリンク要素のnonce属性に適用されます。
これにより [nonce-base64](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Content-Security-Policy/script-src) と
`strict-dynamic` を使用するポリシーの採用が簡素化され、セキュリティが強化され、メンテナンスが容易になります。:

``` php
$policy = [
    // script-srcにノンスを設定するには、内容が空の場合でも作成する必要があります
    'script-src' => [],
    'style-src' => [],
];
// スクリプトとCSSリンクタグへのナンス自動追加を有効にします。
$csp = new CspMiddleware($policy, [
    'scriptNonce' => true,
    'styleNonce' => true,
]);
$middlewareQueue->add($csp);
```
