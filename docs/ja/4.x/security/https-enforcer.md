# HTTPSエンフォーサミドルウェア

アプリケーションをHTTPS接続経由でのみ使用できるようにする場合は、
`HttpsEnforcerMiddleware` を使用できます:

``` php
use Cake\Http\Middleware\HttpsEnforcerMiddleware;

// Always raise an exception and never redirect.
$https = new HttpsEnforcerMiddleware([
    'redirect' => false,
]);

// Send a 302 status code when redirecting
$https = new HttpsEnforcerMiddleware([
    'redirect' => true,
    'statusCode' => 302,
]);

// Send additional headers in the redirect response.
$https = new HttpsEnforcerMiddleware([
    'headers' => ['X-Https-Upgrade' => 1],
]);

// Disable HTTPs enforcement when ``debug`` is on.
$https = new HttpsEnforcerMiddleware([
    'disableOnDebug' => true,
]);
```

GETメソッドを使用しない非HTTPリクエストを受信すると、 `BadRequestException` が発生します。
