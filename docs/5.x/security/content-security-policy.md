# Content Security Policy Middleware

The `CspMiddleware` makes it simpler to add Content-Security-Policy headers in
your application. Before using it you should install `paragonie/csp-builder`:

``` bash
composer require paragonie/csp-builder
```

You can then configure the middleware using an array, or passing in a built
`CSPBuilder` object:

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

If you want to use a more strict CSP configuration, you can enable nonce based
CSP rules with the `scriptNonce` and `styleNonce` options. When enabled
these options will modify your CSP policy and set the `cspScriptNonce` and
`cspStyleNonce` attributes in the request. These attributes are applied to
the `nonce` attribute of all script and CSS link elements created by
`HtmlHelper`. This simplifies the adoption of policies that use
a [nonce-base64](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src)
and `strict-dynamic` for increased security and easier maintenance:

``` php
$policy = [
    // Must exist even if empty to set nonce for for script-src
    'script-src' => [],
    'style-src' => [],
];
// Enable automatic nonce addition to script & CSS link tags.
$csp = new CspMiddleware($policy, [
    'scriptNonce' => true,
    'styleNonce' => true,
]);
$middlewareQueue->add($csp);
```
