CSRF Protection
###############

Cross-Site Request Forgeries (CSRF) are a class of exploit where unauthorized
commands are performed on behalf of an authenticated user without their
knowledge or consent.

CakePHP offers two forms of CSRF protection:

* ``SessionCsrfProtectionMiddleware`` stores CSRF tokens in the session. This
  requires that your application opens the session on every request with
  side-effects. The benefits of session based CSRF tokens is that they are
  scoped to a specific user, and only valid for the duration a session is live.
* ``CsrfProtectionMiddleware`` stores CSRF tokens in a cookie. Using a cookie
  allows CSRF checks to be done without any state on the server. Cookie values
  are verified for authenticity using an HMAC check. However, due to their
  stateless nature, CSRF tokens are re-usable across users and sessions.

.. note::

    You cannot use both of the following approaches together, you must choose
    only one.  If you use both approaches together, a CSRF token mismatch error
    will occur on every `PUT` and `POST` request

.. _csrf-middleware:

Cross Site Request Forgery (CSRF) Middleware
============================================

CSRF protection can be applied to your entire application, or to specific
routing scopes. By applying a CSRF middleware to your Application middleware
stack you protect all the actions in application::

    // in src/Application.php
    // For Cookie based CSRF tokens.
    use Cake\Http\Middleware\CsrfProtectionMiddleware;

    // For Session based CSRF tokens.
    use Cake\Http\Middleware\SessionCsrfProtectionMiddleware;

    public function middleware(MiddlewareQueue $middlewareQueue): MiddlewareQueue
    {
        $options = [
            // ...
        ];
        $csrf = new CsrfProtectionMiddleware($options);
        // or
        $csrf = new SessionCsrfProtectionMiddleware($options);

        $middlewareQueue->add($csrf);
        return $middlewareQueue;
    }

By applying CSRF protection to routing scopes, you can conditionally
apply CSRF to specific groups of routes::

    // in src/Application.php
    use Cake\Http\Middleware\CsrfProtectionMiddleware;

    public function routes(RouteBuilder $routes) : void
    {
        $options = [
            // ...
        ];
        $routes->registerMiddleware('csrf', new CsrfProtectionMiddleware($options));
        parent::routes($routes);
    }

    // in config/routes.php
    $routes->scope('/', function (RouteBuilder $routes) {
        $routes->applyMiddleware('csrf');
    });

Cookie based CSRF middleware options
------------------------------------

The available configuration options are:

- ``cookieName`` The name of the cookie to send. Defaults to ``csrfToken``.
- ``expiry`` How long the CSRF token should last. Defaults to browser session.
- ``secure`` Whether or not the cookie will be set with the Secure flag. That is,
  the cookie will only be set on a HTTPS connection and any attempt over normal HTTP
  will fail. Defaults to ``false``.
- ``httponly`` Whether or not the cookie will be set with the HttpOnly flag.
  Defaults to ``false``. Prior to 4.1.0 use the ``httpOnly`` option.
- ``samesite`` Allows you to declare if your cookie should be restricted to a 
  first-party or same-site context. Possible values are ``Lax``, ``Strict`` and 
  ``None``. Defaults to ``null``.
- ``field`` The form field to check. Defaults to ``_csrfToken``. Changing this
  will also require configuring FormHelper.

Session based CSRF middleware options
-------------------------------------

The available configuration options are:

- ``key`` The session key to use. Defaults to `csrfToken`
- ``field`` The form field to check. Changing this will also require configuring
  FormHelper.


When enabled, you can access the current CSRF token on the request object::

    $token = $this->request->getAttribute('csrfToken');

Should you need to rotate or replace the session CSRF token you can do so with::

    $this->request = SessionCsrfProtectionMiddleware::replaceToken($this->request);

.. versionadded:: 4.5.0
    The ``replaceToken`` method was added.

Skipping CSRF checks for specific actions
-----------------------------------------

Both CSRF middleware implementations allow you to the skip check callback
feature for more fine grained control over URLs for which CSRF token check
should be done::

    // in src/Application.php
    use Cake\Http\Middleware\CsrfProtectionMiddleware;

    public function middleware(MiddlewareQueue $middlewareQueue): MiddlewareQueue
    {
        $csrf = new CsrfProtectionMiddleware();

        // Token check will be skipped when callback returns `true`.
        $csrf->skipCheckCallback(function ($request) {
            // Skip token check for API URLs.
            if ($request->getParam('prefix') === 'Api') {
                return true;
            }
        });

        // Ensure routing middleware is added to the queue before CSRF protection middleware.
        $middlewareQueue->add($csrf);

        return $middlewareQueue;
    }

.. note::

    You should apply the CSRF protection middleware only for routes which handle
    stateful requests using cookies/sessions. For example, when developing an
    API, stateless requests that do not use cookies for authentication are not
    affected by CSRF so the middleware does not need to be applied for those
    routes.

Integration with FormHelper
---------------------------

The ``CsrfProtectionMiddleware`` integrates seamlessly with ``FormHelper``. Each
time you create a form with ``FormHelper``, it will insert a hidden field containing
the CSRF token.

.. note::

    When using CSRF protection you should always start your forms with the
    ``FormHelper``. If you do not, you will need to manually create hidden inputs in
    each of your forms.

CSRF Protection and AJAX Requests
---------------------------------

In addition to request data parameters, CSRF tokens can be submitted through
a special ``X-CSRF-Token`` header. Using a header often makes it easier to
integrate a CSRF token with JavaScript heavy applications, or XML/JSON based API
endpoints.

The CSRF Token can be obtained in JavaScript via the Cookie ``csrfToken``, or in PHP
via the request object attribute named ``csrfToken``. Using the cookie might be easier
when your JavaScript code resides in files separate from the CakePHP view templates,
and when you already have functionality for parsing cookies via JavaScript.

If you have separate JavaScript files but don't want to deal with handling cookies,
you could for example set the token in a global JavaScript variable in your layout, by
defining a script block like this::

    echo $this->Html->scriptBlock(sprintf(
        'var csrfToken = %s;',
        json_encode($this->request->getAttribute('csrfToken'))
    ));

You can then access the token as ``csrfToken`` or ``window.csrfToken`` in any script
file that is loaded after this script block.

Another alternative would be to put the token in a custom meta tag like this::

    echo $this->Html->meta('csrfToken', $this->request->getAttribute('csrfToken'));

which could then be accessed in your scripts by looking for the ``meta`` element with
the name ``csrfToken``, which could be as simple as this when using jQuery::

    var csrfToken = $('meta[name="csrfToken"]').attr('content');

.. meta::
    :title lang=en: CSRF Protection
    :keywords lang=en: security, csrf, cross site request forgery, middleware, session
