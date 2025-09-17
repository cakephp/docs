# Middleware

Middleware objects give you the ability to 'wrap' your application in re-usable,
composable layers of Request handling, or response building logic. Visually,
your application ends up at the center, and middleware is wrapped aroud the app
like an onion. Here we can see an application wrapped with Routes, Assets,
Exception Handling and CORS header middleware.

![image](/middleware-setup.png)

When a request is handled by your application it enters from the outermost
middleware. Each middleware can either delegate the request/response to the next
layer, or return a response. Returning a response prevents lower layers from
ever seeing the request. An example of that is the AssetMiddleware handling
a request for a plugin image during development.

![image](/middleware-request.png)

If no middleware take action to handle the request, a controller will be located
and have its action invoked, or an exception will be raised generating an error
page.

Middleware are part of the new HTTP stack in CakePHP that leverages the PSR-7
request and response interfaces. Because CakePHP is leveraging the PSR-7
standard you can use any PSR-7 compatible middleware available on [The Packagist](https://packagist.org).

## Middleware in CakePHP

CakePHP provides several middleware to handle common tasks in web applications:

- `Cake\Error\Middleware\ErrorHandlerMiddleware` traps exceptions from the
  wrapped middleware and renders an error page using the
  [Error & Exception Handling](../development/errors) Exception handler.
- `Cake\Routing\AssetMiddleware` checks whether the request is referring to a
  theme or plugin asset file, such as a CSS, JavaScript or image file stored in
  either a plugin's webroot folder or the corresponding one for a Theme.
- `Cake\Routing\Middleware\RoutingMiddleware` uses the `Router` to parse the
  incoming URL and assign routing parameters to the request.
- `Cake\I18n\Middleware\LocaleSelectorMiddleware` enables automatic language
  switching from the `Accept-Language` header sent by the browser.
- `Cake\Http\Middleware\SecurityHeadersMiddleware` makes it easy to add
  security related headers like `X-Frame-Options` to responses.
- `Cake\Http\Middleware\EncryptedCookieMiddleware` gives you the ability to
  manipulate encrypted cookies in case you need to manipulate cookie with
  obfuscated data.
- `Cake\Http\Middleware\CsrfProtectionMiddleware` adds CSRF protection to your
  application.
- `Cake\Http\Middleware\BodyParserMiddleware` allows you to decode JSON, XML
  and other encoded request bodies based on `Content-Type` header.
- `Cake\Http\Middleware\CspMiddleware` makes it simpler to add
  Content-Security-Policy headers to your application.

<a id="using-middleware"></a>

## Using Middleware

Middleware can be applied to your application globally, or to individual
routing scopes.

To apply middleware to all requests, use the `middleware` method of your
`App\Application` class. If you don't have an `App\Application` class, see
the section on [Adding Http Stack](../development/application#adding-http-stack) for more information. Your application's
`middleware` hook method will be called at the beginning of the request
process, you can use the `MiddlewareQueue` object to attach middleware:

``` php
namespace App;

use Cake\Http\BaseApplication;
use Cake\Error\Middleware\ErrorHandlerMiddleware;

class Application extends BaseApplication
{
    public function middleware($middlewareQueue)
    {
        // Bind the error handler into the middleware queue.
        $middlewareQueue->add(new ErrorHandlerMiddleware());
        return $middlewareQueue;
    }
}
```

In addition to adding to the end of the `MiddlewareQueue` you can do
a variety of operations:

``` php
$layer = new \App\Middleware\CustomMiddleware;

// Added middleware will be last in line.
$middlewareQueue->add($layer);

// Prepended middleware will be first in line.
$middlewareQueue->prepend($layer);

// Insert in a specific slot. If the slot is out of
// bounds, it will be added to the end.
$middlewareQueue->insertAt(2, $layer);

// Insert before another middleware.
// If the named class cannot be found,
// an exception will be raised.
$middlewareQueue->insertBefore(
    'Cake\Error\Middleware\ErrorHandlerMiddleware',
    $layer
);

// Insert after another middleware.
// If the named class cannot be found, the
// middleware will added to the end.
$middlewareQueue->insertAfter(
    'Cake\Error\Middleware\ErrorHandlerMiddleware',
    $layer
);
```

In addition to applying middleware to your entire application, you can apply
middleware to specific sets of routes using
[Scoped Middleware](../development/routing#connecting-scoped-middleware).

### Adding Middleware from Plugins

After the middleware queue has been prepared by the application, the
`Server.buildMiddleware` event is triggered. This event can be useful to add
middleware from plugins. Plugins can register listeners in their bootstrap
scripts, that add middleware:

``` php
// In ContactManager plugin bootstrap.php
use Cake\Event\EventManager;

EventManager::instance()->on(
    'Server.buildMiddleware',
    function ($event, $middlewareQueue) {
        $middlewareQueue->add(new ContactPluginMiddleware());
    });
```

## PSR-7 Requests and Responses

Middleware and the new HTTP stack are built on top of the [PSR-7 Request
& Response Interfaces](https://www.php-fig.org/psr/psr-7/). While all
middleware will be exposed to these interfaces, your controllers, components,
and views will *not*.

### Interacting with Requests

The `RequestInterface` provides methods for interacting with the headers,
method, URI, and body of a request. To interact with the headers, you can:

``` php
// Read a header as text
$value = $request->getHeaderLine('Content-Type');

// Read header as an array
$value = $request->getHeader('Content-Type');

// Read all the headers as an associative array.
$headers = $request->getHeaders();
```

Requests also give access to the cookies and uploaded files they contain:

``` php
// Get an array of cookie values.
$cookies = $request->getCookieParams();

// Get a list of UploadedFile objects
$files = $request->getUploadedFiles();

// Read the file data.
$files[0]->getStream();
$files[0]->getSize();
$files[0]->getClientFileName();

// Move the file.
$files[0]->moveTo($targetPath);
```

Requests contain a URI object, which contains methods for interacting with the
requested URI:

``` php
// Get the URI
$uri = $request->getUri();

// Read data out of the URI.
$path = $uri->getPath();
$query = $uri->getQuery();
$host = $uri->getHost();
```

Lastly, you can interact with a request's 'attributes'. CakePHP uses these
attributes to carry framework specific request parameters. There are a few
important attributes in any request handled by CakePHP:

- `base` contains the base directory for your application if there is one.
- `webroot` contains the webroot directory for your application.
- `params` contains the results of route matching once routing rules have been
  processed.
- `session` contains an instance of CakePHP's `Session` object. See
  [Accessing Session Object](../development/sessions#accessing-session-object) for more information on how to use the session
  object.

### Interacting with Responses

The methods available to create a server response are the same as those
available when interacting with [Httpclient Response Objects](../core-libraries/httpclient#httpclient-response-objects). While the
interface is the same the usage scenarios are different.

When modifying the response, it is important to remember that responses are
**immutable**. You must always remember to store the results of any setter
method. For example:

``` php
// This does *not* modify $response. The new object was not
// assigned to a variable.
$response->withHeader('Content-Type', 'application/json');

// This works!
$newResponse = $response->withHeader('Content-Type', 'application/json');
```

Most often you'll be setting headers and response bodies on requests:

``` php
// Assign headers and a status code
$response = $response->withHeader('Content-Type', 'application/json')
    ->withHeader('Pragma', 'no-cache')
    ->withStatus(422);

// Write to the body
$body = $response->getBody();
$body->write(json_encode(['errno' => $errorCode]));
```

## Creating Middleware

Middleware can either be implemented as anonymous functions (Closures), or as
invokable classes. While Closures are suitable for smaller tasks they make
testing harder, and can create a complicated `Application` class. Middleware
classes in CakePHP have a few conventions:

- Middleware class files should be put in **src/Middleware**. For example:
  **src/Middleware/CorsMiddleware.php**
- Middleware classes should be suffixed with `Middleware`. For example:
  `LinkMiddleware`.
- Middleware are expected to implement the middleware protocol.

While not a formal interface (yet), Middleware do have a soft-interface or
'protocol'. The protocol is as follows:

1.  Middleware must implement `__invoke($request, $response, $next)`.
2.  Middleware must return an object implementing the PSR-7 `ResponseInterface`.

Middleware can return a response either by calling `$next` or by creating
their own response. We can see both options in our simple middleware:

``` php
// In src/Middleware/TrackingCookieMiddleware.php
namespace App\Middleware;

use Cake\Http\Cookie\Cookie;
use Cake\I18n\Time;

class TrackingCookieMiddleware
{
    public function __invoke($request, $response, $next)
    {
        // Calling $next() delegates control to the *next* middleware
        // In your application's queue.
        $response = $next($request, $response);

        // When modifying the response, you should do it
        // *after* calling next.
        if (!$request->getCookie('landing_page')) {
            $expiry = new Time('+ 1 year');
            $response = $response->withCookie(new Cookie(
                'landing_page',
                $request->getRequestTarget(),
                $expiry
            ));
        }
        return $response;
    }
}
```

Now that we've made a very simple middleware, let's attach it to our
application:

``` php
// In src/Application.php
namespace App;

use App\Middleware\TrackingCookieMiddleware;

class Application
{
    public function middleware($middlewareQueue)
    {
        // Add your simple middleware onto the queue
        $middlewareQueue->add(new TrackingCookieMiddleware());

        // Add some more middleware onto the queue

        return $middlewareQueue;
    }
}
```

<a id="routing-middleware"></a>

## Routing Middleware

Routing middleware is responsible for applying your application's routes and
resolving the plugin, controller, and action a request is going to. It can cache
the route collection used in your application to increase startup time. To
enable cached routes, provide the desired [cache configuration](../core-libraries/caching#cache-configuration) as a parameter:

``` php
// In Application.php
public function middleware($middlewareQueue)
{
    // ...
    $middlewareQueue->add(new RoutingMiddleware($this, 'routing'));
}
```

The above would use the `routing` cache engine to store the generated route
collection.

<div class="versionadded">

3.6.0
Route caching was added in 3.6.0

</div>

## Content Security Policy Header Middleware

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

<div class="versionadded">

3.9.0
CspMiddleware was added.

</div>

<a id="security-header-middleware"></a>

## Security Header Middleware

The `SecurityHeaderMiddleware` layer makes it easy to apply security related
headers to your application. Once setup the middleware can apply the following
headers to responses:

- `X-Content-Type-Options`
- `X-Download-Options`
- `X-Frame-Options`
- `X-Permitted-Cross-Domain-Policies`
- `Referrer-Policy`

This middleware is configured using a fluent interface before it is applied to
your application's middleware stack:

``` php
use Cake\Http\Middleware\SecurityHeadersMiddleware;

$securityHeaders = new SecurityHeadersMiddleware();
$securityHeaders
    ->setCrossDomainPolicy()
    ->setReferrerPolicy()
    ->setXFrameOptions()
    ->setXssProtection()
    ->noOpen()
    ->noSniff();

$middlewareQueue->add($securityHeaders);
```

<div class="versionadded">

3.5.0
The `SecurityHeadersMiddleware` was added in 3.5.0

</div>

<a id="encrypted-cookie-middleware"></a>

## Encrypted Cookie Middleware

If your application has cookies that contain data you want to obfuscate and
protect against user tampering, you can use CakePHP's encrypted cookie
middleware to transparently encrypt and decrypt cookie data via middleware.
Cookie data is encrypted with via OpenSSL using AES:

``` php
use Cake\Http\Middleware\EncryptedCookieMiddleware;

$cookies = new EncryptedCookieMiddleware(
    // Names of cookies to protect
    ['secrets', 'protected'],
    Configure::read('Security.cookieKey')
);

$middlewareQueue->add($cookies);
```

> [!NOTE]
> It is recommended that the encryption key you use for cookie data, is used
> *exclusively* for cookie data.

The encryption algorithms and padding style used by the cookie middleware are
backwards compatible with `CookieComponent` from earlier versions of CakePHP.

<div class="versionadded">

3.5.0
The `EncryptedCookieMiddleware` was added in 3.5.0

</div>

<a id="csrf-middleware"></a>

## Cross Site Request Forgery (CSRF) Middleware

CSRF protection can be applied to your entire application, or to specific routing scopes.

> [!NOTE]
> You cannot use both of the following approaches together, you must choose only one.
> If you use both approaches together, a CSRF token mismatch error will occur on every <span class="title-ref">PUT</span> and <span class="title-ref">POST</span> request

> [!WARNING]
> You cannot use `CsrfComponent` together with `CsrfProtectionMiddleware`, the warning about conflicting components is not shown until 3.7.0.

By applying the `CsrfProtectionMiddleware` to your Application middleware stack you protect all the actions in application:

``` php
// in src/Application.php
use Cake\Http\Middleware\CsrfProtectionMiddleware;

public function middleware($middlewareQueue) {
    $options = [
        // ...
    ];
    $csrf = new CsrfProtectionMiddleware($options);

    $middlewareQueue->add($csrf);
    return $middlewareQueue;
}
```

By applying the `CsrfProtectionMiddleware` to routing scopes, you can include or exclude specific route groups:

``` php
// in src/Application.php
use Cake\Http\Middleware\CsrfProtectionMiddleware;

public function routes($routes) {
    $options = [
        // ...
    ];
    $routes->registerMiddleware('csrf', new CsrfProtectionMiddleware($options));
    parent::routes($routes);
}

// in config/routes.php
Router::scope('/', function (RouteBuilder $routes) {
    $routes->applyMiddleware('csrf');
});
```

Options can be passed into the middleware's constructor.
The available configuration options are:

- `cookieName` The name of the cookie to send. Defaults to `csrfToken`.
- `expiry` How long the CSRF token should last. Defaults to browser session.
- `secure` Whether or not the cookie will be set with the Secure flag. That is,
  the cookie will only be set on a HTTPS connection and any attempt over normal HTTP
  will fail. Defaults to `false`.
- `httpOnly` Whether or not the cookie will be set with the HttpOnly flag. Defaults to `false`.
- `field` The form field to check. Defaults to `_csrfToken`. Changing this
  will also require configuring FormHelper.

When enabled, you can access the current CSRF token on the request object:

``` php
$token = $this->request->getParam('_csrfToken');
```

As of 3.8.0 you can also use the whitelisting callback feature for more fine
grained control over URLs for which CSRF token check should be done:

``` php
// in src/Application.php
use Cake\Http\Middleware\CsrfProtectionMiddleware;

public function middleware($middlewareQueue) {
    $csrf = new CsrfProtectionMiddleware();

    // Token check will be skipped when callback returns `true`.
    $csrf->whitelistCallback(function ($request) {
        // Skip token check for API URLs.
        if ($request->getParam('prefix') === 'api') {
            return true;
        }
    });

    // Ensure routing middleware is added to the queue before CSRF protection middleware.
    $middlewareQueue->add($csrf);

    return $middlewareQueue;
}
```

<div class="versionadded">

3.5.0
The `CsrfProtectionMiddleware` was added in 3.5.0

</div>

> [!NOTE]
> You should apply the CSRF protection middleware only for URLs which handle stateful
> requests using cookies/session. Stateless requests, for e.g. when developing an API,
> are not affected by CSRF so the middleware does not need to be applied for those URLs.

### Integration with FormHelper

The `CsrfProtectionMiddleware` integrates seamlessly with `FormHelper`. Each
time you create a form with `FormHelper`, it will insert a hidden field containing
the CSRF token.

> [!NOTE]
> When using CSRF protection you should always start your forms with the
> `FormHelper`. If you do not, you will need to manually create hidden inputs in
> each of your forms.

### CSRF Protection and AJAX Requests

In addition to request data parameters, CSRF tokens can be submitted through
a special `X-CSRF-Token` header. Using a header often makes it easier to
integrate a CSRF token with JavaScript heavy applications, or XML/JSON based API
endpoints.

The CSRF Token can be obtained via the Cookie `csrfToken`.

<a id="body-parser-middleware"></a>

## Body Parser Middleware

If your application accepts JSON, XML or other encoded request bodies, the
`BodyParserMiddleware` will let you decode those requests into an array that
is available via `$request->getParsedBody()` and `$request->getData()`. By
default only `json` bodies will be parsed, but XML parsing can be enabled with
an option. You can also define your own parsers:

``` php
use Cake\Http\Middleware\BodyParserMiddleware;

// only JSON will be parsed.
$bodies = new BodyParserMiddleware();

// Enable XML parsing
$bodies = new BodyParserMiddleware(['xml' => true]);

// Disable JSON parsing
$bodies = new BodyParserMiddleware(['json' => false]);

// Add your own parser matching content-type header values
// to the callable that can parse them.
$bodies = new BodyParserMiddleware();
$bodies->addParser(['text/csv'], function ($body) {
    // Use a CSV parsing library.
    return Csv::parse($body);
});
```

<div class="versionadded">

3.6.0
The `BodyParserMiddleware` was added in 3.6.0

</div>
